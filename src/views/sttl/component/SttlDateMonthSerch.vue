<template>
    <div class="item">

        <label>{{ state.dateTitle }}<span class="ess" v-if="state.ess"><span class="offscreen">필수입력</span></span></label>
        <span class="input">
            
            <span class="dv">
                <div class="ui-datepicker-range">
                    <div class="ui-datepicker">
                        <DatePicker :enable-time-picker="false" :format="state.dateFormat" month-picker
                            :model-value="pickerData.date.from" locale="ko" autoApply @update:model-value="setFromDateD" />
                    </div>
                    <span class="ui-coupler">~</span>
                    <div class="ui-datepicker">
                        <DatePicker :enable-time-picker="false" :format="state.dateFormat" month-picker
                            :model-value="pickerData.date.to" locale="ko" autoApply @update:model-value="setToDateD" />
                    </div>
                </div>
            </span>
            <template v-if="!state.pickerOnly">
                <span v-if="!!state.selectDayTypeValue" class="dv">
                    <select v-model="state.dayStatus" class="custom-select sm" @change="onChageSelect($event)">
                        <option v-for="(item, index) in state.selectDayTypeValue" :key="index" :value="item.value">
                            {{ item.label }}
                        </option>
                    </select>
                </span>
                <span class="dv">
                    <div class="radio-group btn-group">
                        <template v-for="(item, index) in state.selectDayValue" :key="index">
                            <span class="radio" @change="onChangeDate(item.value)">
                                <input :id="'dateType' + index" v-model="state.dayType" :value="item.value" name="dategroup"
                                    type="radio">
                                <label :for="'dateType' + index">{{ item.label }}</label>
                            </span>
                        </template>
                    </div>
                </span>
            </template>
        </span>
    </div>
</template>
<script>
import { getCurrentInstance, inject, reactive, ref, onMounted, computed, watchEffect } from 'vue';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';

export default {
    props: ['dateTitle', 'selectOptions', 'pickerOnly', 'setDay', 'disabled', 'initData', 'ess'],
    emits: ['changedPage', 'onSelectDate'],
    setup(props) {
        const { emit } = getCurrentInstance();
        const locale = reactive(ko);
        const dayJS = inject('dayJS');
        const pickerData = ref({
            date: {
                from: {
                    month: new Date().getMonth(),
                    year: new Date().getFullYear()
                },
                to: {
                    month: new Date().getMonth(),
                    year: new Date().getFullYear()
                }
            }
        });

        const state = reactive({
            dateFormat: 'yyyy-MM',
            //버튼 기간 옵션
            selectDayValue: [
                { label: '1년', value: 'year' },
                { label: '6개월', value: '6month' },
                { label: '1개월', value: '1month' }
            ],
            selectDayTypeValue: computed(() => props.selectOptions),
            dateTitle: computed(() => props.dateTitle),
            pickerOnly: computed(() => props.pickerOnly),
            setDay: computed(() => props.setDay),
            initData: computed(() => props.initData),
            daterange: false,
            dateValue: null,
            dayStatus: props.selectOptions ? props.selectOptions[0].value : null,
            disabled: computed(() => props.disabled),
            dayType: '',
            ess: computed(() => props.ess ? true : false)
        });
        onMounted(() => {
            initDate();
        });

        //데이터 피커 초기값설정
        const initDate = () => {
            state.dayType = props.setDay;
            onChangeDate(state.dayType);
        };

        const setFromDateD = (value) => {
            pickerData.value.date.from = value;
            emit('onSelectDate', 'self_start', pickerData.value.date.from.year + '' + (Number(pickerData.value.date.from.month) + 1).toString().padStart(2, '0'));
        };

        const setToDateD = (value) => {
            pickerData.value.date.to = value;
            emit('onSelectDate', 'self_end', pickerData.value.date.to.year + '' + (Number(pickerData.value.date.to.month) + 1).toString().padStart(2, '0'));
        };

        const setFromDate = (value) => {
            const [year, month] = dayJS(value).format('YYYY-MM').split('-');
            pickerData.value.date.from = {
                year,
                month: month - 1
            };
            emit('onSelectDate', 'self_start', pickerData.value.date.from.year + '' + (Number(pickerData.value.date.from.month) + 1).toString().padStart(2, '0'));
        };
        const setToDate = (value) => {
            const [year, month] = dayJS(value).format('YYYY-MM').split('-');
            pickerData.value.date.to = {
                year,
                month: month - 1
            };
            emit('onSelectDate', 'self_end', pickerData.value.date.to.year + '' + (Number(pickerData.value.date.to.month) + 1).toString().padStart(2, '0'));
        };

        const onChangeDate = (type) => {
            state.self = '';
            const end = new Date();
            const start = new Date();
            if (type === '1month') {
                setFromDate(dayJS(start).add(-1, 'M'));
            } else if (type === '6month') {
                setFromDate(dayJS(start).add(-6, 'M'));
            } else if (type === 'year') {
                setFromDate(dayJS(start).add(-1, 'y'));
            }
            setToDate(dayJS(end).add(-1, 'M'));
        };

        const onChageSelect = (e) => {
            emit('onSelectDate', 'select', '', state.dayStatus);
        };
        return {
            state,
            pickerData,
            locale,
            format,
            setFromDate,
            setFromDateD,
            setToDate,
            setToDateD,
            onChangeDate,
            onChageSelect,
            initDate
        };
    }
};
</script>