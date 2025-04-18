<template>
    <div>
        <div class="ui-data-filter">
            <div class="form-item">
                <dateSerch :dateTitle="'기간조회'" @onSelectDate="onSelectPicker" :pickerOnly="false" :setDay="state.setDay"
                    ref="dateSearch" />
                <div class="btn-filter-set">
                    <button type="button" class="btn btn-sm" @click="reloadList"><span class="ico-search"></span>조회
                    </button>
                </div>
            </div>
        </div>
        <div class="tbl-wrap">
            <div class="table-util flex space-between">
                <div class="btn-set-m flex">
                    <!-- <template v-if="state.historyList.length > 0">
                        <button type="button" :class="['btn btn-ss', { active: state.mskgnRlsYn }]"
                            @click="() => { state.mskgnRlsYn = !state.mskgnRlsYn }">
                            <template v-if="!state.mskgnRlsYn">마스킹해제</template>
                            <template v-else>마스킹</template>
                        </button>
                    </template> -->
                </div>
                <div class="btn-set-m flex align-end">
                    <span class="table-total">조회결과 총 <strong>{{ pager.totalCnt }}</strong>건</span>
                    <selectBox :selectType="'page'" @changedValue="selectedOptions" />
                    <!-- <button type="button" class="btn btn-opt" @click="openModal('isDownShow')">
                        <span class="ico-download"></span>파일다운로드
                    </button> -->
                    <button class="btn btn-opt" type="button"
                        @click="openDownLoad">
                        <span class="ico-download"></span>
                        파일다운로드
                    </button>
                </div>
            </div>

            <NoData :nodatatext="'조회된 데이터가 없습니다.'" v-if="state.historyList.length === 0"></NoData>
            <div v-else>
                <AgGridVue :columnDefs="state.tableColum_c" :rowData="state.historyList"
                    :defaultColDef="state.defaultColDef" class="ag-theme-alpine" :domLayout="state.domLayout"
                    style="width:100%">
                </AgGridVue>
                <PageNavigation :cntPerPage='pager.size' :itemCount='pager.totalCnt' :currentPage="pager.current"
                    @changedPage="onChangedPage" />
            </div>

        </div>
    </div>
</template>
<script>
import { reactive, inject, onMounted, ref, computed } from 'vue';
import DefaultModal from '@/plugins/modal/modal/DefaultModal.vue';
import DateSerch from '@/components/ui/DateSerch.vue';
import { useCommFunc } from '@/core/helper/common.js';
import { authCommFunc } from '@/core/helper/authComm.js';
import { useStore } from 'vuex';
import { _getInfoHistoryList } from '@/api/memberinfo.js';
import { _uploadFile } from '@/api/common.js';
import { useRouter, useRoute } from 'vue-router';
export default {
    props: ['mskgnRlsYn', 'mbrSn'],
    components: { DefaultModal, DateSerch },
    setup(props, context) {
        const $Modal = inject('$Modal');
        const dayJS = inject('dayJS');
        const store = useStore();
        const route = useRoute();

        const { goToPage, fileDown, tableResize, isPartnerShow, isImgShow, isRequestShow } = useCommFunc();
        const { onChangeDownRol } = authCommFunc();
        
        const menuInfo = computed(() => store.state.getMenuItem.menuInfo);
                
        const isMdShow = ref(false);
        const mailType = ref(null);
        const infoChangeShow = ref(false);
        const fileUploadFile = ref(null);
        const dateSearch = ref(null);
        const initColum = ref([
            {
                headerName: '번호',
                field: 'no',
                maxWidth: 80,
                valueGetter: 'node.rowIndex + 1',
                suppressSizetoFit: true
            },
            { headerName: '회원상태', field: 'mbrSt' },
            { headerName: '사유', field: 'stTrnsfRsn', flex: 1 },
            { headerName: '상태 전환일자', field: 'stTrnsfDt', maxWidth: 250 },
            { headerName: '수정자', field: 'admnNm' }
        ]);
        const state = reactive({
            historyList: [],
            mskgnRlsYn: computed(() => props.mskgnRlsYn),
            tableColum_c: _.clone(initColum),
            filterCoulm: [],
            //테이블 옵션
            defaultColDef: {
                sortable: true,
                filter: false,
                resizable: true,
                width: 150,
                headerClass: 'centered',
                cellClass: 'centered'
            },
            domLayout: 'autoHeight',
            download: { pass: '', reason: '' },
            pagesize: 10,
            setDay: '1month',
            startDay: '',
            endDay: '',
            mbrSn: computed(() => props.mbrSn)
        });
        const formData = reactive({
            mbrSn: computed(() => state.mbrSn), //회원순번
            bgnDate: computed(() => state.startDay), //시작일자 [YYYY-MM-DD]
            endDate: computed(() => state.endDay) //종료일자 [YYYY-MM-DD]
        });

        onMounted(() => {
            getInfoHistoryList();
        });

        // 페이징 처리
        const pager = reactive({
            current: 1,
            currentPageSize: 1,
            size: computed(() => state.pagesize),
            offset: computed(() => (pager.current - 1) * pager.size),
            totalCnt: 0
        });
        const onChangedPage = (pagenum) => {
            pager.current = pagenum;
            //테이블 인덱스 번호 처리
            initColum.value[0].valueGetter = 'node.rowIndex + ' + Number(pager.size * (pager.current - 1) + 1);
            //api호출
            getInfoHistoryList();
        };
        // 데이터 피커 날짜 검색
        const onSelectPicker = (type, value, status) => {
            // 버튼으로 선택된 기준
            if (type === 'day') {
                state.startDay = value[0];
                state.endDay = value[1];
            } else if (type === 'self_end' || type === 'self_start') {
                // 직접 데이터 피커 설정
                if (type === 'self_start') {
                    state.startDay = value;
                } else if (type === 'self_end') {
                    state.endDay = value;
                }
            }
            //api호출
            console.log('선택일:' + value, '선택된 버튼:' + type, '조회기준:' + status, dayJS(formData.from).format('MM-DD'));
        };
        // 데이터 피커 초기화
        const onInitDate = () => {
            dateSearch.value.initDate();
            //재조회  api 호출

        };
        //셀렉트박스 선택
        const selectedOptions = (value, type) => {
            if (type === 'page') {
                console.log(value);
                state.pagesize = value;
                clearList(1);
            }
        };
        //다운로드 사유 등록 
        const downConfirm = (type, con) => {
            console.log(type, con);
            if (type === 'pass') {
                state.download.pass = con;
            } else {
                state.download.reason = con;
            }
        };
        //검색조건에 따른 리스트 재조회
        const reloadList = () => {
            pager.current = 1;
            onChangedPage(pager.current);
            getInfoHistoryList();
        };
        //리스트 갯수 변경 후 리스트 재 조회
        const clearList = (num) => {
            // dateSearch.value.initDate();
            onChangedPage(num);
        };
        const getInfoHistoryList = async () => {
            try {
                let params = {
                    size: pager.size,
                    offset: pager.offset,
                    mbrSn: formData.mbrSn,
                    bgnDate: formData.bgnDate,
                    endDate: formData.endDate,

                    menuCode: '1002001'
                };
                const response = await _getInfoHistoryList(params);
                state.historyList = response.data.data.list;
                pager.totalCnt = response.data.data.totalCnt;
            } catch (error) {
                console.log(error);
            }
        };

        const openModal = () => {
            context.emit('openModal');
        };
        const closeModal = () => {
            context.emit('closeModal');
        };

        const openDownLoad = () => {
            closeModal();
            onChangeDownRol(menuInfo.value.auth5DownloadYn, 'N', excelParams);
        };

        // 엑셀용 함수
        const excelParams = reactive({
            params: {
                mbrSn: computed(() => formData.mbrSn),
                bgnDate: computed(() => formData.bgnDate),
                endDate: computed(() => formData.endDate),
                size: computed(() => pager.size),
                offset: computed(() => pager.offset),
                menuCode: '1002001',
                downloadReason: ''
            },
            url: '/common/api/v1/user/memberStatHistoryList/excel'
            // '/api/v1/user/memberStatHistoryList/excel'
        });

        return {
            //공통 사용
            $Modal,
            dayJS,
            goToPage,
            state,
            formData,
            pager,
            onChangedPage,
            onSelectPicker,
            selectedOptions,
            reloadList,

            openDownLoad,
            // menuInfo,
            onChangeDownRol,
            excelParams

        };

    }
};
</script>