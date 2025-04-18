<template>
    <div class="item">
        <label>거래처유형</label>
        <span class="input">
            <span class="dv">
                <select class="custom-select sm" v-model="model">
                    <option value="">선택</option>
                    <option v-for="(item) in cdList" :value="item.cd" :key="item.cd">{{ item.nm }}</option>
                </select>
            </span>
        </span>
    </div>
</template>
<script setup>
import { onMounted, ref } from 'vue';
import { _getCodeApply } from '@/api/sttl.js';
const model = defineModel({required: true, default: ''});
const cdList = ref([]);
onMounted(() => {
    // _getCodeApply('CHN_SE_CD', cdList);
    cdList.value = [
        {value: 1, nm: '사업자'},
        {value: 2, nm: '개인'},
        {value: 3, nm: '외국인'}
    ];
});
</script>
<style></style>