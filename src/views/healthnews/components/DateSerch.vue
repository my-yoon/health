<template>
    <div class="item">
        <label>{{ state.dateTitle }}</label>
        <span class="input">
            <template v-if="!state.isPickerOnly">
                <span class="dv">
                    <div class="radio-group btn-group">
                        <template v-for="(item, index) in selectDayValue" :key="index">
                            <span class="radio" @change="onChangeDate(item.value)">
                                <input :id="'dateType' + index" name="dategroup" type="radio" :value="item.value" v-model="state.dayType" />
                                <label :for="'dateType' + index">{{ item.label }}</label>
                            </span>
                        </template>
                    </div>
                </span>
            </template>
            <span class="dv">
                <div class="ui-datepicker-range">
                    <div class="ui-datepicker">
                        <DatePicker v-model="state.fromDate" @update:model-value="(e) => onUpdateDate('fromDate', e)"
                            :format="'yyyy-MM-dd'" :enable-time-picker="false" locale="ko"
                            :disabled="!state.isSelf" />
                    </div>
                    <span class="ui-coupler">~</span>
                    <div class="ui-datepicker">
                        <DatePicker v-model="state.toDate" @update:model-value="(e) => onUpdateDate('toDate', e)"
                            :format="'yyyy-MM-dd'" :enable-time-picker="false" locale="ko"
                            :disabled="!state.isSelf" />
                    </div>
                </div>
            </span>
        </span>
    </div>
</template>
<script>
import { getCurrentInstance, inject, reactive, onMounted, computed } from 'vue';
export default {
    props: ['dateTitle', 'isPickerOnly', 'setDay'],
    emits: ['onChangeDate'],
    setup(props) {
        const { emit } = getCurrentInstance();
        const dayJS = inject('dayJS');
        const selectDayValue = [
            { label: '1년', value: 'year', day: 365 },
            { label: '6개월', value: '6month', day: 180 },
            { label: '1개월', value: '1month', day: 30 },
            { label: '일주일', value: 'week', day: 7 },
            { label: '당일', value: 'today', day: 1 },
            { label: '직접입력', value: 'self', day: 1 }
        ];

        const state = reactive({
            fromDate: new Date(),
            toDate: new Date(),
            isSelf: true,
            dayType: '',
            beforeDayType: '',
            dateTitle: computed(() => props.dateTitle),
            isPickerOnly: computed(() => props.isPickerOnly),
            setDay: computed(() => props.setDay)
        });

        const dateFormatterAndSetting = (target, value) => state[target] = dayJS(value).format('YYYY-MM-DD');

        const onChangeDate = (type = state.setDay) => {
            const now = new Date();
            state.isSelf = type === 'self';
            state.dayType = type;

            if (!state.isSelf) state.beforeDayType = type;

            const dayType = state.isSelf ? state.beforeDayType : state.dayType;
            const targetDayValue = selectDayValue.find(item => item.value === dayType).day;

            emit('onChangeDate', type, {
                from: dateFormatterAndSetting('fromDate', now.getTime() - 3600 * 24000 * targetDayValue),
                to: dateFormatterAndSetting('toDate', now)
            });
        };

        const onUpdateDate = (target, value) => {
            emit('onChangeDate', 'self', {
                from: target === 'fromDate' ? dateFormatterAndSetting(target, value) : null,
                to: target === 'toDate' ? dateFormatterAndSetting(target, value) : null
            });
        };

        const updateDate = (data) => {
            state.dayType = data.dayType;
            state.isSelf = state.dayType === 'self';
            state.fromDate = data.fromDate;
            state.toDate = data.toDate;
            if (!state.isSelf) onChangeDate(state.dayType);
            
        };

        onMounted(() => {
            onChangeDate();
        });

        return {
            state,
            selectDayValue,
            onChangeDate,
            onUpdateDate,
            updateDate
        };
    }
};
</script>