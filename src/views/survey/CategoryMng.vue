<template>
    <section class="s1">
        <div class="ui-data-filter">
            <div class="form-item">
                <div class="item">
                    <label>조회조건</label>
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
                    <label>노출여부</label>
                    <span class="input">
                        <span class="dv">
                            <span class="radio">
                                <input id="openRdo1" name="openRdoGroup" type="radio" value='' v-model="searchData.postUpYn">
                                <label for="openRdo1">전체</label>
                            </span>
                            <span class="radio">
                                <input id="openRdo2" name="openRdoGroup" type="radio" value='Y' v-model="searchData.postUpYn">
                                <label for="openRdo2">노출</label>
                            </span>
                            <span class="radio">
                                <input id="openRdo3" name="openRdoGroup" type="radio" value='N' v-model="searchData.postUpYn">
                                <label for="openRdo3">비노출</label>
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
import { _getSurveyCategoryList } from '@/api/survey.js';
import { dmCommFunc } from '@/views/pntmng/common/common.js';
import { useRouter, useRoute } from 'vue-router';

export default {
    components: {},
    setup() {

        const { toggleSearch, searchShow, modal, popInfo, isShow } = dmCommFunc();
        const store = useStore();
        const router = useRouter();

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
            { headerName: '번호', field: 'no', valueGetter: 'node.rowIndex + 1', width: 100 },
            { headerName: '설문카테고리코드', field: 'categoryCode', flex: 1 },
            { headerName: '설문카테고리명',
                field: 'categoryName',
                flex: 1,
                cellRenderer: params => {
                    return '<a href="#">' + params.value + '</a>';
                }
            },
            { headerName: '노출여부',
                field: 'postUpYn',
                flex: 1,
                cellRenderer: params => {
                    return params.value === 'Y' ? '노출' : '비노출';
                } },
            { headerName: '등록일시', field: 'fstRgsDt', flex: 1 },
            { headerName: '등록자', field: 'fstRgtrNm', flex: 1 }
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
            searchTypeList: [
                { label: '선택', value: '' },
                { label: '설문제목', value: 'categoryName' },
                { label: '설문코드', value: 'categoryCode' }
            ],
            searchParam: {
                page: '',
                size: '',
                offset: '',
                categoryName: '',
                categoryCode: '',
                postUpYn: ''
            }
        });

        const searchData = reactive({
            searchGugun: '',
            searchGugunText: '',
            postUpYn: ''
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
            initColum.value[0].valueGetter = 'node.rowIndex + ' + Number(pager.size * (pager.current - 1) + 1);
            getSurveyCategoryList();
        };

        const getSurveyCategoryList = async () => {

            state.searchParam.page = pager.current;
            state.searchParam.size = pager.size;
            state.searchParam.offset = pager.offset;

            const response = await _getSurveyCategoryList(state.searchParam);

            if (response.code == 'OK') {
                state.rowData = response.data.categoryList;
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
            if (code == 'categoryName') {
                router.push({path: '/survey/category/detail', state: {...e.data}});
            }
        };

        const onSearch = () => {
            
            state.searchParam.categoryCode = searchData.searchGugun === 'categoryCode' ? searchData.searchGugunText : '';
            state.searchParam.categoryName = searchData.searchGugun === 'categoryName' ? searchData.searchGugunText : '';
            state.searchParam.postUpYn = searchData.postUpYn;

            onChangedPage(1);
            // console.log('검색버튼 클릭', searchData);
        };

        const onInitData = () => {
            
            searchData.searchGugun = '';
            searchData.searchGugunText = '';
            searchData.postUpYn = '';

            state.searchParam = {
                page: '',
                size: '',
                offset: '',
                categoryName: '',
                categoryCode: '',
                postUpYn: ''
            };
            onChangedPage(pager.current);
        };

        const goRegist = () => {
            router.push('/survey/category/regist');
        };

        onMounted(() => {
            onChangedPage(1);
        });

        return {
            initColum,
            pager,
            menuInfo,
            state,
            onChangeDownRol,
            onChangeRegistRol,
            searchData,
            selectedOptions,
            sizeToFit,
            resetTable,
            onChangedPage,
            onGridReady,
            cellClicked,
            onSearch,
            onInitData,
            checkOptions,
            goRegist
        };
    }
};
</script>