<template>
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
                        <ToolTip :tooltipName="'설문제목'" :tooltipCon="'설문의 제목을 입력하세요.'" />
                    </th>
                    <td>
                        <div class="reg-group inline">
                            <div class="reg-item">
                                <input type="text" class="form-control w-500" v-model="state.formData.questionTitle">
                            </div>
                            <div class="reg-item" v-if="gubun==='detail'">
                                <span class="ui-mark">V{{ state.formData.version }}</span>
                            </div>
                        </div>
                        <div v-if="checkValidState('questionTitle')">
                            <p class="input-guide" :class="{ 'error': state.validState.errState }">
                                {{ state.validState.message }}
                            </p>
                        </div>
                    </td>
                    <th scope="row">설문코드</th>
                    <td>{{ state.formData.questionCode }}</td>
                </tr>
                <tr>
                    <th scope="row">설명</th>
                    <td colspan="3">
                        <div class="reg-group wp-100">
                            <div class="reg-item auto-height" id="textarea">
                                <textarea class="form-control" rows="1" v-model="state.formData.questionDescription"></textarea>
                            </div>
                        </div>
                    </td>
                </tr>
                <tr v-if="state.questionRegistrationSectionCode === '229001'">
                    <th scope="row">화면유형
                        <ToolTip :tooltipName="'화면유형'" :tooltipCon="'앱 화면에서 한 화면이 보일 설문의 개수를 설정합니다. 종속문항이 있는 경우에는 묶음 유형을 한페이지에 등록해주세요.'" />
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
                        <ToolTip :tooltipName="'문항수'" :tooltipCon="'묶음 유형인 경우 한화면에 보여지는 문항의 수를 설정합니다. 종속문항이 있는 경우 전체를 선택하세요.'" />
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
                        <ToolTip :tooltipName="'화면전환효과'" :tooltipCon="'사용시 앱 화면에서 다음화면으로 이동 할 때 전환효과를 줄 수 있습니다.'" />
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
                        <ToolTip :tooltipName="'채점유형'" :tooltipCon="'설문을 채점하여 결과를 보여주고 싶을 때 채점 유형을 사용합니다.' +
                            '채점방법 설정은 채점코드 관리 메뉴에서 별도로 등록하셔야 합니다.'" />
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
                            <div class="reg-item" v-if="state.formData.postUpYn === 'Y'">
                                <div class="ui-datepicker-range">
                                    <div class="ui-datepicker">
                                        <DateSingle @onSelectDate="onSelectBeginPicker" :setDay="state.formData.postUpBeginDatetime">
                                        </DateSingle>
                                    </div>
                                    <span class="ui-coupler">~</span>
                                    <div class="ui-datepicker">
                                        <DateSingle @onSelectDate="onSelectEndPicker" :setDay="state.formData.postUpEndDatetime">
                                        </DateSingle>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </td>
                </tr>
                <tr v-if="state.questionRegistrationSectionCode === '229001'">
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
                <tr v-if="state.questionRegistrationSectionCode === '229002'">
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
                <tr v-if="state.questionRegistrationSectionCode === '229002'">
                    <th scope="row">설문소요시간</th>
                    <td colspan="3">
                        <div class="reg-group inline">
                            <div class="reg-item">
                                <input type="text" class="form-control" v-model="state.formData.testTime">
                            </div>
                        </div>
                    </td>
                </tr>
                <tr v-if="state.questionRegistrationSectionCode === '229002'">
                    <th scope="row">설문안내화면여부</th>
                    <td colspan="3">
                        <div class="reg-group inline">
                            <div class="reg-item">
                                <span class="radio" v-for="(item, index) in surveyCode.questionGuidescreenYn" :key="item" @change="fileListDel('fileUploadList')">
                                    <input :id="'questionGuidescreenYn' + index" name="questionGuidescreenYn" type="radio" :value="item.value" v-model="state.formData.questionGuidescreenYn">
                                    <label :for="'questionGuidescreenYn' + index">{{ item.name }}</label>
                                </span>
                            </div>
                            <div class="reg-item" v-if="state.formData.questionGuidescreenYn==='Y'">
                                <div class="btn-file">
                                    <input type="file" id="upload-file" ref="fileUpload" hidden=""
                                        @change="fileListUp('fileUploadList', fileUpload)"  />
                                    <label class="btn-up" for="upload-file" >파일첨부</label>
                                </div>
                            </div>
                        </div>
                        <div class="upload-file-box" v-if="state.formData.questionGuidescreenYn==='Y'">
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
                                <span class="radio" v-for="(item, index) in surveyCode.targetTypeCode" :key="item"  @change="resetUserGroupData">
                                    <input :id="'sTar' + index" name="sTarGroup" type="radio" :value="item.value" v-model="state.formData.targetTypeCode">
                                    <label :for="'sTar' + index">{{ item.name }}</label>
                                </span>
                            </div>
                            <div class="reg-item">
                                <button type="button" class="btn btn-slm" :disabled="state.formData.targetTypeCode !== '233002'" @click="isUserGroupShow=true">찾기</button>
                            </div>
                        </div>
                        <div class="tbl-wrap mt-10" v-if="state.groupData.length > 0">
                            <div class="table-util">
                                <button type="button" class="btn btn-ss" @click="deleteGroupData">삭제</button>
                            </div>
                            <AgGridVue :defaultColDef="state.defaultColDef" :columnDefs="state.tableColum_c"
                                :rowData="state.groupData" @grid-ready="onGridReady"
                                :suppressRowClickSelection="true" @selection-changed="onRowSelect" :rowSelection="'multiple'"
                                class="ag-theme-alpine" :domLayout="'autoHeight'">
                            </AgGridVue>
                        </div>
                    </td>
                </tr>
                <tr v-if="gubun==='detail'">
                    <th scope="row">발행상태</th>
                    <td colspan="3"><strong class="fc-3">{{ status }}</strong></td>
                </tr>
            </tbody>
        </table>
    </div>


    <TermsSearch :isShow="isTermsSearchShow" @onModalClose="onTermsModalClose" @onModalConfirm="onTermsModalConfirm"></TermsSearch>
    <UserGroupPop v-if="isUserGroupShow" @modalPlcyclose="closeUserGroupModal" />
    
</template>
<script>

import {  computed, onMounted, ref, inject, nextTick, reactive, watch, getCurrentInstance} from 'vue';
import TermsSearch from './TermsSearch.vue';
import { addComma} from '@/api/survey.js';
import {surveyCode} from '@/data/commcode/survey.js';
import DateSingle from '@/components/ui/DateSingle.vue';
import { dmCommFunc } from '@/views/pntmng/common/common.js';
import { useRouter } from 'vue-router';
import {_uploadFile} from '@/api/common.js';
import UserGroupPop from '@/views/pntmng/component/UserGroupPop.vue';

export default {
    props: ['gubun', 'status', 'formData'],
    emits: ['setFormData'],
    components: {surveyCode, DateSingle, TermsSearch, UserGroupPop},
    setup(props) {
        const { emit } = getCurrentInstance();
        const router = useRouter();
        const dayJS = inject('dayJS');
        const surveyHeader = ref(null);
        const userGroupPop_label = [
            { headerCheckboxSelection: true, headerName: '선택', field: 'checkbox', checkboxSelection: true, width: 60 },
            { headerName: '번호', field: 'mbrGrpSn', flex: 1 },
            { headerName: '그룹명', field: 'mbrGrpNm', flex: 1 },
            { headerName: '그룹설명', field: 'mbrGrpDscr', flex: 1},
            { headerName: '그룹회원수', field: 'mbrGrpCnt', flex: 1}
        ];
        const state = reactive({
            formData: {},
            fileUploadList: [],
            questionChargeFormat: '',
            validState: {
                type: '', // 약관그룹(termsGroup), 약관유형(clusTyCd), 약관명(clusNm)
                errState: false, // error state
                message: '' // input message
            },
            questionSerialNumber: history.state.questionSerialNumber,
            defaultColDef: {
                sortable: true,
                resizable: true,
                width: 50,
                headerClass: 'centered',
                cellClass: 'centered'
            },
            tableColum_c: _.clone(userGroupPop_label),
            groupData: [],
            gridApi: null,
            gridColumApi: null,
            selectList: [],
            questionRegistrationSectionCode: computed(() => props.formData.questionRegistrationSectionCode)
        });
        const fileUpload = ref(null);
        const isTermsSearchShow = ref(false);
        const isUserGroupShow = ref(false);
        
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
            console.log('fileListUp');
            state[type] = (Array.from(fileUpload.value.files));
        };

        // 파일 리스트 삭제
        const fileListDel = (type) => {
            console.log('fileListDel');
            state[type] = [];
        };

        //파일업로드 API
        const uploadFile = async (type) => {
            console.log('파일업로드 API');
            if (state[type].length > 0) {
                const uploadFormData = new FormData();
                uploadFormData.append('file', state[type][0]);
                try {
                    return await _uploadFile(uploadFormData).then(result => {
                        state.formData.tnlUrl = result.data.fileUrl;
                        return true;
                    });
                } catch (error) {
                    $Modal.alert('파일업로드 오류');
                    console.log(error);
                    return false;
                }
            }
            return true;
        };

        // 유효성 체크시 에러 태그 클래스 추가
        const checkValidState = (type) => {
            return state.validState.target === type && state.validState.errState;
        };

        const textareaInit = () => {
            document.getElementById('textarea').dataset.value = state.formData.questionDescription;

        };

        const onTermsModalClose = () => {
            isTermsSearchShow.value = false;
        };

        const onTermsModalConfirm = (param) => {
            state.formData.clauseAgreementNm = param.clusAgrmDomnCdNm;
            state.formData.clauseManagementSerialNumberContents = param.clusMngSn;
            // state.commonParam.serviceSectionCode = serviceCode;
            isTermsSearchShow.value = false;
        };

        const closeUserGroupModal = async (type, value) => {
            isUserGroupShow.value = false;
            if (type === 'modalconfirm') {
                state.groupData = value;
                let groupCode = '';
                value.map((item, idx) => {
                    if (idx > 0) groupCode += '|' + item.mbrGrpSn;
                    else  groupCode += item.mbrGrpSn;
                });
                state.formData.targetCompanyCode  = groupCode;
            } else {
                resetUserGroupData();
            }
        };

        const deleteGroupData = () => {

            state.groupData =  state.groupData.filter((item) => {
                return !state.selectList.includes(item);
            });

            let groupCode = '';

            if (state.groupData.length > 0) {
                state.groupData.map((item, idx) => {
                    if (idx > 0) groupCode += '|' + item.mbrGrpSn;
                    else  groupCode += item.mbrGrpSn;
                });
                state.formData.targetCompanyCode  = groupCode;
            }

        };

        const resetUserGroupData = () => {
            state.groupData = [];
            state.formData.targetCompanyCode = '';
        };

        const validCheck = () => {

            let target = ['questionTitle', 'markingTypeCode'];
            // 일반상담일 경우만 문항수 체크
            if (state.questionRegistrationSectionCode === '229001') target.push('pageQuestionItemCount');

            for (const item of target) {
                console.log('target :', item, state.formData[item]);
                state.validState.target = item;
                if (!state.formData[item]) {
                    state.validState.message = surveyCode.errorMsg.find(value => value.target === item).msg;
                    state.validState.errState = true;
                    console.log('state.validState : ', state.validState);
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

        // 데이터 피커 초기화
        const onInitDate = () => {
            state.formData.postUpBeginDatetime = '';
            state.formData.postUpEndDatetime = '';
            // dateSearch.value.initDate();
        };

        const onRowSelect = (e) => state.selectList = state.gridApi.getSelectedRows();

        // 테이블 리사이징을 위한 참조값
        const onGridReady = (params) => {
            state.gridApi = params.api;
            state.gridColumApi = params.columnApi;
        };

        onMounted(async () => {
            
        });

        watch(
            () => state.formData,
            () => {
                resetState();
                state.formData.questionRegistrationSectionCode = state.questionRegistrationSectionCode;
                emit('setFormData', state.formData);
            },
            { deep: true }
        );

        watch(() => state.questionChargeFormat, (value) => {
            state.formData.questionCharge = value.replace(/[^0-9]/g, '');
            state.questionChargeFormat = addComma(Number(state.formData.questionCharge));
        });

        watch(() => state.formData.questionDescription, (value) => {
            textareaInit();
        });

        watch(() => props.formData, () => {
            state.formData = props.formData;
            if (props.formData.memberGroupDetailList) state.groupData = props.formData.memberGroupDetailList;
        });

        watch(() => props.formData.questionCharge, (value) => {
            state.questionChargeFormat = addComma(Number(state.formData.questionCharge));
        });

        return {
            state,
            surveyCode,
            isTermsSearchShow,
            isUserGroupShow,
            router,
            surveyHeader,
            fileUpload,
            onInitDate,
            onSelectBeginPicker,
            onSelectEndPicker,
            onInitAgreeData,
            fileListUp,
            fileListDel,
            checkValidState,
            textareaInit,
            onTermsModalClose,
            onTermsModalConfirm,
            validCheck,
            uploadFile,
            closeUserGroupModal,
            resetUserGroupData,
            onRowSelect,
            onGridReady,
            deleteGroupData
        };
    }
};
</script>