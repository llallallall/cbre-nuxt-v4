// app/stores/user.ts

import { defineStore } from 'pinia'
import type { ProfileType, UserType } from '../types/user.type'

// =========================================================================
// 1. 상태(State) 정의
// =========================================================================

export const useUserStore = defineStore('user', {
    state: () => ({

        isLogin: false,

        // id
        userId: '' as string,
        userName: '' as string | null, // 💡 [추가] 사용자 이름
        userEmail: '' as string | null, // [추가] 사용자 이메일
        role: '' as string | null, // [추가] 사용자 권한
        // detail
        userImage: '' as string, // 프론트엔드 표시용 이미지 URL

        // id (필요한 경우에만 유지)
        userPassword: '' as string,

        // profile: ProfileType 구조에 맞게 초기화
        profile: {
            id: null,
            userId: null,

            imageUrl: null, // DB의 image_url 대응
            company: null,
            branch: null,
            department: null,
            title: null,

            useProfileImage: false, // DB의 use_profile_image 대응
        } as ProfileType, // 타입 단언

        // 기타 상태: 사용자 목록
        allUsers: [] as UserType[],

    }),

    // -------------------------------------------------------------------------
    // 2. Getters 
    // -------------------------------------------------------------------------
    getters: {
        // 기본 로그인 상태
        getIsLogin: (state) => state.isLogin,

        // ID 및 비밀번호
        getUserId: (state) => state.userId,
        getUserName: (state) => state.userName,
        getUserEmail: (state) => state.userEmail,
        getUserRole: (state) => state.role,
        getUserPassword: (state) => state.userPassword,

        // 이미지 URL
        getUserImage: (state) => state.userImage,

        // Profile 상세 정보
        getProfile: (state) => state.profile,
        getProfileId: (state) => state.profile.id,

        getProfileCompany: (state) => state.profile.company,
        getProfileBranch: (state) => state.profile.branch,
        getProfileDepartment: (state) => state.profile.department,
        getProfileTitle: (state) => state.profile.title,
        getProfileImageUrl: (state) => state.profile.imageUrl,
        getProfileUseProfileImage: (state) => state.profile.useProfileImage,

        // 사용자 목록
        getAllUsers: (state) => state.allUsers,
    },

    // -------------------------------------------------------------------------
    // 3. Actions 
    // -------------------------------------------------------------------------
    actions: {
        setLogin(status: boolean) {
            this.isLogin = status
        },

        setUserId(id: string) {
            this.userId = id
        },

        setUserName(name: string) {
            this.userName = name;
        },

        /**
         * @description Profile 정보 업데이트
         */
        updateProfile(newProfile: Partial<ProfileType>) {
            this.profile = {
                ...this.profile,
                ...newProfile,
            } as ProfileType;

            // userImage 갱신
            if (newProfile.imageUrl !== undefined) {
                this.userImage = newProfile.imageUrl || '/images/avatar/avatar-placeholder.png';
            }
        },

        /**
         * @description 인증 상태를 확인하고, DB에서 상세 Profile 정보를 가져와 Store 상태를 갱신합니다.
         */
        async getUser() {
            const { user, loggedIn } = useUserSession()

            // 1. 로그인 상태 확인
            if (!loggedIn.value || !user.value) {
                this.isLogin = false
                this.userId = ''
                this.userName = ''
                return false
            }

            try {
                // 2. 인증 상태는 확인했으니 isLogin을 true로 설정
                this.isLogin = true

                // 3. API를 통해 DB에 저장된 상세 Profile 정보를 가져옵니다.
                const headers = useRequestHeaders(['cookie']);
                const apiResponse = await $fetch<UserType>('/api/user/profile', {
                    method: 'GET',
                    query: { id: user.value.id },
                    headers
                })

                if (apiResponse) {
                    const fullUser = apiResponse
                    const newProfile = fullUser.profile

                    // 🎯 API 응답에서 userId를 가져와 설정 (최고의 안정성)
                    this.userId = fullUser.id ?? ''
                    this.userName = fullUser.name ?? ''
                    this.userEmail = fullUser.email ?? ''
                    this.role = fullUser.role ?? ''

                    // Profile 상태 갱신
                    if (newProfile) {
                        this.profile = {
                            ...this.profile,
                            ...newProfile,
                        } as ProfileType
                    }

                    // 4. userImage (프론트엔드 표시용) 로직 갱신
                    const dbImageUrl = this.profile.imageUrl;

                    if (dbImageUrl) {
                        this.userImage = dbImageUrl
                    } else if (user.value.image) {
                        // 세션의 image 필드(OAuth 이미지 등)는 접근 가능
                        this.userImage = user.value.image
                    } else {
                        this.userImage = '/images/avatar/avatar-placeholder.png'
                    }
                }

                return true

            } catch (error) {
                console.error('getUser failed:', error)
                this.isLogin = false
                this.userId = ''
                return false
            }
        },

        /**
         * @description 모든 사용자 목록을 가져와 allUsers 상태를 갱신합니다.
         */
        async fetchUsers() {
            try {
                let res = await useFetch<UserType[]>("/api/user/allusers", {
                    method: "GET"
                })

                if (res.data.value) {
                    this.allUsers = res.data.value as UserType[]
                } else {
                    this.allUsers = []
                }

                return true

            } catch (error) {
                console.error('getAllUsers failed:', error)
                return error
            }
        },
    },
})
