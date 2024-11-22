# GPT Tools Platform

GPT 기반의 다양한 AI 도구들을 손쉽게 사용할 수 있는 웹 플랫폼입니다.

## 주요 기능

- 사용자 인증 (로그인/회원가입)
- 다양한 AI 도구 제공
- 실시간 알림
- 반응형 디자인
- 다국어 지원 (한국어/영어)
- 사용자 프로필 관리
- 관리자 대시보드

## 기술 스택

- React 18.3.1
- TypeScript 4.9.5
- Material-UI 5.15.14
- React Query 3.39.3
- React Router 6.28.0
- i18next
- WebSocket

## 시작하기

### 필요 조건

- Node.js 16.x 이상
- npm 또는 yarn

### 설치

```bash
# 저장소 클론
git clone [your-repository-url]
cd gpt-tools/client

# 의존성 설치
npm install

# 개발 서버 실행
npm start
```

### 환경 변수 설정

`.env` 파일을 생성하고 다음 변수들을 설정하세요:

```env
REACT_APP_API_URL=http://localhost:3001/api
REACT_APP_WS_URL=ws://localhost:3001/ws
```

## 개발 모드

개발 모드에서는 백엔드 서버 없이도 기본적인 기능을 테스트할 수 있습니다:

- 더미 데이터를 사용한 도구 목록 표시
- 기본적인 UI/UX 테스트 가능
- 실시간 코드 수정 및 확인

## 프로젝트 구조

```
src/
├── components/     # 재사용 가능한 컴포넌트
├── contexts/       # React Context 정의
├── hooks/         # 커스텀 훅
├── pages/         # 페이지 컴포넌트
├── services/      # API 서비스
├── types/         # TypeScript 타입 정의
├── utils/         # 유틸리티 함수
└── i18n/          # 다국어 리소스
```

## 기여하기

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 라이선스

이 프로젝트는 MIT 라이선스를 따릅니다. 자세한 내용은 [LICENSE](LICENSE) 파일을 참조하세요.
