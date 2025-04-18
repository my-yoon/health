<template>
    <DefaultModal :isShow="true" :className="'full'" :modalTitle="'회원조회'" :buttonCancel="'취소'" :buttonConfirm="'등록'" @modalclose="closeModal">
        <template #modalcontent>
            <div class="ui-section">
                <div class="ui-title-3">
                    <h3>회원 목록</h3>
                </div>
                <div class="ui-content">
                    <div class="ui-data-filter sm">
                        <div class="form-item">
                            <div class="item">
                                <label>조회조건</label>
                                <span class="input">
                                    <span class="dv">
                                        <CommonBtn :val="searchData.cnSercSe" :type="'cnSercSe'"
                                            @changedValue="(value) => searchData.cnSercSe = value" :className="'custom-select sm'" />
                                        <span class="dv">
                                            <input type="text" class="form-control sm" v-model="searchData.cnSercCts" @keyup="enterToSearch">
                                        </span>
                                    </span>
                                </span>
                            </div>
                            <div class="item">
                                <label>성별</label>
                                <span class="input">
                                    <span class="dv">
                                        <CommonBtn :init="'전체'" :grCdId="'109000'" :val="searchData.mbrSexCd"
                                            @changedValue="(value) => searchData.mbrSexCd = value" :className="'custom-select sm'" />
                                    </span>
                                </span>
                            </div>
                            <div class="btn-filter-set">
                                <button type="button" class="btn btn-sm" @click="onChangedPage(1,'search')"><span class="ico-search"></span>조회</button>
                            </div>
                        </div>
                        <div class="form-item">
                            <div class="item">
                                <label>연령대</label>
                                <span class="input">
                                    <span class="dv">
                                        <CommonBtn :init="'전체'" :grCdId="'283000'" :val="searchData.aggpCd"
                                            @changedValue="(value) => searchData.aggpCd = value" :className="'custom-select sm'" />
                                    </span>
                                </span>
                            </div>
                            <div class="item">
                                <dateSerch :dateTitle="'가입일자'" @onSelectDate="onSelectPicker" :setDay="state.setDay" :pickerOnly="true"/>
                            </div>
                        </div>
                    </div>
                    <div class="tbl-wrap" style="min-height: 350px;">
                        <div class="table-util flex space-between">
                            <div class="btn-set-m flex">
                                <button type="button" class="btn btn-ss" :disabled="!state.mskgnRlsYn"
                                    @click="changeMskgnRlsYn(!state.mskgnRlsYn)">
                                    <template v-if="state.mskgnRlsYn">마스킹해제</template>
                                    <template v-else>마스킹</template>
                                </button>
                            </div>
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
import { getCurrentInstance, computed, reactive, onMounted, inject, onUnmounted } from 'vue';
import DateSerch from '@/components/ui/DateSerch.vue';
import { _getMnlIssUser } from '@/api/pntmng.js';
import { tablelist_userInfoPop_label } from '@/data/table/pntmngtable.js';
import { dmCommFunc } from '@/views/pntmng/common/common.js';
import CommonBtn from '@/views/pntmng/component/CommonBtn.vue';
import DefaultModal from '@/plugins/modal/modal/DefaultModal.vue';
import { authCommFunc } from '@/core/helper/authComm.js';

export default {
    props: ['menuCode', 'auth6MaskingYn'],
    emits: ['modalPlcyclose'],
    components: { DateSerch, CommonBtn, DefaultModal },
    setup(props) {
        const { emit } = getCurrentInstance();
        const { modal } = dmCommFunc();
        const dayJS = inject('dayJS');
        const { onChangeMaskingRol } = authCommFunc();
        const state = reactive({
            setDay: {
                from: new Date().getTime() - 3600 * 1000 * 24 * 30,
                to: new Date()
            },
            tableColum_c: _.clone(tablelist_userInfoPop_label),
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
            menuCode: computed(() => props.menuCode),
            auth6MaskingYn: computed(() => props.auth6MaskingYn),
            mskgnRlsYn: true
        });

        const searchData = reactive({
            inqType: 'jnDate',
            bgnDate: new Date().getTime() - 3600 * 1000 * 24 * 30,
            endDate: new Date(),
            mbrStCd: '104001',
            aggpCd: '',
            mbrSexCd: '',
            cnSercSe: '',
            cnSercCts: '',
            mskgnRlsYn: computed(() => state.mskgnRlsYn ? 'Y' : 'N'),
            menuCode: state.menuCode,
            size: computed(() => pager.size),
            offset: computed(() => pager.offset)
        });

        const pager = reactive({
            current: 1,
            currentPageSize: 0,
            size: 8,
            offset: computed(() => (pager.current - 1) * pager.size),
            totalCnt: 0
        });

        onMounted(() => {
            getMnlIssUser();
            //마스킹 권한 확인 후 리스트조회
            emitter.$on('onChangeMskgn', onChangeMskgn);
        });

        // 마스킹 해제 이벤트 버스 해제
        onUnmounted(() => {
            emitter.$off('onChangeMskgn');
        });

        const reqData = () => {
            let check = false;
            let params = {
                ...searchData,
                bgnDate: dayJS(searchData.bgnDate).format('YYYY-MM-DD'),
                endDate: dayJS(searchData.endDate).format('YYYY-MM-DD')
            };

            if (params.bgnDate > params.endDate) {
                modal('가입 종료일이 시작일보다 이전일 수 없습니다. 다시 입력하세요.');
                check = true;
            }

            return {params, check};
        };

        // 마스킹 권한 체크
        const changeMskgnRlsYn = async () => {
            await onChangeMaskingRol(state.auth6MaskingYn);
        };

        const getMnlIssUser = async () => {
            try {
                let {params, check} = await reqData();
                if (check) return;
                const response = await _getMnlIssUser(params);
                if (response.code == 'OK') {
                    state.rowData = response.data.list;
                    pager.totalCnt = parseInt(response.data.totalCnt);
                } else {
                    modal(response.message);
                }
            } catch (error) {
                modal(error);
            }
        };

        // 데이터 피커 날짜 검색
        const onSelectPicker = (type, value, status) => {
            if (type === 'day') {
                searchData.bgnDate = dayJS(value[0]).format('YYYYMMDD');
                searchData.endDate = dayJS(value[1]).format('YYYYMMDD');
            }
            if (type === 'self_start') {
                searchData.bgnDate = dayJS(value).format('YYYYMMDD');
            }
            if (type === 'self_end') {
                searchData.endDate = dayJS(value).format('YYYYMMDD');
            }
        };

        const closeModal = (type, Name) => {
            emit('modalPlcyclose', type, state.selectList);
        };

        // 테이블 리사이징을 위한 참조값
        const onGridReady = (params) => {
            state.gridApi = params.api;
            state.gridColumApi = params.columnApi;
        };

        // 페이징 처리
        const onChangedPage = (num, type) => {
            state.selectList = [];
            pager.current = num;
            if (type == 'search') state.mskgnRlsYn = true;
            getMnlIssUser();
        };


        // 체크 박스 선택시 
        const onRowSelect = (e) => {
            state.selectList = state.gridApi.getSelectedRows();
        };
        
        const enterToSearch = (e) => {
            if (e.keyCode === 13) onChangedPage(1);
        };

         //마스킹 해제 토글
        const onChangeMskgn = () => {
            state.mskgnRlsYn = !state.mskgnRlsYn;
            onChangedPage(pager.current);
        };

        return {
            state,
            searchData,
            pager,
            onChangedPage,
            onSelectPicker,
            onGridReady,
            getMnlIssUser,
            closeModal,
            onRowSelect,
            enterToSearch,
            onChangeMskgn,
            changeMskgnRlsYn
        };
    }
};
</script>