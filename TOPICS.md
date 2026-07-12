# 꼭지 목록 (Self-Select 게시판)

이 책의 모든 집필 단위(꼭지) 목록이다. 수강생은 여기서 **본 꼭지 1개를 골라 자기 이름을 적는 PR**을 올린다. 그것이 이 수업의 첫 PR이다.

## 규칙

- **선착순 self-select.** 담당 칸이 비어 있으면 누구나 가져갈 수 있다. PR이 먼저 머지된 사람이 담당자다.
- 본 꼭지는 **섹션(§)** 중에서 고른다. **개념 사전(G)** 항목은 부담이 가벼운 추가 기여(가산점)로, 본 꼭지와 별개로 가져갈 수 있다.
- 꼭지마다 파일이 하나다 (`ko/sections/...` 또는 `ko/glossary/...`). 남의 파일은 PR 리뷰로만 건드린다.
- 각 파일 안에 브리프(다룰 것), 시드 질문, 조사 포인터가 들어 있다. 방향이 다르다고 판단되면 수업에서 논증하고 바꿔라. 목차는 티칭 팀 초안일 뿐이다.
- 상태는 담당자가 직접 갱신한다: `미배정` → `조사 중` → `초안` → `리뷰 반영` → `완료`.

## 제1부 · 바이브 코딩의 역사

### 1장 전사(前史): 사람이 기계에게 말 걸어온 역사

| # | 꼭지 | 파일 | 방향 한 줄 | 담당 | 상태 |
|---|---|---|---|---|---|
| §1.1 | 자연어 프로그래밍이라는 오래된 꿈 | `sections/01-1-natural-language-dream.qmd` | COBOL의 "영어처럼"부터 4GL, CASE까지, 반복돼온 약속과 좌절의 역사 | | 미배정 |
| §1.2 | 엔드유저 프로그래밍: 스프레드시트라는 선례 | `sections/01-2-end-user-programming.qmd` | 비프로그래머가 프로그래밍하는 시대는 이미 있었다. 스프레드시트에서 배우는 교훈 | | 미배정 |
| §1.3 | 프롬프트 엔지니어링의 짧은 전성기 | `sections/01-3-prompt-engineering.qmd` | GPT-3 이후 기법의 발견(few-shot, CoT), 직함의 탄생과 소멸 | | 미배정 |

### 2장 탄생

| # | 꼭지 | 파일 | 방향 한 줄 | 담당 | 상태 |
|---|---|---|---|---|---|
| §2.1 | Karpathy의 트윗과 그 순간의 조건 | `sections/02-1-karpathy-moment.qmd` | 2025-02 원문 해부, 왜 하필 그때였나 (모델·도구·분위기) | | 미배정 |
| §2.2 | 용어의 확산과 뜻의 표류 | `sections/02-2-semantic-drift.qmd` | Willison의 구분, Collins 올해의 단어, 좁은 뜻과 넓은 뜻의 공존 | | 미배정 |
| §2.3 | 도구의 계보: 자동완성에서 에이전트까지 | `sections/02-3-tool-genealogy.qmd` | Copilot(2021)→챗→에이전트형 CLI/IDE, 도구 형태가 방법론을 규정해온 과정 | | 미배정 |

### 3장 담론의 진화

| # | 꼭지 | 파일 | 방향 한 줄 | 담당 | 상태 |
|---|---|---|---|---|---|
| §3.1 | CHOP과 에이전틱 코딩: 자율성의 스펙트럼 | `sections/03-1-chop-agentic.qmd` | Yegge의 chat-oriented programming부터 에이전트 자율성 단계론까지 | | 미배정 |
| §3.2 | 컨텍스트 엔지니어링 | `sections/03-2-context-engineering.qmd` | Lütke(2025-06)의 명명, Karpathy의 정식화, "무엇을 보여줄 것인가"로의 병목 이동 | | 미배정 |
| §3.3 | 스펙 주도 개발 | `sections/03-3-spec-driven.qmd` | GitHub Spec Kit(2025-09) 등, 바이브의 반작용으로서의 명세 우선 | | 미배정 |
| §3.4 | 루프 엔지니어링과 하네스 엔지니어링 | `sections/03-4-loop-harness.qmd` | 2026년의 후계 개념들: 루프 설계(Osmani), Agent = Model + Harness | | 미배정 |
| §3.5 | 바이브 엔지니어링과 그 반작용들 | `sections/03-5-vibe-engineering.qmd` | Willison의 vibe engineering, "책임지는 가속"이라는 재정의 시도들 | | 미배정 |
| §3.6 | 개념 시장의 관찰: 다음 유행어는 어떻게 만들어지는가 | `sections/03-6-concept-market.qmd` | 용어들의 탄생-확산-소멸 패턴 자체를 메타 분석 (병목 이동 가설) | | 미배정 |

## 제2부 · 바이브 코딩의 기술

### 4장 기회와 포텐셜

| # | 꼭지 | 파일 | 방향 한 줄 | 담당 | 상태 |
|---|---|---|---|---|---|
| §4.1 | 누구에게 어떤 문이 열렸나 | `sections/04-1-who-gets-in.qmd` | 비전공자, 도메인 전문가, 1인 창업자, 연구자별 사례와 한계 | | 미배정 |
| §4.2 | 1인용 소프트웨어, 일회용 소프트웨어 | `sections/04-2-personal-software.qmd` | 맞춤 소프트웨어의 한계비용 붕괴가 만드는 새 카테고리 | | 미배정 |
| §4.3 | 프로토타이핑의 경제학 | `sections/04-3-prototyping-economics.qmd` | 아이디어→데모 거리의 단축이 조직·창업 관행을 바꾸는 방식 | | 미배정 |
| §4.4 | 연구자의 바이브 코딩 | `sections/04-4-research-vibe-coding.qmd` | 데이터 파이프라인·시각화·시뮬레이션, 재현성이라는 특수 조건 | | 미배정 |

### 5장 베스트 프랙티스

| # | 꼭지 | 파일 | 방향 한 줄 | 담당 | 상태 |
|---|---|---|---|---|---|
| §5.1 | 작게 시작하고 자주 확인하기 | `sections/05-1-small-steps.qmd` | 반복 루프의 크기가 품질을 결정한다는 실무 합의 | | 미배정 |
| §5.2 | 계획 먼저: 스펙과 계획 문서로 시작하기 | `sections/05-2-plan-first.qmd` | 코드 전에 계획을 시키는 워크플로, plan mode류 도구 장치들 | | 미배정 |
| §5.3 | 컨텍스트 관리의 기술 | `sections/05-3-context-management.qmd` | 무엇을 보여주고 숨길 것인가: CLAUDE.md/AGENTS.md, 컨텍스트 창 예산 | | 미배정 |
| §5.4 | 검증 가능한 단위 만들기 | `sections/05-4-verifiable-units.qmd` | 테스트·실행 확인·삼각검증, "동작한다"의 정의를 좁히는 기술 | | 미배정 |
| §5.5 | 되돌릴 수 있게: 버전 관리와 체크포인트 | `sections/05-5-reversibility.qmd` | 커밋 단위, 브랜치 전략, 에이전트가 망쳤을 때의 복구 경로 | | 미배정 |
| §5.6 | 언제 멈추고 직접 읽어야 하는가 | `sections/05-6-when-to-stop.qmd` | 위임의 한계선: 직접 개입이 필요한 신호들의 목록화 | | 미배정 |

### 6장 아티팩트별 실전

| # | 꼭지 | 파일 | 방향 한 줄 | 담당 | 상태 |
|---|---|---|---|---|---|
| §6.1 | 글쓰기: 보고서, 논문, 문서 | `sections/06-1-writing.qmd` | 검증이 어려운 아티팩트의 대표. 학술 규범과 AI 문체 문제 포함 | | 미배정 |
| §6.2 | 데이터 분석과 시각화 | `sections/06-2-data-analysis.qmd` | 탐색적 분석의 가속과 "그럴듯한 그래프"의 함정 | | 미배정 |
| §6.3 | 웹 애플리케이션: 프론트에서 배포까지 | `sections/06-3-web-apps.qmd` | 풀스택 바이브 코딩의 실전 경로와 막히는 지점들 | | 미배정 |
| §6.4 | 자동화 스크립트와 개인 도구 | `sections/06-4-automation.qmd` | 가장 성공률 높은 카테고리: 글루 코드, CLI, 개인 워크플로 자동화 | | 미배정 |
| §6.5 | 슬라이드와 조판물: 이 책의 사례 | `sections/06-5-typesetting.qmd` | 발표 자료·책 조판의 AI 제작, 이 책 빌드 파이프라인의 자기 기록 | | 미배정 |

### 7장 콘텐츠 생성

| # | 꼭지 | 파일 | 방향 한 줄 | 담당 | 상태 |
|---|---|---|---|---|---|
| §7.1 | 이미지 생성 | `sections/07-1-image-generation.qmd` | 프롬프트 관행의 차이, 스타일 제어, 코드 생성과의 비교 | | 미배정 |
| §7.2 | 비디오와 오디오 생성 | `sections/07-2-video-audio.qmd` | 2025-26 비디오 모델 지형, 음성·음악, 품질 평가의 어려움 | | 미배정 |
| §7.3 | 콘텐츠 파이프라인: 생성을 코드로 엮기 | `sections/07-3-content-pipelines.qmd` | 기획→생성→편집→배포 자동화, 콘텐츠 채널 운영 사례 | | 미배정 |

## 제3부 · 원리와 한계

### 8장 작동 원리

| # | 꼭지 | 파일 | 방향 한 줄 | 담당 | 상태 |
|---|---|---|---|---|---|
| §8.1 | 다음 토큰 예측에서 코드까지 | `sections/08-1-next-token.qmd` | 수학 없이 정확하게: LLM이 코드를 잘 쓰는 이유와 못 쓰는 이유 | | 미배정 |
| §8.2 | 코딩 에이전트의 해부학 | `sections/08-2-agent-anatomy.qmd` | 도구 호출·실행·피드백 루프 한 턴의 분해, 오픈소스 에이전트 소스 읽기 | | 미배정 |
| §8.3 | 검증 비대칭: 왜 하필 코드였나 | `sections/08-3-verification-asymmetry.qmd` | 실행 가능성이 주는 자동 검증 신호, 다른 분야로의 일반화 조건 | | 미배정 |

### 9장 한계와 리스크

| # | 꼭지 | 파일 | 방향 한 줄 | 담당 | 상태 |
|---|---|---|---|---|---|
| §9.1 | 블랙박스가 되어가는 코드베이스 | `sections/09-1-blackbox-codebase.qmd` | 이해의 공동화: 아무도 전체를 모르는 코드 위에 AI가 또 쌓는 문제 | | 미배정 |
| §9.2 | 보안: 새로운 공격면 | `sections/09-2-security.qmd` | 생성 코드 취약점 실증 연구, 프롬프트 인젝션, slopsquatting | | 미배정 |
| §9.3 | 품질 부채와 유지보수 | `sections/09-3-quality-debt.qmd` | 동작하지만 고칠 수 없는 코드, 리라이트 비용의 재무학 | | 미배정 |
| §9.4 | 주니어의 역설: 사다리가 사라진다 | `sections/09-4-junior-paradox.qmd` | 초급 업무 자동화가 전문가 양성 경로를 끊는 문제, 채용 데이터 | | 미배정 |
| §9.5 | 책임과 서명: 누가 이 코드에 사인하는가 | `sections/09-5-accountability.qmd` | 사고 났을 때의 책임 소재, 조직의 AI 코드 거버넌스 정책들 | | 미배정 |

## 제4부 · 소프트웨어 엔지니어링의 재발견

지난 50년의 소프트웨어 엔지니어링 개념들이 AI 시대에 하나씩 다시 발견되고 있다는 것이 이 부의 관점이다. 각 꼭지는 고전 개념 하나를 잡고, 원전을 읽고, AI 시대의 재발견을 대조한다.

### 10장 방법론의 재발견

| # | 꼭지 | 파일 | 방향 한 줄 | 담당 | 상태 |
|---|---|---|---|---|---|
| §10.1 | 폭포수와 애자일, 다시 | `sections/10-1-waterfall-agile.qmd` | 스펙 주도 vs 바이브는 폭포수 vs 애자일 논쟁의 재상연인가 | | 미배정 |
| §10.2 | 페어 프로그래밍: 짝이 사람이 아니게 될 때 | `sections/10-2-pair-programming.qmd` | XP의 페어링 논거(리뷰 상시화, 지식 전파)가 AI 짝에게도 성립하는가 | | 미배정 |
| §10.3 | 코드 리뷰: Fagan 인스펙션에서 AI 리뷰어까지 | `sections/10-3-code-review.qmd` | 리뷰의 원래 목적(결함/전파/규범) 중 무엇이 남고 무엇이 바뀌나 | | 미배정 |
| §10.4 | TDD의 부활: 테스트가 스펙이 될 때 | `sections/10-4-tdd-revival.qmd` | 검증이 병목인 시대에 Beck의 TDD가 에이전트 가드레일로 재발견되는 과정 | | 미배정 |

### 11장 원리의 재발견

| # | 꼭지 | 파일 | 방향 한 줄 | 담당 | 상태 |
|---|---|---|---|---|---|
| §11.1 | 추상화와 정보 은닉: Parnas가 옳았던 이유, 다시 | `sections/11-1-abstraction-parnas.qmd` | 모듈 분해 기준(1972)이 컨텍스트 창 시대의 코드베이스 설계로 부활 | | 미배정 |
| §11.2 | 기술 부채: 은유가 이자율을 만났을 때 | `sections/11-2-technical-debt.qmd` | Cunningham의 부채 은유(1992), 생성 속도가 부채 누적 속도가 된 시대 | | 미배정 |
| §11.3 | Conway의 법칙과 인간-AI 조직 | `sections/11-3-conways-law.qmd` | 시스템 구조 = 소통 구조(1968). 에이전트가 조직도에 들어올 때의 함의 | | 미배정 |
| §11.4 | No Silver Bullet, 다시 읽기 | `sections/11-4-no-silver-bullet.qmd` | Brooks(1986)의 본질적/우연적 복잡성 구분으로 LLM의 기여를 재평가 | | 미배정 |
| §11.5 | Mythical Man-Month: 사람-월에서 에이전트-시간으로 | `sections/11-5-mythical-man-month.qmd` | Brooks의 법칙(1975)은 에이전트 병렬화에도 적용되는가 | | 미배정 |

### 12장 도구와 관행의 재발견

| # | 꼭지 | 파일 | 방향 한 줄 | 담당 | 상태 |
|---|---|---|---|---|---|
| §12.1 | 버전 관리: 이력에서 안전망으로 | `sections/12-1-version-control.qmd` | Git의 역할 변화: 협업 이력 도구에서 에이전트 실험의 undo 버튼으로 | | 미배정 |
| §12.2 | CI/CD와 게이트: 사람 없는 루프의 검문소 | `sections/12-2-ci-gates.qmd` | 지속 통합의 원래 논거가 자동 생성 코드의 최후 방어선이 되는 과정 | | 미배정 |
| §12.3 | 문서화: 리터레이트 프로그래밍에서 CLAUDE.md까지 | `sections/12-3-documentation.qmd` | Knuth의 이상(1984)과 "AI가 읽는 문서"라는 새 장르의 등장 | | 미배정 |
| §12.4 | 오픈소스 협업 모델: 성당, 시장, 에이전트 | `sections/12-4-open-source.qmd` | Raymond의 시장 모델이 AI 기여자 수백을 만났을 때 (리뷰 병목, 신뢰) | | 미배정 |

## 제5부 · 공부와 일

### 13장 공부의 재구성

| # | 꼭지 | 파일 | 방향 한 줄 | 담당 | 상태 |
|---|---|---|---|---|---|
| §13.1 | 무엇을 배워야 하는가 | `sections/13-1-what-to-learn.qmd` | 문법 암기에서 문제 정의·분해·검증으로, 커리큘럼 논쟁의 현재 | | 미배정 |
| §13.2 | 교육 현장의 실험들 | `sections/13-2-education-experiments.qmd` | 금지파·필수파·평가 개편파의 실제 결과 비교 (이 수업도 하나의 실험) | | 미배정 |
| §13.3 | 전문성의 사다리: 초보자는 어떻게 전문가가 되는가 | `sections/13-3-expertise-ladder.qmd` | 의도적 수련 이론과 "쉬운 일은 AI가 하는" 환경의 충돌 | | 미배정 |

### 14장 일의 재구성

| # | 꼭지 | 파일 | 방향 한 줄 | 담당 | 상태 |
|---|---|---|---|---|---|
| §14.1 | AI와 일하는 하루 | `sections/14-1-ai-workday.qmd` | 위임·검토·병렬 작업으로 재구성된 하루, 심층 사용자 인터뷰 | | 미배정 |
| §14.2 | 직업 지형의 변화: 데이터로 보기 | `sections/14-2-labor-data.qmd` | 채용 공고·임금·고용 실증 연구, 과장과 실제의 구분 | | 미배정 |
| §14.3 | 정체성 질문: 나는 무엇을 하는 사람인가 | `sections/14-3-identity.qmd` | 만드는 사람의 자기 정의 변화, 장인정신 담론의 행방 | | 미배정 |

## 개념 사전 (G) — 가벼운 추가 기여

항목당 정의·유래·현재 상태 3문단 내외. 본 꼭지와 별개로 가져갈 수 있다 (가산점).

| # | 항목 | 파일 | 담당 | 상태 |
|---|---|---|---|---|
| G1 | vibe coding | `glossary/vibe-coding.qmd` | | 시드 있음 |
| G2 | prompt engineering | `glossary/prompt-engineering.qmd` | | 시드 있음 |
| G3 | context engineering | `glossary/context-engineering.qmd` | | 시드 있음 |
| G4 | agentic coding | `glossary/agentic-coding.qmd` | | 시드 있음 |
| G5 | CHOP (chat-oriented programming) | `glossary/chop.qmd` | | 미배정 |
| G6 | vibe engineering | `glossary/vibe-engineering.qmd` | | 미배정 |
| G7 | loop engineering | `glossary/loop-engineering.qmd` | | 시드 있음 |
| G8 | agent harness / harness engineering | `glossary/agent-harness.qmd` | | 미배정 |
| G9 | spec-driven development | `glossary/spec-driven-development.qmd` | | 시드 있음 |
| G10 | subagent / 멀티에이전트 | `glossary/subagent.qmd` | | 미배정 |
| G11 | human-in-the-loop | `glossary/human-in-the-loop.qmd` | | 미배정 |
| G12 | hallucination | `glossary/hallucination.qmd` | | 미배정 |
| G13 | slop / workslop | `glossary/slop.qmd` | | 미배정 |
| G14 | slopsquatting | `glossary/slopsquatting.qmd` | | 미배정 |
| G15 | MCP (Model Context Protocol) | `glossary/mcp.qmd` | | 미배정 |
| G16 | RAG (retrieval-augmented generation) | `glossary/rag.qmd` | | 미배정 |
| G17 | 토큰과 컨텍스트 윈도 | `glossary/tokens-context-window.qmd` | | 미배정 |
| G18 | evals (평가) | `glossary/evals.qmd` | | 미배정 |
| G19 | guardrails | `glossary/guardrails.qmd` | | 미배정 |
| G20 | Software 2.0 / 3.0 | `glossary/software-2-3.qmd` | | 미배정 |

## 통계

- 섹션 꼭지: **57개** (본 꼭지, 1인 1개 우선)
- 개념 사전: **20개** (가벼운 추가 기여)
- 새 꼭지 제안: 환영. 이슈로 제안하고 수업에서 논의해 이 표에 추가한다.
