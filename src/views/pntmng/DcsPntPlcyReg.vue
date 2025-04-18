<template>
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
                            <th scope="row">포인트 정책명<span class="ess"><span class="offscreen">필수입력</span></span></th>
                            <td colspan="3">
                                <div class="reg-group">
                                    <div class="reg-item">
                                        <input type="text" v-model="state.data.pntPlcyNm" class="form-control">
                                    </div>
                                </div>
                            </td>
                        </tr>
                        <tr>
                            <th scope="row">포인트 정책설명<span class="ess"><span class="offscreen">필수입력</span></span></th>
                            <td colspan="3">
                                <div class="reg-group wp-100">
                                    <div class="reg-item">
                                        <input type="text" class="form-control" v-model="state.data.pntPlcyDscr">
                                    </div>
                                </div>
                            </td>
                        </tr>
                        <tr>
                            <th scope="row">정책생성사유<span class="ess"><span class="offscreen">필수입력</span></span></th>
                            <td colspan="3">
                                <div class="reg-group wp-100">
                                    <div class="reg-item">
                                        <input type="text" class="form-control" v-model="state.data.pntPlcyCrtRsn">
                                    </div>
                                </div>
                            </td>
                        </tr>
                        <tr>
                            <th scope="row">정책기간<span class="ess"><span class="offscreen">필수입력</span></span></th>
                            <td colspan="3">
                                <div class="reg-group">
                                    <div class="reg-item">
                                        <div class="ui-datepicker-range">
                                            <dateSerch ref="setPntPlcyDateRef" @onSelectDate="pntPlcyPicker" :setDay="state.setPntPlcyDate" :pickerOnly="true"/>
                                        </div>
                                    </div>
                                </div>
                            </td>
                        </tr>
                        <tr>
                            <th scope="row">포인트 유형<span class="ess"><span class="offscreen">필수입력</span></span></th>
                            <td>
                                <div class="reg-group">
                                    <div class="reg-item">
                                        <CommonBtn :btn="'radio'" :grCdId="'207000'" :val="state.data.pntIssTyCd"
                                            @changedValue="(value) => state.data.pntIssTyCd = value" :className="'custom-select'" />
                                    </div>
                                </div>
                            </td>
                            <th scope="row">발급구분<span class="ess"><span class="offscreen">필수입력</span></span></th>
                            <td>
                                <div class="reg-group inline">
                                    <div class="reg-item">
                                        <CommonBtn :grCdId="'214000'" :val="state.data.pntIssSeCd" :delOption="['214002']"
                                         @changedValue="(value) => state.data.pntIssSeCd = value" :className="'custom-select'" />
                                    </div>
                                </div>
                            </td>
                        </tr>
                        <tr>
                            <th scope="row">중복가능여부</th>
                            <td>
                                <div class="reg-group">
                                    <div class="reg-item">
                                        <CommonBtn :val="state.data.dplIssPsbYn" :type="'dplIssPsbYn'" :btn="'radio'"
                                            @changedValue="(value) => state.data.dplIssPsbYn = value"/>
                                    </div>
                                </div>
                            </td>
                            <th scope="row">중복가능일수</th>
                            <td>
                                <div class="reg-group inline">
                                        
                                    <div class="reg-item">
                                        <span class="radio">
                                            <input id="dplStngSeD" name="dplStngSeD" type="radio" v-model="state.data.dplStngSeCd" value= "209001" :disabled="state.data.dplIssPsbYn == 'N'">
                                            <label for="dplStngSeD"></label>
                                            <input type="text" class="form-control w-50" v-model="state.data.aftDay" @input="numberFormat($event.target.value,'aftDay')" :disabled="state.data.dplIssPsbYn == 'N' || state.data.dplStngSeCd != '209001'">  일 이후
                                        </span>
                                        <span class="radio">
                                            <input id="dplStngSeR" name="dplStngSeR" type="radio" v-model="state.data.dplStngSeCd" value= "209002" :disabled="state.data.dplIssPsbYn == 'N'">
                                            <label for="dplStngSeR"></label>
                                            1일 최대  <input type="text" class="form-control w-50" v-model="state.data.maxDail" @input="numberFormat($event.target.value,'maxDail')" :disabled="state.data.dplIssPsbYn == 'N' || state.data.dplStngSeCd != '209002'"> 회
                                        </span>
                                    </div>
                                </div>
                            </td>
                        </tr>
                        <tr>
                            <th scope="row">포인트금액<span class="ess"><span class="offscreen">필수입력</span></span></th>
                            <td>
                                <div class="reg-group inline">
                                    <div class="reg-item">
                                        <input type="text" class="form-control" v-model="state.data.pntAmt" @input="numberFormat($event.target.value,'pntAmt','won')">P
                                    </div>
                                </div>
                            </td>
                            <th scope="row">발행한도</th>
                            <td>
                                <div class="reg-group inline">
                                    <div class="reg-item">
                                        <input type="text" class="form-control w-50" v-model="state.data.pntIssLmtCnt" @input="numberFormat($event.target.value,'pntIssLmtCnt')" :disabled = "state.data.pntIssTyCd =='207002'">건
                                    </div>
                                </div>
                            </td>
                        </tr>
                        <tr>
                            <th scope="row">유효기간설정<span class="ess"><span class="offscreen">필수입력</span></span></th>
                            <td>
                                <div class="reg-group">
                                    <div class="reg-item">
                                        <CommonBtn :btn="'radio'" :grCdId="'210000'" :val="state.data.pntVldTrStngCd"
                                         @changedValue="(value) => state.data.pntVldTrStngCd = value" :className="'custom-select'" />
                                    </div>
                                </div>
                            </td>
                            <th scope="row">유효기간<span class="ess"><span class="offscreen">필수입력</span></span></th>
                            <td>
                                <div class="reg-group inline" v-if="state.data.pntVldTrStngCd =='210002'">
                                    <div class="reg-item">
                                        <input v-model="state.data.pntVldTr" @input="numberFormat($event.target.value,'pntVldTr')" type="text" class="form-control w-50">
                                    </div>
                                    <div class="reg-item">
                                        <CommonBtn :grCdId="'211000'" :val="state.data.pntVldTrSeCd"
                                         @changedValue="(value) => state.data.pntVldTrSeCd = value" :className="'custom-select w-100'" />
                                    </div>
                                </div>

                                <!-- 고정형일 경우 -->
                                <div class="reg-group" v-if="state.data.pntVldTrStngCd =='210001'">
                                    <div class="reg-item">
                                        <div class="ui-datepicker-range">
                                            <dateSerch ref="setPntVldDateRef" @onSelectDate="pntVldPicker" :setDay="state.setPntVldDate" :pickerOnly="true"/>
                                        </div>
                                    </div>
                                </div>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>

    <div class="ui-section">
        <div class="ui-title-3">
            <h3>카테고리정보</h3>
        </div>
        <div class="ui-content">
            <div class="tbl-wrap">
                <table class="table reg">
                    <colgroup>
                        <col style="width: 160px;">
                        <col style="width: auto;">
                    </colgroup>
                    <tbody>
                        <tr>
                            <th scope="row">포인트카테고리<span class="ess"><span class="offscreen">필수입력</span></span></th>
                            <td>
                                <div class="reg-group inline">
                                    <div class="reg-item">
                                        <CommonBtn :init="'선택'" :grCdId="'290000'" :val="state.data.pntCtgrMjcsCd"
                                            @changedValue="changePntCtgrMjcsCd" :className="'custom-select'" />
                                    </div>
                                    <div class="reg-item">
                                        <CommonBtn ref="pntCtgrMdcsCdRef" v-if="state.data.pntCtgrMjcsCd" :init="'선택'" :grCdId="state.data.pntCtgrMjcsCd" :val="state.data.pntCtgrMdcsCd"
                                            @changedValue="(value) => state.data.pntCtgrMdcsCd = value" :className="'custom-select'" />
                                    </div>
                                </div>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
    <div class="btn-bottom-set flex justify-center">
        <button type="button" class="btn btn-sl" @click="goToPage('/point/rule/list')">취소</button>
        <button type="button" class="btn btn-sl posi" @click="checkAuth">{{ state.pageType }}</button>
    </div>

    <DefaultModal :isShow="isShow" :modalTitle="popInfo.modalTitle" :buttonConfirm="'확인'" :buttonCancel="'취소'"
        @modalclose="closeModal">
        <template #modalcontent>
            <div>{{ popInfo.modalMessage }}</div>
        </template>
    </DefaultModal>
</template>
<script>
import { reactive, onBeforeMount, ref, inject, computed, watch, onMounted, onUnmounted } from 'vue';
import DateSerch from '@/components/ui/DateSerch.vue';
import { useCommFunc } from '@/core/helper/common.js';
import { _setDcsPntPlcyReg, _getDcsPntPlcyDetail, _setDcsPntPlcyMod } from '@/api/pntmng.js';
import DefaultModal from '@/plugins/modal/modal/DefaultModal.vue';
import { dmCommFunc } from '@/views/pntmng/common/common.js';
import CommonBtn from '@/views/pntmng/component/CommonBtn.vue';
import { useRouter} from 'vue-router';
import { useStore } from 'vuex';
import { authCommFunc } from '@/core/helper/authComm.js';

export default {
    components: { DateSerch, DefaultModal, CommonBtn },
    setup() {
        const router = useRouter();
        const { goToPage } = useCommFunc();
        const { modal, popInfo, isShow } = dmCommFunc();
        const dayJS = inject('dayJS');
        const store = useStore();
        const menuInfo = computed(() => store.state.getMenuItem.menuInfo);
        const { onChangeRegistRol, onChangeEditRol } = authCommFunc();
        const setPntPlcyDateRef = ref(null);
        const setPntVldDateRef = ref(null);
        const pntCtgrMdcsCdRef = ref(null);
        const state = reactive({
            pageType: computed(() => history.state.type == 'dcspntplcymod' ? '수정' : '등록'),
            data: {
                pntPlcyNm: '',     // 포인트정책명
                pntIssTyCd: '207001',        // 포인트유형
                pntIssSeCd: '214001',    // 포인트발급구분코드
                pntPlcyDscr: '',   // 포인트정책설명 
                pntPlcyCrtRsn: '',   // 정책생성사유 
                pntPlcyBgnDate: new Date(),   // 포인트정책시작일
                pntPlcyEndDate: new Date().getTime() + 3600 * 1000 * 24 * 30,   // 포인트정책종료일
                dplIssPsbYn: 'Y',  // 중복발급가능여부 (Y/N)
                dplStngSeCd: '209001',
                pntAmt: '',          // 포인트액면금액
                pntIssLmtCnt: '',      // 최대발급수량
                pntVldTrStngCd: '210002',     // 포인트유효기간설정코드
                pntVldTrSeCd: '211001',  // 포인트유효기간구분
                pntVldTr: '',      // 포인트유효기간
                pntVldBgnDate: new Date(),     // 포인트유효시작일
                pntVldEndDate: new Date().getTime() + 3600 * 1000 * 24 * 30,     // 포인트유효종료일
                pntPlcyCd: '',  // 포인트정책코드 (수정시 필요)
                aftDay: '',
                maxDail: '',
                plcyStCd: '',
                pntCtgrMjcsCd: '', //대
                pntCtgrMdcsCd: '' //중
                // pntBrmsHtVl : "",
            },
            setPntPlcyDate: {
                from: computed(() => state.data.pntPlcyBgnDate ? state.data.pntPlcyBgnDate : new Date()),
                to: computed(() => state.data.pntPlcyEndDate ? state.data.pntPlcyEndDate : new Date().getTime() + 3600 * 1000 * 24 * 30)
            },
            setPntVldDate: {
                from: computed(() => state.data.pntVldBgnDate ? state.data.pntVldBgnDate : new Date()),
                to: computed(() => state.data.pntVldEndDate ? state.data.pntVldEndDate : new Date().getTime() + 3600 * 1000 * 24 * 30)
            },
            menuCode: menuInfo.value.menuCode
        });

        watch(state, () => {
            state.data.pntIssLmtCnt = state.data.pntIssTyCd == '207002' ? '' : state.data.pntIssLmtCnt;
            state.data.pntVldTrSeCd = state.data.pntVldTrSeCd ? state.data.pntVldTrSeCd : '211001';
            state.data.dplStngSeCd = state.data.dplStngSeCd ? state.data.dplStngSeCd : '209001';
            state.data.aftDay = state.data.dplIssPsbYn == 'N' || state.data.dplStngSeCd != '209001' ? '' : state.data.aftDay;
            state.data.maxDail = state.data.dplIssPsbYn == 'N' || state.data.dplStngSeCd != '209002' ? '' : state.data.maxDail;
            
            state.data.pntVldBgnDate = state.data.pntVldBgnDate ? state.data.pntVldBgnDate : new Date();
            state.data.pntVldEndDate = state.data.pntVldEndDate ? state.data.pntVldEndDate : new Date().getTime() + 3600 * 1000 * 24 * 30;
        });

        onBeforeMount(async () => {
            if (history.state.type == 'dcsPntPlcyCopy' || history.state.type == 'dcspntplcymod') {
                state.data.pntPlcyCd = history.state.pntPlcyCd;
                state.data.plcyStCd  = history.state.plcyStCd;
                await getDcsPntPlcyDetail();
                setPntPlcyDateRef.value.setFromDate(state.data.pntPlcyBgnDate);
                setPntPlcyDateRef.value.setToDate(state.data.pntPlcyEndDate);
                if (state.data.pntVldTrStngCd == '210001') {
                    setPntVldDateRef.value.setFromDate(state.data.pntVldBgnDate);
                    setPntVldDateRef.value.setToDate(state.data.pntVldEndDate);
                }
            }
        });

        onMounted(async () => {
            emitter.$on('onChangeRegist', showModal);
            emitter.$on('onChangeEdit', showModal);

        });
        
        onUnmounted(() => {
            emitter.$off('onChangeRegist');
            emitter.$off('onChangeEdit');
        });

        const getDcsPntPlcyDetail = async () => {
            try {
                const response = await _getDcsPntPlcyDetail({pntPlcyCd: state.data.pntPlcyCd});
                let resData = response.data;
                if (response.code == 'OK') {
                    state.data = {
                        ...state.data,
                        ...resData,
                        aftDay: resData.dplStngSeCd == '209001' ? resData.dplIssPsbNum : '',
                        maxDail: resData.dplStngSeCd == '209002' ? resData.dplIssPsbNum : ''
                    };
                } else {
                    modal(response.message);
                }
            } catch (error) {
                modal(error);
            }
        };

        const checkColList = () => {
            let checkList = {
                'pntPlcyNm': '정책명',
                'pntPlcyDscr': '포인트 정책설명',
                'pntPlcyCrtRsn': '정책생성사유',
                'pntAmt': '포인트금액',
                'pntIssTyCd': '포인트유형',
                'pntIssSeCd': '발급구분',
                'pntVldTrStngCd': '유효기간설정',
                'pntCtgrMjcsCd': '포인트카테고리 대분류',
                'pntCtgrMdcsCd': '포인트카테고리 중분류'
            };
            let keys = Object.keys(checkList);
            let colName = '';
            let message = '';
            if (state.data.pntVldTrStngCd == '210002') {
                if (_.isEmpty(state.data.pntVldTr)) {
                    colName = '유효기간';
                }
            }
            for (let i = 0 ; i < keys.length ; i++) {
                if (_.isEmpty(state.data[keys[i]])) {
                    colName = checkList[keys[i]];
                    break;
                }
            }
            if (colName) message = colName + '은 필수로 입력해야합니다.';
            
            if (state.data.pntPlcyBgnDate > state.data.pntPlcyEndDate) {
                message = '정책종료일이 정책시작일보다 이전일 수 없습니다. 다시 입력하세요.';
            }
            
            if (state.data.pntVldBgnDate > state.data.pntVldEndDate) {
                message = '유효기간종료일이 유효기간시작일보다 이전일 수 없습니다. 다시 입력하세요.';
            }
            
            if (message) modal(message);
            
            return message ? true : false;
        };

        const numberFormat = (val, col, type) => {
            let temp = typeof val == 'string' ? val : val.toString();
            let num = temp.replace(/[^0-9]/g, '');
            if (type == 'won') {
                var regexp = /\B(?=(\d{3})+(?!\d))/g;
                num = num.toString().replace(regexp, ',');
            }
            state.data[col] = num;
            return num;
        };
        
        const pntPlcyPicker = (type, value) => {
            if (type === 'day') {
                state.data.pntPlcyBgnDate = value[0];
                state.data.pntPlcyEndDate = value[1];
            } else if (type === 'self_start') {
                state.data.pntPlcyBgnDate = value;
            }
            else if (type === 'self_end') {
                state.data.pntPlcyEndDate = value;
            }
        };

        const pntVldPicker = (type, value) => {
            if (type === 'day') {
                state.data.pntVldBgnDate = value[0];
                state.data.pntVldEndDate = value[1];
            } else if (type === 'self_start') {
                state.data.pntVldBgnDate = value;
            }
            else if (type === 'self_end') {
                state.data.pntVldEndDate = value;
            }
        };
        
        const reqData = () => {
            let check = checkColList();
            let params = {
                ...state.data,
                dplStngSeCd: state.data.dplIssPsbYn == 'Y' ? state.data.dplStngSeCd : '',
                dplIssPsbNum: parseInt(state.data.dplStngSeCd == '209001' ? state.data.aftDay : state.data.maxDail),
                pntIssLmtCnt: state.data.pntIssLmtCnt ? parseInt(state.data.pntIssLmtCnt) : '',
                pntAmt: parseInt(state.data.pntAmt.replace(',', '')),
                pntPlcyBgnDate: dayJS(state.data.pntPlcyBgnDate).format('YYYYMMDD'),
                pntPlcyEndDate: dayJS(state.data.pntPlcyEndDate).format('YYYYMMDD'),
                pntVldBgnDate: state.data.pntVldTrStngCd == '210001' ? dayJS(state.data.pntVldBgnDate).format('YYYYMMDD') : '',
                pntVldEndDate: state.data.pntVldTrStngCd == '210001' ? dayJS(state.data.pntVldEndDate).format('YYYYMMDD') : ''
            };
            
            if (state.data.pntVldTrStngCd == '210002') {
                params.pntVldBgnDate = '';
                params.pntVldEndDate = '';
            } else {
                params.pntVldTrSeCd = '';
                params.pntVldTr = '';
            }
            return {params, check};
        };

        const setDcsPntplcy = async () => {
            try {
                let {params, check} = reqData();
                if (check) return;
                let response = null;
                if (history.state.type == 'dcspntplcymod') {
                    response = await _setDcsPntPlcyMod(params);
                } else {
                    response = await _setDcsPntPlcyReg(params);
                }
                if (response.data.code == 'OK') {
                    goToPage('/point/rule/list');
                } else {
                    modal(response.data.message);
                }
            } catch (error) {
                modal(error);
            }
        };

        const showModal = () => {
            popInfo.modalType = 'save';
            popInfo.modalMessage = `해당 정책을 ${state.pageType}하시겠습니까?`;
            popInfo.modalTitle = `포인트 정책 ${state.pageType}`;
            isShow.value = true;
        };

        const closeModal = (type, value) => {
            let status = popInfo.modalType;
            isShow.value = false;
            if (type == 'modalconfirm') {
                if (status == 'save') {
                    setDcsPntplcy();
                }
            }
        };

        const changePntCtgrMjcsCd = async (val) => {
            if (state.data.pntCtgrMjcsCd) pntCtgrMdcsCdRef.value.setGrCdId(val);
            state.data.pntCtgrMjcsCd = val;
            state.data.pntCtgrMdcsCd = '';
        };

        const checkAuth = async () => {
            if (state.pageType == '등록') await onChangeRegistRol(menuInfo.value.auth1RegistYn);
            if (state.pageType == '수정') await onChangeEditRol(menuInfo.value.auth2UpdateYn);
        };

        return {
            pntCtgrMdcsCdRef,
            state,
            popInfo,
            isShow,
            pntPlcyPicker,
            pntVldPicker,
            goToPage,
            setDcsPntplcy,
            getDcsPntPlcyDetail,
            closeModal,
            numberFormat,
            setPntPlcyDateRef,
            setPntVldDateRef,
            changePntCtgrMjcsCd,
            checkAuth
        };
    }
};
</script>