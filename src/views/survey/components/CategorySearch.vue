<template>
    <DefaultModal :buttonCancel="'닫기'" :buttonConfirm="'선택'" :modalName="'categorySearch'"
        modalTitle="설문카테고리 검색" @modalclose="modalControl" :className = "'full'">
        <template #modalcontent>

            <div class="ui-data-filter">
                <div class="form-item">
                    <div class="item">
                        <label>조회조건</label>
                        <span class="input">
                            <span class="dv">
                                <select class="custom-select sm">
                                    <option value="선택">선택</option>
                                </select>
                            </span>
                            <span class="dv">
                                <input type="text" class="form-control sm">
                            </span>
                        </span>
                    </div>
                    <div class="item">
                        <label>노출여부</label>
                        <span class="input">
                            <span class="dv">
                                <select class="custom-select sm">
                                    <option value="선택">선택</option>
                                </select>
                            </span>
                        </span>
                    </div>
                    <div class="btn-filter-set">
                        <button type="button" class="btn btn-sm">
                            <span class="ico-reload sg"></span>
                            <span class="offscreen">초기화</span>
                        </button>
                        <button type="button" class="btn btn-sm">
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
                    <button type="button" class="btn btn-opt-ico fit" @click="sizeToFit" ><span class="offscreen">컬럼 리사이징</span></button>
                    <button type="button" class="btn btn-opt-ico filter"  @click="resetTable"><span class="offscreen">컬럼 셋팅</span></button>
                </div>
                </div>
                <columlist :columlists="initColum"  @checkColum="checkOptions"/>
                <NoData :nodatatext="'조회된 데이터가 없습니다.'" v-if="state.rowData.length === 0"></NoData>
                <template v-else>
                    <AgGridVue :defaultColDef="state.defaultColDef" :columnDefs="state.tableColum_c"
                        :rowData="state.rowData" @grid-ready="onGridReady" @selection-changed="onRowSelect"
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
import { _getSurveyCategoryList } from '@/api/survey.js';

export default {
    components: {DefaultModal},
    props: [],
    emits: ['onModalClose', 'onModalConfirm'],
    setup() {
        const { emit } = getCurrentInstance();
        const $Modal = inject('$Modal');
        const store = useStore();

        const initColum = ref([
            { headerName: '선택', field: 'select', flex: 1, maxWidth: 60, checkboxSelection: true, headerCheckboxSelection: true },
            { headerName: '번호', field: 'no', valueGetter: 'node.rowIndex + 1', width: 100 },
            { headerName: '설문카테고리코드', field: 'categoryCode', flex: 1 },
            { headerName: '설문카테고리명', field: 'categoryName', flex: 1},
            { headerName: '등록일시', field: 'fstRgsDt', flex: 1 },
            { headerName: '등록자', field: 'fstRgtrNm', flex: 1 }
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

        const pager = reactive({
            current: 1,
            currentPageSize: 1,
            size: 10,
            offset: computed(() => (pager.current - 1) * pager.size),
            totalCnt: 0
        });

        const modalControl = (type, modalName) => {
            
            if (type === 'modalconfirm') {
                console.log(type);
                if (state.selectList.length === 0) {
                    $Modal.simple({
                        message: '선택해주세요.',
                        buttonText: {
                            ok: '확인'
                        }
                    });
                } else {
                    emit('onModalConfirm', state.selectList[0]);
                }
            } else {
                emit('onModalClose');
            }
        };

        // 페이징 처리
        const onChangedPage = (num) => {
            state.selectList = [];
            pager.current = num;
            initColum.value[1].valueGetter = 'node.rowIndex + ' + Number(pager.size * (pager.current - 1) + 1);
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

        // 테이블 리사이징을 위한 참조값
        const onGridReady = (params) => {
            state.gridApi = params.api;
            state.gridColumApi = params.columnApi;
            // console.log(params.columnApi);
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

        const onRowSelect = (e) => {
            state.selectList = state.gridApi.getSelectedRows();
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
            sizeToFit,
            resetTable,
            modalControl,
            onRowSelect
        };
    }
};
</script>