<template>
    <div class="item">
        <label>매출구분</label>
        <span class="input">
            <span class="dv">
                <select class="custom-select sm" v-model="model">
                    <option v-for="(item) in cdList" :value="item.cd" :key="item.cd">{{ item.nm }}</option>
                </select>
            </span>
        </span>
    </div>
</template>
<script setup>
import { _getCodeApply } from '@/api/sttl.js';
const model = defineModel({required: true});
const cdList = defineModel('cdList', {default: [{cd: 'S', nm: '스타'}, {cd: 'C', nm: '카드'}]});

</script>
<style></style>