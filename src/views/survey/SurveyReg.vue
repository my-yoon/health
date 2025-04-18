<template>
    <section class="s1">
        <!-- <div class="ui-section">
            <div class="ui-content">
                <div class="ui-grid-top-guide t-right">
                    <span class="ess"></span> 표시는 필수항목입니다.
                </div>
                <div class="tbl-wrap mt-10">
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
        </div> -->
        <SurveyHeader ref="surveyHeader" :gubun="'regist'" :status="''" @setHeaderData="setHeaderData" :formData="state.commonParam"></SurveyHeader>
        <div class="ui-section">
            <div class="ui-tab-wrap mt-30">
                <div class="ui-tabs">
                    <ul>
                        <li :class="state.formData.questionRegistrationSectionCode == '229001' ? 'active' : ''" @click="onTabClick('229001')">
                            <button type="button" class="ui-tab-item"><span>일반테스트</span></button>
                        </li>
                        <li :class="state.formData.questionRegistrationSectionCode == '229002' ? 'active' : ''" @click="onTabClick('229002')">
                            <button type="button" class="ui-tab-item"><span>심리테스트</span></button>
                        </li>
                    </ul>
                </div>
                <div class="ui-panels">
                    <!-- 일반테스트 시작 -->
                    <!-- <div class="ui-panel-item">
                        <div class="ui-grid-top-guide t-right">
                            <span class="ess"></span> 표시는 필수항목입니다.
                        </div>
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
                                        <th scope="row">설문 제목<span class="ess"><span class="offscreen">필수입력</span></span>
                                            <div class="ui-tooltip">
                                                <button type="button" class="ui-tooltip-ico"><span class="offscreen">설문 제목 안내</span></button>
                                                <div class="ui-tooltip-info" style="display: none;">
                                                    <p>설문 제목 안내</p>
                                                </div>
                                            </div>
                                        </th>
                                        <td colspan="3">
                                            <div class="reg-group">
                                                <div class="reg-item">
                                                    <input type="text" class="form-control" v-model="state.formData.questionTitle">
                                                </div>
                                            </div>
                                            <div v-if="checkValidState('questionTitle')">
                                                <p class="input-guide" :class="{ 'error': state.validState.errState }">
                                                    {{ state.validState.message }}
                                                </p>
                                            </div>
                                        </td>
                                    </tr>
                                    <tr>
                                        <th scope="row">설명</th>
                                        <td colspan="3">
                                            <div class="reg-group wp-100">
                                                <div class="reg-item auto-height">
                                                    <textarea class="form-control" oninput="this.parentNode.dataset.value = this.value" rows="1" v-model="state.formData.questionDescription"></textarea>
                                                </div>
                                            </div>
                                        </td>
                                    </tr>
                                    <tr v-if="state.formData.questionRegistrationSectionCode === '229001'">
                                        <th scope="row">화면유형
                                            <div class="ui-tooltip">
                                                <button type="button" class="ui-tooltip-ico"><span class="offscreen">화면유형 안내</span></button>
                                                <div class="ui-tooltip-info" style="display: none;">
                                                    <p>화면유형 안내</p>
                                                </div>
                                            </div>
                                        </th>
                                        <td>
                                            <div class="reg-group">
                                                <div class="reg-item">
                                                    <span class="radio" v-for="(item, index) in surveyCode.screenTypeSectionCode" :key="item">
                                                        <input :id="'screenType' + index" name="screenGroup" type="radio" :value="item.value" v-model="state.formData.screenTypeSectionCode">
                                                        <label :for="'screenType' + index">{{ item.name }}</label>
                                                    </span>
                                                </div>
                                            </div>
                                        </td>
                                        <th scope="row">
                                            페이지당 문항수<span class="ess"><span class="offscreen">필수입력</span></span>
                                            <div class="ui-tooltip">
                                                <button type="button" class="ui-tooltip-ico"><span class="offscreen">페이지당 문항수 안내</span></button>
                                                <div class="ui-tooltip-info" style="display: none;">
                                                    <p>페이지당 문항수 안내</p>
                                                </div>
                                            </div>
                                        </th>
                                        <td>
                                            <div class="reg-group inline">
                                                <div class="reg-item">
                                                    <select class="custom-select" v-model="state.formData.pageQuestionItemCount">
                                                        <option v-for="number in 18" :key="number + 2" :value="number + 2">{{ number + 2}}</option>
                                                    </select>
                                                </div>
                                            </div>
                                            <div v-if="checkValidState('pageQuestionItemCount')">
                                                <p class="input-guide" :class="{ 'error': state.validState.errState }">
                                                    {{ state.validState.message }}
                                                </p>
                                            </div>
                                        </td>
                                        
                                    </tr>
                                    <tr v-else>
                                        <th scope="row">화면유형
                                            <div class="ui-tooltip">
                                                <button type="button" class="ui-tooltip-ico"><span class="offscreen">화면유형 안내</span></button>
                                                <div class="ui-tooltip-info" style="display: none;">
                                                    <p>화면유형 안내</p>
                                                </div>
                                            </div>
                                        </th>
                                        <td colspan="3">
                                            <div class="reg-group">
                                                <div class="reg-item">
                                                    <span class="radio" v-for="(item, index) in surveyCode.screenTypeSectionCode" :key="item">
                                                        <input :id="'screenType' + index" name="screenGroup" type="radio" :value="item.value" v-model="state.formData.screenTypeSectionCode">
                                                        <label :for="'screenType' + index">{{ item.name }}</label>
                                                    </span>
                                                </div>
                                            </div>
                                        </td>
                                    </tr>
                                    <tr>
                                        <th scope="row">화면전환효과
                                            <div class="ui-tooltip">
                                                <button type="button" class="ui-tooltip-ico"><span class="offscreen">화면전환효과 안내</span></button>
                                                <div class="ui-tooltip-info" style="display: none;">
                                                    <p>화면전환효과 안내</p>
                                                </div>
                                            </div>
                                        </th>
                                        <td>
                                            <div class="reg-group">
                                                <div class="reg-item">
                                                    <span class="radio" v-for="(item, index) in surveyCode.screenTrnsfEffectYn" :key="item">
                                                        <input :id="'screenTransType' + index" name="screenTransGroup" type="radio" :value="item.value" v-model="state.formData.screenTrnsfEffectYn">
                                                        <label :for="'screenTransType' + index">{{ item.name }}</label>
                                                    </span>
                                                </div>
                                            </div>
                                        </td>
                                        <th scope="row">진행순서</th>
                                        <td>
                                            <div class="reg-group inline">
                                                <div class="reg-item">
                                                    <input type="text" class="form-control" v-model="state.formData.indicationSerialNumber">
                                                </div>
                                            </div>
                                        </td>
                                    </tr>
                                    <tr>
                                        <th scope="row">사용여부</th>
                                        <td>
                                            <div class="reg-group">
                                                <div class="reg-item">
                                                    <span class="radio" v-for="(item, index) in surveyCode.useYn" :key="item">
                                                        <input :id="'useYn' + index" name="useYn" type="radio" :value="item.value" v-model="state.formData.useYn">
                                                        <label :for="'useYn' + index">{{ item.name }}</label>
                                                    </span>
                                                </div>
                                            </div>
                                        </td>
                                        <th scope="row">채점유형<span class="ess"><span class="offscreen">필수입력</span></span>
                                            <div class="ui-tooltip">
                                                <button type="button" class="ui-tooltip-ico"><span class="offscreen">채점유형 안내</span></button>
                                                <div class="ui-tooltip-info" style="display: none;">
                                                    <p>채점유형 안내</p>
                                                </div>
                                            </div>
                                        </th>
                                        <td>
                                            <div class="reg-group inline">
                                                <div class="reg-item">
                                                    <select class="custom-select" v-model="state.formData.markingTypeCode">
                                                        <option v-for="item in surveyCode.markingTypeCode" :key="item" :value="item.value">{{ item.name }}</option>
                                                    </select>
                                                </div>
                                            </div>
                                            <div v-if="checkValidState('markingTypeCode')">
                                                <p class="input-guide" :class="{ 'error': state.validState.errState }">
                                                    {{ state.validState.message }}
                                                </p>
                                            </div>
                                        </td>
                                    </tr>
                                    <tr>
                                        <th scope="row">설문노출기간</th>
                                        <td colspan="3">
                                            <div class="reg-group inline">
                                                <div class="reg-item">
                                                    <span class="radio" v-for="(item, index) in surveyCode.postUpYn" :key="item" @change="onInitDate">
                                                        <input :id="'postUpYn' + index" name="postUpYn" type="radio" :value="item.value" v-model="state.formData.postUpYn">
                                                        <label :for="'postUpYn' + index">{{ item.name }}</label>
                                                    </span>
                                                </div>
                                                <div class="reg-item" v-if="state.formData.postUpYn === 'Y'" >
                                                    <div class="ui-datepicker-range">
                                                        <div class="ui-datepicker">
                                                            <DateSingle @onSelectDate="onSelectBeginPicker" :setDay="state.formData.postUpBeginDatetime" ref="dateSearch1">
                                                            </DateSingle>
                                                        </div>
                                                        <span class="ui-coupler">~</span>
                                                        <div class="ui-datepicker">
                                                            <DateSingle @onSelectDate="onSelectEndPicker" :setDay="state.formData.postUpEndDatetime" ref="dateSearch2">
                                                            </DateSingle>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                    </tr>
                                    <tr v-if="state.formData.questionRegistrationSectionCode === '229001'">
                                        <th scope="row">약관동의 여부</th>
                                        <td colspan="3">
                                            <div class="reg-group inline">
                                                <div class="reg-item">
                                                    <span class="checkbox">
                                                        <input id="seUse1" name="seUseGroup" type="checkbox" v-model="state.formData.clauseAgreementYn" false-value="N" true-value="Y" @change="onInitAgreeData">
                                                        <label for="seUse1">약관사용</label>
                                                    </span>
                                                </div>
                                                <div class="reg-item">
                                                    <input type="text" class="form-control" disabled v-model="state.formData.clauseAgreementNm">
                                                </div>
                                                <div class="reg-item">
                                                    <button type="button" class="btn btn-slm" @click="isTermsSearchShow = true" :disabled="state.formData.clauseAgreementYn === 'N'">약관검색</button>
                                                </div>
                                            </div>
                                        </td>
                                    </tr>
                                    <tr v-if="state.formData.questionRegistrationSectionCode === '229002'">
                                        <th scope="row">설문비용</th>
                                        <td colspan="3">
                                            <div class="reg-group">
                                                <div class="reg-item">
                                                    <span class="radio" v-for="(item, index) in surveyCode.questionChargeSectionCode" :key="item" @change="state.formData.questionCharge = ''">
                                                        <input :id="'sCost' + index" name="sCostGroup" type="radio" :value="item.value" v-model="state.formData.questionChargeSectionCode">
                                                        <label :for="'sCost' + index">{{ item.name }}</label>
                                                    </span>
                                                    <span class="dv" v-if="state.formData.questionChargeSectionCode === '230002'">
                                                        <input type="text" class="form-control" v-model="state.questionChargeFormat">
                                                    </span>
                                                    <span class="unit" v-if="state.formData.questionChargeSectionCode === '230002'">원</span>
                                                </div>
                                                
                                            </div>
                                        </td>
                                    </tr>
                                    <tr v-if="state.formData.questionRegistrationSectionCode === '229002'">
                                        <th scope="row">설문소요시간</th>
                                        <td colspan="3">
                                            <div class="reg-group inline">
                                                <div class="reg-item">
                                                    <input type="text" class="form-control" v-modal="state.formData.testTime">
                                                </div>
                                            </div>
                                        </td>
                                    </tr>
                                    <tr v-if="state.formData.questionRegistrationSectionCode === '229002'">
                                        <th scope="row">설문안내화면여부</th>
                                        <td colspan="3">
                                            <div class="reg-group inline">
                                                <div class="reg-item">
                                                    <span class="radio" v-for="(item, index) in surveyCode.questionGuidescreenYn" :key="item">
                                                        <input :id="'questionGuidescreenYn' + index" name="questionGuidescreenYn" type="radio" :value="item.value" v-model="state.formData.questionGuidescreenYn">
                                                        <label :for="'questionGuidescreenYn' + index">{{ item.name }}</label>
                                                    </span>
                                                </div>
                                                <div class="reg-item">
                                                    <div class="btn-file">
                                                        <input type="file" id="upload-file" ref="fileUpload" hidden=""
                                                            @change="fileListUp('fileUploadList', fileUpload)" />
                                                        <label class="btn-up" for="upload-file">파일첨부</label>
                                                    </div>
                                                </div>
                                            </div>
                                            <div class="upload-file-box">
                                                <div class="upload-file-head flex space-between">
                                                    <button type="button" class="btn del-all btn-secondary">
                                                        <span class="offscreen">전체파일삭제</span>
                                                    </button>
                                                    <span class="name">파일명</span>
                                                    <span class="volume">용량</span>
                                                </div>
                                                <div v-if="state.fileUploadList.length > 0" class="upload-file-list">
                                                    <div v-for="(item, index) in state.fileUploadList"
                                                        :key="index" class="upload-file-list-item flex space-between">
                                                        <button class="btn del btn-secondary" type="button"
                                                                @click="fileListDel('fileUploadList')">
                                                            <span class="offscreen">파일삭제</span>
                                                        </button>
                                                        <span class="name">{{ item.name }}</span>
                                                        <span class="volume">{{ (item.size / (1024 * 1024)).toFixed(1) }}
                                                                            MB</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                    </tr>
                                    <tr>
                                        <th scope="row">설문대상</th>
                                        <td colspan="3">
                                            <div class="reg-group inline">
                                                <div class="reg-item">
                                                    <span class="radio" v-for="(item, index) in surveyCode.targetTypeCode" :key="item">
                                                        <input :id="'sTar' + index" name="sTarGroup" type="radio" :value="item.value" v-model="state.formData.targetTypeCode">
                                                        <label :for="'sTar' + index">{{ item.name }}</label>
                                                    </span>
                                                    <div class="reg-item">
                                                        <button type="button" class="btn btn-slm" :disabled="state.formData.targetTypeCode !== '233002'">찾기</button>
                                                    </div>
                                                </div>
                                            </div>
                                            <div class="tbl-wrap mt-10">
                                                <div class="table-util">
                                                    <button type="button" class="btn btn-ss">삭제</button>
                                                </div>
                                                <div id="myGrid" class="ag-theme-alpine"></div>
                                            </div>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div> -->
                    <!-- 일반테스트 끝 -->
                    <div class="ui-panel-item">
                        <SurveyForm ref="surveyForm" :gubun="'regist'" :status="''" :formData="state.formData" @setFormData="setFormData"></SurveyForm>
                    </div>
                </div>
            </div>
        </div>
        <div class="btn-bottom-set flex justify-center">
            <button type="button" class="btn btn-sl nega" @click="router.push('/survey/list')">취소</button>
            <button type="button" class="btn btn-sl posi" @click="goRegist">저장</button>
        </div>
    </section>

    <TermsSearch :isShow="isTermsSearchShow" @onModalClose="onTermsModalClose" @onModalConfirm="onTermsModalConfirm"></TermsSearch>
</template>
<script>
import { reactive, ref, inject, watch  } from 'vue';
import TermsSearch from './components/TermsSearch.vue';
import {surveyCode} from '@/data/commcode/survey.js';
import { _registerQuestion, addComma } from '@/api/survey.js';
import { dmCommFunc } from '@/views/pntmng/common/common.js';
import { routerKey } from 'vue-router';
import { useRouter, useRoute } from 'vue-router';
import DateSingle from '@/components/ui/DateSingle.vue';
import {_uploadFile} from '@/api/common.js';
import SurveyHeader from './components/SurveyHeader.vue';
import SurveyForm from './components/SurveyForm.vue';
import { onMounted } from 'vue';

export default {
    components: {DateSingle, TermsSearch, SurveyHeader, SurveyForm},
    setup() {
        const router = useRouter();
        const $Modal = inject('$Modal');
        const {modal} = dmCommFunc();
        const dayJS = inject('dayJS');
        const isCategorySearchShow = ref(false);
        const isServiceGubunShow = ref(false);
        const isTermsSearchShow = ref(false);
        const serviceCode = ref('156000');
        const surveyHeader = ref(null);
        const surveyForm = ref(null);
        const state = reactive({
            commonParam: {
                serviceSectionCode: '', // 서비스구분코드
                categorySerialNumber: '', //카테고리순번
                categoryCode: '', // 카테고리코드
                categoryName: '' // 카테고리이름
            },
            formData: {
                // questionRegistrationSectionCode: '229001', //설문등록구분코드
                // questionTitle: '', // 설문제목
                // questionDescription: '', // 설문내용
                // screenTypeSectionCode: '', // 화면유형구분코드
                // pageQuestionItemCount: 0, // 페이지문항건수
                // screenTrnsfEffectYn: '', // 화면전환효과여부
                // indicationSerialNumber: 0, // 표시순번
                // useYn: '', //사용여부
                // markingTypeCode: '232001', // 채점유형구분코드
                // postUpYn: '', // 게시여부
                // postUpBeginDatetime: '', // 게시시작일시
                // postUpEndDatetime: '', // 게시종료일시
                // clauseAgreementYn: '', // 약관동의사용여부
                // clauseManagementSerialNumberContents: '', // 약관관리순번내용
                // clauseAgreementNm: '', //약관관리내용
                // questionChargeSectionCode: '', // 설문요금구분코드
                // questionCharge: '', // 설문요금
                // testTime: '', // 검사시간
                // tnlUrl: '', // 썸네일URL
                // targetTypeCode: '', // 대상유형구분코드
                // targetCompanyCode: '', // 대상회사코드
                // questionGuidescreenYn: '' // 설문안내화면여부
            },
            validState: {
                type: '', // 약관그룹(termsGroup), 약관유형(clusTyCd), 약관명(clusNm)
                errState: false, // error state
                message: '' // input message
            },
            registParam: [],
            questionChargeFormat: '',
            fileUploadList: [] // 파일업로드목록
        });

        const onTabClick = (param) => {
            state.formData.questionRegistrationSectionCode = param;

            // 심리테스트 값 초기화
            state.formData.pageQuestionItemCount = '';
            state.formData.questionChargeSectionCode = '';
            state.formData.questionCharge = '';
            state.formData.tnlUrl = '';
            state.formData.clauseAgreementYn = '';
            state.formData.clauseManagementSerialNumberContents = '';
            state.fileUploadList = [];
        };


        //[저장]버튼 클릭시
        const goRegist = async () => {

            state.registParam = {
                ...state.formData,
                ...state.commonParam
            };

            const headerValidCheck = surveyHeader.value.validCheck();
            const formValidCheck = surveyForm.value.validCheck();

            if (headerValidCheck && formValidCheck) {
                registerQuestion();
            }
        };
        // 설문등록 api
        const registerQuestion = async () => {

            // 파일업로드 api
            if (state.formData.questionGuidescreenYn === 'Y') await surveyForm.value.uploadFile('fileUploadList');

            const response = await _registerQuestion(state.registParam);

            if (response.code == 'OK') {
                $Modal.confirm({
                    title: '',
                    message: '이어서 질문/답변을 등록하시겠습니까?',
                    buttonText: {
                        confirm: '예',
                        cancel: '아니오'
                    }
                })
                    .then(success => {
                        if (success === 'confirm') {
                            router.push('/survey/list');
                            console.log('항목등록 페이지로 이동해야함');
                        }
                    })
                    .catch(error => {
                        console.log('error : ', error);
                        if (error === 'cancel') {
                            router.push('/survey/list');
                        }
                        
                    });
                
            } else {
                console.log('response.message : ', response.message);
                modal(response.message);
            }
        };


        const setHeaderData = (dataset) => {
            state.commonParam.serviceSectionCode = dataset.serviceSectionCode; // 서비스구분코드
            state.commonParam.categorySerialNumber = dataset.categorySerialNumber; //카테고리순번
            state.commonParam.categoryCode = dataset.categoryCode; // 카테고리코드
            state.commonParam.categoryName = dataset.categoryName;

        };

        const setFormData = (dataset) => {
            state.formData = dataset;
        };

        onMounted(() => {
            state.formData.questionRegistrationSectionCode = '229001';
        });

        

        // watch(
        //     () => state.commonParam,
        //     () => resetState(),
        //     { deep: true }
        // );

        // watch(
        //     () => state.formData,
        //     () => resetState(),
        //     { deep: true }
        // );

        watch(() => state.questionChargeFormat, (value) => {
            state.formData.questionCharge = state.questionChargeFormat.replace(/[^0-9]/g, '');
            state.questionChargeFormat = addComma(Number(state.formData.questionCharge));
        });

        return {
            isCategorySearchShow,
            isServiceGubunShow,
            isTermsSearchShow,
            serviceCode,
            state,
            surveyCode,
            surveyHeader,
            surveyForm,
            onTabClick,
            registerQuestion,
            goRegist,
            setHeaderData,
            setFormData
        };
    }
};
</script>