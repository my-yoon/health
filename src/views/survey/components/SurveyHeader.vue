<template>

    <div class="ui-section">
        <div class="ui-content">
            <div class="ui-grid-top-guide flex justify-end" v-if="gubun === 'detail'">
                <button type="button" class="btn btn-sm"><span class="txt" @click="goCopy">설문복사</span></button>
                <button type="button" class="btn btn-sm" :disabled="status==='종료'"><span class="txt" @click="goVersionUpdate">버전 업데이트</span></button>
            </div>
            <div class="ui-grid-top-guide t-right" v-else>
                <span class="ess"></span> 표시는 필수항목입니다.
            </div>

            <div class="tbl-wrap mt-10"  v-if="gubun === 'detail' && status!=='임시저장'">
                <table class="table reg">
                    <colgroup>
                        <col style="width: 160px;">
                        <col style="width: auto;">
                        <col style="width: 160px;">
                        <col style="width: auto;">
                        <col style="width: 160px;">
                        <col style="width: auto;">
                    </colgroup>
                    <tbody>
                        <tr>
                            <th scope="row">서비스 구분 코드</th>
                            <td>{{ state.commonParam.serviceSectionCode }}</td>
                            <th scope="row">설문 카테고리 코드</th>
                            <td>{{ state.commonParam.categorySerialNumber }}</td>
                            <th scope="row">설문 카테고리명</th>
                            <td>{{ state.commonParam.categoryName }}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
            
            <div class="tbl-wrap mt-10"  v-else>
                <table class="table reg">
                    <colgroup>
                        <col style="width: 160px;">
                        <col style="width: auto;">
                        <col style="width: 160px;">
                        <col style="width: auto;">
                        <col style="width: 160px;">
                        <col style="width: auto;">
                    </colgroup>
                    <tbody>
                        <tr>
                            <th scope="row">설문 구분 코드<span class="ess"><span class="offscreen">필수입력</span></span></th>
                            <td>
                                <div class="reg-group inline">
                                    <div class="reg-item">
                                        <input type="text" class="form-control" disabled v-model="state.commonParam.serviceSectionCode">
                                    </div>
                                    <div class="reg-item">
                                        <button type="button" class="btn btn-slm" @click="isServiceGubunShow = true" >검색</button>
                                    </div>
                                </div>
                                <div v-if="checkValidState('serviceSectionCode')">
                                    <p class="input-guide" :class="{ 'error': state.validState.errState }">
                                        {{ state.validState.message }}
                                    </p>
                                </div>
                            </td>
                            <th scope="row">설문 카테고리 코드<span class="ess"><span class="offscreen">필수입력</span></span></th>
                            <td>
                                <div class="reg-group inline">
                                    <div class="reg-item">
                                        <input type="text" class="form-control" disabled  v-model="state.commonParam.categoryCode">
                                    </div>
                                    <div class="reg-item">
                                        <button type="button" class="btn btn-slm" @click="isCategorySearchShow =  true">검색</button>
                                    </div>
                                </div>
                                <div v-if="checkValidState('categoryCode')">
                                    <p class="input-guide" :class="{ 'error': state.validState.errState }">
                                        {{ state.validState.message }}
                                    </p>
                                </div>
                            </td>
                            <th scope="row">설문 카테고리명</th>
                            <td>{{ state.commonParam.categoryName}}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>

    <CategorySearch :isShow="isCategorySearchShow" @onModalClose="onModalClose" @onModalConfirm="onModalConfirm"></CategorySearch>
    <ServiceGubunSearch  :isShow="isServiceGubunShow" :commonCode = serviceCode @onModalClose="onServiceModalClose" @onModalConfirm="onModalServiceConfirm"></ServiceGubunSearch>

</template>
<script>
import { reactive, ref, watch, getCurrentInstance, inject} from 'vue';
import CategorySearch from './CategorySearch.vue';
import ServiceGubunSearch from './ServiceGubunSearch.vue';
import {surveyCode} from '@/data/commcode/survey.js';
import { _questionCopy, _questionVersionUpdate } from '@/api/survey.js';
import { dmCommFunc } from '@/views/pntmng/common/common.js';
import { useRouter } from 'vue-router';

export default {
    components: {CategorySearch, ServiceGubunSearch},
    props: ['gubun', 'status', 'formData'],
    emits: ['setHeaderData', 'versionUpdate'],
    setup(props) {
        const $Modal = inject('$Modal');
        const { emit } = getCurrentInstance();
        const isCategorySearchShow = ref(false);
        const isServiceGubunShow = ref(false);
        const isCopy = ref(false);
        const serviceCode = ref('156000');
        const router = useRouter();
        const { modal } = dmCommFunc();
        const state = reactive({
            commonParam: {
                serviceSectionCode: props.formData.serviceSectionCode, // 서비스구분코드
                categorySerialNumber: props.formData.categorySerialNumber, //카테고리순번
                categoryCode: props.formData.categoryCode, // 카테고리코드
                categoryName: props.formData.categoryName // 카테고리이름
            },
            validState: {
                type: '', // 약관그룹(termsGroup), 약관유형(clusTyCd), 약관명(clusNm)
                errState: false, // error state
                message: '' // input message
            },
            registParam: []
        });


        const onModalClose = () => {
            isCategorySearchShow.value = false;
            isCopy.value = false;
        };

        const onModalConfirm = (categoryParam) => {
            state.commonParam.categoryCode = categoryParam.categoryCode;
            state.commonParam.categoryName = categoryParam.categoryName;
            state.commonParam.categorySerialNumber = categoryParam.categorySerialNumber;
            isCategorySearchShow.value = false;

            if (isCopy.value) {
                questionCopy();
            } else {
                emit('setHeaderData', state.commonParam);
            }
            
        };

        const onServiceModalClose = () => {
            isServiceGubunShow.value = false;
        };

        const onModalServiceConfirm = (serviceCode) => {
            state.commonParam.serviceSectionCode = serviceCode;
            isServiceGubunShow.value = false;
            emit('setHeaderData', state.commonParam);
        };

         // 유효성 체크시 에러 태그 클래스 추가
        const checkValidState = (type) => {
            return state.validState.target === type && state.validState.errState;
        };

        // @validate
        const validCheck = () => {

            let target = ['serviceSectionCode', 'categoryCode'];

            console.log('surveyHeader validCheck');
            for (const item of target) {
                state.validState.target = item;
                console.log(item, ' validCheck value: ', state.commonParam[item]);
                if (!state.commonParam[item]) {
                    state.validState.message = surveyCode.errorMsg.find(value => value.target === item).msg;
                    state.validState.errState = true;
                    break;
                }
                
            }
            return !state.validState.errState;
        };

        /**
         * @validation 상태 초기화
         */
        const resetState = () => {
            state.validState.type = ''; // validation
            state.validState.errState = false;
            state.validState.message = '';
        };

        const goCopy = () => {
            isCategorySearchShow.value = true;
            isCopy.value = true;
        };

        const questionCopy = async () => {
            const param = {
                categorySerialNumber: state.commonParam.categorySerialNumber,
                questionSerialNumber: props.formData.questionSerialNumber
            };

            const response = await _questionCopy(param);

            if (response.code == 'OK') {
                router.push('/survey/list');
            } else {
                console.log('response.message : ', response.message);
                modal(response.message);
            }
        };

        const goVersionUpdate = async () => {

            const response = await _questionVersionUpdate(props.formData.questionSerialNumber);

            if (response.code == 'OK') {

                $Modal.confirm({
                    title: '',
                    message: '버전이 업데이트 되었습니다.<br>업데이트 된 버전의 설문 상세로 이동합니다.',
                    buttonText: {
                        confirm: '확인'
                    }
                }).then(success => {
                    emit('versionUpdate', response.data.questionSerialNumber);
                }).catch(error => {
                    emit('versionUpdate', response.data.questionSerialNumber);
                });
               
            } else {
                console.log('response.message : ', response.message);
                modal(response.message);
            }
        };

        watch(
            () => state.commonParam,
            () => resetState(),
            { deep: true }
        );

        watch(() => props.formData, () => {
            state.commonParam.serviceSectionCode = props.formData.serviceSectionCode; // 서비스구분코드
            state.commonParam.categorySerialNumber = props.formData.categorySerialNumber; //카테고리순번
            state.commonParam.categoryCode = props.formData.categoryCode; // 카테고리코드
            state.commonParam.categoryName = props.formData.categoryName; // 카테고리이름
        });

        return {
            isCategorySearchShow,
            isServiceGubunShow,
            serviceCode,
            state,
            surveyCode,
            onModalClose,
            onModalConfirm,
            onServiceModalClose,
            onModalServiceConfirm,
            checkValidState,
            validCheck,
            goCopy,
            goVersionUpdate
        };
    }
};
</script>