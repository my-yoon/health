<template>
    <div>
        <div class="ui-section">
            <div class="ui-title-3">
                <h3>포인트 정책정보</h3>
                <div class="abs">
                    <span class="ess"></span> 표시는 필수항목입니다.
                </div>
            </div>
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
                            <PntDcsIssDetail :params="state.data"/>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>

        <PntIssStatus :params="state.data"/>

        <div v-if="state.data.issStCd=='218001' || state.data.issStCd=='218004'" class="btn-bottom-set flex justify-center">
            <button type="button" class="btn btn-sl nega" @click="goToPage('/point/publish/list');">목록</button>
            <button type="button" class="btn btn-sl posi" @click="checkAuth('reqDeleteAlt')">삭제요청</button>
            <button type="button" class="btn btn-sl posi" @click="checkModAuth">수정</button>
            <button type="button" class="btn btn-sl posi" @click="checkAuth('reqAprvAlt')">승인요청</button>
        </div>
        <div v-if="state.data.issStCd=='218002' || state.data.issStCd=='218005'
        || state.data.issStCd=='218006' || state.data.issStCd=='218008' || state.data.issStCd=='218009'" class="btn-bottom-set flex justify-center">
            <button type="button" class="btn btn-sl nega" @click="goToPage('/point/publish/list');">목록</button>
        </div>
        <div v-if="state.data.issStCd=='218003' || state.data.issStCd=='218010'" class="btn-bottom-set flex justify-center">
            <button type="button" class="btn btn-sl nega" @click="goToPage('/point/publish/list');">목록</button>
            <button type="button" class="btn btn-sl posi" @click="checkAuth('reqCancelAlt')">취소요청</button>
        </div>
        <div v-if="state.data.issStCd=='218007'" class="btn-bottom-set flex justify-center">
            <button type="button" class="btn btn-sl nega" @click="goToPage('/point/publish/list');">목록</button>
            <button type="button" class="btn btn-sl posi" @click="checkAuth('reqDeleteAlt')">삭제요청</button>
        </div>
        <div v-if="state.data.issStCd=='218012'" class="btn-bottom-set flex justify-center">
            <button type="button" class="btn btn-sl nega" @click="goToPage('/point/publish/list');">목록</button>
        </div>
    </div>
    <DefaultModal :isShow="isShow" :modalTitle="popInfo.modalTitle" :buttonConfirm="popInfo.confirmNm" :buttonCancel="'취소'"
        @modalclose="closeModal">
        <template #modalcontent>
            <AprvListPop v-if="popInfo.modalType=='reqAprv' || popInfo.modalType=='reqDelete' || popInfo.modalType=='reqCancel'" :menuCode="state.menuCode" @memberAprv="memberAprv"/>
            <div v-else>{{ popInfo.modalMessage }}</div>
        </template>
    </DefaultModal>
</template>
<script>
import { reactive, onMounted, onUnmounted, ref, computed } from 'vue';
import { useCommFunc } from '@/core/helper/common.js';
import {_getPntMnlIssDetail, _setAthrAprvReq } from '@/api/pntmng.js';
import DefaultModal from '@/plugins/modal/modal/DefaultModal.vue';
import { useRouter} from 'vue-router';
import AprvListPop from '@/views/pntmng/component/AprvListPop.vue';
import PntDcsIssDetail from '@/views/pntmng/component/PntDcsIssDetail.vue';
import PntIssStatus from '@/views/pntmng/component/PntIssStatus.vue';
import { dmCommFunc } from '@/views/pntmng/common/common.js';
import { useStore } from 'vuex';
import { authCommFunc } from '@/core/helper/authComm.js';

export default {
    components: { DefaultModal, AprvListPop, PntDcsIssDetail, PntIssStatus},
    setup() {
        const router = useRouter();
        const { goToPage } = useCommFunc();
        const { modal, popInfo, isShow } = dmCommFunc();
        const store = useStore();
        const menuInfo = computed(() => store.state.getMenuItem.menuInfo);
        const { onChangeEditRol } = authCommFunc();
        const state = reactive({
            data: {
                athrNoSn: '',
                pntPlcyCd: '',
                pntPlcyNm: '',
                pntPlcyDscr: '',
                pntPlcyCrtRsn: '',
                pntPlcyBgnDate: '',
                pntPlcyEndDate: '',
                pntIssTyCd: '',
                pntIssSeCd: '',
                dplIssPsbYn: '',
                dplStngSeCd: '',
                dplIssPsbNum: '',
                pntIssLmtCnt: '',
                pntVldTrStngCd: '',
                pntVldTrSeCd: '',
                pntVldTr: '',
                pntVldBgnDate: '',
                pntVldEndDate: '',
                pntAmt: '',
                cstPntIssMngSn: '',
                issTrgCd: '',
                mbrGrpCd: '',
                issTrgUpldFnm: '',
                issTrgUpldFlPtnm: '',
                issStCd: '',
                issDtSeCd: '',
                bknIssDate: '',
                issTgpNum: '',
                mbrSnArr: [],
                issAprvId: '',
                issAprvDt: '',
                athrRqstId: '',
                athrRqstDt: '',
                issCnclAprvId: '',
                issCnclDt: '',
                fstRgtrSn: '',
                fstRgsDt: ''
            },
            athrTypCd: '212005',
            menuCode: menuInfo.value.menuCode,
            auth6MaskingYn: null
        });

        onMounted(() => {
            state.data.pntPlcyCd = history.state.pntPlcyCd;
            state.data.issStCd  = history.state.issStCd;
            state.data.athrNoSn  = history.state.athrNoSn;
            state.data.cstPntIssMngSn  = history.state.cstPntIssMngSn;
            state.auth6MaskingYn = history.state.auth6MaskingYn;
            emitter.$on('onChangeEdit', goToMod);
            getPntMnlIssDetail();
        });

        onUnmounted(() => {
            emitter.$off('onChangeEdit');
        });

        const getPntMnlIssDetail = async () => {
            try {
                const response = await _getPntMnlIssDetail({
                    cstPntIssMngSn: state.data.cstPntIssMngSn
                });
                let resData = response.data;
                if (response.code == 'OK') {
                    state.data = {
                        ...state.data,
                        ...resData
                    };
                } else {
                    modal(response.message);
                }
            } catch (error) {
                modal(error);
            }
        };

        const memberAprv = (val) => {
            state.memberAprv = val[0];
        };

        const showModal = (type) => {
            popInfo.modalType = type;
            popInfo.confirmNm = '확인';
            switch (type) {
                case 'reqAprvAlt' :
                    state.memberAprv = '';
                    popInfo.modalTitle = '포인트발급승인요청';
                    popInfo.modalMessage = '선택하신 항목을 승인요청하시겠습니까?';
                    break;
                case 'reqAprv' :
                    popInfo.modalTitle = '포인트발급승인요청';
                    popInfo.modalMessage = '';
                    popInfo.confirmNm = '승인요청';
                    break;
                case 'aprvReq' :
                    popInfo.modalTitle = '포인트발급승인요청';
                    popInfo.modalMessage = '선택한 승인자에게 발급 승인을 요청하시겠습니까?';
                    break;
                case 'reqDeleteAlt' :
                    state.memberAprv = '';
                    popInfo.modalTitle = '포인트발급삭제요청';
                    popInfo.modalMessage = '해당 발급건을 삭제 요청하시겠습니까?';
                    break;
                case 'reqDelete' :
                    popInfo.modalTitle = '포인트발급삭제요청';
                    popInfo.modalMessage = '';
                    popInfo.confirmNm = '승인요청';
                    break;
                case 'delReq' :
                    popInfo.modalTitle = '포인트발급삭제요청';
                    popInfo.modalMessage = '선택한 승인자에게 발급 삭제 승인을 요청하시겠습니까?';
                    break;

                case 'reqCancelAlt' :
                    state.memberAprv = '';
                    popInfo.modalTitle = '포인트발급취소요청';
                    popInfo.modalMessage = '선택하신 항목을 취소 승인요청하시겠습니까?';
                    break;
                case 'reqCancel' :
                    popInfo.modalTitle = '포인트발급취소요청';
                    popInfo.modalMessage = '';
                    popInfo.confirmNm = '취소요청';
                    break;
                case 'cancelReq' :
                    popInfo.modalTitle = '포인트발급취소요청';
                    popInfo.modalMessage = '선택한 승인자에게 발급 취소 승인을 요청하시겠습니까?';
                    break;
            }
            isShow.value = true;
        };

        const closeModal = async (type, value) => {
            let status = popInfo.modalType;
            isShow.value = false;
            if (type == 'modalconfirm') {
                if (status == 'reqAprvAlt') {
                    showModal('reqAprv');
                } else if (status == 'reqAprv') {
                    if (_.isEmpty(state.memberAprv)) {
                        modal('승인자를 선택해 주세요.');
                    } else {
                        showModal('aprvReq');
                    }
                } else if (status == 'aprvReq' || status == 'delReq' || status == 'cancelReq') {
                    let data = {
                        athrInfArr: [{
                            athrRqstMngCd: state.data.cstPntIssMngSn,
                            athrNoSn: state.data.athrNoSn
                        }],
                        athrTypCd: state.athrTypCd,
                        athrStCd: state.data.issStCd,
                        athrPsbId: state.memberAprv.admnId,
                        fstRgtrSn: state.data.fstRgtrSn
                    };
                    
                    let message = '';

                    if (status == 'aprvReq') {
                        message = '승인요청';
                        data.athrStCd = '218002';
                    } else if (status == 'delReq') {
                        message = '삭제요청';
                        data.athrStCd = '218005';
                    } else if (status == 'cancelReq') {
                        message = '취소요청';
                        data.athrStCd = '218008';
                    }

                    try {
                        let response = await _setAthrAprvReq(data);
                        if (response.data.code == 'OK') {
                            goToPage('point/publish/list');
                        } else {
                            modal(response.data.message ?? message + '이 정상적으로 수행되지 않았습니다.');
                        }
                    } catch (err) {
                        modal(err);
                    }
                } else if (status == 'reqDeleteAlt') {
                    showModal('reqDelete');
                } else if (status == 'reqDelete') {
                    if (_.isEmpty(state.memberAprv)) {
                        modal('승인자를 선택해 주세요.');
                    } else {
                        showModal('delReq');
                    }
                } else if (status == 'reqCancelAlt') {
                    showModal('reqCancel');
                } else if (status == 'reqCancel') {
                    if (_.isEmpty(state.memberAprv)) {
                        modal('승인자를 선택해 주세요.');
                    } else {
                        showModal('cancelReq');
                    }
                }
            }
        };

        const goToMod = () => {
            var url = '/pntmnlissmod';
            router.push({path: url,
                state: {
                    type: 'pntmnlissmod',
                    pntPlcyCd: state.data.pntPlcyCd,
                    issStCd: state.data.issStCd,
                    athrNoSn: state.data.athrNoSn,
                    cstPntIssMngSn: state.data.cstPntIssMngSn
                }
            });
        };

        const checkModAuth = async () => await onChangeEditRol(menuInfo.value.auth2UpdateYn);

        const checkAuth = (type) => {
            if (menuInfo.value.auth4ApproveYn != 'Y') {
                modal('요청 권한이 없습니다.');
            } else {
                showModal(type);
            }
        };

        return {
            state,
            popInfo,
            isShow,
            goToPage,
            getPntMnlIssDetail,
            closeModal,
            memberAprv,
            checkModAuth,
            checkAuth
        };
    }
};
</script>