# 기여 가이드

이 책의 기여자는 대부분 수업 수강생이지만, 외부 기여(오탈자, 사실 정정, 개념 사전 항목)도 환영한다.

## 시작하기

```bash
git clone https://github.com/oksure/vibecoding
cd vibecoding
# Quarto 설치: https://quarto.org/docs/get-started/
cd ko && quarto preview     # 실시간 미리보기
```

## 언어 정책 (중요)

- **`ko/`가 원문, `en/`은 AI 번역 생성물이다.** `en/` 파일 상단에 `MACHINE-TRANSLATED` 마커가 있으면 그 파일은 절대 직접 수정하지 않는다. `ko/`의 원문을 고치고 `tools/translate`를 돌리면 번역이 갱신된다.
- **영어로 쓰고 싶다면**: 담당 챕터 머리의 `authoritative-lang: ko`를 `en`으로 바꾸고, `en/`쪽 파일을 직접 작성한다. 그러면 그 챕터는 영어가 원문이 되고 한국어판이 번역 생성물이 된다.
- 번역 실행: `tools/translate` (Claude Code CLI 필요, 변경된 파일만 다시 번역한다).

## 집필 워크플로

1. **꼭지 self-select**: [TOPICS.md](TOPICS.md)에서 담당이 빈 꼭지를 골라, 담당 칸에 자기 이름을 적는 PR을 올린다. 이것이 첫 PR이다. 이때 `contributors.qmd`에도 이름을 추가한다.
2. **브랜치**: `05-4-verifiable-units`처럼 꼭지가 드러나는 이름으로 딴다.
3. **작성**: 자기 꼭지 파일(`ko/sections/NN-M-slug.qmd` 또는 `ko/glossary/slug.qmd`)만 수정한다. 다른 사람의 파일은 PR 리뷰로만 관여한다. 새 꼭지 제안은 이슈로 논의 후 `tools/new-section`으로 만든다.
4. **로컬 확인**: `tools/build html ko`가 깨지지 않는지 본다.
5. **PR**: 템플릿을 채워 연다. 동료 리뷰 1건 이상을 받아야 머지된다. 머지는 티칭 팀이 한다. 머지 후 TOPICS.md의 상태 칸을 갱신한다.

### 섹션 파일 규칙

- 섹션 파일은 챕터 파일에 include되므로 **YAML frontmatter를 쓸 수 없다**. 첫 줄은 `<!-- authoritative-lang: ko -->` 주석이다.
- 섹션 제목은 `## 제목 {#sec-slug}` (H2). 앵커 slug는 파일명에서 `NN-M-` 프리픽스를 뗀 부분과 같게 유지한다.
- 챕터 파일(`ko/chapters/`)의 리드 문단과 include 순서는 티칭 팀이 관리한다.

## 문체 가이드

- **담백하게.** 과장, 감탄, 홍보 문구를 쓰지 않는다. 수사적 대구("단순한 X가 아니라 Y다")를 반복하지 않는다.
- **긴 대시(em dash, U+2014) 남발 금지.** 쉼표, 마침표, 괄호로 충분하다. 인용문 안은 예외.
- **사실은 1차 출처로.** 날짜, 수치, 인물, 인용은 원 출처를 확인하고 링크한다. 2차 블로그 재인용은 원문을 찾아 바꾼다. 확인이 안 되면 쓰지 않거나 불확실성을 명시한다.
- **번역투를 피한다.** "~에 대하여", "~것으로 보여진다" 같은 문형을 줄인다.
- **코드와 명령은 실행해보고 싣는다.**

## AI 사용 규칙

수업 정책(SYLLABUS 참고)과 같다: 전면 허용, 검증 책임은 저자, 무검토 통짜 생성물 제출 금지, PR에 사용 도구·워크플로 한 줄 기록.

## 빌드가 깨졌을 때

- `quarto render` 에러 메시지의 파일:줄을 먼저 본다. 대부분 콜아웃 블록(`:::`)의 짝이 안 맞거나 frontmatter YAML 문법 오류다.
- 챕터를 추가·삭제했다면 `ko/_quarto.yml`과 `en/_quarto.yml` 두 곳 모두 고쳐야 한다. 목록이 다르면 `tools/build`가 에러를 낸다.
