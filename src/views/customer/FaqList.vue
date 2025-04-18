<template>
    <section>
        <!-- 검색 -->
        <div class="ui-data-filter">
            <div class="form-item">
                <dateSerch ref="dateSearch" :dateTitle="'기간조회'" :pickerOnly="false"
                    :selectOptions="[{ label: '등록일자', value: '등록일자' }, { label: '수정일자', value: '수정일자' }]"
                    :setDay="state.setDay" @onSelectDate="onSelectPicker" />

                <div class="btn-filter-set">
                    <button class="btn btn-sm" type="button" @click="reloadList"><span class="ico-search"></span>조회
                    </button>
                    <button class="btn btn-sm" type="button" @click="onInitDate">
                        <span class="ico-reload sg"></span>
                        <span class="offscreen">리로드</span>
                    </button>
                    <button class="btn btn-sm" type="button" @click="openMoreSerch">
                        <span class="txt">상세검색 열기</span>
                    </button>
                </div>
            </div>
            <!-- 상세검색  v-if="state.openMore"-->
            <div v-if="state.openMore" class="ui-data-filter-more">
                <div class="form-item">
                    <div class="item">
                        <label>조건검색</label>
                        <span class="input">
                            <span class="dv">
                                <selectBox :selectType="'category'" @changedValue="selectedOptions_list" />
                            </span>
                            <span class="dv">
                                <input v-model="formData.searchText" :disabled="formData.searchType === 'all'"
                                    class="form-control sm" type="text">
                            </span>
                        </span>
                    </div>
                    <div class="item">
                        <label>노출 여부</label>
                        <span class="input">
                            <span class="dv">
                                <span v-for="(item, index) in state.exposeYnlist" :key="index" class="radio">
                                    <input :id="'exposeYn' + index" v-model="formData.exposeYn" :value="item.value"
                                        name="exposeYn" type="radio">
                                    <label :for="'exposeYn' + index">{{ item.label }}</label>
                                </span>
                            </span>
                        </span>
                    </div>
                </div>
                <div class="form-item">
                    <div class="item">
                        <label>문의유형</label>
                        <span class="input">
                            <span class="dv">
                                <commselect ref="faqcategory" :className="'sm'" :initData="formData.category"
                                    :selectType="'searchCode.faqcategory'" @changedValue="selectedOptions" />
                            </span>
                        </span>
                    </div>
                </div>
            </div>
        </div>
        <div class="tbl-wrap">
            <div class="table-util flex space-between">
                <div class="btn-set-m flex">
                    <button class="btn btn-ss" type="button" @click="checkDel">
                        삭제
                    </button>
                    <button class="btn btn-ss" type="button" @click="checkRegist">등록</button>
                </div>
                <div class="btn-set-m flex align-end">
                    <span class="table-total">조회결과 총 <strong>{{ pager.totalCnt }}</strong>건</span>
                    <button class="btn btn-opt" type="button" @click="checkEdit">
                        <span class="ico-download"></span>TOP10관리
                    </button>
                    <selectBox :selectType="'page'" @changedValue="selectedOptions" />

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
            <NoData v-if="state.qnaList.length === 0" :nodatatext="'조회된 데이터가 없습니다.'"></NoData>
            <div v-else>
                <AgGridVue :columnDefs="state.tableColum_c" :defaultColDef="state.defaultColDef" :domLayout="'autoHeight'"
                    :rowData="state.qnaList" :rowSelection="'multiple'" :suppressRowClickSelection="true"
                    class="ag-theme-alpine" @grid-ready="onGridReady" @cell-clicked="onCellClicked"
                    @selection-changed="onRowSelect">
                </AgGridVue>
                <PageNavigation :cntPerPage='pager.size' :currentPage="pager.current" :itemCount='pager.totalCnt'
                    @changedPage="onChangedPage" />
            </div>
        </div>

        <DefaultModal :buttonCancel="'취소'" :buttonConfirm="'저장'" :isShow="isTop10Show" :modalName="'isTop10Show'"
            :modalTitle="'FAQ TOP10'" @modalclose="modalControl">
            <template #modalcontent>
                <div v-if="updateTop10Show">
                    <div class="ui-grid-top-guide">
                        <p>1~10번까지 TOP10으로 노출됩니다.<br>순서변경은 드래그앤드롭 버튼을 이용해주세요.</p>
                    </div>
                    <div class="ui-dragdrop-menu full mt-10">
                        <draggable v-model="state.faqtop10" class="ui-dragdrop-list" item-key="faqTop10Sqn" tag="ul">
                            <template #item="{ item }">
                                <li class="ui-dragdrop-item">
                                    <div class="ui-dragdrop-item-top10">
                                        <span class="num">{{ item.faqTop10Sqn }}</span>
                                        <span class="ui-tag bc1">
                                            {{ getFaqCategory(item.faqCategoryCode) }}
                                        </span>
                                        <span class="subject">{{ item.faqTitle }}</span>
                                        <button class="del" type="button" @click="onDelTop10(item)"><span
                                                class="offscreen">top10에서 삭제</span></button>
                                    </div>

                                </li>
                            </template>
                        </draggable>
                        <!-- {{ state.faqtop10 }} -->
                    </div>
                </div>
            </template>
        </DefaultModal>
    </section>
</template>
<script>
import { computed, reactive, inject, onMounted, onUnmounted, ref, nextTick } from 'vue';
import DateSerch from '@/components/ui/DateSerch.vue';
import DefaultModal from '@/plugins/modal/modal/DefaultModal.vue';
import { useCommFunc } from '@/core/helper/common.js';
import { useStore } from 'vuex';
import { _getFaqList, _getTop10List, _modifyTop10, _deleteFaqList } from '@/api/customer.js';
import { commoCode } from '@/data/commcode';
import { authCommFunc } from '@/core/helper/authComm.js';

export default {
    components: { DefaultModal, DateSerch },
    setup() {
        const $Modal = inject('$Modal');
        // const dayJS = inject('dayJS');
        const store = useStore();
        const isTop10Show = ref(false);
        const updateTop10Show = ref(true);
        const dateSearch = ref(null);
        const { goToPage, fileDown, tableResize, openModal } = useCommFunc();

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
        const { onChangeRegistRol, onChangeEditRol, onChangeDelRol } = authCommFunc();
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
                maxWidth: 80,
                valueGetter: 'node.rowIndex + 1'
            },
            {
                headerName: '문의유형',
                field: 'faqCategoryCode',
                maxWidth: 100,
                // (params) => commoCode.searchCode.faqcategory.filter(d => d.value === params.data.faqCategoryCode).cmnCdNm || ''
                valueGetter: (params) => {
                    if (params.data.faqCategoryCode === '159001') return '일반(이용)';
                    if (params.data.faqCategoryCode === '159002') return '혜택';
                    if (params.data.faqCategoryCode === '159003') return '건강검진';
                    if (params.data.faqCategoryCode === '159004') return '건강기록';
                    if (params.data.faqCategoryCode === '159005') return '건강뉴스';
                    // if (params.data.faqCategoryCode === '159006') return '제휴 서비스';
                    // if (params.data.faqCategoryCode === '159007') return 'KB 오케어몰';
                    if (params.data.faqCategoryCode === '159008') return '메디컬 문의';
                    if (params.data.faqCategoryCode === '159009') return '기타';
                }
            },
            {
                headerName: 'TOP10',
                field: 'faqTop10Yn',
                maxWidth: 90,
                cellRenderer: (params) => {
                    const tagString = `<span class="ui-tag bc1">TOP10</span>`;
                    const buttonTarget = document.createElement('div');
                    buttonTarget.innerHTML = tagString;
                    if (params.data.faqTop10Yn === 'Y') return buttonTarget;
                }
            },
            {
                headerName: '질문',
                field: 'faqTitle',
                flex: 1,
                cellRenderer: (params) => {
                    const tagString = `<a id="detail-${params.node.rowIndex}">${params.data.faqTitle}</a>`;
                    const buttonTarget = document.createElement('div');
                    buttonTarget.innerHTML = tagString;
                    const buttonEventTarget = buttonTarget.querySelector(`#detail-${params.node.rowIndex}`);
                    buttonEventTarget.addEventListener('click', () => {
                        console.log(params.data.faqSn);
                        goToPage(`/cs_center/faq/detail?faqSn=${params.data.faqSn}`);

                    });
                    return buttonTarget;
                }
            },
            { headerName: '조회수', field: 'faqViewCnt', maxWidth: 100 },
            { headerName: '등록일자', field: 'firstRegistDatetime', maxWidth: 150 },
            { headerName: '수정일자', field: 'lastUpdateDatetime', maxWidth: 150 },
            {
                headerName: '노출상태',
                field: 'faqIndicationTypeCode',
                maxWidth: 100,
                valueGetter: (params) => {
                    if (params.data.faqIndicationTypeCode === '132001') return '노출';
                    if (params.data.faqIndicationTypeCode === '132003') return '비노출';
                }
            }

        ]);

        const state = reactive({
            tableColum_c: _.clone(initColum.value),
            filterCoulm: [],
            //테이블 옵션
            defaultColDef: {
                sortable: false,
                filter: false,
                resizable: true,
                flex: 1,
                headerClass: 'centered',
                cellClass: 'centered'
            },

            qnaList: [],
            pagesize: 10,
            gridApi: null,
            gridColumApi: null,
            openMore: false,
            exposeYnlist: [
                { label: '전체', value: 'all' },
                { label: '노출', value: '132001' },
                { label: '비노출', value: '132003' }
            ],
            setDay: '1month',
            startDay: '',
            endDay: '',
            faqCategory: [
                { label: '전체', value: '' },
                { label: '일반(이용)', value: '159001' },
                { label: '혜택', value: '159002' },
                { label: '건강검진', value: '159003' },
                { label: '건강기록', value: '159004' },
                { label: '건강뉴스', value: '159005' },
                { label: '제휴 서비스', value: '159006' },
                { label: 'KB 오케어몰', value: '159007' },
                { label: 'KB 오케어 M', value: '159008' },
                { label: '기타', value: '159009' }
            ],
            faqtop10: [],
            faqSn: '',
            unusedList: [],

            top10DeleteItems: []
        });

        const formData = reactive({
            inqType: 'regDate',
            bgnDate: computed(() => state.startDay), //시작일
            endDate: computed(() => state.endDay), //종료일,
            searchType: 'all',
            searchText: '',
            exposeYn: 'all',
            category: ''
        });

        // 페이징
        const pager = reactive({
            current: 1,
            currentPageSize: 1,
            size: computed(() => state.pagesize),
            offset: computed(() => (pager.current - 1) * pager.size),
            totalCnt: 0
        });

        // watch(() => state.faqtop10, () => {
        //     // console.log('watch');
        //     updateTop10Sqn();
        // });

        onMounted(() => {
            // emitter.$on('codeListDetail', tableBtnControl);
            getQnaList();

            emitter.$on('onChangeRegist', onChangeRegist);
            emitter.$on('onChangeEdit', onChangeEdit);
            emitter.$on('onChangeDel', onChangeDel);
        });

        /**
         * 마스킹 해제 이벤트 버스 해제
         */
        onUnmounted(() => {
            emitter.$off('onChangeRegist');
            emitter.$off('onChangeEdit');
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
            goToPage('/cs_center/faq/detail');
        };

        /**
         * 수정 권한 체크
         */
        const checkEdit = async () => {
            await onChangeEditRol(menuInfo.value.auth2UpdateYn);
        };

        /**
         * 수정 권한 체크 callback
         */
        const onChangeEdit = () => {
            // goToPage('/cs_center/system_notice/register?systemNoticeSn=' + formData.value.systemNoticeSn);
            faq10ListModal();
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
            actionBtns('del');
        };

        // 상세 검색 열기
        const openMoreSerch = () => {
            console.log(state.openMore);
            state.openMore = !state.openMore;
        };

        // 테이블 리사이징을 위한 참조값
        const onGridReady = (params) => {
            state.gridApi = params.api;
            state.gridColumApi = params.columnApi;
            // console.log(params.columnApi);
        };

        // 체크 박스 선택시
        const onRowSelect = (e) => {
            console.log(state.gridApi.getSelectedRows());
            const rowlist = state.gridApi.getSelectedRows();

            state.unusedList = rowlist.map(item => item.faqSn);
            state.faqSn = state.unusedList[0];
        };

        // 테이블 셀 선택
        const onCellClicked = (e) => {
            // console.log(state.gridApi.getFocusedCell().column);
            const code = state.gridApi.getFocusedCell().column.colId === 'msgCd';
            state.msgCode = e.data.msgSn;

        };

        // 페이징 처리
        const onChangedPage = (num) => {
            pager.current = num;
            //테이블 인덱스 번호 처리
            initColum.value[1].valueGetter = 'node.rowIndex + ' + Number(pager.size * (pager.current - 1) + 1);
            //api호출
            getQnaList();

        };

        // 데이터 피커 초기화
        const onInitDate = () => {
            dateSearch.value.initDate();
            //재조회  api 호출
            clearList(1);
        };

        //검색조건에 따른 리스트 재조회
        const reloadList = () => {
            pager.current = 1;
            onChangedPage(pager.current);
        };

        //리스트 갯수 변경 후 리스트 재 조회
        const clearList = (num) => {
            formData.inqType = 'regDate';
            formData.searchType = 'all';
            formData.searchText = '';
            formData.exposeYn = 'all';
            formData.category = '';
            dateSearch.value.initDate();
            onChangedPage(num);

        };

        /**
         * TOP10 관리
         */
        const faq10ListModal = async () => {
            await getTop10List();
            nextTick(() => {
                isTop10Show.value = true;
            });

        };

        /**
         * TOP10 item 삭제
         * API x / model data row 만 삭제 * 저장할때 row index 정렬 처리 해줘야 함 ( faqTop10Sqn )
         */
        const onDelTop10 = async (item) => {
            try {

                state.top10DeleteItems.push(item); // 삭제할 items 담아 두었다가 저장할때 faqTop10Yn: 'N' 처리
                const targetIndex = state.faqtop10.findIndex(d => d === item);
                state.faqtop10.splice(targetIndex, 1);
                await updateTop10Sqn(); // update Top10 sqn 정렬

                console.log('삭제', state.faqtop10, state.top10DeleteItems);
                // getTop10List(); // 재조회
            } catch (error) {
                console.log(error);
            }
        };

        /**
         * TOP10 관리 ( 수정, 삭제 )
         * 수정, 삭제는 같은 API 사용 * TOP10 목록 전체 params 로 담아 call
         */
        const modifyTop10 = async () => {
            try {
                await updateTop10Sqn();
                const updateParams = state.faqtop10.map(d => {
                    const param = {
                        faqSn: d.faqSn,
                        faqTop10Sqn: d.faqTop10Sqn,
                        faqTop10Yn: d.faqTop10Yn
                    };
                    return param;
                });
                console.log('delelte > items > ', state.top10DeleteItems);
                const deleteParams = state.top10DeleteItems.map(d => {
                    const param = {
                        faqSn: d.faqSn,
                        faqTop10Sqn: d.faqTop10Sqn,
                        faqTop10Yn: 'N'
                    };
                    return param;
                });

                const response = await _modifyTop10({ paramList: [...updateParams, ...deleteParams] });

                console.log('modify top10 >', response);
                if (response.data.code === 'OK') toast('저장되었습니다', 2000, 'success');
            } catch (error) {
                console.log(error);
            }
        };

        const testEvent = () => {
            //
            console.log('update');
        };

        /**
         * TOP10 sqn 정렬 처리
         * @model state.faqtop10
         */
        const updateTop10Sqn = () => {
            updateTop10Show.value = false;
            // console.log('state.faqtop10 >>', state.faqtop10);
            state.faqtop10 = state.faqtop10.map((d, i) => {
                const item = { ...d, faqTop10Sqn: i + 1 }; // faqTop10Sqn 정렬
                return item;
            });

            setTimeout(() => {
                updateTop10Show.value = true;
            }, 1);
        };

        // 모달창 닫기
        const modalControl = (type, modalName) => {
            if (modalName === 'isTop10Show') {

                isTop10Show.value = false;
                if (type === 'modalconfirm') {
                    $Modal.confirm({
                        title: '',
                        message: '저장하시겠습니까?',
                        buttonText: {
                            confirm: '확인',
                            cancel: '취소'
                        }
                    }).then(success => {
                        console.log('callback', success);
                        if (success === 'confirm') {
                            modifyTop10(); // TOP10 저장(수정)
                        }
                    }).catch(error => {
                        if (error === 'cancel') isTop10Show.value = true;
                        console.log(error);
                    });

                    // console.log('state.faqtop10', state.faqtop10);
                }
                // console.log('state.faqtop10', state.faqtop10);

                // state.top10DeleteItems = []; // 초기화
            } else if (modalName === 'isRequestShow') {
                isRequestShow.value = false;
            } else if (!modalName) {
                isTop10Show.value = false;
            }
            console.log(type, modalName);
        };

        // 리스트 조회
        const getQnaList = async () => {
            try {
                let params = {
                    size: pager.size,
                    offset: pager.offset,
                    inqType: formData.inqType,
                    bgnDate: formData.bgnDate,
                    endDate: formData.endDate,
                    searchType: formData.searchType,
                    searchText: formData.searchText,
                    exposeYn: formData.exposeYn,
                    category: formData.category
                };
                console.log(params);
                const response = await _getFaqList(params);
                pager.totalCnt = response.data.data.totalCnt;
                state.qnaList = response.data.data.list;
                //
            } catch (error) {
                console.log(error);
            }
        };

        /**
         * FAQ 유형 조회
         * @typeCode faqcategory
         */
        const getFaqCategory = (typeCode) => {
            const _filter = commoCode.searchCode.faqcategory.filter(d => d.value === typeCode);
            return _filter ? _filter[0].cmnCdNm : '';
        };

        // Top10리스트 조회
        const getTop10List = async () => {
            try {
                const response = await _getTop10List();
                state.faqtop10 = response.data.data.list;
                console.log(response);
            } catch (error) {
                console.log(error);
            }
        };

        //리스트 삭제
        const deleteFaqList = async () => {
            try {
                // let params = {
                //     faqSn: state.faqSn,
                //     faqDeleteYn: 'Y'
                // };
                const params = { faqSnList: [...state.unusedList] };
                console.log('>> del items', params);
                const response = await _deleteFaqList(params);
                console.log(response);
                if (response.data.code === 'OK') {
                    await getQnaList();
                    toast('삭제 되었습니다.', 2000, 'success');
                }
            } catch (error) {
                console.log(error);
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
            if (status === '등록일자') {
                formData.inqType = 'regDate';
            } else if (status === '수정일자') {
                formData.inqType = 'upDate';
            }
            //api호출
            console.log('선택일:' + value, '선택된 버튼:' + type, '조회기준:' + status);
        };

        const actionBtns = (type) => {
            console.log('type', type);
            if (type === 'del') {
                let msg = '';
                if (state.faqSn) {
                    msg = '선택하신 등록 건을 삭제하시겠습니까?';
                } else {
                    msg = '삭제할 FAQ가 없습니다.';
                }
                $Modal.confirm({
                    title: '',
                    message: msg,

                    buttonText: {
                        confirm: '확인',
                        cancel: '취소'
                    }
                })
                    .then(async (success) => {
                        console.log(success);
                        if (state.faqSn) {
                            await deleteFaqList();
                        }


                    })
                    .catch(error => {
                        console.log(error);
                    });
            }
        };

        // 셀렉트박스 선택
        const selectedOptions_list = (value, type) => {
            console.log(value, type);
            if (type === 'page') {
                state.pagesize = value;
                clearList(1);
            } else if (type === 'category') {
                if (value === 'all') {
                    formData.searchType = 'all';
                } else if (value === 'Y') {
                    formData.searchType = 'title';
                } else if (value === 'N') {
                    formData.searchType = 'content';
                }
            }
        };

        const selectedOptions = (valueCode, valueName, type) => {
            console.log(type);
            if (type === 'faqcategory') {
                formData.category = valueCode;
            } else {
                formData[type] = valueCode;
            }
            console.log(valueCode, valueName, type);
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

        return {
            //공통 사용
            $Modal,
            // dayJS,
            goToPage,
            fileDown,
            tableResize,
            // isDownShow,
            // isPartnerShow,
            // isImgShow,
            openModal,
            pager,
            state,
            isTop10Show,
            updateTop10Show,
            initColum,
            formData,
            dateSearch,
            onGridReady,
            onCellClicked,
            openMoreSerch,
            reloadList,
            onChangedPage,
            selectedOptions,
            selectedOptions_list,
            checkOptions,
            resetTable,
            // getQnaList,
            onSelectPicker,
            onRowSelect,
            onInitDate,
            faq10ListModal,
            modalControl,
            onDelTop10,
            testEvent,
            getFaqCategory,
            actionBtns,

            checkRegist,
            checkEdit,
            checkDel
        };
    }
};
</script>