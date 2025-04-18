<template>
    <section>
        <div class="ui-section">
            <subTitleBar :subTitle="'기업 정보'" />
            <!-- {{ state.joinRequestDetail }} -->
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
                                <th scope="row">아이디</th>
                                <td>{{ state.joinRequestDetail.admnId }}</td>
                                <th scope="row">가입상태</th>
                                <td>
                                    {{ state.joinRequestDetail.jnStNm }}
                                </td>
                            </tr>
                            <tr>
                                <th scope="row">기업명</th>
                                <td>{{ state.joinRequestDetail.ntprNm }}</td>
                                <th scope="row">KB계열사</th>
                                <td>

                                    <template v-if="state.joinRequestDetail.kbAffiYn === 'Y'">
                                        해당함
                                    </template>
                                    <template v-else>
                                        해당없음
                                    </template>
                                </td>
                            </tr>
                            <tr>
                                <th scope="row">메디컬구분</th>
                                <td>{{ state.joinRequestDetail.mdclNm }}</td>
                                <th scope="row">사업자등록번호</th>
                                <td>{{ formatterBrn(state.joinRequestDetail.brn) }}</td>
                            </tr>
                            <tr>
                                <th scope="row">업태</th>
                                <td>{{ state.joinRequestDetail.bcoNm }}</td>
                                <th scope="row">종목</th>
                                <td>{{ state.joinRequestDetail.indtpNm }}</td>
                            </tr>
                            <tr>
                                <th scope="row">대표 전화번호</th>
                                <td>{{ state.joinRequestDetail.rprsTlno }}</td>
                                <th scope="row">팩스번호</th>
                                <td>
                                    <template v-if="state.joinRequestDetail.fax !== '02--'">
                                        {{ state.joinRequestDetail.fax }}
                                    </template>
                                    <template v-else>
                                        -
                                    </template>
                                </td>
                            </tr>
                            <tr>
                                <th scope="row">주소</th>
                                <td>{{ state.joinRequestDetail.zc }}{{ state.joinRequestDetail.adr }}</td>
                                <th scope="row">상세주소</th>
                                <td>{{ state.joinRequestDetail.adrCts }}</td>
                            </tr>
                            <tr>
                                <th scope="row">법인계좌번호</th>
                                <td colspan="3">
                                    {{ state.joinRequestDetail.bknm }}
                                    {{ state.joinRequestDetail.acno }}
                                    {{ state.joinRequestDetail.accountNm }}
                                </td>

                            </tr>
                            <tr>
                                <th scope="row">기업코드</th>
                                <td>{{ state.joinRequestDetail.ntprUcd }}</td>
                                <th scope="row">추천기업</th>
                                <td>
                                    <template v-if="state.joinRequestDetail.rcmNtprNm !== null">
                                        {{ state.joinRequestDetail.rcmNtprNm }}
                                        ({{ state.joinRequestDetail.rcmNtprUcd }})
                                    </template>
                                    <template v-else>
                                        -
                                    </template>
                                </td>

                            </tr>
                            <tr>
                                <th scope="row">거래처코드(더존ERP) <span class="ess"><span class="offscreen">필수입력</span></span>
                                </th>
                                <td colspan="3">
                                    <div class="reg-group inline">
                                        <div class="reg-item">
                                            <input type="text" maxlength="5"
                                                :class="['form-control', { error: checkValidState('dlngPlcCd') }]"
                                                :value="formData.dlngPlcCd" data-target="dlngPlcCd" @input="setInputNumber">
                                        </div>
                                    </div>
                                    <span v-if="checkValidState('dlngPlcCd')" class="input-guide"
                                        :class="{ 'error': checkValidState('dlngPlcCd') }">
                                        {{ state.validState.message }}
                                    </span>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
        <div class="ui-section">
            <subTitleBar :subTitle="'담당자 정보'" />
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
                                <th scope="row">담당부서</th>
                                <td>{{ state.joinRequestDetail.admnDepNm }}</td>
                                <th scope="row">담당자명</th>
                                <td>{{ state.joinRequestDetail.admnNm }}</td>
                            </tr>
                            <tr>
                                <th scope="row">담당자 휴대폰 번호</th>
                                <td>{{ state.joinRequestDetail.admnHhpno }}</td>
                                <th scope="row">담당자 이메일 주소</th>
                                <td>{{ state.joinRequestDetail.admnEmad }}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
        <div class="ui-section">
            <subTitleBar :subTitle="'첨부 서류'" />
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
                                <th scope="row">사업자등록증 사본</th>
                                <td>
                                    <div class="reg-group inline">

                                        <div class="reg-item">
                                            <button type="button" class="btn btn-slm"
                                                @click="openModal('isImgDownShow', menuInfo.menuCode, '사업자 등록증', state.joinRequestDetail.bzlcCpAtflSn)">
                                                파일 다운로드
                                            </button>


                                        </div>
                                    </div>
                                </td>
                                <th scope=" row">법인계좌 사본</th>
                                <td>
                                    <div class="reg-group inline">
                                        <div class="reg-item">
                                            <button type="button" class="btn btn-slm"
                                                @click="openModal('isImgDownShow', menuInfo.menuCode, '법인계좌 사본', state.joinRequestDetail.bzlcCpAtflSn)">
                                                파일 다운로드
                                            </button>
                                        </div>
                                    </div>
                                </td>
                            </tr>
                            <tr v-if="state.joinRequestDetail.mdclCd === '113002'">
                                <th scope="row">의사면허증 사본</th>
                                <td colspan="3">
                                    <div class="reg-group inline">

                                        <div class="reg-item">
                                            <button type="button" class="btn btn-slm"
                                                @click="openModal('isImgDownShow', menuInfo.menuCode, '의사면허증', state.joinRequestDetail.dctCoqCpAtflSn)">
                                                파일 다운로드
                                            </button>


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
            <subTitleBar :subTitle="'이력 정보'" />
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
                                <th scope="row">가입자 신청일</th>
                                <td>{{ state.joinRequestDetail.rgsDt }}</td>
                                <th scope="row">등록자</th>
                                <td>
                                    {{ state.joinRequestDetail.rgsUsrNm }}
                                    등록자 레벨{{ state.joinRequestDetail.rgsLvlEngNm }}
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
        <!-- 가입상태가 재가입경우 -->
        <div class="ui-section" v-if="state.joinRequestDetail.jnStNm === '가입재신청'">
            <subTitleBar :subTitle="'재가입 요청'" />
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
                                <th scope="row">사유코드</th>
                                <td>{{ state.joinRequestDetail.reJnRqstRsnNm }}</td>
                                <th scope="row">설명</th>
                                <td>{{ state.joinRequestDetail.reJnRqstRsnCts }}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
        <div class="btn-bottom-set flex justify-center">
            <button type="button" class="btn btn-sl nega" @click="goToPage('/medical/regist/list')">
                취소
            </button>
            <button type="button" class="btn btn-sl nega" @click="changeDelRol"
                v-if="state.joinRequestDetail.jnStCd !== '110002'">
                삭제
            </button>
            <button type="button" class="btn btn-sl nega" :disabled="state.mskgnRlsYn === false" @click="changeMskgnRlsYn">
                마스킹해제
            </button>
            <button type="button" class="btn btn-sl posi"
                @click="() => { state.mskgnRlsYn === true ? actionBtns('request') : openModal('isRequestShow') }">
                가입재신청
            </button>
            <button type="button" class="btn btn-sl posi" @click="changeApprRol">승인</button>
        </div>

        <DefaultModal :isShow="isRequestShow" :modalTitle="'가입재신청 사유 등록'" :buttonConfirm="'확인'" :buttonCancel="'취소'"
            :modalName="'isRequestShow'" @modalclose="modalControl">
            <template #modalcontent>
                <RequestRegist @requestFormat="requestConfirm" ref="requestConRef" />
            </template>
        </DefaultModal>

    </section>
</template>
<script>
import { reactive, inject, onMounted, ref, computed, onUnmounted, watch } from 'vue';
import DefaultModal from '@/plugins/modal/modal/DefaultModal.vue';
import MdSearch from '@/components/ui/MdSearch.vue';
import { useCommFunc } from '@/core/helper/common.js';
import { authCommFunc } from '@/core/helper/authComm.js';
import { useStore } from 'vuex';
import { commoCode } from '@/data/commcode';
import { _getDetailMedicalRequest, _rejoinMedicalRequest, _getApprMedical, _deleteMedicalRequest } from '@/api/medical.js';
import { useRouter, useRoute } from 'vue-router';
export default {
    components: { DefaultModal, MdSearch },
    setup() {
        const $Modal = inject('$Modal');
        const dayJS = inject('dayJS');
        const { goToPage, fileDownload, openModal, isRequestShow, formatterBrn } = useCommFunc();
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
        const { onChangeMaskingRol, onChangeApprRol, onChangeDelRol } = authCommFunc();
        const store = useStore();
        const route = useRoute();
        const isMdShow = ref(false);
        const requestConRef = ref(null);
        const menuInfo = computed(() => store.state.getMenuItem.menuInfo);
        const state = reactive({
            imgName: '',
            request: {
                rsnCd: '160001',
                rsnCts: ''
            },
            joinRequestDetail: {},
            pagesize: 10,
            mskgnRlsYn: true,
            detailNum: '',
            modalMsg: '',
            mdNm: '',
            ntprSn: '',
            dlngPlcCd: '',
            validState: {
                type: '', // validation check ( formData )
                errState: false, // error state
                message: '' // input message
            }
        });
        const formData = reactive({
            ntprSn: computed(() => state.ntprSn),
            dlngPlcCd: computed(() => state.dlngPlcCd)
        });

        onMounted(() => {
            console.log(route.query);
            state.detailNum = route.query.Sn;
            console.log(route.query);
            getDetailMedicalRequest();

            emitter.$on('onChangeMskgn', onChangeMskgn);
            emitter.$on('onChangeAppr', onChangeAppr);
            emitter.$on('onChangeDel', onChangeDel);
        });
        watch(() => [state.dlngPlcCd], () => {
            resetState();
        });

        onUnmounted(() => {
            emitter.$off('onChangeMskgn');
            emitter.$off('onChangeAppr');
            emitter.$off('onChangeDel');
        });

        /**
         * 마스킹 권한 체크
         */
        const changeMskgnRlsYn = async () => {
            // await onChangeMaskingRol(menuInfo.value.auth6MaskingYn);
            await onChangeMaskingRol('Y');
        };

        /**
         * 마스킹 해제 처리 후 리스트 재조회
         */
        const onChangeMskgn = () => {
            state.mskgnRlsYn = !state.mskgnRlsYn;
            getDetailMedicalRequest();
        };

        /**
        * 승인 권한 체크
        */
        const changeApprRol = async () => {
            // await onChangeApprRol(menuInfo.value.auth4ApproveYn);
            await onChangeApprRol('Y');
        };

        /**
         * 승인 권한 체크 callback
         */
        const onChangeAppr = () => {
            actionBtns('confirm');
        };

        /**
         * 삭제 권한 체크
         */
        const changeDelRol = async () => {
            await onChangeDelRol(menuInfo.value.auth3DeleteYn);
            // await onChangeDelRol('Y');
        };

        /**
         * 삭제 권한 체크 callback
         */
        const onChangeDel = () => {
            actionBtns('cancel');
        };
        // 상세
        const getDetailMedicalRequest = async () => {
            try {
                let params = {
                    mskgnRlsYn: state.mskgnRlsYn ? 'Y' : 'N'
                };
                const response = await _getDetailMedicalRequest(state.detailNum, params);
                console.log(response.data.data);
                state.joinRequestDetail = response.data.data;
                state.ntprSn = response.data.data.ntprSn;
                state.dlngPlcCd = response.data.data.dlngPlcCd;
            } catch (error) {
                console.log(error);
            }
        };
        //승인
        const getApprMedical = async () => {
            try {

                let params = {
                    dlngPlcCd: formData.dlngPlcCd,
                    ntprSn: formData.ntprSn
                };
                const response = await _getApprMedical(state.detailNum, params);
                if (response.data.code === 'OK') {
                    await goToPage('/medical/regist/list');
                } else {
                    console.log(response.data.message);
                }
                //
                console.log(response);
            } catch (error) {
                console.log(error);

            }
        };
        //가입 재신청
        const rejoinMedicalRequest = async () => {
            try {
                let params = {
                    sn: state.detailNum,
                    rsnCd: state.request.rsnCd,
                    rsnCts: state.request.rsnCts
                };
                const response = await _rejoinMedicalRequest(params);
                if (response.data.code === 'OK') {
                    goToPage('/medical/regist/list');
                }
            }
            catch (error) {
                console.log(error);
            }
        };
        //삭제
        const deleteMedicalRequest = async () => {
            try {
                let params = state.detailNum;
                const response = await _deleteMedicalRequest(params);
                if (response.data.code === 'OK') {
                    goToPage('/medical/regist/list');
                }

            } catch (error) {
                console.log(error);
            }
        };
        const actionBtns = async (type) => {
            if (type === 'confirm') {
                if (state.mskgnRlsYn) {
                    $Modal.confirm({
                        title: '',
                        message: '마스킹 해제 후 가입 승인 가능합니다.',
                        buttonText: {
                            confirm: '확인',
                            cancel: '취소'
                        }
                    });
                } else {
                    if (validFormData()) {
                        $Modal.confirm({
                            title: '',
                            message: '승인처리 하시겠습니까?',

                            buttonText: {
                                confirm: '확인',
                                cancel: '취소'
                            }
                        })
                            .then(success => {
                                getApprMedical();
                            })
                            .catch(error => {
                                console.log(error);
                            });
                    }
                }
            } else if (type === 'request') {

                if (state.mskgnRlsYn) {
                    $Modal.confirm({
                        title: '',
                        message: '마스킹 해제 후 가입재신청이 가능합니다.',
                        buttonText: {
                            confirm: '확인',
                            cancel: '취소'
                        }
                    });
                }

            } else {
                if (state.mskgnRlsYn) {
                    $Modal.confirm({
                        title: '',
                        message: '마스킹 해제 후 삭제가 가능합니다.',
                        buttonText: {
                            confirm: '확인',
                            cancel: '취소'
                        }
                    });
                } else {
                    $Modal.confirm({
                        title: '',
                        message: '삭제 하시겠습니까?',

                        buttonText: {
                            confirm: '확인',
                            cancel: '취소'
                        }
                    })
                        .then(success => {
                            deleteMedicalRequest();
                        })
                        .catch(error => {
                            console.log(error);
                        });
                }
            }
        };
        // 모달창 닫기
        const modalControl = (type, modalName) => {
            if (modalName === 'isRequestShow') {
                // isRequestShow.value = false;
                if (type !== 'modalconfirm') {
                    isRequestShow.value = false;
                } else {
                    if (requestConRef.value.validCheck()) {
                        isRequestShow.value = false;
                        rejoinMedicalRequest();
                    }
                }

            } else if (!modalName) {
                isRequestShow.value = false;
                isMdShow.value = false;
            }
        };
        // 재가입요청 데이터 처리
        const requestConfirm = (type, con) => {
            if (type === 'code') {
                state.request.rsnCd = con;
            } else {
                state.request.rsnCts = con;
            }
        };

        const onChangemdSearch = (value) => {
            console.log(value);
            state.mdSn = value.sn;
            state.mdNm = value.admnNm;
            console.log(value, state.mdSn);
            isMdShow.value = false;
        };
        /**
         * @validate
         */
        const validFormData = () => {
            const target = ['dlngPlcCd'];

            for (const item of target) {
                console.log('check check >>', item);

                state.validState.target = item;

                let msg = '';
                if (item === 'dlngPlcCd') msg = '거래처코드(더존ERP)를 입력해주세요.';

                state.validState.message = msg;

                // 예외 케이스 (아이디 중복체크)

                if (_.isEmpty(state[item])) {
                    state.validState.errState = true;
                    break;
                }
            }

            return !state.validState.errState;
        };

        const checkValidState = (type) => {
            return state.validState.target === type && state.validState.errState;
        };

        /**
         * @validation 상태 초기화
         */
        const resetState = () => {
            console.log('reset valide state');
            state.validState.type = ''; // validation
            state.validState.errState = false;
            state.validState.message = '';
        };

        /**
         * @check setInputNumber
         */
        const setInputNumber = (event) => {
            const target = event.target.getAttribute('data-target');
            state[target] = event.target.value;
            console.log(event.target.getAttribute('data-target'), state[target]);
            checkReg(target, state[target]);
        };

        const checkReg = (type, value) => {
            const reg = /^[0-9*]+$/;
            if (!reg.test(value)) state[type] = state[type].replace(/[^0-9*]/g, '');
        };

        const onChangedPage = (pagenum) => {
            pager.current = pagenum;
            //api호출
        };

        return {
            //공통 사용
            commoCode,
            $Modal,
            dayJS,
            goToPage,
            menuInfo,
            openModal,
            isRequestShow,
            state,
            formData,
            fileDownload,
            requestConRef,
            changeMskgnRlsYn,
            modalControl,
            requestConfirm,
            onChangedPage,
            actionBtns,
            onChangemdSearch,
            setInputNumber,
            checkValidState,
            changeApprRol,
            changeDelRol,
            formatterBrn
        };
    }
};
</script>