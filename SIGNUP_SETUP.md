# 회원가입 기능 설정 가이드

## 1. Supabase 마이그레이션 실행

Supabase 대시보드 → SQL Editor에서 아래 파일 실행:
```
supabase/migrations/20260506000100_user_profiles.sql
```

## 2. Supabase Auth 설정

Supabase 대시보드 → Authentication → Settings:
- **Site URL**: `https://mugoong.com` (또는 로컬: `http://localhost:3000`)
- **Redirect URLs**에 추가:
  - `https://mugoong.com/api/auth/callback`
  - `http://localhost:3000/api/auth/callback`

## 3. Google OAuth 설정 (Gmail 로그인)

### A. Google Cloud Console
1. https://console.cloud.google.com → 새 프로젝트 또는 기존 프로젝트 선택
2. APIs & Services → Credentials → OAuth 2.0 Client ID 생성
3. Authorized redirect URIs에 추가:
   ```
   https://qsifjnbjlejowdvvmnlt.supabase.co/auth/v1/callback
   ```
4. Client ID와 Client Secret 복사

### B. Supabase 대시보드
Authentication → Providers → Google:
- Enable Google provider 체크
- Client ID, Client Secret 붙여넣기
- Save

## 4. 이메일 설정 (선택사항)

Supabase 대시보드 → Authentication → Email Templates:
- 이메일 인증 템플릿 커스터마이징 가능

## 완성된 기능 목록

- `/signup` - 3단계 회원가입 (Google OAuth 또는 이메일)
- `/login` - 로그인 (Google + 이메일/비밀번호, 비밀번호 재설정)
- `/verify-email` - 이메일 인증 대기 페이지
- `/account` - 프로필 관리 (개인정보 + 관심사)
- `/admin/users` - 회원관리 (검색, 필터, 상세보기)
- `/api/auth/callback` - OAuth/이메일 인증 콜백
