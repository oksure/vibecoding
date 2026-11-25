# The State of Vibe Coding

바이브 코딩의 역사, 기술, 개념을 총정리하는 살아 있는 책. 서울대학교 데이터사이언스 특강 〈바이브 코딩〉 수업에서 교수와 수강생이 GitHub에서 함께 쓰고, 학기마다 새 판을 낸다.

A living book on the history, art, and concepts of vibe coding, co-written on GitHub by the instructor and students of SNU's Special Topics in Data Science: Vibe Coding, updated every year the course runs.

## 읽기

| | 한국어 (원문) | English (AI-translated) |
|---|---|---|
| 웹 | <https://oksure.github.io/vibecoding/> | [같은 페이지에서 EN 선택](https://oksure.github.io/vibecoding/) |
| PDF | [the-state-of-vibe-coding-ko.pdf](https://oksure.github.io/vibecoding/pdf/the-state-of-vibe-coding-ko.pdf) | [the-state-of-vibe-coding-en.pdf](https://oksure.github.io/vibecoding/pdf/the-state-of-vibe-coding-en.pdf) |

한국어 웹 페이지 오른쪽 아래의 **KO / EN**에서 **EN**을 누르면, 배포 전에 준비한 영어 번역을 즉시 표시한다. 주소와 링크, 코드 블록은 유지하며 **KO**로 원문을 복원한다. 같은 브라우저에서 다른 글로 이동하거나 다시 방문하면 선택한 언어를 이어 간다. 방문자의 브라우저에서 번역 모델을 실행하거나 내려받지 않는다.

웹 토글용 영어는 한국어 원문과 대조해 직접 작성한 번역을 저장해 사용한다. 배포 과정이나 방문자의 브라우저에서 번역 모델을 실행하거나 번역 API를 호출하지 않는다.

### 번역 갱신과 배포

- 본문 번역은 `translations/reviewed.ko-en.json`, 목차·제목·공통 문구는 `translations/glossary.ko-en.json`에 저장한다. 키는 원문의 정확한 문구이며, 원문이 바뀌면 해당 번역도 갱신해야 한다.
- 배포는 저장된 영어를 한국어 HTML에 연결한다. 같은 글의 일반판과 리뷰판은 같은 번역을 사용한다. EN을 누르면 즉시 전환되며 KO로 원문을 복원한다.
- 문단 전체를 하나의 단위로 연결해 강조나 링크 사이에서 문장이 잘리거나 반복되는 일을 막는다. 원래 링크, 인라인 코드, 실행 코드 블록과 제목 바로가기를 보존한다. 자연어 프롬프트나 명세를 담은 `text` 예시 블록은 함께 번역한다.
- 직접 번역한 순서도는 `translations/diagrams.ko-en.json`의 원문·영문과 미리 만든 SVG를 연결해 즉시 전환한다. 원문 그래프가 바뀌면 새 번역을 검토할 때까지 해당 페이지의 EN을 대기 상태로 둔다. 스크린샷 속 글자는 원본 이미지로 유지한다.
- PR에서는 원고 빌드(`build`)와 영어 준비 상태(`English translation readiness`)를 별도로 검사한다. 영어가 없는 원고도 한국어 검사와 게시를 진행한다. 번역을 기다리는 글은 한국어로 게시하고 EN만 비활성화한다. 번역이 준비된 글의 EN은 계속 사용할 수 있다.
- EN 준비 여부는 해당 글의 본문을 기준으로 판단한다. 공통 목차에 새 제목의 번역이 없으면 그 제목만 원문으로 유지하며, 이미 번역된 다른 글의 EN을 잠그지 않는다.
- 번역 누락은 Actions 실행 요약과 `translation-backlog` 첨부 파일에 기록한다. 첨부 JSON에는 번역할 정확한 원문과 영향을 받는 일반판·리뷰판 경로가 들어 있다. PR 댓글이나 알림 메시지를 자동으로 작성하지 않는다.
- 저장된 번역의 절 번호·날짜·주요 인명과 도구명·인라인 표시가 손상되면 오류로 처리한다. 번역이 없는 경우와 손상된 번역을 구분하며, 이 검사는 의미 검수를 대체하지 않는다.
- 수강생은 원문만 작성해 PR을 제출한다. 웹 영어 번역의 추가·갱신은 티칭 팀이 요청에 따라 별도로 처리한다. PR 접수나 배포 시 번역 모델과 번역 API를 호출하지 않는다.

로컬에서는 `npm ci`, `tools/build`, `npm run translate:web -- --allow-missing --report translation-backlog.json`을 차례로 실행한다. `node tools/pretranslate.mjs --check --allow-missing`은 영어가 준비된 글과 한국어로 게시할 글을 함께 확인한다. `--allow-missing` 없이 실행하면 기존처럼 모든 번역이 있어야 통과하므로, 전체 번역 완료를 점검할 때 쓴다. `--plan`은 HTML을 수정하지 않고 번역 누락 현황을 확인한다. `npm test`는 원문과 번역의 대응, KO/EN 복원, 문단과 링크·코드 보존, 번역 대기 상태를 검사한다.

기존 `/en/` 페이지와 영문 PDF는 `en/` 원고를 사용하는 별도 판으로 유지한다. 그 원고의 번역 도구인 `tools/translate`와 웹 읽기용 사전 번역 도구인 `tools/pretranslate.mjs`는 구분한다.

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

일반 읽기 페이지와 피드백용 리뷰 페이지는 주소가 분리되어 있다. [한국어 리뷰](https://oksure.github.io/vibecoding/reviews/)와 [영어 리뷰](https://oksure.github.io/vibecoding/reviews/en/)에서만 [Hypothesis](https://web.hypothes.is/) 주석 기능을 사용할 수 있다. 일반 `/vibecoding/` 및 `/vibecoding/en/` 페이지에는 이 기능이 없다.

예를 들어 `/vibecoding/sections/03-3-context-engineering.html`의 리뷰 주소는 `/vibecoding/reviews/sections/03-3-context-engineering.html`이다. 리뷰 목차와 이전·다음 글 링크도 리뷰 페이지 안에서 이동한다. 두 버전은 같은 원고에서 자동 생성되므로 원고를 따로 관리하지 않는다.

1. 리뷰 페이지를 연 뒤 오른쪽의 Hypothesis 도구 모음에서 Hypothesis 계정으로 로그인한다. 계정이 없다면 가입한다. 브라우저 확장 프로그램은 필요하지 않다.
2. 피드백할 문장을 드래그해서 선택한 뒤 **Annotate**를 누른다.
3. 오른쪽 패널에 댓글을 쓰고 공개 범위를 확인한 뒤 게시한다. 함께 볼 피드백은 **Post to Public**으로 게시한다. 공개 댓글은 누구나 볼 수 있다.
4. 다른 사람의 주석을 누르면 해당 문장과 댓글을 함께 볼 수 있고, 로그인 후 **Reply**로 답글을 달 수 있다.

**Highlight**만 선택한 강조 표시는 본인에게만 보인다. 다른 사람과 피드백을 공유하려면 **Annotate**로 댓글을 남겨야 한다. 수업 참여자끼리만 공유하려면 Hypothesis 비공개 그룹을 만들고 같은 그룹을 선택해 게시한다.

댓글은 Hypothesis에 저장되며 한국어판과 영어판은 각 페이지 주소를 기준으로 구분된다. 원문이 크게 바뀌면 기존 댓글이 해당 문장에 연결되지 않을 수 있으므로, 수정 후 연결 상태를 확인한다. PDF 파일에 이 웹 주석 기능이 삽입되지는 않는다.

사용법과 공개 범위는 [Annotation Basics](https://web.hypothes.is/help/annotation-basics/)와 [Who can see my annotations?](https://web.hypothes.is/help/who-can-see-my-annotations-in-the-web-app/)를 참고한다. 리뷰 페이지 생성과 Hypothesis 연결 설정은 `tools/_review_prepare.py`에 있다. 일반 페이지에서 작성했던 주석은 Hypothesis에 남으며 새 리뷰 주소로 자동 이동하지 않는다.

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
tools/build html ko    # 한국어 일반 읽기판 + 리뷰판 HTML
tools/build reviews ko # 한국어 리뷰판 HTML만
tools/build            # 전체: ko+en HTML/PDF -> _site/
tools/translate        # 변경된 챕터만 AI 번역 (claude CLI 필요)
```

`ko/`에서 `quarto preview`를 실행하면 실시간 미리보기가 뜬다.

## 라이선스

본문은 [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/), `tools/`의 코드는 MIT. [LICENSE.md](LICENSE.md) 참고.
