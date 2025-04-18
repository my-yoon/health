<template>
    <div class="item">

        <label>{{ state.dateTitle }}</label>
        <span class="input">
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
                        <span class="radio" @click="onSelfDate">
                            <input id="self" v-model="state.self" name="dategroup" type="radio" value="직접입력">
                            <label for="self">직접입력</label>
                        </span>
                    </div>
                </span>
            </template>
            <span class="dv">
                <div class="ui-datepicker-range">
                    <div class="ui-datepicker">
                        <DatePicker :disabled="state.pickerStatus" :enable-time-picker="false" :format="state.dateFormat"
                            :model-value="pickerData.date.from" locale="ko" @update:model-value="setFromDate" />
                    </div>
                    <span class="ui-coupler">~</span>
                    <div class="ui-datepicker">
                        <DatePicker :disabled="state.pickerStatus" :enable-time-picker="false" :format="state.dateFormat"
                            :model-value="pickerData.date.to" locale="ko" @update:model-value="setToDate" />
                    </div>
                </div>
            </span>
        </span>
    </div>
</template>
<script>
import { getCurrentInstance, inject, reactive, ref, onMounted, computed, watchEffect } from 'vue';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';

export default {
    props: ['dateTitle', 'selectOptions', 'pickerOnly', 'setDay', 'disabled', 'initData', 'setOptionsType', 'nextTime'],
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
                { label: '1개월', value: '1month' },
                { label: '일주일', value: 'week' },
                { label: '당일', value: 'today' }
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
            nextTime: computed(() => props.nextTime)
        });
        onMounted(() => {
            initDate();
            if (state.disabled) {
                state.disabled ? state.pickerStatus = true : state.pickerStatus = false;
            }

            /**
             * @type-2 { 1년, 6개월, 1개월 }
             * 일주일/당일 옵션 없음
             */
            if (props.setOptionsType === 'type-2') {
                state.selectDayValue = [
                    { label: '1년', value: 'year' },
                    { label: '6개월', value: '6month' },
                    { label: '1개월', value: '1month' }
                ];
            }
            console.log(props.setOptionsType);
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
                console.log(state.setDay);
                //피커+버튼
                state.pickerStatus = true;
                state.dayType = props.setDay;
                state.self = '';
                state.dayStatus = !!props.selectOptions ? props.selectOptions[0].value : null;
                onChangeDate(state.dayType);
                onChageSelect();
            }
        };

        const setFromDate = (value) => {
            pickerData.value.date.from = dayJS(value).format('YYYY-MM-DD');
            if (state.self === '직접입력' || state.pickerOnly) {
                console.log(11);
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
            console.log(state.nextTime);
            if (!state.nextTime) {
                if (type === 'today') {
                    setFromDate(start.getTime());
                } else if (type === 'week') {
                    setFromDate((start.getTime() - 3600 * 1000 * 24 * 7));

                } else if (type === 'month') {
                    setFromDate(start.getTime() - 3600 * 1000 * 24 * 30);
                } else if (type === '1month') {
                    setFromDate(start.getTime() - 3600 * 1000 * 24 * 30);
                } else if (type === '3month') {
                    setFromDate(start.getTime() - 3600 * 1000 * 24 * 90);
                } else if (type === '6month') {
                    setFromDate(start.getTime() - 3600 * 1000 * 24 * 180);
                } else if (type === 'year') {
                    setFromDate(start.getTime() - 3600 * 1000 * 24 * 365);
                }
                setToDate(end);
            } else {
                setFromDate(start.getTime());
                if (type === 'today') {
                    setToDate(start.getTime());
                } else if (type === 'week') {
                    setToDate((start.getTime() + 3600 * 1000 * 24 * 7));
                } else if (type === 'month') {
                    setToDate(start.getTime() + 3600 * 1000 * 24 * 30);
                } else if (type === '1month') {
                    setToDate(start.getTime() + 3600 * 1000 * 24 * 30);
                } else if (type === '3month') {
                    setToDate(start.getTime() + 3600 * 1000 * 24 * 90);
                } else if (type === '6month') {
                    setToDate(start.getTime() + 3600 * 1000 * 24 * 180);
                } else if (type === 'year') {
                    setToDate(start.getTime() - 3600 * 1000 * 24 * 365);
                }
            }
            state.dateValue = [dayJS(pickerData.value.date.from).format('YYYY-MM-DD'), dayJS(pickerData.value.date.to).format('YYYY-MM-DD')];
            // console.log(type);
            emit('onSelectDate', 'day', state.dateValue, state.dayStatus);
        };
        const onSelfDate = () => {
            state.pickerStatus = false;
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
            setToDate,
            onChangeDate,
            onChageSelect,
            onSelfDate,
            initDate
        };
    }
};
</script>