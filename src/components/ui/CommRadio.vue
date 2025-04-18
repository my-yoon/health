<template>
    <div v-for="(item, index) in state.selectComm" :key="index">
        <span class="radio" v-if="!(item.cmnCdNm === '전체')">
            <input :id="'service' + item.cmnCd + index" :name="'service' + item.uprGrpCd" type="radio" :value="item.cmnCd"
                v-model="state.selectOption" @change="selectValue(state.selectOption, item.cmnCdNm, state.selectValue)"
                :disabled="disabled">
            <label :for="'service' + item.cmnCd + index">{{ item.cmnCdNm }}</label>
        </span>
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
            selectOption: null, //selectvalue
            selectCode: null, //1depthKey
            selectValue: null, //selectType(2depthKey)
            selectComm: null // /2depthKey 배열
        });
        const selectValue = (valueCode, valueName, type) => {
            console.log(valueCode, valueName, type);
            emit('changedValue', valueCode, valueName, type);
        };
        onMounted(() => {
            state.selectCode = state.selectType.split('.')[0]; //공통코드 부모 키
            state.selectValue = state.selectType.split('.')[1]; //공통코드 선택된 키
            state.selectComm = commoCode[state.selectCode][state.selectValue];
            state.selectOption = state.initData;
        });
        return {
            state,
            commoCode,
            selectValue

        };
    }
};
</script>