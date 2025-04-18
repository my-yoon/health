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
                                <td>
                                    {{ formatterBrn(state.joinRequestDetail.brn) }}
                                </td>
                                <th scope="row">대표자명</th>
                                <td>
                                    {{ formatterBrn(state.joinRequestDetail.rprsvNm) }}
                                </td>
                            </tr>
                            <tr>

                                <th scope="row">사업자유형</th>
                                <td colspan="3">
                                    {{ state.joinRequestDetail.bzmTyNm }} /
                                    {{ state.joinRequestDetail.bzmTyDtlNm }}
                                </td>
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
                                <!-- <th scope="row">상세주소</th>
                                <td>{{ state.joinRequestDetail.adrCts }}</td> -->
                            </tr>
                            <tr>
                                <th scope="row">법인계좌번호</th>
                                <td>
                                    {{ state.joinRequestDetail.bknm }}
                                    {{ state.joinRequestDetail.acno }}
                                    {{ state.joinRequestDetail.accountNm }}
                                </td>
                                <th scope="row">기업코드</th>
                                <td>{{ state.joinRequestDetail.ntprUcd }}</td>
                            </tr>
                            <tr>
                                <th scope="row">추천기업</th>
                                <td>
                                    {{ state.joinRequestDetail.rcmNtprNm }}
                                    {{ !_.isEmpty(state.joinRequestDetail.rcmNtprUcd) ?
                                        `(${state.joinRequestDetail.rcmNtprUcd})` : '' }}
                                </td>
                                <th scope="row">서비스 구분</th>
                                <td>
                                    {{ state.joinRequestDetail.admnPtnrSelrSvcTyNm ||
                                        commoCode.searchCode.ptnrSelrSvcTyCd.filter(d => d.cmnCd ===
                                            state.joinRequestDetail.admnPtnrSelrSvcTyCd)[0]?.cmnCdNm }}
                                </td>
                            </tr>
                            <tr>
                                <th scope="row">패널티 적용여부</th>
                                <td>
                                    <template v-if="state.joinRequestDetail.pnltAplYn === 'N'">
                                        미적용
                                    </template>
                                    <template v-else>
                                        적용
                                    </template>
                                </td>
                                <th scope="row">마진율<span class="ess"><span class="offscreen">필수입력</span></span></th>
                                <td>
                                    <div class="reg-group inline">
                                        <div class="reg-item">
                                            <input type="text"
                                                :class="['form-control', { error: checkValidState('saleFeeRt') }]"
                                                v-model="state.saleFeeRt"> &nbsp;%
                                        </div>
                                    </div>
                                    <span v-if="checkValidState('saleFeeRt')" class="input-guide"
                                        :class="{ 'error': checkValidState('saleFeeRt') }">
                                        {{ state.validState.message }}
                                    </span>
                                </td>
                            </tr>
                            <tr>
                                <th scope="row">담당 MD<span class="ess"><span class="offscreen">필수입력</span></span></th>

                                <td>
                                    <div class="reg-group inline">
                                        <div class="reg-item">
                                            <input type="text" :class="['form-control', { error: checkValidState('mdNm') }]"
                                                readonly v-model="state.mdNm" @click="openMdModal">
                                        </div>
                                        <!-- {{ state.mdSn }} -->
                                        <!-- MD관리자성명:{{ state.joinRequestDetail.mdAdmnSn }}
                                        MD관리자레벨:{{ state.joinRequestDetail.mdLvlEngNm }} -->
                                        <div class="reg-item">
                                            <button type="button" class="btn btn-slm" @click="openMdModal">조회</button>
                                        </div>
                                    </div>
                                    <span v-if="checkValidState('mdNm')" class="input-guide"
                                        :class="{ 'error': checkValidState('mdNm') }">
                                        {{ state.validState.message }}
                                    </span>
                                </td>
                                <th scope="row">거래처코드(더존ERP)<span class="ess"><span class="offscreen">필수입력</span></span>
                                </th>
                                <td>
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
                                            <button type="button" class="btn btn-slm"
                                                @click="fileDownload(state.joinRequestDetail.bzlcCpAtflSn)">
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
                                                @click="openModal('isImgDownShow', menuInfo.menuCode, '법인계좌 사본', state.joinRequestDetail.bzlcCpAtflSn)">
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
                                <!-- <td>{{ state.joinRequestDetail.rgsDt }}</td> -->
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
            <button type="button" class="btn btn-sl nega" @click="goToPage('/seller/regist/list')">
                취소
            </button>
            <!-- :disabled="'가입상태가재가입요청인경우'" -->
            <button type="button" class="btn btn-sl nega" @click="changeDelRol">
                삭제
            </button>
            <button type="button" class="btn btn-sl" :disabled="!state.mskgnRlsYn" @click="changeMskgnRlsYn">
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

        <!-- MD검색 -->
        <DefaultModal :isShow="isMdShow" modalTitle="MD조회" :buttonCancel="''" :buttonConfirm="'닫기'" :modalName="'isMdShow'"
            @modalclose="modalControl">
            <template #modalcontent>
                <MdSearch @selectValue="onChangemdSearch" />
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
import { commoCode } from '@/data/commcode';
import { _getJoinRequestDetail, _approveJoinReqeust, _reJoinReqeust, _deleteReqeust } from '@/api/seller.js';
import { useRouter, useRoute } from 'vue-router';
export default {
    components: { DefaultModal, MdSearch },
    setup() {
        const $Modal = inject('$Modal');
        const dayJS = inject('dayJS');
        const store = useStore();
        const route = useRoute();

        const { goToPage, openModal, fileDownload, isRequestShow, formatterBrn } = useCommFunc();
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

        const menuInfo = computed(() => store.state.getMenuItem.menuInfo);

        const isMdShow = ref(false);
        const requestConRef = ref(null);
        const state = reactive({
            imgName: '',
            request: {
                rsnCd: '160001',
                rsnCts: ''
            },
            joinRequestDetail: {},
            // pagesize: 10,
            mskgnRlsYn: true,
            // ntprSn: '',
            modalMsg: '',
            admnSn: '', // 어드민순번
            ntprSn: '', // 기업순번
            saleFeeRt: '', // 마진율
            mdSn: '',
            mdNm: '',
            dlngPlcCd: '', // 거래처코드(더존ERP)

            validState: {
                type: '', // validation check ( formData )
                errState: false, // error state
                message: '' // input message
            }
        });

        watch(() => [state.saleFeeRt, state.mdNm, state.dlngPlcCd], () => {
            resetState();
        });

        onMounted(() => {
            console.log(route.query);
            state.admnSn = route.query.admnSn;
            state.ntprSn = route.query.ntprSn;
            console.log(route.query);
            getJoinRequestDetail();

            emitter.$on('onChangeMskgn', onChangeMskgn);
            emitter.$on('onChangeAppr', onChangeAppr);
            emitter.$on('onChangeDel', onChangeDel);
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
                const response = await _getJoinRequestDetail(state.admnSn, params);
                console.log(response.data.data);
                state.joinRequestDetail = response.data.data;
                state.saleFeeRt = response.data.data.saleFeeRt;
                state.mdSn = response.data.data.mdAdmnSn;
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
                    saleFeeRt: state.saleFeeRt, // 마진율
                    mdSn: state.mdSn,           // MD순번
                    dlngPlcCd: state.dlngPlcCd  // 거래처코드
                };
                console.log(state.ntprSn, state.mdSn);
                const response = await _approveJoinReqeust(state.admnSn, params);
                if (response.data.code === 'OK') {
                    await goToPage('/seller/regist/list');
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
                    goToPage('/seller/regist/list');
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
            if (modalName === 'isRequestShow') {
                // isRequestShow.value = false;
                // console.log('사유등록 후 가입 재신청', state.request);
                // reJoinReqeust();
                if (type !== 'modalconfirm') {
                    isRequestShow.value = false;
                } else {
                    if (requestConRef.value.validCheck()) {
                        isRequestShow.value = false;
                        reJoinReqeust();
                    }
                }


            } else if (modalName === 'isMdShow') {
                isMdShow.value = false;
            } else if (!modalName) {
                // isImgShow.value = false;
                isRequestShow.value = false;
                isMdShow.value = false;
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
        const openMdModal = () => {
            isMdShow.value = true;
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
            const target = ['ntprSn', 'saleFeeRt', 'mdNm', 'dlngPlcCd'];
            // const target = ['admnEmad', 'bzlcCpAtflSn', 'ntprAcnCpAtflSn'];

            // bzlcCpAtflSn: computed(() => state.bzlcCpAtflSn), //사업자등록증 사본
            // ntprAcnCpAtflSn: computed(() => state.ntprAcnCpAtflSn), //법인계좌  첨부파일순번

            for (const item of target) {
                console.log('check check >>', item);

                state.validState.target = item;

                let msg = '';
                if (item === 'ntprSn') msg = '기업순번을 입력해주세요.';
                if (item === 'saleFeeRt') msg = '마진율을 입력해주세요.';
                if (item === 'mdNm') msg = '담당MD를 입력해주세요.';
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

        return {
            //공통 사용
            _,
            commoCode,
            $Modal,
            dayJS,
            goToPage,
            // isImgShow,
            isRequestShow,
            state,
            openModal,
            isMdShow,
            openMdModal,
            modalControl,
            // imgfile,
            requestConfirm,
            actionBtns,
            onChangemdSearch,
            fileDownload,

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