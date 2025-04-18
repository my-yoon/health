<template>
    <div>
        <DefaultModal :isShow="isEventclause" :modalTitle="'이벤트 약관 선택'" :buttonConfirm="''" :buttonCancel="'닫기'"
            :modalName="'isEventclause'" @modalclose="clauseModalControl">
            <template #modalcontent>
                <div>
                    <div class="ui-data-filter sm">
                        <div class="form-item">
                            <div class="item">
                                <label>필수 여부</label>
                                <span class="input">
                                    <span class="dv">
                                        <span class="radio" v-for="(item, index) in state.seEsnChcCdlist" :key="index">
                                            <input :id="'isEss' + index" name="isEssGroup" type="radio" :value="item.value"
                                                v-model="popupFormData.seEsnChcCd">
                                            <label :for="'isEss' + index">{{ item.label }}</label>
                                        </span>
                                    </span>
                                </span>
                            </div>
                            <div class="btn-filter-set">
                                <button type="button" class="btn btn-sm" @click="reloadList">
                                    <span class="ico-search"></span>검색
                                </button>
                            </div>
                        </div>
                        <div class="form-item">
                            <div class="item">
                                <label>약관명</label>
                                <span class="input">
                                    <span class="dv">
                                        <input type="text" class="form-control sm w-300" v-model="popupFormData.searchText">
                                    </span>
                                </span>
                            </div>
                        </div>
                    </div>
                    <div class="tbl-wrap">
                        <div class="table-util flex space-between">
                            <div></div>
                            <div class="btn-set-m flex align-end">
                                <span class="table-total">조회결과 총 <strong>{{ pager.totalCnt }}</strong>건</span>
                                <selectBox :selectType="'page'" @changedValue="selectedOptions_list" />
                            </div>
                        </div>
                        <NoData :nodatatext="'조회된 데이터가 없습니다.'" v-if="state.clauselist.length === 0"></NoData>
                        <div v-else>
                            <AgGridVue :columnDefs="state.tableColum_c" :rowData="state.clauselist"
                                :defaultColDef="state.defaultColDef" class="ag-theme-alpine" :domLayout="state.domLayout"
                                style="width:100%">
                            </AgGridVue>
                            <PageNavigation :cntPerPage='pager.size' :itemCount='pager.totalCnt'
                                :currentPage="pager.current" @changedPage="onChangedPage" />
                        </div>
                    </div>

                </div>
            </template>
        </DefaultModal>
    </div>
</template>
<script>
import { getCurrentInstance, computed, reactive, inject, ref, onMounted, watch } from 'vue';
import DefaultModal from '@/plugins/modal/modal/DefaultModal.vue';
import DateSerch from '@/components/ui/DateSerch.vue';
import DateSingle from '@/components/ui/DateSingle.vue';
import { useCommFunc } from '@/core/helper/common.js';
import { useStore } from 'vuex';
import { _getEventClause } from '@/api/event.js';
import { _uploadFile } from '@/api/common.js';
export default {
    components: { DefaultModal, DateSerch, DateSingle },
    props: ['isEventclause', 'formData', 'eventClusList', 'eventClusListTable', 'pointType'],
    emits: ['addCluse', 'onModalClose'],
    setup(props) {
        const internalInstance = getCurrentInstance();
        const $Modal = inject('$Modal');
        const dayJS = inject('dayJS');
        const { goToPage, fileDown, tableResize, openModal, isPartnerShow, isDownShow, isImgShow, isRequestShow } = useCommFunc();
        const store = useStore();
        const { emit } = getCurrentInstance();
        const initColum = ref([
            {
                headerName: '번호',
                field: 'no',
                maxWidth: 80,
                valueGetter: 'node.rowIndex + 1',
                suppressSizetoFit: true
            },
            { headerName: '필수 여부', field: 'seEsnChcCdNm', maxWidth: 90 },
            { headerName: '약관명', field: 'clusNm' },
            { headerName: '개정적용일시', field: 'dstrbDt', maxWidth: 120 },
            {
                headerName: '선택',
                field: 'adminName',
                cellRenderer: (params) => {
                    const tagString = `<button type="button" class="btn btn-ss" id=eventselect-${params.node.rowIndex}>선택</button>`;
                    const buttonTarget = document.createElement('div');
                    buttonTarget.innerHTML = tagString;
                    const buttonEventTarget = buttonTarget.querySelector(`#eventselect-${params.node.rowIndex}`);
                    buttonEventTarget.addEventListener('click', async () => {
                        await emit('addCluse', params.data);
                        await emit('onModalClose', 'close');

                    });
                    return buttonTarget;
                }
            }
        ]);
        const state = reactive({
            formData: computed(() => props.formData),
            isEventclause: computed(() => props.isEventclause),
            eventClusList: computed(() => props.eventClusList),
            eventClusListTable: computed(() => props.eventClusListTable),
            seEsnChcCdlist: [
                { label: '전체', value: '' },
                { label: '필수', value: '253001' },
                { label: '선택', value: '253002' }
            ],
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
            pagesize: 10,
            clauselist: [],
            Clause: []
        });
        watch(props, () => {
            if (props.isEventclause) {
                getEventClause();

            }
        });
        // 페이징 처리
        const pager = reactive({
            current: 1,
            currentPageSize: 1,
            size: computed(() => state.pagesize),
            offset: computed(() => (pager.current - 1) * pager.size),
            totalCnt: 0
        });
        //약관 폼 params
        const popupFormData = reactive({
            clusAgrmDomnCd: '', //약관동의영역코드
            seEsnChcCd: '', //구분필수
            searchType: 'clusNm', //조회조건
            searchText: '' //조회 조건 값
        });
        const onChangedPage = (pagenum) => {
            //console.log(pagenum);
            pager.current = pagenum;
            //테이블 인덱스 번호 처리
            initColum.value[0].valueGetter = 'node.rowIndex + ' + Number(pager.size * (pager.current - 1) + 1);
            //api호출
            getEventClause();
        };
        //검색조건에 따른 리스트 재조회
        const reloadList = () => {
            pager.current = 1;
            onChangedPage(pager.current);
        };
        //셀렉트박스 선택
        const selectedOptions_list = (value, type) => {
            if (type === 'page') {
                state.pagesize = value;
                clearList(1);
            }
        };
        //리스트 갯수 변경 후 리스트 재 조회
        const clearList = (num) => {
            popupFormData.seEsnChcCd = '';
            popupFormData.searchType = 'clusNm';
            popupFormData.searchText = '';
            onChangedPage(num);
        };
        //약관조회
        const getEventClause = async () => {
            try {
                let params = {
                    size: pager.size,
                    offset: pager.offset,
                    clusAgrmDomnCd: '285006',
                    seEsnChcCd: popupFormData.seEsnChcCd,
                    searchType: popupFormData.searchType,
                    searchText: popupFormData.searchText
                };
                const response = await _getEventClause(params);
                console.log(response);
                state.clauselist = response.data.data.list;
                pager.totalCnt = response.data.data.totalCnt;
            }
            catch (error) {
                console.log(error);
            }
        };

        //포인트 모달 컨트롤
        const clauseModalControl = (type, modalName) => {
            console.log(type, modalName);
            if (modalName === 'isEventclause') {
                if (type === 'modalclose' || type === 'modalcancel') {
                    emit('onModalClose', 'close');
                    clearList(1);
                }
            } else {
                emit('onModalClose', 'close');
                clearList(1);
            }
        };
        return {
            state,
            pager,
            onChangedPage,
            popupFormData,
            clauseModalControl,
            selectedOptions_list,
            reloadList
        };
    }
};
</script>