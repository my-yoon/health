<template>
    <section>
        <div class="ui-data-filter">
            <div class="form-item">
                <dateSerch ref="dateSearch" :dateTitle="'기간조회'" :pickerOnly="false" :setDay="state.setDay"
                    @onSelectDate="onSelectPicker" />
                <div class="btn-filter-set">
                    <button class="btn btn-sm" type="button" @click="reloadList"><span class="ico-search"></span>조회
                    </button>
                    <button class="btn btn-sm" type="button" @click="onInitDate">
                        <span class="ico-reload sg"></span>
                        <span class="offscreen">리로드</span>
                    </button>
                    <button class="btn btn-sm" type="button" @click="openMoreSerch">
                        <span class="txt">상세검색 열기</span>
                    </button>
                </div>
            </div>
            <!-- 상세검색 검색조건 미정-->
            <div v-if="state.openMore" class="ui-data-filter-more">
                <div class="form-item">
                    <!--
                    <div class="item">
                        <label>대상</label>
                        <span class="input">
                            조건 미정
                            <span class="dv">
                                <select-box></select-box>
                            </span>
                            <span class="dv">
                                <select-box></select-box>
                            </span>
                        </span>
                    </div>
                    -->
                    <div class="item">
                        <label>성별</label>
                        <span class="input">
                            <RadioList v-model="formData.gender" :list="state.genderList" name="gender"></RadioList>
                        </span>
                    </div>
                </div>
            </div>
        </div>
        <div class="ui-chart-wrap mt-20">
            <div class="ui-chart-item mt-10">
                <chart-bar ref="chartBar" :data-sets="state.chart.datasets" :height="state.chart.height"
                    :labels="state.chart.label" :options="state.chart.options"></chart-bar>
            </div>
        </div>
        <div class="tbl-wrap mt-20">
            <div class="table-util flex space-between">
                <div class="btn-set-m flex">
                </div>
                <div class="btn-set-m flex align-end">
                    <span class="table-total">조회결과 총 <strong>{{ pager.totalCnt }}</strong>건</span>
                    <button class="btn btn-opt" type="button"
                        @click="onChangeDownRol(menuInfo.auth5DownloadYn, 'Y', excelParams)">
                        <span class="ico-download"></span>
                        파일다운로드
                    </button>
                    <selectBox :selectType="'page'" @changedValue="selectedOptions" />
                </div>
            </div>
            <NoData v-if="state.list.length === 0" :nodatatext="'조회된 데이터가 없습니다.'"></NoData>
            <div v-else>
                <AgGridVue :columnDefs="state.tableColum_c" :defaultColDef="state.defaultColDef" :domLayout="'autoHeight'"
                    :rowData="state.list" class="ag-theme-alpine" @grid-ready="onGridReady">
                </AgGridVue>
                <PageNavigation :cntPerPage='pager.size' :currentPage="pager.current" :itemCount='pager.totalCnt'
                    @changedPage="onChangedPage" />
            </div>
        </div>
    </section>
</template>
<style>
.ag-center-cols-viewport {
    overflow-x: hidden;
}
</style>
<script>
import { computed, reactive, inject, onMounted, ref } from 'vue';
import DateSerch from '@/views/indicator/components/CharDateSerch.vue';
import { _getAverageSleepTime } from '@/api/indicator.js';
import ChartBar from '@/views/indicator/components/ChartBar.vue';
import SelectBox from '@/components/ui/SelectBox.vue';
import RadioList from '@/views/customer/components/RadioList.vue';
import { chartColorSet, toLocaleStringKo } from '@/views/indicator/util/chart.js';
import { useStore } from 'vuex';
import { authCommFunc } from '@/core/helper/authComm.js';

export default {
    components: { RadioList, SelectBox, ChartBar, DateSerch },
    setup() {
        const $Modal = inject('$Modal');
        const dayJS = inject('dayJS');
        const dateSearch = ref(null);
        const chartBar = ref(null);
        const defalutInitColum = [
            { headerName: '연령별', width: 200, field: 'sleep_nm', pinned: 'left' }
        ];
        const initColum = ref([]);

        const store = useStore();
        const { onChangeDownRol } = authCommFunc();
        const menuInfo = computed(() => store.state.getMenuItem.menuInfo);


        const state = reactive({
            tableColum_c: computed(() => _.clone(initColum.value)),
            filterCoulm: [],
            //테이블 옵션
            defaultColDef: {
                sortable: false,
                filter: false,
                resizable: true,
                headerClass: 'centered',
                cellClass: 'centered'
            },
            chart: {
                isShow: false,
                label: [],
                datasets: [],
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    indexAxis: 'y',
                    plugins: {
                        legend: {
                            display: false
                        }
                    },
                    scales: {
                        x: {
                            title: { display: true, text: '시간' }
                        }
                    },
                    elements: {
                        bar: {
                            backgroundColor: computed(() => formData.gender === 'A' ? chartColorSet.green : formData.gender === 'F' ? chartColorSet.red : chartColorSet.blue)
                        }
                    }
                },
                height: 350,
                minHeight: 100,
                cntHeight: 35 // 건별높이
            },
            chartList: [],
            list: [],
            genderList: [
                { label: '전체', value: 'A' },
                { label: '남성', value: 'M' },
                { label: '여성', value: 'F' }
            ],
            pagesize: 10,
            gridApi: null,
            gridColumApi: null,
            openMore: false,
            searchKeyword: '',
            setDay: '1month',
            periodSortGroup: 'D',
            menuCode: computed(() => menuInfo.value.menuCode)
        });

        // 페이징 처리
        const pager = reactive({
            current: 1,
            currentPageSize: 1,
            size: computed(() => state.pagesize),
            offset: computed(() => (pager.current - 1) * pager.size),
            totalCnt: 0
        });

        onMounted(async () => {
            reloadList();
        });

        // 데이터 피커 날짜 검색
        const onSelectPicker = (type, value, status) => {
            // 버튼으로 선택된 기준
            if (type === 'day') {
                state.startday = value[0];
                state.endday = value[1];
            } else if (type === 'self_end' || type === 'self_start') {
                // 직접 데이터 피커 설정
                if (type === 'self_start') {
                    state.startday = value;
                } else if (type === 'self_end') {
                    state.endday = value;
                }
            }
        };

        // 상세 검색 열기
        const openMoreSerch = () => {
            state.openMore = !state.openMore;
        };

        // 검색 조건
        const formData = reactive({
            schTy: null, //검색형식
            bgnDate: computed(() => dayJS(state.startday).format('YYYYMMDD')), //시작일
            endDate: computed(() => dayJS(state.endday).format('YYYYMMDD')), //종료일
            tseCd: '', // 대상범위(코드)
            chartTy: computed(() => state.periodSortGroup), // 차트형식 [일별(D),주별(W),월별(M)]
            size: computed(() => pager.size),
            offset: computed(() => pager.offset),
            gender: 'A', // 전체(A),남성(M),여자(F)
            menuCode: state.menuCode
        });

        // 테이블 리사이징을 위한 참조값
        const onGridReady = (params) => {
            state.gridApi = params.api;
            state.gridColumApi = params.columnApi;
        };


        //페이징 처리
        const onChangedPage = (num) => {
            pager.current = num;
            //api호출
            getAverageSleepTime();
        };

        //검색조건에 따른 리스트 재조회
        const reloadList = async () => {
            //차트도 초기화
            await getAverageSleepTimeChart();

            pager.current = 1;
            await onChangedPage(pager.current);
        };

        //리스트 갯수 변경 후 리스트 재 조회
        const clearList = (num) => {
            formData.bgnDate = computed(() => dayJS(state.startday).format('YYYYMMDD')); //시작일
            formData.endDate = computed(() => dayJS(state.endday).format('YYYYMMDD')); //종료일
            formData.tseCd = ''; // 대상범위(코드)
            formData.chartTy = computed(() => state.periodSortGroup); // 차트형식 [일별(D),주별(W),월별(M)]

            onChangedPage(num);
        };

        // 컬럼셋
        const initColumSet = (list) => {
            if (list.length > 0) {
                const colums = Object.keys(list[0]).map((item, index) => {
                    return {
                        headerName: dayJS(item).format('YYYY-MM-DD'),
                        width: 100,
                        field: item,
                        valueFormatter: toLocaleStringKo
                    };
                });
                //기본값 field 중복 제거
                initColum.value = [...defalutInitColum, ...colums.filter(item => defalutInitColum.map(data => data.field).indexOf(item.field) === -1)];
            }
        };

        // 차트 초기화
        const chartInit = () => {
            if (state.chartList.length > 0) {
                state.chart.label = state.chartList.map(item => item.xAxis);
                state.chart.datasets = [{
                    data: state.chartList.map(item => item.yAxis[0].sleep_cnt)
                }];
                // 높이설정
                state.chart.height = state.chart.label.length * state.chart.cntHeight > state.chart.minHeight ? state.chart.label.length * state.chart.cntHeight : state.chart.minHeight;
                chartBar.value.chartResize({ height: state.chart.height });
            }
        };

        // 차트조회
        const getAverageSleepTimeChart = async () => {
            try {
                // 차트 조회
                formData.schTy = 'C';
                await _getAverageSleepTime(formData).then(result => {
                    state.chartList = result.data.data.list;
                    chartInit();
                });
            } catch (error) {
                console.log(error);
            }
        };

        //리스트 조회
        const getAverageSleepTime = async () => {
            try {
                // 리스트 조회
                formData.schTy = 'L';
                await _getAverageSleepTime(formData).then(result => {
                    const _list = result.data.data.list.map((item, index) => {
                        const reversedItem = {};
                        const keys = Object.keys(item);
                        for (let i = keys.length - 1; i >= 0; i--) {
                            reversedItem[keys[i]] = item[keys[i]];
                        }
                        return reversedItem;
                    });
                    // console.log(_list);
                    initColumSet(_list);
                    state.list = _list;
                    // initColumSet(result.data.data.list);
                    // state.list = result.data.data.list;
                    pager.totalCnt = result.data.data.totalCnt;
                });
            } catch (error) {
                console.log(error);
            }
        };

        // 조회 초기화
        const onInitDate = () => {
            dateSearch.value.initDate();
            //리스트 재조회
            clearList(1);
        };

        //셀렉트박스 선택
        const selectedOptions = (value, type) => {
            if (type === 'page') {
                state.pagesize = value;
                clearList(1);
            }
        };

        // 변경
        const periodSortGroupChange = () => {
            getAverageSleepTimeChart();
        };
        const excelParams = {
            params: formData,
            url: '/common/api/v1/statics/average-sleep-time/excel'
        };


        return {
            //공통 사용
            $Modal,
            dayJS,
            pager,
            state,
            initColum,
            formData,
            dateSearch,
            chartBar,
            onGridReady,
            openMoreSerch,
            reloadList,
            onChangedPage,
            selectedOptions,
            onSelectPicker,
            onInitDate,
            periodSortGroupChange,
            onChangeDownRol,
            excelParams,
            menuInfo
        };
    }
};
</script>