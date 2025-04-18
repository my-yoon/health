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
                                        해당
                                    </template>
                                    <template v-else>
                                        해당하지 않음
                                    </template>
                                </td>
                            </tr>
                            <tr>
                                <th scope="row">사업자등록번호</th>
                                <td>{{ formatterBrn(state.outRequestDetail.brn) }}</td>
                                <th scope="row">사업자유형</th>
                                <td>{{ `${state.outRequestDetail.bzmTyNm} / ${state.outRequestDetail.bzmTyDtlNm}` }}</td>
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
                                <td colspan="3">
                                    {{ state.outRequestDetail.zc }}
                                    {{ state.outRequestDetail.adr }}
                                    {{ state.outRequestDetail.adrCts }}
                                </td>
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
                                <th scope="row">서비스 타입</th>
                                <td>
                                    {{ state.outRequestDetail.admnPtnrSelrSvcTyNm }}
                                </td>
                                <th scope="row">추천기업</th>
                                <td>
                                    {{ state.outRequestDetail.rcmNtprNm }}
                                    {{ !_.isEmpty(state.outRequestDetail.rcmNtprUcd) ?
                                        `(${state.outRequestDetail.rcmNtprUcd})` : '' }}
                                </td>
                            </tr>
                            <tr>
                                <th scope="row">패널티 적용여부</th>
                                <td>
                                    <template v-if="state.outRequestDetail.pnltAplYn === 'Y'"> 적용</template>
                                    <template v-else> 미적용</template>
                                </td>
                                <th scope="row">마진율</th>
                                <td>{{ state.outRequestDetail.mgnRt }}</td>
                            </tr>
                            <tr>
                                <th scope="row">담당MD</th>
                                <td>
                                    {{ state.outRequestDetail.mdLvlEngNm }}
                                    {{ !_.isEmpty(state.outRequestDetail.mdAdmnNm) ?
                                        `(${state.outRequestDetail.mdAdmnNm})` : '' }}
                                </td>
                                <th scope="row">거래처코드(더존ERP)</th>
                                <td>
                                    {{ !_.isEmpty(state.outRequestDetail.dlngPlcCd) ?
                                        `${state.outRequestDetail.dlngPlcCd}` : '-' }}
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
                                        <!-- <div class="reg-item">{{ state.outRequestDetail.bzlcCpAtflNm }}</div> -->
                                        <div class="reg-item">
                                            <button type="button" class="btn btn-slm"
                                                @click="openModal('isImgDownShow', menuInfo.menuCode, '사업자등록증 사본', state.outRequestDetail.bzlcCpAtflSn)">
                                                파일 다운로드
                                            </button>
                                        </div>
                                    </div>
                                </td>
                                <th scope="row">법인계좌 사본</th>
                                <td>
                                    <div class="reg-group inline">
                                        <!-- <div class="reg-item">{{ state.outRequestDetail.ntprAcnCpAtflNm }}</div> -->
                                        <div class="reg-item">
                                            <button type="button" class="btn btn-slm"
                                                @click="openModal('isImgDownShow', menuInfo.menuCode, '법인계좌 사본', state.outRequestDetail.ntprAcnCpAtflSn)">
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
                                <td>{{ state.outRequestDetail.admnJnDt ?
                                    dayJS(state.outRequestDetail.admnJnDt).format('YYYY-MM-DD HH:mm:ss') : '' }}</td>
                                <th scope="row">등록자</th>
                                <td>
                                    {{ state.outRequestDetail.rgsLvlEngNm }}
                                    {{ !_.isEmpty(state.outRequestDetail.rgsUsrNm) ? `(${state.outRequestDetail.rgsUsrNm})`
                                        : '' }}
                                </td>
                            </tr>
                            <tr>

                                <th scope="row">등록일자</th>
                                <td>
                                    {{
                                        state.outRequestDetail.rgsDt ?
                                        dayJS(state.outRequestDetail.rgsDt).format('YYYY-MM-DD HH:mm:ss') : ''
                                    }}
                                </td>
                                <th scope="row">수정자</th>
                                <td>
                                    {{ state.outRequestDetail.updLvlEngNm }}
                                    {{ !_.isEmpty(state.outRequestDetail.updUsrNm) ? `(${state.outRequestDetail.updUsrNm})`
                                        : '' }}
                                </td>
                            </tr>
                            <tr>

                                <th scope="row">수정일자</th>
                                <td colspan="3">
                                    {{ state.outRequestDetail.updDt ?
                                        dayJS(state.outRequestDetail.updDt).format('YYYY-MM-DD HH:mm:ss') : ''
                                    }}
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
        <div class="btn-bottom-set flex justify-center">
            <button type="button" class="btn btn-sl nega" @click="goToPage('/seller/ban_request/list')">취소</button>
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
import { reactive, inject, onMounted, onUnmounted, ref, computed } from 'vue';
import DefaultModal from '@/plugins/modal/modal/DefaultModal.vue';
import { useCommFunc } from '@/core/helper/common.js';
import { authCommFunc } from '@/core/helper/authComm.js';
import { useStore } from 'vuex';
import { _getOutlistDetail, _rejectSellerRequest, _confirmSellerRequest } from '@/api/seller.js';
import { useRouter, useRoute } from 'vue-router';
export default {
    components: { DefaultModal },
    setup() {
        const $Modal = inject('$Modal');
        const dayJS = inject('dayJS');
        const store = useStore();
        const route = useRoute();
        const { goToPage, openModal, isImgDownShow, formatterBrn } = useCommFunc();
        const { onChangeMaskingRol, onChangeApprRol } = authCommFunc();

        const menuInfo = computed(() => store.state.getMenuItem.menuInfo);

        const state = reactive({
            imgName: '',
            request: { title: '', con: '' },
            mskgnRlsYn: true,
            detailNum: '',
            outRequestDetail: {},

            apprTarget: '' // 승인/반려 btn target

        });

        onMounted(() => {
            state.detailNum = route.query.ntprSn;
            getOutlistDetail();

            emitter.$on('onChangeMskgn', onChangeMskgn);
            emitter.$on('onChangeAppr', onChangeAppr);
        });

        // 마스킹 해제 이벤트 버스 해제
        onUnmounted(() => {
            emitter.$off('onChangeMskgn');
            emitter.$off('onChangeAppr');
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
            getOutlistDetail();
        };

        /**
         * 승인 권한 체크
         */
        const changeApprRol = async (target) => {
            state.apprTarget = target; // 승인/반려 target
            // await onChangeApprRol(menuInfo.value.auth4ApproveYn);
            await onChangeApprRol('Y');
        };

        /**
         * 승인 권한 체크 callback
         */
        const onChangeAppr = () => {
            actionBtns(state.apprTarget);
            state.apprTarget = '';
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
                    msg = ' 탙퇴승인처리 하시겠습니까?';
                    console.log('승인처리');
                }
            } else if (type === 'masking') {
                msg = '마스킹 해제 하시겠습니까?';

            } else if (type === 'request') {
                msg = '마스킹 해제 후 가입재신청 요청이 가능합니다.';
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
                    if (type === 'confirm') {
                        confirmSellerRequest();
                    } else if (type === 'reject') {
                        rejectSellerRequest();
                    }
                })
                .catch(error => {
                    console.log(error);
                });
        };
        // 상세조회
        const getOutlistDetail = async () => {
            try {
                let params = {
                    mskgnRlsYn: state.mskgnRlsYn ? 'Y' : 'N'
                };
                const response = await _getOutlistDetail(state.detailNum, params);
                console.log(response.data.data);
                state.outRequestDetail = response.data.data;
            } catch (error) {
                console.log(error);
            }
        };
        // 탈퇴반려
        const rejectSellerRequest = async () => {
            try {
                const reponse = await _rejectSellerRequest(state.detailNum);
                console.log(reponse);
                if (reponse.data.code === 'OK') {
                    goToPage('/seller/ban_request/list');
                }
            } catch (error) {
                console.log(error);
            }
        };
        // 탈퇴승인   
        const confirmSellerRequest = async () => {
            try {
                const reponse = await _confirmSellerRequest(state.detailNum);
                console.log(reponse);
                if (reponse.data.code === 'OK') {
                    goToPage('/seller/ban_request/list');
                }
            } catch (error) {
                console.log(error);
            }
        };

        return {
            _,
            $Modal,
            dayJS,
            goToPage,
            isImgDownShow,
            state,
            openModal,
            actionBtns,

            menuInfo,
            changeMskgnRlsYn,
            changeApprRol,
            formatterBrn
        };
    }
};
</script>