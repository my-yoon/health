<template>
    <section>
        <!-- 검색 -->
        <div class="ui-data-filter">
            <div class="form-item">
                <dateSerch :dateTitle="'기간조회'" @onSelectDate="onSelectPicker" :pickerOnly="false" :setDay="state.setDay"
                    ref="dateSearch"
                    :selectOptions="[{ label: '전체', value: '' }, { label: '당첨자 발표일', value: '당첨자 발표일' }, { label: '이벤트 등록일', value: '이벤트 등록일' }]" />
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
                        <label>게시구분</label>
                        <span class="input">
                            <span class="dv">
                                <span class="radio" v-for="(item, index) in state.evtStatus" :key="index">
                                    <input :id="'evtType' + index" name="evtTypeGroup" type="radio" :value="item.value"
                                        v-model="formData.eventPst">
                                    <label :for="'evtType' + index">{{ item.label }}</label>
                                </span>
                            </span>
                        </span>
                    </div>
                    <div class="item">
                        <label>제목</label>
                        <span class="input">
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
                    <button type="button" :class="['btn btn-ss']" @click="checkRegist">
                        등록
                    </button>
                </div>
                <div class="btn-set-m flex align-end">
                    <span class="table-total">조회결과 총 <strong>{{ pager.totalCnt }}</strong>건</span>
                    <button type="button" class="btn btn-opt"
                        @click="onChangeDownRol(menuInfo.auth5DownloadYn, 'Y', exelParams)">
                        <span class="ico-download"></span>파일다운로드
                    </button>
                    <selectBox :selectType="'page'" @changedValue="selectedOptions_list" />

                    <!-- <button type="button" class="btn btn-opt-ico fit" @click="tableResize">
                        <span class="offscreen">컬럼 리사이징</span>
                    </button> -->
                    <!-- 클래스 : full -->
                    <!-- 클래스 : close -->
                    <button type="button" class="btn btn-opt-ico filter" @click="resetTable">
                        <span class="offscreen">컬럼 셋팅</span>
                    </button>
                </div>
            </div>
            <!-- {{ formData }} -->
            <columlist :columlists="initColum" @checkColum="checkOptions" />
            <NoData :nodatatext="'조회된 데이터가 없습니다.'" v-if="state.pzwrList.length === 0"></NoData>
            <div v-else>
                <AgGridVue :columnDefs="state.tableColum_c" :rowData="state.pzwrList" :defaultColDef="state.defaultColDef"
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
import { _getPzwrList } from '@/api/event.js';
export default {
    components: { DefaultModal, DateSerch },
    setup() {
        // const internalInstance = getCurrentInstance();
        const $Modal = inject('$Modal');
        const dayJS = inject('dayJS');
        const store = useStore();
        const dateSearch = ref(null);
        const { goToPage, fileDown, tableResize, openModal, isPartnerShow, isDownShow, isImgShow } = useCommFunc();

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
        const { onChangeRegistRol, onChangeDownRol } = authCommFunc();
        const menuInfo = computed(() => store.state.getMenuItem.menuInfo);

        const initColum = ref([
            {
                headerName: '번호',
                field: 'no',
                maxWidth: 80,
                valueGetter: 'node.rowIndex + 1',
                suppressSizetoFit: true
            },
            { headerName: '제목', field: 'title' },
            {
                headerName: '게시구분',
                field: 'pstYn',
                maxWidth: 130,
                valueGetter: (params) => {
                    return params.data.pstYn === 'Y' ? '게시' : '비게시';
                }
            },
            {
                headerName: '당첨발표일',
                field: 'eventPzwnDt',
                maxWidth: 130,
                valueGetter: (params) => {
                    return dayJS(params.data.eventPzwnDt).format('YYYY-MM-DD');
                }
            },
            { headerName: '등록자', field: 'adminName', maxWidth: 150 },
            {
                headerName: '등록일자',
                field: 'regDate',
                maxWidth: 150,
                valueGetter: (params) => {
                    return dayJS(params.data.regDate).format('YYYY-MM-DD hh:mm:ss');
                }
            }
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
                flex: 1,
                headerClass: 'centered',
                cellClass: 'centered'
            },
            domLayout: 'autoHeight',
            openMore: false,
            download: { pass: '', reason: '' },
            pagesize: 10,
            mskgnRlsYn: true,
            setDay: '1month',
            startDay: '',
            endDay: '',
            pzwrList: [],
            evtStatus: [
                { label: '전체', value: '' },
                { label: '게시', value: 'Y' },
                { label: '비게시', value: 'N' }
            ]
        });
        const formData = reactive({
            periodType: '', // 기간조회타입
            startDt: computed(() => state.startDay), // 시작일
            endDt: computed(() => state.endDay), // 종료일
            eventType: '',
            eventProcess: '',
            eventPst: '',
            bnefType: '',
            eventTarget: '',
            searchType: '',
            searchText: '',
            eventTaxYn: ''
        });

        // 엑셀용 함수
        const exelParams = reactive({
            params: {
                periodType: computed(() => formData.periodType),
                startDt: computed(() => formData.startDt),
                endDt: computed(() => formData.endDt),
                eventType: computed(() => formData.eventType),
                eventProcess: computed(() => formData.eventProcess),
                eventPst: computed(() => formData.eventPst),
                bnefType: computed(() => formData.bnefType),
                eventTarget: computed(() => formData.eventTarget),
                searchType: computed(() => formData.searchType),
                searchText: computed(() => formData.searchText),
                eventTaxYn: computed(() => formData.eventTaxYn),
                menuCode: computed(() => menuInfo.value.menuCode)
            },
            url: '/common/api/v1/event/pzwr/list/excel'
        });

        onMounted(() => {
            getPzwrList();
            emitter.$on('onChangeRegist', onChangeRegist);
        });

        // 마스킹 해제 이벤트 버스 해제
        onUnmounted(() => {
            emitter.$off('onChangeRegist');
        });

        /**
         * 등록 권한 체크
         */
        const checkRegist = async () => {
            await onChangeRegistRol(menuInfo.value.auth1RegistYn);
        };

        /**
         * 권한 체크 callback
         */
        const onChangeRegist = () => {
            goToPage('/event/winner_notice/register');
        };

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
            getPzwrList();
        };
        //리스트 갯수 변경 후 리스트 재 조회
        const clearList = (num) => {
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
            if (status === '당첨자 발표일') {
                formData.periodType = 'pzwnAncDt';
            } else if (status === '이벤트 등록일') {
                formData.periodType = 'eventReg';
            } else if (status === '전체') {
                formData.periodType = '';
            }
            //api호출
            console.log('선택일:' + value, '선택된 버튼:' + type, '조회기준:' + status, dayJS(formData.from).format('MM-DD'));
        };
        // 데이터 피커 초기화
        const onInitDate = () => {
            dateSearch.value.initDate();
            //재조회  api 호출
            getPzwrList();
        };
        //리스트 조회
        const getPzwrList = async () => {
            try {
                let params = {
                    size: pager.size,
                    offset: pager.offset,
                    periodType: formData.periodType,
                    startDt: formData.startDt,
                    endDt: formData.endDt,
                    eventType: formData.eventType,
                    eventProcess: formData.eventProcess,
                    eventPst: formData.eventPst,
                    bnefType: formData.bnefType,
                    eventTarget: formData.eventTarget,
                    searchType: formData.searchType,
                    searchText: formData.searchText,
                    eventTaxYn: formData.eventTaxYn
                };
                const response = await _getPzwrList(params);
                state.pzwrList = response.data.data.list;
                pager.totalCnt = response.data.data.totalCount;
                console.log(params);
            } catch (error) {
                console.log(error);
            }
        };

        /**
         * @modal
         * simple modal
         * 다운로드 사유 저장없이 파일다운로드
         *  */
        // const exelConfirm = () => {
        //     $Modal.simple({
        //         title: '',
        //         message: '다운로드 하시겠습니까?',
        //         buttonText: {
        //             ok: '확인'
        //         }
        //     })
        //         .then(async (success) => {
        //             console.log(success);
        //             await exelDown();
        //         })
        //         .catch(error => {
        //             console.log(error);
        //         });
        // };
        // const exelDown = () => {
        //     let params = {
        //         periodType: formData.periodType,
        //         startDt: formData.startDt,
        //         endDt: formData.endDt,
        //         eventType: formData.eventType,
        //         eventProcess: formData.eventProcess,
        //         eventPst: formData.eventPst,
        //         bnefType: formData.bnefType,
        //         eventTarget: formData.eventTarget,
        //         searchType: formData.searchType,
        //         searchText: formData.searchText,
        //         eventTaxYn: formData.eventTaxYn,
        //         menuCode: '10230002'
        //     };
        //     fileDown(state.download, params, '/common/api/v1/event/pzwr/list/excel');
        //     state.download = {};
        // };

        // 상세 검색 열기
        const openMoreSerch = () => {
            state.openMore = !state.openMore;
        };
        //검색조건에 따른 리스트 재조회
        const reloadList = () => {
            pager.current = 1;
            onChangedPage(pager.current);
            console.log(formData);
            getPzwrList();
        };

        const onCellClicked = (e) => {
            console.log(e.data);
            goToPage(`/event/winner_notice/detail?ancSn=${e.data.ancSn}`);
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
        const modalControl = (type, modalName) => {
            if (modalName === 'isPartnerShow') {
                isPartnerShow.value = false;
            } else if (modalName === 'isDownShow') {
                isDownShow.value = false;
                console.log(formData);
                fileDown(state.download);
            } else if (!modalName) {
                isPartnerShow.value = false;
                isDownShow.value = false;
            }
            console.log(type, modalName);
        };
        return {
            //공통 사용
            menuInfo,
            $Modal,
            dayJS,
            goToPage,
            fileDown,
            tableResize,
            isDownShow,
            isPartnerShow,
            isImgShow,
            openModal,
            pager,
            state,
            formData,
            initColum,
            dateSearch,
            exelParams,
            onChangedPage,
            onSelectPicker,
            selectedOptions,
            selectedOptions_list,
            onInitDate,
            openMoreSerch,
            modalControl,
            onCellClicked,
            resetTable,
            checkOptions,
            // downConfirm,
            // selectPartner,
            reloadList,
            // exelConfirm,
            checkRegist,
            onChangeDownRol
        };
    }
};

</script>