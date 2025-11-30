# NUXT 프로젝트 보안이슈 관련 사항

Nuxt 4 환경에서 중점적으로 고려해야 할 보안 이슈와 방어 전략을 정리해 드립니다.

---

### 1. Nuxt 4 프로젝트 주요 보안 고려사항

Nuxt 앱은 "브라우저"와 "서버" 양쪽에서 코드가 실행되므로 공격 표면이 넓습니다.

### ① SQL 인젝션 (SQL Injection) [서버 측 이슈]

- **위험:** Nuxt의 `server/api` 디렉토리에서 DB에 직접 쿼리를 날릴 때 발생합니다. 공격자가 입력 필드에 악의적인 SQL 구문을 넣어 DB 데이터를 탈취하거나 조작합니다.
- **발생 상황:** 사용자 입력을 검증 없이 SQL 문자열에 그대로 연결할 때 (`"SELECT * FROM users WHERE name = '" + userInput + "'"`).

### ② XSS (Cross Site Scripting) [클라이언트 측 이슈]

- **위험:** 공격자가 악성 스크립트를 웹 페이지에 삽입하여, 접속한 사용자의 쿠키나 세션을 탈취합니다.
- **발생 상황:**
    - Vue의 `v-html`을 사용하여 검증되지 않은 HTML을 렌더링할 때.
    - 서버에서 내려온 데이터를 그대로 화면에 뿌릴 때 (SSR 과정에서의 Hydration 불일치 공격).

### ③ 민감 데이터 노출 (Sensitive Data Exposure) [설정 이슈]

- **위험:** API 키, DB 비밀번호, 관리자 토큰 등이 브라우저 소스코드(Client Bundle)에 포함되어 노출됩니다.
- **Nuxt 특성:** `nuxt.config.ts`의 `runtimeConfig` 설정을 잘못하여 `public` 키에 비밀키를 넣으면 브라우저에 그대로 노출됩니다.

### ④ CSRF (Cross-Site Request Forgery) [인증 이슈]

- **위험:** 사용자가 로그인된 상태에서 공격자가 만든 위조 사이트를 방문하게 하여, 사용자 몰래 비밀번호 변경이나 결제 요청을 서버로 보내게 합니다.

---

### 2. 보안 방어 전략 및 적용 방법

각 이슈에 대해 Nuxt 4 생태계에서 권장하는 해결책입니다.

### 🛡️ 전략 1: SQL 인젝션 방어 (ORM 및 유효성 검사)

Nuxt 서버 API(`server/api/...`)에서 DB 통신 시 가장 중요한 부분입니다.

1. **ORM(Object-Relational Mapping) 사용 (강력 추천)**
    - 사용자님께서 사용 중인 **Prisma**나 TypeORM 같은 라이브러리는 내부적으로 쿼리를 파라미터화(Parameterized Query)하여 실행합니다.
    - **방법:** Raw Query(`$queryRaw`) 사용을 피하고, ORM이 제공하는 메서드(`findMany`, `create` 등)를 사용하세요.
    - *Prisma는 기본적으로 SQL 인젝션으로부터 안전합니다.*
2. **입력 데이터 유효성 검사 (Input Validation)**
    - 데이터가 DB에 도달하기 전에 형식을 검증합니다.
    - **도구:** **Zod** (Nuxt/h3와 궁합이 매우 좋음)
    - **예시:**TypeScript
        
        ```jsx
        // server/api/create-user.post.ts
        import { z } from 'zod'
        
        const bodySchema = z.object({
          email: z.string().email(), // 이메일 형식이 아니면 튕겨냄
          age: z.number().min(18)    // 숫자가 아니거나 18세 미만이면 튕겨냄
        })
        
        export default defineEventHandler(async (event) => {
          const body = await readValidatedBody(event, bodySchema.parse)
          // 여기까지 오면 body는 안전한 데이터임이 보장됨
          return await prisma.user.create({ data: body })
        })
        ```
        

### 🛡️ 전략 2: XSS 방어 (Sanitization & Headers)

1. **`v-html` 사용 지양 및 정화**
    - 가능하면 `{{ }}` (Mustache syntax)만 사용하세요. Vue는 기본적으로 이를 이스케이프 처리합니다.
    - 꼭 HTML을 렌더링해야 한다면 **DOMPurify** 같은 라이브러리로 스크립트를 제거한 후 렌더링하세요.
2. **Nuxt Security 모듈 사용 (필수 추천)**
    - Nuxt 보안 설정을 한 번에 처리해 주는 공식 권장 모듈입니다. OWASP 권장 HTTP 헤더를 자동으로 설정해 줍니다.
    - **설치:** `npx nuxi@latest module add security`
    - **기능:**
        - **Content-Security-Policy (CSP):** 허용된 출처의 스크립트만 실행되도록 제한.
        - **Strict-Transport-Security (HSTS):** HTTPS 강제.
        - **X-Frame-Options:** 클릭재킹 방지.

### 🛡️ 전략 3: 환경변수 관리 (`runtimeConfig` 분리)

Nuxt 4의 `runtimeConfig`를 통해 비밀 키와 공개 키를 철저히 분리해야 합니다.

- **`runtimeConfig` (서버 전용):** DB URL, API Secret Key 등. 브라우저에서 접근 불가.
- **`runtimeConfig.public` (클라이언트 공개):** Google Maps API Key, Public MinIO URL 등.

TypeScript

```jsx
// nuxt.config.ts
export default defineNuxtConfig({
  runtimeConfig: {
    dbUrl: '', // [서버 전용] .env의 NUXT_DB_URL과 매핑. 클라이언트 노출 X
    public: {
      apiBase: '', // [공개] .env의 NUXT_PUBLIC_API_BASE와 매핑
    }
  }
})
```

### 🛡️ 전략 4: CSRF 및 인증 보안

1. **SameSite 쿠키 설정:**
    - 인증 쿠키를 설정할 때 `SameSite=Lax` 또는 `Strict` 옵션을 사용하여 다른 사이트에서의 요청을 차단합니다.
    - `Secure: true`, `HttpOnly: true` 설정은 기본입니다.
2. **CSRF 토큰:**
    - `nuxt-security` 모듈을 사용하면 CSRF 방어 기능을 켤 수 있습니다.
    - POST, PUT, DELETE 요청 시 토큰을 검증하여 위조된 요청을 막습니다.

---

### 요약: Nuxt 4 프로젝트 보안 체크리스트

- [ ]  **`nuxt-security` 모듈**을 설치하고 기본 헤더를 적용했는가?
- [ ]  서버 API에서 **Zod** 등을 이용해 입력값 검증(Validation)을 수행하는가?
- [ ]  SQL 쿼리 시 **Prisma(ORM)** 메서드를 사용하여 인젝션을 방지했는가?
- [ ]  `.env`의 비밀키가 `nuxt.config.ts`의 **`public` 영역에 잘못 들어가지 않았는가?**
- [ ]  인증 쿠키에 `HttpOnly`, `Secure`, `SameSite` 속성이 적용되었는가?

현재 진행 중인 프로젝트에 **`nuxt-security` 모듈**을 바로 적용해 보시는 것을 추천합니다.