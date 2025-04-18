<template>
    <div class="item">
        <label>진행상태</label>
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
import { computed, onMounted, ref } from 'vue';
import { _getCodeApply } from '@/api/sttl.js';
const model = defineModel({required: true, default: ''});
const cdList = defineModel('cdList', { default: '' });
const props = defineProps({
    sttlCyclCd: String
});
onMounted(() => {
    _getCodeApply('ODR_ST_CD', cdList, props.sttlCyclCd || 'M');
});

// const filteredOptions = computed(() => props.count == 2 ? odrStCdList.value.filter((item) => item.cd == 200 || item.cd == 210) : odrStCdList.value);
</script>
<style></style>