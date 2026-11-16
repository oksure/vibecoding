# The State of Vibe Coding

바이브 코딩의 역사, 기술, 개념을 총정리하는 살아 있는 책. 서울대학교 데이터사이언스 특강 〈바이브 코딩〉 수업에서 교수와 수강생이 GitHub에서 함께 쓰고, 학기마다 새 판을 낸다.

A living book on the history, art, and concepts of vibe coding, co-written on GitHub by the instructor and students of SNU's Special Topics in Data Science: Vibe Coding, updated every year the course runs.

## 읽기

| | 한국어 (원문) | English (AI-translated) |
|---|---|---|
| 웹 | <https://oksure.github.io/vibecoding/> | <https://oksure.github.io/vibecoding/en/> |
| PDF | [the-state-of-vibe-coding-ko.pdf](https://oksure.github.io/vibecoding/pdf/the-state-of-vibe-coding-ko.pdf) | [the-state-of-vibe-coding-en.pdf](https://oksure.github.io/vibecoding/pdf/the-state-of-vibe-coding-en.pdf) |

## 이 책이 다루는 것

여섯 부, 열여덟 장, 그리고 계속 자라는 개념 사전.

- **제1부 바이브 코딩의 탄생과 역사**
- **제2부 바이브 코딩 실전 A to Z**
- **제3부 바이브 코딩으로 만든 코드, 어떻게 믿을까**
- **제4부 바이브 코딩 시대의 소프트웨어 공학**
- **제5부 바이브 코딩 시대, 배우고 일하는 법**
- **제6부 바이브 코딩의 미래**
- **개념 사전**

전체 대, 중, 소주제 목록은 [TOPICS.md](TOPICS.md)에 있다.

## 웹에서 문장별 피드백 남기기

한국어판과 영어판 웹 페이지에는 [Hypothesis](https://web.hypothes.is/) 주석 기능이 연결되어 있다. 브라우저 확장 프로그램 설치 없이 사용할 수 있다.

1. 읽고 있는 페이지 오른쪽의 Hypothesis 도구 모음을 열고 Hypothesis 계정으로 로그인한다. 계정이 없다면 가입한다.
2. 피드백할 문장을 드래그해서 선택한 뒤 **Annotate**를 누른다.
3. 오른쪽 패널에 댓글을 쓰고 공개 범위를 확인한 뒤 게시한다. 함께 볼 피드백은 **Post to Public**으로 게시한다. 공개 댓글은 누구나 볼 수 있다.
4. 다른 사람의 주석을 누르면 해당 문장과 댓글을 함께 볼 수 있고, 로그인 후 **Reply**로 답글을 달 수 있다.

**Highlight**만 선택한 강조 표시는 본인에게만 보인다. 다른 사람과 피드백을 공유하려면 **Annotate**로 댓글을 남겨야 한다. 수업 참여자끼리만 공유하려면 Hypothesis 비공개 그룹을 만들고 같은 그룹을 선택해 게시한다.

댓글은 Hypothesis에 저장되며 한국어판과 영어판은 각 페이지 주소를 기준으로 구분된다. 원문이 크게 바뀌면 기존 댓글이 해당 문장에 연결되지 않을 수 있으므로, 수정 후 연결 상태를 확인한다. PDF 파일에 이 웹 주석 기능이 삽입되지는 않는다.

사용법과 공개 범위는 [Annotation Basics](https://web.hypothes.is/help/annotation-basics/)와 [Who can see my annotations?](https://web.hypothes.is/help/who-can-see-my-annotations-in-the-web-app/)를 참고한다. 연결 설정은 `ko/_quarto.yml`과 `en/_quarto.yml`의 `format.html.comments.hypothesis`에 있다.

## 수업과 책

이 책은 수업의 산출물이면서 동시에 수업 그 자체다.

- **세미나형 운영.** 교수 강의는 전체의 3분의 1 이하. 나머지는 학생 조사, 발표, 토론이다.
- **티칭 팀이 목차를 잡고, 학생이 꼭지를 고른다.** [TOPICS.md](TOPICS.md)의 꼭지를 선착순 self-select 한다. 담당 꼭지에 자기 이름을 적는 PR이 이 수업의 첫 PR이다. 꼭지마다 브리프(다룰 것, 시드 질문, 조사 포인터)가 준비되어 있다.
- **꼭지 하나 = 파일 하나.** 담당자는 조사해서 수업에서 발표하고, 토론을 반영해 자기 파일을 쓴다. 다른 사람의 파일은 PR 리뷰로만 관여한다.
- **집필은 GitHub에서.** 브랜치, PR, 동료 리뷰. 책을 쓰는 과정 자체가 AI 시대 협업의 실습이다.
- **매년 새 판.** 다음 학기가 열리면 그 학기의 수강생이 이전 판을 이어받아 갱신한다. 그래서 제목이 "The State of" Vibe Coding이다.

운영 상세는 [SYLLABUS.md](SYLLABUS.md), 기여 방법은 [CONTRIBUTING.md](CONTRIBUTING.md)를 보라.

## 집필 지침

학생과 집필을 돕는 AI는 [집필 문서 안내](docs/README.md)에서 작업 순서를 확인한다.

| 문서 | 역할 |
| --- | --- |
| [CONTRIBUTING.md](CONTRIBUTING.md) | 담당 파일, 원문 언어와 PR 제출 절차 |
| [WRITING_STYLE.md](docs/WRITING_STYLE.md) | 문체, 출처 표기, 검증과 리뷰의 공통 집필 기준 |
| [AI_PROSE_CHECKLIST.md](docs/AI_PROSE_CHECKLIST.md) | 초안 제출 전 자기 점검과 이후 문체 편집에 쓰는 참고 목록 |
| [AGENTS.md](AGENTS.md) | AI의 수정 범위와 공통 작업 지침 |
| [CLAUDE.md](CLAUDE.md) | 공통 에이전트 지침을 불러오는 파일 |

초안은 WRITING_STYLE.md를 기준으로 작성하고 AI_PROSE_CHECKLIST.md를 참고해 스스로 점검한 뒤 PR로 공유한다. 장 단위 내용 정리와 문체 편집은 이후에도 이어가며, 저자의 주장이나 해석이 바뀌는 수정은 해당 저자의 확인을 받는다.

## 언어 정책

- **한국어판(`ko/`)이 1차 원문**이고, 영어판(`en/`)은 AI가 자동 번역한다(`tools/translate`).
- 영어가 더 편한 저자가 맡은 장은 예외다. 챕터 머리의 `authoritative-lang: en`을 바꾸고 `en/`쪽 파일을 직접 쓰면, 한국어판이 번역본이 된다.
- 번역 생성물에는 `MACHINE-TRANSLATED` 마커가 붙는다. 이 파일은 직접 고치지 않는다. 원문을 고치고 번역을 다시 돌린다.

## 리포 구조

```
TOPICS.md        꼭지 목록 + 담당 현황 (self-select 게시판)
AGENTS.md        AI 공통 작업 지침
CLAUDE.md        AGENTS.md를 불러오는 파일
CONTRIBUTING.md  기여와 PR 제출 절차
docs/
  README.md              집필 문서 안내
  WRITING_STYLE.md       공통 집필 기준
  AI_PROSE_CHECKLIST.md  자기 점검과 문체 편집 참고 목록
ko/              한국어판 (Quarto book, 기본 원문)
  chapters/      중주제: 중주제를 맡은 팀이 담당하여 집필
  sections/      소주제: 소주제를 맡은 팀원이 담당하여 집필
  glossary/      개념사전
en/              영어판 - 동일한 구조로 구성
tools/
  build          웹(HTML) + PDF(Typst) 빌드, _site/ 조립
  translate      ko <-> en AI 번역 (변경된 파일만, -j 병렬)
  new-section    새 꼭지 스캐폴드
  new-chapter    새 챕터 스캐폴드
.github/         CI: push마다 빌드해서 GitHub Pages로 배포
```

## 로컬 빌드

[Quarto](https://quarto.org) 1.8 이상과 Python(PyYAML)이 필요하다. PDF까지 빌드하려면 Noto Sans CJK 폰트가 있어야 한다.

```bash
tools/build html ko    # 한국어 웹판만 (집필 중 확인용, 가장 빠름)
tools/build            # 전체: ko+en HTML/PDF -> _site/
tools/translate        # 변경된 챕터만 AI 번역 (claude CLI 필요)
```

`ko/`에서 `quarto preview`를 실행하면 실시간 미리보기가 뜬다.

## 라이선스

본문은 [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/), `tools/`의 코드는 MIT. [LICENSE.md](LICENSE.md) 참고.
