// GitHub Pages 프로젝트 사이트는 '/econ-bite' 서브경로로 서빙되므로,
// 내부 링크는 base(import.meta.env.BASE_URL)를 반드시 붙여야 404가 안 난다.
// 주의: BASE_URL은 트레일링 슬래시가 없을 수 있어('/econ-bite') 직접 이어붙이면
// '/econ-biteposts/'처럼 깨진다. 아래에서 슬래시를 안전하게 정규화한다.
const BASE = import.meta.env.BASE_URL; // 예: '/econ-bite' 또는 '/econ-bite/'

/** 루트 기준 경로에 사이트 base를 붙여 준다. withBase('/posts/x/') -> '/econ-bite/posts/x/' */
export function withBase(path: string = '/'): string {
  const base = BASE.replace(/\/+$/, ''); // 트레일링 슬래시 제거 -> '/econ-bite'
  const p = '/' + String(path).replace(/^\/+/, ''); // 선행 슬래시 보장 -> '/posts/x/'
  return (base + p).replace(/\/{2,}/g, '/');
}
