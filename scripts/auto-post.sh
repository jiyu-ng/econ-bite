#!/bin/bash
# 경제한입 자동 글쓰기 — launchd가 하루 2회(점심 12시·저녁 18시 KST) 실행.
# claude headless로 새 글 1편 작성 + PR 생성, 결과를 텔레그램 DM으로 보고.
set -uo pipefail

REPO=/Users/jiyung-world/projects/econ-bite
ENV_FILE=/Users/jiyung-world/telegram-bots/kiri/.env
LOG=/Users/jiyung-world/.claude/channels/kiri/econbite-auto.log
DM=5471105830

# 봇 토큰 로드 (TELEGRAM_BOT_TOKEN)
set -a
# shellcheck disable=SC1090
source "$ENV_FILE"
set +a

cd "$REPO" || { echo "no repo" >> "$LOG"; exit 1; }

PROMPT='경제한입 사이트에 새 경제 글 1편을 작성해줘. 이 저장소의 CLAUDE.md 글쓰기 가이드를 반드시 따라줘.

순서:
1. git checkout main && git pull origin main
2. src/content/posts/ 의 기존 글들을 확인해서 주제가 겹치지 않는 새 주제를 고른다
3. 가이드에 맞는 새 글 1편을 src/content/posts/<slug>.md 로 작성 (frontmatter의 publishedDate는 오늘 날짜)
4. npm run build 로 빌드 통과 확인 (실패하면 고친다)
5. auto/post-<slug> 브랜치를 만들고 커밋(메시지에 Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com> 포함) 후 push
6. gh pr create 로 PR 생성 (base main). 자동 머지는 절대 하지 않는다.
7. 마지막에 생성된 PR URL 한 줄을 그대로 출력한다.

만약 마땅한 새 주제가 없으면 글을 만들지 말고 정확히 NO_NEW_POST 만 출력하고 종료해.'

RESULT=$(claude -p "$PROMPT" --model sonnet --permission-mode bypassPermissions 2>&1)

PR_URL=$(printf '%s' "$RESULT" | grep -oE 'https://github\.com/right-economy/right-economy\.github\.io/pull/[0-9]+' | tail -1)

if [ -n "$PR_URL" ]; then
  MSG="🤖 경제한입 자동 글 올렸어! 리뷰해줘 👉 ${PR_URL}"
elif printf '%s' "$RESULT" | grep -q 'NO_NEW_POST'; then
  MSG="🤖 이번 슬롯은 새 주제가 마땅찮아서 패스했어 🐱 (다음 슬롯에 또 올게!)"
else
  MSG="🤖 경제한입 자동 글 작업했는데 PR URL을 못 찾았어 ㅠ 로그 확인이 필요해."
fi

curl -s "https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage" \
  --data-urlencode "chat_id=${DM}" \
  --data-urlencode "text=${MSG}" >/dev/null 2>&1

printf '[%s] %s\n' "$(date '+%F %T')" "${PR_URL:-${MSG}}" >> "$LOG"
