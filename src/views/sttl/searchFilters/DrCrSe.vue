<template>
    <div class="item">
        <label>차대구분</label>
        <span class="input">
            <span class="dv">
                <select class="custom-select sm" v-model="model">
                    <option value="">전체</option>
                    <option v-for="(item) in drcrSeCdList" :value="item.cd" :key="item.cd">{{ item.cd + " : " +item.nm }}</option>
                </select>
            </span>
        </span>
    </div>
</template>
<script setup>
import { onMounted, ref } from 'vue';
import { _getCodeApply } from '@/api/sttl.js';
const model = defineModel({required: true, default: ''});
const drcrSeCdList = ref([]);
onMounted(() => {
    _getCodeApply('DRCR_SE_CD', drcrSeCdList);
});
</script>
<style></style>