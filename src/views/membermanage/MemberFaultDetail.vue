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
                                <th scope="row">회원명</th>
                                <td> {{ state.memberInfoDetail.mbrNm }}</td>
                                <th scope="row">회원번호</th>
                                <td> {{ state.memberInfoDetail.mbrSn }}</td>
                            </tr>
                            <tr>


                                <th scope="row">회원상태</th>
                                <td> {{ state.memberInfoDetail.mbrSt }}</td>
                                <th scope="row">아이디</th>
                                <td>{{ state.memberInfoDetail.mbrJnMthTyp }} {{ state.memberInfoDetail.mbrJnMthAcsId }}
                                </td>
                            </tr>
                            <tr>
                                <th scope="row">닉네임</th>
                                <td> {{ state.memberInfoDetail.mbrNcknm }}</td>
                                <th scope="row">생년월일</th>
                                <td> {{ state.memberInfoDetail.mbrBrth }}</td>
                            </tr>
                            <tr>
                                <th scope="row">개인이메일</th>
                                <td>{{ state.memberInfoDetail.mbrEmad }}</td>
                                <th scope="row">휴대폰번호</th>
                                <td>
                                    {{ state.memberInfoDetail.mbrHhpno }}
                                </td>
                            </tr>
                            <tr>
                                <th scope="row">배송지 주소</th>
                                <td colspan="3">
                                    <div v-if="state.memberInfoDetail.mbrDlvLcnmZc">
                                        ({{ state.memberInfoDetail.mbrDlvLcnmZc }})
                                        {{ state.memberInfoDetail.mbrDlvLcnmAdr }}
                                        {{ state.memberInfoDetail.mbrDlvLcnmAdrCts }}
                                    </div>
                                    <div v-else>
                                        -
                                    </div>

                                </td>
                            </tr>
                            <tr>
                                <th scope="row">성별</th>
                                <td>{{ state.memberInfoDetail.mbrSex }}</td>
                                <th scope="row">연령대</th>
                                <td>{{ state.memberInfoDetail.aggp }}</td>
                            </tr>
                            <tr>
                                <th scope="row">키</th>
                                <td>{{ state.memberInfoDetail.htVl }}{{ state.memberInfoDetail.htVl ? 'Cm' : '' }}</td>
                                <th scope="row">몸무게</th>
                                <td>{{ state.memberInfoDetail.mbrBdwtVl }}{{ state.memberInfoDetail.mbrBdwtVl ? 'Kg' : '' }}
                                </td>
                            </tr>
                            <tr>
                                <th scope="row">해외통관번호</th>
                                <td colspan="3">{{ state.memberInfoDetail.pcccNo }}</td>
                            </tr>
                            <tr>
                                <th scope="row">개인정보유효기간</th>
                                <td colspan="3">
                                    {{ state.memberInfoDetail.pinfClctUseAgrmTm }}/
                                    {{ state.memberInfoDetail.pinfClctUseAgrmXpDt }}
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
        <div class="ui-section">
            <subTitleBar :subTitle="'정보수신 동의 여부/일시'" />
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
                                <th scope="row">서비스 수신동의<br /> 여부 일자</th>
                                <td>
                                    {{ state.memberInfoDetail.infAgrmDtCpmYn }}
                                    <template v-if="state.memberInfoDetail.infAgrmDtCpm">
                                        /
                                        {{ dayJS(state.memberInfoDetail.infAgrmDtCpm).format('YYYY-MM-DD HH:mm') }}
                                    </template>
                                </td>
                                <th scope="row">마케팅 정보수신동의<br /> 여부 일자(PUSH)</th>
                                <td>
                                    {{ state.memberInfoDetail.infAgrmDtCpmYn }}
                                    <template v-if="state.memberInfoDetail.infAgrmDtCpm">
                                        /
                                        {{ dayJS(state.memberInfoDetail.infAgrmDtCpm).format('YYYY-MM-DD HH:mm') }}
                                    </template>
                                </td>
                            </tr>
                            <tr>
                                <th scope="row">마케팅 정보수신동의<br /> 여부 일자(SMS)</th>
                                <td>
                                    {{ state.memberInfoDetail.infAgrmDtSmsYn }}
                                    <template v-if="state.memberInfoDetail.infAgrmDtSms">
                                        /
                                        {{ dayJS(state.memberInfoDetail.infAgrmDtSms).format('YYYY-MM-DD HH:mm') }}
                                    </template>
                                </td>
                                <th scope="row">마케팅 정보수신동의<br /> 여부 일자(E-mail)</th>
                                <td>
                                    {{ state.memberInfoDetail.infAgrmDtEmailYn }}
                                    <template v-if="state.memberInfoDetail.infAgrmDtEmail">
                                        /
                                        {{ dayJS(state.memberInfoDetail.infAgrmDtEmail).format('YYYY-MM-DD HH:mm') }}
                                    </template>
                                </td>
                            </tr>

                        </tbody>
                    </table>
                </div>
            </div>
        </div>


        <div class="ui-section">
            <subTitleBar :subTitle="'가입 및 이력 정보'">
                <template #btn>
                    <button type="button" class="btn btn-sm" @click="actionModal('isHistoryShow')"><span class="txt">회원 이력
                            정보</span></button>
                </template>
            </subTitleBar>
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
                                <th scope="row">가입일자</th>
                                <td> {{ dayJS(state.memberInfoDetail.mbrJnDt).format('YYYY-MM-DD HH:mm') }}</td>
                                <th scope="row">수정일자</th>
                                <td>
                                    <div v-if="state.memberInfoDetail.updDt !== null">
                                        {{ dayJS(state.memberInfoDetail.updDt).format('YYYY-MM-DD HH:mm') }}
                                    </div>
                                    <div v-else>
                                        -
                                    </div>
                                </td>
                            </tr>
                            <tr>
                                <th scope="row">자격상실 변경일자</th>
                                <td> {{ }}</td>
                                <th scope="row">자격상실 변경사유</th>
                                <td> {{ }}</td>
                            </tr>

                            <tr>
                                <th scope="row">자격상실 해제일자</th>
                                <td colspan="3"> <!--{{ dayJS().format('YYYY-MM-DD HH:mm') }}--></td>
                            </tr>
                            <tr v-if="state.memberInfoDetail.mbrStCd === '104005'">
                                <th scope="row">이용중지 전환일자</th>
                                <td> {{ dayJS(state.memberInfoDetail.fultApnmDt).format('YYYY-MM-DD HH:mm') }}</td>
                                <th scope="row">이용중지 사유</th>
                                <td>
                                    <!-- {{ state.memberInfoDetail.fultRsn }} -->
                                    {{ state.memberInfoDetail.fultRsnCdNm }} {{ state.memberInfoDetail.frcdScsnTrgRsnTypCdNm ? `- ${state.memberInfoDetail.frcdScsnTrgRsnTypCdNm}` : '' }}
                                    <br>
                                    {{ state.memberInfoDetail.fultRsn }}
                                </td>
                            </tr>
                            <tr v-if="!(state.memberInfoDetail.mbrStCd === '104005')">
                                <th scope="row">이용중지 해제일자</th>
                                <td colspan="3">
                                    <template v-if="state.memberInfoDetail.fultRlsDt === null">
                                        -
                                    </template>
                                    <template v-else>
                                        {{ dayJS(state.memberInfoDetail.fultRlsDt).format('YYYY-MM-DD HH:mm') }}
                                    </template>
                                </td>
                            </tr>
                            <tr v-if="state.memberInfoDetail.mbrStCd === '104006'">
                                <th scope="row">강제탈퇴 일자</th>
                                <td> {{ dayJS(state.memberInfoDetail.frcdScsnNoticeDt).format('YYYY-MM-DD HH:mm') }}</td>
                                <th scope="row">강제탈퇴 사유</th>
                                <td>
                                    {{ state.memberInfoDetail.fultRsnCdNm }} - {{ state.memberInfoDetail.frcdScsnTrgRsnTypCdNm }}
                                    <br>
                                    {{ state.memberInfoDetail.frcdScsnRsn }}
                                </td>
                            </tr>
                            <tr v-if="state.memberInfoDetail.mbrStCd === '104002'">
                                <th scope=" row">회원탈퇴 일자</th>
                                <td>{{ dayJS(state.memberInfoDetail.mscsnDt).format('YYYY-MM-DD HH:mm') }}</td>
                                <th scope="row">회원탈퇴 사유</th>
                                <td>{{ state.memberInfoDetail.scsnRsn }}</td>
                            </tr>
                            <tr>
                                <th scope="row">최종 로그인 일자</th>
                                <td colspan="3">
                                    {{ dayJS(state.memberInfoDetail.ltlyLgnDt).format('YYYY-MM-DD HH:mm') }}
                                </td>
                            </tr>

                        </tbody>
                    </table>
                </div>
            </div>
        </div>

        <!-- mbrStCd 104001 == 정상
        mbrStCd 104002 == 탈퇴
        mbrStCd 104004 == 유효기간 만료탈퇴
        mbrStCd 104005 == 불량
        mbrStCd 104006 == 불량확정 강제탈퇴 -->

        <div class="ui-tab-wrap mt-30">
            <div class="ui-tabs">
                <ul>
                    <li :class="{ 'active': state.tabPannel === tab.value }" v-for="(tab, index) in state.tablist"
                        :key="index">
                        <button type="button" class="ui-tab-item" @click="onChangeTab(tab.value)">
                            <span>
                                {{ tab.label }}
                            </span>
                        </button>
                    </li>
                </ul>
            </div>
            <div class="ui-panels">
                <div class="ui-panel-item">
                    <div v-if="state.tabPannel === 'service'" class="ui-section">

                        <MemberService :menuInfo="menuInfo" />
                    </div>
                    <div v-if="state.tabPannel === 'point'" class="ui-section">
                        <MemberPoint :menuInfo="menuInfo" />
                    </div>
                    <div v-if="state.tabPannel === 'event'" class="ui-section">
                        <MemberEvent :menuInfo="menuInfo" />
                    </div>
                    <div v-if="state.tabPannel === 'VOC'" class="ui-section">
                        <MemberVOC :menuInfo="menuInfo" />
                    </div>
                    <div v-if="state.tabPannel === 'commerce'" class="ui-section">
                        커머스
                    </div>
                    <div v-if="state.tabPannel === 'agree'" class="ui-section">
                        <MemberAgree :menuInfo="menuInfo" />
                    </div>
                    <div v-if="state.tabPannel === 'depth'" class="ui-section">
                        소속
                    </div>
                </div>
            </div>
        </div>

        <div class=" btn-bottom-set flex justify-center">
            <button type="button" class="btn btn-sl nega" @click="goToPage('/member/fault/list')">
                목록으로
            </button>
            <button :disabled="!state.mskgnRlsYn" class="btn btn-sl nega" type="button" @click="changeMskgnRlsYn()">
                마스킹해제
            </button>
            <button type="button" class="btn btn-sl posi" @click="onChangeAuthEdit('edit', 'memberIsShow')">
                이용중지해제
            </button>

            <button type="button" class="btn btn-sl posi" @click="onChangeAuthEdit('edit', 'isMemberOut')">
                강제탈퇴
            </button>
        </div>


        <!-- 가입 및 이력 정보 -->
        <DefaultModal :buttonCancel="''" :buttonConfirm="'닫기'" :className="'full'" :isShow="isHistoryShow"
            :modalName="'isHistoryShow'" modalTitle="가입 및 이력 정보" @modalclose="modalControl">
            <template #modalcontent>
                <div>
                    <MemberHistory :mbrSn="state.detailNum" :mskgnRlsYn="state.mskgnRlsYn" />
                </div>
            </template>
        </DefaultModal>
        <!-- 이용중지 설정 -->
        <DefaultModal :buttonCancel="'닫기'" :buttonConfirm="'저장'" :isShow="isMemberOut" :modalName="'isMemberOut'"
            :className="'full'" modalTitle="강제탈퇴 설정" @modalclose="modalControl">
            <template #modalcontent>
                <div>

                    <div class="ui-grid-top-guide mt-10 t-right">
                        <span class="ess"></span> 표시는 필수항목입니다.
                    </div>
                    <div class="tbl-wrap mt-10">
                        <table class="table reg">
                            <colgroup>
                                <col style="width: 200px;">
                                <col style="width: auto;">
                            </colgroup>
                            <tbody>
                                <tr>
                                    <th scope="row">강제탈퇴 사유<span class="ess"><span class="offscreen">필수입력</span></span></th>
                                    <td>
                                        <div class="reg-group">
                                            <div class="reg-item">
                                                <commselect :className="'sm'" :selectType="'searchCode.frcdScsnTrgRsnTypCd'"
                                                    :initData="formData.frcdScsnRsnCd" @changedValue="selectedOptions" />
                                            </div>
                                        </div>
                                    </td>
                                </tr>

                                <tr>
                                    <th scope="row">강제탈퇴 사유 설명
                                        <span class="ess"><span class="offscreen">필수입력</span></span>
                                    </th>
                                    <td>
                                        <div class="reg-group">
                                            <div class="reg-item">
                                                <textarea id="textarea" class="form-control" style="height: 100px"
                                                    v-model="formData.frcdScsnRsn"></textarea>
                                            </div>
                                        </div>
                                        <div v-if="checkValidState('frcdScsnRsn')">
                                            <p class="input-guide" :class="{ 'error': state.validState.errState }">
                                                {{ state.validState.message }}
                                            </p>
                                        </div>
                                    </td>
                                </tr>

                            </tbody>
                        </table>
                    </div>
                </div>
            </template>
        </DefaultModal>

    </section>
</template>

<script>
import { reactive, inject, onMounted, ref, computed, watch, onUnmounted } from 'vue';
import DefaultModal from '@/plugins/modal/modal/DefaultModal.vue';
import DateSerch from '@/components/ui/DateSerch.vue';
import MemberEvent from './component/MemberEvent.vue';
import MemberVOC from './component/MemberVOC.vue';
import MemberAgree from './component/MemberAgree.vue';
import MemberHistory from './component/MemberHistory.vue';
import MemberPoint from './component/MemberPoint.vue';
import MemberService from './component/MemberService.vue';
import { useCommFunc } from '@/core/helper/common.js';
import { authCommFunc } from '@/core/helper/authComm.js';
import { useStore } from 'vuex';
import { _getFaultInfo, _removeFault, _memberOut } from '@/api/memberinfo.js';
import { _uploadFile } from '@/api/common.js';
import { useRouter, useRoute } from 'vue-router';
import { formatDuration } from 'date-fns';

export default {
    components: { DefaultModal, MemberHistory, DateSerch, MemberEvent, MemberVOC, MemberAgree, MemberPoint, MemberService },
    setup() {
        const $Modal = inject('$Modal');
        const dayJS = inject('dayJS');
        const { goToPage, tableResize, openModal } = useCommFunc();
        const store = useStore();
        const route = useRoute();
        const isHistoryShow = ref(false);
        const mailType = ref(null);
        const infoChangeShow = ref(false);
        const isUseStop = ref(false);
        const isMemberOut = ref(false);
        /**
         * 권한은 스토어에서 가져옴 (권한여부는 메뉴리스트에서 가져온다)
         * store.state.getMenuItem.menuInfo
         * "auth1RegistYn": "Y/N",  등록
         * "auth2UpdateYn": "Y/N",  수정
         * "auth3DeleteYn": "Y/N",  삭제
         * "auth4ApproveYn": "Y/N", 승인
         * "auth5DownloadYn": "Y/N", 다운 
         * "auth6MaskingYn": "Y/N" 마스킹
         */
        const { onChangeMaskingRol, onChangeEditRol } = authCommFunc();
        const menuInfo = computed(() => store.state.getMenuItem.menuInfo);
        const state = reactive({
            imgName: '',
            request: {
                rsnCd: '',
                rsnCts: ''
            },
            memberInfoDetail: {},
            pagesize: 10,
            mskgnRlsYn: true,
            detailNum: '',
            modalMsg: '',
            saleFeeRt: '',
            mdSn: '',
            mdNm: '',
            mailType1: '',
            mailType2: '',
            fileList: [],
            modalMode: '',
            setDay: '1month',
            startDay: '',
            endDay: '',
            tablist: [
                { label: '서비스', value: 'service' },
                { label: '포인트/쿠폰', value: 'point' },
                { label: '참여 이벤트', value: 'event' },
                { label: 'VOC', value: 'VOC' },
                // { label: '커머스', value: 'commerce' },
                { label: '약관동의내역', value: 'agree' }
                // { label: '소속', value: 'depth' }
            ],
            tabPannel: 'service',
            validState: {
                errState: false, // error state
                message: '', // input message
                target: ''
            },
            editMode: '',
            caseMode: ''

        });
        const formData = reactive({
            mbrSn: computed(() => state.detailNum), //회원순번,
            mskgnRlsYn: computed(() => state.mskgnRlsYn),
            frcdScsnRsnCd: '225001', //이용중지사유코드(225001: 회원정보 허위기재)
            frcdScsnRsn: '', //탈퇴사유,
            menuCode: menuInfo.value.menuCode

        });
        onMounted(() => {
            console.log(route.query);
            state.detailNum = route.query.mbrSn;
            console.log(route.query);
            getFaultInfo();
            emitter.$on('onChangeMskgn', onChangeMskgn);
            emitter.$on('onChangeEdit', onChangeEdit);
        });
        // 마스킹 해제 이벤트 버스 해제
        onUnmounted(() => {
            emitter.$off('onChangeMskgn');
            emitter.$off('onChangeEdit');
        });
        // 마스킹 권한 체크
        const changeMskgnRlsYn = async () => {
            await onChangeMaskingRol(menuInfo.value.auth6MaskingYn);
        };
        //마스킹 해제 처리 후 리스트 재조회 
        const onChangeMskgn = () => {
            state.mskgnRlsYn = !state.mskgnRlsYn;
            getFaultInfo();
        };
        //수정권한 처리
        const onChangeAuthEdit = async (type, caseType) => {
            console.log(type);
            state.editMode = type;
            state.caseMode = caseType;
            await onChangeEditRol(menuInfo.value.auth2UpdateYn);
        };
        // 버튼별 권한 처리 
        const onChangeEdit = () => {
            if (state.editMode !== 'fault') {
                state.mskgnRlsYn ? actionBtns('maskingFault') : actionModal(state.caseMode, state.editMode);
            } else {
                state.mskgnRlsYn ? actionBtns('maskingFault') : actionModal('isUseStop');
            }
        };
        const resetState = () => {
            state.isCheckTermsName = false; // 중복확인
            state.validState.errState = false; // validation
            state.validState.message = '';
        };
        watch(formData, () => {
            resetState();
        });
        // 상세
        const getFaultInfo = async () => {
            try {
                let params = {
                    mskgnRlsYn: state.mskgnRlsYn ? 'Y' : 'N'
                };
                const response = await _getFaultInfo(state.detailNum, params);
                console.log(response.data.data);
                state.memberInfoDetail = response.data.data;
            } catch (error) {
                console.log(error);
            }
        };
        // 강제탈퇴
        const memberOut = async () => {
            try {
                let params = {
                    mbrSn: formData.mbrSn,
                    frcdScsnRsnCd: formData.frcdScsnRsnCd,
                    frcdScsnRsn: formData.frcdScsnRsn,
                    menuCode: formData.menuCode
                };
                const response = await _memberOut(params);
                if (response.data.code === 'OK') {
                    goToPage('/member/fault/list');
                }
            } catch (error) {
                console.log(error);
            }
        };


        //이용중지 해제
        const removeFault = async () => {
            try {
                let params = {
                    mbrSn: formData.mbrSn,
                    menuCode: formData.menuCode
                };
                const response = await _removeFault(params);
                if (response.data.code === 'OK') {
                    await getFaultInfo();
                    if (response.data.code === 'OK') {
                        goToPage('/member/fault/list');
                    }
                }
            } catch (error) {
                console.log(error);
            }
        };
        //탭이동
        const onChangeTab = (type) => {
            state.tabPannel = type;
        };
        // 데이터 피커 날짜 검색
        const onSelectPicker = (type, value, status) => {
            // 버튼으로 선택된 기준
            if (type === 'day') {
                state.startDay = value[0];
                state.endDay = value[1];
            } else if (type === 'self_end' || type === 'self_start') {
                // 직접 데이터 피커 설정
                if (type === 'self_start') {
                    state.startDay = value;
                } else if (type === 'self_end') {
                    state.endDay = value;
                }
            }
            //api호출
            console.log('선택일:' + value, '선택된 버튼:' + type, '조회기준:' + status, dayJS(formData.from).format('MM-DD'));
        };
        const actionBtns = async (type) => {
            if (type === 'masking') {
                state.modalMsg = '마스킹 해제 하시겠습니까?';
            } else if (type === 'maskingFault') {
                state.modalMsg = '마스킹 해제 후  설정이 가능합니다.';
            } else if (type === 'memberIsShow') {
                state.modalMsg = '이용중지 해제 처리 하시겠습니까?';
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
                    if (type === 'masking') {
                        state.mskgnRlsYn = 'Y';
                        getFaultInfo();
                    } else if (type === 'memberIsShow') {
                        removeFault();
                    }
                })
                .catch(error => {
                    console.log(error);
                });
        };
        const actionModal = (type, code, mode) => {
            if (type === 'isMemberOut') {
                isMemberOut.value = true;
            } else if (type === 'isHistoryShow') {
                console.log(type);
                isHistoryShow.value = true;
            } else if (type === 'memberIsShow') {
                actionBtns(type);
            }
        };
        // 모달창 닫기
        const modalControl = async (type, modalName) => {
            if (modalName === 'isMemberOut') {
                if (type === 'modalconfirm') {
                    if (validCheck('isMemberOut')) {
                        isMemberOut.value = false;
                        await memberOut();
                    }

                } else {
                    isMemberOut.value = false;
                }
            } else if (modalName === 'isHistoryShow') {
                isHistoryShow.value = false;
            } else if (!modalName) {
                isMemberOut.value = false;
                isHistoryShow.value = false;
            }
            console.log(type, modalName);
        };



        // @validate
        const validCheck = (type) => {
            console.log(type);
            let target = [];
            if (type === 'isMemberOut') {
                target = ['frcdScsnRsn'];
            }

            for (const item of target) {
                state.validState.target = item;
                state.validState.message = '강제탈퇴 사유를 입력하세요';
                if (!formData[item]) {
                    state.validState.errState = true;
                    break;
                }
            }
            return !state.validState.errState;
        };
        // 에러체크
        const checkValidState = (type) => {
            return state.validState.target === type && state.validState.errState;
        };
        const selectedOptions = (valueCode, valueName, type) => {
            console.log(type);
            if (type === 'rprsTlnoFno' || type === 'mailType2') {
                if (type === 'mailType2') {
                    state.mailType2 = valueName;
                } else {
                    formData[type] = valueName;
                }
            } else if (type === 'mailType1') {
                console.log();
            } else {
                formData[type] = valueCode;
            }
            console.log(valueCode, valueName, type);
        };
        // 페이징 처리
        const pager = reactive({
            current: 1,
            currentPageSize: 1,
            size: computed(() => state.pagesize),
            offset: computed(() => (pager.current - 1) * pager.size),
            totalCnt: 0
        });
        const onChangedPage = (pagenum) => {
            pager.current = pagenum;
            //api호출
        };

        return {
            //공통 사용
            $Modal,
            dayJS,
            goToPage,
            tableResize,
            isMemberOut,
            mailType,
            state,
            formData,
            openModal,
            pager,
            isHistoryShow,

            actionModal,
            modalControl,
            onChangedPage,
            actionBtns,
            selectedOptions,
            onSelectPicker,
            onChangeTab,
            checkValidState,
            onChangeAuthEdit,
            menuInfo,
            changeMskgnRlsYn
        };
    }
};
</script>