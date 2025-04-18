<template>
    <div>
        <div>
            <div class="ui-title-3">
                <h3>승인자 목록</h3>
            </div>
            <div class="ui-data-filter sm mt-10">
                <div class="form-item">
                    <div class="item">
                        <span class="input">
                            <span class="dv">
                                <select class="custom-select sm" v-model="formData.cnSercSe">
                                    <option :value="item.value" v-for="(item, index) in state.searchlist" :key="index">
                                        {{ item.label }}
                                    </option>
                                </select>
                            </span>
                            <span class="dv">
                                <input type="text" class="form-control sm" v-model="formData.cnSercCts"
                                    :disabled="formData.cnSercSe === ''">
                            </span>
                        </span>
                    </div>
                    <div class="btn-filter-set">
                        <button type="button" class="btn btn-sm">
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
                <div>
                    <AgGridVue :columnDefs="state.tableColum_c" :rowData="state.mainApporvelist"
                        :defaultColDef="state.defaultColDef" @cell-clicked="onCellClicked" class="ag-theme-alpine"
                        :domLayout="state.domLayout" style="width:100%">
                    </AgGridVue>
                    <PageNavigation :cntPerPage='pager.size' :itemCount='pager.totalCnt' :currentPage="pager.current"
                        @changedPage="onChangedPage" />
                </div>
            </div>
        </div>

    </div>
</template>
<script>
import { reactive, inject, ref, onMounted, onUnmounted, computed, nextTick, getCurrentInstance } from 'vue';
import { useCommFunc } from '@/core/helper/common.js';
import { authCommFunc } from '@/core/helper/authComm.js';
import { useStore } from 'vuex';
import { useRouter, useRoute } from 'vue-router';
import { _getMainSectionApproveUser } from '@/api/exhibit.js';
export default {
    props: ['confirm', 'copySection', 'menuCode'],
    emits: ['approveSn'],
    setup(props) {
        const { emit } = getCurrentInstance();
        const $Modal = inject('$Modal');
        const dayJS = inject('dayJS');
        const { goToPage, openModal } = useCommFunc();
        const store = useStore();
        const route = useRoute();
        const initColum = ref([
            {
                headerName: '선택',
                field: 'no',
                maxWidth: 80,
                valueGetter: 'node.rowIndex + 1',
                suppressSizetoFit: true
            },
            { headerName: '이름', field: 'admnNm' },
            { headerName: '아이디', field: 'admnId', maxWidth: 120 },
            { headerName: '이메일', field: 'admnEmadEncrVl', maxWidth: 150 }
        ]);
        const state = reactive({
            menuCode: computed(() => props.menuCode),
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
            mainApporvelist: [],
            pagesize: 10,
            searchlist: [
                { label: '선택', value: '' },
                { label: '이름', value: 'name' },
                { label: '아이디', value: 'id' }
            ]
        });
        const formData = reactive({
            cnSercSe: '',
            cnSercCts: ''
        });

        onMounted(() => {
            getMainSectionApproveUser();
        });

        // 페이징 처리
        const pager = reactive({
            current: 1,
            currentPageSize: 1,
            size: computed(() => state.pagesize),
            offset: computed(() => (pager.current - 1) * pager.size),
            totalCnt: 0
        });

        const onChangedPage = (pagenum) => {
            console.log(pagenum);
            pager.current = pagenum;
            //테이블 인덱스 번호 처리
            initColum.value[0].valueGetter = 'node.rowIndex + ' + Number(pager.size * (pager.current - 1) + 1);
            //api호출
            getMainSectionApproveUser();

        };


        // 승인자 목록
        const getMainSectionApproveUser = async () => {
            try {
                let params = {
                    size: pager.size,
                    offset: pager.offset,
                    cnSercSe: formData.cnSercSe,
                    cnSercCts: formData.cnSercCts
                };
                console.log(params);
                const response = await _getMainSectionApproveUser(state.menuCode, params);
                console.log(response);
                state.mainApporvelist = response.data.data.list;
                pager.totalCnt = response.data.data.totalCnt;
            } catch (error) {
                console.log(error);
            }
        };
        const onCellClicked = (e) => {
            console.log(e.data.admnSn);
            let params = e.data.admnSn;
            emit('onChangeApproveUser', params);
        };
        return {
            $Modal,
            dayJS,
            pager,
            state,
            formData,
            goToPage,
            openModal,
            onChangedPage,
            onCellClicked
        };
    }
};
</script>