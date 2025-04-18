<template>
    <div class="reg-item">
        <select :class="['custom-select', state.className]" @change="selectValue(state.selectOption, state.selectValue)"
            v-model="state.selectOption" ref="selectbox" :disabled="state.disabled">
            <option value=""
                v-if="!(state.selectValue === 'rprsTlnoFno') &&
                    !(state.selectValue === 'bkcd') &&
                    !(state.selectValue === 'mailType2') &&
                    !(state.selectValue === 'reJoinCD') &&
                    !(state.selectValue === 'ptnrSelrSvcTyCd') &&
                    !(state.selectValue === 'noticeTarget') &&
                    !(state.selectValue === 'approveAdminSn') &&
                    !(state.selectValue === 'fultRsnCd') &&
                    !(state.selectValue === 'indnOsSeCd') &&
                    !(state.selectValue === 'indnLctSeCd') &&
                    !(state.selectValue === 'indnLctSeCd2') &&
                    !(state.selectValue === 'faqcategory') &&
                    !(state.selectValue === 'bzmTyCdtype1') &&
                    !(state.selectValue === 'bzmTyCdtype2') &&
                    !(state.selectValue === 'bzmTyCd')"
            >
                전체
            </option>
            <option value=""
                v-if="state.selectValue === 'faqcategory' ||
                    state.selectValue === 'bzmTyCdtype1' ||
                    state.selectValue === 'bzmTyCdtype2' ||
                    state.selectValue === 'bzmTyCd'"
            >
                선택
            </option>
            <option v-for="(item, index) in state.selectComm" :key="index" :value="item.cmnCd">
                {{ item.cmnCdNm }}
            </option>
        </select>
    </div>
</template>
<script>
import { reactive, computed, getCurrentInstance, onMounted, ref } from 'vue';
import { commoCode } from '@/data/commcode';
import { watch } from 'vue';
export default {
    props: ['selectType', 'initData', 'className', 'disabled'],
    emits: ['changedValue'],
    setup(props) {
        const { emit } = getCurrentInstance();
        const selectbox = ref(null);
        const state = reactive({
            disabled: computed(() => props.disabled ? props.disabled : null),
            selectType: computed(() => props.selectType),
            initData: computed(() => props.initData),
            selectOption: null, //selectvalue
            selectCode: null, //1depthKey
            selectValue: null, //selectType(2depthKey)
            selectComm: null, // /21depthKey 배열
            className: computed(() => props.className)
        });
        const selectValue = (valueCode, type) => {
            let valueName = selectbox.value.options[selectbox.value.selectedIndex].text;
            emit('changedValue', valueCode, valueName, type);
        };
        watch(props, () => {
            state.selectOption = state.initData;
        });
        onMounted(() => {
            state.selectCode = state.selectType.split('.')[0]; //공통코드 부모 키
            state.selectValue = state.selectType.split('.')[1]; //공통코드 선택된 키
            state.selectComm = commoCode[state.selectCode][state.selectValue];
            state.selectOption = state.initData;


        });

        return {
            state,
            commoCode,
            selectbox,
            selectValue


        };
    }
};
</script>