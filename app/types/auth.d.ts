// ~/app/types/auth.d.ts

// 'nuxt-auth-utils'의 타입을 확장합니다.

// ----------------------------------------------------------------------
// 1. 세션에 포함된 Profile 데이터의 타입 정의
// ----------------------------------------------------------------------

/**
 * @description DB Profile 모델 필드를 세션에 추가할 때 사용되는 타입 (snake_case 기반)
 */
export type SessionProfile = {
    image_url: string | null;
    company: string | null;
    branch: string | null;
    department: string | null;
    title: string | null;
    use_profile_image: boolean;
}


declare module '#auth-utils' {

    // ------------------------------------------------------------------
    // 2. User (Session User) 타입 확장
    // ------------------------------------------------------------------

    interface User {
        id: string; // 사용자 ID (DB Primary Key)
        name: string;
        email: string;
        role: string; // 사용자 권한
        image?: string; // Explicitly add image property

        // 서버에서 세션에 직접 추가한 Profile 관계 데이터
        profile?: SessionProfile;
    }

    interface UserSession {
        user: User;
    }
}
