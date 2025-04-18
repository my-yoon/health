<template>
    <DefaultModal :buttonCancel="'닫기'" :modalName="'serviceGubunSearch'"
        modalTitle="서비스 구분 코드 검색" @modalclose="modalClose">
        <template #modalcontent>
            <div class="ui-data-filter sm mt-10">
                <div class="form-item">
                    <div class="item">
                        <span class="input">
                            <span class="dv">
                                <select class="custom-select sm" v-model="state.searchParam.searchType"  @change="state.searchParam.searchword = ''">
                                    <option v-for="(item, index) in state.searchTypeList" :key="index" :value="item.value">
                                        {{ item.label }}
                                    </option>
                                </select>
                            </span>
                            <span class="dv">
                                <input type="text" class="form-control sm" v-model="state.searchParam.searchword">
                            </span>
                        </span>
                    </div>
                    <div class="btn-filter-set">
                        <button type="button" class="btn btn-sm" @click="onInitData">
                            <span class="ico-reload sg"></span>
                            <span class="offscreen">초기화</span>
                        </button>
                        <button type="button" class="btn btn-sm" @click="onSearch">
                            <span class="ico-search"></span>검색</button>
                    </div>
                </div>
            </div>
            <div class="tbl-wrap">
                <div class="table-util flex space-between">
                    <div class="btn-set-m flex">
                    </div>
                    <div class="btn-set-m flex align-end">
                    <span class="table-total">조회결과 총 <strong>{{pager.totalCnt.toLocaleString('ko')}}</strong>건</span>
                    <!-- <button type="button" class="btn btn-opt"
                        @click="onChangeDownRol(menuInfo.auth5DownloadYn, 'Y', exelParams)">
                        <span class="ico-download"></span>파일다운로드
                    </button> -->
                    <selectBox :selectType="'page'" @changedValue="selectedOptions" />
                </div>
                </div>
                <NoData :nodatatext="'조회된 데이터가 없습니다.'" v-if="state.rowData.length === 0"></NoData>
                <template v-else>
                    <AgGridVue :defaultColDef="state.defaultColDef" :columnDefs="state.tableColum_c" @cell-clicked="cellClicked"
                        :rowData="state.rowData" @grid-ready="onGridReady"
                        class="ag-theme-alpine" :domLayout="'autoHeight'">
                    </AgGridVue>
                </template>
                <PageNavigation :cntPerPage='pager.size' :itemCount='pager.totalCnt' :currentPage="pager.current"
                        @changedPage="onChangedPage" />
            </div>

        </template>
    </DefaultModal>
</template>
<script>
import { reactive, ref, watch, getCurrentInstance, computed, onMounted, inject} from 'vue';
import DefaultModal from '@/plugins/modal/modal/DefaultModal.vue';
import { useStore } from 'vuex';
import { dmCommFunc } from '@/views/pntmng/common/common.js';
import { _getCommonList } from '@/api/standard.js';

export default {
    components: {DefaultModal},
    props: ['commonCode'],
    emits: ['onModalClose', 'onModalConfirm'],
    setup(props) {
        const { emit } = getCurrentInstance();
        const $Modal = inject('$Modal');
        const store = useStore();
        const commonCode = ref(computed(() => props.commonCode));
        const {  modal} = dmCommFunc();

        const initColum = ref([
            { headerName: '번호', field: 'no', valueGetter: 'node.rowIndex + 1', width: 100 },
            { headerName: '코드', field: 'cmnCd', width: 80},
            { headerName: '서비스구분코드명', field: 'cmnCdNm', flex: 1},
            { headerName: '사용여부',
                field: 'useYn',
                width: 90,
                cellRenderer: (item) => {
                    return item.value === 'Y' ? '사용' : '미사용';
                }},
            { headerName: '적용',
                field: 'confirm',
                width: 120,
                cellRenderer: () => {
                    return '<button type="button" class="btn btn-ss">적용하기</button>';
                }
            }
        ]);
        const menuInfo = computed(() => store.state.getMenuItem.menuInfo);
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
            menuCode: menuInfo.value.menuCode,
            searchTypeList: [
                { label: '코드명', value: 'cmnCdNm' },
                { label: '코드ID', value: 'cmnCd' }
            ],
            searchParam: {
                searchType: 'cmnCdNm',
                searchword: ''
            }
        });

        const searchData = reactive({
            searchGugun: '',
            searchGugunText: '',
            postUpYn: ''
        });

        const pager = reactive({
            current: 1,
            currentPageSize: 1,
            size: 10,
            offset: computed(() => (pager.current - 1) * pager.size),
            totalCnt: 0
        });

        const modalClose = () => {
            emit('onModalClose');
        };

        // 페이징 처리
        const onChangedPage = (num) => {
            state.selectList = [];
            pager.current = num;
            initColum.value[0].valueGetter = 'node.rowIndex + ' + Number(pager.size * (pager.current - 1) + 1);
            getCommonList();
        };

        const getCommonList = async () => {
            let params = {
                size: pager.size,
                offset: pager.offset,
                uprGrpCd: commonCode.value,
                cmnCd: state.searchParam.searchType === 'cmnCd' ? state.searchParam.searchword : '',
                cmnCdNm: state.searchParam.searchType === 'cmnCdNm' ? state.searchParam.searchword : '',
                useYn: ''
            };
            console.log(params);
            const response = await _getCommonList(params);

            if (response.data.code == 'OK') {
                state.rowData = response.data.data.list;
                pager.totalCnt = parseInt(response.data.data.totalCnt);
            } else {
                modal(response.message);
            }
        };

        const onInitData = () => {
            state.searchParam.searchType = 'cmnCdNm';
            state.searchParam.searchword = '';
            onChangedPage(1);
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
            if (code == 'confirm') {
                console.log('e.data : ', e.data.cmnCd);
                emit('onModalConfirm', e.data.cmnCd);
            }
        };

        //페이지당 리스트 게수 선택 옵션
        const selectedOptions = (value, type) => {
            pager.size = value;
            onChangedPage(1);
        };

        const onSearch = () => {
            getCommonList();
        };

        onMounted(() => {
            onChangedPage(1);
        });

        

        return {
            initColum,
            state,
            searchData,
            pager,
            onChangedPage,
            onGridReady,
            modalClose,
            cellClicked,
            selectedOptions,
            onSearch,
            onInitData
        };
    }
};
</script>