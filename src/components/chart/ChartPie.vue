<template>
    <div class="chartWrap">
        <Pie ref="chartRef" :data="state.data" :height="state.height" :options="state.options"/>
    </div>
</template>
<script>
/** chart */
import { Chart as ChartJS,
    Title,
    Tooltip,
    Legend,
    ArcElement,
    Colors
} from 'chart.js';

import { computed, reactive, ref } from 'vue';
import { Pie } from 'vue-chartjs';
import ChartJSPluginDatalabels from 'chartjs-plugin-datalabels';

ChartJS.register(ArcElement, Title, Tooltip, Legend, Colors, ChartJSPluginDatalabels);

export default {
    props: ['dataSets', 'labels', 'options', 'height'],
    components: { Pie },
    setup(props) {
        const defalutOption = reactive({});
        const chartRef = ref(null);
        const state = reactive({
            isShow: false,
            data: computed(() => {
                return {
                    labels: props.labels,
                    datasets: props.dataSets
                };
            }),
            options: computed(() => Object.assign(defalutOption, props.options)),
            height: computed(() => props.height ?? 300)
        });

        const chartResize = (obj) => {
            if (obj && state.height !== obj?.height) {
                chartRef.value.chart._resize(obj.width ?? chartRef.value.chart.width, obj.height ?? state.height);
            }
        };

        return {
            state,
            chartRef,
            chartResize
        };
    }
};
</script>