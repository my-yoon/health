<template>
    <div class="item">
        <SttlDateMonthSerch :dateTitle="dateTitle || '정산년월'" @onSelectDate="onSelectPicker" :pickerOnly="false" :setDay="'1month'" :ess="props.ess" ref="date" />
    </div>
</template>

<script setup>
import { ref } from 'vue';
import SttlDateMonthSerch from '../component/SttlDateMonthSerch.vue';

const props = defineProps({
    dateTitle: String,
    ess: Boolean,
    bgnYm: String,
    endYm: String
});

const emit = defineEmits(['update:bgnYm', 'update:endYm']);

const onSelectPicker = (type, value = '') => {
    if (type === 'self_start') {
        emit('update:bgnYm', value);
    } else if (type === 'self_end') {
        emit('update:endYm', value);
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
