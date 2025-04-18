<template>
    <section>
        <!-- 검색 -->
        <div class="ui-data-filter">
            <div class="form-item">
                <dateSerch :dateTitle="'기간조회'" @onSelectDate="onSelectPicker" :pickerOnly="false" :setDay="state.setDay"
                    ref="dateSearch" />
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
            <!-- 상세검색 state.openMore-->
            <div class="ui-data-filter-more" v-if="state.openMore">
                <div class="form-item">
                    <div class="item">
                        <label>수행구분</label>
                        <span class="input">
                            <span class="dv">
                                <select class="custom-select sm" v-model="formData.actnSeCd">
                                    <option :value="item.value" v-for="(item, index) in state.selectOptions" :key="index">
                                        {{ item.label }}
                                    </option>
                                </select>
                            </span>
                        </span>
                    </div>
                    <div class="item">
                        <label>어드민선택</label>
                        <span class="input">
                            <span class="dv">
                                <select class="custom-select sm" disabled>
                                    <option>
                                        전체
                                    </option>
                                </select>
                            </span>
                            <span class="dv">
                                <select class="custom-select sm" disabled>
                                    <option>
                                        전체
                                    </option>
                                </select>
                            </span>
                        </span>
                    </div>
                    <div class="item">
                        <label>파트너선택</label>
                        <span class="input">
                            <span class="dv">
                                <select class="custom-select sm" disabled>
                                    <option>
                                        전체
                                    </option>
                                </select>
                            </span>
                            <span class="dv">
                                <select class="custom-select sm" disabled>
                                    <option>
                                        전체
                                    </option>
                                </select>
                            </span>
                        </span>
                    </div>
                    <div class="item">
                        <label>조회조건</label>
                        <span class="input">
                            <span class="dv">
                                <select class="custom-select sm" v-model="formData.searchType">
                                    <option v-for="(item, index) in state.searchType" :key="index" :value="item.value">
                                        {{ item.label }}
                                    </option>
                                </select>
                            </span>
                            <span class="dv">
                                <input v-model="formData.searchText" class="form-control sm" type="text">
                            </span>
                        </span>
                    </div>
                </div>
            </div>
        </div>

        <div class="tbl-wrap">
            <div class="table-util flex space-between">
                <div class="btn-set-m flex">
                    <button type="button" class="btn btn-ss" @click="changeMskgnRlsYn()"
                        :disabled="!state.mskgnRlsYn || state.mskgnTried">
                        마스킹해제
                    </button>
                </div>
                <div class="btn-set-m flex align-end">
                    <span class="table-total">조회결과 총 <strong>{{ pager.totalCnt }}</strong>건</span>
                    <button type="button" class="btn btn-opt"
                        @click="onChangeDownRol(menuInfo.auth5DownloadYn, formData.mskgnRlsYn, exelParams)">
                        <span class="ico-download"></span>파일다운로드
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
            <NoData :nodatatext="'조회된 데이터가 없습니다.'" v-if="state.accessLogList.length === 0"></NoData>
            <div v-else>
                <AgGridVue :columnDefs="state.tableColum_c" :rowData="state.accessLogList"
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
import { computed, reactive, inject, onMounted, onUnmounted, ref, watch } from 'vue';
import DefaultModal from '@/plugins/modal/modal/DefaultModal.vue';
import DateSerch from '@/components/ui/DateSerch.vue';
import { useCommFunc } from '@/core/helper/common.js';
import { authCommFunc } from '@/core/helper/authComm.js';
import { useStore } from 'vuex';
import { _getActionLogList } from '@/api/log.js';
export default {
    components: { DefaultModal, DateSerch },
    setup() {
        // const internalInstance = getCurrentInstance();
        const $Modal = inject('$Modal');
        const dayJS = inject('dayJS');
        const store = useStore();
        const dateSearch = ref(null);
        const { tableResize } = useCommFunc();
        /**
         * 권한은 스토어에서 가져옴 (권한여부는 메뉴리스트에서 가져온다)
         * store.state.getMenuItem.menuInfo
         * "auth1RegistYn": "Y/N",  등록
         * "auth2UpdateYn": "Y/N",  수정
         * "auth3DeleteYn": "Y/N",  삭제
         * "auth4ApproveYn": "Y/N", 승인
         * "auth5DownloadYn": "Y/N", 다운 
         * "auth6MaskingYn": "Y/N" 마스킹
         */
        const { onChangeMaskingRol, onChangeDownRol } = authCommFunc();
        const menuInfo = computed(() => store.state.getMenuItem.menuInfo);
        const initColum = ref([
            { headerName: '번호', field: 'no', maxWidth: 80, valueGetter: 'node.rowIndex + 1', suppressSizetoFit: true },
            { headerName: '어드민', field: 'adminSeperateCode', flex: 1, cellRenderer: params => state.adminType.find(d => d.value === params.value).label },
            { headerName: '어드민구분', field: 'adminDetailSeperateCode', flex: 1, cellRenderer: params => state.adminSecondType.find(d => d.value === params.value).label },
            { headerName: '파트너명', field: 'partnerName', flex: 1 },
            { headerName: '아이디', field: 'userId', flex: 1 },
            { headerName: '이름', field: 'userName', flex: 1 },
            { headerName: '사용자IP', field: 'userIpAddress', flex: 1 },
            { headerName: '수행(접속)일시', field: 'fulfilDatetime', flex: 1 },
            { headerName: '행위구분', field: 'actnSeCd', flex: 1, cellRenderer: params => state.selectOptions.find(d => d.value === params.value).label },
            { headerName: '메뉴명', field: 'menuName', flex: 1 },
            { headerName: '대상자명', field: 'targetUserName', flex: 1 },
            { headerName: '수행내용', field: 'fulfilContents', flex: 1 }
        ]);

        const state = reactive({
            //테이블데이터
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
            openMore: false,
            download: { pass: '', reason: '' },
            pagesize: 10,
            mskgnRlsYn: true,
            mskgnTried: false, // 마스킹 해제 여부 ( 1회 실행 가능 - 1회 마스킹해제 시 제 실행 불가 )
            setDay: '1month',
            startDay: '',
            endDay: '',
            accessLogList: [],

            searchType: [
                { label: '전체', value: '' },
                { label: '이름', value: 'usrNm' },
                { label: '아이디', value: 'usrId' },
                { label: '사용자IP', value: 'usrIp' },
                { label: '대상자명', value: 'tgpNm' }
            ],

            // 행위구분
            selectOptions: [
                { label: '전체', value: '' },
                { label: '조회', value: '261001' },
                { label: '삭제', value: '261002' },
                { label: '수정', value: '261004' },
                { label: '등록', value: '261003' }
            ],
            // 어드민
            adminType: [
                { label: '전체', value: '266001' },
                { label: 'KB어드민', value: '266002' },
                { label: '파트너어드민', value: '266003' }
            ],
            // 어드민 구분
            adminSecondType: [
                { label: 'All', value: '111001' },
                { label: 'Payer', value: '111002' },
                { label: 'Seller', value: '111003' },
                { label: 'Medical', value: '111004' },
                { label: 'Developer', value: '111005' }
            ]
        });
        const formData = reactive({
            bgnDate: computed(() => state.startDay), // 시작일
            bgnHour: '', //시작시간
            endDate: computed(() => state.endDay), // 종료일
            endHour: '', //종료시간
            actnSeCd: '', // 행위구분
            searchType: '', // 검색타입
            searchText: '', // 검색어
            mskgnRlsYn: computed(() => state.mskgnRlsYn ? 'Y' : 'N') //마스킹해제여부(Y/N)
            // partnerSelect: '', //파트너검색
            // adminFirstType: '', //어드민 검색  266001(어드민 전체) / 266002(KB어드민) / 266003(파트너어드민)
            // adminSecondType: ''//어드민 검색  111001(KB어드민-All) / 111002(KB/파트너.어드민-Payer) / 111003(KB/파트너.어드민-Seller) / 111004(KB/파트너.어드민-Medical) / 111005(KB/파트너.어드민-Developer)
        });

        // 엑셀용 함수
        const exelParams = reactive({
            params: {
                bgnDate: computed(() => formData.bgnDate),
                bgnHour: computed(() => formData.bgnHour),
                endDate: computed(() => formData.endDate),
                endHour: computed(() => formData.endHour),
                actnSeCd: computed(() => formData.actnSeCd),
                searchType: computed(() => formData.searchType),
                searchText: computed(() => formData.searchText),
                downloadPass: computed(() => state.download.pass),
                downloadReason: computed(() => state.download.reason),

                menuCode: computed(() => menuInfo.value.menuCode)
            },
            url: '/common/api/v1/logManagement/userActionLog/excel'
        });

        onMounted(() => {
            getActionLogList();
            emitter.$on('onChangeMskgn', onChangeMskgn);
        });

        // 마스킹 해제 이벤트 버스 해제
        onUnmounted(() => {
            emitter.$off('onChangeMskgn');
        });

        /**
         * 마스킹 권한 체크
         */
        const changeMskgnRlsYn = async () => {
            await onChangeMaskingRol(menuInfo.value.auth6MaskingYn);
        };

        /**
         * 마스킹 해제 처리 후 리스트 재조회
         */
        const onChangeMskgn = () => {
            state.mskgnRlsYn = !state.mskgnRlsYn;
            getActionLogList();
        };
        watch(formData, () => {
            console.log('change formData');
            if (state.mskgnTried) {
                state.mskgnRlsYn = true;
            }
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
            //console.log(pagenum);
            pager.current = pagenum;
            //테이블 인덱스 번호 처리
            initColum.value[0].valueGetter = 'node.rowIndex + ' + Number(pager.size * (pager.current - 1) + 1);
            //api호출
            getActionLogList();
        };
        const initParams = () => {
            formData.searchType = '';
            formData.searchText = '';
            formData.actnSeCd = '';
        };
        //리스트 갯수 변경 후 리스트 재 조회
        const clearList = (num) => {
            initParams();
            onChangedPage(num);
            dateSearch.value.initDate();
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
            } else if (type === 'mailType1') {
                console.log();
            } else if (type === 'ptnrSelrSvcTyCd') {
                formData.svcSe = valueCode;
            } else {
                formData[type] = valueCode;
            }

            console.log(valueCode, valueName, type);
        };

        // 데이터 피커 날짜 검색
        const onSelectPicker = (type, value, status) => {
            console.log(status);
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

            console.log('선택일:' + value, '선택된 버튼:' + type, '조회기준:' + status, dayJS(formData.from).format('MM-DD'));
        };
        // 데이터 피커 초기화
        const onInitDate = () => {
            dateSearch.value.initDate();
            //재조회  api 호출
            clearList(1);
        };
        //리스트 조회
        const getActionLogList = async () => {
            try {
                const params = {
                    size: pager.size,
                    offset: pager.offset,
                    bgnDate: formData.bgnDate,
                    bgnHour: '',
                    endDate: formData.endDate,
                    endHour: '',
                    actnSeCd: formData.actnSeCd,
                    // partnerSelect: formData.partnerSelect,
                    // adminFirstType: formData.adminFirstType,
                    // adminSecondType: formData.adminSecondType,
                    searchType: formData.searchType,
                    searchText: formData.searchText,
                    mskgnRlsYn: formData.mskgnRlsYn
                };
                const response = await _getActionLogList(params);
                console.log(response.data);
                state.accessLogList = response.data.data.list;
                pager.totalCnt = response.data.data.totalCnt;
                state.mskgnTried = false;
            } catch (error) {
                console.log(error);
            }
        };
        // 상세 검색 열기
        const openMoreSerch = () => {
            state.openMore = !state.openMore;
        };
        //검색조건에 따른 리스트 재조회
        const reloadList = () => {
            pager.current = 1;
            onChangedPage(pager.current);
            console.log(formData);
        };

        const onCellClicked = (e) => {
            console.log(e.data);
            //goToPage(`/memberinfodetail?mbrSn=${e.data.mbrSn}&&mskgnRlsYn=${(state.mskgnRlsYn ? 'Y' : 'N')}`);
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
        //다운로드 사유 등록 
        // const downConfirm = (type, con) => {
        //     console.log(type, con);
        //     if (type === 'pass') {
        //         state.download.pass = con;
        //     } else {
        //         state.download.reason = con;
        //     }
        // };
        //파트너 선택
        // const selectPartner = (data) => {
        //     state.partnerName = data;
        //     console.log(data);
        // };
        // 모달창 닫기
        // const modalControl = (type, modalName) => {
        //     if (modalName === 'isDownShow') {
        //         if (type === 'modalclose' || type === 'modalcancel') {
        //             isDownShow.value = false;
        //         }
        //         if (type === 'modalconfirm') {
        //             console.log(type, modalName);
        //             if (_.isEmpty(state.download.pass) || _.isEmpty(state.download.reason)) {
        //                 DownModalConRef.value.validCheck();
        //                 console.log(_.isEmpty(state.download.pass), _.isEmpty(state.download.reason));
        //             } else {
        //                 let params = {
        //                     bgnDate: formData.bgnDate,
        //                     bgnHour: formData.bgnHour,
        //                     endDate: formData.endDate,
        //                     endHour: formData.endHour,
        //                     actnSeCd: formData.actnSeCd,
        //                     searchType: formData.searchType,
        //                     searchText: formData.searchText,
        //                     mskgnRlsYn: '',
        //                     downloadPass: state.download.pass,
        //                     downloadReason: state.download.reason,
        //                     menuCode: '1016000'
        //                 };

        //                 fileDown(state.download, params, '/common/api/v1/logManagement/userActionLog/excel');
        //                 state.download = {};
        //                 isDownShow.value = false;
        //             }
        //         }
        //     } else if (!modalName) {
        //         isDownShow.value = false;
        //     }
        // };
        return {
            //공통 사용
            $Modal,
            dayJS,
            // goToPage,
            // fileDown,
            tableResize,
            // isDownShow,
            // isPartnerShow,
            // isImgShow,
            // openModal,
            pager,
            state,
            formData,
            initColum,
            dateSearch,
            onChangedPage,
            onSelectPicker,
            selectedOptions,
            selectedOptions_list,
            onInitDate,
            openMoreSerch,
            // modalControl,
            onCellClicked,
            resetTable,
            checkOptions,
            // downConfirm,
            // selectPartner,
            reloadList,
            // DownModalConRef,

            menuInfo,
            exelParams,
            onChangeDownRol,
            changeMskgnRlsYn
        };
    }
};

</script>