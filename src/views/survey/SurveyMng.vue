<template>
    <section class="s1">
        <div class="ui-data-filter">
            <div class="form-item">
                <div class="item">
                    <label>검색조건</label>
                    <span class="input">
                        <span class="dv">
                            <select class="custom-select sm" v-model="searchData.searchGugun" @change="searchData.searchGugunText = ''">
                                <option v-for="(item, index) in state.searchTypeList" :key="index" :value="item.value">
                                    {{ item.label }}
                                </option>
                            </select>
                        </span>
                        <span class="dv">
                            <input type="text" class="form-control sm" v-model="searchData.searchGugunText">
                        </span>
                    </span>
                </div>
                <div class="item">
                    <label>발행상태</label>
                    <span class="input">
                        <span class="dv">
                            <!-- <select class="custom-select sm" v-model="searchData.publicationStatusSectionCode" @change="searchData.publicationStatusSectionCode = ''">
                                <option value="">전체</option>
                                <option value="330002">발행완료</option>
                                <option value="330001">임시저장</option>
                                <option value="330003">종료</option>
                            </select> -->
                            <select class="custom-select sm" v-model="searchData.publicationStatusSectionCode"  @change="state.publicationStatusSectionCode = ''">
                                <option v-for="(item, index) in surveyCode.publicationStatus" :key="index" :value="item.value">
                                    {{ item.name }}
                                </option>
                            </select>
                        </span>
                    </span>
                </div>
                <div class="item">
                    <label>사용여부</label>
                    <span class="input">
                        <span class="dv">
                            <span class="radio">
                                <input id="openRdo1" name="openRdoGroup" type="radio" value='' v-model="searchData.useYn">
                                <label for="openRdo1">전체</label>
                            </span>
                            <span class="radio">
                                <input id="openRdo2" name="openRdoGroup" type="radio" value='Y' v-model="searchData.useYn">
                                <label for="openRdo2">사용</label>
                            </span>
                            <span class="radio">
                                <input id="openRdo3" name="openRdoGroup" type="radio" value='N' v-model="searchData.useYn">
                                <label for="openRdo3">미사용</label>
                            </span>
                        </span>
                    </span>
                </div>
                <div class="btn-filter-set">
                    <button type="button" class="btn btn-sm" @click="onInitData">
                        <span class="ico-reload sg"></span>
                        <span class="offscreen">초기화</span>
                    </button>
                    <button type="button" class="btn btn-sm"  @click="onSearch">
                        <span class="ico-search"></span>검색</button>
                </div>
            </div>
        </div>
        <div class="tbl-wrap">
            <div class="table-util flex space-between">
                <div class="btn-set-m flex">
                    <button type="button" class="btn btn-ss" @click="goRemove">삭제</button>
                    <button type="button" class="btn btn-ss" @click="goRegist">등록</button>
                </div>
                <div class="btn-set-m flex align-end">
                    <span class="table-total">조회결과 총 <strong>{{pager.totalCnt.toLocaleString('ko')}}</strong>건</span>
                    <!-- <button type="button" class="btn btn-opt"
                        @click="onChangeDownRol(menuInfo.auth5DownloadYn, 'Y', exelParams)">
                        <span class="ico-download"></span>파일다운로드
                    </button> -->
                    <selectBox :selectType="'page'" @changedValue="selectedOptions" />
                    <button type="button" class="btn btn-opt-ico fit" @click="sizeToFit" ><span class="offscreen">컬럼 리사이징</span></button>
                    <button type="button" class="btn btn-opt-ico filter"  @click="resetTable"><span class="offscreen">컬럼 셋팅</span></button>
                </div>
            </div>
            <columlist :columlists="initColum"  @checkColum="checkOptions"/>
            <NoData :nodatatext="'조회된 데이터가 없습니다.'" v-if="state.rowData.length === 0"></NoData>
            <template v-else>
                <AgGridVue :defaultColDef="state.defaultColDef" :columnDefs="state.tableColum_c"
                    :rowData="state.rowData" @grid-ready="onGridReady" @cell-clicked="cellClicked"
                    :rowSelection="'multiple'" @selection-changed="onRowSelect" :suppressRowClickSelection="true"
                    class="ag-theme-alpine" :domLayout="'autoHeight'">
                </AgGridVue>
            </template>
            <PageNavigation :cntPerPage='pager.size' :itemCount='pager.totalCnt' :currentPage="pager.current"
                    @changedPage="onChangedPage" />
        </div>
    </section>
    
</template>
<script>
import { computed, reactive, onMounted, inject, ref, onUnmounted } from 'vue';
import { authCommFunc } from '@/core/helper/authComm.js';
import { useStore } from 'vuex';
import { _getQuestionList, stringToDate, _removeCategory, _removeQuestion } from '@/api/survey.js';
import { dmCommFunc } from '@/views/pntmng/common/common.js';
import { useRouter, useRoute } from 'vue-router';
import {surveyCode} from '@/data/commcode/survey.js';

export default {
    components: {},
    setup() {

        const { toggleSearch, searchShow, modal, popInfo, isShow } = dmCommFunc();
        const { onChangeDelRol } = authCommFunc();
        const store = useStore();
        const router = useRouter();
        const $Modal = inject('$Modal');
        const pager = reactive({
            current: 1,
            currentPageSize: 1,
            size: 10,
            offset: computed(() => (pager.current - 1) * pager.size),
            totalCnt: 0
        });


        const menuInfo = computed(() => store.state.getMenuItem.menuInfo);
        const { onChangeDownRol, onChangeRegistRol } = authCommFunc();

        const initColum = ref([
            { headerName: '선택', field: 'select', maxWidth: 50, checkboxSelection: true, headerCheckboxSelection: true },
            { headerName: '번호', field: 'no', valueGetter: 'node.rowIndex + 1',  width: 60},
            { headerName: '설문카테고리명', field: 'categoryName', flex: 1 },
            { headerName: '설문제목',
                field: 'questionTitle',
                flex: 1,
                cellRenderer: params => {
                    return '<a href="#">' + params.value + '</a>';
                }
            },
            { headerName: '버전', field: 'version',  width: 60},
            { headerName: '설문코드', field: 'questionCode',  width: 90},
            { headerName: '화면유형',
                field: 'screenTypeSectionCode',
                flex: 1,
                cellRenderer: params => {
                    const obj = surveyCode.screenTypeSectionCode.find(item => item.value === params.value);
                    return obj ? obj.name : '';
                    
                }
            },
            { headerName: '문항수', field: 'pageQuestionItemCount', flex: 1 },
            { headerName: '채점유형',
                field: 'markingTypeCode',
                flex: 1,
                cellRenderer: params => {
                    const obj = surveyCode.markingTypeCode.find(item => item.value === params.value);
                    return obj ? obj.name : '';
                }
            },
            { headerName: '시작일',
                field: 'postUpBeginDatetime',
                flex: 1,
                cellRenderer: params => stringToDate(params.value)
            },
            { headerName: '종료일',
                field: 'postUpEndDatetime',
                flex: 1,
                cellRenderer: params => stringToDate(params.value)
            },
            { headerName: '발행상태',
                field: 'publicationStatusSectionCode',
                flex: 1,
                cellRenderer: params => {
                    const obj = surveyCode.publicationStatus.find(item => item.value === params.value);
                    return obj ? obj.name : '';
                }
            },
            { headerName: '사용여부',
                field: 'useYn',
                flex: 1,
                cellRenderer: params => {
                    const obj = surveyCode.useYn.find(item => item.value === params.value);
                    return obj ? obj.name : '';
                }
            },
            { headerName: '미리보기',
                field: '',
                flex: 1,
                cellRenderer: params => {
                    return '<button type="button" class="btn btn-ss">미리보기</button>';
                } }
        ]);

        const state = reactive({
            filterCoulm: [],
            tableColum_c: _.clone(initColum),
            rowData: [],
            defaultColDef: {
                sortable: true,
                resizable: true,
                width: 50,
                headerClass: 'centered',
                cellClass: 'centered'
            },
            gridApi: null,
            gridColumApi: null,
            selectList: [],   //checkbox 정책 리스트
            memberAprv: null, //승인자 정보
            athrTypCd: '212001',
            menuCode: menuInfo.value.menuCode,
            selectQuestion: [],
            searchTypeList: [
                { label: '설문제목', value: 'questionTitle' },
                { label: '설문코드', value: 'questionCode' },
                { label: '설문카테고리명', value: 'categoryName' }
            ],
            searchParam: {
                page: '',
                size: '',
                offset: '',
                questionTitle: '',
                questionCode: '',
                categoryName: '',
                publicationStatusSectionCode: '',
                useYn: ''
            }
        });

        const searchData = reactive({
            searchGugun: 'questionTitle',
            searchGugunText: '',
            publicationStatusSectionCode: '',
            useYn: ''
        });

        //페이지당 리스트 게수 선택 옵션
        const selectedOptions = (value, type) => {
            pager.size = value;
            onChangedPage(1);
        };

        // 페이징 처리
        const onChangedPage = (num) => {
            state.selectList = [];
            pager.current = num;
            initColum.value[1].valueGetter = 'node.rowIndex + ' + Number(pager.size * (pager.current - 1) + 1);
            getQuestionList();
        };

        const getQuestionList = async () => {

            state.searchParam.page = pager.current;
            state.searchParam.size = pager.size;
            state.searchParam.offset = pager.offset;

            const response = await _getQuestionList(state.searchParam);

            if (response.code == 'OK') {
                state.rowData = response.data.questionList;
                pager.totalCnt = parseInt(response.data.totalCount);
            } else {
                modal(response.message);
            }
            // console.log('1234 : ', response.data.categoryList);
        };

        // 테이블 현재창에 맞춤
        const sizeToFit = () => {
            state.gridApi.sizeColumnsToFit();
        };
        
         // 컬럼 변경
        const resetTable = () => {
            const columlist = _.clone(initColum.value);
            state.tableColum_c = columlist.filter(item => !state.filterCoulm.includes(item.headerName));
        };

        // 삭제할 컬럼 선택
        const checkOptions = (value) => {
            state.filterCoulm = value;
        };

        // 테이블 리사이징을 위한 참조값
        const onGridReady = (params) => {
            state.gridApi = params.api;
            state.gridColumApi = params.columnApi;
            // console.log(params.columnApi);
        };

        //테이블 셀 선택
        const cellClicked = (e) => {
            const code = state.gridApi.getFocusedCell().column.colId;
            if (code == 'questionTitle') {
                console.log('cellClicked e.data : ', e.data);
                router.push({path: '/survey/detail', state: {...e.data}});
            }
        };

        const onSearch = () => {

            console.log('onSearch');
            
            state.searchParam.questionTitle = searchData.searchGugun === 'questionTitle' ? searchData.searchGugunText : '';
            state.searchParam.questionCode = searchData.searchGugun === 'questionCode' ? searchData.searchGugunText : '';
            state.searchParam.categoryName = searchData.searchGugun === 'categoryName' ? searchData.searchGugunText : '';
            state.searchParam.publicationStatusSectionCode = searchData.publicationStatusSectionCode;
            state.searchParam.useYn = searchData.useYn;
            // console.log('검색버튼 클릭', searchData);
            onChangedPage(1);
            
        };

        const onInitData = () => {

            searchData.searchGugun = 'questionTitle';
            searchData.searchGugunText = '';
            searchData.publicationStatusSectionCode = '';
            searchData.useYn = '';

            state.searchParam = {
                page: '',
                size: '',
                offset: '',
                questionTitle: '',
                questionCode: '',
                categoryName: '',
                publicationStatusSectionCode: '',
                useYn: ''
            };

            onChangedPage(pager.current);
        };

        const goRegist = () => {
            router.push('/survey/regist');
        };

        const goRemove = async () => {
            onChangeDel();

        };

        const onRowSelect = (e) => {
            state.selectQuestion = state.gridApi.getSelectedRows();
        };

        const onChangeDel = () => {
            console.log('selectQuestion : ', state.selectQuestion.length);
            if (state.selectQuestion.length === 0) {
                $Modal.simple({
                    message: '삭제할 리스트가 없습니다.',
                    buttonText: {
                        ok: '확인'
                    }
                });
            } else {
                $Modal.confirm({
                    title: '',
                    message: '삭제하시겠습니까?',
                    buttonText: {
                        confirm: '확인',
                        cancel: '취소'
                    }
                })
                    .then(success => {
                        if (success === 'confirm') {
                            removeQuestion();
                        
                        }
                    })
                    .catch(error => {
                        console.log(error);
                    });

            }
            
            
        };

        const removeQuestion = async () => {
            const params = state.selectQuestion.map(item => item.questionSerialNumber);
            console.log('removeQuestion params ', params);
            const response = await _removeQuestion(params);

            if (response.code == 'OK') {
                onChangedPage(1);
            } else {
                modal(response.message);
            }
        };

        onMounted(() => {
            onChangedPage(1);
            emitter.$on('onChangeDel', onChangeDel);
        });

        onUnmounted(() => {
            emitter.$off('onChangeDel');
        });

        return {
            initColum,
            pager,
            menuInfo,
            state,
            onChangeDownRol,
            onChangeRegistRol,
            searchData,
            surveyCode,
            selectedOptions,
            sizeToFit,
            resetTable,
            onChangedPage,
            onGridReady,
            cellClicked,
            onSearch,
            onInitData,
            checkOptions,
            goRegist,
            goRemove,
            onRowSelect
        };
    }
};
</script>