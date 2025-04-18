<template>
    <div>
        <div class="ui-section">
            <subTitleBar :subTitle="'정책 정보'" />
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
        
        <div v-if="state.data.issStCd=='218002'" class="btn-bottom-set flex justify-center">
            <button type="button" class="btn btn-sl nega" @click="goToPage('/point/publish/approve/list')">목록</button>
            <button type="button" class="btn btn-sl posi" @click="checkAuth('rejectIss')">반려</button>
            <button type="button" class="btn btn-sl posi" @click="checkAuth('aprv')">승인</button>
        </div>
        <div v-if="state.data.issStCd=='218005'" class="btn-bottom-set flex justify-center">
            <button type="button" class="btn btn-sl nega" @click="goToPage('/point/publish/approve/list')">목록</button>
            <button type="button" class="btn btn-sl posi" @click="checkAuth('rejectDel')">삭제 반려</button>
            <button type="button" class="btn btn-sl posi" @click="checkAuth('aprv')">삭제 승인</button>
        </div>
        <div v-if="state.data.issStCd=='218003' || state.data.issStCd=='218004' || state.data.issStCd=='218010'
                  || state.data.issStCd=='218009' || state.data.issStCd=='218012' || state.data.issStCd=='218007'
                  || state.data.issStCd=='218006'" class="btn-bottom-set flex justify-center">
            <button type="button" class="btn btn-sl nega" @click="goToPage('/point/publish/approve/list')">목록</button>
        </div>
        <div v-if="state.data.issStCd=='218008'" class="btn-bottom-set flex justify-center">
            <button type="button" class="btn btn-sl nega" @click="goToPage('/point/publish/approve/list')">목록</button>
            <button type="button" class="btn btn-sl posi" @click="checkAuth('rejectCancel')">취소반려</button>
            <button type="button" class="btn btn-sl posi" @click="checkAuth('aprv')">취소승인</button>
        </div>
    </div>
    <AthrRsnPop v-if="isShow && popInfo.modalType != 'aprv'" :baseData="popInfo" @rsnData="closeModal"/>
    <DefaultModal :isShow="isShow && popInfo.modalType == 'aprv'" :modalTitle="popInfo.modalTitle" :buttonConfirm="'확인'" :buttonCancel="'취소'" @modalclose="closeModal">
        <template #modalcontent>
            <div >{{ popInfo.modalMessage }}</div>
        </template>
    </DefaultModal>
</template>
<script>
import { reactive, onMounted, computed } from 'vue';
import DateSerch from '@/components/ui/DateSerch.vue';
import { useCommFunc } from '@/core/helper/common.js';
import { _getPntMnlIssDetail, _setAthrAprvRes } from '@/api/pntmng.js';
import DefaultModal from '@/plugins/modal/modal/DefaultModal.vue';
import PntDcsIssDetail from '@/views/pntmng/component/PntDcsIssDetail.vue';
import PntIssStatus from '@/views/pntmng/component/PntIssStatus.vue';
import AthrRsnPop from '@/views/pntmng/component/AthrRsnPop.vue';
import { dmCommFunc } from '@/views/pntmng/common/common.js';
import { useRouter} from 'vue-router';
import { useStore } from 'vuex';

export default {
    components: { DateSerch, DefaultModal, PntDcsIssDetail, PntIssStatus, AthrRsnPop },
    setup() {
        const router = useRouter();
        const { goToPage } = useCommFunc();
        const { modal, popInfo, isShow } = dmCommFunc();
        const store = useStore();
        const menuInfo = computed(() => store.state.getMenuItem.menuInfo);
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
            modalMessage: '',
            modalTitle: '',
            modalType: null,
            reasonReject: '',
            menuCode: menuInfo.value.menuCode
        });

        onMounted(() => {
            state.data.pntPlcyCd = history.state.pntPlcyCd;
            state.data.issStCd  = history.state.issStCd;
            state.data.athrNoSn  = history.state.athrNoSn;
            state.data.cstPntIssMngSn  = history.state.cstPntIssMngSn;
            getPntMnlIssDetail();
        });

        const showModal = (type) => {
            popInfo.modalType = type;
            switch (type) {
                case 'rejectIss' :
                    popInfo.modalTitle = '정책반려';
                    popInfo.modalMessage = '반려사유를 등록해주세요.';
                    break;
                case 'rejectCancel' :
                    popInfo.modalTitle = '정책 미사용 반려';
                    popInfo.modalMessage = '미사용 요청 반려사유를 등록해주세요.';
                    break;
                case 'rejectDel' :
                    popInfo.modalTitle = '정책 삭제 반려';
                    popInfo.modalMessage = '삭제 요청 반려사유를 등록해주세요.';
                    break;
                case 'aprv' :
                    popInfo.modalTitle = '포인트 정책 승인';
                    popInfo.modalMessage = '해당 항목을 승인하시겠습니까?';
                    break;
            }
            isShow.value = true;
        };

        const closeModal = async (type, val) => {
            let status = popInfo.modalType;
            isShow.value = false;
            if (type == 'modalconfirm') {
                let {data, message} = await resData(status, val);
                setAthrAprvRes(data, message);
            }
        };

        const resData = async (status, val) => {
            let data = {
                athrInfArr: [{
                    athrRqstMngCd: state.data.cstPntIssMngSn,
                    athrNoSn: state.data.athrNoSn
                }],
                athrTypCd: state.athrTypCd,
                athrStCd: state.data.issStCd,
                athrRsnCd: val.athrRsnCd,
                athrRsnCts: val.athrRsnCts
            };

            let message = '';
            if (status == 'rejectIss') {
                message = '승인 반려가';
                data.athrStCd = '218004';
            } else if (status == 'rejectCancel') {
                message = '취소 반려가';
                data.athrStCd = '218010';
            } else if (status == 'rejectDel') {
                message = '삭제 반려가';
                data.athrStCd = '218007';
            } else if (status == 'aprv') {
                if (data.athrStCd == '218002')      data.athrStCd = '218003';
                else if (data.athrStCd == '218005') data.athrStCd = '218006';
                else if (data.athrStCd == '218008') data.athrStCd = '218009';
            }

            return {data, message};
        };

        const setAthrAprvRes = async (data, message) => {
            try {
                let response = await _setAthrAprvRes(data);
                if (response.data.code == 'OK') {
                    goToPage('point/publish/approve/list');
                } else {
                    modal(response.data.message ?? message + ' 정상적으로 수행되지 않았습니다.');
                }
            } catch (err) {
                modal(err);
            }
        };

        // 데이터 피커 날짜 검색
        const onSelectPicker = (type, value) => {
            if (type === 'day') {
                state.startday = value[0];
                state.endday = value[1];
            }
        };

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

        const checkAuth = (type) => {
            if (menuInfo.value.auth4ApproveYn != 'Y') {
                modal('승인/반려 권한이 없습니다.');
            } else {
                showModal(type);
            }
        };

        return {
            state,
            popInfo,
            isShow,
            onSelectPicker,
            goToPage,
            getPntMnlIssDetail,
            closeModal,
            checkAuth
        };
    }
};
</script>