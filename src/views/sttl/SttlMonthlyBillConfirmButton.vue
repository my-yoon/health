<template>
    <button type="button" class="btn btn-ss" @click="publish">청구서 강제확정</button>
</template>
<script setup>
import { _setInstlMonthlyStarRsdcn } from '@/api/sttl.js';
import { inject, onMounted, ref } from 'vue';
const $Modal = inject('$Modal');
const props = defineProps({
    selectedList: Array
});
const emit = defineEmits(['publish']);


const publish = async () => {
    if (props.selectedList && props.selectedList.length > 0) {
        let rightCount = 0;
        props?.selectedList?.forEach(row => {
            if (row.starRsStCd == 20) {
                rightCount++;
            }
        });
        if (rightCount === props.selectedList.length) {
            const result = await _setInstlMonthlyStarRsdcn({ list: props.selectedList });
            if (result.data.code === 'OK') {
                $Modal.alert({ message: result.data.message, buttonText: { ok: '확인' } });
                emit('publish');
            } else {
                $Modal.alert({ message: result.data.message, buttonText: { ok: '확인' } });
            }
        } else {
            $Modal.alert({ message: '선택된 모든 목록이 청구서발행이 아닙니다.', buttonText: { ok: '확인' } });
        }
    } else {
        $Modal.alert({ message: '선택된 항목이 없습니다.', buttonText: { ok: '확인' } });
    }
};

defineExpose({
    open
});

</script>
<style>
.ui-modal-wrap {
    width: 940px;
}
</style>