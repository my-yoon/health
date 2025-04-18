<template>
    <DefaultModal :isShow="true" :className="''" :modalTitle="'포인트 발급내역 상세'" :buttonCancel="state.buttonCancel"  :buttonDelete="state.buttonDelete"  :buttonConfirm="state.buttonConfirm" @modalclose="closeModal">
        <template #modalcontent>
            <div class="ui-section">
                <div class="ui-title-3">
                    <h3>포인트 발급내역 상세</h3>
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
                                    <th scope="row">포인트번호</th>
                                    <td>{{ state.data.pntNoSn }}</td>
                                    <th scope="row">정책번호</th>
                                    <td>{{ state.data.pntPlcyCd }}</td>
                                </tr>
                                <tr>
                                    <th scope="row">정책명</th>
                                    <td>{{ state.data.pntPlcyNm }}</td>
                                    <th scope="row">유효기간</th>
                                    <td>{{ state.data.pntVldBgnDate }} ~ {{ state.data.pntVldEndDate }}</td>
                                </tr>
                                <tr>
                                    <th scope="row">포인트유형</th>
                                    <td>{{ state.data.pntIssTyCdNm }}</td>
                                    <th scope="row">발급구분</th>
                                    <td>{{ state.data.pntIssSeCdNm}}</td>
                                </tr>
                                <tr>
                                    <th scope="row">포인트</th>
                                    <td>{{ state.data.pntAmt }}</td>
                                    <th scope="row">상태</th>
                                    <td>{{ state.data.pntStCdNm }}</td>
                                </tr>
                                <tr>
                                    <th scope="row">카테고리</th>
                                    <template v-if="state.data.pntCtgrMjcsCdNm && state.data.pntCtgrMdcsCdNm">
                                        <td colspan="3">{{ state.data.pntCtgrMjcsCdNm }} > {{ state.data.pntCtgrMdcsCdNm }}</td>
                                    </template>
                                    <template v-else>
                                        <td colspan="3"></td>
                                    </template>
                                </tr>
                                <!-- <tr>
                                    <th scope="row">페이어명</th>
                                    <td colspan="3">ㅇㅇ생명</td>
                                </tr>
                                <tr>
                                    <th scope="row">구분</th>
                                    <td colspan="3">ㅇㅇ > ㅇㅇ > ㅇㅇ > ㅇㅇ</td>
                                </tr>
                                <tr>
                                    <th scope="row">분담율/금액</th>
                                    <td colspan="3">50%(10,000)</td>
                                </tr> -->
                                <template v-if="cancelInfoShow">
                                    <template v-if="state.data.pntStCd == '215006'">
                                        <tr>
                                            <th scope="row">취소반려사유</th>
                                            <td colspan="3">{{ state.data.athrRsnCdNm }}, {{ state.data.athrRsnCts }}</td>
                                        </tr>
                                        <tr>
                                            <th scope="row">취소반려자</th>
                                            <td>{{ state.data.athrMnId }}</td>
                                            <th scope="row">취소반려일</th>
                                            <td>{{ state.data.athrDt ? state.data.athrDt.substring(0, 10) :''}}</td>
                                        </tr>
                                    </template>
                                    <tr v-if="state.data.pntStCd == '215005'">
                                        <th scope="row">취소승인자</th>
                                        <td>{{ state.data.athrMnId }}</td>
                                        <th scope="row">취소승인일</th>
                                        <td>{{ state.data.athrDt ? state.data.athrDt.substring(0, 10) :''}}</td>
                                    </tr>
                                    <tr>
                                        <th scope="row">취소요청자</th>
                                        <td>{{ state.data.athrRqstId }}</td>
                                        <th scope="row">취소요청일</th>
                                        <td>{{ state.data.athrRqstDt ? state.data.athrRqstDt.substring(0, 10) : ''}}</td>
                                    </tr>
                                    <tr>
                                        <th scope="row">취소요청사유</th>
                                        <td colspan="3">{{ state.cnclRsn }}</td>
                                    </tr>
                                </template>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </template>
    </DefaultModal>
</template>
<script>
import { getCurrentInstance, reactive, computed, onMounted } from 'vue';
import { _getIsshistDetail } from '@/api/pntmng.js';
import { dmCommFunc } from '@/views/pntmng/common/common.js';
import DefaultModal from '@/plugins/modal/modal/DefaultModal.vue';

export default {
    emits: ['modalPlcyclose'],
    props: ['pntNoSn', 'type'],
    components: { DefaultModal },
    setup(props) {
        const { emit } = getCurrentInstance();
        const { modal } = dmCommFunc();
        const cancelInfoShow = reactive(
            computed(() =>
                state.data.pntStCd == '215004' ||
                state.data.pntStCd == '215005' ||
                state.data.pntStCd == '215006')
        );
        const state = reactive({
            data: {
                pntNoSn: '',
                athrNoSn: '',
                pntPlcyCd: '',
                pntPlcyNm: '',
                pntVldBgnDate: '',
                pntVldEndDate: '',
                pntIssTyCd: '',
                pntIssTyCdNm: '',
                pntIssSeCd: '',
                pntIssSeCdNm: '',
                pntCnclRsnCd: '',
                pntCnclRsnCdNm: '',
                pntStCd: '',
                pntStCdNm: '',
                pntCnclRsn: '',
                pntAmt: '',
                athrRqstId: '',
                athrRqstDt: '',
                athrRsnCd: '',
                athrRsnCdNm: '',
                athrRsnCts: '',
                athrMnId: '',
                athrDt: ''
            },
            pntNoSn: computed(() => props.pntNoSn),
            type: computed(() => props.type),
            buttonCancel: '닫기',
            buttonDelete: computed(() => state.type == 'Res' && state.data.pntStCd == '215004' ? '취소반려' : ''),
            buttonConfirm: computed(() => state.type == 'Res' && state.data.pntStCd == '215004' ? '취소승인' :
                state.type != 'Res' && (state.data.pntStCd == '215001' || state.data.pntStCd == '215002' || state.data.pntStCd == '215006') ? '취소요청' : ''),
            cnclRsn: computed(() => state.data.pntCnclRsnCdNm ? `${state.data.pntCnclRsnCdNm}, ${state.data.pntCnclRsn}` : '')
        });

        onMounted(() => {
            getIsshistDetail();
        });

        const getIsshistDetail = async () => {
            try {
                const response = await _getIsshistDetail({pntNoSn: state.pntNoSn});
                if (response.code == 'OK')  state.data = response.data;
                else modal(response.message);
            } catch (error) {
                modal(error);
            }
        };

        const closeModal = (type, name) => {
            console.log('type : ', type);
            let val = type == 'modaldelete' ? 'reject' : 'aprv';
            emit('modalPlcyclose', type, val);
        };

        return {
            state,
            cancelInfoShow,
            closeModal
        };
    }

};

</script>