<template>
    <section>
        <div class="ui-section">
            <subTitleBar :subTitle="'탈퇴신청'" />
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
                                <th scope="row">탈퇴 구분</th>
                                <td>{{ state.outRequestDetail.jnStNm }}</td>
                                <th scope="row">탈퇴신청일시</th>
                                <td>
                                    {{ state.outRequestDetail.admnScsnReqDt ?
                                        dayJS(state.outRequestDetail.admnScsnReqDt).format('YYYY-MM-DD HH:mm:ss') : ''
                                    }}
                                </td>
                            </tr>
                            <tr>
                                <th scope="row">탈퇴처리여부</th>
                                <td>{{ state.outRequestDetail.admnScsnYn }}</td>
                                <th scope="row">탈퇴사유</th>
                                <td>{{ state.outRequestDetail.admnScsnRsn }}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
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
                                <td colspan="3">{{ state.outRequestDetail.admnId }}</td>
                            </tr>
                            <tr>
                                <th scope="row">기업명</th>
                                <td>{{ state.outRequestDetail.ntprNm }}</td>
                                <th scope="row">KB계열사</th>
                                <td>
                                    <template v-if="state.outRequestDetail.kbAffiYn === 'Y'">
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
                                    {{ formatterBrn(state.outRequestDetail.brn) }}
                                </td>
                            </tr>
                            <tr>
                                <th scope="row">업태</th>
                                <td>{{ state.outRequestDetail.bcoNm }}</td>
                                <th scope="row">종목</th>
                                <td>{{ state.outRequestDetail.indtpNm }}</td>
                            </tr>
                            <tr>
                                <th scope="row">대표 전화번호</th>
                                <td>{{ state.outRequestDetail.rprsTlno }}</td>
                                <th scope="row">팩스번호</th>
                                <td>{{ state.outRequestDetail.fax }}</td>
                            </tr>
                            <tr>
                                <th scope="row">주소</th>
                                <td colspan="3">({{ state.outRequestDetail.zc }}) {{ state.outRequestDetail.adr }} {{
                                    state.outRequestDetail.adrCts }}</td>
                                <!-- <th scope="row">상세주소</th>
                                <td>{{ state.joinRequestDetail.adrCts }}</td> -->
                            </tr>
                            <tr>
                                <th scope="row">법인계좌번호</th>
                                <td>
                                    {{ state.outRequestDetail.bknm }}
                                    {{ state.outRequestDetail.acno }}
                                    {{ state.outRequestDetail.accountNm }}
                                </td>
                                <th scope="row">기업코드</th>
                                <td>{{ state.outRequestDetail.ntprUcd }}</td>
                            </tr>
                            <tr>
                                <th scope="row">추천기업</th>
                                <td>
                                    {{ state.outRequestDetail.rcmNtprNm }}
                                    {{ !_.isEmpty(state.outRequestDetail.rcmNtprUcd) ?
                                        `(${state.outRequestDetail.rcmNtprUcd})` : '' }}
                                </td>
                                <th scope="row">종합건강검진 사용 <br>회사코드</th>
                                <td>
                                    {{ state.outRequestDetail.tgtrHmexmUseCoSeCd }}/
                                    {{ state.outRequestDetail.tgtrHmexmUseCoCd }}
                                </td>
                            </tr>
                            <tr>

                                <th scope="row">거래처코드(더존ERP)<span class="ess"><span class="offscreen">필수입력</span></span>
                                </th>
                                <td colspan="3">
                                    {{ state.dlngPlcCd }}
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
                                <td>{{ state.outRequestDetail.admnDepNm }}</td>
                                <th scope="row">담당자명</th>
                                <td>{{ state.outRequestDetail.admnNm }}</td>
                            </tr>
                            <tr>
                                <th scope="row">담당자 휴대폰 번호</th>
                                <td>{{ state.outRequestDetail.admnHhpno }}</td>
                                <th scope="row">담당자 이메일 주소</th>
                                <td>{{ state.outRequestDetail.admnEmad }}</td>
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
                                                @click="openModal('isImgDownShow', menuInfo.menuCode, '사업자등록증 사본', state.outRequestDetail.bzlcCpAtflSn)">
                                                파일 다운로드
                                            </button>
                                        </div>
                                    </div>
                                </td>
                                <th scope=" row">법인계좌 사본</th>
                                <td>
                                    <div class="reg-group inline">
                                        <!-- <div class="reg-item">
                                            법인계좌사본첨부파일명:{{ state.outRequestDetail.ntprAcnCpAtflNm }}
                                            법인계좌사본첨부파일순번 {{ state.outRequestDetail.ntprAcnCpAtflSn }}
                                        </div> -->
                                        <div class="reg-item">
                                            <button type="button" class="btn btn-slm"
                                                @click="openModal('isImgDownShow', menuInfo.menuCode, '법인계좌 사본', state.outRequestDetail.bzlcCpAtflSn)">
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
                                <th scope="row">가입일자</th>
                                <!-- <td>{{ state.outRequestDetail.rgsDt }}</td> -->
                                <td>{{ state.outRequestDetail.admnJnReqDt ?
                                    dayJS(state.outRequestDetail.admnJnReqDt).format('YYYY-MM-DD HH:mm:ss') : '' }}</td>
                                <th scope="row">등록자</th>
                                <td>
                                    {{ state.outRequestDetail.rgsUsrNm }}
                                    등록자 레벨{{ state.outRequestDetail.rgsLvlEngNm }}
                                </td>
                            </tr>
                            <tr>
                                <th scope="row">등록일자</th>
                                <!-- <td>{{ state.outRequestDetail.rgsDt }}</td> -->
                                <td>{{ state.outRequestDetail.admnJnReqDt ?
                                    dayJS(state.outRequestDetail.admnJnReqDt).format('YYYY-MM-DD HH:mm:ss') : '' }}</td>
                                <th scope="row">수정자</th>
                                <td>
                                    {{ state.outRequestDetail.rgsUsrNm }}
                                    등록자 레벨{{ state.outRequestDetail.rgsLvlEngNm }}
                                </td>
                            </tr>
                            <tr>
                                <th scope="row">수정일자</th>
                                <!-- <td>{{ state.outRequestDetail.rgsDt }}</td> -->
                                <td colspan="3">{{ state.outRequestDetail.admnJnReqDt ?
                                    dayJS(state.outRequestDetail.admnJnReqDt).format('YYYY-MM-DD HH:mm:ss') : '' }}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
        <div class="btn-bottom-set flex justify-center">
            <button type="button" class="btn btn-sl nega" @click="goToPage('/payer/ban_request/list')">취소</button>
            <!-- <button type="button" class="btn btn-sl nega" :disabled="state.mskgnRlsYn === 'N'"
                @click="actionBtns('masking')">마스킹해제
            </button> -->
            <button type="button" class="btn btn-sl nega" :disabled="!state.mskgnRlsYn" @click="changeMskgnRlsYn">
                마스킹해제
            </button>
            <button type="button" class="btn btn-sl posi" @click="changeApprRol('reject')">탈퇴반려</button>
            <button type="button" class="btn btn-sl posi" @click="changeApprRol('confirm')">탈퇴승인</button>
        </div>



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
import { _getPayerOutRequestDetail, _apprPayerRequest, _rejectPayerRequest } from '@/api/payer.js';
import { useRouter, useRoute } from 'vue-router';
export default {
    components: { DefaultModal, MdSearch },
    setup() {
        const $Modal = inject('$Modal');
        const dayJS = inject('dayJS');
        const store = useStore();
        const route = useRoute();

        const { goToPage, openModal, isRequestShow, formatterBrn } = useCommFunc();
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
            outRequestDetail: {},
            mskgnRlsYn: true,
            ntprSn: '',
            dlngPlcCd: '' // 거래처코드(더존ERP)


        });

        onMounted(() => {
            console.log(route.query);
            state.ntprSn = route.query.Sn;
            console.log(route.query);
            getPayerOutRequestDetail();

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
            getPayerOutRequestDetail();
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
        const getPayerOutRequestDetail = async () => {
            try {
                let params = {
                    mskgnRlsYn: state.mskgnRlsYn ? 'Y' : 'N'
                };
                const response = await _getPayerOutRequestDetail(state.ntprSn, params);
                console.log(response.data.data);
                state.outRequestDetail = response.data.data;
                state.saleFeeRt = response.data.data.saleFeeRt;
                state.mdSn = response.data.data.mdAdmnSn;
                state.dlngPlcCd = response.data.data.dlngPlcCd;
            } catch (error) {
                console.log(error);
            }
        };

        //승인
        const apprPayerRequest = async () => {
            try {
                const response = await _apprPayerRequest(state.ntprSn);

                if (response.data.code === 'OK') {
                    await goToPage('/payer/ban_request/list');
                } else {
                    console.log(response.data.message);
                }
                console.log(response);
            } catch (error) {
                console.log(error);

            }
        };

        //탈퇴반려
        const rejectPayerRequest = async () => {
            try {
                const response = await _rejectPayerRequest(state.ntprSn);
                if (response.data.code === 'OK') {
                    await goToPage('/payer/ban_request/list');
                } else {
                    console.log(response.data.message);
                }
            }
            catch (error) {
                console.log(error);
            }
        };


        const actionBtns = (type) => {
            let msg = '';
            if (type === 'reject') {
                if (state.mskgnRlsYn) {
                    msg = '마스킹 해제 후 탈퇴 반려가 가능합니다.';
                } else {
                    msg = '탈퇴 반려 하시겠습니까?';
                }
            } else if (type === 'confirm') {
                if (state.mskgnRlsYn) {
                    msg = '마스킹 해제 후 탙퇴 승인 가능합니다.';
                } else {
                    msg = ' 탙퇴 승인처리 하시겠습니까?';
                    console.log('승인처리');
                }
            } else if (type === 'masking') {
                msg = '마스킹 해제 하시겠습니까?';

            }

            $Modal.confirm({
                title: '',
                message: msg,
                buttonText: {
                    confirm: '확인',
                    cancel: '취소'
                }
            })
                .then(success => {
                    console.log(success);
                    if (!state.mskgnRlsYn) {
                        if (type === 'confirm') {
                            apprPayerRequest();
                        }
                        if (type === 'reject') {
                            rejectPayerRequest();
                        }
                    }
                })
                .catch(error => {
                    console.log(error);
                });
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
            // imgfile,
            actionBtns,

            formatterBrn,
            menuInfo,
            requestConRef,
            changeMskgnRlsYn,
            changeApprRol,
            changeDelRol
        };
    }
};
</script>