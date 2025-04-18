<template>
    <div class="item">
        <label>국세청결과코드</label>
        <span class="input">
            <span class="dv">
                <select class="custom-select sm" v-model="model">
                    <option value="">전체</option>
                    <option v-for="(item) in cdList" :value="item.cd" :key="item.cd">{{ item.cd + " : " +item.nm }}</option>
                </select>
            </span>
        </span>
    </div>
</template>
<script setup>
import { onMounted, ref } from 'vue';
import { _getCodeApply } from '@/api/sttl.js';
const model = defineModel({required: true, default: ''});
const cdList = defineModel('cdList', { default: ''});

onMounted(() => {
    _getCodeApply('NTS_RSLT_CD', cdList);
});
</script>
<style></style>