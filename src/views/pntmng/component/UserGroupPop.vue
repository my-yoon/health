<template>
    <DefaultModal :isShow="true" :modalTitle="'회원그룹조회'" :buttonCancel="'취소'" :buttonConfirm="'등록'" @modalclose="closeModal">
        <template #modalcontent>
            <div class="ui-section">
                <div class="ui-title-3">
                    <h3>그룹 목록</h3>
                </div>
                <div class="ui-content">
                    <div class="ui-data-filter sm">
                        <div class="form-item">
                            <div class="item">
                                <span class="input">
                                    <span class="dv">
                                        <select class="custom-select sm" v-model="searchData.cnSercSe">
                                            <option value="">선택</option>
                                            <option value="mbrGrpNm">그룹명</option>
                                            <option value="mbrGrpDscr">그룹설명</option>
                                        </select>
                                        <span class="dv">
                                            <input type="text" class="form-control sm" v-model="searchData.cnSercCts" @keyup="enterToSearch">
                                        </span>
                                    </span>
                                </span>
                            </div>
                            <div class="btn-filter-set">
                                <button type="button" class="btn btn-sm"><span class="ico-search" @click="onChangedPage(1)"></span>조회</button>
                            </div>
                        </div>
                    </div>
                    <div class="tbl-wrap">
                        <div class="table-util flex justify-end">
                            <div class="btn-set-m flex align-end">
                                <span class="table-total">조회결과 총 <strong>{{pager.totalCnt.toLocaleString('ko')}}</strong>건</span>
                            </div>
                        </div>
                        <NoData v-if="state.rowData.length === 0" :nodatatext="'조회된 데이터가 없습니다.'"></NoData>
                        <template v-else>
                            <AgGridVue :defaultColDef="state.defaultColDef" :columnDefs="state.tableColum_c"
                                :rowData="state.rowData" @grid-ready="onGridReady"
                                :suppressRowClickSelection="true" @selection-changed="onRowSelect" :rowSelection="'multiple'"
                                class="ag-theme-alpine" :domLayout="'autoHeight'">
                            </AgGridVue>
                            <PageNavigation :cntPerPage='pager.size' :itemCount='pager.totalCnt' :currentPage="pager.current"
                                @changedPage="onChangedPage" />
                        </template>
                    </div>
                </div>
            </div>
        </template>
    </DefaultModal>
</template>
<script>
import { getCurrentInstance, computed, reactive, onMounted, inject } from 'vue';
import { useStore } from 'vuex';
import { _getUserGroupList } from '@/api/pntmng.js';
import { tablelist_userGroupPop_label } from '@/data/table/pntmngtable.js';
import { dmCommFunc } from '@/views/pntmng/common/common.js';
import DefaultModal from '@/plugins/modal/modal/DefaultModal.vue';

export default {
    proprs: ['menuCode'],
    emits: ['modalPlcyclose'],
    components: { DefaultModal },
    setup() {
        const { emit } = getCurrentInstance();
        const { modal } = dmCommFunc();
        const store = useStore();
        const menuInfo = computed(() => store.state.getMenuItem.menuInfo);
        const state = reactive({
            tableColum_c: _.clone(tablelist_userGroupPop_label),
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
            selectList: []
        });

        const pager = reactive({
            current: 1,
            currentPageSize: 0,
            size: 8,
            offset: computed(() => (pager.current - 1) * pager.size),
            totalCnt: 0
        });

        const searchData = reactive({
            size: computed(() => pager.size),
            offset: computed(() => pager.offset),
            admnPtnrTyCd: '111001',
            cnSercSe: '',
            cnSercCts: '',
            orderType: 'fstRgsDt',
            orderSort: 'desc',
            menuCode: menuInfo.value.menuCode,
            page: computed(() => pager.current)

        });

        onMounted(() => {
            getUserGroupList();
        });

        const getUserGroupList = async () => {
            try {
                const response = await _getUserGroupList(searchData);
                if (response.code == 'OK') {
                    state.rowData = response.data.list;
                    pager.totalCnt = parseInt(response.data.totalCnt);
                } else {
                    modal(response.data.message);
                }
            } catch (error) {
                modal(error);
            }
        };

        // 테이블 리사이징을 위한 참조값
        const onGridReady = (params) => {
            state.gridApi = params.api;
            state.gridColumApi = params.columnApi;
        };

        // 페이징 처리
        const onChangedPage = (num) => {
            state.selectList = [];
            pager.current = num;
            getUserGroupList();
        };

        // 체크 박스 선택시 
        const onRowSelect = (e) => state.selectList = state.gridApi.getSelectedRows();

        const closeModal = (type, Name) => emit('modalPlcyclose', type, state.selectList);

        const enterToSearch = (e) => {
            if (e.keyCode === 13) onChangedPage(1);
        };

        return {
            state,
            searchData,
            pager,
            onChangedPage,
            onGridReady,
            onRowSelect,
            enterToSearch,
            closeModal
        };
    }
};
</script>