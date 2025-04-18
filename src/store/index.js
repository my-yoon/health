import { createStore } from 'vuex';
import moduleA from './modules/moduleA';
import authModule from './modules/auth';
import tokenLogin from './modules/token';
import healthnews from './modules/healthnews';
import getMenuItem from './modules/menu';

const store = createStore({
    namespaced: true,
    modules: {
        authModule,
        moduleA,
        tokenLogin,
        healthnews,
        getMenuItem
    }
});

export default store;
