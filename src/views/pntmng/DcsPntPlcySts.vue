<template>
    <section class="s1">
        <!-- 검색 -->
        <div class="ui-data-filter">
            <div class="form-item">
                <div class="item">
                    <label>정책정보</label>
                    <span class="input">
                        <span class="dv">
                            <input type="text" class="form-control sm" v-model="searchData.pntPlcyCd" :disabled="true">
                        </span>
                        <span class="dv">
                            <input type="text" class="form-control sm" v-model="searchData.pntPlcyNm" :disabled="true">
                        </span>
                        <span class="dv">
                            <button type="button" class="btn btn-opt" @click="showModal('pntPlcySearch')">찾기</button>
                        </span>
                    </span>
                </div>

                <div class="item">
                    <dateSerch ref="dateSearch" :dateTitle="'발급일'" @onSelectDate="onSelectPicker" :setDay="state.setDay" :pickerOnly="true" />
                </div>

                <div class="btn-filter-set">
                    <button type="button" class="btn btn-sm" @click="onChangedPage(1)">
                        <span class="ico-search"></span>조회 </button>
                    <button type="button" class="btn btn-sm" @click="initSearch">
                        <span class="ico-reload sg"></span>
                        <span class="offscreen">리로드</span>
                    </button>
                    <button type="button" class="btn btn-sm" @click="toggleSearch">
                        <span class="txt">{{ searchShow ? '상세검색 닫기' :'상세검색 열기' }}</span>
                    </button>
                </div>
            </div>
            <div v-if="searchShow" class="ui-data-filter-more">
                <div class="form-item">
                    <div class="item">
                        <label>카테고리</label>
                        <span class="input">
                            <span class="dv">
                                <CommonBtn :init="'선택'" :grCdId="'290000'" :val="searchData.pntCtgrMjcsCd"
                                    @changedValue="changePntCtgrMjcsCd" :className="'custom-select'" />
                            </span>
                            <span class="dv">
                                <CommonBtn ref="pntCtgrMdcsCdRef" v-if="searchData.pntCtgrMjcsCd" :init="'선택'" :grCdId="searchData.pntCtgrMjcsCd" :val="searchData.pntCtgrMdcsCd"
                                    @changedValue="(value) => searchData.pntCtgrMdcsCd = value" :className="'custom-select'" />
                            </span>
                        </span>
                    </div>
                </div>
            </div>
        </div>
        <!-- 테이블 -->
        <div class="tbl-wrap">
            <div class="table-util flex space-between">
                <div class="btn-set-m flex">
                    
                </div>
                <div class="btn-set-m flex align-end">
                    <span class="table-total">조회결과 총 <strong>{{pager.totalCnt.toLocaleString('ko')}}</strong>건</span>
                    <button type="button" class="btn btn-opt"
                        @click="onChangeDownRol(menuInfo.auth5DownloadYn, 'Y', exelParams)">
                        <span class="ico-download"></span>파일다운로드
                    </button>
                    <selectBox :selectType="'page'" @changedValue="selectedOptions" />
                    <button type="button" class="btn btn-opt-ico fit" @click="sizeToFit" ><span class="offscreen">컬럼 리사이징</span></button>
                    <button type="button" class="btn btn-opt-ico filter"  @click="resetTable"><span class="offscreen">컬럼 셋팅</span></button>
                </div>
            </div>
            <columlist :columlists="tablelist_dcsPntPlcySts_label" @checkColum="checkOptions" />
            <NoData :nodatatext="'조회된 데이터가 없습니다.'" v-if="state.rowData.length === 0"></NoData>
            <template v-else>
                <AgGridVue :defaultColDef="state.defaultColDef" :columnDefs="state.tableColum_c"
                    :rowData="state.rowData" @grid-ready="onGridReady" :suppressRowClickSelection="true"  :rowSelection="'multiple'"
                    class="ag-theme-alpine" :domLayout="'autoHeight'" >
                </AgGridVue>
                <PageNavigation :cntPerPage='pager.size' :itemCount='pager.totalCnt' :currentPage="pager.current"
                    @changedPage="onChangedPage" />
            </template>
        </div>

        <DcsPntPlcySearchPop v-if="isShow && popInfo.modalType=='pntPlcySearch'" @modalPlcyclose="closeModal"/>
    </section>
</template>
<script>
import { computed, reactive, onMounted, inject, ref } from 'vue';
import DefaultModal from '@/plugins/modal/modal/DefaultModal.vue';
import DateSerch from '@/components/ui/DateSerch.vue';
import { _getDcsPntPlcyStsList } from '@/api/pntmng.js';
import { useCommFunc } from '@/core/helper/common.js';
import { tablelist_dcsPntPlcySts_label } from '@/data/table/pntmngtable.js';
import DcsPntPlcySearchPop from '@/views/pntmng/component/DcsPntPlcySearchPop.vue';
import { dmCommFunc } from '@/views/pntmng/common/common.js';
import CommonBtn from '@/views/pntmng/component/CommonBtn.vue';
import { useRouter} from 'vue-router';
import { useStore } from 'vuex';
import { authCommFunc } from '@/core/helper/authComm.js';

export default {
    components: {DefaultModal, DateSerch, DcsPntPlcySearchPop, CommonBtn },
    setup() {
        const router = useRouter();
        const dateSearch = ref(null);
        const pntCtgrMdcsCdRef  = ref(null);
        const { goToPage } = useCommFunc();
        const { modal, popInfo, isShow, searchShow, toggleSearch } = dmCommFunc();
        const dayJS = inject('dayJS');
        const store = useStore();
        const menuInfo = computed(() => store.state.getMenuItem.menuInfo);
        const { onChangeDownRol } = authCommFunc();
        const state = reactive({
            setDay: {
                from: new Date().getTime() - 3600 * 1000 * 24 * 30,
                to: new Date()
            },
            tableColum_c: _.clone(tablelist_dcsPntPlcySts_label),
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
            menuCode: menuInfo.value.menuCode
        });

        const searchData = reactive({
            rgsDtFr: new Date().getTime() - 3600 * 1000 * 24 * 30,
            rgsDtTo: new Date(),
            pntPlcyCd: '',
            pntPlcyNm: '',
            pntCtgrMjcsCd: '',
            pntCtgrMdcsCd: '',
            currentPage: computed(() => pager.current),
            pageSize: computed(() => pager.size)
        });

        const exelParams = reactive({
            params: {
                rgsDtFr: computed(() => dayJS(searchData.rgsDtFr).format('YYYYMMDD')), //시작일
                rgsDtTo: computed(() => dayJS(searchData.rgsDtTo).format('YYYYMMDD')), //종료일
                pntPlcyCd: computed(() => searchData.pntPlcyCd),
                pntPlcyNm: computed(() => searchData.pntIssTyCd),
                pntCtgrMjcsCd: computed(() => searchData.pntCtgrMjcsCd),
                pntCtgrMdcsCd: computed(() => searchData.pntCtgrMdcsCd),
                pageSize: 0,
                currentPage: 0,
                menuCode: computed(() => menuInfo.value.menuCode)
            },
            url: '/common/api/v1/point/policy/stats/excel'
        });

        const pager = reactive({
            current: 1,
            currentPageSize: 1,
            size: 10,
            offset: computed(() => (pager.current - 1) * pager.size),
            totalCnt: 0
        });

        onMounted(() => {
            onChangedPage(1);
        });
        
        const reqData = () => {
            let check = false;
            let params = {
                ...searchData,
                rgsDtFr: dayJS(searchData.rgsDtFr).format('YYYYMMDD'),
                rgsDtTo: dayJS(searchData.rgsDtTo).format('YYYYMMDD')
            };

            if (params.rgsDtFr > params.rgsDtTo) {
                modal('발급종료일이 발급시작일보다 이전일 수 없습니다. 다시 입력하세요.');
                check = true;
            }
            return {params, check};
        };

        const getDcsPntPlcyStsList = async () => {
            try {
                let {params, check} = await reqData();
                if (check) return;
                const response = await _getDcsPntPlcyStsList(params);
                if (response.code == 'OK') {
                    state.rowData = response.data.list;
                    pager.totalCnt = parseInt(response.data.totalCount);
                } else {
                    modal(response.message);
                }
            } catch (error) {
                modal(error);
            }
        };

        const initSearch = () => {
            dateSearch.value.initDate();
            searchData.rgsDtFr = new Date().getTime() - 3600 * 1000 * 24 * 30;
            searchData.rgsDtTo = new Date();
            searchData.pntPlcyCd = '';
            searchData.pntPlcyNm = '';
            searchData.pntCtgrMjcsCd = '';
            searchData.pntCtgrMdcsCd = '';

            onChangedPage(1);
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

        const showModal = (type) => {
            popInfo.modalType = type;
            isShow.value = true;
        };

        const closeModal = (type, value) => {
            let status = popInfo.modalType;
            isShow.value = false;
            if (type == 'modalconfirm') {
                if (status == 'pntPlcySearch') {
                    searchData.pntPlcyCd = value.pntPlcyCd;
                    searchData.pntPlcyNm = value.pntPlcyNm;
                }
            }
        };

        const selectedOptions = (value, type) => {
            pager.size = value;
            onChangedPage(1);
        };

        // 페이징 처리
        const onChangedPage = (num) => {
            pager.current = num;
            state.tableColum_c[0].valueGetter = 'node.rowIndex + ' + Number(pager.size * (pager.current - 1) + 1);
            getDcsPntPlcyStsList();
        };

        // 테이블 리사이징을 위한 참조값
        const onGridReady = (params) => {
            state.gridApi = params.api;
            state.gridColumApi = params.columnApi;
        };

        // 삭제할 컬럼 선택
        const checkOptions = (value) => {
            state.filterCoulm = value;
        };

        // 테이블 현재창에 맞춤
        const sizeToFit = () => {
            state.gridApi.sizeColumnsToFit();
        };
        // 컬럼 변경
        const resetTable = () => {
            const initColum = _.clone(tablelist_dcsPntPlcySts_label);
            state.tableColum_c = initColum.filter(item => !state.filterCoulm.includes(item.headerName));
            return state.filterCoulm;
        };

        const changePntCtgrMjcsCd = async (val) => {
            if (searchData.pntCtgrMjcsCd) pntCtgrMdcsCdRef.value.setGrCdId(val);
            searchData.pntCtgrMjcsCd = val;
            searchData.pntCtgrMdcsCd = '';
        };

        return {
            checkOptions,
            sizeToFit,
            resetTable,
            searchShow,
            toggleSearch,
            state,
            popInfo,
            searchData,
            isShow,
            pager,
            showModal,
            closeModal,
            onChangedPage,
            onSelectPicker,
            selectedOptions,
            goToPage,
            getDcsPntPlcyStsList,
            initSearch,
            onGridReady,
            dateSearch,
            tablelist_dcsPntPlcySts_label,
            changePntCtgrMjcsCd,
            pntCtgrMdcsCdRef,
            exelParams,
            onChangeDownRol,
            menuInfo
        };
    }
};
</script>