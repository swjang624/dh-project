#!/bin/bash
# Git의 모든 변경사항(staged + unstaged)을 터미널에 출력하는 스크립트
# *-lock.* 패턴의 파일은 제외

echo "=== Unstaged Changes (git diff) ==="
git diff -- . ':!*-lock.*' ':!*.lock'

echo -e "\n=== Staged Changes (git diff --cached) ==="
git diff --cached -- . ':!*-lock.*' ':!*.lock'
