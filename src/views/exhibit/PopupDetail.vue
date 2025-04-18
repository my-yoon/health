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
                                <th scope="row">제목<span class="ess"><span class="offscreen">필수입력</span></span></th>
                                <td>{{ state.bannerDetail.ttl }}</td>
                                <th scope="row">팝업코드<span class="ess"><span class="offscreen">필수입력</span></span></th>
                                <td>{{ state.bannerDetail.popupTySeCd }}</td>
                            </tr>
                            <tr>
                                <th scope="row">팝업유형<span class="ess"><span class="offscreen">필수입력</span></span></th>
                                <td colspan="3">{{ state.bannerDetail.popupTySeNm }}</td>
                            </tr>
                            <tr>
                                <th scope="row">노출위치<span class="ess"><span class="offscreen">필수입력</span></span></th>
                                <td colspan="3">{{ state.bannerDetail.popupIndnLctSeNm }}</td>
                            </tr>
                            <tr>
                                <th scope="row">노출상태<span class="ess"><span class="offscreen">필수입력</span></span></th>
                                <td colspan="3">
                                    {{ state.bannerDetail.popupIndnStSeNm }}/
                                    {{ state.bannerDetail.popupIndnBgnDt }} ~ {{ state.bannerDetail.popupIndnEndDt }}/
                                    {{ state.bannerDetail.popupPrgStSeNm }}
                                </td>
                            </tr>
                            <tr>
                                <th scope="row">팝업내용<span class="ess"><span class="offscreen">필수입력</span></span></th>
                                <td colspan="3">
                                    <div class="tbl-wrap" v-if="state.bannerDetail.ctsImgYn === 'Y'">
                                        <table class="table reg">
                                            <colgroup>
                                                <col style="width: 160px;">
                                                <col style="width: auto;">
                                            </colgroup>
                                            <tbody>
                                                <tr>
                                                    <th scope="row">
                                                        이미지
                                                        <span class="ess"><span class="offscreen">필수입력</span></span>
                                                    </th>
                                                    <td>
                                                        <div class="w-350">
                                                            <img :src="state.bannerDetail.imgFlUrl" />
                                                        </div>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <th scope="row">
                                                        이미지 설명
                                                        <span class="ess"><span class="offscreen">필수입력</span></span>
                                                    </th>
                                                    <td>
                                                        {{ state.bannerDetail.imgDscr }}
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <th scope="row">
                                                        랜딩URL
                                                        <span class="ess"><span class="offscreen">필수입력</span></span>
                                                    </th>
                                                    <td>
                                                        {{ state.bannerDetail.bnrLndSeNm }} /{{
                                                            state.bannerDetail.bnrLndTtl
                                                        }}/{{ state.bannerDetail.bnrLndActionSeNm }}
                                                        <br />
                                                        {{ state.bannerDetail.bnrLndUrl }}
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                    <div>
                                        <div class="tbl-wrap" v-if="state.bannerDetail.ctsTxtYn === 'Y'">
                                            <table class="table reg">
                                                <colgroup>
                                                    <col style="width: 160px;">
                                                    <col style="width: auto;">
                                                </colgroup>
                                                <tbody>
                                                    <tr>
                                                        <th scope="row">
                                                            내용
                                                            <span class="ess"><span class="offscreen">필수입력</span></span>
                                                        </th>
                                                        <td>
                                                            <div v-html="state.bannerDetail.ctsTxt"></div>
                                                        </td>
                                                    </tr>
                                                    <tr v-if="state.bannerDetail.imgFlUrl">
                                                        <th scope="row">
                                                            이미지
                                                            <span class="ess"><span class="offscreen">필수입력</span></span>
                                                        </th>
                                                        <td>
                                                            <img :src="state.bannerDetail.imgFlUrl">
                                                        </td>
                                                    </tr>

                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </td>
                                <!-- <th scope="row">이미지 설명<span class="ess"><span class="offscreen">필수입력</span></span></th>
                                <td>{{ state.bannerDetail.imgDscr }}</td> -->
                            </tr>
                            <tr>
                                <th scope="row">노출 OS<span class="ess"><span class="offscreen">필수입력</span></span></th>
                                <td colspan="3">{{ state.bannerDetail.indnOsSeNm }}</td>
                            </tr>

                            <tr>
                                <th scope="row">노출 대상<span class="ess"><span class="offscreen">필수입력</span></span></th>
                                <td colspan="3">{{ state.bannerDetail.popupIndnTrgSeNm }}</td>
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
            <button type="button" class="btn btn-sl nega" @click="goToPage('/display/popup/list')">목록</button>
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
import { _getExhibitPopupDetail, _delExhibitPopup } from '@/api/exhibit.js';

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
            exhbPopupMngSn: '',
            bannerDetail: {},
            modalMsg: ''
        });
        const menuInfo = computed(() => store.state.getMenuItem.menuInfo);
        const { onChangeEditRol, onChangeDelRol } = authCommFunc();
        onMounted(() => {
            state.bannerSn = route.query.sn;
            state.exhbPopupMngSn = route.query.exhbPopupMngSn;
            getExhibitPopupDetail();
            emitter.$on('onChangeEdit', onChangeEdit);
            emitter.$on('onChangeDel', onChangeDel);
        });
        onUnmounted(() => {
            emitter.$off('onChangeEdit');
            emitter.$off('onChangeDel');
        });

        const getExhibitPopupDetail = async () => {
            try {
                let params = state.exhbPopupMngSn;
                const response = await _getExhibitPopupDetail(params);
                console.log(response);
                state.bannerDetail = response.data.data;

            } catch (error) {
                console.log(error);
            }
        };
        const delExhibitPopup = async () => {
            try {
                let params = state.exhbPopupMngSn;
                const response = await _delExhibitPopup(params);
                console.log(response.data.code);
                if (response.data.code === 'OK') {
                    goToPage('/display/popup/list');
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
                        await delExhibitPopup();
                    }
                    if (type === 'edit') {
                        console.log('수정');
                        goToPage(`/display/popup/regist?sn=${state.bannerSn}&exhbPopupMngSn=${state.exhbPopupMngSn}`);
                    }
                })
                .catch(error => {
                    console.log(error);
                });
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

            actionBtns,
            onChangeAuthDel,
            onChangeAuthEdit
        };
    }
};
</script>