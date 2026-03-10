import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: './', // 빌드된 HTML 파일이 로컬(file://)에서도 JS/CSS 리소스를 제대로 찾을 수 있게 상대 경로로 변경
  build: {
    outDir: './', // 빌드 결과물을 dist 폴더가 아닌 bass-web(현재 디렉토리) 최상단으로 설정
    emptyOutDir: false, // 기존 소스 코드(src, public 등)가 지워지지 않도록 비우기 옵션 비활성화
  }
})
