<template>
    <section class="s1">
        <SurveyHeader ref="surveyHeader" :gubun="'detail'" :status="status" @setHeaderData="setHeaderData" @versionUpdate="versionUpdate" :formData="state.formData"></SurveyHeader>
        <div class="ui-section">
            <div class="ui-content">
                <SurveyForm ref="surveyForm" :gubun="'detail'" :status="status" :formData="state.formData" @setFormData="setFormData"></SurveyForm>
            </div>
        </div>
        <div class="ui-section" v-if="state.formData.questionItemDetailList && state.formData.questionItemDetailList.length > 0">
            <div class="ui-title-3">
                <h3>문항목록</h3>
                <div class="abs">
                    <button type="button" class="btn btn-sm"><span class="txt">문항추가</span></button>
                    <button type="button" class="btn btn-sm"><span class="txt">문항상세로 이동</span></button>
                </div>
            </div>
            <div class="ui-content">
                <div class="ui-dragdrop-menu full mt-10">
                    <draggable v-model="state.formData.questionItemDetailList" class="ui-dragdrop-list" item-key="questionItemDetailList" tag="ul">
                        <template #item="{ item }">
                            <li class="ui-dragdrop-item">
                                <div class="ui-dragdrop-item-top10">
                                    <span class="num">{{ item.questionItemIndicationSerialNumber }}</span>
                                    <span class="ui-tag bc2">{{item.questionItemCode}}</span>
                                    <span class="subject">{{item.questionContents}}</span>
                                </div>
                            </li>
                        </template>
                    </draggable>
                </div>
            </div>
        </div>
        <div class="btn-bottom-set flex justify-center">
            <button type="button" class="btn btn-sl nega" @click="goSurveyList">목록</button>
            <button type="button" class="btn btn-sl nega" @click="goDelete">삭제</button>
            <button type="button" class="btn btn-sl posi" :disabled="status!=='임시저장'" @click="goSave">저장</button>
            <button type="button" class="btn btn-sl posi" :disabled="status!=='임시저장'" @click="goPublic">발행</button>
        </div>
    </section>
    
</template>
<script>

import {  computed, onMounted, ref, inject, nextTick, reactive, watch} from 'vue';
import { _getQuestionDetail, addComma, _modifyQuestion, _questionVersionUpdate, _questionCopy, _modifyQuestionPublication,
    _removeQuestion } from '@/api/survey.js';
import {surveyCode} from '@/data/commcode/survey.js';
import DateSingle from '@/components/ui/DateSingle.vue';
import { dmCommFunc } from '@/views/pntmng/common/common.js';
import { useRouter } from 'vue-router';
import SurveyHeader from './components/SurveyHeader.vue';
import SurveyForm from './components/SurveyForm.vue';
import { _getUserGroupList } from '@/api/pntmng.js';

export default {
    components: {surveyCode, DateSingle, SurveyHeader, SurveyForm},
    setup() {

        const { modal } = dmCommFunc();
        const $Modal = inject('$Modal');
        const router = useRouter();
        const dayJS = inject('dayJS');
        const surveyHeader = ref(null);
        const surveyForm = ref(null);
        const state = reactive({
            formData: {},
            fileUploadList: [],
            questionChargeFormat: '',
            validState: {
                type: '', // 약관그룹(termsGroup), 약관유형(clusTyCd), 약관명(clusNm)
                errState: false, // error state
                message: '' // input message
            },
            questionSerialNumber: history.state.questionSerialNumber
            
        });
        const fileUpload = ref(null);
        const status = ref('');
        const isTermsSearchShow = ref(false);
        const getQuestionDetail = async (questionSerialNumber) => {

            const response = await _getQuestionDetail(questionSerialNumber);

            if (response.code == 'OK') {
                state.formData = response.data;
                
                status.value = state.formData.publicationStatusSectionCode === '330001' ? '임시저장' :
                    state.formData.publicationStatusSectionCode === '330002' ? '발행완료' : '종료';

                state.questionChargeFormat = addComma(Number(state.formData.questionCharge));

                // 문항순서대로 정렬
                if (state.formData.questionItemDetailList && state.formData.questionItemDetailList.length > 0) {
                    state.formData.questionItemDetailList = state.formData.questionItemDetailList.sort((a, b) => {
                        if (a.hasOwnProperty('questionItemIndicationSerialNumber')) {
                            return a.questionItemIndicationSerialNumber - b.questionItemIndicationSerialNumber;
                        }
                    });
                }
                
            } else {
                modal(response.message);
            }
        };

        // 데이터 피커 날짜 검색
        const onSelectBeginPicker = (type, value, status) => {
            state.formData.postUpBeginDatetime = dayJS(value).format('YYYYMMDD');
            console.log('선택일:' + value, '선택된 버튼:' + type, '조회기준:' + status);
        };

         // 데이터 피커 날짜 검색
        const onSelectEndPicker = (type, value, status) => {
            state.formData.postUpEndDatetime = dayJS(value).format('YYYYMMDD');
            console.log('선택일:' + value, '선택된 버튼:' + type, '조회기준:' + status);
        };

        const onInitAgreeData = () => {
            state.formData.clauseAgreementNm = '';
            state.formData.clauseManagementSerialNumberContents = '';
        };

        //  파일 업로드 목록
        const fileListUp = (type) => {
            console.log('fileListUp : ', fileUpload);
            state[type] = (Array.from(fileUpload.value.files));
        };

        // 파일 리스트 삭제
        const fileListDel = (type) => {
            state[type] = [];
        };

        // 유효성 체크시 에러 태그 클래스 추가
        const checkValidState = (type) => {
            return state.validState.target === type && state.validState.errState;
        };

        //[저장]버튼 클릭
        const goSave = () => {

            const headerValidCheck = surveyHeader.value.validCheck();
            const formValidCheck = surveyForm.value.validCheck();

            if (!headerValidCheck || !formValidCheck) return false;


            $Modal.confirm({
                title: '',
                message: '저장하시겠습니까?',
                buttonText: {
                    confirm: '확인',
                    cancel: '취소'
                }
            }).then(success => {
                console.log('callback', success);
                if (success === 'confirm') {
                    modifyQuestion();
                }
            }).catch(error => {
                console.log(error);
            });
            
        };

        // 설문수정
        const modifyQuestion = async () => {

            if (state.formData.questionGuidescreenYn === 'Y') await surveyForm.value.uploadFile('fileUploadList');

            if (state.formData.questionItemDetailList && state.formData.questionItemDetailList.length) {
                state.formData.questionItemIndicationList = state.formData.questionItemDetailList.map((item, idx) => {
                    return {
                        questionSerialNumber: item.questionSerialNumber,
                        questionItemSerialNumber: item.questionItemSerialNumber,
                        questionItemIndicationSerialNumber: idx + 1
                    };
                });
            }

            const response = await _modifyQuestion(state.formData);

            if (response.code == 'OK') {
                //재조회를 위해 한번 reset
                state.formData.questionItemDetailList = null;
                getQuestionDetail(state.questionSerialNumber);
            } else {
                modal(response.message);
            }
        };

        // [발행]버튼 클릭
        const goPublic = () => {
            $Modal.confirm({
                title: '',
                message: '발행 후에는 추가 수정이 불가능합니다.발행하여 히스토리를 저장하시겠습니까?',
                buttonText: {
                    confirm: '확인',
                    cancel: '취소'
                }
            }).then(success => {
                console.log('callback', success);
                if (success === 'confirm') {
                    modifyQuestionPublication();
                }
            }).catch(error => {
                console.log(error);
            });
        };

        const modifyQuestionPublication = async () => {
            const response = await _modifyQuestionPublication(history.state.questionSerialNumber);

            if (response.code == 'OK') {
                //재조회를 위해 한번 reset
                state.formData.questionItemDetailList = null;
                getQuestionDetail(state.questionSerialNumber);
            } else {
                modal(response.message);
            }
        };

        // [삭제] 버큰 클릭
        const goDelete = () => {
            $Modal.confirm({
                title: '',
                message: '삭제하시겠습니까?',
                buttonText: {
                    confirm: '확인',
                    cancel: '취소'
                }
            }).then(success => {
                console.log('callback', success);
                if (success === 'confirm') {
                    removeQuestion();
                }
            }).catch(error => {
                console.log(error);
            });
        };

        const removeQuestion = async () => {
            const params = [state.questionSerialNumber];
            const response = await _removeQuestion(params);

            if (response.code == 'OK') {
                goSurveyList();
            } else {
                modal(response.message);
            }
        };

        const goSurveyList = () => {
            router.push('/survey/list');
        };

        const textareaInit = () => {
            document.getElementById('textarea').dataset.value = state.formData.questionDescription;

        };

        const setHeaderData = (dataset) => {
            console.log('setHeaderData  :: ', dataset);
            state.formData.serviceSectionCode = dataset.serviceSectionCode; // 서비스구분코드
            state.formData.categorySerialNumber = dataset.categorySerialNumber; //카테고리순번
            state.formData.categoryCode = dataset.categoryCode; // 카테고리코드
            state.formData.categoryName = dataset.categoryName;

        };

        const versionUpdate = async (questionSerialNumber) => {
            await getQuestionDetail(questionSerialNumber);
        };

        const setFormData = (dataset) => {
            state.formData = dataset;
        };

        onMounted(async () => {
            await getQuestionDetail(history.state.questionSerialNumber);
        });

        watch(() => state.questionChargeFormat, (value) => {
            state.formData.questionCharge = value.replace(/[^0-9]/g, '');
            state.questionChargeFormat = addComma(Number(state.formData.questionCharge));
        });

        watch(() => state.formData.questionDescription, (value) => {
            console.log('watch');
            textareaInit();
        });

        return {
            state,
            status,
            surveyCode,
            isTermsSearchShow,
            router,
            surveyHeader,
            surveyForm,
            onSelectBeginPicker,
            onSelectEndPicker,
            onInitAgreeData,
            fileListUp,
            fileListDel,
            checkValidState,
            goSave,
            goPublic,
            goDelete,
            goSurveyList,
            textareaInit,
            setHeaderData,
            versionUpdate,
            setFormData
        };
    }
};
</script>