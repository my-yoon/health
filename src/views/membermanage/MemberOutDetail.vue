<template>
    <section>
        <div class="ui-section">
            <subTitleBar :subTitle="'회원 정보'" />
            <div class="ui-content">
                <div class="tbl-wrap">
                    <table class="table reg">
                        <colgroup>
                            <col style="width: 160px;">
                            <col style="width: auto;">
                            <col style="width: 160px;">
                            <col style="width: auto;">
                        </colgroup>
                        <tbody>
                            <tr>
                                <th scope="row">회원번호</th>
                                <td colspan="3"> {{ state.memberOutDetail.mbrSn }}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
        <div class="ui-section">
            <subTitleBar :subTitle="'가입 및 이력 정보'" />
            <div class="ui-content">
                <div class="tbl-wrap">
                    <table class="table reg">
                        <colgroup>
                            <col style="width: 160px;">
                            <col style="width: auto;">
                            <col style="width: 160px;">
                            <col style="width: auto;">
                        </colgroup>
                        <tbody>
                            <tr>
                                <th scope="row">탈퇴일자</th>
                                <td> {{ dayJS(state.memberOutDetail.scsnDt).format('YYYY-MM-DD HH:mm') }}</td>
                                <th scope="row">탈퇴사유</th>
                                <td> {{ state.memberOutDetail.scsnRsn }}
                                    <br>
                                    {{ state.memberOutDetail.scsnRsnDesc }}
                                </td>
                            </tr>
                            <template v-if="state.memberOutDetail.frcdScsnYn === 'Y'">
                                <tr>
                                    <th scope="row">강제탈퇴사유</th>
                                    <td> {{ state.memberOutDetail.frcdScsnRsnCdNm }}</td>
                                    <th scope="row">강제탈퇴등록자</th>
                                    <td>{{ state.memberOutDetail.frcdScsnAdminNm }}</td>
                                </tr>
                                <tr>
                                    <th scope="row">강제탈퇴사유설명</th>
                                    <td colspan="3"> {{ state.memberOutDetail.frcdScsnRsn }}</td>
                                </tr>
                            </template>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
        <div class=" btn-bottom-set flex justify-center">
            <button type="button" class="btn btn-sl nega" @click="goToPage('/member/ban/list')">
                목록으로
            </button>
        </div>
    </section>
</template>
<script>
import { reactive, inject, onMounted, ref, computed } from 'vue';
import { useCommFunc } from '@/core/helper/common.js';
import { useStore } from 'vuex';
import { _memberOutDetail } from '@/api/memberinfo.js';
import { useRouter, useRoute } from 'vue-router';

export default {
    setup() {
        const $Modal = inject('$Modal');
        const dayJS = inject('dayJS');
        const { goToPage, fileDown, tableResize, openModal, isPartnerShow, isDownShow, isImgShow, isRequestShow } = useCommFunc();
        const store = useStore();
        const route = useRoute();
        const state = reactive({
            memberOutDetail: {},
            pagesize: 10,
            mskgnRlsYn: 'N',
            detailNum: ''
        });

        onMounted(() => {
            console.log(route.query);
            state.detailNum = route.query.mbrSn;
            state.mskgnRlsYn = route.query.mskgnRlsYn;
            memberOutDetail();
        });

        // 상세
        const memberOutDetail = async () => {
            try {
                const response = await _memberOutDetail(state.detailNum);
                console.log(response.data);
                state.memberOutDetail = response.data.data;
            } catch (error) {
                console.log(error);
            }
        };

        return {
            //공통 사용
            _,
            $Modal,
            dayJS,
            goToPage,
            state
        };
    }
};
</script>