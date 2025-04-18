<script>
import { ref, nextTick, inject } from 'vue';
// import dayjs from 'dayJS';
// import VueDatePicker from '@vuepic/vue-datepicker';
// import '@vuepic/vue-datepicker/dist/main.css'
export default{
    // components:{
    //     VueDatePicker
    // },
    setup(props){
        
        let initValue = null;
        const dayjs = inject('dayJS');
        if(!_.isEmpty(props.params.value)){
            const tempDate = dayjs(props.params.value,'YYYYMM');
            initValue = {year:tempDate.year(), month:tempDate.month()};
        }

        // the current/initial value of the cell (before editing)
        const value = ref(initValue);
        const datepicker = ref(null);
      
        /* Component Editor Lifecycle methods */
        // the final value to send to the grid, on completion of editing
        const getValue = () => {
            // this simple editor doubles any value entered into the input
            if(!_.isEmpty(value.value)){
                let tempDate = dayjs();
                tempDate = tempDate.year(value.value.year);
                tempDate = tempDate.month(value.value.month);
                return tempDate.format('YYYYMM');
            }else{
                return null;
            }
        };

        // Gets called once before editing starts, to give editor a chance to
        // cancel the editing before it even starts.
        const isCancelBeforeStart = () => {
            return false;
        };

        // Gets called once when editing is finished (eg if Enter is pressed).
        // If you return true, then the result of the edit will be ignored.
        const isCancelAfterEnd = () => {
        //     // our editor will reject any value greater than 1000
            return false;
        };

        const onClosed = () => {
            props.params.stopEditing();
        }

        return {
            value,
            datepicker,
            dayjs,
            getValue,
            isCancelBeforeStart,
            isCancelAfterEnd,
            onClosed,
        }
    },
    mounted() {
        // focus on the input field once editing starts
        //nextTick(() => this.$refs.input.focus());
        nextTick(() => {
            this.$refs.datepicker.$el.focus();
            this.$refs.datepicker.openMenu();
        });
    }
}
</script>

<template>
    <DatePicker 
        locale="ko"
        ref="datepicker" 
        v-model="value" 
        :format="'yyyyMM'" 
        position="left" 
        @closed="onClosed"
        placeholder="년월선택"
        hide-input-icon 
        auto-apply
        month-picker
        arrow-navigation
        />
</template>