<template>
    <section>
        <!-- 검색 -->
        <div class="ui-data-filter">
            <div class="form-item">
                <div class="item">
                    <label>조건검색</label>
                    <span class="input">
                        <span class="dv">
                            <selectBox :selectType="'codeGrp'" @changedValue="selectedOptions" />
                        </span>
                        <span class="dv"><input type="text" class="form-control sm" v-model="state.searchword"></span>
                    </span>
                </div>
                <div class="item">
                    <label>사용여부</label>
                    <span class="input">
                        <span class="dv">
                            <selectBox :selectType="'useYn'" @changedValue="selectedOptions" />
                        </span>
                    </span>
                </div>
                <div class="btn-filter-set">
                    <button type="button" class="btn btn-sm" @click="reloadList"><span class="ico-search"></span>조회
                    </button>
                    <button type="button" class="btn btn-sm" @click="resetList">
                        <span class="ico-reload sg"></span>
                        <span class="offscreen">리로드</span>
                    </button>
                </div>
            </div>

        </div>
        <div class="tbl-wrap">
            <div class="table-util flex space-between">
                <div class="btn-set-m flex">
                    <button type="button" class="btn btn-ss" @click="checkRegist">등록</button>
                </div>
                <div class="btn-set-m flex align-end">
                    <span class="table-total">조회결과 총 <strong>{{ pager.totalCnt }}</strong>건</span>
                    <button type="button" class="btn btn-opt" @click="onChangeDownRol(menuInfo.auth5DownloadYn, 'Y', exelParams)">
                        <span class="ico-download"></span>파일다운로드
                    </button>
                    <selectBox :selectType="'page'" @changedValue="selectedOptions" />

                    <button type="button" class="btn btn-opt-ico fit" @click="tableResize">
                        <span class="offscreen">컬럼 리사이징</span>
                    </button>

                    <!-- 클래스 : close -->
                    <button type="button" class="btn btn-opt-ico filter" @click="resetTable">
                        <span class="offscreen">컬럼 셋팅</span>
                    </button>
                </div>
            </div>
            <columlist :columlists="initColum" @checkColum="checkOptions" />
            <NoData :nodatatext="'조회된 데이터가 없습니다.'" v-if="state.commonCodeList.length === 0"></NoData>
            <div v-else>
                <AgGridVue :columnDefs="state.tableColum_c" :rowData="state.commonCodeList"
                    :defaultColDef="state.defaultColDef" class="ag-theme-alpine" :rowSelection="'multiple'"
                    @grid-ready="onGridReady" @cell-clicked="tableBtnControl" :suppressRowClickSelection="false"
                    :domLayout="'autoHeight'" style="width:100%">
                </AgGridVue>
                <PageNavigation :cntPerPage='pager.size' :itemCount='pager.totalCnt' :currentPage="pager.current"
                    @changedPage="onChangedPage" />
            </div>

        </div>
        <!-- 다운로드 사유 등록 -->
        <!-- <DefaultModal :isShow="isDownShow" :modalTitle="'다운로드 사유 등록'" :buttonConfirm="'저장'" :buttonCancel="''"
            :modalName="'isDownShow'" @modalclose="modalControl">
            <template #modalcontent>
                <DownModalCon @downloadFormat="downConfirm" />
            </template>
        </DefaultModal> -->
    </section>
</template>
<script>
import { computed, reactive, inject, ref, onMounted, onUnmounted, nextTick } from 'vue';
import DefaultModal from '@/plugins/modal/modal/DefaultModal.vue';
import DateSerch from '@/components/ui/DateSerch.vue';
import { useCommFunc } from '@/core/helper/common.js';
import { authCommFunc } from '@/core/helper/authComm.js';
import { _getCommonList } from '@/api/standard.js';
import { useStore } from 'vuex';
export default {
    components: { DefaultModal, DateSerch },
    setup() {
        const store = useStore();
        const $Modal = inject('$Modal');
        const dayJS = inject('dayJS');
        const { goToPage, fileDown, tableResize, openModal, isDownShow } = useCommFunc();

        const { onChangeRegistRol, onChangeDownRol } = authCommFunc();
        const menuInfo = computed(() => store.state.getMenuItem.menuInfo);

        const initColum = ref([
            {
                headerName: 'NO',
                field: 'no',
                maxWidth: 80,
                valueGetter: 'node.rowIndex + 1',
                suppressSizetoFit: true
            },
            { headerName: '코드', field: 'cmnCd', Width: 350 },
            { headerName: '상위그룹코드명', field: 'depth1CmnCdNm', width: 350 },
            { headerName: '코드그룹명', field: 'depth2CmnCdNm', maxWidth: 120 },
            { headerName: '상세코드명', field: 'depth3CmnCdNm', maxWidth: 150 },
            { headerName: '세부코드명', field: 'depth4CmnCdNm', maxWidth: 100 },
            { headerName: '코드설명', field: 'rmk', maxWidth: 150 },
            { headerName: '사용여부', field: 'useYn', maxWidth: 100 },
            { headerName: '수정일시', field: 'lastUpdDt', maxWidth: 150 },
            { headerName: '상세보기', field: 'cmnCdSn', maxWidth: 90, cellRenderer: 'tableBtn' }

        ]);

        const state = reactive({
            //테이블데이터
            commonCodeList: [],
            tableColum_c: _.clone(initColum),
            filterCoulm: [],
            //테이블 옵션
            defaultColDef: {
                sortable: true,
                filter: false,
                resizable: true,
                flex: 1
            },
            pagesize: 10,
            formData: {
                uprGrpCd: '',
                uprGrpCdNm: '',
                useYn: ''
            },
            searchType: 'GrpCdID',
            searchword: '',
            gridApi: null,
            gridColumApi: null
        });

        // 엑셀용 함수
        const exelParams = reactive({
            params: {
                menuCode: computed(() => menuInfo.value.menuCode)
            },
            url: '/common/api/v1/standardManagement/commonCode/excel'

        });

        onMounted(() => {
            emitter.$on('bus_codeListDetail', tableBtnControl);
            getCommonList();

            emitter.$on('onChangeRegist', onChangeRegist);
        });

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
         * 등록 권한 체크 callback
         */
        const onChangeRegist = () => {
            goToPage('/standard/commoncode/register');
        };

        //검색조건에 따른 리스트 재조회
        const reloadList = () => {
            pager.current = 1;
            clearList(1);
            console.log(state.searchType, state.searchword, state.formData.useYn);
        };
        //리스트 리셋
        const resetList = () => {
            state.searchword = '';
            state.formData.useYn = '';
            state.searchType = 'GrpCdID';
            clearList(1);
        };
        //리스트 조회
        const getCommonList = async () => {
            try {
                let params = {
                    size: pager.size,
                    offset: pager.offset,
                    uprGrpCd: state.searchType === 'GrpCdID' ? state.searchword : '',
                    uprGrpCdNm: state.searchType === 'GrpCdNm' ? state.searchword : '',
                    useYn: state.formData.useYn
                };
                console.log(params);
                const response = await _getCommonList(params);
                state.commonCodeList = [];
                //데이터 가공(1depth/2depth/3depth 표시)
                response.data.data.list.forEach((element, index) => {
                    for (let i = 0; i < element.pathNm.split('-').length; i++) {
                        state.commonCodeList[index] = element;
                        state.commonCodeList[index].depth1CmnCdNm = element.pathNm.split('-')[0];
                        state.commonCodeList[index].depth2CmnCdNm = element.pathNm.split('-')[1];
                        state.commonCodeList[index].depth3CmnCdNm = element.pathNm.split('-')[2];
                    }

                });
                // state.commonCodeList = response.data.data.list;
                pager.totalCnt = response.data.data.totalCnt;
            } catch (error) {
                console.log(error);
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
            //console.log(pagenum);
            pager.current = pagenum;
            //테이블 인덱스 번호 처리
            initColum.value[0].valueGetter = 'node.rowIndex + ' + Number(pager.size * (pager.current - 1) + 1);
            getCommonList();
        };
        //셀렉트박스 선택
        const selectedOptions = (value, type) => {
            console.log(value, type);
            if (type === 'page') {
                state.pagesize = value;
                clearList(1);
            } else if (type === 'codeGrp') {
                state.searchType = value;
            } else if (type === 'useYn') {
                state.formData.useYn = value;
            }
        };
        //리스트 갯수 변경 후 리스트 재 조회
        const clearList = (num) => {
            onChangedPage(num);
            // getCommonList();
        };

        // 테이블 리사이징을 위한 참조값
        const onGridReady = (params) => {
            state.gridApi = params.api;
            state.gridColumApi = params.columnApi;
            // console.log(params.columnApi);
        };

        //공통코드상세보기 처리
        const tableBtnControl = (e) => {
            nextTick(() => {
                const code = state.gridApi.getFocusedCell().column.colId === 'cmnCdSn';
                if (code) {
                    console.log('공통코드상세보기 사용', e.data.cmnCd);
                    goToPage(`/standard/commoncode/register?code=${e.data.cmnCd}`);
                }
            });
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
        // const downConfirm = (type, con) => {
        //     console.log(type, con);
        //     if (type === 'pass') {
        //         state.download.pass = con;
        //     } else {
        //         state.download.reason = con;
        //     }
        // };
        // 모달창 닫기
        // const modalControl = (type, modalName) => {
        //     if (modalName === 'isDownShow') {
        //         isDownShow.value = false;
        //         fileDown(state.download);
        //     } else if (!modalName) {
        //         isDownShow.value = false;
        //     }
        //     console.log(type, modalName);
        // };
        return {
            //공통 사용
            $Modal,
            dayJS,
            goToPage,
            fileDown,
            tableResize,
            // isDownShow,
            // openModal,
            pager,
            state,
            initColum,
            onChangedPage,
            selectedOptions,
            tableBtnControl,
            // modalControl,
            checkOptions,
            resetTable,
            // downConfirm,
            reloadList,
            resetList,
            onGridReady,
            getCommonList,

            menuInfo,
            exelParams,
            checkRegist,
            onChangeDownRol

        };
    }
};

</script>

