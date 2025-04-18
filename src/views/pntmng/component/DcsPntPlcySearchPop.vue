<template>
    <DefaultModal :isShow="true" :className="'wide'" :modalTitle="'정책검색'" :buttonCancel="'닫기'" @modalclose="closeModal">
        <template #modalcontent>
            <div class="ui-data-filter">
                <div class="form-item">
                    <div class="item">
                        <label>발급구분</label>
                        <span class="input">
                            <span class="dv">
                                <CommonBtn :init="'선택'" :grCdId="'214000'" :val="searchData.pntIssSeCd" :delOption="['214002']"
                                @changedValue="(value) => searchData.pntIssSeCd = value" :className="'custom-select sm'" />
                            </span>
                        </span>
                    </div>
                    <div class="item">
                        <dateSerch :dateTitle="'정책등록일'" @onSelectDate="onSelectPicker" :setDay="state.setDay"
                        ref="dateSearch" :pickerOnly="true" />
                    </div>
                    <div class="item">
                        <label>카테고리</label>
                        <span class="input">
                            <span class="dv">
                                <CommonBtn :init="'선택'" :grCdId="'290000'" :val="searchData.pntCtgrMjcsCd"
                                    @changedValue="changePntCtgrMjcsCd" :className="'custom-select sm'" />
                            </span>
                            <span class="dv">
                                <CommonBtn ref="pntCtgrMdcsCdRef" v-if="searchData.pntCtgrMjcsCd" :init="'선택'" :grCdId="searchData.pntCtgrMjcsCd" :val="searchData.pntCtgrMdcsCd"
                                    @changedValue="(value) => searchData.pntCtgrMdcsCd = value" :className="'custom-select sm'" />
                            </span>
                        </span>
                    </div>
                    <div class="btn-filter-set">
                        <button type="button" class="btn btn-sm" @click="initSearch">
                            <span class="ico-reload sg"></span>
                            <span class="offscreen">리로드</span>
                        </button>
                        <button type="button" class="btn btn-sm" @click="onChangedPage(1)">
                            <span class="ico-search"></span>검색
                        </button>
                        <button type="button" class="btn btn-sm" @click="toggleSearch">
                            <span class="txt">{{ searchShow ? '상세검색 닫기' :'상세검색 열기' }}</span>
                        </button>
                    </div>
                </div>
                <div v-if="searchShow" class="ui-data-filter-more">
                    <div class="form-item">
                        <div class="item">
                            <label>정책명</label>
                            <span class="input">
                                <span class="dv">
                                    <input type="text" class="form-control sm" v-model="searchData.pntPlcyNm" @keyup="enterToSearch">
                                </span>
                            </span>
                        </div>
                        <div class="item" v-if="state.pageType != 'pntmnlissreg'">
                            <label>포인트유형</label>
                            <span class="input">
                                <span class="dv">
                                    <CommonBtn :init="'전체'" :grCdId="'207000'" :val="searchData.pntIssTyCd"
                                        @changedValue="(value) => searchData.pntIssTyCd = value" :className="'custom-select sm'" />
                                </span>
                            </span>
                        </div>
                    </div>
                </div>
            </div>
            <div class="tbl-wrap">
                <div class="table-util flex space-between">
                    <div class="btn-set-m flex">
                    </div>
                    <div class="btn-set-m flex align-end">
                        <span class="table-total">조회결과 총 <strong>{{pager.totalCnt.toLocaleString('ko')}}</strong>건</span>
                        <!-- <selectBox :selectType="'page'" @changedValue="selectedOptions" /> -->
                    </div>
                </div>
                <columlist :columlists="tablelist_dcsPntPlcySearchPop_label" @checkColum="checkOptions" />
                <NoData :nodatatext="'조회된 데이터가 없습니다.'" v-if="state.rowData.length === 0"></NoData>
                <template v-else>
                    <AgGridVue :defaultColDef="state.defaultColDef" :columnDefs="state.tableColum_c"
                    :rowData="state.rowData" @grid-ready="onGridReady" @cell-clicked="cellClicked"
                    :suppressRowClickSelection="true" class="ag-theme-alpine" :domLayout="'autoHeight'">
                    </AgGridVue>
                    <PageNavigation :cntPerPage='pager.size' :itemCount='pager.totalCnt' :currentPage="pager.current"
                        @changedPage="onChangedPage" />
                </template>
            </div>
        </template>
    </DefaultModal>
</template>
<script>
import { getCurrentInstance, computed, reactive, onMounted, inject, ref } from 'vue';
import DateSerch from '@/components/ui/DateSerch.vue';
import { format } from 'date-fns';
import { _getDcsPntPlcyList, _getPntMnlIssMngList } from '@/api/pntmng.js';
import { useCommFunc } from '@/core/helper/common.js';
import { tablelist_dcsPntPlcySearchPop_label } from '@/data/table/pntmngtable.js';
import { dmCommFunc } from '@/views/pntmng/common/common.js';
import CommonBtn from '@/views/pntmng/component/CommonBtn.vue';
import DefaultModal from '@/plugins/modal/modal/DefaultModal.vue';

export default {
    props: ['type'],
    emits: ['modalPlcyclose'],
    components: { DateSerch, CommonBtn, DefaultModal },
    setup(props) {
        const pntCtgrMdcsCdRef  = ref(null);
        const { goToPage } = useCommFunc();
        const { toggleSearch, searchShow, modal, isShow } = dmCommFunc();
        const { emit } = getCurrentInstance();
        const dateSearch = ref(null);
        const dayJS = inject('dayJS');

        const state = reactive({
            setDay: {
                from: new Date().getTime() - 3600 * 1000 * 24 * 30,
                to: new Date()
            },
            tableColum_c: _.clone(tablelist_dcsPntPlcySearchPop_label),
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
            pageType: computed(() => props.type)
        });

        const searchData = reactive({
            rgsDtFr: new Date().getTime() - 3600 * 1000 * 24 * 30,
            rgsDtTo: new Date(),
            pntIssSeCd: '',
            pntPlcyNm: '',
            pntIssTyCd: '',
            pntCtgrMjcsCd: '',
            pntCtgrMdcsCd: '',
            currentPage: computed(() => pager.current),
            pageSize: computed(() => pager.size)
        });

        const pager = reactive({
            current: 1,
            currentPageSize: 0,
            size: 7,
            offset: computed(() => (pager.current - 1) * pager.size),
            totalCnt: 0
        });

        onMounted(() => {
            getDcsPntPlcyMngList();
        });

        const reqData = () => {
            let check = false;
            let params = {
                ...searchData,
                rgsDtFr: dayJS(searchData.rgsDtFr).format('YYYYMMDD'),
                rgsDtTo: dayJS(searchData.rgsDtTo).format('YYYYMMDD')
            };

            if (params.rgsDtFr > params.rgsDtTo) {
                modal('포인트변경종료일이 포인트변경시작일보다 이전일 수 없습니다. 다시 입력하세요.');
                check = true;
            }

            return {params, check};
        };

        const getDcsPntPlcyMngList = async () => {
            try {
                let {params, check} = await reqData();
                if (check) return;
                let response;
                if (state.pageType == 'pntmnlissreg') {
                    response = await _getPntMnlIssMngList(params);
                } else {
                    response = await _getDcsPntPlcyList(params);
                }
                if (response.code == 'OK') {
                    state.rowData = response.data.list;
                    pager.totalCnt = parseInt(response.data.totalCount);
                } else {
                    modal(response.message);
                    modalbtns('modalcancel');
                }
            } catch (error) {
                modal(error);
                modalbtns('modalcancel');
            }
        };

        const initSearch = () => {
            dateSearch.value.initDate();
            searchData.rgsDtFr = new Date().getTime() - 3600 * 1000 * 24 * 30;
            searchData.rgsDtTo = new Date();
            searchData.pntIssSeCd = '';
            searchData.pntPlcyNm = '';
            searchData.pntTtp = '';
        };

        // 데이터 피커 날짜 검색
        const onSelectPicker = (type, value) => {
            if (type === 'day') {
                searchData.rgsDtFr = value[0];
                searchData.rgsDtTo = value[1];
            }
            if (type === 'self_start') {
                searchData.rgsDtFr = value;
            }
            if (type === 'self_end') {
                searchData.rgsDtTo = value;
            }
        };

        const modalbtns = (type, Name) => {
            emit('modalPlcyclose', type, Name);
        };

        // 테이블 리사이징을 위한 참조값
        const onGridReady = (params) => {
            state.gridApi = params.api;
            state.gridColumApi = params.columnApi;
        };

        const cellClicked = (e) => {
            const code = state.gridApi.getFocusedCell().column.colId;
            if (code == 'pntPlcyNm') {
                modalbtns('modalconfirm', e.data);
            }
        };

        // 페이징 처리
        const onChangedPage = (num) => {
            pager.current = num;
            getDcsPntPlcyMngList();
        };

        const enterToSearch = (e) => {
            if (e.keyCode === 13) onChangedPage(1);
        };

        //페이지당 리스트 게수 선택 옵션
        const selectedOptions = (value, type) => {
            pager.size = value;
            onChangedPage(1);
        };

        // 삭제할 컬럼 선택
        const checkOptions = (value) => {
            state.filterCoulm = value;
            resetTable();
        };

        // 컬럼 변경
        const resetTable = () => {
            const initColum = _.clone(tablelist_dcsPntPlcySearchPop_label);
            state.tableColum_c = initColum.filter(item => !state.filterCoulm.includes(item.headerName));
            return state.filterCoulm;
        };

        const closeModal = async (type, val) => {
            emit('modalPlcyclose', type, val);
        };

        const changePntCtgrMjcsCd = async (val) => {
            if (searchData.pntCtgrMjcsCd) pntCtgrMdcsCdRef.value.setGrCdId(val);
            searchData.pntCtgrMjcsCd = val;
            searchData.pntCtgrMdcsCd = '';
        };

        return {
            tablelist_dcsPntPlcySearchPop_label,
            state,
            toggleSearch,
            searchShow,
            searchData,
            isShow,
            pager,
            format,
            onChangedPage,
            onSelectPicker,
            goToPage,
            dateSearch,
            onGridReady,
            getDcsPntPlcyMngList,
            initSearch,
            cellClicked,
            modalbtns,
            enterToSearch,
            selectedOptions,
            checkOptions,
            closeModal,
            changePntCtgrMjcsCd,
            pntCtgrMdcsCdRef
        };
    }
};
</script>