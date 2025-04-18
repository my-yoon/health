<template>
    <div>
        <div class="ui-data-filter sm">
            <div class="form-item">
                <div class="item">
                    <label>검색대상</label>
                    <span class="input">
                    <span class="dv">
                        <span v-for="(item, index) in state.sendTargetList" :key="index" class="radio">
                            <input :id="'sendTargetSearch' + index" v-model="formData.sndnTrgTypCd" :value="item.value"
                                   disabled
                                   name="sendTargetSearch" type="radio">
                            <label :for="'sendTargetSearch' + index">{{ item.label }}</label>
                        </span>
                    </span>
                </span>
                </div>
                <div class="item">
                    <label>검색조건</label>
                    <span class="input">
                    <select v-model="formData.searchType" class="custom-select sm">
                        <option v-for="(item, index) in state.searchTypeList" :key="index"
                                :value="item.value">
                            {{ item.label }}
                        </option>
                    </select>
                    <span class="dv">
                        <input v-model="formData.searchText" class="form-control sm" type="text">
                    </span>
                </span>
                </div>
                <div class="btn-filter-set">
                    <button class="btn btn-sm" type="button" @click="reloadList"><span class="ico-search"></span>조회</button>
                    <button class="btn btn-sm" type="button" @click="clearList(1)">
                        <span class="ico-reload sg"></span>
                        <span class="offscreen">리로드</span>
                    </button>
                </div>
            </div>
        </div>
        <div class="ui-section">
            <div class="ui-title-3">
                <h3>회원 목록</h3>
            </div>
            <div class="ui-content">
                <div class="tbl-wrap">
                    <div class="table-util flex space-between">
                        <div class="btn-set-m flex">
                            <button :disabled="formData.mskgnRlsYn === 'N'" class="btn btn-ss" type="button" @click="maskingUnlock">마스킹해제</button>
                        </div>
                        <div class="btn-set-m flex align-end">
                            <span class="table-total">조회결과 총 <strong>{{ pager.totalCnt }}</strong>건</span>
                        </div>
                    </div>
                    <NoData v-if="state.targetList.length === 0" :nodatatext="'조회된 데이터가 없습니다.'"></NoData>
                    <div v-else>
                        <AgGridVue :columnDefs="state.tableColum_c" :defaultColDef="state.defaultColDef" :domLayout="'autoHeight'"
                                   :rowData="state.targetList"
                                   :suppressRowClickSelection="true" class="ag-theme-alpine" rowSelection="multiple" @grid-ready="onGridReady"
                                   @selection-changed="e=>onRowSelect(e)">
                        </AgGridVue>
                        <PageNavigation :cntPerPage='pager.size' :currentPage="pager.current" :itemCount='pager.totalCnt'
                                        @changedPage="onChangedPage"/>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import {getCurrentInstance, reactive, ref, onMounted, computed} from 'vue';
import {_getUserList} from '@/api/operate.js';

export default {
    props: ['sendTargetList', 'selectSndnTrgTypCd', 'channelName'],
    emits: ['update:modelValue'],
    setup(props) {
        const {emit} = getCurrentInstance();

        const state = reactive({
            tableColum_c: null,
            targetList: [],
            pagesize: 10,
            gridApi: null,
            gridColumApi: null,
            searchKeyword: '',
            domLayout: 'autoHeight',
            //테이블 옵션
            defaultColDef: {
                sortable: false,
                filter: false,
                resizable: true,
                flex: 1,
                headerClass: 'centered',
                cellClass: 'centered'
            },
            // 발송대상
            sendTargetList: computed(() => props.sendTargetList),
            sendTargetName: computed(() => state.sendTargetList.find(item => props.selectSndnTrgTypCd === item.value).label),
            tempTargetList: [],
            selectTargetList: []
        });

        const gridState = reactive({
            회원: {
                // 검색조건
                searchTypeList: [
                    {label: '선택', value: ''},
                    {label: '이름', value: 'mbrNm'},
                    {label: '아이디', value: 'mbrJnMthAcsId'},
                    {label: '회원순번', value: 'mbrSn'}
                ],
                initColumn: [
                    {
                        headerName: '선택',
                        maxWidth: 60,
                        field: 'select',
                        checkboxSelection: true
                    },
                    {headerName: '이름', field: 'mbrNm', flex: 1},
                    {headerName: '아이디', field: 'mbrJnMthAcsId', flex: 1},
                    {headerName: '휴대전화번호', field: 'mbrHhpno', flex: 1},
                    {headerName: 'SMS수신동의', field: 'infAgrmDtSmsText', flex: 1},
                    {headerName: 'PUSH수신동의', field: 'infAgrmDtCpmText', flex: 1}
                ]
            },
            // 정책 미설정 개발 보류
            그룹: {
                // 검색조건
                searchTypeList: [
                    {label: '선택', value: ''},
                    {label: '그룹명', value: '1'},
                    {label: '그룹설명', value: '2'}
                ],
                initColumn: [
                    {
                        headerName: '선택',
                        maxWidth: 60,
                        field: 'select',
                        checkboxSelection: true
                    },
                    {headerName: '그룹명', field: '그룹명', flex: 1},
                    {headerName: '그룹설명', field: '그룹설명', flex: 1},
                    {headerName: 'SMS수신동의수', field: 'SMS수신동의수', flex: 1},
                    {headerName: 'PUSH수신동의수', field: 'PUSH수신동의수', flex: 1}
                ]
            }
        });

        const formData = ref({
            searchType: '',  // 검색조건
            searchText: null,  // 검색내용
            sndnTrgTypCd: null,  // 발송대상 타입코드
            mskgnRlsYn: 'Y'
        });

        // 페이징 처리
        const pager = reactive({
            current: 1,
            currentPageSize: 1,
            size: computed(() => state.pagesize),
            offset: computed(() => (pager.current - 1) * pager.size),
            totalCnt: 0
        });

        const getUserList = async () => {
            try {
                let params = {
                    size: pager.size,
                    offset: pager.offset,
                    cnSercSe: formData.value.searchType,
                    cnSercCts: formData.value.searchText,
                    mskgnRlsYn: formData.value.mskgnRlsYn,
                    menuCode: '1001001'
                };

                if (props.channelName === 'SMS') params.infAgrmSmsYn = 'Y'

                if (props.channelName === 'PUSH') params.infAgrmCpmYn = 'Y'

                const response = await _getUserList(params);

                state.targetList = response.data.data.list.map(item => {
                    item.infAgrmDtSmsText = item.infAgrmDtSmsYn === 'Y' ? '동의' : '비동의';
                    item.infAgrmDtCpmText = item.infAgrmDtCpmYn === 'Y' ? '동의' : '비동의';
                    return item;
                });

                pager.totalCnt = response.data.data.totalCnt;

            } catch (error) {
                console.log(error);
            }
        };

        //페이징 처리
        const onChangedPage = async (num) => {
            pager.current = num;
            //api호출
            await getUserList();
            // 재선택
            await gridSelected(state.selectTargetList);
        };

        //grid selection
        const gridSelected = (targetNodes) => {
            console.log(targetNodes);
            let selected = [];
            state.gridApi.forEachNode(node => {
                if (targetNodes.find(item => item.mbrSn === node.data.mbrSn)) {
                    selected.push(node);
                }
            });
            state.gridApi.setNodesSelected({nodes: selected, newValue: true});
        };

        // 체크 박스 선택시
        const onRowSelect = () => {
            const rowlist = state.gridApi.getSelectedRows();
            // 선택한 사용자 저장
            state.selectTargetList = [...new Map([...state.selectTargetList, ...rowlist].map(item => [item.mbrSn, item])).values()];
            emit('update:modelValue', state.selectTargetList);
        };

        // 테이블 리사이징을 위한 참조값
        const onGridReady = (params) => {
            state.gridApi = params.api;
            state.gridColumApi = params.columnApi;
        };

        const clearList = (num) => {
            formData.value.searchType = ''; //공지검색구분
            formData.value.searchText = ''; //내용
            formData.value.page = num;

            onChangedPage(num);
        };

        const reloadList = () => {
            pager.current = 1;
            onChangedPage(pager.current);
        };

        const maskingUnlock = () => {
            formData.value.mskgnRlsYn = 'N';
            onChangedPage(pager.current);
        };

        onMounted(() => {
            formData.value.sndnTrgTypCd = props.selectSndnTrgTypCd;
            state.tableColum_c = gridState[state.sendTargetName].initColumn;
            state.searchTypeList = gridState[state.sendTargetName].searchTypeList;

            getUserList();
        });

        return {
            state,
            formData,
            pager,
            onChangedPage,
            onRowSelect,
            onGridReady,
            reloadList,
            clearList,
            maskingUnlock
        };
    }
};
</script>