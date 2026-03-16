# 🎸 네 줄의 미학 (The Aesthetics of Four Lines)

> 베이스 기타를 배우는 가장 인터랙티브한 방법

[![React](https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react)](https://react.dev)
[![Vite](https://img.shields.io/badge/Vite-7-646CFF?style=flat-square&logo=vite)](https://vitejs.dev)
[![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)](LICENSE)

**네 줄의 미학**은 베이스 기타 학습자를 위한 인터랙티브 웹 플랫폼입니다.
지판의 음계를 시각적으로 익히고, 다양한 퀴즈 모드로 빠르게 암기할 수 있습니다.

🔗 **[라이브 데모 보러가기 →](https://qmoy2510.github.io/The-aesthetics-of-four-lines/)**

---

## ✨ 주요 기능

| 기능 | 설명 |
|------|------|
| 🎸 **지판 학습** | 4·5·6현 베이스의 지판을 인터랙티브하게 탐색하고 퀴즈로 실력을 테스트 |
| 🎵 **스케일 학습** | 메이저, 마이너, 블루스 등 다양한 스케일을 지판 위에서 시각적으로 확인 |
| 🎹 **음계 매칭 퀴즈** | 영어 코드명(C, D, E)과 계이름(도, 레, 미)을 피아노 건반으로 빠르게 변환 |
| 📄 **악보 읽기 퀴즈** | 낮은자리표(Bass Clef)를 보고 정확한 음을 찾아내는 초견 훈련 |
| 🎤 **음정 감지** | 마이크를 통해 실시간으로 베이스 음정을 감지하고 음이름을 표시 |

---

## 🛠️ 기술 스택

- **Frontend** — React 19, React Router DOM 7
- **빌드 도구** — Vite 7
- **UI 아이콘** — Lucide React
- **음정 감지** — PitchFinder (AMDF 알고리즘, Web Audio API)
- **스타일링** — 커스텀 CSS (Glassmorphism, 다크 테마)
- **폰트** — Pretendard (CDN)

---

## 🚀 로컬 실행 방법

### 요구 사항
- Node.js 18 이상

### 설치 및 실행

```bash
# 저장소 클론
git clone https://github.com/qmoy2510/The-aesthetics-of-four-lines.git
cd The-aesthetics-of-four-lines

# 패키지 설치
npm install

# 개발 서버 시작
npm run dev
```

브라우저에서 `http://localhost:5173` 접속

### 빌드

```bash
npm run build
```

---

## 📁 프로젝트 구조

```
src/
├── constants.js             # 공유 상수 (음계, 음이름 매핑)
├── App.jsx                  # 라우팅 설정 (lazy loading)
├── index.css                # 글로벌 스타일 & 디자인 토큰
├── components/
│   ├── Navbar.jsx           # 내비게이션 바
│   ├── Home.jsx             # 홈 화면
│   ├── Fretboard.jsx        # 재사용 가능한 지판 컴포넌트
│   ├── FretboardFeature.jsx # 지판 학습 & 퀴즈
│   ├── ScaleStudy.jsx       # 스케일 학습 & 퀴즈
│   ├── NoteMatching.jsx     # 음계 매칭 퀴즈
│   ├── SheetMusicQuiz.jsx   # 악보 읽기 퀴즈
│   └── PracticePitch.jsx    # 음정 감지 연습
└── hooks/
    └── usePitch.js          # Web Audio API 마이크 훅
```

---

## 🎯 학습 흐름 추천

1. **지판 학습** → 음계 위치 시각적으로 익히기
2. **스케일 학습** → 자주 쓰는 스케일 패턴 암기
3. **음계 매칭 퀴즈** → 영어 코드명 ↔ 계이름 순발력 기르기
4. **악보 읽기 퀴즈** → 실전 초견 능력 향상
5. **음정 감지** → 베이스를 직접 연주하며 음 확인

---

## 📄 라이선스

MIT License © 2025 [qmoy2510](https://github.com/qmoy2510)
