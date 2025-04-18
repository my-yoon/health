<template>
    <div>
        <div class="ui-data-filter">
            <div class="form-item">
                <div class="item">
                    <label>조건검색</label>
                    <span class="input">
                        <span class="dv">
                            <SubSelectBox v-model="formData.searchType" :list="state.serachTypetList"></SubSelectBox>
                        </span>
                        <span class="dv">
                            <input v-model="formData.searchText" class="form-control sm" type="text">
                        </span>
                    </span>
                </div>
                <div class="btn-filter-set">
                    <button class="btn btn-sm" type="button" @click="reloadList"><span class="ico-search"></span>조회</button>
                </div>
            </div>
        </div>
        <div class="tbl-wrap">
            <div class="table-util flex space-between">
                <div class="btn-set-m flex">
                    <button :disabled="state.mskgnRlsYn==='N'" class="btn btn-ss" type="button" @click="maskingUnlock">마스킹해제</button>
                </div>
                <div class="btn-set-m flex align-end">
                    <span class="table-total">조회결과 총 <strong>{{ pager.totalCnt }}</strong>건</span>
                    <SubSelectBox v-model="state.pagesize" :list="state.pageSizeList" @change="onChangedPage(pager.current)"/>
                    <button class="btn btn-opt-ico fit" type="button" @click="tableResize">
                        <span class="offscreen">컬럼 리사이징</span>
                    </button>
                    <button class="btn btn-opt-ico filter full" type="button" @click="resetTable">
                        <span class="offscreen">컬럼 셋팅</span>
                    </button>
                </div>
            </div>
            <columlist :columlists="initColum" @checkColum="checkOptions"/>
            <NoData v-if="state.userList.length === 0" :nodatatext="'조회된 데이터가 없습니다.'"></NoData>
            <div v-else>
                <AgGridVue :columnDefs="state.tableColum_c" :defaultColDef="state.defaultColDef" :domLayout="state.domLayout"
                           :rowData="state.userList" :suppressRowClickSelection="true"
                           class="ag-theme-alpine" rowSelection="multiple" @cell-clicked="onCellClicked" @grid-ready="onGridReady"/>
                <PageNavigation :cntPerPage='pager.size' :currentPage="pager.current" :itemCount='pager.totalCnt'
                                @changedPage="onChangedPage"/>
            </div>
        </div>
    </div>
</template>
-
<script>
import {getCurrentInstance, reactive, ref, onMounted, watch, computed} from 'vue';
import {_getQnaWireMemberList} from '@/api/customer.js';
import {useCommFunc} from '@/core/helper/common.js';
import SubSelectBox from '@/views/customer/components/SelectBox.vue';

export default {
    props: ['searchUserInfo'],
    emits: ['update:modelValue', 'selectUser'],
    components: {SubSelectBox},
    setup(props) {
        const {emit} = getCurrentInstance();
        const {tableResize} = useCommFunc();
        const initColum = ref([
            {headerName: '번호', field: 'no', valueGetter: 'node.rowIndex + 1', width: 70},
            {headerName: '회원번호', field: 'mbrSn', width: 100},
            {headerName: '회원명', field: 'memberName', width: 110},
            {headerName: '생년월일', field: 'memberBirth', width: 110},
            {headerName: '휴대폰번호', field: 'memberHhpNo', width: 110},
            {headerName: '이메일', field: 'memberEmail', flex: 1},
            //{headerName: '기업명', field: '기업명', width: 0}, // 2차 오픈
            {headerName: '성별', field: 'memberSexName', width: 80},
            {
                headerName: '선택',
                field: '선택',
                width: 85,
                cellRenderer: params => {
                    return '<button type="button" class="btn btn-ss">선택</button>';
                }
            }
        ]);


        const state = reactive({
            tableColum_c: _.clone(initColum.value),
            userList: [],
            filterCoulm: [],
            pagesize: 5,
            gridApi: null,
            gridColumApi: null,
            domLayout: 'autoHeight',
            //테이블 옵션
            defaultColDef: {
                sortable: false,
                filter: false,
                resizable: true,
                //flex: 1,
                headerClass: 'centered',
                cellClass: 'centered'
            },
            serachTypetList: [
                {label: '선택', value: ''},
                {label: '회원명', value: 'name'},
                //{label: '휴대폰번호', value: 'hhpno'}, //암호화 이슈로 비활성화
                //{label: '사번', value: 'corno'}, //2차 오픈
                {label: '회원번호', value: 'mbrno'}
            ],
            pageSizeList: [
                {label: '5개씩 보기', value: 5},
                {label: '10개씩 보기', value: 10},
                {label: '15개씩 보기', value: 15},
                {label: '20개씩 보기', value: 20}
            ],
            //마스킹해제여부
            mskgnRlsYn: 'Y'
        });

        const formData = ref({
            searchType: '',  // 검색조건
            searchText: null  // 검색내용
        });

        // 페이징 처리
        const pager = reactive({
            current: 1,
            currentPageSize: 1,
            size: computed(() => state.pagesize),
            offset: computed(() => (pager.current - 1) * pager.size),
            totalCnt: 0
        });

        const getQnaWireMemberList = async () => {
            try {
                let params = {
                    size: pager.size,
                    offset: pager.offset,
                    searchType: formData.value.searchType,
                    searchText: formData.value.searchText,
                    mskgnRlsYn: state.mskgnRlsYn,
                    page: 0
                };

                const response = await _getQnaWireMemberList(params);

                state.userList = response.data.data.list;

                pager.totalCnt = response.data.data.totalCnt;

            } catch (error) {
                console.log(error);
            }
        };

        //페이징 처리
        const onChangedPage = async (num) => {
            pager.current = num;
            //api호출
            await getQnaWireMemberList();
        };

        // 테이블 리사이징을 위한 참조값
        const onGridReady = (params) => {
            state.gridApi = params.api;
            state.gridColumApi = params.columnApi;
        };

        const clearList = (num) => {
            formData.value.searchType = ''; //공지검색구분
            formData.value.searchText = ''; //내용
            formData.value.page = num;

            onChangedPage(num);
        };

        const reloadList = () => {
            pager.current = 1;
            onChangedPage(pager.current);
        };

        const onCellClicked = (param) => {
            if (param.colDef.field === '선택') emit('selectUser', param.data);
        };

        const checkOptions = (value) => {
            state.filterCoulm = value;
        };

        const resetTable = () => {
            const columlist = _.clone(initColum.value);
            state.tableColum_c = columlist.filter(item => !state.filterCoulm.includes(item.headerName));
            return state.filterCoulm;
        };

        const maskingUnlock = () => {
            state.mskgnRlsYn = 'N';
            getQnaWireMemberList();
        };

        watch(() => formData.value.searchType, () => {
            //
            console.log('change');
            formData.value.searchText = '';
            getQnaWireMemberList();
        });
        
        onMounted(() => {
            getQnaWireMemberList();
        });

        return {
            state,
            formData,
            pager,
            initColum,
            onChangedPage,
            onGridReady,
            reloadList,
            clearList,
            onCellClicked,
            tableResize,
            checkOptions,
            resetTable,
            maskingUnlock
        };
    }
};
</script>