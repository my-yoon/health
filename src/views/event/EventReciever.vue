<template>
    <section>
        <!-- 검색 -->
        <div class="ui-data-filter">
            <div class="form-item">
                <dateSerch :dateTitle="'기간조회'" @onSelectDate="onSelectPicker" :pickerOnly="false" :setDay="state.setDay"
                    ref="dateSearch"
                    :selectOptions="[{ label: '전체', value: '전체' }, { label: '당첨자 발표일', value: '당첨자 발표일' }, { label: '등록일', value: '등록일' }]" />
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
                        <label>이벤트 유형</label>
                        <span class="input">
                            <span class="dv">
                                <select class="custom-select sm" v-model="formData.eventType">
                                    <option v-for="(item, index) in state.eventType" :key="index" :value="item.value">
                                        {{ item.label }}
                                    </option>
                                </select>
                            </span>
                        </span>
                    </div>
                    <div class="item">
                        <label>제세공과금</label>
                        <span class="input">
                            <span class="dv">
                                <!-- v-model="formData.eventType" -->
                                <select class="custom-select sm" v-model="formData.eventTaxYn">
                                    <option v-for="(item, index) in state.eventTax" :key="index" :value="item.value">
                                        {{ item.label }}
                                    </option>
                                </select>
                            </span>
                        </span>
                    </div>
                    <div class="item">
                        <label>지급상태</label>
                        <span class="input">
                            <span class="dv">
                                <!-- v-model="formData.eventType" -->
                                <select class="custom-select sm" disabled>
                                    <option v-for="(item, index) in state.eventPdtpro" :key="index" :value="item.value">
                                        {{ item.label }}
                                    </option>
                                </select>
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
                                    <option v-for="(item, index) in state.searchType" :key="index" :value="item.value">
                                        {{ item.label }}
                                    </option>
                                </select>
                            </span>
                            <span class="dv">
                                <input v-model="formData.searchText" class="form-control sm" type="text"
                                    :disabled="formData.searchType === ''">
                            </span>
                        </span>
                    </div>
                </div>
            </div>
        </div>
        <!--{{ formData }}-->
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
import { computed, reactive, inject, onMounted, onUnmounted, ref, watch } from 'vue';
import DefaultModal from '@/plugins/modal/modal/DefaultModal.vue';
import DateSerch from '@/components/ui/DateSerch.vue';
import { useCommFunc } from '@/core/helper/common.js';
import { authCommFunc } from '@/core/helper/authComm.js';
import { useStore } from 'vuex';
import { _getPzwrManage } from '@/api/event.js';
export default {
    components: { DefaultModal, DateSerch },
    setup() {
        // const internalInstance = getCurrentInstance();
        const $Modal = inject('$Modal');
        const dayJS = inject('dayJS');
        const store = useStore();
        const dateSearch = ref(null);
        const DownModalConRef = ref(null);
        const { goToPage, tableResize, openModal, isPartnerShow, isDownShow, isImgShow } = useCommFunc();
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
            {
                headerName: '번호',
                field: 'no',
                maxWidth: 80,
                valueGetter: 'node.rowIndex + 1',
                suppressSizetoFit: true
            },
            { headerName: '이벤트제목', field: 'eventNm' },
            { headerName: '회원번호', field: 'pzwrMbrSn', maxWidth: 130 },
            { headerName: '이름', field: 'mbrNm', maxWidth: 100 },
            { headerName: '휴대폰번호', field: 'mbrHp', maxWidth: 130 },
            { headerName: '이메일 주소', field: 'mbrEmail', maxWidth: 150 },
            {
                headerName: '유형',
                field: 'eventTy',
                maxWidth: 100,
                valueGetter: (params) => {
                    if (params.data.eventTy === 'ROULETTE') {
                        return '룰렛';
                    } else if (params.data.eventTy === 'GENERAL') {
                        return '일반';
                    } else if (params.data.eventTy === 'QUIZ') {
                        return '퀴즈';
                    } else if (params.data.eventTy === 'ATTENDANCE') {
                        return '출석';
                    }
                }
            },
            {
                headerName: '제세공과금 대상',
                field: 'productTax',
                maxWidth: 100,
                valueGetter: (params) => {
                    if (params.data.productTax === 'Y') {
                        return '대상';
                    } else if (params.data.eventTy === 'N') {
                        return '비대상';
                    }
                }
            },
            // { headerName: '지급상태', field: 'regDate', maxWidth: 100 },
            // { headerName: '상품유형', field: 'regDate', maxWidth: 100 },
            { headerName: '당첨자 발표일', field: 'pzwnAncDt', maxWidth: 130 }
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
            // download: { pass: '', reason: '' },
            pagesize: 10,
            mskgnRlsYn: true,
            mskgnTried: false, // 마스킹 해제 여부 ( 1회 실행 가능 - 1회 마스킹해제 시 제 실행 불가 )
            setDay: '1month',
            startDay: '',
            endDay: '',
            pzwrList: [],
            eventType: [
                { label: '전체', value: '' },
                { label: '일반', value: 'GENERAL' },
                { label: '퀴즈', value: 'QUIZ' },
                { label: '룰렛', value: 'ROULETTE' }
            ],
            eventTax: [
                { label: '전체', value: '' },
                { label: '대상', value: 'Y' },
                { label: '비대상', value: 'N' }
            ],
            eventPdtpro: [
                { label: '전체', value: '' },
                { label: '발송전', value: 'GENERAL' },
                { label: '발송완료', value: 'QUIZ' }
            ],
            searchType: [
                { label: '전체', value: '' },
                { label: '이벤트 제목', value: 'NAME' },
                { label: '회원번호', value: 'MBRSN' },
                { label: '이름', value: 'MBRNM ' },
                { label: '이벤트 번호', value: 'EVENTSN' }
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
            eventTaxYn: '',
            mskgnRlsYn: computed(() => state.mskgnRlsYn ? 'Y' : 'N')
        });

        // 엑셀용 함수
        const exelParams = reactive({
            params: {
                periodType: computed(() => formData.periodType),
                startDt: computed(() => formData.startDt),
                endDt: computed(() => formData.endDt),
                eventType: computed(() => formData.eventType),
                eventTaxYn: computed(() => formData.eventTaxYn),
                searchType: computed(() => formData.searchType),
                searchText: computed(() => formData.searchText),
                mskgnRlsYn: computed(() => formData.mskgnRlsYn),
                menuCode: computed(() => menuInfo.value.menuCode)
            },
            url: '/common/api/v1/event/pwzr/manage/excel'
        });

        onMounted(() => {
            getPzwrManage();
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
            getPzwrManage();
        };
        watch(formData, () => {
            console.log('change formData');
            if (state.mskgnTried) {
                state.mskgnRlsYn = true;
            }
        });

        const initParams = () => {
            formData.periodType = '';
            formData.eventProcess = '';
            formData.eventType = '';
            formData.eventPst = '';
            formData.bnefType = '';
            formData.eventTarget = '';
            formData.searchType = '';
            formData.searchText = '';
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
            getPzwrManage();
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
                formData.periodType = 'pzwrDate';
            } else if (status === '등록일') {
                formData.periodType = 'eventReg';
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
        //리스트 조회
        const getPzwrManage = async () => {
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
                    mskgnRlsYn: formData.mskgnRlsYn,
                    eventTaxYn: formData.eventTaxYn
                };
                const response = await _getPzwrManage(params);
                state.pzwrList = response.data.data.list;
                pager.totalCnt = response.data.data.totalcount;
                state.mskgnTried = false;
                console.log(response.data);
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
        };

        const onCellClicked = (e) => {
            console.log(e.data);
            goToPage(`/event/after_reciever_detail?eventSn=${e.data.eventSn}`);
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

        //파트너 선택
        const selectPartner = (data) => {
            state.partnerName = data;
            console.log(data);
        };

        return {
            //공통 사용
            $Modal,
            dayJS,
            goToPage,
            // fileDown,
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
            DownModalConRef,

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
            selectPartner,
            reloadList,

            menuInfo,
            exelParams,
            onChangeDownRol,
            changeMskgnRlsYn


        };
    }
};

</script>