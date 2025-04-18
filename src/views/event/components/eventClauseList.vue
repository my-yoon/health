<template>
    <tr>
        <th scope="row">약관</th>
        <td colspan="3">
            <div class="table-util" style="margin-bottom:0">
                <div class="btn-set-m flex">
                    <button type="button" class="btn btn-ss" @click="openClausePop('open')">추가</button>
                    <button type="button" class="btn btn-ss" @click="delClause">삭제</button>
                </div>
            </div>
            <div class="tbl-wrap mt-20" v-if="state.eventClusListTable.length > 0">
                <div class="table-list">
                    <table class="table list">
                        <caption>약관목록</caption>
                        <colgroup>
                            <col style="width: 45px;">
                            <col style="width: 100px;">
                            <col style="width: 120px;">
                            <col style="width: auto;">
                            <!-- <col style="width: 100px;"> -->
                            <col style="width: 160px;">
                        </colgroup>
                        <thead>
                            <tr>
                                <th scope="col" class="t-left">
                                    <span class="checkbox">
                                        <input id="clauseAll" name="clauseGroup" type="checkbox">
                                        <label for="clauseAll"></label>
                                    </span>
                                </th>
                                <th scope="col">필수 여부</th>
                                <th scope="col">약관 주체</th>
                                <th scope="col">약관명</th>
                                <!-- <th scope="col">버전</th> -->
                                <th scope="col">개정 적용일</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="(item, index) in state.eventClusListTable" :key="index">
                                <td>
                                    <span class="checkbox" :id="'clause1' + index">
                                        <input :id="'clause' + index" name="clauseGroup" type="checkbox"
                                            @change="onChangeClause(`clause${index}`, index)">
                                        <label :for="`clause${index}`"></label>
                                    </span>
                                </td>
                                <td>
                                    <template v-if="item.seEsnChcCd === '253001'">
                                        필수
                                    </template>
                                    <template v-if="item.seEsnChcCd === '253002'">
                                        선택
                                    </template>
                                </td>
                                <td>{{ item.clusMngOffrNtprSnNm }}</td>
                                <td>{{ item.clusGrpNm }}이벤트 이용 약관</td>
                                <!-- <td>V1.12.1</td> -->
                                <td>{{ dayJS(item.dstrbDt).format('YYYY-MM-DD hh:mm') }}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </td>
    </tr>
</template>
<script>
import { getCurrentInstance, computed, reactive, inject, ref, onMounted, watch } from 'vue';
export default {
    props: ['formData', 'eventClusListTable'],
    emits: ['openClause', 'onChangeClause'],
    setup(props) {
        const { emit } = getCurrentInstance();
        const dayJS = inject('dayJS');
        const state = reactive({
            formData: computed(() => props.formData),
            eventClusListTable: computed(() => props.eventClusListTable)

        });
        //누적혜택 변경감지 히여 추가 
        watch(props.fileInputList_Atnd, () => {

        });
        onMounted(() => {


        });
        const openClausePop = (type) => {
            emit('openClause', type);
        };
        const onChangeClause = (type, index) => {
            emit('onChangeClause', type, index);
        };
        const delClause = () => {
            emit('delClause');
        };
        //파일업로드
        // emit('changefileList', caseType, index, type, value);

        return {
            dayJS,
            state,
            openClausePop,
            onChangeClause,
            delClause
        };
    }
};
</script>
