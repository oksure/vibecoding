# CLAUDE.md — AI 에이전트 작업 지침

이 저장소는 책 "The State of Vibe Coding"의 원고와 빌드 도구다. AI 코딩 에이전트(Claude Code 등)로 작업할 때 다음을 지켜라.

## 구조

- `ko/` = 한국어판 Quarto book, **1차 원문**. `en/` = 영어판, 대부분 AI 번역 생성물.
- 집필 단위 = 꼭지: `ko/sections/NN-M-slug.qmd`(섹션)와 `ko/glossary/slug.qmd`(개념 사전). 목록·담당은 루트 `TOPICS.md`.
- 챕터 파일(`ko/chapters/`)은 리드 문단 + `{{< include ../sections/... >}}` 래퍼다. 본문은 섹션 파일에 쓴다.
- **섹션·사전 파일에는 YAML frontmatter 금지** (include되므로 깨진다). 첫 줄은 `<!-- authoritative-lang: ko -->` 주석. 챕터 파일은 frontmatter를 쓴다.
- `en/`에서 파일 상단에 `MACHINE-TRANSLATED` 마커가 있는 파일은 **절대 직접 수정 금지**. 원문(`ko/`)을 고치고 `tools/translate`를 실행한다.
- 꼭지 원문 언어는 `authoritative-lang` 태그(기본 `ko`)가 결정한다.
- 챕터 추가·삭제 시 `ko/_quarto.yml`과 `en/_quarto.yml` **두 곳 모두** 갱신 (불일치 시 `tools/build`가 에러). 섹션 추가는 챕터 파일의 include와 TOPICS.md 갱신.

## 명령

```bash
tools/build html ko    # 빠른 확인용 (한국어 웹판만)
tools/build            # 전체 빌드: HTML+PDF ko/en -> _site/
tools/translate        # 변경된 챕터만 AI 번역 (claude CLI)
tools/new-chapter 11-slug "제목"   # 새 챕터 스캐폴드
```

편집 후에는 최소한 `tools/build html ko`가 통과하는지 확인하고 커밋한다.

## 문체 (책 본문)

- 담백하고 건조한 한국어. 과장, 감탄, 홍보 문구, 수사적 대구 금지.
- 긴 대시(em dash, U+2014) 남발 금지 (인용문 예외). 쉼표·마침표·괄호로 쓴다.
- 사실(날짜·수치·인물·인용)은 1차 출처 확인 후 링크. 확인 못 하면 쓰지 않는다.
- 렌더 문법: Quarto markdown (`.qmd`). 콜아웃 블록 `:::` 짝 맞추기, 앵커 `{#sec-*}` 유지.

## 수업 맥락

서울대 데이터사이언스 특강 〈바이브 코딩〉의 공동 집필 프로젝트다. 챕터 스텁의 "집필 상태" 콜아웃과 담당자 표기는 수업 운영 장치이므로 임의로 지우지 않는다. 상세: README.md, SYLLABUS.md, CONTRIBUTING.md.
