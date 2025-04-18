<template>
    <div class="item">
        <SttlDateSerchForMonth :dateTitle="props.dateTitle || '정산일자'" @onSelectDate="onSelectPicker" :pickerOnly="false" :setDay="'1month'" :ess="props.ess" ref="date" />
    </div>
</template>

<script setup>
import { ref } from 'vue';
import SttlDateSerchForMonth from '../component/SttlDateSerchForMonth.vue';

const props = defineProps({
    dateTitle: String,
    ess: Boolean
});

const bgnDate = defineModel('bgnDate');
const endDate = defineModel('endDate');

const onSelectPicker = (type, value, status) => {
    console.log('type:', type, 'value:', value, 'status:', status);
    if (type === 'day') {
        bgnDate.value = value[0];
        endDate.value = value[1];
    } else if (type === 'self_end' || type === 'self_start') {
        // 직접 데이터 피커 설정
        if (type === 'self_start') {
            bgnDate.value = value;
        } else if (type === 'self_end') {
            endDate.value = value;
        }
    }
};

const date = ref(null);
const initDate = () => {
    date.value.initDate();
};

defineExpose({
    initDate
});

</script>
