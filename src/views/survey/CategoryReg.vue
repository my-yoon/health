<template>
    <section class="s1">
        <div class="ui-section">
            <div class="ui-content">
                <div class="ui-grid-top-guide t-right">
                    <span class="ess"></span> 표시는 필수항목입니다.
                </div>
                <div class="tbl-wrap mt-10">
                    <table class="table reg">
                        <colgroup>
                            <col style="width: 160px;">
                            <col style="width: auto;">
                        </colgroup>
                        <tbody>
                            <tr>
                                <th scope="row">카테고리명<span class="ess"><span class="offscreen">필수입력</span></span></th>
                                <td>
                                    <div class="reg-group">
                                        <div class="reg-item">
                                            <input type="text" class="form-control" v-model="formData.categoryName" >
                                        </div>
                                    </div>
                                    <p v-if="checkValidState('categoryName')" class="input-guide"
                                        :class="{ 'error': checkValidState('categoryName') }">
                                        {{ state.validState.message }}
                                    </p>
                                </td>
                            </tr>
                            <tr>
                                <th scope="row">설명</th>
                                <td>
                                    <div class="reg-group">
                                        <div class="reg-item">
                                            <input type="text" class="form-control" v-model="formData.categoryDescription">
                                        </div>
                                    </div>
                                </td>
                            </tr>
                            <tr>
                                <th scope="row">설문그룹 구분<span class="ess"><span class="offscreen">필수입력</span></span></th>
                                <td>
                                    <div class="reg-group inline">
                                        <div class="reg-item">
                                            <span class="radio">
                                                <input id="groupType0" name="groupType" type="radio" value="328001" v-model="formData.questionGroupSectionCode">
                                                <label for="groupType0">단수</label>
                                            </span>
                                            <span class="radio">
                                                <input id="groupType1" name="groupType" type="radio" value="328002" v-model="formData.questionGroupSectionCode">
                                                <label for="groupType1">복수</label>
                                            </span>
                                        </div>
                                    </div>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
        <div class="btn-bottom-set flex justify-center">
            <button type="button" class="btn btn-sl nega" @click="router.push('/survey/category/list')">취소</button>
            <button type="button" class="btn btn-sl posi" @click ="saveCatagory">저장</button>
        </div>
    </section>
    
</template>
<script>
import { reactive, ref, watch } from 'vue';
import { authCommFunc } from '@/core/helper/authComm.js';
import { useStore } from 'vuex';
import { _surveyCategoryReg } from '@/api/survey.js';
import { useRouter, useRoute } from 'vue-router';
import { dmCommFunc } from '@/views/pntmng/common/common.js';

export default {
    components: {},
    setup() {

        const formData = ref({
            categoryName: '', // 카테고리명
            categoryDescription: '', // 카테고리 설명
            postUpYn: 'Y', // 처음 저장시에는 "Y"로 무조건 셋팅
            questionGroupSectionCode: '328001' // "328001(단수) / 328002(복수)"
        });

        const state = reactive({
            validState: {
                type: '', // 약관그룹(termsGroup), 약관유형(clusTyCd), 약관명(clusNm)
                errState: false, // error state
                message: '' // input message
            }
        });

        const router = useRouter();

        const checkValidState = (type) => {
            return state.validState.target === type && state.validState.errState;
        };

        const validFormData = () => {
            const target = ['categoryName'];
            for (const item of target) {
                state.validState.target = item;
                let msg = '';
                if (item === 'categoryName') msg = '카레고리명을 입력해주세요.';

                state.validState.message = msg;
                
                if (!formData.value[item]) {
                    state.validState.errState = true;
                    break;
                }
            }

            return !state.validState.errState;
        };

        // 설문 카테고리 저장
        const saveCatagory = async () => {

            if (validFormData()) {
                const response = await _surveyCategoryReg(formData.value);

                if (response.code == 'OK') {
                    router.push('/survey/category/list');
                } else {
                    modal(response.message);
                }
            }
        };

        /**
         * @validation 상태 초기화
         */
        const resetState = () => {
            state.validState.type = ''; // validation
            state.validState.errState = false;
            state.validState.message = '';
        };


        watch(
            () => formData.value.categoryName,
            () => resetState(),
            { deep: true }
        );

        return {
            state,
            formData,
            router,
            saveCatagory,
            checkValidState,
            validFormData
        };
    }
};
</script>