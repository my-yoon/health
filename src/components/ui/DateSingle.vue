<template>
    <div class="item">
        <span class="input">
            <span class="dv">
                <div class="ui-datepicker-range">
                    <div class="ui-datepicker">
                        <DatePicker :model-value="pickerData.date" @update:model-value="setFromDate"
                            :format="state.dateFormat" :enable-time-picker="false" locale="ko" :disabled="state.disabled"
                            :disabled-dates="checkDisabledDates"
                        />
                    </div>
                </div>
            </span>

        </span>
        <slot name="time"></slot>
    </div>
</template>
<script>
import { getCurrentInstance, inject, reactive, ref, onMounted, computed, watch } from 'vue';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';
export default {
    props: ['setDay', 'disabled', 'disabledDates'],
    emits: ['changedPage', 'onSelectDate'],
    setup(props) {
        const { emit } = getCurrentInstance();
        const locale = reactive(ko);
        const dayJS = inject('dayJS');

        const state = reactive({
            dateFormat: 'yyyy-MM-dd',
            setDay: computed(() => props.setDay),
            initData: computed(() => props.initData),
            disabled: computed(() => props.disabled),
            daterange: false,
            dateValue: null,
            dayType: ''
        });
        const pickerData = ref({
            date: state.setDay
        });

        //데이터 피커 초기값설정
        const initDate = () => {
            // console.log(state.setDay);
            // console.log(dayJS(state.setDay).format('YYYY-MM-DD'));
            setFromDate(state.setDay);
        };

        const setFromDate = (value) => {
            pickerData.value.date = dayJS(value).format('YYYY-MM-DD');
            emit('onSelectDate', 'singleday', value);
        };

        const checkDisabledDates = (date) => {
            // console.log(props.disabledDates.min, date);
            let checkDisabled = false;
            if (props.disabledDates?.min) {
                if (dayJS(props.disabledDates.min) > dayJS(date)) checkDisabled = true;
            } else if (props.disabledDates?.max) {
                if (dayJS(props.disabledDates.min) < dayJS(date)) checkDisabled = true;
            }
            return checkDisabled;
        };

        watch(props, () => {
            // console.log(props.setDay);
            setFromDate(state.setDay);
        });

        onMounted(() => {
            initDate();
        });


        return {
            state,
            pickerData,
            dayJS,
            locale,
            format,
            setFromDate,
            initDate,
            checkDisabledDates
        };
    }
};
</script>