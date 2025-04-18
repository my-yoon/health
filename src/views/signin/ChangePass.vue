<template>
    <div class="ui-login-wrap">
        <div class="ui-login-content">
            <div class="ui-login-intro">
                <SignVisual />
                <div class="ui-login-form">
                    <div class="ui-login-form-align">
                        <template>
                            <div class="ui-login-form-head">
                                <h3>비밀번호 변경</h3>
                                <p>임시 비밀번호를 이용한 접속시 비밀번호를 변경해야 합니다.</p>
                                <p>새로운 비밀번호를 설정해주세요.</p>
                            </div>
                            <div class="ui-login-form-content">
                                <div class="ui-login-form-item">
                                    <label for="userID">신규 비밀번호</label>
                                    <div class="reg-group">
                                        <div class="reg-item">
                                            <input type="password" class="form-control" placeholder="신규 비밀번호를 입력하세요.">
                                        </div>
                                    </div>
                                </div>
                                <div class="ui-login-form-item">
                                    <label for="userID">신규 비밀번호 확인</label>
                                    <div class="reg-group">
                                        <div class="reg-item">
                                            <input type="password" class="form-control" placeholder="신규 비밀번호를 입력하세요.">
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="btn-bottom-set mt-40">
                                <button type="button" class="btn btn-sl posi full">변경하기</button>
                            </div>
                        </template>
                        <template>
                            <div class="ui-login-form-head">
                                <h3>비밀번호 변경 완료</h3>
                                <p>비밀번호 변경이 완료되었습니다.<br>새로운 비밀번호로 로그인 하세요.</p>
                            </div>
                            <div class="btn-bottom-set mt-40">
                                <button type="button" class="btn btn-sl posi full">로그인</button>
                            </div>
                        </template>
                        <template>
                            <div class="ui-login-form-head">
                                <h3>비밀번호 변경</h3>
                            </div>
                            <div class="ui-login-message">
                                <p>비밀번호 변경이 완료되었습니다.<br>새로운 비밀번호로 로그인하세요.</p>
                            </div>
                            <div class="btn-bottom-set mt-40">
                                <button type="button" class="btn btn-sl posi full">로그인</button>
                            </div>
                        </template>
                        <template>
                            <div class="ui-login-form-head">
                                <h3>비밀번호 변경</h3>
                            </div>
                            <div class="ui-login-message">
                                <p>유효하지 않은 주소입니다.<br>인증시간이 초과되었거나, 만료된 주소입니다.</p>
                            </div>
                            <div class="btn-bottom-set mt-40">
                                <button type="button" class="btn btn-sl posi full">파트너 어드민 포탈로 이동</button>
                            </div>
                        </template>


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

        });

        return {
            state,
            userId,
            userPass,
            isLogin
        };
    }
};
</script>