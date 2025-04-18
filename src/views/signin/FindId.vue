<template>
    <div class="ui-login-wrap">
        <div class="ui-login-content">
            <div class="ui-login-intro">
                <SignVisual />
                <div class="ui-login-form">
                    <div class="ui-login-form-align">
                        <div class="ui-login-form-head">
                            <h3>아이디 찾기</h3>
                            <p>회원정보에 등록한 휴대전화 번호로 아이디를 찾을 수 있습니다.</p>
                            <p>입력하신 정보와 일치하는 아이디 정보입니다.</p>
                        </div>
                        <div class="ui-login-form-content">
                            <div class="ui-login-form-item">
                                <label for="userID">이름</label>
                                <div class="reg-item">
                                    <input type="text" id="userID" class="form-control" placeholder="이름을 입력하세요.">
                                </div>
                            </div>
                            <div class="ui-login-form-item">
                                <label for="userMobile">휴대전화번호</label>
                                <div class="reg-group">
                                    <div class="reg-item wp-70">
                                        <input type="text" id="userMobile" class="form-control"
                                            placeholder="휴대전화번호를 입력해 주세요.">
                                    </div>
                                    <div class="reg-item wp-30">
                                        <button type="button" class="btn btn-slm" disabled="">인증</button>
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
                                <span class="input-guide">인증번호가 오지 않나요?</span>
                            </div>
                        </div>
                        <div class="ui-login-message">
                            <p>John2345 <strong class="fc-2">ㅇㅇ기업</strong> (가입일 2022-02-20)</p>
                        </div>
                        <div class="btn-bottom-set flex mt-40">
                            <button type="button" class="btn btn-sl nega full">취소</button>
                            <button type="button" class="btn btn-sl posi full" disabled="">확인</button>
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