<template>
    <section class="temp-section">
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
                        <th scope="row">약관그룹<span class="ess"><span class="offscreen">필수입력</span></span></th>
                        <td>
                            <div class="reg-group inline">
                                <div class="reg-item">
                                    <select v-model="formData.clusGrpSn" class="custom-select sm"
                                        :disabled="state.pageType !== 'regist'">
                                        <option value="">선택</option>
                                        <option v-for="(item, index) in state.termsGroup" :key="index"
                                            :value="item.clusGrpSn">
                                            {{ item.clusGrpNm }}
                                        </option>
                                    </select>
                                    <span v-if="checkValidState('clusGrpSn')" class="input-guide"
                                        :class="{ 'error': checkValidState('clusGrpSn') }">
                                        {{ state.validState.message }}
                                    </span>
                                </div>
                            </div>
                        </td>
                        <th scope="row">약관유형<span class="ess"><span class="offscreen">필수입력</span></span></th>
                        <td>
                            <div class="reg-group inline">
                                <div class="reg-item">
                                    <select v-model="formData.tlusSn" class="custom-select sm"
                                        :disabled="state.pageType !== 'regist'" @change="getTermsTypeDetail($event)">
                                        <option value="">선택</option>
                                        <option v-for="(item, index) in state.termsType" :key="index" :value="item.tlusSn">
                                            {{ item.clusTyCdNm }} ({{ item.tlusClusNm }})
                                        </option>
                                    </select>
                                    <span v-if="checkValidState('clusTyCd')" class="input-guide"
                                        :class="{ 'error': checkValidState('clusTyCd') }">
                                        {{ state.validState.message }}
                                    </span>
                                </div>
                            </div>
                        </td>
                    </tr>
                    <tr>
                        <th scope="row">서비스제공자<span class="ess"><span class="offscreen">필수입력</span></span></th>
                        <td>
                            <div class="reg-group inline">
                                <div class="reg-item">
                                    <input v-model="formData.clusMngOff" type="text" class="form-control"
                                        :disabled="state.pageType !== 'regist'">
                                </div>
                                <div class="reg-item">
                                    <button type="button" class="btn btn-slm" @click="modalOpen('isShowClusMngOffr')"
                                        :disabled="state.pageType !== 'regist'">찾기</button>
                                </div>
                                <div class="reg-item">
                                    <span v-if="checkValidState('clusMngOffrTyCd')" class="input-guide"
                                        :class="{ 'error': checkValidState('clusMngOffrTyCd') }">
                                        {{ state.validState.message }}
                                    </span>
                                </div>
                            </div>
                        </td>
                        <th scope="row">서비스대상자<span class="ess"><span class="offscreen">필수입력</span></span></th>
                        <td>
                            <div class="reg-group inline">
                                <div class="reg-item">
                                    <input type="text" class="form-control" :disabled="true" value="전체" />
                                    <!-- <input v-model="formData.clusMngTgpTyCd" type="text" class="form-control" :disabled="state.pageType !== 'regist'" /> -->
                                </div>
                                <!-- <div class="reg-item">
                                    <button type="button" class="btn btn-slm" @click="modalOpen('isShowClusMngTgp')" :disabled="state.pageType !== 'regist'">찾기</button>
                                </div> -->
                                <div class="reg-item">
                                    <span v-if="checkValidState('clusMngTgpTyCd')" class="input-guide"
                                        :class="{ 'error': checkValidState('clusMngTgpTyCd') }">
                                        {{ state.validState.message }}
                                    </span>
                                </div>
                            </div>
                        </td>
                    </tr>
                    <tr>
                        <th scope="row">관리형태</th>
                        <td>
                            {{ !_.isEmpty(state.selectedTermsType) ? state.selectedTermsType[0].tlusShpCdNm : '' }}
                        </td>
                        <th scope="row">약관명<span class="ess"><span class="offscreen">필수입력</span></span></th>
                        <td>
                            <div class="reg-group">
                                <div class="reg-item">
                                    <input type="text" class="form-control" v-model="formData.clusNm"
                                        :disabled="state.pageType !== 'regist'" />
                                </div>
                            </div>
                            <p v-if="checkValidState('clusNm')" class="input-guide"
                                :class="{ 'error': checkValidState('clusNm') }">
                                {{ state.validState.message }}
                            </p>
                        </td>
                    </tr>
                    <tr>
                        <th scope="row">제&middot;개정일자<span class="ess"><span class="offscreen">필수입력</span></span></th>
                        <td>
                            <div class="reg-group">
                                <div class="reg-item">
                                    <div class="ui-datepicker">
                                        <DateSingle :setDay="formData.rpdDt" :disabled="!true" ref="rpdDt"
                                            @onSelectDate="onSelectPickerRpdDt"></DateSingle>
                                    </div>
                                </div>
                            </div>
                        </td>
                        <th scope="row">제&middot;개정사유<span class="ess"><span class="offscreen">필수입력</span></span></th>
                        <td>
                            <div class="reg-group">
                                <div class="reg-item">
                                    <input v-model="formData.rpdRsn" type="text" class="form-control" />
                                </div>
                            </div>
                            <p v-if="checkValidState('rpdRsn')" class="input-guide"
                                :class="{ 'error': checkValidState('rpdRsn') }">
                                {{ state.validState.message }}
                            </p>
                        </td>
                    </tr>
                    <tr>
                        <th scope="row">필수여부<span class="ess"><span class="offscreen">필수입력</span></span></th>
                        <td>
                            <div class="reg-group">
                                <div class="reg-item">
                                    <span class="radio">
                                        <input v-model="formData.esnClusYn" value="Y" id="esnClusY" name="esnClusYn"
                                            type="radio" :disabled="state.pageType !== 'regist'" />
                                        <label for="esnClusY">필수</label>
                                    </span>
                                    <span class="radio">
                                        <input v-model="formData.esnClusYn" value="N" id="esnClusN" name="esnClusYn"
                                            type="radio" :disabled="state.pageType !== 'regist'" />
                                        <label for="esnClusN">선택</label>
                                    </span>
                                </div>
                            </div>
                        </td>
                        <th scope="row">중요내용변경<span class="ess"><span class="offscreen">필수입력</span></span></th>
                        <td>
                            <div class="reg-group">
                                <div class="reg-item">
                                    <span class="checkbox">
                                        <input v-model="formData.impaCtsChgYn" true-value="Y" false-value="N"
                                            id="impaCtsChgYn" name="impaCtsChgYn" type="checkbox" @change="changeImpaCtsChgYn" />
                                        <label for="impaCtsChgYn">중요내용변경 여부(30일 전 사전공지가 필요합니다.)</label>
                                    </span>
                                </div>
                            </div>
                        </td>
                    </tr>
                    <tr>
                        <th scope="row">배포일자<span class="ess"><span class="offscreen">필수입력</span></span></th>
                        <td colspan="3">
                            <div class="reg-group">
                                <div class="reg-item">
                                    <div class="ui-datepicker">
                                        <DateSingle :setDay="formData.dstrbDt" :disabled="!true" ref="dstrbDt" :disabledDates="state.disabledDates"
                                            @onSelectDate="onSelectPickerDstrbDt"></DateSingle>
                                    </div>
                                    <p v-if="checkValidState('dstrbDt')" class="input-guide"
                                        :class="{ 'error': checkValidState('dstrbDt') }">
                                        {{ state.validState.message }}
                                    </p>
                                </div>
                            </div>
                        </td>
                    </tr>
                    <tr v-if="formData.clusMngShpCd === '248001'">
                        <td colspan="4">
                            <div class="editor_container">
                                <ck-editor :model-value="formData.clusCts" :editor="state.ckeditor" />
                            </div>
                            <p v-if="checkValidState('clusCts')" class="input-guide"
                                :class="{ 'error': checkValidState('clusCts') }">
                                {{ state.validState.message }}
                            </p>
                        </td>
                    </tr>
                    <tr v-if="formData.clusMngShpCd === '248002'">
                        <td colspan="4">
                            <div class="ui-terms-type">
                                <div class="ui-var-list">
                                    <div class="ui-var-item" v-for="(item, index) in state.termsVariable" :key="index">
                                        <div class="var-name">
                                            <input type="text" v-model="item.vrbNm" class="form-control" placeholder="변수명"
                                                @input="changeVariable(item, index)" />
                                        </div>
                                        <div class="var-guide">
                                            <input type="text" v-model="item.vrbDscr" class="form-control"
                                                placeholder="변수명 설명" @input="changeVariable(item, index)" />
                                        </div>
                                    </div>
                                </div>
                                <div class="ui-editor">
                                    <div class="editor_container">
                                        <!-- <ck-editor v-model="formData.clusCts" :editor="state.ckeditor" /> -->
                                        <ck-editor :editor="state.ckeditor" :model-value="formData.clusCts" />
                                    </div>
                                    <p v-if="checkValidState('clusCts')" class="input-guide"
                                        :class="{ 'error': checkValidState('clusCts') }">
                                        {{ state.validState.message }}
                                    </p>
                                </div>
                            </div>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
        <div class="btn-bottom-set flex justify-center">
            <!-- 등록 pageType: regist -->
            <template v-if="state.pageType === 'regist' || state.pageType === 'add'">
                <button type="button" class="btn btn-sl nega" @click="cancelCreate">취소</button>
                <button type="button" class="btn btn-sl posi" @click="createTerms">등록</button>
            </template>
            <!-- 상세 pageType: detail -->

            <template v-else>
                <button type="button" class="btn btn-sl nega" @click="goToPage('/policy/list')">목록</button>
                <button v-if="state.clusMngStCd === '251002' || state.clusMngStCd === '251003'" type="button"
                    class="btn btn-sl posi" @click="checkDel">삭제</button>
                <!-- 251002 : 적용중 -->
                <button v-if="state.clusMngStCd === '251002'" type="button" class="btn btn-sl posi" @click="checkEdit">개정버전
                    추가</button>
                <button v-else-if="state.clusMngStCd === '251003'" type="button" class="btn btn-sl posi"
                    @click="checkEdit">수정</button>
            </template>
        </div>

        <div class="ui-section">
            <div class="tbl-wrap">
                <subTitleBar :subTitle="'이력관리'" />
                <NoData v-if="state.termsHistory.length === 0" :nodatatext="'조회된 데이터가 없습니다.'"></NoData>
                <div v-else ref="agGrid">
                    <AgGridVue :columnDefs="state.tableColum_c" :defaultColDef="state.defaultColDef"
                        :domLayout="state.domLayout" :rowData="state.termsHistory" @cell-clicked="onRowSelect"
                        :suppressRowClickSelection="true" @grid-ready="onGridReady" @selection-changed="onRowSelect"
                        :rowSelection="'multiple'" class="ag-theme-alpine" style="width:100%">
                    </AgGridVue>
                    <PageNavigation :cntPerPage='pager.size' :itemCount='pager.totalCnt' :currentPage="pager.current"
                        @changedPage="onChangedPage" />
                </div>
            </div>
        </div>
    </section>

    <DefaultModal :buttonCancel="'닫기'" :isShow="isShowClusMngOffr" :modalName="'isShowClusMngOffr'" modalTitle="서비스제공자"
        @modalclose="modalClose">
        <template #modalcontent>
            <!-- <SellerSerch :admnSn="state.admnSn"/> -->
            <ServiceProvideModal @selectPartner="selectPartner" />
        </template>
    </DefaultModal>
    <DefaultModal :buttonCancel="'취소'" :buttonConfirm="'등록'" :isShow="isShowClusMngTgp" :modalName="'isShowClusMngTgp'"
        modalTitle="서비스대상자" @modalclose="modalClose">
        <template #modalcontent>
            <!-- <SellerSerch :admnSn="state.admnSn"/> -->
            <div class="ui-title-3">
                <h3>서비스대상자</h3>
            </div>
        </template>
    </DefaultModal>
</template>
<script>
import { useRoute, useRouter } from 'vue-router';
import { reactive, onMounted, onUnmounted, watch, inject, ref, computed } from 'vue';
import { _getTermsGroup, _getTermsType, _getTermsTypeDetail, _createTerms, _updateTerms, _deleteTerms, _getTermsDetail, _getTermsHistory } from '@/api/terms';
import { useCommFunc, initializeEditor } from '@/core/helper/common.js';
import { authCommFunc } from '@/core/helper/authComm.js';
import { commoCode } from '@/data/commcode';
import { useStore } from 'vuex';

import CKEditor from '@ckeditor/ckeditor5-vue';
import ClassicEditor from '@ckeditor/ckeditor5-editor-classic/src/classiceditor';

import DateSingle from '@/components/ui/DateSingle.vue';
import DefaultModal from '@/plugins/modal/modal/DefaultModal.vue';
import ServiceProvideModal from './components/ServiceProvideModal.vue';

export default {
    components: {
        DateSingle,
        DefaultModal,
        ServiceProvideModal,
        'ck-editor': CKEditor.component
    },
    setup() {
        const store = useStore();
        const route = useRoute();
        const router = useRouter();
        const $Modal = inject('$Modal');
        const dayJS = inject('dayJS');
        const { goToPage } = useCommFunc();
        const commRadio = ref(null);
        const toDay = dayJS();

        /**
         * 권한은 스토어에서 가져옴 (권한여부는 메뉴리스트에서 가져온다)
         * store.state.getMenuItem.menuInfo
         * "auth1RegistYn": "Y/N",  등록
         * "auth2UpdateYn": "Y/N",  수정
         * "auth3DeleteYn": "Y/N",  삭제
         * "auth4ApproveYn": "Y/N", 승인
         * "auth5DownloadYn": "Y/N", 다운 
         * "auth6MaskingYn": "Y/N" 마스킹
         */
        const { onChangeEditRol, onChangeDelRol } = authCommFunc();
        const menuInfo = computed(() => store.state.getMenuItem.menuInfo);

        const isShowClusMngOffr = ref(false); // 서비스제공자 modal
        const isShowClusMngTgp = ref(false); // 서비스대상자 modal

        const initColum = ref([
            { headerName: '번호', field: 'no', valueGetter: 'node.rowIndex + 1', maxWidth: 100 },
            { headerName: '제개정사유', field: 'rpdRsn', flex: 1 },
            { headerName: '제개정일자', field: 'rpdDt', flex: 1 },
            { headerName: '상태', field: 'clusMngStCdNm', flex: 1 },
            { headerName: '배포일자', field: 'dstrbDt', flex: 1 },
            { headerName: '수정일시', field: 'lastUpdDt', flex: 1 }
        ]);

        const state = reactive({
            ckeditor: ClassicEditor,
            // editorconfig: EditorOptions.editorConfig,
            pagesize: 10,
            dateFormat: 'YYYY-MM-DD', // datepicker 포멧값
            termsTypeAll: [], // 약관유형목록
            termsType: computed(() => state.termsTypeAll.filter(d => d.clusGrpSn === formData.clusGrpSn)), // 약관유형목록 (약관그룹 filter)
            // formData.clusTyCd: selected type
            selectedTermsType: computed(() => state.termsType.filter(d => d.tlusSn === formData.tlusSn)),
            termsGroup: [], // 약관그룹목록
            clusTyCd: commoCode.termsCode.clusTyCd, // 약관유형
            // tlusShpCd: commoCode.termsCode.tlusShpCd, // 관리형태
            clusMngOff: '', // (선택된) 서비스제공자
            termsVariable: [], // 변수

            validState: {
                type: '', // 약관그룹(termsGroup), 약관유형(clusTyCd), 약관명(clusNm)
                errState: false, // error state
                message: '' // input message
            },

            pageType: 'regist', // 등록(regist) | 상세 (detail) | 개정버전추가(add)
            clusMngStCd: '', // 상태코드 (공통코드 : 251000)-251001:최초작성중/251002:적용중/251003:적용대기/251004:사용하지않음

            formDataDetail: null, // 약관상세

            tableColum_c: _.clone(initColum.value),
            // 테이블 옵션
            defaultColDef: {
                sortable: false,
                filter: false,
                resizable: true,
                flex: 1,
                headerClass: 'centered',
                cellClass: 'centered'
            },
            gridApi: null,
            gridColumApi: null,
            domLayout: 'autoHeight',
            // 약관이력
            termsHistory: [],
            checkDstrbDt: dayJS().add(7, 'day').format('YYYY-MM-DD'), // 배포일자 확인용 날짜 (중요내용변경 여부에따라 당일 기준 7일 30일 이후 선택 가능)
            disabledDates: {
                min: dayJS().add(7, 'day').format('YYYY-MM-DD'),
                max: null
            }
        });

        /**
         * @data
         */
        const formData = reactive({
            clusGrpSn: '', // 약관그룹순번
            tlusSn: '',
            // tlusSn: computed(() => !_.isEmpty(state.selectedTermsType) ? state.selectedTermsType[0].tlusSn : ''), // 약관유형별템플릿순번
            clusTyCd: computed(() => !_.isEmpty(state.selectedTermsType) ? state.selectedTermsType[0].clusTyCd : ''), // 약관유형코드 246001:이용약관(미정)/246002:개인정보처리방침(미정)/246003:제2자 정보제공동의(미정)/246004:위치정보제공동의(미정)
            clusMngOffrTyCd: '', // 서비스제공자코드(공통코드 : 249000)-249001:오케어여부/249002:기업
            clusMngTgpTyCd: '250001', // 서비스대상자코드 250001:전체/250002:B2C그룹/250003:파트너/250004:파트너임직원구분
            clusMngOffrNtprSn: '', // 서비스제공자 기업번호
            clusMngShpCd: computed(() => !_.isEmpty(state.selectedTermsType) ? state.selectedTermsType[0].tlusShpCd : ''), // 약관관리형태코드
            clusNm: '', // 약관명,
            dstrbDt: dayJS().add(7, 'day').format('YYYY-MM-DD'), // 배포일자 2023-11-07
            rpdDt: dayJS().format('YYYY-MM-DD'), // 제개정일자 2023-11-07
            rpdRsn: '', // 제개정사유,
            esnClusYn: 'Y', // 필수약관여부 "Y"
            impaCtsChgYn: 'N', // 중요내용변경여부 "N"
            vrbCunt: 0, // 변수개수
            clusCts: '', // 약관내용 "약관내용템플릿~~"
            tacClusMngVrbMapInfo: [ // 약관유형변수매핑
                // {
                //     "clusMngVrbMapSn": 0,
                //     "clusMngSn": 0,
                //     "vrbIndnSqn": 1,
                //     "vrbNm": "기업명",
                //     "vrbDscr": "기업명설명",
                //     "lastUpdrSn": 1
                // }
            ]
        });

        // 페이징
        const pager = reactive({
            current: 1,
            currentPageSize: 1,
            size: computed(() => state.pagesize),
            offset: computed(() => (pager.current - 1) * pager.size),
            totalCnt: 0
        });

        watch(formData, () => {
            resetState();
        });

        watch(router, () => {
            console.log('router.query.detailTyCd', router.query.detailTyCd);
        });

        onMounted(async () => {
            resetVariable();
            getTermsGroup();
            await getTermsType();

            console.log('route.query', route.query);
            if (!_.isEmpty(route.query)) {
                console.log('query not empty ? detail page');
                state.pageType = 'detail';
                state.clusMngStCd = route.query.clusMngStCd;
                await getTermsDetail();
                getTermsHistory();
            }

            
            if (formData.tlusSn) {
                const editor = await initializeEditor();
                editor.setData(formData.clusCts);
                editor.model.document.on('change', () => {
                    formData.clusCts = editor.getData();
                });
            }

            emitter.$on('onChangeEdit', onChangeEdit);
            emitter.$on('onChangeDel', onChangeDel);
        });

        onUnmounted(() => {
            emitter.$off('onChangeEdit');
            emitter.$off('onChangeDel');
        });

        /**
         * 수정 권한 체크
         */
        const checkEdit = () => {
            onChangeEditRol(menuInfo.value.auth2UpdateYn);
        };

        /**
         * 수정 권한 체크 callback
         */
        const onChangeEdit = () => {
            console.log('권한체크 callback', state.clusMngStCd);
            if (state.clusMngStCd === '251003') editTerms(); // 수정
            else if (state.clusMngStCd === '251002') addTerms(); // 개정버전 추가
        };

        /**
         * 삭제 권한 체크
         */
        const checkDel = async () => {
            await onChangeDelRol(menuInfo.value.auth3DeleteYn);
        };

        /**
         * 삭제 권한 체크 callback
         */
        const onChangeDel = () => {
            deleteTerms();
        };

        // 페이징 처리
        const onChangedPage = (pagenum) => {
            pager.current = pagenum;
            //테이블 인덱스 번호 처리
            initColum.value[0].valueGetter = 'node.rowIndex + ' + Number(pager.size * (pager.current - 1) + 1);
            getTermsHistory();
        };

        /**
         * @set variable
         */
        const resetVariable = () => {
            state.termsVariable = [];
            for (let i = 0; i < 20; i++) {
                const item = {
                    clusMngVrbMapSn: 0,
                    clusMngSn: route.query.clusMngSn,
                    vrbIndnSqn: i + 1,
                    vrbNm: '',
                    vrbDscr: ''
                };
                state.termsVariable.push(item);
            }
        };

        /**
         * 변수 수정 시 formData 반영
         */
        const setVariable = () => {
            const items = state.termsVariable.filter(d => !_.isEmpty(d.vrbNm));
            console.log('setVariable filter', state.termsVariable, items);
            formData.tacClusMngVrbMapInfo = items;
        };

        /**
         * @change 변수
         */
        const changeVariable = (item, index) => {
            // console.log('change', event.target.value, item, index);

            setVariable();
        };

        // 컬럼 변경
        const resetTable = () => {
            const columlist = _.clone(initColum.value);
            state.tableColum_c = columlist.filter(item => !state.filterCoulm.includes(item.headerName));
            return state.filterCoulm;
        };

        /**
         * @validation 상태 초기화
         */
        const resetState = () => {
            state.validState.type = ''; // validation
            state.validState.errState = false;
            state.validState.message = '';
        };

        /**
         * 약관그룹조회
         */
        const getTermsGroup = async () => {
            try {
                const params = {
                    size: 10000,
                    offset: 0,
                    clusGrpNm: ''
                };
                const response = await _getTermsGroup(params);

                console.log('>> get', response);
                state.termsGroup = response.data.data.list;
                // pager.totalCnt = response.data.data.totalCnt;
            } catch (error) {
                console.log(error);
            }
        };

        /**
         * 약관유형 목록 조회
         */
        const getTermsType = async () => {
            try {
                console.log(formData.clusGrpSn);
                const params = {
                    clusGrpSn: formData.clusGrpSn, // 약관그룹순번
                    clusTyCd: formData.clusTyCd, // 약관유형코드
                    size: 10000,
                    offset: 0
                };
                const response = await _getTermsType(params);
                console.log('response', response);
                state.termsTypeAll = response.data.data.list;
            } catch (error) {
                console.log(error);
            }
        };

        /**
         * 약관유형 상세 조회
         */
        const getTermsTypeDetail = async (e) => {
            try {
                const isChange = formData.clusCts ? true : false;
                const target = state.termsTypeAll.filter(d => Number(d.tlusSn) === Number(e.target.value))[0];
                // console.log(e.target.value, state.termsTypeAll, target);
                const params = {
                    tlusSn: target.tlusSn,
                    clusGrpSn: target.clusGrpSn,
                    clusTyCd: target.clusTyCd
                };
                const response = await _getTermsTypeDetail(params);
                const _data = response.data.data;
                console.log('getTermsDetail params', state.termsTypeAll, e.target.value, params, _data);
                formData.clusCts = _data.tlusClusCts; // 약관내용
                formData.tacClusMngVrbMapInfo = _data.tacClusTlusVrbMapList;
                /**
                 * 상세 진입시 detail 정보 변수 반영
                 * vrbIndnSqn | indnSqn 변수 순번명이 다름
                 */
                state.termsVariable = state.termsVariable.map(d => {
                    const item = formData.tacClusMngVrbMapInfo.find(v => d.vrbIndnSqn === v.indnSqn) || d;
                    item.vrbIndnSqn = item.vrbIndnSqn || item.indnSqn;
                    return item;
                });

                // const editor = await ClassicEditor.create(document.querySelector('.editor_container')

                if (isChange) {
                    document.querySelector('.editor_container').nextElementSibling.remove();
                }
                const editor = await initializeEditor();
                editor.setData(formData.clusCts);
                editor.model.document.on('change', () => {
                    formData.clusCts = editor.getData();
                });

            } catch (error) {
                console.log(error);
            }
        };

        /**
         * 약관 상세 조회
         */
        const getTermsDetail = async () => {
            try {
                console.log('약관 상세 조회');
                const params = {
                    clusMngSn: route.query.clusMngSn,
                    detailTyCd: state.pageType === '' ? 'DC' : route.query.detailTyCd
                };
                const response = await _getTermsDetail(params);
                console.log('getTermsDetail', response.data);
                state.formDataDetail = response.data.data;
                // set formData
                formData.clusGrpSn = state.formDataDetail.clauseInfo.clusGrpSn; // 약관그룹순번
                // formData.tlusSn: computed(() => !_.isEmpty(state.selectedTermsType) ? state.selectedTermsType[0].tlusSn : ''), // 약관유형별템플릿순번
                formData.tlusSn = state.formDataDetail.clauseInfo.tlusSn; // 약관유형코드 246001:이용약관(미정)/246002:개인정보처리방침(미정)/246003:제2자 정보제공동의(미정)/246004:위치정보제공동의(미정)
                // formData.clusTyCd = state.formDataDetail.clauseInfo.clusTyCd; // 약관유형코드 246001:이용약관(미정)/246002:개인정보처리방침(미정)/246003:제2자 정보제공동의(미정)/246004:위치정보제공동의(미정)
                formData.clusMngOffrTyCd = state.formDataDetail.clauseInfo.clusMngOffrTyCd;  // 서비스제공자코드(공통코드 : 249000)-249001:오케어여부/249002:기업
                // 서비스 제공자
                formData.clusMngOff = state.formDataDetail.clauseInfo.clusMngOffrNtprSnNm;
                formData.clusMngOffrNtprSn = state.formDataDetail.clauseInfo.clusMngOffrNtprSn;
                formData.clusMngOffrTyCd = state.formDataDetail.clauseInfo.clusMngOffrTyCd;

                formData.clusMngTgpTyCd = state.formDataDetail.clauseInfo.clusMngTgpTyCd;  // 서비스대상자코드 250001:전체/250002:B2C그룹/250003:파트너/250004:파트너임직원구분
                formData.clusMngOffrNtprSn = state.formDataDetail.clauseInfo.clusMngOffrNtprSn;  // 서비스제공자 기업번호
                // formData.clusMngShpCd: computed(() => !_.isEmpty(state.selectedTermsType) ? state.selectedTermsType[0].tlusShpCd : ''), // 약관관리형태코드
                formData.clusNm = state.formDataDetail.clauseInfo.clusNm; // 약관명,
                formData.dstrbDt = dayJS(state.formDataDetail.clauseInfo.dstrbDt).format('YYYY-MM-DD'); // 배포일자 2023-11-07
                formData.rpdDt = dayJS(state.formDataDetail.clauseInfo.rpdDt).format('YYYY-MM-DD'); // 제개정일자 2023-11-07
                formData.rpdRsn = state.formDataDetail.clauseInfo.rpdRsn; // 제개정사유
                formData.esnClusYn = state.formDataDetail.clauseInfo.esnClusYn; // 필수약관여부 "Y"
                formData.impaCtsChgYn = state.formDataDetail.clauseInfo.impaCtsChgYn; // 중요내용변경여부 "N"
                formData.vrbCunt = state.formDataDetail.clauseInfo.vrbCunt; // 변수개수
                formData.clusCts = state.formDataDetail.clauseInfo.clusCts; // 약관내용 "약관내용템플릿~~"

                formData.tacClusMngVrbMapInfo = state.formDataDetail.tacClusMngVrbMapInfo;
                /**
                 * 상세 진입시 detail 정보 변수 반영
                 */
                state.termsVariable = state.termsVariable.map(d => formData.tacClusMngVrbMapInfo.find(v => d.vrbIndnSqn === v.vrbIndnSqn) || d);


            } catch (error) {
                console.log(error);
            }
        };

        /**
         * 약관이력 조회
         */
        const getTermsHistory = async () => {
            try {
                const params = {
                    clusMngSn: route.query.clusMngSn,
                    size: pager.size,
                    offset: pager.offset
                };
                const response = await _getTermsHistory(params);
                state.termsHistory = response.data.data.list;
                pager.totalCnt = response.data.data.totalCnt;
            } catch (error) {
                console.log(error);
            }
        };

        const datePickerOpen = () => {
            setTimeout(() => {
                document.getElementsByClassName('ui-modal-body')[0].scrollTop = document.getElementsByClassName('ui-modal-body')[0].scrollHeight - 288;
            }, 200);
        };

        const setDisabledDates = () => {
            // console.log(formData.impaCtsChgYn, e.target._modelValue);
            // formData.dstrbDt = (formData.impaCtsChgYn === 'Y') ? dayJS().add(1, 'month').format('YYYY-MM-DD') : dayJS().add(7, 'day').format('YYYY-MM-DD');
            // state.checkDstrbDt = (formData.impaCtsChgYn === 'Y') ? dayJS().add(1, 'month').format('YYYY-MM-DD') : dayJS().add(7, 'day').format('YYYY-MM-DD');

            // 30일 이후 선택가능
            state.disabledDates.min = formData.impaCtsChgYn === 'Y' ? dayJS().add(1, 'month').format('YYYY-MM-DD') : dayJS().add(7, 'day').format('YYYY-MM-DD');
        };

        /**
         * 셀렉트박스 선택
         * { @code: cmnCd, @name: cmnCdNm, @type }
         */
        const selectedOptions = (code, name, type) => {
            // console.log(code, name, type);
            if (type === 'tlusShpCd') { // 약관유형별템플릿관리형태코드
                formData.tlusShpCd = code;
            }
        };

        /**
         * 취소
         */
        const cancelCreate = () => {
            $Modal.confirm({
                title: '',
                message: '작성한 내용이 있을 경우 저장되지 않습니다. 작성을 취소하시겠습니까?',
                buttonText: {
                    confirm: '확인',
                    cancel: '취소'
                }
            }).then(success => {
                console.log(success);
                if (success === 'confirm') {
                    goToPage('/policy/list');
                }
            }).catch(error => {
                console.log(error);
            });
        };

        /**
         * 등록
         */
        const createTerms = async () => {
            try {
                const params = {
                    ...formData
                };
                console.log('createTerms params', params);
                if (validFormData()) {
                    const response = await _createTerms(params);
                    console.log('등록 response', response);
                    if (response.data.code === 'OK') {
                        $Modal.alert({message: '등록되었습니다.', buttonText: {ok: '확인'}}).then(v => {
                            goToPage('/policy/list');
                        });
                    } else {
                        let msg = (response.data != null && response.data.message != null) ?  response.data.message : '등록을 실패하였습니다.';
                        $Modal.alert({message: msg, buttonText: {ok: '확인'}}).then(v => {
                            goToPage('/policy/list');
                        });
                    }
                }
            } catch (error) {
                console.log(error);
            }
        };

        /**
         * 수정
         */
        const editTerms = async () => {
            try {
                console.log('수정', formData);
                const params = {
                    clusMngSn: route.query.clusMngSn,
                    vrbCunt: formData.vrbCunt,
                    clusNm: formData.clusNm,
                    dstrbDt: formData.dstrbDt,
                    rpdDt: formData.rpdDt,
                    rpdRsn: formData.rpdRsn,
                    impaCtsChgYn: formData.impaCtsChgYn,
                    clusCts: formData.clusCts,
                    tacClusMngVrbMapInfo: [...formData.tacClusMngVrbMapInfo]
                };

                // console.log('createTerms params', params);
                if (validFormData()) {
                    const response = await _updateTerms(params);
                    console.log('수정 response', response);
                    toast('수정되었습니다.', 1000, 'success');
                    setTimeout(() => {
                        goToPage('/policy/list');
                    }, 1000);
                }
            } catch (error) {
                console.log(error);
            }
        };

        /**
         * 삭제
         */
        const deleteTerms = () => {
            $Modal.confirm({
                title: '',
                message: `${formData.clusNm}을(를) 삭제 하시겠습니까?`,
                buttonText: {
                    confirm: '확인',
                    cancel: '취소'
                }
            }).then(success => {
                console.log(success);
                if (success === 'confirm') {
                    deleteTermsConfirm();
                }
            }).catch(error => {
                console.log(error);
            });
        };
        const deleteTermsConfirm = async () => {
            try {
                console.log('삭제');
                const params = {
                    clusMngSn: route.query.clusMngSn
                };
                const response = await _deleteTerms(params);

                if (response.data.code === 'OK') {
                    toast('삭제되었습니다.', 1000, 'success');
                    setTimeout(() => {
                        goToPage('/policy/list');
                    }, 1000);
                }

            } catch (error) {
                console.log(error);
            }
        };

        /**
         * 개정버전 추가
         */
        const addTerms = () => {
            console.log('개정버전 추가');
            // state.pageType = 'add';
            // getTermsDetail();
            createTerms();
        };

        /**
         * @validate
         */
        const validFormData = () => {
            // 'clusMngStCd', 'tlusSn', 'clusMngOffrNtprSn', 'clusMngShpCd', 'dstrbDt', 'rpdDt', 'esnClusYn', 'impaCtsChgYn', 'vrbCunt'
            const target = ['dstrbDt',
                'clusGrpSn', 'clusTyCd', 'clusMngOffrTyCd', 'clusMngTgpTyCd', 'clusNm', 'rpdRsn', 'clusCts'
            ];
            for (const item of target) {
                console.log(item, dayJS(formData[item]).isBefore(dayJS(state.checkDstrbDt)));
                state.validState.target = item;
                let msg = '';
                if (item === 'dstrbDt' && dayJS(formData[item]).isBefore(dayJS(state.checkDstrbDt))) {
                    state.validState.message = `${state.checkDstrbDt} 이후 날짜만 선택가능합니다.`;
                    state.validState.errState = true;
                    break;
                }
                if (item === 'clusGrpSn') msg = '약관그룹을 선택해주세요.';
                else if (item === 'clusTyCd') msg = '약관유형을 선택해주세요.';
                else if (item === 'clusMngOffrTyCd') msg = '서비스제공자코드를 선택해주세요.';
                else if (item === 'clusMngTgpTyCd') msg = '서비스대상자코드를 선택해주세요.';
                else if (item === 'clusNm') msg = '약관명을 입력해주세요.';
                else if (item === 'rpdRsn') msg = '제개정사유를 입력해주세요.';
                else if (item === 'clusCts') msg = '약관내용을 입력해주세요.';
                state.validState.message = msg;


                // console.log(item, formData[item], !formData[item]);
                if (!formData[item]) {
                    state.validState.errState = true;
                    break;
                }

                if (item === 'clusNm' && formData[item].length < 4) {
                    state.validState.message = '약관명은 4~30자까지 입력가능합니다.';
                    state.validState.errState = true;
                    break;
                }
                if (item === 'rpdRsn' && formData[item].length < 4) {
                    state.validState.message = '제개정사유는 4~50자까지 입력가능합니다.';
                    state.validState.errState = true;
                    break;
                }

            }

            return !state.validState.errState;
        };

        const checkValidState = (type) => {
            return state.validState.target === type && state.validState.errState;
        };

        /**
         * 중요내용변경
         */
        const changeImpaCtsChgYn = (e) => {
            console.log(formData.impaCtsChgYn, e.target._modelValue);
            formData.dstrbDt = (formData.impaCtsChgYn === 'Y') ? dayJS().add(1, 'month').format('YYYY-MM-DD') : dayJS().add(7, 'day').format('YYYY-MM-DD');
            state.checkDstrbDt = (formData.impaCtsChgYn === 'Y') ? dayJS().add(1, 'month').format('YYYY-MM-DD') : dayJS().add(7, 'day').format('YYYY-MM-DD');
            // formData.dstrbDt = dayJS().format('YYYY-MM-DD');
            console.log(formData.dstrbDt);
            setDisabledDates();
        };

        /**
         * 서비스제공자 선택
         */
        const selectPartner = (target) => {
            console.log('서비스제공자 선택', target);

            formData.clusMngOff = target.ntprNm;
            formData.clusMngOffrNtprSn = target.ntprSn;
            formData.clusMngOffrTyCd = target.clusMngOffrTyCd;

            isShowClusMngOffr.value = false;
        };

        const onSelectPickerDstrbDt = (type, value, status) => {
            console.log(type, value, status);
            formData.dstrbDt = dayJS(value).format('YYYY-MM-DD');
        };
        const onSelectPickerRpdDt = (type, value, status) => {
            console.log(type, value, status);
            formData.rpdDt = dayJS(value).format('YYYY-MM-DD');
        };

        /**
        * 약관이력 선택 시
        * @onRowSelect
        */
        const onRowSelect = (e) => {
            console.log('onRowSelect', e);
            route.query.clusMngSn = e.data.clusMngSn;
            route.query.detailTyCd = 'DL';
            state.clusMngStCd = e.data.clusMngStCd;
            getTermsDetail();
        };

        /**
         * @modal
         */
        const modalOpen = (type) => {
            if (type === 'isShowClusMngOffr') isShowClusMngOffr.value = true;
            else if (type === 'isShowClusMngTgp') isShowClusMngTgp.value = true;
        };
        const modalClose = (type, name) => {
            console.log(type, name);
            isShowClusMngOffr.value = false;
            isShowClusMngTgp.value = false;
        };

        return {
            _,
            state,
            formData,
            goToPage,
            pager,
            commRadio,
            selectedOptions,
            changeVariable,
            toDay,
            isShowClusMngOffr,
            isShowClusMngTgp,
            datePickerOpen,
            cancelCreate,
            createTerms,
            editTerms,
            deleteTerms,
            addTerms,
            checkValidState,
            getTermsTypeDetail,
            selectPartner,
            onSelectPickerDstrbDt,
            onSelectPickerRpdDt,
            changeImpaCtsChgYn,
            resetTable,
            modalOpen,
            modalClose,
            onRowSelect,
            onChangedPage,

            checkEdit,
            checkDel
        };
    }
};

</script>