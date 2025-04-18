<template>
    <DefaultModal :isShow="true" :modalTitle="'카테고리명 조회'" :buttonConfirm="''" :buttonCancel="'닫기'"
        :modalName="'isCtgrSearch'" @modalclose="closeModal">
        <template #modalcontent>
            <div class="ui-modal-body">
                <div class="ui-title-3">
                    <h3>카테고리 목록</h3>
                </div>
                <div class="ui-data-filter sm mt-10">
                    <div class="form-item">
                        <div class="item">
                            <span class="input">
                                <span class="dv">
                                    <input type="text" class="form-control sm w-450" v-model="searchData.ctgrName" @keyup="enterToSearch">
                                </span>
                            </span>
                        </div>
                        <div class="btn-filter-set">
                            <button type="button" class="btn btn-sm" @click="onChangedPage(1)" >
                                <span class="ico-search"></span>검색</button>
                        </div>
                    </div>
                </div>
                <div class="tbl-wrap mt-10">
                    <div id="myGrid" class="ag-theme-alpine">
                        <NoData :nodatatext="'해당 검색어로 검색된 결과가 없습니다.'" v-if="state.rowData.length === 0"></NoData>
                        <template v-else>
                        <AgGridVue :defaultColDef="state.defaultColDef" :columnDefs="state.tableColum_c"
                            :rowData="state.rowData" @grid-ready="onGridReady" :suppressRowClickSelection="true"  :rowSelection="'multiple'"
                            class="ag-theme-alpine" :domLayout="'autoHeight'" >
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
import { getCurrentInstance, computed, reactive, onMounted, inject, ref } from 'vue';
import DateSerch from '@/components/ui/DateSerch.vue';
import { useStore } from 'vuex';
import { useCommFunc } from '@/core/helper/common.js';
import { _getCtgrSearchList } from '@/api/healthnews.js';
import CommonBtn from '@/views/pntmng/component/CommonBtn.vue';
import DefaultModal from '@/plugins/modal/modal/DefaultModal.vue';

export default {
    components: { DateSerch, CommonBtn, DefaultModal },
    props: ['title'],
    emits: ['modalCtgrClose'],
    
    setup(props) {
        const internalInstance = getCurrentInstance();

        const Modal = inject('$Modal');
        const isShow = ref(false);
        const { emit } = getCurrentInstance();
        const initColum = ref([
            { headerName: '번호', field: 'no', valueGetter: 'node.rowIndex + 1', maxWidth: 100 },
            { headerName: '대 / 중 / 소 분류',
                flex: 1,
                field: 'clsfCodeName',
                cellRenderer: params => {
                    return params.value;
                }
            }
        ]);

        const state = reactive({
            pagesize: 10,
            tableColum_c: _.clone(initColum.value),
            rowData: [],
            defaultColDef: {
                sortable: true,
                resizable: true,
                width: 100,
                headerClass: 'centered',
                cellClass: 'centered'
            },
            gridApi: null,
            gridColumApi: null,
            selectList: []
        });

        onMounted(() => {
            getCtgrSearchList();
        });

        const searchData = reactive({
            ctgrName: ''
        });

        const onGridReady = (params) => {
            state.gridApi = params.api;
            state.gridColumApi = params.columnApi;
            // console.log(params.columnApi);
        };

        const pager = reactive({
            current: 1,
            currentPageSize: 0,
            size: 10,
            offset: computed(() => (pager.current - 1) * pager.size),
            totalCnt: 0
        });

        const initSearch = () => {
            searchData.ctgrName = '';
        };
      
        // 페이징 처리
        const onChangedPage = (num) => {
            state.selectList = [];
            pager.current = num;
            getCtgrSearchList();
        };

        const enterToSearch = (e) => {
            if (e.keyCode === 13) onChangedPage(1);
        };

          /**
         * 카테고리 조회
         */
        const getCtgrSearchList = async () => {
            try {
                const params = {
                    size: pager.size,
                    offset: pager.offset,
                    searchWord: searchData.ctgrName
                };
                const response = await _getCtgrSearchList(params);

                if (response.code == 'OK') {
                    console.log('>> get', response);
                    let list = response.data.list;
                    let rowData = [];
                    const result = [];
                    list.forEach((item, index) => {
                        let clsfCodeName;
                        if (searchData.ctgrName == '') {
                            clsfCodeName = item.mjcsCdNm + ' > ' + item.mdcsCdNm + ' > ' + item.mncsCdNm;
                        } else {
                            let tmpclsfCodeName = item.mjcsCdNm + ' > ' + item.mdcsCdNm + ' > ' + item.mncsCdNm;
                            clsfCodeName = tmpclsfCodeName.replaceAll(searchData.ctgrName, '<b>' + searchData.ctgrName + '</b>');
                        }
                        console.log('>> get clsfCodeName', clsfCodeName);
                        item.clsfCodeName = clsfCodeName;
                        rowData.push(item);
                    });
                    state.rowData = rowData;
                    
                    pager.totalCnt = response.data.totalCount;
                } else {
                    Modal.simple({title: '경고', message: response.message, buttonText: {ok: '확인'}});
                }
            } catch (error) {
                console.log(error);
            }
        };

        /**
         * @modal
         */
        const closeModal = async (type) => {
            emit('modalCtgrClose', type);
        };

        return {
            Modal,
            initColum,
            state,
            searchData,
            onGridReady,
            pager,
            initSearch,
            onChangedPage,
            getCtgrSearchList,
            closeModal,
            enterToSearch
        };
    }

};

</script>