<template>
    <section>
        <!-- 검색 -->
        <div class="ui-data-filter">
            <div class="form-item">
                <dateSerch :dateTitle="'기간조회'" @onSelectDate="onSelectPicker" :pickerOnly="false" :setDay="state.setDay"
                    ref="dateSearch"
                    :selectOptions="[{ label: '전체', value: '전체' }, { label: '가입일자', value: '가입일자' }, { label: '등록일자', value: '등록일자' }, { label: '수정일자', value: '수정일자' }]" />
                <SearchBtns :moreBtns="true" @onChangeSearchBtns="onChangeSearchBtns" />
            </div>

            <!-- 상세검색 -->
            <div class="ui-data-filter-more" v-if="state.openMore">
                <div class="form-item">
                    <div class="item">
                        <label>조건검색</label>
                        <span class="input">
                            <span class="dv">
                                <selectBox :selectType="'cnSercSe'" @changedValue="selectedOptions" />
                            </span>
                            <span class="dv"><input type="text" class="form-control sm" v-model="formData.cnSercCts"
                                    :disabled="formData.cnSercSe === ''"></span>
                        </span>
                    </div>
                    <div class="item">
                        <label>KB계열사</label>
                        <span class="input">
                            <span class="dv">
                                <span class="checkbox">
                                    <input id="kb" name="kbGroup" type="checkbox" value="KB계열사" v-model="state.kbAffiYn">
                                    <label for="kb">KB계열사</label>
                                </span>

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
                    <button type="button" class="btn btn-ss" @click="checkRegist">등록</button>
                    <button :disabled="!state.mskgnRlsYn" class="btn btn-ss" type="button" @click="changeMskgnRlsYn">
                        마스킹해제
                    </button>
                </div>
                <div class="btn-set-m flex align-end">
                    <span class="table-total">조회결과 총 <strong>{{ pager.totalCnt }}</strong>건</span>
                    <!-- onChangeDownRol(menuInfo.auth5DownloadYn, formData.mskgnRlsYn, exelParams)  권한 체크 (임시 권한 부여) -->
                    <button class="btn btn-opt" type="button"
                        @click="onChangeDownRol('Y', formData.mskgnRlsYn, exelParams)">
                        <span class="ico-download"></span>
                        파일다운로드
                    </button>
                    <selectBox :selectType="'page'" @changedValue="selectedOptions_list" />

                    <button type="button" class="btn btn-opt-ico fit" @click="tableResize">
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
            <NoData :nodatatext="'조회된 데이터가 없습니다.'" v-if="state.devInfolist.length === 0"></NoData>
            <div v-else>
                <AgGridVue :columnDefs="state.tableColum_c" :rowData="state.devInfolist"
                    :defaultColDef="state.defaultColDef" @cell-clicked="onCellClicked" class="ag-theme-alpine"
                    :domLayout="state.domLayout" style="width:100%">
                </AgGridVue>
                <PageNavigation :cntPerPage='pager.size' :itemCount='pager.totalCnt' :currentPage="pager.current"
                    @changedPage="onChangedPage" />
            </div>
        </div>

    </section>
</template>
<script>
import { computed, reactive, inject, onMounted, onUnmounted, ref } from 'vue';
import DateSerch from '@/components/ui/DateSerch.vue';
import { useCommFunc } from '@/core/helper/common.js';
import { authCommFunc } from '@/core/helper/authComm.js';
import { useStore } from 'vuex';
import { _getDevInfo } from '@/api/developer.js';
export default {
    components: { DateSerch },
    setup() {
        const $Modal = inject('$Modal');
        const dayJS = inject('dayJS');
        const store = useStore();
        const dateSearch = ref(null);
        const { goToPage, tableResize, openModal, formatterBrn } = useCommFunc();
        const { onChangeRegistRol, onChangeMaskingRol, onChangeDownRol } = authCommFunc();
        const menuInfo = computed(() => store.state.getMenuItem.menuInfo);

        const initColum = ref([
            {
                headerName: '번호',
                field: 'no',
                maxWidth: 60,
                valueGetter: 'node.rowIndex + 1',
                suppressSizetoFit: true
            },
            { headerName: '기업명', field: 'ntprNm', maxWidth: 250 },
            {
                headerName: '사업자 등록번호',
                field: 'brn',
                width: 350,
                valueGetter: (params) => {
                    return formatterBrn(params.data.brn);
                }
            },
            { headerName: '담당자명', field: 'admnNm', maxWidth: 120 },
            { headerName: '담당자휴대폰번호', field: 'admnHhpno', maxWidth: 150 },
            {
                headerName: '법인계좌번호(예금주)',
                field: 'acno',
                maxWidth: 350,
                valueGetter: (params) => {
                    return params.data.acno + ' (' + params.data.accountNm + ')';
                }
            },
            { headerName: '대표전화번호 ', field: 'rprsTlno', maxWidth: 150 },
            {
                headerName: '추천기업',
                field: 'rcmNtpr',
                maxWidth: 130,
                valueGetter: (params) => {
                    return params.data.rcmNtpr;
                }
            },
            { headerName: '기업ID', field: 'ntprUcd', maxWidth: 80 },
            { headerName: '기업번호', field: 'ntprSn', maxWidth: 85 },
            { headerName: 'KB계열사', field: 'kbAffiYn', maxWidth: 90 },
            { headerName: '가입일자', field: 'admnJnDt', maxWidth: 120 },
            { headerName: '수정일자', field: 'updDt', maxWidth: 120 }

        ]);
        const state = reactive({
            devInfolist: [],
            joinlistTotal: 10,
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
            partnerName: '',
            pagesize: 10,
            pnltAplYn: false,
            kbAffiYn: false,
            mskgnRlsYn: true,
            setDay: '1month',
            startDay: '',
            endDay: ''
        });
        const formData = reactive({
            inqType: '', // 기간조회타입
            bgnDate: '', // 시작일
            endDate: computed(() => state.endDay), // 종료일
            cnSercSe: '',  // 조건검색타입
            cnSercCts: '', // 조건검색어
            kbAffiYn: computed(() => state.kbAffiYn ? 'Y' : null), // KB 계열사 적용
            mskgnRlsYn: computed(() => state.mskgnRlsYn ? 'Y' : 'N'), // 마스킹 해제
            menuCode: menuInfo.value.menuCode

        });

        const exelParams = {
            params: formData,
            url: '/common/api/v1/developer/developer-information/excel'
        };

        onMounted(() => {
            getDevInfo();
            emitter.$on('onChangeRegist', onChangeRegist);
            emitter.$on('onChangeMskgn', onChangeMskgn);
        });

        onUnmounted(() => {
            emitter.$off('onChangeRegist');
            emitter.$off('onChangeMskgn');
        });

        // 페이징 처리
        const pager = reactive({
            current: 1,
            currentPageSize: 1,
            size: computed(() => state.pagesize),
            offset: computed(() => (pager.current - 1) * pager.size),
            totalCnt: 0
        });

        /**
         * 등록 권한 체크
         */
        const checkRegist = async () => {
            // await onChangeRegistRol(menuInfo.value.auth1RegistYn);

            // 권한 체크 (임시 권한 부여)
            await onChangeRegistRol('Y');
        };

        /**
         * 등록 권한 체크 callback
         */
        const onChangeRegist = () => {
            // goToPage('/sellermanageregist');
        };

        /**
         * 마스킹 권한 체크
         */
        const changeMskgnRlsYn = async () => {
            // await onChangeMaskingRol(menuInfo.value.auth6MaskingYn);
            // 권한 체크 (임시 권한 부여)
            await onChangeMaskingRol(menuInfo.value.auth6MaskingYn);
        };

        /**
         * 마스킹 해제 처리 후 리스트 재조회
         */
        const onChangeMskgn = () => {
            state.mskgnRlsYn = !state.mskgnRlsYn;
            getDevInfo();
        };

        const onChangedPage = (pagenum) => {
            pager.current = pagenum;
            //테이블 인덱스 번호 처리
            initColum.value[0].valueGetter = 'node.rowIndex + ' + Number(pager.size * (pager.current - 1) + 1);
            //api호출
            getDevInfo();
        };

        //셀렉트박스 선택
        const selectedOptions_list = (value, type) => {
            if (type === 'page') {
                state.pagesize = value;
                getDevInfo();
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
            } else if (type === 'mailType1') {
                console.log();
            } else if (type === 'ptnrSelrSvcTyCd') {
                formData.svcSe = valueCode;
            } else if (valueName === 'cnSercSe') {
                formData[valueName] = valueCode;
                console.log(valueCode);
            } else {
                formData[type] = valueCode;
                console.log(valueCode);
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
            if (status === '수정일자') {
                formData.inqType = 'updDate';
            } else if (status === '등록일자') {
                formData.inqType = 'rgsDate';
            } else if (status === '탈퇴처리일자') {
                formData.inqType = 'scsnPrDate';
            } else if (status === '가입일자') {
                formData.inqType = 'jnDate';
            } else if (status === '전체') {
                formData.inqType = '';
            }


            //api호출
            console.log('선택일:' + value, '선택된 버튼:' + type, '조회기준:' + status, dayJS(formData.from).format('MM-DD'));
        };
        const clearList = (num) => {
            formData.inqType = '';
            formData.cnSercSe = '';
            formData.cnSercCts = '';
            formData.bzmTyCd = '';
            formData.svcSe = '';
            state.kbAffiYn = false;
            state.mskgnRlsYn = true;
            onChangedPage(num);
        };
        // 데이터 피커 초기화
        const onInitDate = async () => {
            await dateSearch.value.initDate();
            await clearList(1);
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
        //테이블셀 선택
        const onCellClicked = (e) => {
            console.log(e.data);
            goToPage(`/developerinfodetail?Sn=${e.data.sn}`);
        };
        // 삭제할 컬럼 선택
        const checkOptions = (value) => {
            state.filterCoulm = value;
        };
        // 컬럼 변경
        const resetTable = () => {
            const columlist = _.clone(initColum.value);
            state.tableColum_c = columlist.filter(item => !state.filterCoulm.includes(item.headerName));
            return state.filterCoulm;
        };

        const onChangeSearchBtns = (type) => {
            if (type === 'reload') { reloadList(); }
            if (type === 'init') { onInitDate(); }
            if (type === 'openMore') { openMoreSerch(); }
        };

        //리스트 조회
        const getDevInfo = async () => {
            try {
                let params = {
                    size: pager.size,
                    offset: pager.offset,
                    bgnDate: state.startDay,
                    endDate: state.endDay,
                    inqType: formData.inqType,
                    cnSercSe: formData.cnSercSe,
                    cnSercCts: formData.cnSercCts,
                    kbAffiYn: formData.kbAffiYn,
                    mskgnRlsYn: formData.mskgnRlsYn
                };
                console.log(params);
                const response = await _getDevInfo(params);
                console.log(response.data);
                state.devInfolist = response.data.data.list;
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
            openModal,
            pager,
            formData,
            dateSearch,
            state,
            initColum,
            onChangedPage,
            onSelectPicker,
            selectedOptions,
            selectedOptions_list,
            onCellClicked,
            checkOptions,
            resetTable,
            onChangeSearchBtns,

            menuInfo,
            checkRegist,
            changeMskgnRlsYn,
            onChangeDownRol,
            exelParams
        };
    }
};

</script>