<template>
    <DefaultModal :isShow="state.isShow" buttonCancel="취소" buttonConfirm="저장" modalName="isQnaTransfer"
        modalTitle="문의 이관 등록" @modalclose="modalClose">
        <template #modalcontent>
            <div class="ui-title-3">
                <h3>파트너 목록</h3>
            </div>
            <div class="ui-data-filter sm mt-10">
                <div class="form-item">
                    <div class="item">
                        <span class="input">
                            <span class="dv">
                                <SubSelectBox v-model="formData.searchType" :list="state.searchTypeList" />
                            </span>
                            <span class="dv">
                                <input v-model="formData.searchText" class="form-control sm" type="text">
                            </span>
                        </span>
                    </div>
                    <div class="btn-filter-set">
                        <button class="btn btn-sm" type="button" @click="reloadList">
                            <span class="ico-search"></span>검색
                        </button>
                    </div>
                </div>
            </div>
            <div class="tbl-wrap mt-10">
                <div class="table-util flex space-between">
                    <div class="btn-set-m flex"></div>
                    <div class="btn-set-m flex align-end">
                        <span class="table-total">조회결과 총 <strong>{{ pager.totalCnt }}</strong>건</span>
                        <SubSelectBox v-model="state.pagesize" :list="state.pageSizeList"
                            @change="onChangedPage(pager.current)" />
                    </div>
                </div>
                <NoData v-if="state.partnerList.length === 0" :nodatatext="'조회된 데이터가 없습니다.'"></NoData>
                <div v-else>
                    <AgGridVue :columnDefs="state.tableColum_c" :defaultColDef="state.defaultColDef"
                        :rowData="state.partnerList" class="ag-theme-alpine" domLayout="autoHeight" rowSelection="single"
                        @cell-clicked="onCellClicked" @grid-ready="onGridReady">
                    </AgGridVue>
                    <PageNavigation :cntPerPage='pager.size' :currentPage="pager.current" :itemCount='pager.totalCnt'
                        @changedPage="onChangedPage" />
                </div>
            </div>
            <div class="ui-grid-top-guide t-right mt-20">
                <span class="ess"></span> 표시는 필수항목입니다.
            </div>
            <div class="tbl-wrap mt-10">
                <table class="table reg">
                    <colgroup>
                        <col style="width: 160px;">
                        <col style="width: auto;">
                    </colgroup>
                    <tbody>
                        <tr>
                            <th scope="row">이관사유 등록<span class="ess"><span class="offscreen">필수입력</span></span></th>
                            <td>
                                <div class="reg-group">
                                    <div class="reg-item">
                                        <div class="guide-form flex-11">
                                            <textarea id="textarea" v-model="regFormData.questionTransferReason"
                                                :class="state.questionTransferReasonError ? 'error' : ''"
                                                class="form-control" placeholder="이관사유를 입력하세요." style="height: 100px"
                                                @input="state.questionTransferReasonError = state.questionTransferReasonError ? false : false"></textarea>
                                            <span v-if="state.questionTransferReasonError" class="input-guide error">이관사유를
                                                입력해주세요</span>
                                        </div>
                                    </div>
                                </div>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </template>
    </DefaultModal>
</template>
<script>
import { reactive, ref, onMounted, computed, getCurrentInstance, inject } from 'vue';
import { _getQnaPartnerList, _registTranferCreate } from '@/api/customer.js';
import SubSelectBox from '@/views/customer/components/SelectBox.vue';
import DefaultModal from '@/plugins/modal/modal/DefaultModal.vue';

export default {
    props: ['isShow', 'qnaSn', 'menuCode'],
    components: { DefaultModal, SubSelectBox },
    emits: ['modalClose'],
    setup(props) {
        onMounted(() => {
            getPartnerList();
            regFormData.value.qnaSn = props.qnaSn;
        });

        const $Modal = inject('$Modal');
        const { emit } = getCurrentInstance();
        const initColum = ref([
            { headerName: '번호', field: '번호', valueGetter: 'node.rowIndex + 1', maxWidth: 90 },
            { headerName: '파트너명', field: 'companyName', width: 100 },
            {
                headerName: '사업자등록번호',
                field: 'businessNumber',
                width: 100,
                valueFormatter: param => {
                    // 세자리 콤마
                    return param.value.substring(0, 3) + '-' + param.value.substring(3, 5) + '-' + param.value.substring(6, 10);
                }
            },
            {
                headerName: '선택',
                field: '선택',
                maxWidth: 130,
                cellRenderer: params => {
                    return '<button type="button" class="btn btn-ss">선택</button>';
                }
            }
        ]);

        const state = reactive({
            menuCode: computed(() => props.menuCode),
            isShow: true,
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
            partnerList: [],
            delList: [],
            pagesize: 5,
            gridApi: null,
            gridColumApi: null,
            //
            searchTypeList: [
                { label: '선택', value: '' },
                { label: '파트너명', value: 'companyName' },
                { label: '사업자등록번호', value: 'businessNumber' }
            ],
            pageSizeList: [
                { label: '5개씩 보기', value: 5 },
                { label: '10개씩 보기', value: 10 },
                { label: '15개씩 보기', value: 15 },
                { label: '20개씩 보기', value: 20 }
            ],
            questionTransferReasonError: false
        });

        // 검색폼
        const formData = reactive({
            searchType: '', // 검색조건
            searchText: '' // 검색내용
        });

        //등록폼
        const regFormData = ref({
            qnaSn: null,  // qna 순번
            questionTransferCorperationSn: null,  // 이관 대상업체 순번
            questionTransferReason: null  // 이관 사유
        });
        //파트너 조회
        const getPartnerList = async () => {
            try {
                let params = {
                    size: pager.size,
                    offset: pager.offset,
                    searchType: formData.searchType,
                    searchText: formData.searchText
                };

                const response = await _getQnaPartnerList(params);
                state.partnerList = response.data.data.list;
                pager.totalCnt = response.data.data.totalCnt;

            } catch (error) {
                console.log(error);
            }
        };

        // 문의 이관등록
        const regTranferCreate = () => {
            try {
                let params = {
                    qnaSn: regFormData.value.qnaSn,
                    questionTransferCorperationSn: regFormData.value.questionTransferCorperationSn,
                    questionTransferReason: regFormData.value.questionTransferReason,
                    menuCode: state.menuCode
                };


                return _registTranferCreate(params).then(result => {
                    if (result.data.code === 'OK') {
                        return true;
                    } else {
                        console.log(result.data);
                        return false;
                    }
                });

            } catch (error) {
                console.log(error);
                return false;
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

        //페이징 처리
        const onChangedPage = async (num) => {
            pager.current = num;
            //테이블 인덱스 번호 처리
            initColum.value[0].valueGetter = 'node.rowIndex + ' + Number(pager.size * (pager.current - 1) + 1);
            //api호출
            await getPartnerList();
        };

        // AGgrid API 맵핑
        const onGridReady = (params) => {
            state.gridApi = params.api;
            state.gridColumApi = params.columnApi;
        };

        const reloadList = () => {
            pager.current = 1;
            onChangedPage(pager.current);
        };

        const modalClose = (type) => {
            //저장시
            if (type === 'modalconfirm') {
                // 등록
                if (validation()) {
                    if (!regTranferCreate()) return false;
                } else {
                    return false;
                }
            }

            emit('modalClose', { name: 'isQnaTransfer', value: true });
            initForm();
        };

        const initForm = () => {
            formData.value = {
                searchType: '', // 검색조건
                searchText: '' // 검색내용
            };

            //등록폼
            regFormData.value = {
                qnaSn: null,  // qna 순번
                questionTransferCorperationSn: null,  // 이관 대상업체 순번
                questionTransferReason: null  // 이관 사유
            };
        };

        const validation = () => {
            //QNA 선택
            if (!regFormData.value.qnaSn) {
                state.isShow = false;
                $Modal.alert({ message: '이관할 문의를 선택해주세요.' })
                    .then(success => {
                        console.log(success);
                        state.isShow = true;
                    })
                    .catch(error => {
                        console.log(error);
                        state.isShow = true;
                    });

                return false;
            }

            //파트너 선택
            if (!regFormData.value.questionTransferCorperationSn) {
                state.isShow = false;
                $Modal.alert({ message: '파트너를 선택해주세요.' })
                    .then(success => {
                        console.log(success);
                        state.isShow = true;
                    })
                    .catch(error => {
                        console.log(error);
                        state.isShow = true;
                    });
                return false;
            }

            // 사유입력
            if (!regFormData.value.questionTransferReason) {
                state.questionTransferReasonError = true;
                return false;
            }

            return true;
        };

        const onCellClicked = (param) => {
            if (param.colDef.field === '선택') {
                regFormData.value.questionTransferCorperationSn = param.data.ntprSn;
            }
        };

        return {
            pager,
            state,
            formData,
            regFormData,
            onGridReady,
            onChangedPage,
            reloadList,
            modalClose,
            onCellClicked
        };
    }
};
</script>