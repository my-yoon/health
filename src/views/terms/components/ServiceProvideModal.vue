<template>
    <div class="ui-title-3">
        <h3>서비스제공자</h3>
    </div>
    <div class="ui-data-filter sm mt-10">
        <div class="form-item">
            <div class="item">
                <label>서비스제공자명</label>
                <span class="input">
                    <span class="dv">
                        <input type="text" v-model="formData.searchText" class="form-control sm w-300">
                    </span>
                </span>
            </div>
            <div class="btn-filter-set">
                <button type="button" class="btn btn-sm" @click="getTermsOffice">
                    <span class="ico-search"></span>검색</button>
            </div>
        </div>
    </div>
    <div class="tbl-wrap mt-10">
        <div class="table-util flex space-between">
            <div class="btn-set-m flex"></div>
            <div class="btn-set-m flex align-end">
                <span class="table-total">조회결과 총 <strong>{{ pager.totalCnt }}</strong>건</span>
            </div>
        </div>
        <div id="myGrid" class="ag-theme-alpine"></div>
        <NoData v-if="state.officeList.length === 0" :nodatatext="'조회된 데이터가 없습니다.'"></NoData>
        <div v-else ref="agGrid">
            <AgGridVue :columnDefs="state.tableColum_c" :defaultColDef="state.defaultColDef"
                :domLayout="state.domLayout" :rowData="state.officeList"
                :suppressRowClickSelection="true"
                :rowSelection="'multiple'" class="ag-theme-alpine" style="width:100%">
            </AgGridVue>
            <PageNavigation :cntPerPage='pager.size' :itemCount='pager.totalCnt' :currentPage="pager.current"
                @changedPage="onChangedPage" />
        </div>
    </div>
</template>
<script>

import { getCurrentInstance, onMounted, onUnmounted, reactive, computed, ref } from 'vue';
import { _getTermsOffice } from '@/api/terms';
export default {
    emits: ['selectPartner'],
    setup() {
        const {emit} = getCurrentInstance();
        const initColum = ref([
            // { headerName: '선택', field: 'select', maxWidth: 50, checkboxSelection: true, headerCheckboxSelection: true },
            { headerName: '번호', field: 'no', valueGetter: 'node.rowIndex + 1', maxWidth: 100 },
            { headerName: '서비스제공자', field: 'ntprNm', flex: 1 },
            {
                headerName: '선택',
                field: 'select',
                maxWidth: 90,
                // cellRenderer: 'btnComp'
                cellRenderer: (params) => {
                    const tagString = `<button type="button" class="btn btn-ss" id="detail-${params.node.rowIndex}">선택</button>`;
                    const buttonTarget = document.createElement('div');
                    buttonTarget.innerHTML = tagString;
                    const buttonEventTarget = buttonTarget.querySelector(`#detail-${params.node.rowIndex}`);
                    buttonEventTarget.addEventListener('click', () => {
                        console.log(params.data.faqSn);
                        emitter.$emit('cellPartnerSelect', params);

                    });
                    return buttonTarget;
                }
            }
        ]);
        const state = reactive({
            pagesize: 4,
            officeList: [], // 기업목록

            tableColum_c: _.clone(initColum.value),
            // 테이블 옵션
            domLayout: 'autoHeight',
            defaultColDef: {
                sortable: false,
                filter: false,
                resizable: true,
                flex: 1,
                headerClass: 'centered',
                cellClass: 'centered'
            }
        });
        const formData = reactive({
            searchText: ''
        });

        // 페이징
        const pager = reactive({
            current: 1,
            currentPageSize: 1,
            size: computed(() => state.pagesize),
            offset: computed(() => (pager.current - 1) * pager.size),
            totalCnt: 0
        });

        onMounted(() => {
            getTermsOffice();
            emitter.$on('cellPartnerSelect', cellPartnerSelect);
        });

        onUnmounted(() => {
            emitter.$off('cellPartnerSelect');
        });

        /**
         * 서비스제공자 목록 조회
         */
        const getTermsOffice = async () => {
            try {
                const params = {
                    size: pager.size,
                    offset: pager.offset,
                    searchType: 'ntprNm', // "ntprNm(기업명) / brn(사업자등록번호)",
                    searchText: formData.searchText,
                    orderType: 'ntprNm', // "ntprNm(기업명) / brn(사업자등록번호)",
                    orderSort: 'asc', // "desc / asc",
                    page: 0
                };
                const response = await _getTermsOffice(params);
                console.log('서비스제공자 목록 조회', response.data.data.list);
                state.officeList = response.data.data.list;
                pager.totalCnt = response.data.data.totalCnt;
            } catch (error) {
                console.log(error);
            }
        };

        /**
         * 조건 검색
         * @click
         */
        const dateSearch = () => {

        };

        // 페이징 처리
        const onChangedPage = (pagenum) => {
            pager.current = pagenum;
            //테이블 인덱스 번호 처리
            initColum.value[0].valueGetter = 'node.rowIndex + ' + Number(pager.size * (pager.current - 1) + 1);
            getTermsOffice();
        };

        const cellPartnerSelect = (e) => {
            const target = e.data;
            // console.log(target);
            emit('selectPartner', e.data);
        };

        return {
            state,
            formData,
            pager,
            onChangedPage,
            getTermsOffice
        };
    }
};
</script>
