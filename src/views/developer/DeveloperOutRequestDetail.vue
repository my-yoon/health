<template>
    <section>
        <div class="ui-section">
            <subTitleBar :subTitle="'탈퇴 정보'" />
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
                                <th scope="row">탈퇴구분</th>
                                <td>{{ state.joinRequestDetail.jnStNm }}</td>
                                <th scope="row">탈퇴신청일시</th>
                                <td>{{ state.joinRequestDetail.admnScsnReqDt }}</td>
                            </tr>
                            <tr>
                                <th scope="row">탈퇴처리여부</th>
                                <td>{{ state.joinRequestDetail.admnScsnYn }}</td>
                                <th scope="row">탈퇴사유</th>
                                <td>{{ state.joinRequestDetail.admnScsnRsn }}</td>
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
                                <td colspan="3">{{ state.joinRequestDetail.admnId }}</td>

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
                                <td colspan="3">{{ formatterBrn(state.joinRequestDetail.brn) }}</td>
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
                                <td colspan="3">
                                    {{ state.joinRequestDetail.zc }}<br />
                                    {{ state.joinRequestDetail.adr }}
                                    {{ state.joinRequestDetail.adrCts }}
                                </td>
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
                                    <template v-if="state.joinRequestDetail.rcmNtprNm !== null">
                                        {{ state.joinRequestDetail.rcmNtprNm }}
                                        ({{ state.joinRequestDetail.rcmNtprUcd }})
                                    </template>
                                    <template v-else>
                                        -
                                    </template>
                                </td>
                                <th scope="row">거래처코드(더존ERP) <span class="ess"><span class="offscreen">필수입력</span></span>
                                </th>
                                <td>
                                    {{ state.joinRequestDetail.dlngPlcCd }}
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
                                <td>{{ state.joinRequestDetail.admnJnDt }}</td>
                                <th scope="row">등록자</th>
                                <td>
                                    {{ state.joinRequestDetail.rgsUsrNm }}
                                    등록자 레벨{{ state.joinRequestDetail.rgsLvlEngNm }}
                                </td>
                            </tr>
                            <tr>
                                <th scope="row">등록일자</th>
                                <td>{{ state.joinRequestDetail.rgsDt }}</td>
                                <th scope="row">수정자</th>
                                <td>
                                    {{ state.joinRequestDetail.rgsUsrNm }}
                                    등록자 레벨{{ state.joinRequestDetail.rgsLvlEngNm }}
                                </td>
                            </tr>
                            <tr>
                                <th scope="row">수정일자</th>
                                <td colspan="3">{{ state.joinRequestDetail.updDt }}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>

        <div class="btn-bottom-set flex justify-center">
            <button type="button" class="btn btn-sl nega" @click="goToPage('/developer/ban_request/list')">
                취소
            </button>
            <button type="button" class="btn btn-sl nega" :disabled="state.mskgnRlsYn === false" @click="changeMskgnRlsYn">
                마스킹해제
            </button>
            <button type="button" class="btn btn-sl posi" @click="actionBtns('reject')">
                탈퇴반려
            </button>
            <button type="button" class="btn btn-sl posi" @click="changeApprRol">승인</button>
        </div>



    </section>
</template>
<script>
import { reactive, inject, onMounted, ref, computed, onUnmounted, watch } from 'vue';
import DefaultModal from '@/plugins/modal/modal/DefaultModal.vue';
import { useCommFunc } from '@/core/helper/common.js';
import { authCommFunc } from '@/core/helper/authComm.js';
import { useStore } from 'vuex';
import { _getDevOutRequestDetail, _apprdDev, _rejectDev } from '@/api/developer.js';
import { useRouter, useRoute } from 'vue-router';
export default {
    components: { DefaultModal },
    setup() {
        const $Modal = inject('$Modal');
        const dayJS = inject('dayJS');
        const { goToPage, fileDownload, openModal, isRequestShow, formatterBrn } = useCommFunc();
        const { onChangeMaskingRol, onChangeApprRol, onChangeDelRol } = authCommFunc();
        const store = useStore();
        const route = useRoute();
        const menuInfo = computed(() => store.state.getMenuItem.menuInfo);
        const state = reactive({
            joinRequestDetail: {},
            mskgnRlsYn: true,
            detailNum: '',
            modalMsg: '',
            mdNm: '',
            ntprSn: ''
        });

        onMounted(() => {
            console.log(route.query);
            state.detailNum = route.query.Sn;
            console.log(state.detailNum);
            getDevOutRequestDetail(state.detailNum);

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
            getDevOutRequestDetail();
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
            //actionBtns('cancel');
            console.log('삭제권한 확인 후 ');
        };

        // 상세
        const getDevOutRequestDetail = async () => {
            try {
                let params = {
                    mskgnRlsYn: state.mskgnRlsYn ? 'Y' : 'N'
                };
                const response = await _getDevOutRequestDetail(state.detailNum, params);
                console.log(response.data.data);
                state.joinRequestDetail = response.data.data;
                state.ntprSn = response.data.data.ntprSn;
            } catch (error) {
                console.log(error);
            }
        };
        //승인
        const apprdDev = async () => {
            try {
                const response = await _apprdDev(state.detailNum);
                if (response.data.code === 'OK') {
                    await goToPage('/developer/ban_request/list');
                } else {
                    console.log(response.data.message);
                }
                //
                console.log(response);
            } catch (error) {
                console.log(error);

            }
        };
        //반려
        const rejectDev = async () => {
            try {
                const response = await _rejectDev(state.detailNum);
                if (response.data.code === 'OK') {
                    await goToPage('/developer/ban_request/list');
                } else {
                    console.log(response.data.message);
                }
                //
                console.log(response);
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
                    $Modal.confirm({
                        title: '',
                        message: '승인처리 하시겠습니까?',

                        buttonText: {
                            confirm: '확인',
                            cancel: '취소'
                        }
                    })
                        .then(success => {
                            apprdDev();
                        })
                        .catch(error => {
                            console.log(error);
                        });
                }
            } else if (type === 'reject') {

                if (state.mskgnRlsYn) {
                    $Modal.confirm({
                        title: '',
                        message: '마스킹 해제 후 탈퇴 반려가 가능합니다.',
                        buttonText: {
                            confirm: '확인',
                            cancel: '취소'
                        }
                    });
                } else {
                    $Modal.confirm({
                        title: '',
                        message: '탈퇴반려처리 하시겠습니까?',

                        buttonText: {
                            confirm: '확인',
                            cancel: '취소'
                        }
                    })
                        .then(success => {
                            rejectDev();
                        })
                        .catch(error => {
                            console.log(error);
                        });
                }

            }
        };

        return {
            //공통 사용
            $Modal,
            dayJS,
            goToPage,
            menuInfo,
            openModal,
            state,
            fileDownload,
            changeMskgnRlsYn,
            actionBtns,
            formatterBrn,
            changeApprRol
        };
    }
};
</script>