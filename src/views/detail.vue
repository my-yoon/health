<template>
    <div>
        <div class="ui-section">
            <subTitleBar :subTitle="'배너 관리 상세'" :ess="'표시는 필수항목입니다.'" />
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
                                <th scope="row">배너명<span class="ess"><span class="offscreen">필수입력</span></span></th>
                                <td></td>
                                <th scope="row">배너코드<span class="ess"><span class="offscreen">필수입력</span></span></th>
                                <td></td>
                            </tr>
                            <tr>
                                <th scope="row">배너유형<span class="ess"><span class="offscreen">필수입력</span></span></th>
                                <td colspan="3"></td>
                            </tr>
                            <tr>
                                <th scope="row">노출위치<span class="ess"><span class="offscreen">필수입력</span></span></th>
                                <td colspan="3"></td>
                            </tr>
                            <tr>
                                <th scope="row">노출상태<span class="ess"><span class="offscreen">필수입력</span></span></th>
                                <td colspan="3"></td>
                            </tr>
                            <tr>
                                <th scope="row">배너 이미지<span class="ess"><span class="offscreen">필수입력</span></span></th>
                                <td></td>
                                <th scope="row">이미지 설명<span class="ess"><span class="offscreen">필수입력</span></span></th>
                                <td></td>
                            </tr>
                            <tr>
                                <th scope="row">랜딩URL<span class="ess"><span class="offscreen">필수입력</span></span></th>
                                <td colspan="3"></td>
                            </tr>
                            <tr>
                                <th scope="row">등록자<span class="ess"><span class="offscreen">필수입력</span></span></th>
                                <td></td>
                                <th scope="row">등록일자<span class="ess"><span class="offscreen">필수입력</span></span></th>
                                <td></td>
                            </tr>
                            <tr>
                                <th scope="row">수정자<span class="ess"><span class="offscreen">필수입력</span></span></th>
                                <td></td>
                                <th scope="row">수정일자<span class="ess"><span class="offscreen">필수입력</span></span></th>
                                <td></td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import { reactive, inject, ref, onMounted } from 'vue';
import DefaultModal from '@/plugins/modal/modal/DefaultModal.vue';
import { useCommFunc } from '@/core/helper/common.js';
import { useStore } from 'vuex';
import { useRouter, useRoute } from 'vue-router';
import { _detailExhibitBanner } from '@/api/exhibit.js';
import { _fileDownload } from '@/api/common.js';

export default {
    components: { DefaultModal },
    setup() {
        const $Modal = inject('$Modal');
        const dayJS = inject('dayJS');
        const { goToPage, fileDown, tableResize, openModal, isPartnerShow, isDownShow, isImgShow, isRequestShow } = useCommFunc();
        const store = useStore();
        const route = useRoute();
        const state = reactive({
            bannerSn: '',
            bannerDetail: {}
        });
        onMounted(() => {
            state.bannerSn = route.query.sn;
            console.log(state.bannerSn);
            detailExhibitBanner();
        });

        const detailExhibitBanner = async () => {
            try {
                let params = state.bannerSn;
                const response = await _detailExhibitBanner(params);
                console.log(response);
                state.bannerDetail = response.data.data;

            } catch (error) {
                console.log(error);
            }
        };

        const fileDownload = async (params) => {
            console.log(params);
            try {
                const response = await _fileDownload(params);
                const blob = new Blob([response.data], { type: response.headers['content-type'] });
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                console.log(url);
                const match = /filename="(.+?)"/.exec([response.headers['content-disposition']]);
                a.href = url;
                a.download = match ? match[1] : null;
                a.click();
                a.remove();
                window.URL.revokeObjectURL(url);
            } catch (error) {
                console.log(error);
            }
        };

        //모달창열기 
        const actionBtns = async (type) => {
            if (type === 'stop') {
                state.modalMsg = '긴급종료 하시겠습니까?';
            }
            $Modal.confirm({
                title: '',
                message: state.modalMsg,

                buttonText: {
                    confirm: '확인',
                    cancel: '취소'
                }
            })
                .then(success => {
                    console.log(success);
                    eventStop();
                })
                .catch(error => {
                    console.log(error);
                });
        };
        // 모달창 닫기
        const modalControl = (type, modalName) => {
            if (modalName === 'isFullImg') {
                isFullImg.value = false;
            } else if (!modalName) {
                isFullImg.value = false;
            }
        };

        return {
            //공통 사용
            $Modal,
            dayJS,
            goToPage,
            fileDown,
            tableResize,
            isDownShow,
            isPartnerShow,
            isImgShow,
            isRequestShow,
            state,
            openModal,
            modalControl,
            fileDownload,
            actionBtns
        };
    }
};
</script>