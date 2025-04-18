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
                            <th scope="row">답변<span class="ess"><span class="offscreen">필수입력</span></span></th>
                            <td>
                                <div class="tbl-wrap">
                                    <table class="table reg">
                                        <colgroup>
                                            <col style="width: 60px;">
                                            <col style="width: auto;">
                                        </colgroup>
                                        <thead>
                                            <tr>
                                                <th scope="col" class="chk">정답</th>
                                                <th scope="col">답변
                                                    <span class="ess"><span class="offscreen">필수입력</span></span>
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr v-for="(item, index) in state.eventQuizList" :key="index">
                                                <td>
                                                    <span class="radio">
                                                        <input :id="'correctRdo' + index" name="correctRdoGroup"
                                                            type="radio" :value="index" v-model="state.quizAns"
                                                            @change="onChangeValue('eventAnswer', state.quizAns)">
                                                        <label :for="'correctRdo' + index"></label>
                                                    </span>
                                                </td>
                                                <td>
                                                    <div class="reg-group wp-100">
                                                        <div class="reg-item">
                                                            <input type="text" class="form-control" v-model="item.answer"
                                                                @change="onChangeValue('eventQuiz' + (index + 1), item.answer)">
                                                        </div>
                                                    </div>
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </td>
                            <th scope="row">힌트 이벤트<span class="ess"><span class="offscreen">필수입력</span></span></th>
                            <td>
                                <div class="reg-group flex-column" v-for="(item, index) in state.eventHintList"
                                    :key="index">
                                    <div class="reg-item">
                                        <span class="radio">
                                            <input :id="'hintRdo' + index" name="hintRdoGroup" type="radio"
                                                :value="item.value" v-model="state.quizHint"
                                                @change="onChangeValue('eventHintType', state.quizHint)">
                                            <label :for="'hintRdo' + index">{{ item.label }}</label>
                                        </span>
                                    </div>
                                    <div class="reg-item wp-100">
                                        <template v-if="item.value === 'LINK'">
                                            <input type="text" class="form-control"
                                                placeholder="http 또는 https 를 포함한 URL을 입력하십시오" v-model="state.hintLink"
                                                @change="onChangeValue('eventHintLink', state.hintLink)"
                                                :disabled="state.quizHint === 'TEXT'">
                                        </template>
                                        <template v-else>
                                            <textarea id="textarea" class="form-control" placeholder="Enter를 사용할 수 있습니다."
                                                style="height: 80px;" v-model="state.hintText"
                                                @change="onChangeValue('eventHintTxt', state.hintText)"
                                                :disabled="state.quizHint === 'LINK'"></textarea>
                                        </template>
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
import { getCurrentInstance, computed, reactive, inject, ref, onMounted, watch } from 'vue';
import { useRouter, useRoute } from 'vue-router';
export default {
    props: ['formData'],
    emits: ['formDataChange'],
    setup(props) {
        const { emit } = getCurrentInstance();
        const route = useRoute();
        const state = reactive({
            formData: computed(() => props.formData),
            eventbtns: [
                { label: '선택', value: '' },
                { label: '외부링크', value: '링크' },
                { label: '비노출', value: '비노출' }
            ],
            eventbtntype1: [
                { label: '선택', value: '' },
                { label: '외부링크', value: '링크' },
                { label: '이벤트참여', value: '참여' }
            ],
            eventQuizList: [
                { answer: '' },
                { answer: '' },
                { answer: '' },
                { answer: '' }
            ],
            eventHintList: [
                { label: '외부링크', value: 'LINK' },
                { label: '텍스트', value: 'TEXT' }
            ],
            quizAns: '',
            quizHint: 'LINK',
            hintLink: '',
            hintText: '',
            initEventType: _.clone(props.formData.eventBnefType)
        });
        watch(props.formData, () => {
            if (route.query.eventSn && (state.formData.eventBnefType === state.initEventType)) {
                initDataSet();
            } else {
                initDataSet();
            }

        });
        onMounted(() => {
            if (route.query.eventSn) {
                initDataSet();
                console.log(state.quizHint);
            }
        });
        const initDataSet = () => {
            state.quizAns = (state.formData.eventAnswer - 1);
            state.quizHint = state.formData.eventHintType;
            state.hintLink = state.formData.eventHintLink;
            state.hintText = state.formData.eventHintTxt;
            state.eventQuizList.map((item, index) => {
                item.answer = state.formData['eventQuiz' + (index + 1)];
            });
        };
        const onChangeValue = (caseType, value) => {
            console.log(caseType, value);
            if (value === 'LINK') {
                state.hintText = '';
            }
            if (value === 'TEXT') { state.hintLink = ''; }
            emit('formDataChange', caseType, value);
        };
        return {
            state,
            onChangeValue
        };
    }
};
</script>