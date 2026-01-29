#!/bin/bash
# Git 로그 스크립트: 특정 기간 동안 특정 키워드가 포함된 커밋 정보를 파일로 추출

# 파라미터 설정 (여기서 수정하세요)
start_date="2025-10-01"
end_date="2025-10-30"
author="sungwoo"  # 모든 작성자 또는 "sungwoo" 등 특정 작성자
keyword="#85"  # 찾고자 하는 키워드 (예: "ISSUE", "FIX", "#123" 등)

# 현재 날짜와 시간을 파일명에 포함
current_datetime=$(date +"%Y%m%d_%H%M%S")
output_file="git_log_keyword_${keyword}_${start_date}_to_${end_date}_${current_datetime}.txt"

# Git 저장소 체크
if ! git rev-parse --is-inside-work-tree >/dev/null 2>&1; then
    echo "에러: 현재 디렉토리는 Git 저장소가 아닙니다."
    exit 1
fi

# 파일 헤더 작성 및 Git 로그 추출
{
    echo "----------------------------------------"
    echo "Git 커밋 로그 내보내기 (키워드 필터링)"
    echo "생성 일시: $(date '+%Y-%m-%d %H:%M:%S')"
    echo "조회 기간: $start_date ~ $end_date"
    echo "작성자: $author"
    echo "키워드: $keyword"
    echo "저장소 경로: $(git rev-parse --show-toplevel)"
    echo "현재 브랜치: $(git branch --show-current)"
    echo "----------------------------------------"
    echo

    # 지정된 기간과 키워드가 포함된 커밋 로그 추출
    git log --author="$author" \
        --after="$start_date 00:00:00" \
        --before="$end_date 23:59:59" \
        --grep="$keyword" \
        --pretty=format:"커밋 해시: %h%nAuthor: %an <%ae>%n작성일시: %ad%n브랜치: %D%n%n제목: %s%n%n내용:%n%b%n----------------------------------------" \
        --date=format:"%Y-%m-%d %H:%M:%S" \
        --name-status
} > "$output_file"

# 결과 확인
if [ $? -eq 0 ]; then
    # 커밋 개수 계산
    commit_count=$(git log --author="$author" \
        --after="$start_date 00:00:00" \
        --before="$end_date 23:59:59" \
        --grep="$keyword" \
        --oneline | wc -l)

    echo "키워드 '$keyword'가 포함된 Git 로그가 '$output_file'에 저장되었습니다."
    echo "조회된 커밋 수: $commit_count"

    # 파일 크기 확인
    file_size=$(wc -c < "$output_file")
    echo "파일 크기: $file_size 바이트"

    # 커밋이 없는 경우 안내
    if [ "$commit_count" -eq 0 ]; then
        echo "경고: 지정된 조건에 맞는 커밋이 없습니다."
        echo "- 날짜 범위를 확인해주세요: $start_date ~ $end_date"
        echo "- 키워드를 확인해주세요: '$keyword'"
        echo "- 작성자를 확인해주세요: '$author'"
    fi
else
    echo "Git 로그 추출 중 오류가 발생했습니다."
    exit 1
fi