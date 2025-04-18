<template>
    <div class="item">
        <label><slot>사용여부</slot></label>
        <span class="input">
            <span class="dv">
                <select class="custom-select sm" v-model="model">
                    <option value="">전체</option>
                    <option value="Y">Yes</option>
                    <option value="N">No</option>
                </select>
            </span>
        </span>
    </div>
</template>
<script setup>
const model = defineModel({required: true, default: ''});
</script>
<style></style>