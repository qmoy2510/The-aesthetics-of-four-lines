import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: './', // 빌드된 HTML 파일이 로컬(file://)에서도 JS/CSS 리소스를 제대로 찾을 수 있게 상대 경로로 변경
})
