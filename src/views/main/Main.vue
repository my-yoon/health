<template>
    <div>
        <!-- {{ userInfo }} -->
        <div class="tbl-wrap" v-if="state.userInfo">
            <table class="table reg" style="width:100%;">
                <colgroup>
                    <col style="width: 160px;">
                    <col style="width: auto;">
                </colgroup>
                <tbody>
                    <tr>
                        <th scope="row">refreshToken</th>
                        <td>{{ state.userInfo.refreshToken }}</td>
                    </tr>
                    <tr>
                        <th scope="row">accessToken</th>
                        <td>{{ state.userInfo.accessToken }}</td>
                    </tr>
                    <tr>
                        <th scope="row">어드민 레벨</th>
                        <td>{{ state.userInfo.admnLvlId }}</td>
                    </tr>
                    <tr>
                        <th scope="row">어드민 순번</th>
                        <td>{{ state.userInfo.admnSn }}</td>
                    </tr>
                    <tr>
                        <th scope="row">관리자포탈사이트코드</th>
                        <td>{{ state.userInfo.admnPtalSitCd }}</td>
                    </tr>
                    <tr>
                        <th scope="row">이름</th>
                        <td>{{ state.userInfo.admnNm }}</td>
                    </tr>
                    <tr>
                        <th scope="row">이메일</th>
                        <td>{{ state.userInfo.admnEmad }}</td>
                    </tr>
                    <tr>
                        <th scope="row">권한구분코드</th>
                        <td>{{ state.userInfo.authSeCd }}</td>
                    </tr>

                </tbody>
            </table>
        </div>
    </div>
</template>
<script>
import { useStore } from 'vuex';
import { reactive, onMounted, watch, computed } from 'vue';
import { useRouter, useRoute } from 'vue-router';

export default {
    setup() {
        const store = useStore();
        const router = useRouter();
        const route = useRoute();
        const state = reactive({
            username: '',
            userpass: '',
            userInfo: {}
        });
        onMounted(() => {
            state.userInfo = JSON.parse(localStorage.getItem('USERINFO'));
        });
        watch(route, () => {
            console.log(route);
        });
        return {
            state
        };
    }
};
</script>