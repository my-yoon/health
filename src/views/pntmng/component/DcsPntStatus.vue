<template>
    <PntCategoryInfo :params="state.params"/>
    <div class="ui-section">
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
                            <th scope="row">정책상태</th>
                            <td colspan="3">{{ state.params.plcyStCdNm }}</td>
                        </tr>
                        <tr v-if="state.params.plcyStCd=='206010'">
                            <th scope="row">미사용반려사유</th>
                            <td colspan="3">{{ state.params.athrRsnCdNm }}, {{ state.params.athrRsnCts }}</td>
                        </tr>
                        <tr v-if="state.params.plcyStCd=='206009'">
                            <th scope="row">미사용승인자</th>
                            <td>{{ state.params.plcyNusAprvId }}</td>
                            <th scope="row">미사용승인일</th>
                            <td>{{ state.params.plcyNusAprvDt ? state.params.plcyNusAprvDt.substring(0,10) :''}}</td>
                        </tr>
                        <tr v-if="state.params.plcyStCd=='206010'">
                            <th scope="row">미사용반려자</th>
                            <td>{{ state.params.plcyNusAprvId }}</td>
                            <th scope="row">미사용반려일</th>
                            <td>{{ state.params.plcyNusAprvDt ? state.params.plcyNusAprvDt.substring(0,10) : ''}}</td>
                        </tr>
                        <tr v-if="state.params.plcyStCd=='206008' || state.params.plcyStCd=='206010' || state.params.plcyStCd=='206009'">
                            <th scope="row">미사용요청자</th>
                            <td>{{ state.params.athrRqstId }}</td>
                            <th scope="row">미사용요청일</th>
                            <td>{{ state.params.athrRqstDt ? state.params.athrRqstDt.substring(0,10) :''}}</td>
                        </tr>
                        <tr v-if="state.params.plcyStCd=='206007'">
                            <th scope="row">삭제반려사유</th>
                            <td colspan="3">{{ state.params.athrRsnCdNm }}, {{ state.params.athrRsnCts }}</td>
                        </tr>
                        <tr v-if="state.params.plcyStCd=='206007'">
                            <th scope="row">삭제반려자</th>
                            <td>{{ state.params.plcyAprvId }}</td>
                            <th scope="row">삭제반려일</th>
                            <td>{{ state.params.plcyAprvDt ? state.params.plcyAprvDt.substring(0,10) : ''}}</td>
                        </tr>
                        <tr v-if="state.params.plcyStCd=='206003' || state.params.plcyStCd=='206008' || state.params.plcyStCd=='206010'
                                || state.params.plcyStCd=='206009'">
                            <th scope="row">승인자</th>
                            <td>{{ state.params.plcyAprvId}}</td>
                            <th scope="row">승인일</th>
                            <td>{{ state.params.plcyAprvDt ? state.params.plcyAprvDt.substring(0,10) : ''}}</td>
                        </tr>
                        <tr v-if="state.params.plcyStCd=='206006'">
                            <th scope="row">삭제승인자</th>
                            <td>{{ state.params.plcyAprvId }}</td>
                            <th scope="row">삭제승인일</th>
                            <td>{{ state.params.plcyAprvDt ? state.params.plcyAprvDt.substring(0,10) : ''}}</td>
                        </tr>
                        <tr v-if="state.params.plcyStCd=='206006' || state.params.plcyStCd=='206005' || state.params.plcyStCd=='206007'">
                            <th scope="row">삭제요청자</th>
                            <td>{{ state.params.athrRqstId}}</td>
                            <th scope="row">삭제요청일</th>
                            <td>{{ state.params.athrRqstDt ? state.params.athrRqstDt.substring(0,10) : ''}}</td>
                        </tr>
                        <tr v-if="state.params.plcyStCd=='206001' || state.params.plcyStCd=='206002' || state.params.plcyStCd=='206003'
                                || state.params.plcyStCd=='206005' || state.params.plcyStCd=='206006' || state.params.plcyStCd=='206007'
                                || state.params.plcyStCd=='206008' || state.params.plcyStCd=='206009' || state.params.plcyStCd=='206010'">
                            <th scope="row">등록자</th>
                            <td>{{ state.params.fstRgtrSn}}</td>
                            <th scope="row">등록일</th>
                            <td>{{ state.params.fstRgsDt ? state.params.fstRgsDt.substring(0,10) : ''}}</td>
                        </tr>
                        <tr v-if="state.params.plcyStCd=='206004'">
                            <th scope="row">반려사유</th>
                            <td colspan="3">{{ state.params.athrRsnCdNm }}, {{ state.params.athrRsnCts }}</td>
                        </tr>
                        <tr v-if="state.params.plcyStCd=='206004'">
                            <th scope="row">반려자</th>
                            <td>{{ state.params.plcyAprvId }}</td>
                            <th scope="row">반려일</th>
                            <td>{{ state.params.plcyAprvDt ? state.params.plcyAprvDt.substring(0,10) : ''}}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
  
</template>
<script>
import { reactive, computed } from 'vue';
import PntCategoryInfo from '@/views/pntmng/component/PntCategoryInfo.vue';

export default {
    props: ['params'],
    components: {PntCategoryInfo},
    setup(props) {
        const state = reactive({
            params: computed(() => props.params)
        });

        return {
            state
        };
    }
};
</script>