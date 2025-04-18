const getMenuItem = {
    namespaced: true,
    state: {
        menuInfo: {
            menuCode: '',
            auth1RegistYn: '',
            auth2UpdateYn: '',
            auth3DeleteYn: '',
            auth4ApproveYn: '',
            auth5DownloadYn: '',
            auth6MaskingYn: ''
        }
    },
    mutations: {
        SET_MENU_INFO(state, data) {
            state.menuInfo = {
                menuCode: data.menuCode,
                auth1RegistYn: data.auth1RegistYn,
                auth2UpdateYn: data.auth2UpdateYn,
                auth3DeleteYn: data.auth3DeleteYn,
                auth4ApproveYn: data.auth4ApproveYn,
                auth5DownloadYn: data.auth5DownloadYn,
                auth6MaskingYn: data.auth6MaskingYn
            };
        }

    },
    actions: {
        saveMenu(context, value) {
            context.commit('SET_MENU_INFO', value);
        }
    }
};
export default getMenuItem;