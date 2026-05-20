# 학교생활규정 제·개정 검토 지원 시스템

초·중·고 학교생활규정을 교육청 체크리스트 기준으로 검토하고, 웹에서 검토표와 신구대조표 후보를 확인하는 배포용 Next.js + Firebase 스타터 프로젝트입니다.

## 목표 구조

- GitHub: 코드 저장소
- Vercel: Next.js 웹앱 배포
- Firebase: 로그인, 파일 저장, 결과 저장
- 분석 API: 추후 별도 서버 또는 Firebase Functions로 분리

## 현재 포함 기능 v0.1

- 학교급 선택
- 학교명 입력
- 학교생활규정 파일 업로드 UI
- 교육청 체크리스트 파일 업로드 UI
- 체크리스트 기준 검토표 UI
- 상세보기: 현행 / AI 개정안 초안 / 개정 사유
- 신구대조표 후보 UI
- Firebase 연결 준비

현재 분석은 `lib/mockAnalyzer.ts`의 샘플 규칙 기반으로 동작합니다.
실제 HWP/HWPX/PDF/DOCX 파싱과 AI 분석은 다음 단계에서 API로 연결하면 됩니다.

## 실행 방법

```bash
npm install
npm run dev
```

브라우저에서 `http://localhost:3000` 접속.

## Firebase 설정

`.env.example`을 복사해서 `.env.local`을 만들고 Firebase 웹앱 설정값을 넣으세요.

```bash
cp .env.example .env.local
```

## Vercel 배포

1. GitHub에 이 프로젝트를 push
2. Vercel에서 New Project
3. GitHub 저장소 선택
4. 환경변수에 `.env.local` 값 등록
5. Deploy

## 다음 개발 단계

1. Firebase Auth 로그인 추가
2. Firebase Storage 파일 업로드 연결
3. Firestore 분석 결과 저장
4. HWPX/PDF/DOCX 텍스트 추출 API 연결
5. 교육청 최종 체크리스트 xlsx 파서 연결
6. AI 개정안 초안 생성 API 연결
