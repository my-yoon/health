<template>
    <div class="item">
        <label>전표생성단위</label>
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
const cdList = ref([]);
const props = defineProps({
    sttlCyclCd: String
});
onMounted(() => {
    _getCodeApply('SLIP_CRT_UNIT_CD', cdList, props.sttlCyclCd || 'D');
});
</script>
<style></style>