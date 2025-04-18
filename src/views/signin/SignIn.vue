<template>
    <div class="ui-login-wrap">
        <div class="ui-login-content">
            <div class="ui-login-intro">
                <SignVisual />
                <div class="ui-login-form">
                    <div class="ui-login-form-align">
                        <div class="ui-login-form-head">
                            <h3>로그인</h3>
                            <p>아이디와 비밀번호를 입력해주세요</p>
                        </div>
                        <div class="ui-login-form-content">
                            <div class="ui-login-form-item">
                                <label for="userID">아이디</label>
                                <div class="reg-item">
                                    <input type="text" id="userID" class="form-control" placeholder="아이디를 입력하세요."
                                        v-model="state.userId">
                                </div>
                                {{ state.userId }}
                            </div>
                            <div class="ui-login-form-item">
                                <label for="userPW">비밀번호</label>
                                <div class="reg-item">
                                    <input type="password" id="userPW" class="form-control" placeholder="비밀번호를 입력하세요."
                                        v-model="state.userPassword">
                                </div>
                                <span class="input-guide error mt-6">5회 로그인 실패시 접속이 제한됩니다.(3/5)</span>
                            </div>
                            <div class="ui-login-form-item mt-12">
                                <span class="checkbox">
                                    <input id="idSave" name="idSaveGroup" type="checkbox">
                                    <label for="idSave">아이디 저장</label>
                                </span>
                            </div>
                        </div>
                        <div class="btn-bottom-set mt-40">
                            <button type="button" class="btn btn-sl posi full" @click="signIn">로그인</button>
                        </div>
                        <div class="ui-login-util">
                            <ul>
                                <!-- <li>
                                    <button type="button" class="ui-login-util-item">가입신청</button>
                                </li> -->
                                <li>
                                    <button type="button" class="ui-login-util-item">아이디 찾기</button>
                                </li>
                                <li>
                                    <button type="button" class="ui-login-util-item">비밀번호 찾기</button>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <SignFooter />
    </div>
</template>
<script>
import { reactive, computed } from 'vue';
import { useStore } from 'vuex';
import { useRouter, useRoute } from 'vue-router';
import SignVisual from './components/SignVisual.vue';
import SignFooter from './components/SignFooter.vue';
export default {
    components: { SignVisual, SignFooter },
    setup() {
        const router = useRouter();
        const route = useRoute();
        const store = useStore();
        const userId = computed(() => store.state.authModule.userId);
        const userPass = computed(() => store.state.authModule.userPass);
        const isLogin = computed(() => store.state.authModule.isLogin);
        const state = reactive({
            userId: '',
            userPassword: ''
        });

        const signIn = () => {
            store
                .dispatch('authModule/loginAction', { id: state.userId, pass: state.userPassword });
            //임시처리
            setTimeout(() => {
                router.push('/main');
            }, 1000);
            // .then((data) => {
            //     //로그인 성공 처리  
            //     console.log(data);
            //     router.push('페이지 이동처리');
            // }).catch((data) => {
            //     //로그인 실패 or 오류 처리
            // });
        };
        const signOut = () => {
            store
                .dispatch('authModule/logoutAction', { id: '', pass: '' });
            // .then((data) => {
            //     //로그아웃 성공 처리  
            //     console.log(data);
            // }).catch((data) => {
            //     //로그아웃 실패 or 오류 처리
            // });
        };
        return {
            state,
            userId,
            userPass,
            isLogin,
            signIn,
            signOut
        };
    }
};
</script>