<template>
    <div>
        <div class="ui-section">
            <div class="ui-title-3">
                <h3>정책 정보</h3>
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
                            <tr>
                                <th scope="row">포인트 정책명</th>
                                <td colspan="3">{{ state.data.pntPlcyNm }}</td>
                            </tr>
                            <tr>
                                <th scope="row">포인트 정책설명</th>
                                <td colspan="3">{{ state.data.pntPlcyDscr }}</td>
                            </tr>
                            <tr>
                                <th scope="row">정책생성사유</th>
                                <td colspan="3">{{ state.data.pntPlcyCrtRsn }}</td>
                            </tr>
                            <tr>
                                <th scope="row">정책기간</th>
                                <td colspan="3">{{ state.data.pntPlcyBgnDate}} ~ {{ state.data.pntPlcyEndDate }}</td>
                            </tr>
                            <tr>
                                <th scope="row">포인트 유형</th>
                                <td>{{ state.data.pntIssTyCdNm }}
                                </td>
                                <th scope="row">발급구분</th>
                                <td>{{ state.data.pntIssSeCdNm }}</td>
                            </tr>
                            <tr>
                                <th scope="row">중복가능여부</th>
                                <td>{{
                                        state.data.dplIssPsbYn == 'Y' ? '중복허용' :
                                        state.data.dplIssPsbYn == 'N' ? '중복비허용' : ''
                                    }}
                                </td>
                                <th scope="row">중복설정</th>
                                <template v-if="state.data.dplIssPsbYn == 'N'">
                                    <td> </td>
                                </template>
                                <template v-else>
                                    <td v-if ="state.data.dplStngSeCd =='209001'">
                                        {{state.data.dplIssPsbNum ? addComma(state.data.dplIssPsbNum)+' 일' : ''}}
                                    </td>
                                    <td v-if ="state.data.dplStngSeCd =='209002'">
                                        {{state.data.dplIssPsbNum ? '일 최대 '+addComma(state.data.dplIssPsbNum)+' 회': ''}}
                                    </td>
                                </template>
                            </tr>
                            <tr>
                                <th scope="row">포인트금액</th>
                                <td>{{ state.data.pntAmt }}P</td>
                                <th scope="row">발행한도</th>
                                <td>{{ state.data.pntIssLmtCnt ?  addComma(state.data.pntIssLmtCnt)+' 건' : ''}} </td>
                            </tr>
                            <tr>
                                <th scope="row">유효기간설정</th>
                                <td>
                                    {{ state.data.pntVldTrStngCdNm }}
                                </td>
                                <th scope="row">유효기간</th>
                                <td v-if="state.data.pntVldTrStngCd == '210002'">발급일로부터 {{ addComma(state.data.pntVldTr) }} {{ state.data.pntVldTrSeCdNm}}
                                </td>
                                <td v-else-if="state.data.pntVldTrStngCd == '210001'">{{ state.data.pntVldBgnDate }} ~ {{ state.data.pntVldEndDate }}</td>
                                <td v-else></td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>

        <DcsPntStatus :params="state.data"/>

        <div v-if="state.data.plcyStCd=='206001' || state.data.plcyStCd=='206007' || state.data.plcyStCd=='206004'" class="btn-bottom-set flex justify-center">
            <button type="button" class="btn btn-sl nega" @click="goToPage('/point/rule/list')">목록</button>
            <button type="button" class="btn btn-sl posi" @click="checkAuth('reqDeleteAlt')">삭제요청</button>
            <button type="button" class="btn btn-sl posi" @click="onChangeEditRol(menuInfo.auth2UpdateYn)">수정</button>
            <button type="button" class="btn btn-sl posi" @click="checkAuth('reqAprvAlt')">승인요청</button>
        </div>
        <div v-if="state.data.plcyStCd=='206002' || state.data.plcyStCd=='206008' || state.data.plcyStCd=='206009'
                || state.data.plcyStCd=='206005' || state.data.plcyStCd=='206006'" class="btn-bottom-set flex justify-center">
            <button type="button" class="btn btn-sl nega" @click="goToPage('/point/rule/list')">목록</button>
        </div>
        <div v-if="state.data.plcyStCd=='206003' || state.data.plcyStCd=='206010'" class="btn-bottom-set flex justify-center">
            <button type="button" class="btn btn-sl nega" @click="goToPage('/point/rule/list')">목록</button>
            <button type="button" class="btn btn-sl posi" @click="checkAuth('reqNonUseAlt')">미사용요청</button>
        </div>
    </div>
    <DefaultModal :isShow="isShow" :modalTitle="popInfo.modalTitle" :buttonConfirm="popInfo.confirmNm" :buttonCancel="'취소'"
        @modalclose="closeModal">
        <template #modalcontent>
            <AprvListPop v-if="popInfo.modalType=='reqAprv' || popInfo.modalType=='reqDelete' || popInfo.modalType=='reqNonUse'" :menuCode="state.menuCode" @memberAprv="memberAprv"/>
            <div v-else>{{ popInfo.modalMessage }}</div>
        </template>
    </DefaultModal>
</template>
<script>
import { reactive, onMounted, onUnmounted, ref, inject, computed  } from 'vue';
import { useCommFunc } from '@/core/helper/common.js';
import {_getDcsPntPlcyDetail, _setAthrAprvReq } from '@/api/pntmng.js';
import DefaultModal from '@/plugins/modal/modal/DefaultModal.vue';
import { useRouter} from 'vue-router';
import AprvListPop from '@/views/pntmng/component/AprvListPop.vue';
import DcsPntStatus from '@/views/pntmng/component/DcsPntStatus.vue';
import { dmCommFunc } from '@/views/pntmng/common/common.js';
import { useStore } from 'vuex';
import { authCommFunc } from '@/core/helper/authComm.js';

export default {
    components: { DefaultModal, AprvListPop, DcsPntStatus},
    setup() {
        const router = useRouter();
        const { goToPage } = useCommFunc();
        const { modal, popInfo, isShow, addComma } = dmCommFunc();
        const store = useStore();
        const menuInfo = computed(() => store.state.getMenuItem.menuInfo);
        const { onChangeEditRol } = authCommFunc();
        const state = reactive({
            data: {
                pntPlcyCd: '', // 포인트정책코드
                pntPlcyNm: '', // 포인트정책명
                pntPlcyDscr: '',    // 포인트정책설명
                pntPlcyCrtRsn: '', // 포인트정책생성사유
                pntPlcyBgnDate: '', // 포인트정책시작일자
                pntPlcyEndDate: '', // 포인트정책종료일자
                pntIssTyCd: '', // 포인트유형코드
                pntIssSeCd: '', // 포인트발급구분코드
                pntAmt: 0, // 포인트금액
                dplIssPsbYn: '', // 중복발급가능여부
                dplStngSeCd: '', // 중복설정구분코드
                dplIssPsbNum: 0, // 중복발급가능수
                pntIssLmtCnt: 0, // 포인트발급한도건수 (변 경)
                pntVldTrStngCd: '', // 포인트유효기간설정코드
                pntVldTrSeCd: '', // 포인트유효기간구분코드
                pntVldTr: '', // 포인트유효기간
                pntVldBgnDate: '', // 포인트유효시작일자
                pntVldEndDate: '', // 포인트유효종료일자
                pntBrmsHtVl: '',
                plcyStCd: '', // 정책상태코드
                plcyCrtrNm: '', // 정책생성자명
                plcyCrtDpnm: '', // 정책생성부서명 (변 경)
                plcyAprvId: '', // 정책승인ID
                plcyAprvDt: '', // 정책승인일시 (변 경)  
                plcyNusAprvId: null, //미사용승인반려자
                plcyNusAprvDt: '', //미사용일시
                athrRqstId: null, // 요청자
                athrRqstDt: '', // 요청일자
                pntPlcyUseYn: '', // 포인트 정책 사용여부
                pntPlcyDelYn: '', // 포인트 정책 삭제여부 (신   규)
                fstRgtrSn: 0, //
                fstRgsDt: '',
                lastUpdrSn: 0,
                lastUpdDt: '',
                athrRsnCts: '', //결재쪽테이블 생성시 만들엊루거임
                athrNoSn: null,
                pntCtgrMjcsCdNm: null,
                pntCtgrMdcsCdNm: null
            },
            athrTypCd: '212001',
            memberAprv: null,
            menuCode: menuInfo.value.menuCode
        });

        onMounted(() => {
            state.data.pntPlcyCd = history.state.pntPlcyCd;
            state.data.plcyStCd  = history.state.plcyStCd;
            state.data.athrNoSn  = history.state.athrNoSn;
            emitter.$on('onChangeEdit', goToMod);
            getDcsPntPlcyDetail();
        });

        onUnmounted(() => {
            emitter.$off('onChangeEdit');
        });

        const getDcsPntPlcyDetail = async () => {
            try {
                const response = await _getDcsPntPlcyDetail({pntPlcyCd: state.data.pntPlcyCd});
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
                    popInfo.modalTitle = '포인트정책승인요청';
                    popInfo.modalMessage = '선택하신 항목을 승인요청하시겠습니까?';
                    break;
                case 'reqAprv' :
                    popInfo.modalTitle = '포인트정책승인요청';
                    popInfo.modalMessage = '';
                    popInfo.confirmNm = '승인요청';
                    break;
                case 'aprvReq' :
                    popInfo.modalTitle = '포인트정책승인요청';
                    popInfo.modalMessage = '선택한 승인자에게 정책 승인을 요청하시겠습니까?';
                    break;
                case 'reqDeleteAlt' :
                    state.memberAprv = '';
                    popInfo.modalTitle = '포인트정책삭제요청';
                    popInfo.modalMessage = '선택하신 항목을 삭제하시겠습니까?';
                    break;
                case 'reqDelete' :
                    popInfo.modalTitle = '포인트정책삭제승인요청';
                    popInfo.modalMessage = '';
                    popInfo.confirmNm = '승인요청';
                    break;
                case 'delReq' :
                    popInfo.modalTitle = '포인트정책삭제요청';
                    popInfo.modalMessage = '선택한 승인자에게 정책 삭제승인을 요청하시겠습니까?';
                    break;

                case 'reqNonUseAlt' :
                    state.memberAprv = '';
                    popInfo.modalTitle = '포인트정책 미사용 승인요청';
                    popInfo.modalMessage = '선택하신 항목을 미사용 요청하시겠습니까?';
                    break;
                case 'reqNonUse' :
                    popInfo.modalTitle = '포인트정책 미사용 승인요청';
                    popInfo.modalMessage = '';
                    popInfo.confirmNm = '승인요청';
                    break;
                case 'nonUseReq' :
                    popInfo.modalTitle = '포인트정책 미사용 승인요청';
                    popInfo.modalMessage = '선택한 승인자에게 정책 미사용 승인을 요청하시겠습니까?';
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
                } else if (status == 'aprvReq' || status == 'delReq' || status == 'nonUseReq') {

                    let data = {
                        athrInfArr: [{
                            athrRqstMngCd: state.data.pntPlcyCd,
                            athrNoSn: state.data.athrNoSn
                        }],
                        athrStCd: '',
                        athrPsbId: state.memberAprv.admnId,
                        athrTypCd: state.athrTypCd,
                        fstRgtrSn: state.data.fstRgtrSn
                    };
                    
                    let message = '';
                    if (status == 'aprvReq') {
                        message = '승인요청';
                        data.athrStCd = '206002';
                    } else if (status == 'delReq') {
                        message = '삭제요청';
                        data.athrStCd = '206005';
                    } else if (status == 'nonUseReq') {
                        message = '미사용요청';
                        data.athrStCd = '206008';
                    }

                    try {
                        let response = await _setAthrAprvReq(data);
                        if (response.data.code == 'OK') {
                            goToPage('/point/rule/list');
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
                } else if (status == 'reqNonUseAlt') {
                    showModal('reqNonUse');
                } else if (status == 'reqNonUse') {
                    if (_.isEmpty(state.memberAprv)) {
                        modal('승인자를 선택해 주세요.');
                    } else {
                        showModal('nonUseReq');
                    }
                }
            }
        };

        const goToMod = () => {
            var url = '/dcspntplcymod';
            router.push({
                path: url,
                state: {
                    type: 'dcspntplcymod',
                    pntPlcyCd: state.data.pntPlcyCd,
                    plcyStCd: state.data.plcyStCd
                }
            });
        };

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
            getDcsPntPlcyDetail,
            closeModal,
            showModal,
            memberAprv,
            addComma,
            onChangeEditRol,
            menuInfo,
            checkAuth
        };
    }
};
</script>