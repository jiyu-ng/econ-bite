#!/bin/bash
# 경제한입 자동 기능개선 — launchd가 2시간마다(9·11·13·15·17·19시 KST) 실행.
# claude headless로 SEO·UX·성능·코드 품질 등 "의미 있는 작은 개선" 1건 구현 + PR 생성.
# 마땅한 개선거리가 없으면 아무것도 만들지 않고 패스(스팸 방지).
set -uo pipefail

REPO=/Users/jiyung-world/projects/econ-bite
ENV_FILE=/Users/jiyung-world/telegram-bots/kiri/.env
LOG=/Users/jiyung-world/.claude/channels/kiri/econbite-feature.log
DM=5471105830

# 봇 토큰 로드 (TELEGRAM_BOT_TOKEN)
set -a
# shellcheck disable=SC1090
source "$ENV_FILE"
set +a

cd "$REPO" || { echo "no repo" >> "$LOG"; exit 1; }

PROMPT='너는 경제한입 사이트의 자동 개선 담당이야. 이번 슬롯에 "의미 있는 작은 개선 1건"을 골라 구현해줘. 저장소의 CLAUDE.md 가이드를 따른다.

목표 우선순위: 검색 노출(SEO)·수익화·사용자 경험·성능·접근성·코드 품질. 그 다음 ROADMAP.md(있으면)의 항목.

후보 예시(이미 돼있으면 다른 걸 골라): 글 간 내부 링크/관련글, 카테고리·태그 페이지, RSS 피드, 404 페이지, OG 이미지 자동생성, 이미지/폰트 성능, 메타 설명 품질, 접근성(시맨틱/대비/aria), 글 목록 검색·필터, JSON-LD 보강(BreadcrumbList 등).

작업 순서:
1. git checkout main && git pull origin main
2. 현재 코드와 ROADMAP.md를 살펴 "지금 가장 가치 있는, 한 PR에 들어갈 작은 개선" 1건을 정한다. 범위를 작게 유지한다 (글쓰기는 하지 않는다 — 그건 별도 잡이 함).
3. 구현한다. ROADMAP.md가 있으면 처리한 항목을 체크/갱신한다.
4. npm run build 로 빌드 통과 확인 (실패하면 고친다).
5. auto/feat-<짧은-slug> 브랜치를 만들고 커밋(메시지에 Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com> 포함) 후 push.
6. gh pr create 로 PR 생성 (base main). 자동 머지는 절대 하지 않는다.
7. 마지막에 생성된 PR URL 한 줄을 그대로 출력한다.

이번 슬롯에 가치 있는 개선이 마땅찮으면 아무것도 만들지 말고 정확히 NO_OP 만 출력하고 종료해.'

RESULT=$(claude -p "$PROMPT" --model sonnet --permission-mode bypassPermissions 2>&1)

PR_URL=$(printf '%s' "$RESULT" | grep -oE 'https://github\.com/right-economy/right-economy\.github\.io/pull/[0-9]+' | tail -1)

if [ -n "$PR_URL" ]; then
  MSG="🔧 경제한입 기능개선 PR 올렸어! 리뷰해줘 👉 ${PR_URL}"
elif printf '%s' "$RESULT" | grep -q 'NO_OP'; then
  # 개선거리 없으면 조용히 패스 — DM 안 보냄 (스팸 방지). 로그만 남김.
  printf '[%s] NO_OP (패스)\n' "$(date '+%F %T')" >> "$LOG"
  exit 0
else
  MSG="🔧 경제한입 기능개선 작업했는데 PR URL을 못 찾았어 ㅠ 로그 확인 필요."
fi

curl -s "https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage" \
  --data-urlencode "chat_id=${DM}" \
  --data-urlencode "text=${MSG}" >/dev/null 2>&1

printf '[%s] %s\n' "$(date '+%F %T')" "${PR_URL:-${MSG}}" >> "$LOG"
