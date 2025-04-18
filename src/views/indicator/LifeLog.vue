<template>
    <div class="ui-tab-wrap mt-30">
        <div class="ui-tabs">
            <ul>
                <li v-for="(tab, index) in state.tablist.filter(item=>item.able)" :key="index"
                    :class="{ 'active': state.tabPannel === tab.value }">
                    <button class="ui-tab-item" type="button" @click="state.tabPannel = tab.value">
                            <span>
                                {{ tab.label }}
                            </span>
                    </button>
                </li>
            </ul>
        </div>
        <div class="ui-panels">
            <div class="ui-panel-item">
                <div class="ui-section">
                    <component :is="state.tabPannel"></component>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import {reactive} from 'vue';
import AverageStepCount from '@/views/indicator/AverageStepCount.vue';
import AverageSleepTime from '@/views/indicator/AverageSleepTime.vue';
import SmokingAmount from '@/views/indicator/SmokingAmount.vue';
import Drinking from '@/views/indicator/Drinking.vue';
import Feeling from '@/views/indicator/Feeling.vue';
import Exercise from '@/views/indicator/Exercise.vue';
import MealAmount from '@/views/indicator/MealAmount.vue';
import AverageBodyComposition from '@/views/indicator/AverageBodyComposition.vue';

export default {
    components: {
        AverageStepCount,
        AverageSleepTime,
        SmokingAmount,
        Drinking,
        Feeling,
        Exercise,
        MealAmount,
        AverageBodyComposition
    },
    setup() {
        const state = reactive({
            tablist: [
                {label: '평균걸음수', value: 'AverageStepCount', able: true},
                {label: '평균수면시간', value: 'AverageSleepTime', able: true},
                {label: '흡연', value: 'SmokingAmount', able: true},
                {label: '음주', value: 'Drinking', able: true},
                {label: '감정', value: 'Feeling', able: true},
                {label: '운동', value: 'Exercise', able: true},
                {label: '식사', value: 'MealAmount', able: true},
                {label: '평균체성분', value: 'AverageBodyComposition', able: true}
            ],
            tabPannel: 'AverageStepCount'
        });
        return {
            state
        };
    }
};
</script>