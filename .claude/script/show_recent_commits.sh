#!/bin/bash
# Git 로그 스크립트: 최근 5개 커밋의 상세 정보를 터미널에 출력

# Git 저장소 체크
if ! git rev-parse --is-inside-work-tree >/dev/null 2>&1; then
    echo "에러: 현재 디렉토리는 Git 저장소가 아닙니다."
    exit 1
fi

echo "----------------------------------------"
echo "Git 커밋 로그"
echo "생성 일시: $(date '+%Y-%m-%d %H:%M:%S')"
echo "저장소 경로: $(git rev-parse --show-toplevel)"
echo "현재 브랜치: $(git branch --show-current)"
echo "----------------------------------------"
echo

# 최근 5개의 커밋 로그 출력
git log -n 5 --pretty=format:"커밋 해시: %h%nAuthor: %an <%ae>%n작성일시: %ad%n브랜치: %D%n%n제목: %s%n%n내용:%n%b%n----------------------------------------" \
    --date=format:"%Y-%m-%d %H:%M:%S" \
    --author="sungwoo" \
    --name-status
