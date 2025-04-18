<template>
    <div class="ui-section">
        <subTitleBar :subTitle="'기능설정'" :ess="'표시는 필수항목입니다.'" />
        <div class="ui-content">
            <div class="tbl-wrap mt-10">
                <table class="table reg">
                    <colgroup>
                        <col style="width: 160px;">
                        <col style="width: auto;">
                        <col style="width: 160px;">
                        <col style="width: auto;">
                    </colgroup>
                    <tbody>
                        <tr>
                            <th scope="row">날짜<span class="ess"><span class="offscreen">필수입력</span></span></th>
                            <td colspan="3">
                                <div class="reg-item">
                                    <span class="radio" v-for="(item, index) in state.eventDaylist" :key="index">
                                        <input :id="'eventDay' + index" name="eventDayGroup" type="radio"
                                            :value="item.value" v-model="state.eventDay"
                                            @change="onChangeValue('eventDay', state.eventDay)">
                                        <label :for="'eventDay' + index">{{ item.label }}</label>
                                    </span>
                                </div>
                            </td>
                        </tr>
                        <tr>
                            <th scope="row">기본지급 포인트<span class="ess"><span class="offscreen">필수입력</span></span></th>
                            <td>
                                <div class="reg-item w-200">
                                    <span class="dv">
                                        <!-- @change="onChangeValue('eventBasicPoint', state.eventBasicPoint) " -->

                                        <input type="text" class="form-control" v-model="state.eventBasicPoint"
                                            @focus="onChangeValue('eventBasicPoint', 'state.eventBasicPoint')">
                                    </span>
                                    <span class="unit">P</span>
                                </div>
                                <slot name="pointError" :validState="state.validState"></slot>
                            </td>
                            <th scope="row">개근 혜택</th>
                            <td>
                                <div class="reg-item w-200">
                                    <span class="checkbox">
                                        <input type="checkbox" v-model="state.eventGaegnYn"
                                            @change="onChangeValue('eventGaegnYn', state.eventGaegnYn)" />
                                    </span>
                                    <span class="dv">
                                        <input type="text" class="form-control w-200" v-model="state.eventGaegnPoint"
                                            @focus="onChangeValue('eventGaegnPoint', state.eventGaegnPoint)">

                                    </span>
                                    <span class="unit">P</span>
                                </div>
                                <slot name="pointError1"></slot>
                            </td>
                        </tr>
                        <tr>
                            <th scope="row">누적 혜택</th>
                            <td colspan="3">
                                <slot name="btns"></slot>
                                <div class="tbl-wrap mt-10">
                                    <table class="table reg" v-if="state.slotsNum > 0">
                                        <colgroup>
                                            <col style="width: 45px;">
                                            <col style="width: 140px;">
                                            <col style="width: 140px;">
                                            <col style="width: auto;">
                                            <col style="width: auto;">
                                        </colgroup>
                                        <thead>
                                            <tr>
                                                <th scope="col" class="chk">
                                                    <span class="checkbox">
                                                        <input id="accChkAll" name="accChkGroup" type="checkbox">
                                                        <label for="accChkAll"></label>
                                                    </span>
                                                </th>
                                                <th scope="col">
                                                    회차<span class="ess"><span class="offscreen">필수입력</span></span>
                                                </th>
                                                <th scope="col">
                                                    지급 포인트<span class="ess"><span class="offscreen">필수입력</span></span>
                                                </th>
                                                <th scope="col">
                                                    기본 이미지 (60*60, 120*120, 180*180px)
                                                    <span class="ess"><span class="offscreen">필수입력</span></span>
                                                </th>
                                                <th scope="col">
                                                    지급 이미지 (60*60, 120*120, 180*180px)
                                                    <span class="ess"><span class="offscreen">필수입력</span></span>
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <slot name="benefit" :formData="formData"></slot>
                                        </tbody>
                                    </table>
                                </div>
                                <slot name="benefitError"></slot>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
</template>
<script>
import { getCurrentInstance, computed, reactive, inject, ref, onMounted, onUpdated, watch } from 'vue';
import { useRouter, useRoute } from 'vue-router';
export default {
    props: ['formData', 'eventBasicPoint', 'eventGaegnPoint', 'slotsNum'],
    emits: ['formDataChange', 'chiocePoint'],
    setup(props, { slots }) {
        const { emit } = getCurrentInstance();
        const route = useRoute();
        const state = reactive({
            formData: computed(() => props.formData),
            slotsNum: computed(() => props.slotsNum),
            eventDaylist: [
                { label: '28', value: 28, disabled: false },
                { label: '29', value: 29, disabled: false },
                { label: '30', value: 30, disabled: false },
                { label: '31', value: 31, disabled: false }
            ],
            eventpzwnPay: [
                { label: '리워드 포인트', value: '포인트', disabled: false },
                { label: 'B2B몰 상품', value: '상품', disabled: true }
            ],
            roulette: [
                { label: '4', value: 4 },
                { label: '5', value: 5 },
                { label: '6', value: 6 }
            ],
            eventDay: 28,
            eventBasicPoint: computed(() => props.eventBasicPoint),
            eventGaegnYn: 'Y',
            eventGaegnPoint: computed(() => props.eventGaegnPoint),
            validState: ''
        });
        onMounted(() => {
            if (route.query.eventSn) {
                console.log(state.formData);
                state.eventDay = state.formData.eventDay;
                state.eventGaegnYn = state.formData.eventGaegnYn;
            }
        });
        const onChangeValue = (caseType, value) => {
            emit('formDataChange', caseType, value);
            if (caseType === 'eventGaegnPoint' || caseType === 'eventBasicPoint') {
                emit('chiocePoint', 'open', caseType, value);
            }
        };
        const hasSlot = slots.benefit.length;
        return {
            state,
            onChangeValue,
            hasSlot
        };
    }
};
</script>