<template>
    <div class="item">
        <label><slot>전표번호</slot></label>
        <span class="input">
            <span class="dv">
                <input type="text" class="form-control sm" placeHolder="입력" v-model="model" />
            </span>
        </span>
    </div>
</template>
<script setup>
const model = defineModel({required: true, default: ''});
</script>


