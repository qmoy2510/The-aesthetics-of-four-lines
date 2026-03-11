import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  root: 'src', // 격리된 src 내 index.html을 개발 서버 진입점으로 사용
  publicDir: '../public', // Root 기준 public 폴더 유지
  base: './', // 빌드된 HTML 파일이 로컬(file://)에서도 JS/CSS 리소스를 제대로 찾을 수 있게 상대 경로로 변경
  build: {
    outDir: '../dist', // 빌드 결과물을 프로젝트 최상단의 dist로 출력
    emptyOutDir: true,
  }
})
