<template>
    <div class="ui-section" v-if="!(state.formData.pcpType === 'NONE') || !(state.eventBnefType === 'NONE')">
        <!-- {{ state.formData }} -->
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
                            <th scope="row">버튼 이벤트<span class="ess"><span class="offscreen">필수입력</span></span></th>
                            <td>
                                <select class="custom-select sm" v-model="state.formData.eventBtnType"
                                    @change="onChangeValue('eventBtnType', state.formData.eventBtnType)"
                                    v-if="state.formData.pcpType === 'NONE' && state.formData.eventBnefType === 'NONE'">
                                    <option v-for="(option, index) in state.eventbtns" :key="index" :value="option.value">
                                        {{ option.label }}
                                    </option>
                                </select>
                                <select class="custom-select sm" v-model="state.formData.eventBtnType"
                                    @change="onChangeValue('eventBtnType', state.formData.eventBtnType)"
                                    v-if="(state.formData.pcpType === 'ONCE' || state.formData.pcpType === 'LIMIT' || state.formData.pcpType === 'ONEDAY') &&
                                        (state.formData.eventBnefType === 'AFTER' || state.formData.eventBnefType === 'IMMEDIATELY')">
                                    <option v-for="(option, index) in state.eventbtntype1" :key="index"
                                        :value="option.value">
                                        {{ option.label }}
                                    </option>
                                </select>
                            </td>
                            <th scope="row">버튼명<span class="ess"><span class="offscreen">필수입력</span></span></th>
                            <td>
                                <div class="reg-group">
                                    <div class="reg-item">
                                        <input type="text" class="form-control" v-model="state.formData.eventBtnName"
                                            @change="onChangeValue('eventBtnName', state.formData.eventBtnName)"
                                            :disabled="!(state.formData.eventBtnType === 'JOIN' || state.formData.eventBtnType === 'LINK')">
                                    </div>
                                </div>
                            </td>
                        </tr>
                        <tr>
                            <th scope="row">외부링크<span class="ess"><span class="offscreen">필수입력</span></span></th>
                            <td colspan="3">
                                <div class="reg-group wp-100">
                                    <div class="reg-item">
                                        <input type="text" class="form-control" v-model="state.formData.eventBtnLink"
                                            @change="onChangeValue('eventBtnLink', state.formData.eventBtnLink)"
                                            :disabled="!(state.formData.eventBtnType === 'LINK')">
                                    </div>
                                </div>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
</template>
<script>
import { getCurrentInstance, computed, reactive, inject, ref, onMounted } from 'vue';
export default {
    props: ['formData'],
    emits: ['formDataChange'],
    setup(props) {
        const { emit } = getCurrentInstance();
        const state = reactive({
            formData: computed(() => props.formData),
            eventbtns: [
                { label: '선택', value: '' },
                { label: '외부링크', value: 'LINK' },
                { label: '비노출', value: 'DISABLE' }
            ],
            eventbtntype1: [
                { label: '선택', value: '' },
                { label: '외부링크', value: 'LINK' },
                { label: '이벤트참여', value: 'JOIN' }
            ]
        });
        const onChangeValue = (caseType, value) => {
            emit('formDataChange', caseType, value);
        };
        return {
            state,
            onChangeValue
        };
    }
};
</script>