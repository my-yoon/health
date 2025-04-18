<template>
    <div class="item">
        <label>결제구분</label>
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
import { _getCodeApply } from '@/api/sttl.js';
import { onMounted } from 'vue';
const model = defineModel({required: true, default: ''});
const cdList = defineModel('cdList', { default: ''});

onMounted(() => {
    _getCodeApply('PYMT_SE_CD', cdList);
});

</script>
<style></style>