<template>
    <div class="ui-login-wrap">
        <div class="ui-login-content">
            <div class="ui-login-intro">
                <SignVisual />
                <div class="ui-login-form">
                    <div class="ui-login-form-align">
                        <div class="ui-login-form-head">
                            <h3>휴대전화번호 인증</h3>
                        </div>
                        <div class="ui-login-form-content">
                            <div class="ui-login-form-item">
                                <label for="userMobile">휴대전화번호</label>
                                <div class="reg-group">
                                    <div class="reg-item wp-70">
                                        <input type="text" id="userMobile" class="form-control"
                                            placeholder="휴대전화번호를 입력해 주세요.">
                                    </div>
                                    <div class="reg-item wp-30">
                                        <button type="button" class="btn btn-slm" disabled>인증</button>
                                    </div>
                                </div>
                                <div class="reg-group">
                                    <div class="reg-item wp-70">
                                        <input type="text" class="form-control" placeholder="인증번호를 입력하세요">
                                    </div>
                                    <div class="reg-item wp-30">
                                        <button type="button" class="btn btn-slm">확인</button>
                                    </div>
                                </div>
                                <span class="input-timer">인증유효시간 <strong>00:00</strong></span>
                                <span class="input-guide">휴대전화번호 변경이 필요하시나요?</span>
                                <span class="input-guide">인증번호가 오지 않나요?</span>
                            </div>
                        </div>
                        <div class="btn-bottom-set mt-40">
                            <button type="button" class="btn btn-sl posi full" disabled>확인</button>
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