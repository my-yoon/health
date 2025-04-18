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
                    <!--
                    <button class="btn btn-sm" type="button" @click="openMoreSerch">
                        <span class="txt">상세검색 열기</span>
                    </button>
                    -->
                </div>
            </div>
            <!-- 상세검색 검색조건 미정-->
            <div v-if="state.openMore && false" class="ui-data-filter-more">
                <div class="form-item">
                    <div class="item">
                        <label>대상</label>
                        <span class="input">
                            <span class="dv">
                                <select-box></select-box>
                            </span>
                            <span class="dv">
                                <select-box></select-box>
                            </span>
                        </span>
                    </div>
                </div>
            </div>
        </div>
        <div class="ui-chart-wrap mt-20">
            <div class="chart-util flex justify-end">
                <div class="radio-group btn-group">
                    <span class="radio">
                        <input id="periodSort1" v-model="state.periodSortGroup" name="periodSortGroup" type="radio"
                            value="D" @change="periodSortGroupChange">
                        <label for="periodSort1">일별</label>
                    </span>
                    <span class="radio">
                        <input id="periodSort2" v-model="state.periodSortGroup" name="periodSortGroup" type="radio"
                            value="W" @change="periodSortGroupChange">
                        <label for="periodSort2">주별</label>
                    </span>
                    <span class="radio">
                        <input id="periodSort3" v-model="state.periodSortGroup" name="periodSortGroup" type="radio"
                            value="M" @change="periodSortGroupChange">
                        <label for="periodSort3">월별</label>
                    </span>
                </div>
            </div>
            <div class="ui-chart-item mt-10">
                <chart-bar ref="chartBar" :data-sets="state.chart.datasets" :labels="state.chart.label"
                    :options="state.chart.options"></chart-bar>
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
                    <!-- <selectBox :selectType="'page'" @changedValue="selectedOptions" /> -->
                </div>
            </div>
            <NoData v-if="state.list.length === 0" :nodatatext="'조회된 데이터가 없습니다.'"></NoData>
            <div v-else>
                <AgGridVue :columnDefs="state.tableColum_c" :defaultColDef="state.defaultColDef" :domLayout="'autoHeight'"
                    :rowData="state.list" class="ag-theme-alpine" @grid-ready="onGridReady">
                </AgGridVue>
                <!-- <PageNavigation :cntPerPage='pager.size' :currentPage="pager.current" :itemCount='pager.totalCnt'
                    @changedPage="onChangedPage" /> -->
            </div>
        </div>
    </section>
</template>
<script>
import { computed, reactive, inject, onMounted, ref } from 'vue';
import DateSerch from '@/views/indicator/components/CharDateSerch.vue';
import { _getEventTargetParticipation } from '@/api/indicator.js';
import ChartBar from '@/views/indicator/components/ChartBar.vue';
import SelectBox from '@/components/ui/SelectBox.vue';

import { toGridUnit, toLocaleStringKo, toRound } from '@/views/indicator/util/chart.js';
import { useStore } from 'vuex';
import { authCommFunc } from '@/core/helper/authComm.js';



export default {
    components: { SelectBox, ChartBar, DateSerch },
    setup() {
        const $Modal = inject('$Modal');
        const dayJS = inject('dayJS');
        const dateSearch = ref(null);
        const chartBar = ref(null);

        const initColum = ref([
            {
                headerName: '번호',
                field: 'no',
                maxWidth: 70,
                valueGetter: 'node.rowIndex + 1'
            },
            { headerName: '날짜', flex: 1, field: 'tdate' },
            {
                headerName: '이벤트참여자',
                flex: 1,
                field: 'pcp_cnt',
                valueFormatter: toLocaleStringKo
            },
            {
                headerName: '이벤트대상자',
                flex: 1,
                field: 'trg_cnt',
                valueFormatter: toLocaleStringKo
            },
            {
                headerName: '이벤트대상자 참여율',
                flex: 1,
                field: 'pcp_pct',
                unit: '%',
                valueFormatter: toGridUnit,
                yAxisID: 'y1'
            },
            {
                headerName: '이벤트클릭 순유저',
                flex: 1,
                field: 'cli_cnt',
                valueFormatter: toLocaleStringKo
            },
            {
                headerName: '이벤트열람자 참여율',
                flex: 1,
                field: 'vie_pct',
                unit: '%',
                valueFormatter: toGridUnit,
                yAxisID: 'y1'
            }
        ]);

        const store = useStore();
        const { onChangeDownRol } = authCommFunc();
        const menuInfo = computed(() => store.state.getMenuItem.menuInfo);



        const state = reactive({
            tableColum_c: _.clone(initColum.value),
            filterCoulm: [],
            //테이블 옵션
            defaultColDef: {
                sortable: false,
                filter: false,
                resizable: true,
                flex: 1,
                headerClass: 'centered',
                cellClass: 'centered'
            },
            chart: {
                label: [],
                datasets: [],
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                        y: {
                            type: 'linear',
                            display: true,
                            position: 'left',
                            title: {
                                display: true,
                                text: '건 수'
                            }
                        },
                        y1: {
                            type: 'linear',
                            display: true,
                            position: 'right',
                            title: {
                                display: true,
                                text: '퍼센트'
                            },
                            grid: {
                                drawOnChartArea: false
                            }
                        }
                    }
                },
                datalabels: {
                    pcp_pct: {
                        type: 'line',
                        order: 1,
                        yAxisID: 'y1'
                    },
                    vie_pct: {
                        type: 'line',
                        order: 1,
                        yAxisID: 'y1'
                    }
                }
            },
            chartList: [],
            list: [],
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

        onMounted(() => {
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
            //테이블 인덱스 번호 처리
            initColum.value[0].valueGetter = 'node.rowIndex + ' + Number(pager.size * (pager.current - 1) + 1);
            //api호출
            getEventTargetParticipation();
        };

        //검색조건에 따른 리스트 재조회
        const reloadList = async () => {
            //차트도 초기화
            await getEventTargetParticipationChart();

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

        // 차트 초기화
        const chartInit = () => {
            if (state.chartList.length > 0) {
                state.chart.label = state.chartList.map(item => item.xAxis);
                state.chart.datasets = Object.keys(state.chartList[0].yAxis[0]).map((item, index) => {
                    return {
                        label: initColum.value.find(label => label.field === item).headerName.valueOf(),
                        data: state.chartList.map(data => toRound(data.yAxis[0][item])).valueOf(),
                        type: state.chart.datalabels[item]?.type ?? 'bar',
                        order: state.chart.datalabels[item]?.order ?? 0,
                        yAxisID: state.chart.datalabels[item]?.yAxisID ?? 'y'
                    };
                });
                chartBar.value.chartResize();
            }
        };

        // 차트조회
        const getEventTargetParticipationChart = async () => {
            try {
                // 차트 조회
                formData.schTy = 'C';
                await _getEventTargetParticipation(formData).then(result => {
                    state.chartList = result.data.data.list;
                    chartInit();
                });
            } catch (error) {
                console.log(error);
            }
        };

        //리스트 조회
        const getEventTargetParticipation = async () => {
            try {
                // 리스트 조회
                formData.schTy = 'L';
                await _getEventTargetParticipation(formData).then(result => {
                    state.list = result.data.data.list;
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
            getEventTargetParticipationChart();
        };
        const excelParams = {
            params: formData,
            url: '/common/api/v1/statics/event-target-participation/excel'
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