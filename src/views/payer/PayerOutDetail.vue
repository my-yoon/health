<template>
    <section>
        <div class="ui-section">
            <!-- {{ state.outRequestDetail }} -->
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
                                <td>탈퇴완료</td>
                                <th scope="row">탈퇴신청일시</th>
                                <td>{{ state.outRequestDetail.admnScsnReqDt }}</td>
                            </tr>
                            <tr>
                                <th scope="row">탈퇴처리여부</th>
                                <td>{{ state.outRequestDetail.admnScsnYn }}</td>
                                <th scope="row">탈퇴처리일자</th>
                                <td>{{ state.outRequestDetail.admnScsnDt }}</td>
                            </tr>
                            <tr>
                                <th scope="row">탈퇴사유</th>
                                <td colspan="3">{{ state.outRequestDetail.admnScsnRsn }}</td>
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
                                <td colspan="3">{{ state.outRequestDetail.ntprNm }}</td>
                            </tr>
                            <tr>
                                <th scope="row">사업자등록번호</th>
                                <td>{{ state.outRequestDetail.brn }}</td>
                                <th scope="row">KB계열사</th>
                                <td>{{ state.outRequestDetail.kbAffiYn }}</td>

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
                                <th scope="row">추천기업</th>
                                <td>{{ state.outRequestDetail.rcmNtprNm }}({{ state.outRequestDetail.rcmNtprUcd }})</td>
                                <th scope="row">종합건강검진 사용 <br>회사코드</th>
                                <td>
                                    {{ state.outRequestDetail.tgtrHmexmUseCoSeCd }}/
                                    {{ state.outRequestDetail.tgtrHmexmUseCoCd }}
                                </td>
                            </tr>
                            <tr>
                                <th scope="row">거래처코드(더존ERP)</th>
                                <td colspan="3">
                                    {{ state.outRequestDetail.dlngPlcCd }}
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
                                            법인계좌사본첨부파일명:{{ state.joinRequestDetail.ntprAcnCpAtflNm }}
                                            법인계좌사본첨부파일순번 {{ state.joinRequestDetail.ntprAcnCpAtflSn }}
                                        </div> -->
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
                                <td>{{ state.outRequestDetail.admnJnDt }}</td>
                                <th scope="row">등록자</th>
                                <td>{{ state.outRequestDetail.rgsLvlEngNm }}({{ state.outRequestDetail.rgsUsrNm }})</td>
                            </tr>
                            <tr>

                                <th scope="row">등록일자</th>
                                <td>{{ state.outRequestDetail.rgsDt }}</td>
                                <th scope="row">수정자</th>
                                <td>{{ state.outRequestDetail.updLvlEngNm }}({{ state.outRequestDetail.updUsrNm }})</td>
                            </tr>
                            <tr>

                                <th scope="row">수정일자</th>
                                <td colspan="3">
                                    {{ state.outRequestDetail.updDt }}
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
        <div class="btn-bottom-set flex justify-center">
            <button type="button" class="btn btn-sl nega" @click="goToPage('/payer/ban/list/payerout')">목록</button>
        </div>
    </section>
</template>
<script>
import { reactive, inject, onMounted, ref, computed } from 'vue';
import DefaultModal from '@/plugins/modal/modal/DefaultModal.vue';
import { useCommFunc } from '@/core/helper/common.js';
import { useStore } from 'vuex';
import { _getPayerOutDetail } from '@/api/payer.js';
import { useRouter, useRoute } from 'vue-router';
export default {
    components: { DefaultModal },
    setup() {
        const $Modal = inject('$Modal');
        const dayJS = inject('dayJS');
        const { goToPage, fileDown, tableResize, openModal } = useCommFunc();

        const store = useStore();
        const route = useRoute();
        const menuInfo = computed(() => store.state.getMenuItem.menuInfo);
        const state = reactive({
            detailNum: '',
            outRequestDetail: {}

        });
        onMounted(() => {
            state.detailNum = route.query.Sn;
            getPayerOutDetail();
        });

        // 상세조회
        const getPayerOutDetail = async () => {
            try {
                let params = {
                    mskgnRlsYn: 'N'
                };
                const response = await _getPayerOutDetail(state.detailNum, params);
                console.log(response.data.data);
                state.outRequestDetail = response.data.data;
            } catch (error) {
                console.log(error);
            }
        };


        return {
            //공통 사용
            $Modal,
            dayJS,
            goToPage,
            openModal,
            menuInfo,
            state

        };
    }
};
</script>