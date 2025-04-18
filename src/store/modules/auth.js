const authModule = {
    namespaced: true,
    state: {
        isLogin: false,
        userId: '',
        userPass: '',
        userInfomation: {}
    },
    getters: {
        userInfo(state) {
            return state;
        }
    },
    mutations: {
        SET_USER_INFOMATION(state, payload) {
            state.userInfomation = payload;
        },
        SET_USER_INFO(state, data) {
            state.isLogin = true;
            state.userId = data.id;
            state.userPass = data.pass;
        },
        SET_USER_RESET(state, data) {
            state.isLogin = false;
            state.userId = data.id;
            state.userPass = data.id;
        },
        SET_USER_ERROR(state, errordata) {
            state.isLogin = false;
            state.userId = data.id;
            console.log(errordata);
        }
    },
    actions: {
        setUserInfo(context, value) {
            context.commit('SET_USER_INFOMATION', value);
        },
        loginAction(context, value) {
            // value 여기서 키 암호화 로직
            const params = {
                ...value
            };
            // 로그인 임시처리
            console.log(value);
            context.commit('SET_USER_INFO', params);
            localStorage.setItem('userInfo', JSON.stringify(params));
            //로그인 API 호출
            // return new Promise((resolve, reject) => {
            //     login(params)
            //         .then((res) => {
            //             if (res.data.code === 200) {
            //                 // 실행 결과 값을 가지고 뮤테이션 호출
            //                 context.commit(Mutations.SET_USER_INFO, res.data.data);
            //                 localStorage.setItem('userInfo', JSON.stringify(res.data.data));
            //                 resolve(res.data.data);
            //             } else {
            //                 // 에러케이스
            //                 context.commit(Mutations.SET_USER_ERROR, res.data);
            //                 reject(res.data);
            //             }
            //         })
            //         .catch((error) => {
            //             // 예외 처리 시 값을 반환합니다.
            //             context.commit(Mutations.SET_USER_ERROR, error);
            //             reject(error);
            //         });
            // });
        },
        logoutAction(context, value) {
            const params = {
                ...value
            };
            context.commit('SET_USER_RESET', params);
            localStorage.setItem('userInfo', JSON.stringify(params));
            //로그아웃 API 호출
            // return new Promise((resolve, reject) => {
            //     login(params)
            //         .then((res) => {
            //             if (res.data.code === 200) {
            //                 // 실행 결과 값을 가지고 뮤테이션 호출
            //                 context.commit(Mutations.SET_USER_INFO, res.data.data);
            //                 localStorage.setItem('userInfo', JSON.stringify(res.data.data));
            //                 resolve(res.data.data);
            //             } else {
            //                 // 에러케이스
            //                 context.commit(Mutations.SET_USER_ERROR, res.data);
            //                 reject(res.data);
            //             }
            //         })
            //         .catch((error) => {
            //             // 예외 처리 시 값을 반환합니다.
            //             context.commit(Mutations.SET_USER_ERROR, error);
            //             reject(error);
            //         });
            // });

        }
    }

};
export default authModule;