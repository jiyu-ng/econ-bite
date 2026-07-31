// 읽기 시간 추정 헬퍼. 한국어 평균 독서 속도 ~500자/분 기준.
// 마크다운 기호를 걷어낸 순수 글자 수로 계산하며, 최소 1분을 보장한다.
// (글 상세 페이지·목록 카드가 같은 공식을 쓰도록 한 곳에 모음)
export function readingMinutes(body: string | undefined): number {
  const plainText = (body ?? '').replace(/[#>*`|_\-\[\]()!]/g, '');
  return Math.max(1, Math.round([...plainText].length / 500));
}
