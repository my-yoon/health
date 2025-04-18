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
                                <th scope="row">사업자등록번호</th>
                                <td colspan="3">
                                    <!-- {{ state.joinRequestDetail.brn?.replace(/(\d{3})(\d{2})(\d{5})/, '$1-$2-$3') }} -->
                                    {{ formatterBrn(state.joinRequestDetail.brn) }}
                                </td>
                                <!-- <th scope="row">사업자유형</th>
                                <td>
                                    {{ state.joinRequestDetail.bzmTyNm }} /
                                    {{ state.joinRequestDetail.bzmTyDtlNm }}
                                </td> -->
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
                                <td>{{ state.joinRequestDetail.fax }}</td>
                            </tr>
                            <tr>
                                <th scope="row">주소</th>
                                <td colspan="3">({{ state.joinRequestDetail.zc }}) {{ state.joinRequestDetail.adr }} {{
                                    state.joinRequestDetail.adrCts }}</td>
                            </tr>
                            <tr>
                                <th scope="row">법인계좌번호</th>
                                <td colspan="3">
                                    {{ state.joinRequestDetail.bknm }}
                                    {{ state.joinRequestDetail.acno }}
                                    ({{ state.joinRequestDetail.accountNm }})
                                </td>
                            </tr>
                            <tr>
                                <th scope="row">기업코드</th>
                                <td>{{ state.joinRequestDetail.ntprUcd }}</td>
                                <th scope="row">추천기업</th>
                                <td>
                                    {{ state.joinRequestDetail.rcmNtprNm }}
                                    {{ !_.isEmpty(state.joinRequestDetail.rcmNtprUcd) ?
                                        `(${state.joinRequestDetail.rcmNtprUcd})` : '' }}
                                </td>
                            </tr>
                            <tr>
                                <th scope="row">거래처코드(더존ERP)<span class="ess"><span class="offscreen">필수입력</span></span>
                                </th>
                                <td colspan="3">
                                    <div class="reg-group inline">
                                        <div class="reg-item">
                                            <input type="text"
                                                :class="['form-control', { error: checkValidState('dlngPlcCd') }]"
                                                v-model="state.dlngPlcCd">
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
                                            <!-- <button type="button" class="btn btn-slm"
                                                @click="openModal('isImgDownShow', menuInfo.menuCode, '사업자등록증 사본', state.joinRequestDetail.bzlcCpAtflSn)">
                                                파일 다운로드
                                            </button> -->
                                            <button type="button" class="btn btn-slm"
                                                @click="openModal('isImgDownShow', menuInfo.menuCode, '사업자등록증 사본', state.joinRequestDetail.bzlcCpAtflSn)">
                                                파일 다운로드
                                            </button>
                                        </div>
                                    </div>
                                </td>
                                <th scope=" row">법인계좌 사본</th>
                                <td>
                                    <div class="reg-group inline">
                                        <!-- <div class="reg-item">
                                            법인계좌사본첨부파일명:{{ state.joinRequestDetail.ntprAcnCpAtflNm }}
                                            법인계좌사본첨부파일순번 {{ state.joinRequestDetail.ntprAcnCpAtflSn }}
                                        </div> -->
                                        <div class="reg-item">
                                            <button type="button" class="btn btn-slm"
                                                @click="openModal('isImgDownShow', menuInfo.menuCode, '법인계좌 사본', state.joinRequestDetail.ntprAcnCpAtflSn)">
                                                파일 다운로드
                                            </button>
                                            <!-- <button type="button" class="btn btn-slm"
                                                @click="openModal('isImgShow', imgfile(state.joinRequestDetail.ntprAcnCpAtflUrl))">
                                                파일 보기
                                            </button> -->
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
                                <th scope="row">가입신청일</th>
                                <td>{{ state.joinRequestDetail.admnJnReqDt ?
                                    dayJS(state.joinRequestDetail.admnJnReqDt).format('YYYY-MM-DD HH:mm:ss') : '' }}</td>
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
            <button type="button" class="btn btn-sl nega" @click="goToPage('/payer/regist/list')">
                취소
            </button>
            <!-- :disabled="'가입상태가재가입요청인경우'" -->
            <button type="button" class="btn btn-sl nega" @click="changeDelRol">
                삭제
            </button>
            <button type="button" class="btn btn-sl nega" :disabled="!state.mskgnRlsYn" @click="changeMskgnRlsYn">
                마스킹해제
            </button>
            <button type="button" class="btn btn-sl posi"
                @click="() => { state.mskgnRlsYn ? actionBtns('request') : openModal('isRequestShow') }">
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
import { reactive, inject, onMounted, onUnmounted, ref, computed, watch } from 'vue';
import DefaultModal from '@/plugins/modal/modal/DefaultModal.vue';
import MdSearch from '@/components/ui/MdSearch.vue';
import { useCommFunc } from '@/core/helper/common.js';
import { authCommFunc } from '@/core/helper/authComm.js';
import { useStore } from 'vuex';
import { _getJoinRequestDetailPayer, _approveJoinReqeust, _reJoinReqeust, _deleteReqeust } from '@/api/payer.js';
// import { _getJoinRequestDetail, _approveJoinReqeust, _reJoinReqeust, _deleteReqeust } from '@/api/seller.js';
import { useRouter, useRoute } from 'vue-router';
import { _getCommonList } from '@/api/standard.js';
import { _getCommTree } from '@/api/common.js';
export default {
    components: { DefaultModal, MdSearch },
    setup() {
        const $Modal = inject('$Modal');
        const dayJS = inject('dayJS');
        const store = useStore();
        const route = useRoute();

        const { goToPage, tableResize, openModal, isRequestShow, formatterBrn } = useCommFunc();
        const { onChangeMaskingRol, onChangeApprRol, onChangeDelRol } = authCommFunc();

        const menuInfo = computed(() => store.state.getMenuItem.menuInfo);

        // const isMdShow = ref(false);
        const requestConRef = ref(null);
        const state = reactive({
            imgName: '',
            request: {
                rsnCd: '160001', // default 사업자등록증정보불일치 160001
                rsnCts: ''
            },
            joinRequestDetail: {},

            mskgnRlsYn: true,

            admnSn: '', // 어드민순번
            ntprSn: '', // 기업순번

            modalMsg: '',

            dlngPlcCd: '', // 거래처코드(더본ERP)
            validState: {
                type: '', // validation check ( formData )
                errState: false, // error state
                message: '' // input message
            }
        });

        watch(() => [state.dlngPlcCd], () => {
            resetState();
        });

        onMounted(() => {
            console.log(route.query);
            state.admnSn = route.query.admnSn;
            state.ntprSn = route.query.ntprSn;
            // state.masking = route.query.mskgnRlsYn;
            console.log(route.query);
            getJoinRequestDetail();

            emitter.$on('onChangeMskgn', onChangeMskgn);
            emitter.$on('onChangeAppr', onChangeAppr);
            emitter.$on('onChangeDel', onChangeDel);

            let params = {
                size: 10000,
                offset: 0,
                uprGrpCd: '155000',
                uprGrpCdNm: ''
                // useYn: 'Y'
            };
            const test = _getCommTree();
            console.log('test', test);
        });

        // 마스킹 해제 이벤트 버스 해제
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
            getJoinRequestDetail();
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
            // await onChangeDelRol(menuInfo.value.auth3DeleteYn);
            await onChangeDelRol('Y');
        };

        /**
         * 삭제 권한 체크 callback
         */
        const onChangeDel = () => {
            actionBtns('cancel');
        };

        // 상세
        const getJoinRequestDetail = async () => {
            try {
                let params = {
                    mskgnRlsYn: state.mskgnRlsYn ? 'Y' : 'N'
                };
                const response = await _getJoinRequestDetailPayer(state.admnSn, params);
                console.log(response.data.data);
                state.joinRequestDetail = response.data.data;
                state.dlngPlcCd = response.data.data.dlngPlcCd;
            } catch (error) {
                console.log(error);
            }
        };

        //승인
        const approveJoinReqeust = async () => {
            try {
                let params = {
                    ntprSn: state.ntprSn,       // 기업순번
                    dlngPlcCd: state.dlngPlcCd
                    // mdSn: state.mdSn,
                    // saleFeeRt: state.saleFeeRt
                };
                const response = await _approveJoinReqeust(state.admnSn, params);
                if (response.data.code === 'OK') {
                    await goToPage('/payer/regist/list');
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
        const reJoinReqeust = async () => {
            try {
                let params = {
                    sn: state.admnSn,
                    rsnCd: state.request.rsnCd,
                    rsnCts: state.request.rsnCts
                };
                const response = await _reJoinReqeust(params);
                if (response.data.code === 'OK') {
                    getJoinRequestDetail();
                }
            }
            catch (error) {
                console.log(error);
            }
        };

        //삭제
        const deleteReqeust = async () => {
            try {
                let params = state.admnSn;
                const response = await _deleteReqeust(params);
                if (response.data.code === 'OK') {
                    goToPage('/payer/regist/list');
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
                                // state.mskgnRlsYn = true;
                                approveJoinReqeust();
                            })
                            .catch(error => {
                                console.log(error);
                            });
                    }
                }
            } else {

                if (type === 'cancel') { // 삭제
                    state.modalMsg = '삭제하시겠습니까?';
                } else if (type === 'request') {
                    state.modalMsg = '마스킹 해제 후 가입재신청 요청이 가능합니다.';
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
                        if (type === 'cancel') {
                            deleteReqeust();
                            //삭제 처리
                        }
                    })
                    .catch(error => {
                        console.log(error);
                    });
            }
        };

        // 모달창 닫기
        const modalControl = (type, modalName) => {
            // if (modalName === 'isImgShow') {
            //     isImgShow.value = false;
            if (modalName === 'isRequestShow') {
                // isRequestShow.value = false;
                // console.log('사유등록 후 가입 재신청', state.request);
                // reJoinReqeust();
                if (type === 'modalconfirm') {
                    if (requestConRef.value.validCheck()) {
                        isRequestShow.value = false;
                        reJoinReqeust();
                    }
                } else {
                    isRequestShow.value = false;
                }
            } else if (!modalName) {
                // isRequestShow.value = false;
            }
            console.log(type, modalName);
        };

        // 재가입요청 데이터 처리
        const requestConfirm = (type, con) => {
            if (type === 'code') {
                state.request.rsnCd = con;
            } else {
                state.request.rsnCts = con;
            }
        };

        //사업자등록증 사본
        const imgfile = (fileName) => {
            state.imgName = fileName;
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

        return {
            //공통 사용
            _,
            $Modal,
            dayJS,
            goToPage,
            isRequestShow,
            state,
            openModal,
            modalControl,
            imgfile,
            requestConfirm,
            // onChangedPage,
            actionBtns,
            // onChangemdSearch,

            // menuInfo,
            // changeMskgnRlsYn,
            // checkValidState
            formatterBrn,
            menuInfo,
            requestConRef,
            changeMskgnRlsYn,
            changeApprRol,
            changeDelRol,
            checkValidState
        };
    }
};
</script>