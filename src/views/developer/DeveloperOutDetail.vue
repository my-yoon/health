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
                                <th scope="row">탈퇴신청일자</th>
                                <td>{{ state.joinRequestDetail.admnScsnReqDt }}</td>
                            </tr>
                            <tr>
                                <th scope="row">탈퇴처리여부</th>
                                <td>{{ state.joinRequestDetail.admnScsnYn }}</td>
                                <th scope="row">탈퇴처리일자</th>
                                <td>{{ state.joinRequestDetail.admnScsnDt }}</td>
                            </tr>
                            <tr>
                                <th scope="row">탈퇴사유</th>
                                <td colspan="3">{{ state.joinRequestDetail.admnScsnRsn }}</td>
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
            <button type="button" class="btn btn-sl nega" @click="goToPage('/developer/ban/list')">
                목록
            </button>
        </div>



    </section>
</template>
<script>
import { reactive, inject, onMounted, ref, computed, onUnmounted, watch } from 'vue';
import DefaultModal from '@/plugins/modal/modal/DefaultModal.vue';
import MdSearch from '@/components/ui/MdSearch.vue';
import { useCommFunc } from '@/core/helper/common.js';
import { authCommFunc } from '@/core/helper/authComm.js';
import { useStore } from 'vuex';
import { _getDevOutDetail } from '@/api/developer.js';
import { useRouter, useRoute } from 'vue-router';
export default {
    components: { DefaultModal, MdSearch },
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
            detailNum: ''
        });

        onMounted(() => {
            console.log(route.query);
            state.detailNum = route.query.Sn;
            console.log(state.detailNum);
            getDevOutDetail(state.detailNum);

            emitter.$on('onChangeMskgn', onChangeMskgn);
        });

        onUnmounted(() => {
            emitter.$off('onChangeMskgn');
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
            getDevOutDetail();
        };




        // 상세
        const getDevOutDetail = async () => {
            try {
                const response = await _getDevOutDetail(state.detailNum);
                console.log(response.data.data);
                state.joinRequestDetail = response.data.data;
                state.ntprSn = response.data.data.ntprSn;
            } catch (error) {
                console.log(error);
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
            formatterBrn
        };
    }
};
</script>