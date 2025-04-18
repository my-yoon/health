<template>
    <section>
        <!-- 검색 -->
        <div class="ui-data-filter">
            <div class="form-item">
                <dateSerch :dateTitle="'기간조회'" @onSelectDate="onSelectPicker" :pickerOnly="false" :setDay="state.setDay"
                    ref="dateSearch"
                    :selectOptions="[{ label: '전체', value: '전체' }, { label: '당첨자 발표일', value: '' }, { label: '등록일', value: '' }]" />
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
                        <label>게시구분</label>
                        <span class="input">
                            <span class="dv">
                                <commselect :className="'sm'" :selectType="'searchCode.mbrStCd'"
                                    @changedValue="selectedOptions" :initData="formData.mbrStCd" />
                            </span>
                        </span>
                    </div>
                    <div class="item">
                        <label>게시구분</label>
                        <span class="input">
                            <span class="dv">
                                <select class="custom-select sm" v-model="formData.cnSercSe">
                                    <option v-for="(item, index) in state.searchcnSercSe" :key="index" :value="item.value">
                                        {{ item.label }}
                                    </option>
                                </select>
                            </span>
                            <span class="dv">
                                <input v-model="formData.cnSercCts" class="form-control sm" type="text">
                            </span>
                        </span>
                    </div>
                </div>
            </div>
        </div>

        <div class="tbl-wrap">
            <div class="table-util flex space-between">
                <div class="btn-set-m flex">
                    <button type="button" :class="['btn btn-ss', { active: state.mskgnRlsYn }]"
                        @click="() => { state.mskgnRlsYn = !state.mskgnRlsYn }">
                        <template v-if="!state.mskgnRlsYn">마스킹해제</template>
                        <template v-else>마스킹</template>
                    </button>
                </div>
                <div class="btn-set-m flex align-end">
                    <span class="table-total">조회결과 총 <strong>{{ pager.totalCnt }}</strong>건</span>
                    <button type="button" class="btn btn-opt" @click="openModal('isDownShow')">
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
import { getCurrentInstance, computed, reactive, inject, onMounted, ref, watchEffect } from 'vue';
import DefaultModal from '@/plugins/modal/modal/DefaultModal.vue';
import DateSerch from '@/components/ui/DateSerch.vue';
import { useCommFunc } from '@/core/helper/common.js';
import { format } from 'date-fns';
import { useStore } from 'vuex';
import { _getPzwrList } from '@/api/event.js';
export default {
    components: { DefaultModal, DateSerch },
    setup() {
        const internalInstance = getCurrentInstance();
        const $Modal = inject('$Modal');
        const dayJS = inject('dayJS');
        const store = useStore();
        const dateSearch = ref(null);
        const { goToPage, fileDown, tableResize, openModal, isPartnerShow, isDownShow, isImgShow } = useCommFunc();
        const initColum = ref([
            {
                headerName: '번호',
                field: 'no',
                maxWidth: 80,
                valueGetter: 'node.rowIndex + 1',
                suppressSizetoFit: true
            },
            { headerName: '제목', field: 'title' },
            { headerName: '게시구분', field: 'mbrSn' },
            { headerName: '당첨발표일', field: 'eventPzwnDt' },
            { headerName: '등록자', field: 'adminName' },
            { headerName: '등록일자', field: 'regDate', maxWidth: 100 }
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
            mskgnRlsYn: false,
            setDay: '1month',
            startDay: '',
            endDay: '',
            pzwrList: []
        });
        const formData = reactive({
            periodType: '', // 기간조회타입
            startDt: computed(() => state.startDay), // 시작일
            endDt: computed(() => state.endDay), // 종료일
            eventProcess: '',
            eventPst: '',
            bnefType: '',
            eventTarget: '',
            searchType: '',
            searchText: ''

        });

        onMounted(() => {
            getPzwrList();
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
            if (status === '가입일자') {
                formData.inqType = 'jnDate';
            } else if (status === '수정일자') {
                formData.inqType = 'utDate';
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
                    eventProcess: formData.eventProcess,
                    eventPst: formData.eventPst,
                    bnefType: formData.bnefType,
                    eventTarget: formData.eventTarget,
                    searchType: formData.searchType,
                    searchText: formData.searchText
                };
                const response = await _getPzwrList(params);
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
            console.log(formData);
            getPzwrList();
        };

        const onCellClicked = (e) => {
            console.log(e.data);
            goToPage(`/memberinfodetail?mbrSn=${e.data.mbrSn}&&mskgnRlsYn=${(state.mskgnRlsYn ? 'Y' : 'N')}`);
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
            downConfirm,
            selectPartner,
            reloadList


        };
    }
};

</script>