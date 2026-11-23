"""Regression checks for image paths after section files are concatenated."""
import tempfile
import unittest
from pathlib import Path

from _pdf_assemble import stage_images


class ImageStagingTests(unittest.TestCase):
    def test_root_and_section_images_keep_distinct_paths(self):
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp)
            src, out = root / "ko", root / "pdf"
            for rel, data in [("images/chart.png", b"root"),
                              ("sections/images/chart.png", b"section")]:
                image = src / rel
                image.parent.mkdir(parents=True, exist_ok=True)
                image.write_bytes(data)
            text = "![one](images/chart.png)\n![two](/images/chart.png)\n"
            result = stage_images(text, src / "sections/topic.qmd", src, out)
            self.assertIn("![one](sections/images/chart.png)", result)
            self.assertIn("![two](images/chart.png)", result)
            self.assertEqual((out / "sections/images/chart.png").read_bytes(), b"section")
            self.assertEqual((out / "images/chart.png").read_bytes(), b"root")

    def test_source_is_used_for_included_files_and_parent_paths(self):
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp)
            src, out = root / "ko", root / "pdf"
            (src / "images").mkdir(parents=True)
            (src / "images/a b.png").write_bytes(b"image")
            text = "![caption with [source](https://example.test)](../images/a%20b.png){#fig-example}\n"
            result = stage_images(text, src / "sections/part.qmd", src, out)
            self.assertEqual(result, text.replace("../images/", "images/"))
            self.assertEqual((out / "images/a b.png").read_bytes(), b"image")

    def test_examples_and_commented_figures_are_not_resources(self):
        text = ("```markdown\n![example](images/missing.png)\n```\n"
                "~~~markdown\n![example](images/missing.png)\n~~~\n"
                "<!-- Retained for later restoration.\n![figure](images/missing.png)\n-->\n"
                "    ![indented code](images/missing.png)\n")
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp)
            self.assertEqual(stage_images(text, root / "part.qmd", root, root / "pdf"), text)

    def test_missing_resource_names_the_manuscript(self):
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp)
            with self.assertRaisesRegex(FileNotFoundError, "sections/topic.qmd: missing image images/missing.png"):
                stage_images("![figure](images/missing.png)", root / "sections/topic.qmd", root, root / "pdf")


if __name__ == "__main__":
    unittest.main()
