<template>
    <tr>
        <th scope="row">포인트 정책명</th>
        <td>{{ state.params.pntPlcyNm }}</td>
        <th scope="row">정책번호</th>
        <td>{{ state.params.pntPlcyCd }}</td>
    </tr>
    <tr>
        <th scope="row">포인트 정책설명</th>
        <td colspan="3">{{ state.params.pntPlcyDscr }}</td>
    </tr>
    <tr>
        <th scope="row">정책생성사유</th>
        <td colspan="3">{{ state.params.pntPlcyCrtRsn }}</td>
    </tr>
    <tr>
        <th scope="row">정책기간</th>
        <td colspan="3">{{ state.params.pntPlcyBgnDate ? state.params.pntPlcyBgnDate +' ~ '+ state.params.pntPlcyEndDate : ''}}</td>
    </tr>
    <tr>
        <th scope="row">포인트 유형</th>
        <td>{{ state.params.pntIssTyCdNm }}</td>
        <th scope="row">발급구분</th>
        <td>{{ state.params.pntIssSeCdNm }}</td>
    </tr>
    <tr>
        <th scope="row">중복가능여부</th>
        <td> {{ state.params.dplIssPsbYn == 'Y' ? '중복허용' :
                state.params.dplIssPsbYn == 'N' ? '중복비허용' : ''}} </td>
        <th scope="row">중복설정</th>
        <template v-if="state.params.dplIssPsbYn == 'N'">
            <td> </td>
        </template>
        <template v-else>
            <td v-if ="state.params.dplStngSeCd =='209001'">
                {{state.params.dplIssPsbNum ? addComma(state.params.dplIssPsbNum)+ ' 일' : ''}}
            </td>
            <td v-else-if ="state.params.dplStngSeCd =='209002'">
                {{state.params.dplIssPsbNum ? '일 최대 '+addComma(state.params.dplIssPsbNum)+' 회' : ''}}
            </td>
            <td v-else></td>
        </template>
    </tr>
    <tr>
        <th scope="row">포인트금액</th>
        <td>{{ state.params.pntAmt ? state.params.pntAmt+' P' : ''}}</td>
        <th scope="row">발행한도</th>
        <td>{{ state.params.pntIssLmtCnt ? addComma(state.params.pntIssLmtCnt)+' 건' : ''}}</td>
    </tr>
    <tr>
        <th scope="row">유효기간설정</th>
        <td>{{ state.params.pntVldTrStngCdNm }}</td>
        <th scope="row">유효기간</th>
        <td v-if="state.params.pntVldTrStngCd == '210002'">발급일로부터 {{ state.params.pntVldTr }} {{ state.params.pntVldTrSeCdNm }}</td>
        <td v-else-if="state.params.pntVldTrStngCd == '210001'">{{ state.params.pntVldBgnDate }} ~ {{ state.params.pntVldEndDate }}</td>
        <td v-else></td>
    </tr>
</template>
<script>
import { reactive, computed } from 'vue';
export default {
    props: ['params'],
    setup(props) {
        const state = reactive({
            params: computed(() => props.params)
        });

        const addComma = (num) => num ? num.toLocaleString('ko') : '';

        return {
            state,
            addComma
        };
    }
};
</script>