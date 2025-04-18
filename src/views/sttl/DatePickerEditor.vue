<script>
import { ref, nextTick, inject } from 'vue';
// import dayjs from 'dayJS';
// import VueDatePicker from '@vuepic/vue-datepicker';
// import '@vuepic/vue-datepicker/dist/main.css'
export default {
    // components:{
    //     VueDatePicker
    // },
    setup(props) {
        // the current/initial value of the cell (before editing)
        const dayjs = inject('dayJS');
        const value = ref(dayjs(props.params.value, 'YYYYMMDDHHmmss'));
        const datepicker = ref(null);

        /* Component Editor Lifecycle methods */
        // the final value to send to the grid, on completion of editing
        const getValue = () => {
            // this simple editor doubles any value entered into the input
            return dayjs(value.value).format('YYYYMMDDHHmmss');
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
        };

        return {
            value,
            datepicker,
            dayjs,
            getValue,
            isCancelBeforeStart,
            isCancelAfterEnd,
            onClosed
        };
    },
    mounted() {
        // focus on the input field once editing starts
        //nextTick(() => this.$refs.input.focus());
        nextTick(() => {
            this.$refs.datepicker.$el.focus();
            this.$refs.datepicker.openMenu();
        });
    }
};
</script>

<template>
    <DatePicker locale="ko" cancelText="취소" selectText="선택" ref="datepicker" v-model="value" :format="'yyyy-MM-dd HH:mm:ss'"
        :teleport="true" :clearable="false" hide-input-icon enable-seconds position="left" @closed="onClosed"></DatePicker>
</template>