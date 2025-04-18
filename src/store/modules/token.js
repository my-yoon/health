const tokenLogin = {
    namespaced: true,
    state: {
        tokenInfo: {

        }
    },
    // 
    mutations: {
        SET_TOKEN_INFO(state, data) {
            state.tokenInfo = data;
        }
    },
    actions: {
        saveToken(context, value) {

            context.commit('SET_TOKEN_INFO', value);
            localStorage.setItem('SET_TOKEN_INFO', JSON.stringify(value));
        }
    }
};
export default tokenLogin;