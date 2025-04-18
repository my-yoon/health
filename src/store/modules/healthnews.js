const healthnews = {
    namespaced: true,
    state: {
        ctntsMngState: null
    },
    mutations: {
        setCtntsMngState(state, value) {
            state.ctntsMngState = value;
        },
        setIsGridColumnSizeToFit(state, value) {
            state.ctntsMngState.isGridColumnSizeToFit = value;
        }
    }
};
export default healthnews;