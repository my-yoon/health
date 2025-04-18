<template>
    <div class="item">
       <label>정산년월</label>
       <span class="input">
           <span class="dv">
               <select class="custom-select sm" v-model="selectedYear" @change="updateModel">
                   <option value="">전체년</option>
                   <option v-for="(item) in years" :value="item.value" :key="item.value">{{ item.value }}{{ item.value == thisYear?" (this Year)":"" }}</option>
               </select>
           </span>
           <span class="dv">
               <select class="custom-select sm" v-model="selectedMonth" @change="updateModel">
                   <option value="">전체월</option>
                   <option v-for="item in 12" :value="item" :key="item">{{ item }}</option>
               </select>
           </span>
       </span>
   </div>
</template>
<script setup>
import { ref, inject } from 'vue';
const dayJS = inject('dayJS');
let years = [];
const thisYear = dayJS().format('YYYY');
const YEAR_GAP = 7;
for (let i = 0; i < YEAR_GAP * 2 ; i++) {
    const yearStr = dayJS().add(i - YEAR_GAP, 'y').format('YYYY');
    years.push({value: yearStr, selected: yearStr == thisYear});
}

const props = defineProps(['modelValue']);
const selectedYear = ref('');
const selectedMonth = ref('');

const emit = defineEmits(['update:modelValue']);
const updateModel = () => {
    if (selectedYear.value && selectedMonth.value) {
        const formattedValue = `${selectedYear.value}${selectedMonth.value.toString().padStart(2, '0')}`;
        emit('update:modelValue', formattedValue);
    } else {
        emit('update:modelValue', '');

    }
};

</script>
<style></style>