<template>
    <div class="ui-section">
        <subTitleBar :subTitle="'혜택설정'" :ess="'표시는 필수항목입니다.'" />
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
                            <th scope="row">선착순 설정<span class="ess"><span class="offscreen">필수입력</span></span></th>
                            <td>
                                <div class="reg-group">
                                    <div class="reg-item">
                                        <span class="radio" v-for="(option, index) in state.eventFrc" :key="index">
                                            <input :id="'use' + index" name="openRdo4" type="radio" :value="option.value"
                                                v-model="state.formData.eventFrcYn"
                                                @change="onChangeValue('eventFrcYn', state.formData.eventFrcYn)">
                                            <label :for="'use' + index">{{ option.label }}</label>
                                        </span>
                                    </div>
                                </div>
                            </td>
                            <th scope="row">선착순 인원설정<span class="ess"><span class="offscreen">필수입력</span></span></th>
                            <td>
                                <div class="reg-group">
                                    <div class="reg-item">
                                        <span class="dv">
                                            <input type="text" class="form-control"
                                                :disabled="state.formData.eventFrcYn === 'N'"
                                                v-model="state.formData.eventFrcCount"
                                                @change="onChangeValue('eventFrcCount', state.formData.eventFrcCount)">
                                        </span>
                                    </div>
                                </div>
                            </td>
                        </tr>
                        <!-- {{ state.eventBnefType }} -->
                        <tr v-if="state.formData.eventBnefType === 'IMMEDIATELY'">
                            <th scope="row">즉시지급 형태<span class="ess"><span class="offscreen">필수입력</span></span></th>
                            <td colspan="3">
                                <div class="reg-group">
                                    <div class="reg-item">
                                        <span class="dv">
                                            <!-- eventBnefType === 'IMMEDIATELY' 즉시지급일때 사용 -->
                                            <span class="checkbox">
                                                <input id="point" name="openRdo5" type="checkbox" v-model="state.point"
                                                    @change="onChangeValue('eventPointYN', state.point)"
                                                    :disabled="state.formData.eventBnefType === 'IMMEDIATELY'"><label
                                                    for="point">리워드
                                                    포인트</label>
                                            </span>
                                        </span>
                                        <span class="dv">
                                            <!-- @change="onChangeValue('eventPoint', state.formData.eventPoint)" -->
                                            <input type="text" class="form-control" v-model="state.pointValue"
                                                :disabled="!state.point" @focus="onChangePoint">
                                        </span>
                                    </div>
                                </div>
                            </td>

                        </tr>
                        <!-- 상품 등록 2차 -->
                        <slot name="pdtCon"></slot>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
</template>
<script>
import { getCurrentInstance, computed, reactive, inject, ref, onMounted, watch } from 'vue';
export default {
    props: ['formData', 'pointValue'],
    emits: ['formDataChange', 'chiocePoint'],
    setup(props) {
        const { emit } = getCurrentInstance();

        const state = reactive({
            formData: computed(() => props.formData),
            pointValue: computed(() => props.pointValue),
            eventFrc: [
                { label: '사용안함', value: 'N' },
                { label: '사용', value: 'Y' }
            ],
            point: true
        });
        const onChangeValue = (caseType, value) => {
            emit('formDataChange', caseType, value);
        };
        const onChangePoint = () => {
            emit('chiocePoint', 'open');
        };
        return {
            state,
            onChangeValue,
            onChangePoint
        };
    }
};
</script>