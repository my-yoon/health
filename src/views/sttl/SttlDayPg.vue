<template>
    <section class="temp-section">
        <div class="ui-tab-wrap">
            <div class="ui-tabs">
                <ul>
                    <li :class="isAprv == 1 ? 'active' : ''" @click="onTabClick(1)">
                        <button type="button" class="ui-tab-item"><span>PG승인대사</span></button>
                    </li>
                    <li :class="isAprv == 2 ? 'active' : ''" @click="onTabClick(2)">
                        <button type="button" class="ui-tab-item"><span>PG입금대사</span></button>
                    </li>
                </ul>
            </div>
            <div class="ui-panels">
                <div class="ui-panel-item">
                    <KeepAlive>
                        <component :is="activeComponent" />
                    </KeepAlive>
                </div>
            </div>
        </div>
    </section>
</template>
<style></style>
<script setup>
import { onMounted, ref, shallowRef } from 'vue';
import SttlDayPgAprv from './SttlDayPgAprv.vue';
import SttlDayPgDspt from './SttlDayPgDspt.vue';

const isAprv = ref(1);

const activeComponent = shallowRef(null);

const onTabClick = (param) => {
    isAprv.value = param;
    if (isAprv.value == 1) {
        activeComponent.value = SttlDayPgAprv;
    } else {
        activeComponent.value = SttlDayPgDspt;
    }
};

onMounted(() => {
    onTabClick(1);
});

</script>
