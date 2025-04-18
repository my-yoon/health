<template>
    <div>
        <!-- 검색 -->
        <div class="ui-data-filter">
            <div class="form-item">
                <dateSerch :dateTitle="'등록일'" @onSelectDate="onSelectPicker" :pickerOnly="true" :setDay="state.setDay"
                    ref="dateSearch" />
                <div class="item">
                    <label>상태</label>
                    <span class="input">
                        <span class="dv">
                            <select class="custom-select sm" v-model="formData.aprvStCd">
                                <option v-for="(item, index) in state.approList" :key="index" :value="item.value">
                                    {{ item.label }}
                                </option>
                            </select>
                        </span>
                    </span>
                </div>
                <div class="item">
                    <label>승인요청내용</label>
                    <span class="input">
                        <span class="dv">
                            <input v-model="formData.cnSercCts" class="form-control sm" type="text">
                        </span>
                    </span>
                </div>
                <div class="btn-filter-set">
                    <button type="button" class="btn btn-sm" @click="reloadList"><span class="ico-search"></span>조회
                    </button>
                    <button type="button" class="btn btn-sm" @click="onInitDate">
                        <span class="ico-reload sg"></span>
                        <span class="offscreen">리로드</span>
                    </button>
                </div>
            </div>
        </div>

        <div class="tbl-wrap">
            <div class="table-util flex space-between">
                <div class="btn-set-m flex">
                    <button type="button" class="btn btn-ss" @click="onChangeRegistRol(menuInfo.auth1RegistYn)">등록</button>
                    <button type="button" class="btn btn-ss" @click="actionBtns('prev')">Front 미리보기</button>
                </div>
                <div class="btn-set-m flex align-end">
                    <span class="table-total">조회결과 총 <strong>{{ pager.totalCnt }}</strong>건</span>
                    <button type="button" class="btn btn-opt"
                        @click="onChangeDownRol(menuInfo.auth5DownloadYn, 'Y', excelParams)">
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
            <NoData :nodatatext="'조회된 데이터가 없습니다.'" v-if="state.mainlist.length === 0"></NoData>
            <div v-else>
                <AgGridVue :columnDefs="state.tableColum_c" :rowData="state.mainlist" :defaultColDef="state.defaultColDef"
                    @cell-clicked="onCellClicked" class="ag-theme-alpine" :domLayout="state.domLayout" style="width:100%">
                </AgGridVue>
                <PageNavigation :cntPerPage='pager.size' :itemCount='pager.totalCnt' :currentPage="pager.current"
                    @changedPage="onChangedPage" />
            </div>

        </div>
        <DefaultModal :buttonCancel="'닫기'" :buttonConfirm="''" :isShow="isShowPrev" :modalName="'isShowPrev'"
            :modalTitle="'FRONT 미리보기'" @modalclose="modalControl" class="ui-modal">
            <template #modalcontent>
                <div>
                    <div class="ui-title-3">
                        <h3>최종수정일:{{ dayJS(new Date()).format('YYYY. MM. DD') }}</h3>
                    </div>
                    <div class="ui-section">
                        <div class="main-layout-preview">
                            <div class="layout-item" v-for="(item, index) in state.mainPrevlist" :key="index">
                                {{ item.mainScrnSctnNm }}
                            </div>
                        </div>
                    </div>
                </div>
            </template>
        </DefaultModal>

    </div>
</template>
<script>
import { getCurrentInstance, computed, reactive, inject, onMounted, ref, watch, onUnmounted } from 'vue';
import { useCommFunc } from '@/core/helper/common.js';
import { authCommFunc } from '@/core/helper/authComm.js';
import { format } from 'date-fns';
import { useStore } from 'vuex';
import { _getMainlist, _getMainSection } from '@/api/exhibit.js';
import DefaultModal from '@/plugins/modal/modal/DefaultModal.vue';
import DateSerch from '@/components/ui/DateSerch.vue';
import BannerOrder from './components/BannerOrder.vue';

export default {
    components: { DefaultModal, DateSerch, BannerOrder },
    setup() {
        const internalInstance = getCurrentInstance();
        const $Modal = inject('$Modal');
        const dayJS = inject('dayJS');
        const store = useStore();
        const dateSearch = ref(null);
        const isShowPrev = ref(false);
        const { goToPage, tableResize, openModal } = useCommFunc();
        const initColum = ref([
            {
                headerName: '번호',
                field: 'no',
                maxWidth: 80,
                valueGetter: 'node.rowIndex + 1',
                suppressSizetoFit: true
            },
            { headerName: '수정내용', field: 'aprvRqstCts' },
            { headerName: '상태', field: 'mainScrnStNm', maxWidth: 120 },
            { headerName: '등록자', field: 'rgtrNm', maxWidth: 150 },
            { headerName: '등록일시', field: 'rgsDt', maxWidth: 160 },
            {
                headerName: '승인/반려자',
                field: 'aprvMnNm',
                maxWidth: 140,
                valueGetter: (params) => {
                    if (params.data.aprvMnNm === null) return '즉시반영';
                    else return params.data.aprvMnNm;
                }
            },
            { headerName: '노출대상', field: 'mainScrnNm', maxWidth: 120 },
            { headerName: '승인/반려일시', field: 'aprvDt', maxWidth: 160 }
        ]);
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

        const { onChangeMaskingRol, onChangeDownRol, onChangeRegistRol } = authCommFunc();
        const menuInfo = computed(() => store.state.getMenuItem.menuInfo);
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
            mskgnRlsYn: false,
            setDay: '1month',
            startDay: '',
            endDay: '',
            mainlist: [],
            validState: {
                errState: false, // error state
                message: '', // input message
                target: ''
            },
            btnRegist: null,
            menuCode: computed(() => menuInfo.value.menuCode),
            approList: [
                { label: '전체', value: '' },
                { label: '승인대기', value: '384001' },
                { label: '승인반려', value: '384002' },
                { label: '승인완료', value: '384003' }
            ],
            mainPrevlist: []
        });
        const formData = reactive({
            bgnDate: '', //시작일자 [YYYY-MM-DD]
            endDate: '', //종료일자 [YYYY-MM-DD]
            aprvStCd: '', //승인상태코드 [승인대기(400001), 승인반려(400002), 승인완료(40000)]
            aprvReqCts: '', //승인요청내용
            menuCode: computed(() => state.menuCode)
        });

        onMounted(() => {
            //등록 권한 확인 후  페이지 이동
            emitter.$on('onChangeRegist', onChangeRegist);
            getMainlist();
        });
        onUnmounted(() => {
            emitter.$off('onChangeRegist');
        });
        const onChangeRegist = () => {
            // goToPage('/display/main/reg');
            if (state.btnRegist) {
                $Modal.confirm({
                    title: '',
                    message: '승인 대기중인 상태가 있습니다.',

                    buttonText: {
                        confirm: '확인'
                    }
                });
            } else {
                goToPage('/display/main/reg');
            }

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
            pager.current = pagenum;
            //테이블 인덱스 번호 처리
            initColum.value[0].valueGetter = 'node.rowIndex + ' + Number(pager.size * (pager.current - 1) + 1);
            //api호출
            getMainlist();
        };

        //셀렉트박스 선택
        const selectedOptions_list = (value, type) => {
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
        };
        // 데이터 피커 초기화
        const onInitDate = () => {
            dateSearch.value.initDate();
            //재조회  api 호출
            clearList(1);
        };

        //리스트 조회
        const getMainlist = async () => {
            try {
                let params = {
                    size: pager.size,
                    offset: pager.offset,
                    bgnDate: formData.bgnDate,
                    endDate: formData.endDate,
                    aprvStCd: formData.aprvStCd,
                    aprvReqCts: formData.aprvReqCts,
                    menuCode: formData.menuCode
                };
                console.log(params);
                const response = await _getMainlist(params);
                pager.totalCnt = response.data.data.totalCnt;
                state.mainlist = response.data.data.list;
                state.btnRegist = state.mainlist.some(v => v.mainScrnStCd === '384001');
                console.log(state.btnRegist);

            } catch (error) {
                console.log(error);
            }
        };

        const actionBtns = (type) => {
            if (type === 'prev') {
                isShowPrev.value = true;
                getMainSection();
            }
        };
        const modalControl = (type, modalName) => {
            isShowPrev.value = false;
        };
        // 메인 관리 구조
        const getMainSection = async () => {
            try {
                // 메인화면코드 [385001:오늘(홈), 385002:챌린지, 385003:건강, 385004:커뮤니티]
                let params = {
                    mcd: '385001'
                };
                const response = await _getMainSection(params.mcd);
                state.mainPrevlist = response.data.data.list;
                console.log(state.mainPrevlist);


            } catch (error) {
                console.log(error);

            }
        };

        const initParams = () => {
            formData.aprvStCd = '';
            formData.aprvReqCts = '';
        };
        //리스트 갯수 변경 후 리스트 재 조회
        const clearList = (num) => {
            initParams();
            onChangedPage(num);
            dateSearch.value.initDate();
        };

        //검색조건에 따른 리스트 재조회
        const reloadList = () => {
            pager.current = 1;
            onChangedPage(pager.current);
        };

        const onCellClicked = (e) => {
            console.log(e.data);
            goToPage(`/display/main/detail?mainSn=${e.data.mainScrnMngSn}`);
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
        // 엑셀용 함수
        const excelParams = reactive({
            params: {
                menuCode: computed(() => formData.menuCode),
                bgnDate: computed(() => formData.bgnDate),
                endDate: computed(() => formData.endDate),
                aprvStCd: computed(() => formData.aprvStCd),
                aprvReqCts: computed(() => formData.aprvReqCts)
            },
            url: '/common/api/v1/exhibit/main-section/excel'

        });
        return {
            //공통 사용
            $Modal,
            dayJS,
            goToPage,
            tableResize,
            openModal,
            pager,
            isShowPrev,
            menuInfo,
            state,
            formData,
            initColum,
            dateSearch,
            onChangeDownRol,
            onChangeRegistRol,
            reloadList,
            onCellClicked,
            onSelectPicker,
            onInitDate,
            selectedOptions_list,
            actionBtns,
            modalControl,
            onChangedPage,
            excelParams


        };
    }
};

</script>