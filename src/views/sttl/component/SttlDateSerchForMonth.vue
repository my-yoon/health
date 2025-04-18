<template>
    <div class="item">

        <label>{{ state.dateTitle }}<span class="ess" v-if="state.ess"><span class="offscreen">필수입력</span></span></label>
        <span class="input">
            
            <span class="dv">
                <div class="ui-datepicker-range">
                    <div class="ui-datepicker">
                        <DatePicker :enable-time-picker="false" :format="state.dateFormat"
                            :model-value="pickerData.date.from" locale="ko" text-input :text-input-options="{format:'yyyyMMdd'}" autoApply @update:model-value="setFromDateD" />
                    </div>
                    <span class="ui-coupler">~</span>
                    <div class="ui-datepicker">
                        <DatePicker :enable-time-picker="false" :format="state.dateFormat"
                            :model-value="pickerData.date.to" locale="ko" text-input :text-input-options="{format:'yyyyMMdd'}" autoApply @update:model-value="setToDateD" />
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
                from: new Date(),
                to: new Date()
            }
        });

        const state = reactive({
            dateFormat: 'yyyy-MM-dd',
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
            pickerStatus: true,
            disabled: computed(() => props.disabled),
            dayType: '',
            ess: computed(() => props.ess ? true : false)
        });
        onMounted(() => {
            initDate();
            if (state.disabled) {
                state.disabled ? state.pickerStatus = true : state.pickerStatus = false;
            }
        });
        //피커 활성화 처리
        watchEffect(() => {
            state.disabled ? state.pickerStatus = true : state.pickerStatus = false;
        });

        //데이터 피커 초기값설정
        const initDate = () => {
            //피커만 사용시
            if (state.pickerOnly) {
                state.pickerStatus = false;
                pickerData.value.date.from = state.setDay.from;
                pickerData.value.date.to = state.setDay.to;
                setFromDate(pickerData.value.date.from);
                setToDate(pickerData.value.date.to);
            } else {
                //피커+버튼
                state.pickerStatus = true;
                state.dayType = props.setDay;
                state.self = '';
                state.dayStatus = !!props.selectOptions ? props.selectOptions[0].value : null;
                onChangeDate(state.dayType);
            }
        };

        const setFromDateD = (value) => {
            console.log(state.dayType, value, _.isDate(value));
            if (_.isDate(value)) {
                pickerData.value.date.from = dayJS(value).format('YYYY-MM-DD');
            } else {
                let returnValue = null;
                switch (state.dayType) {
                    case 'year':
                        returnValue = dayJS().add(-1, 'y').date(1);
                        break;
                    case '6month':
                        returnValue = dayJS().add(-6, 'M').date(1);
                        break;
                    case '1month':
                    default:
                        returnValue = dayJS().add(-1, 'M').date(1);
                        break;
                }
                pickerData.value.date.from = returnValue.format('YYYY-MM-DD');
            }
            emit('onSelectDate', 'self_start', pickerData.value.date.from, state.dayStatus);
        };

        const setToDateD = (value) => {
            if (_.isDate(value)) {
                pickerData.value.date.to = dayJS(value).format('YYYY-MM-DD');
            } else {
                pickerData.value.date.to = dayJS().format('YYYY-MM-DD');
            }
            
            emit('onSelectDate', 'self_end', pickerData.value.date.to, state.dayStatus);
        };

        const setFromDate = (value) => {
            pickerData.value.date.from = dayJS(value).format('YYYY-MM-DD');
            if (state.self === '직접입력' || state.pickerOnly) {
                emit('onSelectDate', 'self_start', pickerData.value.date.from, state.dayStatus);
            }
            //
        };
        const setToDate = (value) => {
            pickerData.value.date.to = dayJS(value).format('YYYY-MM-DD');
            if (state.self === '직접입력' || state.pickerOnly) {
                emit('onSelectDate', 'self_end', pickerData.value.date.to, state.dayStatus);
            }
        };

        const onChangeDate = (type) => {
            state.self = '';
            state.pickerStatus = true;
            const end = new Date();
            const start = new Date();
            if (type === '1month') {
                setFromDate(dayJS(start).add(-1, 'M').date(1));
            } else if (type === '3month') {
                setFromDate(dayJS(start).add(-3, 'M').date(1));
            } else if (type === '6month') {
                setFromDate(dayJS(start).add(-6, 'M').date(1));
            } else if (type === 'year') {
                setFromDate(dayJS(start).add(-1, 'y').date(1));
            }
            setToDate((dayJS(end).add(0, 'M').date(0)));
            state.dateValue = [dayJS(pickerData.value.date.from).format('YYYY-MM-DD'), dayJS(pickerData.value.date.to).format('YYYY-MM-DD')];
            // console.log(type);
            emit('onSelectDate', 'day', state.dateValue, state.dayStatus);
        };
        const onSelfDate = () => {
            state.pickerStatus = false;
            console.log('state.self', state.self);
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
            onSelfDate,
            initDate
        };
    }
};
</script>