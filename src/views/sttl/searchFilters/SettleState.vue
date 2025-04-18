<template>
    <div class="item">
        <label>정산상태</label>
        <span class="input">
            <span class="dv">
                <select class="custom-select sm" v-model="model">
                    <option value="">전체</option>
                    <option v-for="(item) in sttlStatusList" :value="item" :key="item">{{ item }}</option>
                </select>
            </span>
        </span>
    </div>
</template>
<script setup>
const sttlStatusList = ['Open', 'Close'];
const model = defineModel({required: true, default: ''});
</script>
<style></style>