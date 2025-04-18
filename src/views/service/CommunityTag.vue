<template>
    <section>
        <!-- 검색 -->
        <div class="ui-data-filter">
            <div class="form-item">
                <dateSerch :dateTitle="'등록기간'" @onSelectDate="onSelectPicker" :pickerOnly="false" :setDay="state.setDay"
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
            <div class="ui-data-filter-more" v-if="state.openMore">
                <div class="form-item">
                    <div class="item">
                        <label>태그 생성자</label>
                        <span class="input">
                            <span class="dv">
                                <span class="radio" v-for="(item, index) in state.searchOptions.tagRgtrType" :key="index">
                                    <input :id="'tagRgtrType' + index" name="tagRgtrType" type="radio" :value="item.value" v-model="state.searchOptions.rgtrTyCd">
                                    <label :for="'tagRgtrType' + index">{{ item.label }}</label>
                                </span>
                            </span>
                        </span>
                    </div>
                    <div class="item">
                        <label>태그 명</label>
                        <span class="input">
                            <span class="dv">
                                <input type="text" class="form-control" v-model="state.searchOptions.searchText">
                            </span>
                        </span>
                    </div>
                </div>
            </div>

        </div>
        <div class="tbl-wrap">
            <div class="table-util flex space-between">
                <div class="btn-set-m flex">
                    <button type="button" class="btn btn-ss" @click="checkRegist">등록</button>
                    <button type="button" class="btn btn-ss" @click="checkDel">삭제</button>
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
                    <button type="button" class="btn btn-opt-ico filter full" @click="resetTable">
                        <span class="offscreen">컬럼 셋팅</span>
                    </button>
                </div>
            </div>
            <columlist :columlists="initColum" @checkColum="checkOptions" />
            <NoData :nodatatext="'조회된 데이터가 없습니다.'" v-if="state.tagList.length === 0"></NoData>
            <div v-else>
                <AgGridVue
                    :columnDefs="state.tableColum_c"
                    :defaultColDef="state.defaultColDef"
                    :rowData="state.tagList"
                    :domLayout="state.domLayout"
                    class="ag-theme-alpine"
                    rowSelection="multiple"
                    @grid-ready="onGridReady"
                    @selection-changed="onRowSelect"
                />
                <PageNavigation :cntPerPage='pager.size' :itemCount='pager.totalCnt' :currentPage="pager.current"
                    @changedPage="onChangedPage" />
            </div>
        </div>

        <!-- 태그등록 -->
        <DefaultModal :isShow="isShowTag" :modalName="'isShowTag'" :modalTitle="'태그 등록'" :buttonCancel="'취소'" :buttonConfirm="'저장'" :className="'sm'" @modalclose="modalControl">
            <template #modalcontent>
                <div>
                    <div class="tbl-wrap mt-10">
                        <table class="table reg">
                            <colgroup>
                                <col style="width: 120px;">
                                <col style="width: auto;">
                            </colgroup>
                            <tbody>
                                <tr>
                                    <th scope="row">태그 명<span class="ess"><span class="offscreen">필수입력</span></span></th>
                                    <td>
                                        <div class="reg-group">
                                            <div class="reg-item">
                                                <input type="text" :class="['form-control', { error: checkValidState('hashTagNm') }]" v-model="state.hashTagNm" />
                                            </div>
                                        </div>
                                        <span class="input-guide" v-if="!checkValidState('hashTagNm')">
                                            태그는 띄어쓰기 및 이모지를 사용할 수 없습니다.
                                        </span>
                                        <span class="input-guide" :class="{ 'error': checkValidState('hashTagNm') }" v-else>{{ state.validState.message }}</span>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </template>
        </DefaultModal>

    </section>
</template>

<script>
import { computed, reactive, inject, onMounted, onUnmounted, ref, watch } from 'vue';
import DateSerch from '@/components/ui/DateSerch.vue';
import DefaultModal from '@/plugins/modal/modal/DefaultModal.vue';
import MemberList from './components/MemberList.vue';
import CategoryOrder from './components/CategoryOrder.vue';
import { useCommFunc } from '@/core/helper/common.js';
import { authCommFunc } from '@/core/helper/authComm.js';
import { useStore } from 'vuex';
import { _upDateMessage, _registMessage, _setUnused } from '@/api/standard.js';
import { _getCommunityTag, _createTag, _deleteTag } from '@/api/service.js';

export default {
    components: { DateSerch, DefaultModal, MemberList, CategoryOrder },
    setup() {
        const $Modal = inject('$Modal');
        const dayJS = inject('dayJS');
        const store = useStore();
        
        const { goToPage, tableResize } = useCommFunc();
        const { onChangeRegistRol, onChangeDelRol, onChangeDownRol } = authCommFunc();
        const menuInfo = computed(() => store.state.getMenuItem.menuInfo);
        
        const dateSearch = ref(null);
        const isShowTag = ref(false); // 태그 등록
        const initColum = ref([
            {
                headerName: '선택',
                field: 'select',
                maxWidth: 50,
                checkboxSelection: true,
                headerCheckboxSelection: true
            },
            { headerName: '번호', field: 'no', maxWidth: 80, valueGetter: 'node.rowIndex + 1' },
            { headerName: '태그 생성자', field: 'rgtrTyCdNm' },
            { headerName: '등록일시', field: 'fstRgsDt' },
            { headerName: '태그명', field: 'hashTagNm' },
            { headerName: '전체', field: 'tagAllCnt' }
        ]);

        const state = reactive({
            tableColum_c: _.clone(initColum.value),
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

            setDay: '1month',
            startDay: '',
            endDay: '',
            
            openMore: false,
            // download: { pass: '', reason: '' },
            searchOptions: {
                rgtrTyCd: '', // 태그 생성자
                searchType: 'hashTagNm', //
                searchText: '', // 태그명검색
                bgnDate: computed(() => state.startDay),
                endDate: computed(() => state.endDay),

                tagRgtrType: [ // 태그 생성자
                    { label: '전체', value: '' },
                    { label: 'Admin', value: '377001' },
                    { label: '사용자', value: '377002' }
                ]
            },

            pagesize: 10,
            tagList: [],

            hashTagNm: '', // @create 태그네임
            selectedTag: [], // @delete selected row

            validState: {
                type: '', // validation check ( formData )
                errState: false, // error state
                message: '' // input message
            }
        });

        /**
         * @pager
         */
        const pager = reactive({
            current: 1,
            currentPageSize: 1,
            size: computed(() => state.pagesize),
            offset: computed(() => (pager.current - 1) * pager.size),
            totalCnt: 0
        });

        // watch(() => state.searchOptions.trgTyCd, () => {
        //     state.searchOptions.mbrGrpNm = '';
        //     state.searchOptions.mbrGrpSn = '';
        // });
        watch(() => state.hashTagNm, () => {
            resetState();
        });

        onMounted(() => {
            // getMessageList();
            // getCommunityCategory();
            getCommunityTag();

            emitter.$on('onChangeRegist', onChangeRegist);
            // emitter.$on('onChangeEdit', onChangeEdit);
            emitter.$on('onChangeDel', onChangeDel);
        });

        onUnmounted(() => {
            emitter.$off('onChangeRegist');
            // emitter.$off('onChangeEdit');
            emitter.$off('onChangeDel');
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
            resetState();
            isShowTag.value = true;
            state.hashTagNm = '';
        };

        /**
         * 삭제 권한 체크
         */
        const checkDel = async () => {
            await onChangeDelRol(menuInfo.value.auth3DeleteYn);
        };

        /**
         * 삭제 권한 체크 callback
         */
        const onChangeDel = () => {
            if (state.selectedTag.length > 0) {
                let useTag = 0;
                let msg = '삭제하시겠습니까?';
                state.selectedTag.forEach(item => {
                    if (item.tagAllCnt > 0) useTag++;
                });

                if (useTag > 0) {
                    msg = `선택한 ${state.selectedTag.length}중 컨텐츠가 있는 태그가 ${useTag}개가 있습니다. 삭제하시겠습니까?`;
                }
                
                $Modal.confirm({
                    message: msg,
                    buttonText: {
                        confirm: '확인',
                        cancel: '취소'
                    }
                })
                    .then(success => {
                        if (success === 'confirm') {
                            deleteTag();
                        }
                    })
                    .catch(error => {
                        console.log(error);
                    });
            } else {
                $Modal.confirm({
                    message: '삭제할 태그를 선택해주세요.',
                    buttonText: {
                        confirm: '확인'
                    }
                })
                    .then(success => {
                        console.log(success);
                    })
                    .catch(error => {
                        console.log(error);
                    });
            }
        };

        // 엑셀용 함수
        const exelParams = reactive({
            params: {
                menuCode: computed(() => menuInfo.value.menuCode),
                
                rgtrTyCd: computed(() => state.searchOptions.rgtrTyCd),
                searchType: 'hashTagNm',
                searchText: computed(() => state.searchOptions.searchText),
                bgnDate: computed(() => state.searchOptions.bgnDate),
                endDate: computed(() => state.searchOptions.endDate)
            },
            url: '/common/api/v1/community/tag/excel'
        });

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
            console.log('선택일:' + value, '선택된 버튼:' + type, '조회기준:' + status);
        };

        // 데이터 피커 초기화
        const onInitDate = () => {
            dateSearch.value.initDate();
            //재조회  api 호출
            clearList(1);
        };

        /**
         * community - category 목록 조회
         */
        const getCommunityTag = async () => {
            try {
                const params = {
                    rgtrTyCd: state.searchOptions.rgtrTyCd,
                    searchType: state.searchOptions.searchType,
                    searchText: state.searchOptions.searchText,
                    bgnDate: state.searchOptions.bgnDate,
                    endDate: state.searchOptions.endDate,
                    size: pager.size,
                    offset: pager.offset
                    // page: pager.current
                };
                const response = await _getCommunityTag(params);
                // state.tagList = response.data.data.list;
                pager.totalCnt = response.data.data.totalCnt;

                setColData(response.data.data.list);
                setRowData(response.data.data.categoryList);

            } catch (error) {
                console.log(error);
            }
        };

        /**
         * tagList format
         */
        const setRowData = (columnList) => {
            const addColumn = columnList.map(d => {
                return {
                    headerName: d.ctgrNm,
                    field: d.ctgrCd,
                    maxWidth: '150'
                };
            });
            state.tableColum_c = [...initColum.value, ...addColumn]; // columlist.filter(item => !state.filterCoulm.includes(item.headerName));
        };
        const setColData = (columnList) => {
            state.tagList = columnList.map(d => {
                let newData = {
                    ...d
                };
                d.tagCntCategoryList.forEach(item => {
                    newData[item.ctgrCd] = item.ctgrTagCnt;
                });
                return newData;
            });
            console.log(state.tagList);
        };

        /**
         * @create tag
         */
        const createTag = async () => {
            try {
                const params = {
                    hashTagNm: state.hashTagNm
                };
                const response = await _createTag(params);
                if (response.data.code === 'OK') {
                    toast('저장되었습니다', 2000, 'success');
                    getCommunityTag();
                } else if (response.data.code === 'CMNY_TAG_ERR_INSERT_0001') {
                    $Modal.confirm({
                        message: '중복된 태그명입니다.',
                        buttonText: {
                            confirm: '확인'
                        }
                    })
                        .then(success => {
                            console.log(success);
                        })
                        .catch(error => {
                            console.log(error);
                        });
                }
            } catch (error) {
                console.log(error);
            }
        };

        /**
         * @delete tag
         */
        const deleteTag = async () => {
            try {
                // const params = [
                //     { 'tagMngSn': 0 }
                // ];
                const params = state.selectedTag.map(d => {
                    return {
                        tagMngSn: d.tagMngSn
                    };
                });
                const response = await _deleteTag(params);
                if (response.data.code === 'OK') {
                    toast('삭제되었습니다', 2000, 'success');
                    clearList(1);
                }
            } catch (error) {
                console.log(error);
            }
        };
        
        // 테이블 리사이징을 위한 참조값
        const onGridReady = (params) => {
            state.gridApi = params.api;
            state.gridColumApi = params.columnApi;
        };

        /**
         * 약관그룹 rowSelect 수정
         * @onRowSelect
         */
        const onRowSelect = (e) => {
            // 삭제 목록
            state.selectedTag = state.gridApi.getSelectedRows();
            // const rowItem = state.gridApi.getFocusedCell().column;
            // state.gridApi.getFocusedCell().column.colId
            console.log('rowSelected', state.selectedTag);
            // const rowItem = e.data;
            // 수정모드
            // if (rowItem) {
            //     state.isEdit = true;
            //     formData.clusGrpSn = rowItem.clusGrpSn;
            //     formData.checkTermsGroupName = rowItem.clusGrpNm;
            //     modalOpen();
            // }
        };

        //페이징 처리 
        const onChangedPage = (num) => {
            pager.current = num;
            //테이블 인덱스 번호 처리
            initColum.value[1].valueGetter = 'node.rowIndex + ' + Number(pager.size * (pager.current - 1) + 1);
            //api호출
            getCommunityTag();
        };

        //검색조건에 따른 리스트 재조회
        const reloadList = () => {
            pager.current = 1;
            onChangedPage(pager.current);
        };
        
        const clearList = (num) => {
            state.searchOptions.rgtrTyCd = '';
            state.searchOptions.searchType = 'hashTagNm';
            state.searchOptions.searchText = '';
            // state.searchOptions.bgnDate = '';
            // state.searchOptions.endDate = '';
            state.startday = '';
            state.endday = '';
            onChangedPage(num);
        };

        // 상세 검색 열기
        const openMoreSerch = () => {
            state.openMore = !state.openMore;
        };

        //셀렉트박스 선택
        const selectedOptions = (value, type) => {
            console.log(value, type);
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

        const checkValidState = (type) => {
            return state.validState.target === type && state.validState.errState;
        };

        /**
         * @validate
         */
        const validFormData = () => {
            const target = ['hashTagNm'];
            for (const item of target) {
                // console.log('check check >>', _.isEmpty(state.bizfilelist), formData['bzlcCpAtflSn']);
                state.validState.target = item;

                let msg = '';
                if (item === 'hashTagNm') msg = '태그명을 입력해주세요.';

                state.validState.message = msg;

                console.log('checkEmoji(state[item])', checkEmoji(state[item]), state[item].length > 20);

                if (item === 'hashTagNm' && checkEmoji(state[item])) {
                    state.validState.errState = true;
                    state.validState.message = '태그는 띄어쓰기 및 이모지를 사용할 수 없습니다.';
                    break;
                }
                if (item === 'hashTagNm' && state[item].length > 20) {
                    state.validState.errState = true;
                    state.validState.message = '20자 이하로 입력해주세요.';
                    break;
                }

                if (_.isEmpty(state[item])) {
                    state.validState.errState = true;
                    break;
                }
            }

            return !state.validState.errState;
        };

        /**
         * @validation 상태 초기화
         */
        const resetState = () => {
            console.log('reset valide state');
            state.validState.type = ''; // validation
            state.validState.errState = false;
            state.validState.message = '';
        };

        /**
         * @check emoji
         */
        const checkEmoji = (value) => {
            const reg = /[\s\uD83C-\uDFFF\uDC00-\uFFFF]/;
            return reg.test(value);
        };

        // 팝업 닫기
        const modalControl = (type, modalName) => {
            console.log(type);
            if (modalName === 'isShowTag') {
                if (type === 'modalconfirm') {
                    console.log(state.formData);
                    if (validFormData()) {
                        isShowTag.value = false;
                        createTag();
                    }
                } else {
                    isShowTag.value = false;
                }
            }
        };

        return {
            //공통 사용
            $Modal,
            tableResize,
            dateSearch,
            
            state,
            pager,
            isShowTag,
            initColum,
            onSelectPicker,
            openMoreSerch,
            onGridReady,
            onRowSelect,
            reloadList,
            onInitDate,
            onChangedPage,
            selectedOptions,
            checkOptions,
            resetTable,
            checkValidState,
            modalControl,
            
            menuInfo,
            checkRegist,
            checkDel,
            exelParams,
            onChangeDownRol
        };
    }
};
</script>