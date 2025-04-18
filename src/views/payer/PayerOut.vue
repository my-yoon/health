<template>
    <section>
        <!-- 검색 -->
        <div class="ui-data-filter">
            <div class="form-item">
                <dateSerch :dateTitle="'기간조회'" @onSelectDate="onSelectPicker" :pickerOnly="false" :setDay="state.setDay"
                    ref="dateSearch"
                    :selectOptions="[{ label: '전체', value: '전체' }, { label: '탈퇴처리일자', value: '탈퇴처리일자' }, { label: '가입일자', value: '가입일자' }, { label: '등록일자', value: '등록일자' }, { label: '수정일자', value: '수정일자' }]" />
                <div class="btn-filter-set">
                    <button type="button" class="btn btn-sm" @click="reloadList"><span class="ico-search"></span>조회
                    </button>
                    <button type="button" class="btn btn-sm" @click="onInitDate">
                        <span class="ico-reload sg"></span>
                        <span class="offscreen">리로드</span>
                    </button>
                    <button type="button" class="btn btn-sm" @click="openMoreSerch">
                        <span class="txt">상세검색 열기</span>
                    </button>
                </div>
            </div>
            <!-- 상세검색 -->
            <div class="ui-data-filter-more" v-if="state.openMore">
                <div class="form-item">
                    <div class="item">
                        <label>조건검색</label>
                        <span class="input">
                            <span class="dv">
                                <select class="custom-select sm" v-model="formData.cnSercSe">
                                    <option v-for="(item, index) in state.searchCnSer" :key="index" :value="item.value">
                                        {{ item.label }}
                                    </option>
                                </select>
                            </span>
                            <span class="dv"><input type="text" class="form-control sm" v-model="formData.cnSercCts"></span>
                        </span>
                    </div>
                    <div class="item">
                        <span class="dv">
                            <span class="checkbox">
                                <input id="columChk1" name="columChkGroup" type="checkbox" v-model="state.kbAffiYn">
                                <label for="columChk1">KB계열사</label>
                            </span>
                        </span>
                    </div>

                </div>

            </div>
        </div>
        <!-- {{ formData }} -->
        <div class="tbl-wrap">
            <div class="table-util flex space-between">
                <div class="btn-set-m flex">
                    <!-- <button :disabled="!state.mskgnRlsYn" class="btn btn-ss" type="button" @click="changeMskgnRlsYn">
                        마스킹해제
                    </button> -->
                </div>
                <div class="btn-set-m flex align-end">
                    <span class="table-total">조회결과 총 <strong>{{ pager.totalCnt }}</strong>건</span>
                    <button class="btn btn-opt" type="button"
                        @click="onChangeDownRol('Y', formData.mskgnRlsYn, exelParams)"> <span class="ico-download"></span>
                        파일다운로드
                    </button>
                    <selectBox :selectType="'page'" @changedValue="selectedOptions_list" />
                    <button type="button" class="btn btn-opt-ico fit" @click="sizeToFit">
                        <span class="offscreen">컬럼 리사이징</span>
                    </button>
                    <!-- 클래스 : full -->
                    <!-- 클래스 : close -->
                    <button type="button" class="btn btn-opt-ico filter" @click="resetTable">
                        <span class="offscreen">컬럼 셋팅</span>
                    </button>
                </div>
            </div>
            <columlist :columlists="initColum" @checkColum="checkOptions" />
            <NoData :nodatatext="'조회된 데이터가 없습니다.'" v-if="state.sellerOutlist.length === 0"></NoData>
            <div v-else>
                <AgGridVue :columnDefs="state.tableColum_c" :rowData="state.sellerOutlist"
                    :defaultColDef="state.defaultColDef" @cell-clicked="onCellClicked" class="ag-theme-alpine"
                    :domLayout="state.domLayout" style="width:100%" @grid-ready="onGridReady">
                </AgGridVue>
                <PageNavigation :cntPerPage='pager.size' :itemCount='pager.totalCnt' :currentPage="pager.current"
                    @changedPage="onChangedPage" />
            </div>
        </div>

    </section>
</template>
<script>
import { getCurrentInstance, computed, reactive, inject, ref, onMounted, onUnmounted } from 'vue';
import DateSerch from '@/components/ui/DateSerch.vue';
import DefaultModal from '@/plugins/modal/modal/DefaultModal.vue';
import { useCommFunc } from '@/core/helper/common.js';
import { authCommFunc } from '@/core/helper/authComm.js';
import { useStore } from 'vuex';
import { _getPayerOut } from '@/api/payer.js';
export default {
    components: { DateSerch, DefaultModal },
    setup() {
        const internalInstance = getCurrentInstance();
        const $Modal = inject('$Modal');
        const dayJS = inject('dayJS');
        const store = useStore();
        const dateSearch = ref(null);
        const { goToPage, tableResize, formatterBrn } = useCommFunc();
        const { onChangeMaskingRol, onChangeDownRol } = authCommFunc();
        const menuInfo = computed(() => store.state.getMenuItem.menuInfo);


        const initColum = ref([
            {
                headerName: '번호',
                field: 'no',
                maxWidth: 80,
                valueGetter: 'node.rowIndex + 1',
                suppressSizetoFit: true
            },
            { headerName: '기업명', field: 'ntprNm', Width: 350 },
            {
                headerName: '사업자 등록번호',
                field: 'brn',
                width: 350,
                valueGetter: (params) => {
                    return formatterBrn(params.data.brn);
                }
            },
            { headerName: '법인계좌번호(계좌주)', field: 'acno', maxWidth: 100 },
            { headerName: '대표전화번호 ', field: 'rprsTlno', maxWidth: 150 },
            { headerName: '추천기업', field: 'rcmNtpr', maxWidth: 100 },
            { headerName: '기업ID', field: 'ntprUcd', maxWidth: 100 },
            { headerName: '기업번호', field: 'ntprSn', maxWidth: 100 },
            { headerName: 'KB계열사', field: 'kbAffiYn', maxWidth: 100 },
            { headerName: '탈퇴처리일자', field: 'admnScsnDt', maxWidth: 100 }
        ]);
        const state = reactive({
            menuCode: computed(() => menuInfo.value.menuCode),
            //테이블데이터
            tableColum_c: _.clone(initColum),
            filterCoulm: [],
            //테이블 옵션
            defaultColDef: {
                sortable: true,
                filter: false,
                resizable: true,
                flex: 1,
                headerClass: 'centered',
                cellClass: 'centered'
            },
            domLayout: 'autoHeight',
            openMore: false,
            gridApi: null,
            gridColumApi: null,
            download: { pass: '', reason: '' },
            pagesize: 10,
            pnltAplYn: false,
            kbAffiYn: false,
            mskgnRlsYn: false,
            setDay: '1month',
            startDay: '',
            endDay: '',
            searchCnSer: [
                { label: '전체', value: '' },
                { label: '기업명', value: 'ntprNm' },
                { label: '기업ID', value: 'ntprUcd' },
                { label: '사업자등록번호', value: 'brn' }
            ],
            sellerOutlist: []
        });
        const formData = reactive({
            menuCode: state.menuCode,
            inqType: '', // 기간조회타입
            bgnDate: computed(() => state.startDay), // 시작일
            endDate: computed(() => state.endDay), // 종료일
            cnSercSe: '',  // 조건검색타입
            cnSercCts: '', // 조건검색어
            kbAffiYn: computed(() => state.kbAffiYn ? 'Y' : ''), // KB 계열사 적용
            mskgnRlsYn: computed(() => state.mskgnRlsYn ? 'Y' : 'N') // 마스킹 해제
        });
        const exelParams = {
            params: formData,
            url: '/common/api/v1/payer/payer-secession/excel'
        };
        onMounted(() => {
            //리스트조회
            getPayerOut();
            emitter.$on('onChangeMskgn', onChangeMskgn);
        });
        onUnmounted(() => {
            emitter.$off('onChangeMskgn');
        });

        /**
         * 마스킹 권한 체크
         */
        const changeMskgnRlsYn = async () => {
            // await onChangeMaskingRol(menuInfo.value.auth6MaskingYn);

            // 권한 체크 (임시 권한 부여)
            await onChangeMaskingRol('Y');
        };

        /**
         * 마스킹 해제 처리 후 리스트 재조회
         */
        const onChangeMskgn = () => {
            state.mskgnRlsYn = !state.mskgnRlsYn;
            getPayerOut();
        };

        // 페이징 처리
        const pager = reactive({
            current: 1,
            currentPageSize: 0,
            size: state.pagesize,
            offset: computed(() => (pager.current - 1) * pager.size),
            totalCnt: 0
        });
        const onChangedPage = (pagenum) => {
            //console.log(pagenum);
            pager.current = pagenum;
            initColum.value[0].valueGetter = 'node.rowIndex + ' + Number(pager.size * (pager.current - 1) + 1);
            //api호출
            getPayerOut();
        };
        //셀렉트박스 선택
        const selectedOptions_list = (value, type) => {
            if (type === 'page') {
                state.pagesize = value;
                clearList(1);
            }
        };

        // 공통코드 셀렉트
        const selectedOptions = (valueCode, valueName, type) => {
            console.log(formData[type]);
            if (type === 'rprsTlnoFno' || type === 'mailType2') {
                if (type === 'mailType2') {
                    state.mailType2 = valueName;
                } else {
                    formData[type] = valueName;
                }
            } else {
                formData[type] = valueCode;
            }

            console.log(valueCode, valueName, type);
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
            if (status === '가입신청일자') {
                formData.inqType = 'jnReqDate';
            } else if (status === '가입일자') {
                formData.inqType = 'jnDate';
            } else if (status === '탈퇴신청일자') {
                formData.inqType = 'scsnReqDate';
            } else if (status === '탈퇴처리일자') {
                formData.inqType = 'scsnPrDate';
            } else if (status === '전체') {
                formData.inqType = '';
            }
            //api호출
            console.log('선택일:' + value, '선택된 버튼:' + type, '조회기준:' + status, dayJS(formData.from).format('MM-DD'));
        };
        // 데이터 피커 초기화
        const onInitDate = () => {
            dateSearch.value.initDate();
            //재조회  api 호출
            clearList(1);
        };

        //리스트 갯수 변경 후 리스트 재 조회
        const clearList = (num) => {
            formData.inqType = '';
            formData.cnSercSe = '';
            formData.cnSercCts = '';
            state.kbAffiYn = false;
            state.mskgnRlsYn = true;
            onChangedPage(num);
            dateSearch.value.initDate();
        };
        //검색조건에 따른 리스트 재조회
        const reloadList = () => {
            pager.current = 1;
            onChangedPage(pager.current);
        };
        // 상세 검색 열기
        const openMoreSerch = () => {
            state.openMore = !state.openMore;
        };
        //테이블 셀 선택
        const onCellClicked = (e) => {
            console.log(e.data);
            goToPage(`/payeroutdetail?Sn=${e.data.sn}`);
        };
        // 삭제할 컬럼 선택
        const checkOptions = (value) => {
            state.filterCoulm = value;
        };
        // 컬럼 변경
        const resetTable = () => {
            const initColum = _.clone(tablelist_payermanage_label);
            state.tableColum_c = initColum.filter(item => !state.filterCoulm.includes(item.headerName));
            return state.filterCoulm;
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
        // 테이블 컬럼 초기값 설정 ==> 지정한 대로 나오도록 
        const onFirstDataRendered = () => {
            console.log(state.gridColumApi.getColumns);
            const allColumsIds = [];
            state.gridColumApi.getColumns().forEach((column) => {
                allColumsIds.push(column.getId());
            });
            state.gridColumApi.autoSizeColumns(allColumsIds);
        };



        //리스트 조회
        const getPayerOut = async () => {
            try {
                let params = {
                    size: pager.size,
                    offset: pager.offset,
                    bgnDate: state.startDay,
                    endDate: state.endDay,
                    inqType: formData.inqType,
                    cnSercSe: formData.cnSercSe,
                    cnSercCts: formData.cnSercCts,
                    bzmTyCd: formData.bzmTyCd,
                    bzmTyDtlCd: formData.bzmTyDtlCd,
                    svcSe: formData.svcSe,
                    pnltAplYn: formData.pnltAplYn,
                    kbAffiYn: formData.kbAffiYn,
                    mskgnRlsYn: formData.mskgnRlsYn
                };
                console.log(params);
                const response = await _getPayerOut(params);
                console.log(response.data);
                state.sellerOutlist = response.data.data.list;
                pager.totalCnt = response.data.data.totalCnt;
            } catch (error) {
                console.log(error);
            }
        };

        return {
            //공통 사용
            $Modal,
            dayJS,
            goToPage,
            tableResize,
            menuInfo,
            pager,
            state,
            formData,
            initColum,
            dateSearch,
            onChangedPage,
            onSelectPicker,
            selectedOptions_list,
            selectedOptions,
            openMoreSerch,
            onCellClicked,
            checkOptions,
            resetTable,
            onInitDate,
            reloadList,
            changeMskgnRlsYn,
            onChangeDownRol,
            exelParams

        };
    }
};

</script>