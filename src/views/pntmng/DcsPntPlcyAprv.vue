<template>
    <section class="s1">
        <!-- 검색 -->
        <div class="ui-data-filter">
            <div class="form-item">
                <div class="item">
                    <label>정책상태</label>
                    <span class="input">
                        <span class="dv">
                            <CommonBtn :init="'선택'" :grCdId="'206000'" :val="searchData.plcyStCd" :delOption="['206001']"
                                    @changedValue="(value) => searchData.plcyStCd = value" :className="'custom-select sm'" />
                        </span>
                    </span>
                </div>

                <div class="item">
                    <dateSerch :dateTitle="'정책등록일'" @onSelectDate="onSelectPicker" :setDay="state.setDay"
                    ref="dateSearch" :pickerOnly="true" />
                </div>

                <div class="item">
                    <label>정책명</label>
                    <span class="input">
                        <input type="text" class="form-control" v-model="searchData.pntPlcyNm" @keyup="enterToSearch">
                    </span>
                </div>

                <div class="btn-filter-set">
                    <button type="button" class="btn btn-sm" @click="onChangedPage(1, 'search')">
                        <span class="ico-search"></span>조회 </button>
                    <button type="button" class="btn btn-sm" @click="initSearch">
                        <span class="ico-reload sg"></span>
                        <span class="offscreen">리로드</span>
                    </button>
                    <button type="button" class="btn btn-sm" @click="toggleSearch">
                        <span class="txt">{{ searchShow ? '상세검색 닫기' :'상세검색 열기' }}</span>
                    </button>
                </div>
            </div>
            <div v-if="searchShow" class="ui-data-filter-more">
                <div class="form-item">
                    <div class="item">
                        <label>포인트유형</label>
                        <span class="input">
                            <span class="dv">
                                <CommonBtn :init="'전체'" :grCdId="'207000'" :val="searchData.pntIssTyCd"
                                    @changedValue="(value) => searchData.pntIssTyCd = value" :className="'custom-select sm'" />
                            </span>
                        </span>
                    </div>
                    <div class="item">
                        <label>카테고리</label>
                        <span class="input">
                            <span class="dv">
                                <CommonBtn :init="'선택'" :grCdId="'290000'" :val="searchData.pntCtgrMjcsCd"
                                    @changedValue="changePntCtgrMjcsCd" :className="'custom-select'" />
                            </span>
                            <span class="dv">
                                <CommonBtn ref="pntCtgrMdcsCdRef" v-if="searchData.pntCtgrMjcsCd" :init="'선택'" :grCdId="searchData.pntCtgrMjcsCd" :val="searchData.pntCtgrMdcsCd"
                                    @changedValue="(value) => searchData.pntCtgrMdcsCd = value" :className="'custom-select'" />
                            </span>
                        </span>
                    </div>
                </div>
            </div>
        </div>
        <!-- 테이블 -->
        <div class="tbl-wrap">
            <div class="table-util flex space-between">
                <div class="btn-set-m flex">
                    <button type="button" class="btn btn-ss" @click="checkAuth('reject');">반려</button>
                    <button type="button" class="btn btn-ss" @click="checkAuth('aprv');">승인</button>
                </div>
                <div class="btn-set-m flex align-end">
                    <span class="table-total">조회결과 총 <strong>{{pager.totalCnt.toLocaleString('ko')}}</strong>건</span>
                    <button type="button" class="btn btn-ss" :disabled="!state.mskgnRlsYn"
                        @click="changeMskgnRlsYn(!state.mskgnRlsYn)">
                        <template v-if="state.mskgnRlsYn">마스킹해제</template>
                        <template v-else>마스킹</template>
                    </button>
                    <div class="btn-file">
                        <input type="file" id="upload-file" hidden="" @change="uploadFile">
                        <label class="btn-up" for="upload-file">양식업로드</label>
                    </div>
                    <button type="button" class="btn btn-opt"
                        @click="onChangeDownRol(menuInfo.auth5DownloadYn, searchData.maskingReleaseYn, exelParams)">
                        <span class="ico-download"></span>파일다운로드
                    </button>
                    <selectBox :selectType="'page'" @changedValue="selectedOptions" />
                    <button type="button" class="btn btn-opt-ico fit" @click="sizeToFit" ><span class="offscreen">컬럼 리사이징</span></button>
                    <button type="button" class="btn btn-opt-ico filter"  @click="resetTable"><span class="offscreen">컬럼 셋팅</span></button> <!-- 클래스 : close -->
                </div>
            </div>

            <columlist :columlists="tablelist_dcsPntPlcyAprv_label" @checkColum="checkOptions" />
            <NoData :nodatatext="'조회된 데이터가 없습니다.'" v-if="state.rowData.length === 0"></NoData>
            <template v-else>
                <AgGridVue :defaultColDef="state.defaultColDef" :columnDefs="state.tableColum_c"
                    :rowData="state.rowData" @grid-ready="onGridReady" @cell-clicked="cellClicked"
                    :suppressRowClickSelection="true" @selection-changed="onRowSelect" :rowSelection="'multiple'"
                    class="ag-theme-alpine" :domLayout="'autoHeight'"
                    v-if="state.rowData.length > 0">
                </AgGridVue>
                <PageNavigation :cntPerPage='pager.size' :itemCount='pager.totalCnt' :currentPage="pager.current"
                @changedPage="onChangedPage" />
            </template>
        </div>
        
        <AthrRsnPop v-if="isShow && popInfo.modalType != 'aprv'" :baseData="popInfo" @rsnData="closeModal"/>
        <DefaultModal :isShow="isShow && popInfo.modalType == 'aprv'" :modalTitle="popInfo.modalTitle" :buttonConfirm="'확인'" :buttonCancel="'취소'"
            @modalclose="closeModal">
            <template #modalcontent>
                <div >{{ popInfo.modalMessage }}</div>
            </template>
        </DefaultModal>
    </section>
</template>
<script>
import { computed, reactive, onMounted, inject, ref } from 'vue';
import DefaultModal from '@/plugins/modal/modal/DefaultModal.vue';
import DateSerch from '@/components/ui/DateSerch.vue';
import { _getDcsPntPlcyList, _setAthrAprvRes } from '@/api/pntmng.js';
import { useCommFunc } from '@/core/helper/common.js';
import { tablelist_dcsPntPlcyAprv_label } from '@/data/table/pntmngtable.js';
import AthrRsnPop from '@/views/pntmng/component/AthrRsnPop.vue';
import CommonBtn from '@/views/pntmng/component/CommonBtn.vue';
import { useRouter} from 'vue-router';
import { dmCommFunc } from '@/views/pntmng/common/common.js';
import { _uploadFile } from '@/api/common.js';
import { _editCommonCode } from '@/api/standard.js';
import { useStore } from 'vuex';
import { authCommFunc } from '@/core/helper/authComm.js';

export default {
    components: {DefaultModal, DateSerch, AthrRsnPop, CommonBtn},
    setup() {
        const router = useRouter();
        const dateSearch = ref(null);
        const pntCtgrMdcsCdRef  = ref(null);
        const { goToPage } = useCommFunc();
        const {toggleSearch, searchShow, modal, popInfo, isShow } = dmCommFunc();
        const dayJS = inject('dayJS');
        const store = useStore();
        const menuInfo = computed(() => store.state.getMenuItem.menuInfo);
        const { onChangeDownRol, onChangeMaskingRol } = authCommFunc();

        const state = reactive({
            mskgnRlsYn: true,
            setDay: {
                from: new Date().getTime() - 3600 * 1000 * 24 * 30,
                to: new Date()
            },
            tableColum_c: _.clone(tablelist_dcsPntPlcyAprv_label),
            rowData: [],
            defaultColDef: {
                sortable: true,
                resizable: true,
                width: 50,
                headerClass: 'centered',
                cellClass: 'centered'
            },
            gridApi: null,
            gridColumApi: null,
            selectList: [],
            athrTypCd: '212001',
            menuCode: menuInfo.value.menuCode
        });

        const searchData = reactive({
            rgsDtFr: new Date().getTime() - 3600 * 1000 * 24 * 30, //시작일
            rgsDtTo: new Date(), //종료일
            plcyStCd: '', // 정책상태
            pntPlcyNm: '', //정책명
            pntIssTyCd: '', //포인트유형
            pntCtgrMjcsCd: '',
            pntCtgrMdcsCd: '',
            listType: '20',
            currentPage: computed(() => pager.current),
            pageSize: computed(() => pager.size),
            maskingReleaseYn: computed(() => state.mskgnRlsYn ? 'Y' : 'N')
        });
        
        const exelParams = reactive({
            params: {
                rgsDtFr: computed(() => dayJS(searchData.rgsDtFr).format('YYYYMMDD')), //시작일
                rgsDtTo: computed(() => dayJS(searchData.rgsDtTo).format('YYYYMMDD')), //종료일
                plcyStCd: computed(() => searchData.plcyStCd), // 정책상태
                pntPlcyNm: computed(() => searchData.pntIssTyCd), //정책명
                pntIssTyCd: computed(() => searchData.pntIssTyCd), //포인트유형
                pntCtgrMjcsCd: computed(() => searchData.pntCtgrMjcsCd),
                pntCtgrMdcsCd: computed(() => searchData.pntCtgrMdcsCd),
                listType: computed(() => searchData.listType),
                pageSize: 0,
                currentPage: 0,
                menuCode: computed(() => menuInfo.value.menuCode),
                maskingReleaseYn: computed(() => searchData.maskingReleaseYn)
            },
            url: '/common/api/v1/point/policy/list/excel'
        });
        
        const pager = reactive({
            current: 1,
            currentPageSize: 1,
            size: 10,
            offset: computed(() => (pager.current - 1) * pager.size),
            totalCnt: 0
        });

        onMounted(() => {
            emitter.$on('onChangeMskgn', onChangeMskgn);
            onChangedPage(1);
        });

        
        const reqData = () => {
            let check = false;
            let params = {
                ...searchData,
                rgsDtFr: dayJS(searchData.rgsDtFr).format('YYYYMMDD'),
                rgsDtTo: dayJS(searchData.rgsDtTo).format('YYYYMMDD')
            };

            if (params.rgsDtFr > params.rgsDtTo) {
                modal('등록종료일이 등록시작일보다 이전일 수 없습니다. 다시 입력하세요.');
                check = true;
            }

            return {params, check};
        };

        const getDcsPntPlcyList = async () => {
            try {
                let {params, check} = await reqData();
                if (check) return;
                const response = await _getDcsPntPlcyList(params);
                if (response.code == 'OK') {
                    state.rowData = response.data.list;
                    pager.totalCnt = parseInt(response.data.totalCount);
                } else {
                    modal(response.message);
                }
            } catch (error) {
                modal(error);
            }
        };

        const initSearch = () => {
            dateSearch.value.initDate();
            searchData.rgsDtFr = new Date().getTime() - 3600 * 1000 * 24 * 30;
            searchData.rgsDtTo = new Date();
            searchData.plcyStCd = '';
            searchData.pntPlcyNm = '';
            searchData.pntIssTyCd = '';
            searchData.pntCtgrMjcsCd = '';
            searchData.pntCtgrMdcsCd = '';

            onChangedPage(1);
        };

        // 데이터 피커 날짜 검색
        const onSelectPicker = (type, value) => {
            if (type === 'day') {
                searchData.rgsDtFr = value[0];
                searchData.rgsDtTo = value[1];
            }
            if (type === 'self_start') {
                searchData.rgsDtFr = value;
            }
            if (type === 'self_end') {
                searchData.rgsDtTo = value;
            }
        };

        const showModal = (type) => {
            popInfo.modalType = type;
            switch (type) {
                case 'rejectPlcy' :
                    popInfo.modalTitle = '정책반려';
                    popInfo.modalMessage = '반려사유를 등록해주세요.';
                    break;
                case 'rejectNonUse' :
                    popInfo.modalTitle = '정책 미사용 반려';
                    popInfo.modalMessage = '미사용 요청 반려사유를 등록해주세요.';
                    break;
                case 'rejectDel' :
                    popInfo.modalTitle = '정책 삭제 반려';
                    popInfo.modalMessage = '삭제 요청 반려사유를 등록해주세요.';
                    break;
                case 'aprv' :
                    popInfo.modalTitle = '포인트 정책 승인';
                    popInfo.modalMessage = '선택하신 정책 항목을 승인하시겠습니까?';
                    break;
            }
            isShow.value = true;
        };

        const closeModal = async (type, val) => {
            let status = popInfo.modalType;
            isShow.value = false;
            if (type == 'modalconfirm') {
                let {data, message} = await resData(status, val);
                setAthrAprvRes(data, message);
            }
        };

        const resData = async (status, val) => {
            const plcyCdArr = [];
            state.selectList.map(item => {
                let plcyData = { athrRqstMngCd: item.pntPlcyCd, athrNoSn: item.athrNoSn};
                plcyCdArr.push(plcyData);
            });
            let data = {
                athrInfArr: plcyCdArr,
                athrTypCd: state.athrTypCd,
                athrStCd: state.selectList[0].plcyStCd,
                athrRsnCd: val.athrRsnCd,
                athrRsnCts: val.athrRsnCts
            };
            let message = '';

            if (status == 'rejectPlcy') {
                message = '정책 반려가';
                data.athrStCd = '206004';
            } else if (status == 'rejectNonUse') {
                message = '미사용 반려가';
                data.athrStCd = '206010';
            } else if (status == 'rejectDel') {
                message = '삭제 반려가';
                data.athrStCd = '206007';
            } else if (status == 'aprv') {
                if (data.athrStCd == '206002')      data.athrStCd = '206003';
                else if (data.athrStCd == '206005') data.athrStCd = '206006';
                else if (data.athrStCd == '206008') data.athrStCd = '206009';
            }

            return {data, message};
        };

        const setAthrAprvRes = async (data, message) => {
            try {
                let response = await _setAthrAprvRes(data);
                if (response.data.code == 'OK') {
                    onChangedPage(pager.current);
                } else {
                    modal(response.data.message ?? message + ' 정상적으로 수행되지 않았습니다.');
                }
            } catch (err) {
                modal(err);
            }
        };

        const checkAuth = (type) => {
            if (menuInfo.value.auth4ApproveYn != 'Y') {
                modal('승인/반려 권한이 없습니다.');
            } else {
                reqStatusCheck(type);
            }
        };

        const reqStatusCheck = (type) => {
            var showValue = true;
            let plcyStCd = ['206002', '206005', '206008'];

            if (_.isEmpty(state.selectList) || state.selectList.length <= 0) {
                modal('선택하신 행이 없습니다.');
                return ;
            }

            const nonMatch = [];           // 허용된 값이 아닌경우
            const uniqueValue = new Set(); //현재 선택한 status 값 표현
            state.selectList.forEach((data) => {
                uniqueValue.add(data.plcyStCd);
                if (!plcyStCd.includes(data.plcyStCd)) {
                    nonMatch.push(data.plcyStCd);
                    return ;
                }
            });
            
            if (nonMatch.length > 0 || uniqueValue.size > 1) showValue = false;

            if (showValue) {
                let value = [...uniqueValue];
                if (type == 'reject') {
                    if (value[0] == '206002') type = 'rejectPlcy';
                    if (value[0] == '206005') type = 'rejectDel';
                    if (value[0] == '206008') type = 'rejectNonUse';
                }
                showModal(type);
            }
            else {
                if (nonMatch.length > 0) {
                    let etype = type == 'reject' ? '반려가' : type == 'aprv' ? '승인이' : '';
                    let message = state.selectList[0].plcyStCdNm + '상태는 ' + etype + ' 불가합니다.';
                    modal(message);
                } else {
                    modal('동일한 상태만 선택이 가능합니다.');
                }
            }
        };

        const selectedOptions = (value) => {
            pager.size = value;
            onChangedPage(1);
        };

        const cellClicked = (e) => {
            const code = state.gridApi.getFocusedCell().column.colId;
            var url, pType = '';

            if (code == 'pntPlcyNm') {
                url = '/dcspntplcyaprvdetail';
                pType = 'dcspntplcyaprvdetail';
                router.push({path: url, state: {type: pType, ...e.data}});
            }
        };

        // 페이징 처리
        const onChangedPage = (num, type) => {
            state.selectList = [];
            pager.current = num;
            state.tableColum_c[1].valueGetter = 'node.rowIndex + ' + Number(pager.size * (pager.current - 1) + 1);
            if (type == 'search') state.mskgnRlsYn = true;
            getDcsPntPlcyList();
        };

        // 테이블 리사이징을 위한 참조값
        const onGridReady = (params) => {
            state.gridApi = params.api;
            state.gridColumApi = params.columnApi;
        };
        // 체크 박스 선택시 
        const onRowSelect = (e) => {
            state.selectList = state.gridApi.getSelectedRows();
        };

        // 삭제할 컬럼 선택
        const checkOptions = (value) => {
            state.filterCoulm = value;
        };

        // 테이블 현재창에 맞춤
        const sizeToFit = () => {
            state.gridApi.sizeColumnsToFit();
        };

        // 컬럼 변경
        const resetTable = () => {
            const initColum = _.clone(tablelist_dcsPntPlcyAprv_label);
            state.tableColum_c = initColum.filter(item => !state.filterCoulm.includes(item.headerName));
            return state.filterCoulm;
        };

        const enterToSearch = (e) => {
            if (e.keyCode === 13) onChangedPage(1);
        };

        const changePntCtgrMjcsCd = async (val) => {
            if (searchData.pntCtgrMjcsCd) pntCtgrMdcsCdRef.value.setGrCdId(val);
            searchData.pntCtgrMjcsCd = val;
            searchData.pntCtgrMdcsCd = '';
        };

        // 파일 업로드
        const uploadFile = async (e) => {
            const file = e.target.files[0];
            if (!file) return;
            if (file.name.includes('xlsx') || file.name.includes('xls')) {
                let uploadFile = file ? file : null;
                let formData = new FormData();
                formData.append('file', uploadFile);
                try {
                    const response = await _uploadFile(formData);
                    if (response.data.fileId) cmmCodeMod(response.data.fileId);
                    else modal('양식업로드에 실패했습니다.');
                } catch (error) {
                    modal('양식업로드에 실패했습니다.');
                }
            } else {
                modal('파일 확장자를 확인하세요(.xlsx, .xls)');
            }
        };

        const cmmCodeMod = async (fileId) => {
            try {
                const response = await _editCommonCode({
                    cmnCd: '302001',
                    cmnCdNm: fileId,
                    lastUpdrSn: 999999
                });
                if (response.data.code == 'OK') modal('양식업로드 완료했습니다.');
                else modal('양식업로드에 실패했습니다.');
            } catch (error) {
                modal('양식업로드에 실패했습니다.');
            }
        };

        //상세 검색 하단 검색 목록 토글 
        // 해제 토글
        const onChangeMskgn = () => {
            state.mskgnRlsYn = !state.mskgnRlsYn;
            onChangedPage(pager.current);
        };

        // 마스킹 권한 체크
        const changeMskgnRlsYn = async () => {
            await onChangeMaskingRol(menuInfo.value.auth6MaskingYn);
        };

        return {
            tablelist_dcsPntPlcyAprv_label,
            searchShow,
            toggleSearch,
            state,
            popInfo,
            searchData,
            isShow,
            pager,
            showModal,
            closeModal,
            onChangedPage,
            onSelectPicker,
            selectedOptions,
            goToPage,
            getDcsPntPlcyList,
            initSearch,
            cellClicked,
            onGridReady,
            onRowSelect,
            checkAuth,
            dateSearch,
            checkOptions,
            sizeToFit,
            resetTable,
            enterToSearch,
            pntCtgrMdcsCdRef,
            changePntCtgrMjcsCd,
            uploadFile,
            exelParams,
            onChangeDownRol,
            menuInfo,
            onChangeMskgn,
            changeMskgnRlsYn
        };
    }
};
</script>