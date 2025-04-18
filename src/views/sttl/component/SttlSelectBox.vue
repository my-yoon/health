<template>
    <div class="reg-item">
        <!-- 리스트 페이징 처리 -->
        <select class="custom-select sm" v-if="state.selectType === 'page'"
            @change="selectValue(state.selectOption, state.selectType)" v-model="state.selectOption"
            :disabled="state.disabled">
            <option value=50 :selected=true>50개씩 보기</option>
            <option value=100>100개씩 보기</option>
            <option value=150>150개씩 보기</option>
            <option value=200>200개씩 보기</option>
        </select>
        <!-- 공통코드검색 -->
        <select class="custom-select sm" v-if="state.selectType === 'codeGrp'"
            @change="selectValue(state.selectOption, state.selectType)" v-model="state.selectOption"
            :disabled="state.disabled">
            <option value="GrpCdID" :selected=true>코드그룹 ID</option>
            <option value="GrpCdNm">코드그룹명</option>
        </select>
        <!-- 사용여부 -->
        <select class="custom-select sm" v-if="state.selectType === 'useYn'"
            @change="selectValue(state.selectOption, state.selectType)" v-model="state.selectOption"
            :disabled="state.disabled">
            <option value="all" :selected=true>전체</option>
            <option value="Y">사용</option>
            <option value="N">미사용</option>
        </select>
        <!-- 검색 구분 -->
        <select class="custom-select sm" v-if="state.selectType === 'category'"
            @change="selectValue(state.selectOption, state.selectType)" v-model="state.selectOption"
            :disabled="state.disabled">
            <option value="all" :selected=true>전체</option>
            <option value="Y">제목</option>
            <option value="N">내용</option>
        </select>
        <!-- 조건검색옵션 -->
        <select class="custom-select sm" v-if="state.selectType === 'cnSercSe'"
            @change="selectValue(state.selectOption, state.selectType)" v-model="state.selectOption"
            :disabled="state.disabled">
            <option value="">전체</option>
            <option value="ntprNm">기업명</option>
            <option value="ntprSn">기업번호</option>
            <option value="ntprUcd">기업ID</option>
            <option value="admnNm">담당자명</option>
            <option value="brn">사업자번호</option>
        </select>
    </div>
</template>
<script>
import { reactive, computed, getCurrentInstance, onMounted } from 'vue';
import { commoCode } from '@/data/commcode';
export default {
    props: ['selectType', 'initData', 'disabled'],
    emits: ['changedValue'],
    setup(props) {
        const { emit } = getCurrentInstance();
        const state = reactive({
            selectType: computed(() => props.selectType),
            initData: computed(() => props.initData),
            disabled: computed(() => props.disabled),
            selectOption: null,
            selectText1: null,
            selectText2: null
        });
        const selectValue = (value, type) => {
            // const dash = value.split('-');
            // console.log(dash);
            // let valueCode = dash[0];
            // let valueName = dash[1];
            let valueName = '';
            emit('changedValue', value, type, valueName);
        };
        onMounted(() => {
            state.selectText1 = state.selectType.split('.')[0];
            state.selectText2 = state.selectType.split('.')[1];
            if (state.selectType === 'page') {
                state.selectOption = 50;
            } else if (state.selectType === 'codeGrp') {
                state.selectOption = 'GrpCdID';
            } else if (state.selectType === 'useYn') {
                state.selectOption = 'all';
            } else if (state.selectType === 'category') {
                state.selectOption = 'all';
            } else if (state.selectType === 'cnSercSe') {
                state.selectOption = '';
            } else {
                state.selectOption = state.initData;
            }
            // getCommTree();
        });
        return {
            state,
            commoCode,
            selectValue
        };
    }
};
</script>