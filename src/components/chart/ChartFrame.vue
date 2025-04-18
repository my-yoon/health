<template>
    <div class="chartWrap">
        <Bar :data="state.data" :options="state.options" />
    </div>
</template>
<script>
/** chart */
import {
    Chart as ChartJS,
    Title,
    Tooltip,
    Legend,
    BarElement,
    CategoryScale,
    LinearScale
} from 'chart.js';
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);
import { Bubble, Bar } from 'vue-chartjs';
import { reactive} from 'vue';
export default {
    components: { Bar },
    setup() {
        const state = reactive({
            data: {
                labels: [
                    'January',
                    'February',
                    'March',
                    'April',
                    'May',
                    'June',
                    'July',
                    'August',
                    'September',
                    'October',
                    'November',
                    'December'
                ],
                datasets: [
                    {
                        label: 'Data One',
                        backgroundColor: '#f87979',
                        data: [40, 20, 12, 39, 10, 40, 39, 80, 40, 20, 12, 11]
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false
            }
            
            
        });
        return {
            state
        };
    }
};
</script>