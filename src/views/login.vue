<template>
    <div class="login-page">
        <div id="loading" class="ui-loading" style="display: flex; z-index: 100;">
            <div class="ui-loading-spinner">
                <svg class="svg-loading-spinner" viewBox="25 25 50 50">
                    <circle class="svg-loading-spinner-circle" cx="50" cy="50" r="20" fill="none" stroke-width="2"
                        stroke-miterlimit="10"></circle>
                </svg>
            </div>
        </div>
    </div>
    <div v-if="state.modal" role="dialog" tabindex="-1" aria-modal="true" aria-label="Modal window" class="vue-universal-modal vue-universal-modal-show vue-universal-modal-latest" style="transition-duration: 0.3s; z-index: 100000">
        <div class="vue-universal-modal-content" style="transition-duration: 0.3s;">
            <div class="ui-alert">
                <div class="ui-alert-wrap">
                    <div class="ui-alert-body">
                        <p class="ui-alert-msg">유효하지 않은 인증코드 입니다. 다시 로그인 하십시요.</p>
                    </div>
                    <div class="ui-alert-footer">
                        <div class="btn-bottom-set flex justify-center">
                            <button type="button" class="btn btn-alert" @click="goLogin">로그인 하러가기</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    
</template>
<script>
import { _getaccessToken } from '@/api/dashboard.js';
import { reactive, onMounted, computed, inject } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useStore } from 'vuex';

export default {
    setup() {
        const router = useRouter();
        const tokenInfo = computed(() => store.state.tokenLogin);
        const store = useStore();
        const route = useRoute();
        const dayJS = inject('dayJS');

        const state = reactive({
            authorCode: '',
            userInfo: {},
            modal: false
        });
        onMounted(() => {
            localStorage.clear();
            // 42249a1f-3387-4892-9eb9-fe1a98def59b
            getCodeLogin(route.query.code);
        });

        const getCodeLogin = async () => {
            try {
                let params = {
                    authorizationCode: route.query.code
                };
                if (route.query.code) {
                    const response = await _getaccessToken(params);
                    if (response.data.code == 'OK') {
                        let time = dayJS().format('YYYY-MM-DD HH:mm:ss');
                        state.userInfo = response.data.data;
                        localStorage.setItem('AUTH-TOKEN', state.userInfo.accessToken);
                        localStorage.setItem('admnSn', state.userInfo.admnSn);
                        localStorage.setItem('admnNm', state.userInfo.admnNm);
                        localStorage.setItem('loginTime', time);
                        localStorage.setItem('lastAccessTime', time);
                        router.push('/main');
                    } else {

                        console.log('>> login 하러가기');
                        state.modal = true;
                        //로그인 페이지로 이동
                        // window.location.href = `${import.meta.env.VITE_APP_KBADMIN_LOGIN_URL}`;
                    }

                } else {
                    // alert('로그인후 이용 가능합니다.');
                    //로그인 페이지로 이동
                    window.location.href = `${import.meta.env.VITE_APP_KBADMIN_LOGIN_URL}`;
                }
            } catch (error) {
                console.log(error);
            }
        };

        const goLogin = () => {
            window.location.href = `${import.meta.env.VITE_APP_KBADMIN_LOGIN_URL}`;
        };

        return {
            state,
            tokenInfo,
            getCodeLogin,
            dayJS,
            goLogin
        };
    }

};
</script>
