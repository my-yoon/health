<template>
    <section>
        <div class="ui-data-filter">
            <div class="form-item">
                <div class="item">
                    <label>조건검색</label>
                    <span class="input">
                        <span class="dv">
                            <select v-model="formData.searchType" class="custom-select sm">
                                <option v-for="(item, index) in state.searchTypeList" :key="index" :value="item.value">
                                    {{ item.label }}
                                </option>
                            </select>
                        </span>
                        <span class="dv">
                            <input v-model="formData.searchText" class="form-control sm" type="text">
                        </span>
                    </span>
                </div>
                <dateSerch ref="dateSearch" :disabled="false" :pickerOnly="true" :setDay="state.setDay" dateTitle="노출기간"
                    @onSelectDate="onSelectPicker" />
                <div class="item">
                    <label>노출화면</label>
                    <span class="input">
                        <span class="dv">
                            <select v-model="formData.exposeScreenCode" class="custom-select sm">
                                <option v-for="(item, index) in state.exposeScreenCodeList" :key="index"
                                    :value="item.value">
                                    {{ item.label }}
                                </option>
                            </select>
                        </span>
                    </span>
                </div>
                <div class="item">
                    <label>사용여부</label>
                    <span class="input">
                        <span class="dv">
                            <select v-model="formData.useYn" class="custom-select sm">
                                <option v-for="(item, index) in state.useYnlist" :key="index" :value="item.value">
                                    {{ item.label }}
                                </option>
                            </select>
                        </span>
                    </span>
                </div>
                <div class="btn-filter-set">
                    <button class="btn btn-sm" type="button" @click="reloadList"><span class="ico-search"></span>조회
                    </button>
                    <button class="btn btn-sm" type="button" @click="onInitDate">
                        <span class="ico-reload sg"></span>
                        <span class="offscreen">리로드</span>
                    </button>
                </div>
            </div>
        </div>
        <div class="tbl-wrap">
            <div class="table-util flex space-between">
                <div class="btn-set-m flex">
                    <button :disabled="state.delList.length === 0" class="btn btn-ss" type="button" @click="listDel">
                        삭제
                    </button>
                    <button class="btn btn-ss" type="button" @click="checkRegist">등록</button>
                </div>
                <div class="btn-set-m flex align-end">
                    <span class="table-total">조회결과 총 <strong>{{ pager.totalCnt }}</strong>건</span>
                    <button type="button" class="btn btn-opt"
                        @click="onChangeDownRol(menuInfo.auth5DownloadYn, 'Y', exelParams)">
                        <span class="ico-download"></span>파일다운로드
                    </button>
                    <selectBox selectType="page" @changedValue="selectedOptions" />
                    <button class="btn btn-opt-ico fit" type="button" @click="tableResize">
                        <span class="offscreen">컬럼 리사이징</span>
                    </button>
                    <!-- 클래스 : full -->
                    <!-- 클래스 : close -->
                    <button class="btn btn-opt-ico filter full" type="button" @click="resetTable">
                        <span class="offscreen">컬럼 셋팅</span>
                    </button>
                </div>
            </div>
            <columlist :columlists="initColum" @checkColum="checkOptions" />
            <NoData v-if="state.keywordList.length === 0" :nodatatext="'조회된 데이터가 없습니다.'"></NoData>
            <div v-else>
                <AgGridVue :columnDefs="state.tableColum_c" :defaultColDef="state.defaultColDef"
                    :postSortRows="postSortRows" :rowData="state.keywordList" :suppressRowClickSelection="true"
                    class="ag-theme-alpine" domLayout="autoHeight" rowSelection="multiple" @grid-ready="onGridReady"
                    @cell-clicked="onCellClicked" @selection-changed="onRowSelect">
                </AgGridVue>
                <PageNavigation :cntPerPage='pager.size' :currentPage="pager.current" :itemCount='pager.totalCnt'
                    @changedPage="onChangedPage" />
            </div>
        </div>
    </section>
    <DefaultModal :isShow="isRegKeyWord" buttonCancel="취소" buttonConfirm="저장" modalName="regKeyWord" modalTitle="키워드 등록"
        @modalclose="modalClose">
        <template #modalcontent>
            <div class="ui-grid-top-guide t-right">
                <span class="ess"></span> 표시는 필수항목입니다.
            </div>
            <div class="tbl-wrap mt-10">
                <table class="table reg">
                    <colgroup>
                        <col style="width: 140px;">
                        <col style="width: auto;">
                    </colgroup>
                    <tbody>
                        <tr>
                            <th scope="row">키워드 노출 화면<span class="ess"><span class="offscreen">필수입력</span></span></th>
                            <td>
                                <div class="reg-group">
                                    <div class="reg-item">
                                        <select v-model="regFormData.exposeScreenCode" class="custom-select sm">
                                            <option
                                                v-for="(item, index) in state.exposeScreenCodeList.filter(data => data.value !== '')"
                                                :key="index" :value="item.value">
                                                {{ item.label }}
                                            </option>
                                        </select>
                                    </div>
                                </div>
                            </td>
                        </tr>
                        <tr>
                            <th scope="row">추천 키워드<span class="ess"><span class="offscreen">필수입력</span></span></th>
                            <td>
                                <div class="reg-group">
                                    <div class="reg-item">
                                        <div class="guide-form flex-11">
                                            <input v-model="regFormData.recommendKeywordName"
                                                :class="state.regError.value ? 'error' : ''" class="form-control"
                                                type="text" @input="state.regError.value = false">
                                            <span v-if="state.regError.value" class="input-guide error">{{
                                                state.regError.message }}</span>
                                        </div>
                                    </div>
                                </div>
                            </td>
                        </tr>
                        <tr>
                            <th scope="row">키워드 노출기간<span class="ess"><span class="offscreen">필수입력</span></span></th>
                            <td>
                                <div class="reg-group inline">
                                    <div class="reg-item">
                                        <DateTimeSingle key="regExposeBeginDt" v-model="regFormData.exposeBeginDt"
                                            :datepicker-center="true"
                                            :setDay="toDay.set('hour', 0).set('minute', 0).format('YYYY-MM-DD HH:mm')">
                                        </DateTimeSingle>
                                    </div>
                                    <span class="ui-coupler">~</span>
                                </div>
                                <div class="reg-group inline">
                                    <div class="reg-item">
                                        <DateTimeSingle key="regExposeEndDt" v-model="regFormData.exposeEndDt"
                                            :datepicker-center="true"
                                            :setDay="toDay.set('hour', 23).set('minute', 59).format('YYYY-MM-DD HH:mm')">
                                        </DateTimeSingle>
                                    </div>
                                </div>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </template>
    </DefaultModal>
    <DefaultModal :isShow="isKeyWordDetail" buttonCancel="닫기" buttonConfirm="저장" buttonDelete="삭제" modalName="keyWordDetail"
        modalTitle="키워드 상세" @modalclose="modalClose">
        <template #modalcontent>
            <div class="tbl-wrap">
                <table class="table reg">
                    <colgroup>
                        <col style="width: 140px;">
                        <col style="width: auto;">
                        <col style="width: 140px;">
                        <col style="width: auto;">
                    </colgroup>
                    <tbody>
                        <tr>
                            <th scope="row">키워드 노출 화면</th>
                            <td colspan="3">
                                <div class="reg-group">
                                    <div class="reg-item">
                                        <select v-model="regFormData.exposeScreenCode" class="custom-select sm">
                                            <option
                                                v-for="(item, index) in state.exposeScreenCodeList.filter(data => data.value !== '')"
                                                :key="index" :value="item.value">
                                                {{ item.label }}
                                            </option>
                                        </select>
                                    </div>
                                </div>
                            </td>
                        </tr>
                        <tr>
                            <th scope="row">추천 키워드</th>
                            <td colspan="3">
                                <div class="reg-group">
                                    <div class="reg-item">
                                        <div class="guide-form flex-11">
                                            <input v-model="regFormData.recommendKeywordName" class="form-control"
                                                type="text">
                                        </div>
                                    </div>
                                </div>
                            </td>
                        </tr>
                        <tr>
                            <th scope="row">키워드 노출기간</th>
                            <td colspan="3">
                                <div class="reg-group inline">
                                    <div class="reg-item">
                                        <DateTimeSingle key="regExposeBeginDt" v-model="regFormData.exposeBeginDt"
                                            :datepicker-center="true" :setDay="regFormData.exposeBeginDt"></DateTimeSingle>
                                    </div>
                                    <span class="ui-coupler">~</span>
                                </div>
                                <div class="reg-group inline">
                                    <div class="reg-item">
                                        <DateTimeSingle key="regExposeEndDt" v-model="regFormData.exposeEndDt"
                                            :datepicker-center="true" :setDay="regFormData.exposeEndDt"></DateTimeSingle>
                                    </div>
                                </div>
                            </td>
                        </tr>
                        <tr>
                            <th scope="row">사용여부</th>
                            <td colspan="3">
                                <div class="reg-group">
                                    <div class="reg-item">
                                        <select v-model="regFormData.useYn" class="custom-select sm">
                                            <option
                                                v-for="(item, index) in state.useYnlist.filter(data => data.value !== '')"
                                                :key="index" :value="item.value">
                                                {{ item.label }}
                                            </option>
                                        </select>
                                    </div>
                                </div>
                            </td>
                        </tr>
                        <tr>
                            <th scope="row">등록자</th>
                            <td>{{ regFormData.registerNm }}</td>
                            <th scope="row">등록일시</th>
                            <td>{{ regFormData.registDt }}</td>
                        </tr>
                        <tr>
                            <th scope="row">수정자</th>
                            <td>{{ regFormData.updaterNm }}</td>
                            <th scope="row">수정일시</th>
                            <td>{{ regFormData.updateDt }}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </template>
    </DefaultModal>
</template>
<script>
import { computed, reactive, inject, onMounted, onUnmounted, ref } from 'vue';
import DateSerch from '@/components/ui/DateSerch.vue';
import DefaultModal from '@/plugins/modal/modal/DefaultModal.vue';
import { useCommFunc } from '@/core/helper/common.js';
import { authCommFunc } from '@/core/helper/authComm.js';
import DateTimeSingle from '@/components/ui/DateTimeSingle.vue';
import { _deleteRecommendKeyword, _editRecommendKeyword, _getRecommendKeyword, _registRecommendKeyword } from '@/api/operate.js';
import codeList from '@/data/commcode/codeList.js';
import DateSingle from '@/components/ui/DateSingle.vue';
// import FileDownLoad from '@/views/operate/components/FileDownLoad.vue';
import { useStore } from 'vuex';

export default {
    components: { DateSingle, DefaultModal, DateSerch, DateTimeSingle },
    setup() {
        const store = useStore();
        const $Modal = inject('$Modal');
        const dayJS = inject('dayJS');
        const dateSearch = ref(null);
        const { goToPage, tableResize } = useCommFunc();
        const isRegKeyWord = ref(false);
        const isKeyWordDetail = ref(false);
        const toDay = dayJS();
        const validationForm = ref({});

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
        const { onChangeDownRol, onChangeRegistRol } = authCommFunc();
        const menuInfo = computed(() => store.state.getMenuItem.menuInfo);

        const initColum = ref([
            {
                headerName: '선택',
                field: 'select',
                maxWidth: 50,
                checkboxSelection: true,
                headerCheckboxSelection: true
            },
            {
                headerName: '번호',
                field: 'no',
                maxWidth: 70,
                valueGetter: 'node.rowIndex + 1'
            },
            { headerName: '추천키워드', field: 'recommendKeywordName', flex: 1, sortable: true, unSortIcon: true },
            { headerName: '노출화면', field: 'exposeScreenName', flex: 1 },
            { headerName: '사용여부', field: 'useYnName', flex: 1 },
            { headerName: '노출시작일시', field: 'exposeBeginDt', flex: 1, sortable: true, unSortIcon: true },
            { headerName: '노출종료일시', field: 'exposeEndDt', flex: 1, sortable: true, unSortIcon: true },
            { headerName: '등록일시', field: 'registDt', flex: 1 },
            { headerName: '등록자', field: 'registerNm', flex: 1 },
            { headerName: '수정일시', field: 'updateDt', flex: 1 },
            { headerName: '수정자', field: 'updaterNm', flex: 1 }
        ]);

        const state = reactive({
            tableColum_c: _.clone(initColum.value),
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
            keywordList: [],
            delList: [],
            pagesize: 10,
            gridApi: null,
            gridColumApi: null,
            useYnlist: [
                { label: '전체', value: '' },
                { label: '사용', value: 'Y' },
                { label: '미사용', value: 'N' }
            ],
            searchTypeList: [{ label: '추천키워드', value: '' }],
            exposeScreenCodeList: [{ label: '선택', value: '' }],
            setDay: { from: toDay.set('date', 1).format('YYYY-MM-DD'), to: toDay.format('YYYY-MM-DD') }, // 시작일은 현재 월기준 1일 , 종료일 : 현재
            regError: { value: false, message: null },
            // excelDown: {
            //     isReason: true,
            //     apiUrl: '/common/api/v1/operation/recommend-keyword/excel'
            // },
            menuCode: computed(() => menuInfo.value.menuCode)
        });

        // 데이터 피커 날짜 검색
        const onSelectPicker = (type, value, status) => {
            // 버튼으로 선택된 기준
            if (type === 'day') {
                state.startday = value[0];
                state.endday = value[1];
            } else if (type === 'self_end' || type === 'self_start') {
                // 직접 데이터 피커 설정
                if (type === 'self_start') {
                    state.startday = value;
                } else if (type === 'self_end') {
                    state.endday = value;
                }
            }
        };

        // 검색 조건
        const formData = reactive({
            bgnDate: computed(() => state.startday), //시작일
            endDate: computed(() => state.endday), //종료일
            searchType: '', //검색조건
            searchText: '', //내용
            exposeScreenCode: '', // 노출화면
            useYn: '', // 사용여부
            orderType: null,
            orderSort: null,
            menuCode: computed(() => menuInfo.value.menuCode)
        });

        // 엑셀용 함수
        const exelParams = reactive({
            params: {
                bgnDate: computed(() => state.startday),
                endDate: computed(() => state.endday),
                searchType: computed(() => formData.searchType),
                searchText: computed(() => formData.searchText),
                exposeScreenCode: computed(() => formData.exposeScreenCode),
                useYn: computed(() => formData.useYn),
                orderType: computed(() => formData.orderType),
                orderSort: computed(() => formData.orderSort),

                menuCode: computed(() => menuInfo.value.menuCode)
            },
            url: '/common/api/v1/operation/recommend-keyword/excel'
        });

        // 키워드 등록,수정
        const regFormData = ref({
            recommendKeywordSn: null,
            recommendKeywordName: null,
            exposeScreenCode: null,
            exposeBeginDt: null,
            exposeEndDt: null,
            useYn: null,
            menuCode: state.menuCode
        });

        // 페이징 처리
        const pager = reactive({
            current: 1,
            currentPageSize: 1,
            size: computed(() => state.pagesize),
            offset: computed(() => (pager.current - 1) * pager.size),
            totalCnt: 0
        });

        onMounted(async () => {
            // 노출화면코드 조회
            await codeList.getGroupCode(281000).then(codeList => {
                state.exposeScreenCodeList = [...state.exposeScreenCodeList, ...codeList];
            });
            await getRecommendKeyword();  // 리스트 호출
            emitter.$on('onChangeRegist', onChangeRegist);
        });

        /**
         * 마스킹 해제 이벤트 버스 해제
         */
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
            // goToPage('/event/register/genaral');
            regPopup();
        };

        // 테이블 리사이징을 위한 참조값
        const onGridReady = (params) => {
            state.gridApi = params.api;
            state.gridColumApi = params.columnApi;
        };
        // 체크 박스 선택시
        const onRowSelect = () => {
            const rowlist = state.gridApi.getSelectedRows();
            state.delList = rowlist.map(item => item.recommendKeywordSn);
        };
        //테이블 셀 선택
        const onCellClicked = (e) => {
            regFormData.value = e.data;
            isKeyWordDetail.value = true;
        };
        //페이징 처리
        const onChangedPage = (num) => {
            pager.current = num;
            //테이블 인덱스 번호 처리
            initColum.value[1].valueGetter = 'node.rowIndex + ' + Number(pager.size * (pager.current - 1) + 1);
            //api호출
            getRecommendKeyword();
        };
        //검색조건에 따른 리스트 재조회
        const reloadList = () => {
            pager.current = 1;
            onChangedPage(pager.current);
        };

        //리스트 갯수 변경 후 리스트 재 조회
        const clearList = (num) => {
            formData.bgnDate = computed(() => state.startday); //시작일
            formData.endDate = computed(() => state.endday); //종료일
            formData.searchText = ''; //내용
            formData.exposeScreenCode = ''; //
            formData.useYn = ''; //
            onChangedPage(num);
        };

        // 등록 초기화
        const clearReg = () => {
            regFormData.value = {
                recommendKeywordSn: null,
                recommendKeywordName: null,
                exposeScreenCode: null,
                exposeBeginDt: null,
                exposeEndDt: null,
                useYn: null
            };
        };
        //리스트 조회
        const getRecommendKeyword = async () => {
            try {
                let params = {
                    size: pager.size,
                    offset: pager.offset,
                    bgnDate: formData.bgnDate,
                    endDate: formData.endDate,
                    searchText: formData.searchText,
                    useYn: formData.useYn,
                    exposeScreenCode: formData.exposeScreenCode, //grpCd 281000
                    orderType: formData.orderType, //recommendKeyword / exposeBeginDt / exposeEndDt AG-Grid 기능 사용
                    orderSort: formData.orderSort, //desc / asc AG-Grid 기능 사용
                    menuCode: state.menuCode,
                    page: 0
                };
                const response = await _getRecommendKeyword(params);
                state.keywordList = response.data.data.list.map(item => {
                    item.useYnName = item.useYn === 'Y' ? '사용' : '미사용';
                    item.registerNm = item.registerAdminLevelName + '(' + item.registerNm + ')';
                    item.updaterNm = item.updaterNm ? item.updaterAdminLevelName + '(' + item.updaterNm + ')' : null;
                    return item;
                });
                pager.totalCnt = response.data.data.totalCnt;

            } catch (error) {
                console.log(error);
            }
        };
        //삭제 컨펌
        const listDel = () => {
            if (state.delList.length === 0) {
                $Modal.simple({
                    message: '삭제할 리스트가 없습니다.',
                    buttonText: {
                        ok: '확인'
                    }
                });
            } else {
                $Modal.confirm({
                    message: '선택하신 등록 건을 삭제하시겠습니까?',
                    buttonText: {
                        confirm: '확인',
                        cancel: '취소'
                    }
                }).then(success => {
                    delKeyWordList();
                    // 팝업창 삭제시
                    if (isKeyWordDetail.value) {
                        isKeyWordDetail.value = false;
                        clearReg();
                    }
                }).catch(error => {
                    console.log(error);
                });
            }
        };
        // 리스트 삭제
        const delKeyWordList = async () => {
            try {
                await _deleteRecommendKeyword({ recommendKeywordSnList: state.delList }).then(result => {
                    if (result.data.code === 'OK') {
                        getRecommendKeyword();
                        state.delList = [];
                    } else {
                        console.log(result.data);
                    }
                });
            } catch (error) {
                console.log(error);
            }
        };
        // 조회 초기화
        const onInitDate = () => {
            dateSearch.value.initDate();
            //리스트 재조회
            clearList(1);
        };

        //셀렉트박스 선택
        const selectedOptions = (value, type) => {
            if (type === 'page') {
                state.pagesize = value;
                clearList(1);
            }
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

        // 등록팝업
        const regPopup = () => {
            clearReg();
            isRegKeyWord.value = true;
            regFormData.value.exposeScreenCode = state.exposeScreenCodeList.filter(item => item.value !== '')[0].value;
        };

        const regKeyWord = async () => {
            if (!regFormData.value.recommendKeywordName) {
                state.regError.value = true;
                state.regError.message = '추천키워드를 입력해주세요';

                return false;
            }
            $Modal.confirm({
                message: '추천키워드를 등록 하시겠습니까?',
                buttonText: {
                    confirm: '확인',
                    cancel: '취소'
                }
            }).then(success => {
                const param = {
                    recommendKeywordName: regFormData.value.recommendKeywordName,
                    exposeScreenCode: regFormData.value.exposeScreenCode,
                    exposeBeginDt: regFormData.value.exposeBeginDt,
                    exposeEndDt: regFormData.value.exposeEndDt,
                    menuCode: state.menuCode
                };

                try {
                    _registRecommendKeyword(param).then(result => {
                        if (result.data.code === 'OK') {
                            isRegKeyWord.value = false;
                            getRecommendKeyword();
                        } else {
                            state.regError.value = true;
                            state.regError.message = result.data.message;
                            console.log(result.data);
                        }
                    });
                } catch (error) {
                    console.log(error);
                }
            }).catch(error => {
                console.log(error);
            });
        };

        // 수정
        const editKeyWord = async () => {
            const param = {
                recommendKeywordSn: regFormData.value.recommendKeywordSn,
                recommendKeywordName: regFormData.value.recommendKeywordName,
                exposeScreenCode: regFormData.value.exposeScreenCode,
                exposeBeginDt: regFormData.value.exposeBeginDt,
                exposeEndDt: regFormData.value.exposeEndDt,
                useYn: regFormData.value.useYn,
                menuCode: state.menuCode
            };

            try {
                await _editRecommendKeyword(param).then(result => {
                    if (result.data.code === 'OK') {
                        isKeyWordDetail.value = false;
                        getRecommendKeyword();
                    }
                });
            } catch (error) {
                console.log(error);
            }
        };

        const modalClose = (type, name) => {
            if (name === 'regKeyWord') {
                //키워드 등록
                if (type === 'modalconfirm') {
                    regKeyWord();
                } else {
                    isRegKeyWord.value = false;
                }
            }

            if (name === 'keyWordDetail') {
                //수정 , 삭제
                if (type === 'modalconfirm') {
                    editKeyWord();
                    clearReg();
                } else if (type === 'modaldelete') {
                    state.delList = [regFormData.value.recommendKeywordSn];
                    listDel();
                } else {
                    isKeyWordDetail.value = false;
                }
            }
        };

        // 정렬이벤트 AGgrid 정렬 후 호출됨 (정렬되기전 이벤트 API 찾아봤으나 더 좋은 이벤트는 못찾음)
        // getColumnState 로 컬럼 sort정보를 찾은 후 api를 재호출
        const postSortRows = (e) => {
            let orderType = null;
            let orderSort = null;
            // 정렬
            if (state.keywordList && e.columnApi.getColumnState().filter(item => item.sort).length > 0) {
                const columnState = e.columnApi.getColumnState().filter(item => item.sort)[0];
                orderType = formData.orderType = columnState.colId === 'recommendKeywordName' ? 'recommendKeyword' : columnState.colId;
                orderSort = columnState.sort;
            }

            // 해당조건이 없으면 무한루프걸림 주의
            if (formData.orderType !== orderType || orderSort !== formData.orderSort) {
                formData.orderType = orderType;
                formData.orderSort = orderSort;
                //api호출
                getRecommendKeyword();
            }
        };

        return {
            //공통 사용
            $Modal,
            dayJS,
            goToPage,
            tableResize,
            pager,
            state,
            formData,
            regFormData,
            dateSearch,
            isRegKeyWord,
            isKeyWordDetail,
            initColum,
            toDay,
            validationForm,
            // downloadFormData,
            onGridReady,
            onCellClicked,
            reloadList,
            onChangedPage,
            selectedOptions,
            checkOptions,
            resetTable,
            onRowSelect,
            onSelectPicker,
            onInitDate,
            listDel,
            regPopup,
            modalClose,
            postSortRows,

            menuInfo,
            exelParams,
            onChangeDownRol,
            checkRegist
        };
    }
};
</script>