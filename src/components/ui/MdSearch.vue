<template>
    <subTitleBar :subTitle="'MD조회'" />
    <div class="ui-data-filter sm mt-10">
        <div class="form-item">
            <div class="item">
                <span class="input">

                    <span class="dv">
                        <select class="custom-select sm" v-model="formData.cnSercSe">
                            <option v-for="(item, index) in state.searchTypeList" :key="index" :value="item.value">
                                {{ item.label }}
                            </option>
                        </select>
                    </span>
                    <span class="dv">
                        <input v-model="formData.cnSercCts" class="form-control sm" type="text">
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
                <selectBox selectType="page" @changedValue="selectedOptions" />
            </div>
        </div>
    </div>
    <div class="tbl-wrap mt-10">
        <NoData v-if="state.mdList.length === 0" :nodatatext="'조회된 데이터가 없습니다.'"></NoData>
        <div v-else ref="agGrid">
            <AgGridVue :columnDefs="state.tableColum_c" :defaultColDef="state.defaultColDef" :domLayout="state.domLayout"
                :rowData="state.mdList" class="ag-theme-alpine" style="width:100%">
            </AgGridVue>
            <PageNavigation :cntPerPage='pager.size' :currentPage="pager.current" :itemCount='pager.totalCnt'
                @changedPage="onChangedPage" />
        </div>
    </div>
</template>
<script>
import { reactive, computed, ref, onMounted, getCurrentInstance } from 'vue';
import { _getMdUser } from '@/api/seller.js';

export default {
    props: ['admnSn'],
    emits: ['selectPartner', 'selectValue'],
    setup() {
        const { emit } = getCurrentInstance();
        const initColum = ref([
            { headerName: '번호', field: 'no', valueGetter: 'node.rowIndex + 1', maxWidth: 70 },
            { headerName: '담당자ID', field: 'admnId', flex: 1 },
            { headerName: '이름', field: 'admnNm', flex: 1 },
            { headerName: '휴대폰번호', field: 'admnHhpno', flex: 1 },
            { headerName: '권한레벨', field: 'admnLvlEngNm', flex: 1 },
            { headerName: '부서명', field: 'admnDepNm', flex: 1 },
            {
                headerName: '선택',
                field: 'select',
                maxWidth: 70,
                cellRenderer: (params) => {
                    const tagString = `<a id="mdselect-${params.node.rowIndex}">선택</a>`;
                    const buttonTarget = document.createElement('div');
                    buttonTarget.innerHTML = tagString;
                    const buttonEventTarget = buttonTarget.querySelector(`#mdselect-${params.node.rowIndex}`);
                    buttonEventTarget.addEventListener('click', () => {
                        console.log(params.data);
                        emit('selectValue', params.data);
                    });
                    return buttonTarget;
                }
            }
        ]);
        onMounted(() => {
            getMdUser();
        });
        const state = reactive({
            tableColum_c: _.clone(initColum.value),
            //테이블 옵션
            defaultColDef: {
                sortable: false,
                filter: false,
                resizable: true,
                flex: 1,
                headerClass: 'centered',
                cellClass: 'centered'
            },
            mdList: [],
            pagesize: 10,
            gridApi: null,
            gridColumApi: null,
            searchText: null,
            searchType: '',
            domLayout: 'autoHeight',
            // 검색조건
            searchTypeList: [
                { label: '전체', value: '' },
                { label: '이름', value: 'name' },
                { label: 'ID', value: 'id' }
            ]
        });
        // 페이징 처리
        const pager = reactive({
            current: 1,
            currentPageSize: 1,
            size: computed(() => state.pagesize),
            offset: computed(() => (pager.current - 1) * pager.size),
            totalCnt: 0
        });
        const formData = reactive({
            offset: pager.offset,
            size: pager.size,
            cnSercSe: '',
            cnSercCts: '',
            mskgnRlsYn: ''

        });
        const onChangedPage = (pagenum) => {
            pager.current = pagenum;
            getMdUser();
        };

        //셀렉트박스 선택
        const selectedOptions = (value, type) => {
            if (type === 'page') {
                state.pagesize = value;
                console.log(state.pagesize);
                clearList(1);


            }
        };
        //검색조건 초기화
        const clearList = (num) => {
            formData.cnSercSe = ''; //검색구분
            formData.cnSercCts = ''; //내용
            formData.mskgnRlsYn = ''; //내용
            onChangedPage(num);
        };
        //재조회
        const reloadList = () => {
            pager.current = 1;
            onChangedPage(pager.current);
        };
        //MD목록
        const getMdUser = async () => {
            try {
                let params = {
                    offset: pager.offset,
                    size: pager.size,
                    cnSercSe: formData.cnSercSe,
                    cnSercCts: formData.cnSercCts,
                    mskgnRlsYn: 'Y'
                };
                console.log('offset ====', pager.offset);
                const response = await _getMdUser(params);
                state.mdList = response.data.data.list;
                pager.totalCnt = response.data.data.totalCnt;

            } catch (error) {
                console.log(error);
            }
        };

        return {
            state,
            pager,
            formData,
            onChangedPage,
            selectedOptions,
            reloadList
        };
    }

};

</script>