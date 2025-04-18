<template>
     <div class="item">
        <label>정산년도</label>
        <span class="input">
            <span class="dv">
                <select class="custom-select sm" v-model="model">
                    <option value="">전체</option>
                    <option v-for="(item) in years" :value="item.value" :selected="item.selected" :key="item.value">{{ item.value }}{{ item.value == thisYear?" (this Year)":"" }}</option>
                </select>
            </span>
        </span>
    </div>
</template>
<script setup>
let years = [];
const thisYear = dayJS().format('YYYY');
const YEAR_GAP = 7;
for (let i = 0; i < YEAR_GAP * 2 ; i++) {
    const yearStr = dayJS().add(i - YEAR_GAP, 'y').format('YYYY');
    years.push({value: yearStr, selected: yearStr == thisYear});
}
const model = defineModel({required: true, default: ''});
</script>
<style></style>