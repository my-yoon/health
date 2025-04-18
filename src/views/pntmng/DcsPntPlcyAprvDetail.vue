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
                            <tr>
                                <th scope="row">포인트 정책명</th>
                                <td>{{ state.data.pntPlcyNm }}</td>
                                <th scope="row">포인트 유형</th>
                                <td>{{ state.data.pntIssTyCdNm }}
                                </td>
                            </tr>
                            <tr>
                                <th scope="row">발급구분</th>
                                <td>{{ state.data.pntIssSeCdNm }}</td>
                                <th scope="row">포인트 정책설명</th>
                                <td>{{ state.data.pntPlcyDscr }}</td>
                            </tr>
                            <tr>
                                <th scope="row">정책생성사유</th>
                                <td>{{ state.data.pntPlcyCrtRsn }}</td>
                                <th scope="row">정책기간</th>
                                <td>{{ state.data.pntPlcyBgnDate}} ~ {{ state.data.pntPlcyEndDate }}</td>
                            </tr>
                            <tr>
                                <th scope="row">중복가능여부</th>
                                <td v-if ="state.data.dplIssPsbYn == 'Y'">중복허용</td>
                                <td v-else-if ="state.data.dplIssPsbYn == 'N'">중복비허용</td>
                                <td v-else></td>
                                <th scope="row">중복가능일수</th>
                                <template v-if="state.data.dplIssPsbYn == 'N'">
                                    <td> </td>
                                </template>
                                <template v-else>
                                    <td v-if ="state.data.dplStngSeCd =='209001'">
                                        {{state.data.dplIssPsbNum ? addComma(state.data.dplIssPsbNum)+ ' 일' : ''}}
                                    </td>
                                    <td v-else-if ="state.data.dplStngSeCd =='209002'">
                                        {{state.data.dplIssPsbNum ? '일 최대 '+addComma(state.data.dplIssPsbNum)+' 회' : ''}}
                                    </td>
                                    <td v-else></td>
                                </template>
                            </tr>
                            <tr>
                                <th scope="row">포인트금액</th>
                                <td>{{ state.data.pntAmt }}P</td>
                                <th scope="row">발행한도</th>
                                <td>{{ state.data.pntIssLmtCnt ? addComma(state.data.pntIssLmtCnt)+' 건':'' }}</td>
                            </tr>
                            <tr>
                                <th scope="row">유효기간설정</th>
                                <td>
                                    {{ state.data.pntVldTrStngCdNm }}
                                </td>
                                <th scope="row">유효기간</th>
                                <td v-if="state.data.pntVldTrStngCd == '210002'">발급일로부터 {{ addComma(state.data.pntVldTr) }} {{ state.data.pntVldTrSeCdNm }}</td>
                                <td v-if="state.data.pntVldTrStngCd == '210001'">{{ state.data.pntVldBgnDate }} ~ {{ state.data.pntVldEndDate }}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>

        <DcsPntStatus :params="state.data"/>
        
        <div v-if="state.data.plcyStCd=='206002'" class="btn-bottom-set flex justify-center">
            <button type="button" class="btn btn-sl nega" @click="goToPage('/point/rule/approve/list')">목록</button>
            <button type="button" class="btn btn-sl posi" @click="checkAuth('rejectPlcy')">반려</button>
            <button type="button" class="btn btn-sl posi" @click="checkAuth('aprv')">승인</button>
        </div>
        <div v-if="state.data.plcyStCd=='206005'" class="btn-bottom-set flex justify-center">
            <button type="button" class="btn btn-sl nega" @click="goToPage('/point/rule/approve/list')">목록</button>
            <button type="button" class="btn btn-sl posi" @click="checkAuth('rejectDel')">삭제 반려</button>
            <button type="button" class="btn btn-sl posi" @click="checkAuth('aprv')">삭제 승인</button>
        </div>
        <div v-if="state.data.plcyStCd=='206003' || state.data.plcyStCd=='206004' || state.data.plcyStCd=='206010'
                  || state.data.plcyStCd=='206009' || state.data.plcyStCd=='206007' || state.data.plcyStCd=='206006'" class="btn-bottom-set flex justify-center">
            <button type="button" class="btn btn-sl nega" @click="goToPage('/point/rule/approve/list')">목록</button>
        </div>
        <div v-if="state.data.plcyStCd=='206008'" class="btn-bottom-set flex justify-center">
            <button type="button" class="btn btn-sl nega" @click="goToPage('/point/rule/approve/list')">목록</button>
            <button type="button" class="btn btn-sl posi" @click="checkAuth('rejectNonUse')">미사용 반려</button>
            <button type="button" class="btn btn-sl posi" @click="checkAuth('aprv')">미사용 승인</button>
        </div>
    </div>
    <AthrRsnPop v-if="isShow && popInfo.modalType != 'aprv'" :baseData="popInfo" @rsnData="closeModal"/>
    <DefaultModal :isShow="isShow && popInfo.modalType == 'aprv'" :modalTitle="popInfo.modalTitle" :buttonConfirm="'확인'" :buttonCancel="'취소'"
        @modalclose="closeModal">
        <template #modalcontent>
            <div >{{ popInfo.modalMessage }}</div>
        </template>
    </DefaultModal>
</template>
<script>
import { reactive, onMounted, computed } from 'vue';
import DateSerch from '@/components/ui/DateSerch.vue';
import { useCommFunc } from '@/core/helper/common.js';
import { _getDcsPntPlcyDetail, _setAthrAprvRes } from '@/api/pntmng.js';
import DefaultModal from '@/plugins/modal/modal/DefaultModal.vue';
import DcsPntStatus from '@/views/pntmng/component/DcsPntStatus.vue';
import AthrRsnPop from '@/views/pntmng/component/AthrRsnPop.vue';
import { dmCommFunc } from '@/views/pntmng/common/common.js';
import { useRouter} from 'vue-router';
import { useStore } from 'vuex';

export default {
    components: { DateSerch, DefaultModal, DcsPntStatus, AthrRsnPop },
    setup() {
        const router = useRouter();
        const { goToPage } = useCommFunc();
        const { modal, popInfo, isShow, addComma } = dmCommFunc();
        const store = useStore();
        const menuInfo = computed(() => store.state.getMenuItem.menuInfo);
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
                athrNoSn: null
            },
            athrTypCd: '212001',
            reasonReject: '',
            menuCode: menuInfo.value.menuCode
        });

        onMounted(() => {
            state.data.pntPlcyCd = history.state.pntPlcyCd;
            state.data.plcyStCd = history.state.plcyStCd;
            getDcsPntPlcyDetail();
        });

        const showModal = (type) => {
            popInfo.modalType = type;
            switch (type) {
                case 'rejectPlcy' :
                    popInfo.modalTitle = '정책반려';
                    popInfo.modalMessage = '반려사유를 등록해주세요.';
                    break;
                case 'rejectNonUse' :
                    popInfo.modalTitle = '정책 미사용 반려';
                    popInfo.modalMessage = '미사용 요청 반려사유를 등록해주세요.';
                    break;
                case 'rejectDel' :
                    popInfo.modalTitle = '정책 삭제 반려';
                    popInfo.modalMessage = '삭제 요청 반려사유를 등록해주세요.';
                    break;
                case 'aprv' :
                    popInfo.modalTitle = '포인트 정책 승인';
                    popInfo.modalMessage = '해당 포인트 정책을 승인하시겠습니까?';
                    break;
            }
            isShow.value = true;
        };

        const checkAuth = (type) => {
            if (menuInfo.value.auth4ApproveYn != 'Y') {
                modal('승인/반려 권한이 없습니다.');
            } else {
                showModal(type);
            }
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
                    athrRqstMngCd: state.data.pntPlcyCd,
                    athrNoSn: state.data.athrNoSn
                }],
                athrTypCd: state.athrTypCd,
                athrStCd: state.data.plcyStCd,
                athrRsnCd: val.athrRsnCd,
                athrRsnCts: val.athrRsnCts
            };

            let message = '';
            if (status == 'rejectPlcy') {
                message = '정책 반려가';
                data.athrStCd = '206004';
            } else if (status == 'rejectNonUse') {
                message = '미사용 반려가';
                data.athrStCd = '206010';
            } else if (status == 'rejectDel') {
                message = '삭제 반려가';
                data.athrStCd = '206007';
            } else if (status == 'aprv') {
                if (data.athrStCd == '206002')      data.athrStCd = '206003';
                else if (data.athrStCd == '206005') data.athrStCd = '206006';
                else if (data.athrStCd == '206008') data.athrStCd = '206009';
            }

            return {data, message};
        };

        const setAthrAprvRes = async (data, message) => {
            try {
                let response = await _setAthrAprvRes(data);
                if (response.data.code == 'OK') {
                    goToPage('/point/rule/approve/list');
                } else {
                    modal(response.data.message ?? message + ' 정상적으로 수행되지 않았습니다.');
                }
            } catch (err) {
                modal(err);
            }
        };

        const getDcsPntPlcyDetail = async () => {
            try {
                const response = await _getDcsPntPlcyDetail({
                    pntPlcyCd: state.data.pntPlcyCd
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

        return {
            state,
            popInfo,
            isShow,
            goToPage,
            getDcsPntPlcyDetail,
            closeModal,
            addComma,
            checkAuth
        };
    }
};
</script>