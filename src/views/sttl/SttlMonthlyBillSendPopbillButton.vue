<template>
    <button :disabled="props.disabled || false" type="button" class="btn btn-ss" @click="sendPopBill">팝빌 전송</button>
</template>
<script setup>
import { _setInstlMonthlyStarNts } from '@/api/sttl.js';
import { inject, ref } from 'vue';
const $Modal = inject('$Modal');
const props = defineProps({
    selectedList: Array,
    params: Object
});
const emit = defineEmits(['publish']);


const sendPopBill = async () => {
    if (props.selectedList && props.selectedList.length > 0) {
        let rightCount = 0;
        props?.selectedList?.forEach(row => {
            if (row.starRsStCd == 30) {
                rightCount++;
            }
        });
        if (rightCount === props.selectedList.length) {
            const response = await _setInstlMonthlyStarNts({ list: props.selectedList });
            if (response.data.status === 200) {
                $Modal.alert({ message: response.data.message, buttonText: { ok: '확인' } });
                emit('publish');
            } else {
                $Modal.alert({ message: response.data.message, buttonText: { ok: '확인' } });
            }
        } else {
            $Modal.alert({ message: '선택된 모든 목록이 세금계산서발행 상태가 아닙니다.', buttonText: { ok: '확인' } });
        }
    } else {
        $Modal.alert({ message: '선택된 항목이 없습니다.', buttonText: { ok: '확인' } });
    }
};

</script>
