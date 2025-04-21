<template>
    <section>
    1111
        <!-- 검색 -->
        검색
        <div class="ui-data-filter">
            <div class="form-item">

                <dateSerch :dateTitle="'기간조회'" @onSelectDate="onSelectPicker" :pickerOnly="false" :setDay="state.setDay"
                    ref="dateSearch"
                    :selectOptions="[{ label: '전체', value: '전체' }, { label: '가입신청일자', value: '가입신청일자' }]" />
                <div class="btn-filter-set">
                    <button type="button" class="btn btn-sm" @click="reloadList">
                        <span class="ico-search"></span>조회
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
                                <selectBox :selectType="'cnSercSe'" @changedValue="selectedOptions" />
                            </span>
                            <span class="dv"><input type="text" class="form-control sm" v-model="formData.cnSercCts"></span>
                        </span>
                    </div>
                    <div class="item">
                        <label>사업자유형</label>
                        <span class="input">
                            <span class="dv">
                                <commselect :className="'sm'" :selectType="'searchCode.bzmTyCd'"
                                    @changedValue="selectedOptions" :initData="formData.bzmTyCd" />
                            </span>

                            <div class="dv" v-if="formData.bzmTyCd === '221001'">
                                <!-- 법인 -->
                                <commselect :className="'sm'" :selectType="'searchCode.bzmTyCdtype1'"
                                    @changedValue="selectedOptions" :initData="state.bzmTyCd1" />
                            </div>
                            <div class="dv" v-if="formData.bzmTyCd === '221002'">
                                <!-- 개인 -->
                                <commselect :className="'sm'" :selectType="'searchCode.bzmTyCdtype2'"
                                    @changedValue="selectedOptions" :initData="state.bzmTyCd2" />
                            </div>
                        </span>
                    </div>
                </div>
                <div class="form-item">
                    <div class="item">
                        <label>서비스 구분</label>
                        <span class="input">
                            <span class="dv">
                                <commselect :className="'sm'" :selectType="'searchCode.ptnrSelrSvcTyCd'"
                                    :initData="formData.svcSe" @changedValue="selectedOptions" />
                            </span>
                            <span class="dv">
                                <span class="checkbox">
                                    <input id="columChk0" name="columChkGroup" type="checkbox" v-model="state.pnltAplYn">
                                    <label for="columChk0">패널티 적용</label>
                                </span>
                            </span>
                            <span class="dv">
                                <span class="checkbox">
                                    <input id="columChk1" name="columChkGroup" type="checkbox" v-model="state.kbAffiYn">
                                    <label for="columChk1">KB계열사</label>
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
            <NoData :nodatatext="'조회된 데이터가 없습니다.'" v-if="state.joinlist.length === 0"></NoData>
            <div v-else>
                <AgGridVue :columnDefs="state.tableColum_c" :rowData="state.joinlist" :defaultColDef="state.defaultColDef"
                    @cell-clicked="onCellClicked" class="ag-theme-alpine" :domLayout="state.domLayout" style="width:100%">
                </AgGridVue>
                <PageNavigation :cntPerPage='pager.size' :itemCount='pager.totalCnt' :currentPage="pager.current"
                    @changedPage="onChangedPage" />
            </div>
        </div>

    </section>
</template>
<script>
import { computed, reactive, inject, onMounted, onUnmounted, ref } from 'vue';
import DefaultModal from '@/plugins/modal/modal/DefaultModal.vue';
import DateSerch from '@/components/ui/DateSerch.vue';
import { useCommFunc } from '@/core/helper/common.js';
import { authCommFunc } from '@/core/helper/authComm.js';
import { useStore } from 'vuex';
import { commoCode } from '@/data/commcode';
import { _getJoinRequest } from '@/api/seller.js';
export default {
    components: { DefaultModal, DateSerch },
    setup() {
        const $Modal = inject('$Modal');
        const dayJS = inject('dayJS');
        const store = useStore();
        const dateSearch = ref(null);
        const { goToPage, tableResize, formatterBrn } = useCommFunc();
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
                maxWidth: 150,
                valueGetter: (params) => {
                    return formatterBrn(params.data.brn);
                }
            },
            { headerName: '담당자명', field: 'admnNm', maxWidth: 120 },
            { headerName: '담당자휴대폰번호', field: 'admnHhpno', maxWidth: 150 },
            {
                headerName: '법인계좌번호(예금주)',
                field: 'acno',
                maxWidth: 250,
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
            {
                headerName: '구분',
                field: 'ptnrSelrSvcTyCd',
                maxWidth: 150,
                valueGetter: (params) => {
                    return params.data.ptnrSelrSvcTyNm ? params.data.ptnrSelrSvcTyNm : commoCode.searchCode.ptnrSelrSvcTyCd.filter(d => d.cmnCd === params.data.ptnrSelrSvcTyCd)[0].cmnCdNm;
                }
            },
            { headerName: 'KB계열사', field: 'kbAffiYn', maxWidth: 90 },
            // { headerName: '사업자유형', field: 'bzmTyNm', maxWidth: 100 },
            {
                headerName: '사업자유형',
                field: 'bzmTyNm',
                maxWidth: 200,
                valueGetter: (params) => {
                    return `${params.data.bzmTyNm}/${params.data.bzmTyDtlNm}`;
                }
            },
            { headerName: '패널티적용', field: 'pnltAplYn', maxWidth: 100 },
            { headerName: '가입신청일', field: 'admnJnReqDt', maxWidth: 120 },
            { headerName: '가입상태', field: 'admnPtnrStNm', maxWidth: 90 }

        ]);
        const state = reactive({
            joinlist: [],
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
            // download: { pass: '', reason: '' },
            bzmTyCd1: '',
            bzmTyCd2: '',

            partnerName: '',
            pagesize: 10,
            pnltAplYn: false,
            kbAffiYn: false,
            mskgnRlsYn: 'Y',
            setDay: '1month',
            startDay: '',
            endDay: '',
            servicelist: [
                { label: '전체', value: '' },
                { label: '상품', value: '상품' },
                { label: '서비스', value: '서비스' }
            ]
        });
        const formData = reactive({
            inqType: '', // 기간조회타입
            bgnDate: '', // 시작일
            endDate: computed(() => state.endDay), // 종료일
            cnSercSe: '',  // 조건검색타입
            cnSercCts: '', // 조건검색어
            bzmTyCd: '', // 사업자유형
            bzmTyDtlCd: '', //사업자유형 상세
            svcSe: '', // 서비스구분
            pnltAplYn: computed(() => state.pnltAplYn ? 'Y' : null), // 패널티 적용
            kbAffiYn: computed(() => state.kbAffiYn ? 'Y' : null), // KB 계열사 적용
            mskgnRlsYn: computed(() => state.mskgnRlsYn) // 마스킹 해제
        });

        const exelParams = {
            params: formData,
            url: '/common/api/v1/seller/join-request/excel'
        };


        onMounted(() => {
            getJoinRequest();

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
            // goToPage('/cs_center/qna/wire/register');
            goToPage('/sellermanageregist');
        };

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
            getJoinRequest();
        };

        const onChangedPage = (pagenum) => {
            pager.current = pagenum;
            //테이블 인덱스 번호 처리
            initColum.value[0].valueGetter = 'node.rowIndex + ' + Number(pager.size * (pager.current - 1) + 1);
            //api호출
            getJoinRequest();
        };

        //셀렉트박스 선택
        const selectedOptions_list = (value, type) => {
            if (type === 'page') {
                state.pagesize = value;
                getJoinRequest();
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
            } else if (type === 'bzmTyCd') { // 사업자유형
                formData.bzmTyCd = valueCode;
                formData.bzmTyDtlCd = '';
            } else if (type === 'bzmTyCdtype1' || type === 'bzmTyCdtype2') { // 사업자유형 상세
                formData.bzmTyDtlCd = valueCode;
            } else if (valueName === 'cnSercSe') {
                formData[valueName] = valueCode;
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
        const clearList = (num) => {
            formData.inqType = '';
            formData.cnSercSe = '';
            formData.cnSercCts = '';
            formData.bzmTyCd = '';
            formData.bzmTyDtlCd = '';
            formData.svcSe = '';
            state.pnltAplYn = false;
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
            goToPage(`/sellermanagedetail?admnSn=${e.data.sn}&ntprSn=${e.data.ntprSn}`);
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

        //리스트 조회
        const getJoinRequest = async () => {
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
                    mskgnRlsYn: state.mskgnRlsYn
                };
                console.log(params);
                const response = await _getJoinRequest(params);
                console.log(response.data);
                state.joinlist = response.data.data.list;
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
            // openModal,
            pager,
            formData,
            dateSearch,
            state,
            initColum,
            onChangedPage,
            onSelectPicker,
            selectedOptions,
            selectedOptions_list,
            openMoreSerch,
            onCellClicked,
            checkOptions,
            resetTable,
            onInitDate,
            reloadList,

            menuInfo,
            checkRegist,
            changeMskgnRlsYn,
            onChangeDownRol,
            exelParams
        };
    }
};

</script>