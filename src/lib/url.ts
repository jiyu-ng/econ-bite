// 조직 사이트(right-economy.github.io)는 루트('/')에서 서빙되므로 현재 base는 '/'.
// 이 헬퍼는 base(import.meta.env.BASE_URL)를 안전하게 붙여 내부 링크를 만든다.
// (base가 '/'면 그대로, 나중에 서브경로/커스텀 도메인이 생겨도 동일하게 동작)
const BASE = import.meta.env.BASE_URL; // 예: '/'(현재) 또는 '/서브경로'

/** 루트 기준 경로에 사이트 base를 붙여 준다. withBase('/posts/x/') -> '/posts/x/' */
export function withBase(path: string = '/'): string {
  const base = BASE.replace(/\/+$/, ''); // 트레일링 슬래시 제거 (루트면 '')
  const p = '/' + String(path).replace(/^\/+/, ''); // 선행 슬래시 보장 -> '/posts/x/'
  return (base + p).replace(/\/{2,}/g, '/');
}
