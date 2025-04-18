<template>
    <div>
        <div class="ui-section">
            <subTitleBar :subTitle="''" :ess="'표시는 필수항목입니다.'" />
            <!-- {{ state.bannerDetail }} -->
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
                                <td>{{ state.bannerDetail.bnrNm }}</td>
                                <th scope="row">배너코드<span class="ess"><span class="offscreen">필수입력</span></span></th>
                                <td>{{ state.bannerDetail.bnrTySeNm }}</td>
                            </tr>
                            <tr>
                                <th scope="row">배너유형<span class="ess"><span class="offscreen">필수입력</span></span></th>
                                <td colspan="3">{{ state.bannerDetail.bnrTySeNm }}</td>
                            </tr>
                            <tr>
                                <th scope="row">노출위치<span class="ess"><span class="offscreen">필수입력</span></span></th>
                                <td colspan="3">{{ state.bannerDetail.bnrIndnLctDtlSeNm }} /{{
                                    state.bannerDetail.bnrIndnLctSeNm }}</td>
                            </tr>
                            <tr>
                                <th scope="row">노출상태<span class="ess"><span class="offscreen">필수입력</span></span></th>
                                <td colspan="3">
                                    {{ state.bannerDetail.bnrIndnStSeNm }}/
                                    {{ dayJS(state.bannerDetail.bnrIndnBgnDt).format('YYYY-MM-DD') }} ~
                                    {{ dayJS(state.bannerDetail.bnrIndnEndDt).format('YYYY-MM-DD') }}/
                                    {{ state.bannerDetail.bnrPrgStSeNm }}
                                </td>
                            </tr>
                            <tr>
                                <th scope="row">배너 이미지<span class="ess"><span class="offscreen">필수입력</span></span></th>
                                <td><img :src="state.bannerDetail.imgFlUrl" /></td>
                                <th scope="row">이미지 설명<span class="ess"><span class="offscreen">필수입력</span></span></th>
                                <td>{{ state.bannerDetail.imgDscr }}</td>
                            </tr>
                            <tr>
                                <th scope="row">랜딩URL<span class="ess"><span class="offscreen">필수입력</span></span></th>
                                <td colspan="3">
                                    <template v-if="state.bannerDetail.bnrLndSeCd === '272002'">
                                        {{ state.bannerDetail.bnrLndSeNm }}/{{ state.bannerDetail.bnrLndTtl }}
                                    </template>
                                    <template v-else>
                                        {{ state.bannerDetail.bnrLndUrl }}
                                    </template>

                                </td>
                            </tr>
                            <tr>
                                <th scope="row">등록자<span class="ess"><span class="offscreen">필수입력</span></span></th>
                                <td>{{ state.bannerDetail.fstRgtrNm }}</td>
                                <th scope="row">등록일자<span class="ess"><span class="offscreen">필수입력</span></span></th>
                                <td>{{ state.bannerDetail.fstRgtrDt }}</td>
                            </tr>
                            <tr>
                                <th scope="row">수정자<span class="ess"><span class="offscreen">필수입력</span></span></th>
                                <td>{{ state.bannerDetail.lastUpdrNm }}</td>
                                <th scope="row">수정일자<span class="ess"><span class="offscreen">필수입력</span></span></th>
                                <td>{{ state.bannerDetail.lastUpdrDt }}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
        <div class="btn-bottom-set flex justify-center">
            <button type="button" class="btn btn-sl nega" @click="goToPage('/display/banner/list')">목록</button>
            <button type="button" class="btn btn-sl posi" @click="onChangeAuthDel">삭제</button>
            <button type="button" class="btn btn-sl posi" @click="onChangeAuthEdit">수정</button>
        </div>
    </div>
</template>
<script>
import { reactive, inject, ref, onMounted, onUnmounted, computed } from 'vue';
import DefaultModal from '@/plugins/modal/modal/DefaultModal.vue';
import { useCommFunc } from '@/core/helper/common.js';
import { authCommFunc } from '@/core/helper/authComm.js';
import { useStore } from 'vuex';
import { useRouter, useRoute } from 'vue-router';
import { _detailExhibitBanner, _delExhibitBanner } from '@/api/exhibit.js';

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
            exhbBnrMngSn: '',
            bannerDetail: {},
            modalMsg: ''
        });
        const menuInfo = computed(() => store.state.getMenuItem.menuInfo);
        const { onChangeEditRol, onChangeDelRol } = authCommFunc();
        onMounted(() => {
            state.bannerSn = route.query.sn;
            state.exhbBnrMngSn = route.query.exhbBnrMngSn;
            console.log(state.bannerSn);
            detailExhibitBanner();
            emitter.$on('onChangeEdit', onChangeEdit);
            emitter.$on('onChangeDel', onChangeDel);
        });

        onUnmounted(() => {
            emitter.$off('onChangeEdit');
            emitter.$off('onChangeDel');
        });

        const detailExhibitBanner = async () => {
            try {
                let params = state.exhbBnrMngSn;
                const response = await _detailExhibitBanner(params);
                console.log(response);
                state.bannerDetail = response.data.data;

            } catch (error) {
                console.log(error);
            }
        };
        const delExhibitBanner = async () => {
            try {
                let params = state.bannerSn;
                const response = await _delExhibitBanner(params);
                console.log(response.data.code);
                if (response.data.code === 'OK') {
                    goToPage('/display/banner/list');
                }
            } catch (error) {
                console.log(error);
            }
        };

        //수정권한 처리
        const onChangeAuthEdit = async () => {
            await onChangeEditRol(menuInfo.value.auth2UpdateYn);
        };
        //삭제권한 처리
        const onChangeAuthDel = async () => {
            console.log(menuInfo.value.auth3DeleteYn);
            await onChangeDelRol(menuInfo.value.auth3DeleteYn);
        };

        const onChangeEdit = () => {
            actionBtns('edit');
        };
        const onChangeDel = () => {
            actionBtns('del');
        };

        //모달창열기 
        const actionBtns = async (type) => {
            if (type === 'del') {
                state.modalMsg = '삭제 하시겠습니까?';
            }
            if (type === 'edit') {
                state.modalMsg = '수정하시겠습니까?';
            }
            $Modal.confirm({
                title: '',
                message: state.modalMsg,

                buttonText: {
                    confirm: '확인',
                    cancel: '취소'
                }
            })
                .then(async (success) => {
                    console.log(success);
                    if (type === 'del') {
                        await delExhibitBanner();
                    }
                    if (type === 'edit') {
                        console.log('수정');
                        goToPage(`/display/banner/regist?sn=${state.bannerSn}&exhbBnrMngSn=${state.exhbBnrMngSn}`);
                    }
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
            actionBtns,
            onChangeAuthDel,
            onChangeAuthEdit
        };
    }
};
</script>