<template>
    <section>
        <!-- 검색 -->
        <!-- {{ menuInfo }} -->
        <div class="ui-data-filter">
            <div class="form-item">

                <dateSerch :dateTitle="'기간조회'" @onSelectDate="onSelectPicker" :pickerOnly="false" :setDay="state.setDay"
                    ref="dateSearch"
                    :selectOptions="[{ label: '이벤트시작일', value: 'eventStart' }, { label: '이벤트종료일', value: 'eventEnd' }, { label: '이벤트등록일', value: 'eventReg' }]" />
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
            <!-- eventType: '', // 이벤트 유형
            eventProcess: '', // 진행상태
            eventPst: '', //
            bnefType: '', //혜택구분
            eventTarget: '', //이벤트 대상
            searchType: '', //키워드 타입
            searchTxt: '' //키워드 -->
            <!-- 상세검색 -->
            <div class="ui-data-filter-more" v-if="state.openMore">
                <div class="form-item">
                    <div class="item">
                        <label>이벤트 유형</label>
                        <span class="input">
                            <span class="dv">
                                <select class="custom-select sm" v-model="formData.eventType">
                                    <option v-for="(option, index) in state.eventType" :key="index" :value="option.value">
                                        {{ option.label }}
                                    </option>
                                </select>
                            </span>
                        </span>
                    </div>
                    <div class="item">
                        <label>진행상태</label>
                        <span class="input">
                            <span class="dv">
                                <select class="custom-select sm" v-model="formData.eventProcess">
                                    <option v-for="(option, index) in state.eventIng" :key="index" :value="option.value">
                                        {{ option.label }}
                                    </option>
                                </select>
                            </span>
                        </span>
                    </div>
                    <div class="item">
                        <label>게시구분</label>
                        <span class="input">
                            <span class="dv">
                                <span class="radio" v-for="(item, index) in state.eventShow" :key="index">
                                    <input :id="'show' + index" name="openRdo1" type="radio" :value="item.value"
                                        v-model="formData.eventPst">
                                    <label :for="'show' + index">{{ item.label }}</label>
                                </span>
                            </span>
                        </span>
                    </div>

                </div>
                <div class="form-item">
                    <div class="item">
                        <label>혜택구분</label>
                        <span class="input">
                            <span class="dv">
                                <select class="custom-select sm" v-model="formData.bnefType">
                                    <option v-for="(option, index) in state.benefitList" :key="index" :value="option.value">
                                        {{ option.label }}
                                    </option>
                                </select>
                            </span>

                        </span>
                    </div>
                    <div class="item">
                        <label>이벤트대상</label>
                        <span class="input">
                            <span class="dv">
                                <span class="radio" v-for="(item, index) in state.eventTarget" :key="index">

                                    <input :id="'eventmember' + index" name="openRdo" type="radio" :value="item.value"
                                        v-model="formData.eventTarget" :disabled="index === 2">
                                    <label :for="'eventmember' + index">{{ item.label }}</label>
                                </span>
                            </span>
                            <span class="dv" v-if="false">
                                <input type="text" class="form-control sm">
                                <button type="button" class="btn btn-ss">그룹검색</button>
                            </span>

                        </span>
                    </div>

                </div>
                <div class="form-item">
                    <div class="item">
                        <label>키워드</label>
                        <span class="input">
                            <span class="dv">
                                <select class="custom-select sm" v-model="formData.searchType">
                                    <option v-for="(option, index) in state.eventKeyword" :key="index"
                                        :value="option.value">
                                        {{ option.label }}
                                    </option>
                                </select>
                            </span>
                            <span class="dv">
                                <input type="text" class="form-control sm" v-model="formData.searchText">
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

                </div>
                <div class="btn-set-m flex align-end">
                    <span class="table-total">조회결과 총 <strong>{{ pager.totalCnt }}</strong>건</span>
                    <button type="button" class="btn btn-opt"
                        @click="onChangeDownRol(menuInfo.auth5DownloadYn, 'Y', exelParams)">
                        <span class="ico-download"></span>파일다운로드
                    </button>
                    <selectBox :selectType="'page'" @changedValue="selectedOptions" />

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
            <NoData :nodatatext="'조회된 데이터가 없습니다.'" v-if="state.eventList.length === 0"></NoData>
            <div v-else>
                <AgGridVue :columnDefs="state.tableColum_c" :rowData="state.eventList" :defaultColDef="state.defaultColDef"
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
import { _getEventList } from '@/api/event.js';

export default {
    components: { DefaultModal, DateSerch },
    setup() {
        // const internalInstance = getCurrentInstance();
        const $Modal = inject('$Modal');
        const dayJS = inject('dayJS');
        const store = useStore();
        const dateSearch = ref(null);
        const DownModalConRef = ref(null);
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

        // 엑셀용 함수
        const exelParams = reactive({
            params: {
                startDt: computed(() => formData.startDt),
                endDt: computed(() => formData.endDt),
                periodType: computed(() => formData.periodType),
                eventType: computed(() => formData.eventType),
                eventProcess: computed(() => formData.eventProcess),
                eventPst: computed(() => formData.eventPst),
                bnefType: computed(() => formData.bnefType),
                eventTaxYn: computed(() => formData.eventTaxYn),
                eventTarget: computed(() => formData.eventTarget),
                searchType: computed(() => formData.searchType),
                searchText: computed(() => formData.searchText),
                // menuCode: '1023001',
                menuCode: computed(() => menuInfo.value.menuCode)
            },
            url: '/common/api/v1/event/list/excel'
        });

        onMounted(() => {
            getEventList();
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
            goToPage('/event/register/genaral');
        };

        const initColum = ref([
            {
                headerName: '번호',
                field: 'no',
                maxWidth: 80,
                valueGetter: 'node.rowIndex + 1',
                suppressSizetoFit: true
            },
            {
                headerName: '이벤트제목',
                field: 'eventName',
                valueGetter: (params) => {
                    return params.data.eventName;
                },
                tooltipValueGetter: (params) => {
                    return '참여건수 : ' + params.data.joinCount;
                },
                minWidth: 250
            },
            {
                headerName: '유형',
                field: 'eventType',
                valueGetter: (params) => {
                    if (params.data.eventType === 'GENERAL') {
                        return '일반';
                    } else if (params.data.eventType === 'QUIZ') {
                        return '퀴즈';
                    } else if (params.data.eventType === 'ROULETTE') {
                        return '룰렛';
                    } else if (params.data.eventType === 'ATTENDANCE') {
                        return '출석';
                    } else if (params.data.eventType === 'INVITATION') {
                        return '초대';
                    }
                },
                maxWidth: 80
            },
            {
                headerName: '혜택',
                field: 'eventBnefType',
                valueGetter: (params) => {
                    if (params.data.eventBnefType === 'NONE') {
                        return '혜택없음';
                    } else if (params.data.eventBnefType === 'IMMEDIATELY') {
                        return '즉시지급';
                    } else if (params.data.eventBnefType === 'AFTER') {
                        return '당첨 후 지급';
                    }
                },
                maxWidth: 100
            },
            {
                headerName: '게시구분',
                field: 'pstYn',
                valueGetter: (params) => {
                    if (params.data.pstYn === 'Y') {
                        return '게시';
                    } else if (params.data.pstYn === 'N') {
                        return '비게시';
                    }
                },
                maxWidth: 100
            },
            {
                headerName: '대상',
                field: 'eventTarget',
                valueGetter: (params) => {
                    if (params.data.eventTarget === 'ALL') {
                        return '모든사용자';
                    }
                },
                maxWidth: 120
            },
            {
                headerName: '진행상태',
                field: 'eventProgress',
                maxWidth: 100,
                valueGetter: (params) => {
                    if (params.data.eventProgress === 'ING') {
                        return '진행중';
                    } else if (params.data.eventProgress === 'WAITING') {
                        return '대기';
                    } else if (params.data.eventProgress === 'END') {
                        return '종료';
                    } else if (params.data.eventProgress === 'STOP') {
                        return '긴급종료';
                    } else if (params.data.eventProgress === 'SOLD OUT') {
                        return '마감';
                    }
                }
            },
            {
                headerName: '이벤트기간',
                field: 'eventStartDt',
                valueGetter: (params) => {
                    return params.data.eventStartDt + '~' + params.data.eventEndDt;
                },
                minWidth: 180
            },
            { headerName: '당첨자발표', field: 'eventPzwnDt', maxWidth: 100 },
            { headerName: '이벤트코드', field: 'eventSn', maxWidth: 100 },
            { headerName: '등록자', field: 'adminId', maxWidth: 100 },
            {
                headerName: '등록일',
                field: 'fstRgsDt',
                minWidth: 150,
                valueGetter: (params) => {
                    return dayJS(params.data.fstRgsDt).format('YYYY-MM-DD hh:mm:ss');
                }
            }

        ]);
        const state = reactive({
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
            partnerName: '',
            pagesize: 10,
            setDay: '1month',
            startDay: '',
            endDay: '',
            eventList: [],
            eventType: [
                { label: '전체', value: '' },
                { label: '일반', value: 'GENERAL' },
                { label: '퀴즈', value: 'QUIZ' },
                { label: '룰렛', value: 'ROULETTE' },
                { label: '출석', value: 'ATTENDANCE' }
            ],
            eventIng: [
                { label: '전체', value: '' },
                { label: '진행중', value: 'ING' },
                { label: '대기', value: 'WAITING' },
                { label: '종료', value: 'END' },
                { label: '긴급종료', value: 'STOP' },
                { label: '마감', value: 'SOLD OUT' }
            ],
            benefitList: [
                { label: '전체', value: '' },
                { label: '혜택없음', value: 'NONE' },
                { label: '즉시지급', value: 'IMMEDIATELY' },
                { label: '당첨 후 지급', value: 'AFTER' }
            ],
            eventTarget: [
                { label: '전체', value: '' },
                { label: '모든사용자', value: 'ALL' },
                { label: '회원그룹', value: 'TARTGET' }
            ],
            eventKeyword: [
                { label: '전체', value: '' },
                { label: '이벤트제목', value: 'NAME' },
                { label: '이벤트 코드', value: 'CODE' }
            ],
            eventShow: [
                { label: '전체', value: '' },
                { label: '게시', value: 'Y' },
                { label: '비게시', value: 'N' }
            ]

        });
        const formData = reactive({
            startDt: computed(() => state.startDay), // 시작일
            endDt: computed(() => state.endDay), // 종료일
            periodType: 'eventStart', // 기간조회 타입 eventStart , eventEnd, eventReg
            eventType: '', // 이벤트 유형
            eventProcess: '', // 진행상태
            eventPst: '', //
            bnefType: '', //혜택구분
            eventTarget: '', //이벤트 대상
            searchType: '', //키워드 타입
            searchText: '' //키워드
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
            getEventList();

        };
        const showModal = () => {
            isMdShow.value = true;
        };
        //셀렉트박스 선택
        const selectedOptions = (value, type) => {
            console.log(value, type);
            if (type === 'page') {
                state.pagesize = value;
                clearList(1);
            }
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
            formData.periodType = status;
        };


        //리스트 갯수 변경 후 리스트 재 조회
        const clearList = (num) => {
            formData.periodType = 'eventStart';
            formData.eventType = '';
            formData.eventProcess = '';
            formData.eventPst = '';
            formData.bnefType = '';
            formData.eventTarget = '';
            formData.searchType = '';
            formData.earchTxt = '';
            onChangedPage(num);
        };
        // 데이터 피커 초기화
        const onInitDate = () => {
            dateSearch.value.initDate();
            clearList(1);
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
            goToPage(`/event/detail?eventSn=${e.data.eventSn}`);
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
        //다운로드 사유 등록 
        const downConfirm = (type, con) => {
            console.log(type, con);
            if (type === 'pass') {
                state.download.pass = con;
            } else {
                state.download.reason = con;
            }
        };
        //파트너 선택
        const selectPartner = (data) => {
            state.partnerName = data;
            console.log(data);
        };
        // const downExel = () => {
        //     $Modal.simple({
        //         title: '',
        //         message: '다운로드 하시겠습니까?',
        //         buttonText: {
        //             ok: '확인'
        //         }
        //     })
        //         .then(success => {
        //             console.log(success);
        //             let params = {
        //                 startDt: formData.startDt,
        //                 endDt: formData.endDt,
        //                 periodType: formData.periodType,
        //                 eventType: formData.eventType,
        //                 eventProcess: formData.eventProcess,
        //                 eventPst: formData.eventPst,
        //                 bnefType: formData.bnefType,
        //                 eventTaxYn: formData.eventTaxYn,
        //                 eventTarget: formData.eventTarget,
        //                 searchType: formData.searchType,
        //                 searchText: formData.searchText,
        //                 menuCode: '1023001'
        //             };
        //             fileDown(state.download, params, '/common/api/v1/event/list/excel');
        //             state.download = {};
        //             isDownShow.value = false;
        //         })
        //         .catch(error => {
        //             console.log(error);
        //         });
        // };
        // 모달창 닫기
        const modalControl = (type, modalName) => {
            if (!modalName) {
                isDownShow.value = false;
            }
            console.log(type, modalName);
        };
        //리스트 조회
        const getEventList = async () => {
            try {
                let params = {
                    size: pager.size,
                    offset: pager.offset,
                    startDt: formData.startDt,
                    endDt: formData.endDt,
                    periodType: formData.periodType,
                    eventType: formData.eventType,
                    eventProcess: formData.eventProcess,
                    eventPst: formData.eventPst,
                    bnefType: formData.bnefType,
                    eventTarget: formData.eventTarget,
                    searchType: formData.searchType,
                    searchText: formData.searchText
                };
                console.log(params);
                const response = await _getEventList(params);
                state.eventList = response.data.data.list;
                pager.totalCnt = response.data.data.totalCount;
                console.log(response.data);
            } catch (error) {
                console.log(error);
            }
        };

        return {
            //공통 사용
            $Modal,
            dayJS,
            goToPage,
            fileDown,
            tableResize,
            isDownShow,
            isPartnerShow,
            DownModalConRef,
            isImgShow,
            openModal,
            pager,
            formData,
            dateSearch,
            state,
            initColum,
            showModal,
            onChangedPage,
            onSelectPicker,
            selectedOptions,
            openMoreSerch,
            modalControl,
            onCellClicked,
            selectPartner,
            downConfirm,
            checkOptions,
            resetTable,
            onInitDate,
            reloadList,
            // downExel,

            checkRegist,
            menuInfo,
            onChangeDownRol,
            exelParams

        };
    }
};

</script>