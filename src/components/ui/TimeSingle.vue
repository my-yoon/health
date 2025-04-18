<template>
    <div class="item">
        <span class="input">
            <span class="dv">
                <select v-model="state.hour" :disabled="state.disabled" class="custom-select time"
                    @change="onSelectDateTime('time', state.hour, 'hour')">
                    <option v-for="(item, index) in state.hourList" :key="index" :disabled="item.disabled"
                        :value="item.value">
                        {{ item.value }}시
                    </option>
                </select>
                <select v-model="state.minutes" :disabled="state.disabled" class="custom-select time ml-10"
                    @change="onSelectDateTime('time', state.minutes, 'minutes')">
                    <option v-for="(item, index) in state.minutesList" :key="index" :disabled="item.disabled"
                        :value="item.value">
                        {{ item.value }}분
                    </option>
                </select>
            </span>
        </span>
    </div>
</template>`
<script>
import { getCurrentInstance, inject, reactive, ref, onMounted, computed, toRef, watch } from 'vue';
import { ko } from 'date-fns/locale';

/**
 * 기본 사용법 - v-model 로 바인딩하면 get/set 처리됨
 * emit
 *   datePickerOpen - datepicker Open시 호출
 * 기타
 *   setDay - 초기설정날짜
 *   disabled - 비활성화여부
 *   setHourInterval - 시간 간격 (ex 2일때 02시, 04시....)
 *   setMinutesInterval - 분 간격 (ex 2일때 02분, 04분....)
 *   format - 날짜 양식
 */
export default {
    props: ['modelValue', 'setDay', 'disabled', 'setHourInterval', 'setMinutesInterval', 'format'],
    emits: ['update:modelValue', 'datePickerOpen'],
    setup(props) {
        const { emit } = getCurrentInstance();
        const locale = reactive(ko);
        const dayJS = inject('dayJS');
        const pickerData = ref({
            date: new Date()
        });

        const state = reactive({
            dateFormat: 'yyyy-MM-dd', // datepicker 포멧값
            dateTimeFormat: computed(() => props.format ?? 'YYYY-MM-DD HH:mm'), // dayJs 포멧
            setDay: props.setDay, // 초기 설정 날짜
            disabled: computed(() => props.disabled), // 비활성화
            hourInterval: computed(() => props.setHourInterval),  // 시간간격
            minutesInterval: computed(() => props.setMinutesInterval),  // 분간격
            hour: '00', // 시간
            minutes: '00', // 분
            hourList: [], // 시간 리스트
            minutesList: [], // 분 리스트
            watchToggle: true, // watch 컴포넌트 내부변경시 중복 호출 방지
            dateTime: toRef(props, 'modelValue') // 리턴 값
        });

        onMounted(() => {
            initDate();
            if (state.setDay) {
                setDateTime(state.setDay);
                onSelectDateTime();
            } else {
                setFromDate();
            }
        });

        // v-model 값 변경 감시
        watch(() => state.dateTime, (dateTime) => {
            if (state.watchToggle) {
                setDateTime(dateTime);
            }
            state.watchToggle = true;
        });

        //데이터 피커 초기값설정
        const initDate = () => {
            initHourList({ interval: state.hourInterval });
            initMinutesList({ interval: state.minutesInterval });
        };

        // 시간 데이터 셋
        const initTimeList = ({ endTime, interval, disabledStartTime }) => {
            let timeList = [];
            interval = parseInt(interval ?? 1);
            let startTime = disabledStartTime ?? 0;

            for (let h = startTime; h < endTime; h = h + interval) {
                timeList.push({ value: h < 10 ? '0' + h : '' + h });
            }
            return timeList;
        };

        //시간 초기화
        const initHourList = (option) => {
            option = Object.assign({ endTime: 24 }, option);
            state.hourList = [...initTimeList(option)];
            if (state.hourList[0].value === state.hour && !props.setDay) {
                state.hour = state.hourList[0].value;
            }
        };

        //분 초기화
        const initMinutesList = (option) => {
            option = Object.assign({ endTime: 60 }, option);
            state.minutesList = [...initTimeList(option)];
            if (state.minutesList[0].value !== 0 && !props.setDay) {
                state.minutes = state.minutesList[0].value;
            }
        };

        const onSelectDateTime = (type, value, statue) => {
            //
            console.log('');
            emit('onSelectDate', type, value, statue);
        };

        const setFromDate = (value) => {
            pickerData.value.date = dayJS(value).format('YYYY-MM-DD');
            onSelectDateTime();
        };

        // 날짜 set
        const setDateTime = (item) => {
            if (!!item) {
                const dateTime = dayJS(item);
                pickerData.value.date = dateTime.format('YYYY-MM-DD');
                state.hour = dateTime.get('hour') < 10 ? '0' + dateTime.get('hour') : '' + dateTime.get('hour');
                state.minutes = dateTime.get('minute') < 10 ? '0' + dateTime.get('minute') : '' + dateTime.get('minute');
            }
        };

        // 날짜 get
        const getDateTime = () => {
            return dayJS(pickerData.value.date).set('hour', state.hour).set('minute', state.minutes).format(state.dateTimeFormat);
        };

        const datePickerOpen = () => {
            emit('datePickerOpen');
        };

        return {
            state,
            pickerData,
            locale,
            setFromDate,
            initDate,
            onSelectDateTime,
            datePickerOpen
        };
    }
};
</script>