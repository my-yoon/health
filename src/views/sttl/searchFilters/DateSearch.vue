<template>
    <div class="item">
        <label>{{props.dateTitle ||'일자'}}</label>
        <span class="input">
            <span class="dv">
                <select class="custom-select sm" v-model="dateSearchType">
                    <option value="">전체</option>
                    <slot>
                        <option value="pymtDate">결제일</option>
                        <option value="cnclDate">취소일</option>
                        <option value="cmplDate">완료일</option>
                        <option value="dcnDate">확정일</option>
                    </slot>
                </select>
            </span>
            <span class="dv">
                <div class="ui-datepicker ss">
                    <DatePicker position="left" v-model="searchDate" :enableTimePicker="false"
                        locale="ko" :clearable="false" :format="dateFormat" autoApply text-input :text-input-options="{format:'yyyyMMdd'}" ref="date"/>
                </div>
            </span>
        </span>
    </div>
</template>

<script setup>
import { ref } from 'vue';

const props = defineProps({
    dateTitle: String
});

const dateSearchType = defineModel('dateSearchType', {default: ''});
const searchDate = defineModel('searchDate', {default: ''});

const date = ref(null);
const initDate = () => {
    date.value.clearValue();
};

defineExpose({
    initDate
});
</script>
