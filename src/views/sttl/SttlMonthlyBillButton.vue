<template>
    <button v-if="!props.inDetail" type="button" class="btn btn-ss" @click="publish">청구서 발행</button>
    <button v-else :disabled="props.params.starRsStCd!=='10'" type="button" class="btn btn-sl posi" @click="publishSingle">청구서 발행</button>
</template>
<script setup>
import { _setInstlMonthlyStarRscreate } from '@/api/sttl.js';
import { inject, onMounted, ref } from 'vue';
const $Modal = inject('$Modal');
const modalIsShow = ref(false);
const props = defineProps({
    selectedList: Array,
    inDetail: Boolean,
    params: Object
});
const emit = defineEmits(['publish']);


const publish = async () => {
    if (props.selectedList && props.selectedList.length > 0) {
        let rightCount = 0;
        props?.selectedList?.forEach(row => {
            if (row.starRsStCd == 10) {
                rightCount++;
            }
        });
        if (rightCount === props.selectedList.length) {
            const result = await _setInstlMonthlyStarRscreate({ list: props.selectedList });
            if (result.data.code === 'OK') {
                $Modal.alert({ message: '청구서가 발행되었습니다.', buttonText: { ok: '확인' } });
                emit('publish');
            } else {
                $Modal.alert({ message: response.data.message, buttonText: { ok: '확인' } });
            }
        } else {
            $Modal.alert({ message: '선택된 목록은 이미 청구서가 발행되었습니다.', buttonText: { ok: '확인' } });
        }
    } else {
        $Modal.alert({ message: '선택된 항목이 없습니다.', buttonText: { ok: '확인' } });
    }
};

const publishSingle = async () => {
    const result = await _setInstlMonthlyStarRscreate({ list: [props.params] });
    if (result.data.code === 'OK') {
        $Modal.alert({ message: '청구서가 발행되었습니다.', buttonText: { ok: '확인' } });
        emit('publish');
    }
};

// onMounted(() => {
//     open();
// });

defineExpose({
    open
});

</script>
<style>
.ui-modal-wrap {
    width: 940px;
}
</style>