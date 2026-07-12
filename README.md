# The State of Vibe Coding

바이브 코딩의 역사, 기술, 개념을 총정리하는 살아 있는 책. 서울대학교 데이터사이언스 특강 〈바이브 코딩〉 수업에서 교수와 수강생이 GitHub에서 함께 쓰고, 학기마다 새 판을 낸다.

A living book on the history, art, and concepts of vibe coding, co-written on GitHub by the instructor and students of SNU's Special Topics in Data Science: Vibe Coding, updated every year the course runs.

## 읽기

| | 한국어 (원문) | English (AI-translated) |
|---|---|---|
| 웹 | <https://oksure.github.io/vibecoding/> | <https://oksure.github.io/vibecoding/en/> |
| PDF | [the-state-of-vibe-coding-ko.pdf](https://oksure.github.io/vibecoding/pdf/the-state-of-vibe-coding-ko.pdf) | [the-state-of-vibe-coding-en.pdf](https://oksure.github.io/vibecoding/pdf/the-state-of-vibe-coding-en.pdf) |

## 이 책이 다루는 것

다섯 부, 열네 장, 그리고 계속 자라는 개념 사전.

- **제1부 역사**: 자연어 프로그래밍이라는 오래된 꿈부터 프롬프트 엔지니어링(전사), 바이브 코딩의 탄생, CHOP·컨텍스트 엔지니어링·스펙 주도 개발·루프 엔지니어링·하네스 엔지니어링으로 이어지는 담론의 진화까지
- **제2부 기술**: 기회와 포텐셜, 베스트 프랙티스, 아티팩트 유형별 실전(글·데이터 분석·웹 앱·자동화·조판), 콘텐츠 생성(이미지·비디오·파이프라인)
- **제3부 원리와 한계**: 작동 원리, 그리고 블랙박스가 되어가는 코드베이스·보안·품질 부채·주니어의 역설·책임 문제
- **제4부 소프트웨어 엔지니어링의 재발견**: 지난 50년의 SE 개념들(폭포수와 애자일, 페어 프로그래밍, 코드 리뷰, TDD, Parnas의 정보 은닉, 기술 부채, Conway의 법칙, No Silver Bullet, Mythical Man-Month, 버전 관리, CI/CD, 문서화, 오픈소스)이 AI 시대에 다시 발견되는 과정
- **제5부 공부와 일**: AI가 우리가 배우고 일하는 방식을 바꾸는 모든 것
- **개념 사전**: 바이브 코딩 주변에서 태어나고 진화하는 개념 20여 항목. 매년 가장 많이 자라는 부록

전체 꼭지 목록은 [TOPICS.md](TOPICS.md)에 있다. 섹션 57개 + 개념 사전 20개, 모두 한 사람이 하나씩 맡을 수 있는 단위다.

## 수업과 책

이 책은 수업의 산출물이면서 동시에 수업 그 자체다.

- **세미나형 운영.** 교수 강의는 전체의 3분의 1 이하. 나머지는 학생 조사, 발표, 토론이다.
- **티칭 팀이 목차를 잡고, 학생이 꼭지를 고른다.** [TOPICS.md](TOPICS.md)의 꼭지를 선착순 self-select 한다. 담당 꼭지에 자기 이름을 적는 PR이 이 수업의 첫 PR이다. 꼭지마다 브리프(다룰 것, 시드 질문, 조사 포인터)가 준비되어 있다.
- **꼭지 하나 = 파일 하나.** 담당자는 조사해서 수업에서 발표하고, 토론을 반영해 자기 파일을 쓴다. 다른 사람의 파일은 PR 리뷰로만 관여한다.
- **집필은 GitHub에서.** 브랜치, PR, 동료 리뷰. 책을 쓰는 과정 자체가 AI 시대 협업의 실습이다.
- **매년 새 판.** 다음 학기가 열리면 그 학기의 수강생이 이전 판을 이어받아 갱신한다. 그래서 제목이 "The State of" Vibe Coding이다.

운영 상세는 [SYLLABUS.md](SYLLABUS.md), 기여 방법은 [CONTRIBUTING.md](CONTRIBUTING.md)를 보라.

## 언어 정책

- **한국어판(`ko/`)이 1차 원문**이고, 영어판(`en/`)은 AI가 자동 번역한다(`tools/translate`).
- 영어가 더 편한 저자가 맡은 장은 예외다. 챕터 머리의 `authoritative-lang: en`을 바꾸고 `en/`쪽 파일을 직접 쓰면, 한국어판이 번역본이 된다.
- 번역 생성물에는 `MACHINE-TRANSLATED` 마커가 붙는다. 이 파일은 직접 고치지 않는다. 원문을 고치고 번역을 다시 돌린다.

## 리포 구조

```
TOPICS.md        꼭지 목록 + 담당 현황 (self-select 게시판)
ko/              한국어판 (Quarto book, 기본 원문)
  chapters/      챕터 = 리드 문단 + 섹션 include 래퍼
  sections/      꼭지 파일 (섹션 하나 = 파일 하나 = 담당자 한 명)
  glossary/      개념 사전 항목 파일
en/              영어판 (같은 구조, 대부분 AI 번역 생성물)
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
