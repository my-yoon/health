<template>
    <div class="ui-login-wrap">
        <div class="ui-login-content">
            <div class="ui-login-intro">
                <SignVisual />
                <div class="ui-login-form">
                    <div class="ui-login-form-align">
                        <div class="ui-login-form-head">
                            <h3>비밀번호 찾기</h3>
                            <p>아이디 입력 후 등록된 이메일을 통해 새로운 비밀번호를 설정 할 수 있습니다.</p>
                        </div>
                        <div class="ui-login-form-content">
                            <div class="ui-login-form-item">
                                <label for="userID">아이디</label>
                                <div class="reg-item">
                                    <input type="text" id="userID" class="form-control" placeholder="아이디를 입력하세요.">
                                </div>
                            </div>
                        </div>
                        <div class="ui-login-message">
                            <p>등록되어 있는 이메일 주소로 비밀번호 변경링크가 발송되었습니다.</p>
                        </div>
                        <div class="btn-bottom-set mt-40">
                            <button type="button" class="btn btn-sl posi full">이메일 요청</button>
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