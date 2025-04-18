<template>
    <section class="temp-section">
        <div class="ui-tab-wrap">
            <div class="ui-tabs">
                <ul>
                    <li :class="payType==1?'active':''" @click="onTabClick(1)">
                        <button type="button" class="ui-tab-item"><span>커머스</span></button>
                    </li>
                    <li :class="payType==2?'active':''" @click="onTabClick(2)">
                        <button type="button" class="ui-tab-item"><span>카드</span></button>
                    </li>
                    <li :class="payType==3?'active':''" @click="onTabClick(3)">
                        <button type="button" class="ui-tab-item"><span>디지털화폐</span></button>
                    </li>
                </ul>
            </div>
            <div class="ui-panels">
                <div class="ui-panel-item">
                    <KeepAlive>
                        <component :is="activeComponent"/>
                    </KeepAlive>
                </div>
            </div>
        </div>
    </section>
</template>
<style>
</style>
<script setup>
import { onMounted, ref, shallowRef  } from 'vue';
import SttlMonthlyCountingCommerce from './SttlMonthlyCountingCommerce.vue';
import SttlMonthlyCountingCard from './SttlMonthlyCountingCard.vue';
import SttlMonthlyCountingDigital from './SttlMonthlyCountingDigital.vue';


const payType = ref(1);

const activeComponent = shallowRef(null);

const onTabClick = (param) => {
    payType.value = param;
    if (payType.value == 1) {
        activeComponent.value = SttlMonthlyCountingCommerce;
    } else if (payType.value == 2) {
        activeComponent.value = SttlMonthlyCountingCard;
    } else {
        activeComponent.value = SttlMonthlyCountingDigital;
    }
};

onMounted(() => {
    onTabClick(1);
});
</script>
