<template>
    <section>
        <div class="ui-section">
            <div class="ui-content">
                <div class="tbl-wrap">
                    <table class="table reg">
                        <colgroup>
                            <col style="width: 160px;">
                            <col style="width: auto;">
                            <col style="width: 160px;">
                            <col style="width: auto;">
                        </colgroup>
                        <tbody>
                            <tr>
                                <th scope="row">카테고리</th>
                                <td>
                                    {{ state.rcmTagDetail.ctgrNm }}
                                </td>
                                <th scope="row">상태</th>
                                <td>
                                    {{ state.rcmTagDetail.rgtrOptpTyCdNm }}
                                </td>
                            </tr>

                        </tbody>
                    </table>
                </div>
            </div>
        </div>
        <div class="ui-section">
            <subTitleBar :subTitle="'인기 태그'" />
            <div class="ui-content">
                <div class="tbl-wrap">
                    <table class="table reg">
                        <colgroup>
                            <col style="width: 160px;">
                            <col style="width: auto;">
                            <col style="width: 160px;">
                            <col style="width: auto;">
                        </colgroup>
                        <tbody>
                            <tr>
                                <th scope="row">인기 태그명</th>
                                <td>
                                    {{ state.rcmTagDetail.tagPopHashTagNm }}
                                </td>
                                <th scope="row">사용 여부</th>
                                <td>
                                    <!-- {{ state.rcmTagDetail.tagPopUseYn }} -->
                                    <span class="input">
                                        <span class="dv">
                                            <span class="radio" v-for="(item, index) in state.tagPopUseType" :key="index">
                                                <input :id="'tagPopUseType' + index" name="tagPopUseType" type="radio" :value="item.value" v-model="state.tagPopUseYn">
                                                <label :for="'tagPopUseType' + index">{{ item.label }}</label>
                                            </span>
                                        </span>
                                    </span>
                                </td>
                            </tr>
                            <tr>
                                <th scope="row">집계 기간</th>
                                <td>
                                    <template v-if="state.rcmTagDetail.agrgTrBgnDt && state.rcmTagDetail.agrgTrEndDt">
                                        {{ dayJS(state.rcmTagDetail.agrgTrBgnDt).format('YYYY.MM.DD HH:mm:ss') }} ~
                                        {{ dayJS(state.rcmTagDetail.agrgTrEndDt).format('YYYY.MM.DD HH:mm:ss') }}
                                    </template>
                                </td>
                                <th scope="row">컨텐츠 수</th>
                                <td>
                                    {{ state.rcmTagDetail.tagPopCmnyCnt }}
                                </td>
                            </tr>

                        </tbody>
                    </table>
                </div>
            </div>
        </div>
        <div class="ui-section">
            <subTitleBar :subTitle="'추천 태그'" />
            <div class="ui-content">
                <div class="tbl-wrap">
                    <div class="table-util flex space-between">
                        <div class="btn-set-m flex">
                            <button type="button" class="btn btn-ss" @click="checkDel">삭제</button>
                        </div>
                        <div class="btn-set-m flex align-end">
                            <button type="button" class="btn btn-ss" @click="checkEdit('ADD')">추가</button>
                            <button type="button" class="btn btn-ss" @click="checkEdit('ORDER')">순서변경</button>
                        </div>
                    </div>
                    <NoData :nodatatext="'조회된 데이터가 없습니다.'" v-if="state.tagRcmList.length === 0"></NoData>
                    <div v-else>
                        <AgGridVue
                            :columnDefs="state.tableColum_c"
                            :defaultColDef="state.defaultColDef"
                            :rowData="state.tagRcmList"
                            :domLayout="'autoHeight'"
                            rowSelection="multiple"
                            class="ag-theme-alpine"
                            style="width:100%"
                            @grid-ready="onGridReady"
                            @selection-changed="onRowSelect"
                            @cell-clicked="onCellClicked"
                        />
                    </div>
                </div>
            </div>
        </div>

        <div class=" btn-bottom-set flex justify-center">
            <button class="btn btn-sl nega" type="button" @click="goToPage('/service/community/recommend')">
                취소
            </button>
            <button class="btn btn-sl posi" type="button" @click="checkEdit('SAVE')">
                저장
            </button>
        </div>


        <!-- 추천태그추가 -->
        <DefaultModal :isShow="isShowTag" :modalName="'isShowTag'" :modalTitle="'추천 태그 추가'" :buttonCancel="'닫기'" :className="'full'" @modalclose="modalControl">
            <template #modalcontent>
                <div>
                    <div class="ui-data-filter sm mt-10">
                        <div class="form-item">
                            <div class="form-item">
                                <div class="item">
                                    <label>태그 생성자</label>
                                    <span class="input">
                                        <span class="dv">
                                            <select class="custom-select" v-model="state.searchOptionsTag.rgtrTyCd">
                                                <option :value="item.value" v-for="( item, index ) in  state.tagRgtrType" :key="index">
                                                    {{ item.label }}
                                                </option>
                                            </select>
                                        </span>
                                    </span>
                                </div>
                                <div class="item">
                                    <label>태그명</label>
                                    <span class="input">
                                        <span class="dv">
                                            <input type="text" class="form-control" v-model="state.searchOptionsTag.searchText">
                                        </span>
                                    </span>
                                </div>

                            </div>
                            <div class="btn-filter-set">
                                <button type="button" class="btn btn-sm" @click="reloadList"><span
                                        class="ico-search"></span>조회
                                </button>
                            </div>
                        </div>
                    </div>
                    <div class="tbl-wrap">
                        <div class="table-util flex space-between">
                            <div class="btn-set-m flex"></div>
                            <div class="btn-set-m flex align-end">
                                <span class="table-total">조회결과 총 <strong>{{ tagPager.totalCnt }}</strong>건</span>
                            </div>
                        </div>
                        <NoData :nodatatext="'조회된 데이터가 없습니다.'" v-if="state.tagList.length == 0"></NoData>
                        <div v-else>
                            <AgGridVue
                                :columnDefs="state.tableColum_t"
                                :rowData="state.tagList"
                                :defaultColDef="state.defaultColDef"
                                :domLayout="'autoHeight'"
                                class="ag-theme-alpine"
                                style="width:100%"
                            />
                            <PageNavigation :cntPerPage='tagPager.size' :itemCount='tagPager.totalCnt' :currentPage="tagPager.current" @changedPage="onChangedPageTag" />
                        </div>
                    </div>
                </div>
            </template>
        </DefaultModal>

        <DefaultModal :isShow="isShowOrder" :modalName="'isShowOrder'" :modalTitle="'순서변경'" :buttonCancel="'확인'" @modalclose="modalControl">
            <template #modalcontent>
                <div class="ui-dragdrop-menu">
                    <draggable v-model="state.tagRcmList" tag="ul" item-key="id" class="ui-dragdrop-list">
                        <template v-slot:item="{ item }">
                            <li class="ui-dragdrop-item">
                                <span>{{ item.tagRcmHashTagNm }}</span>
                                <!-- <button type="button" class="del" @click="onChangeDel(item)"><span class="offscreen">삭제</span></button> -->
                            </li>
                        </template>
                    </draggable>
                </div>
            </template>
        </DefaultModal>
        

    </section>
</template>

<script>
import { computed, reactive, inject, onMounted, onUnmounted, ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import { useCommFunc } from '@/core/helper/common.js';
import { authCommFunc } from '@/core/helper/authComm.js';
import { useStore } from 'vuex';

import DefaultModal from '@/plugins/modal/modal/DefaultModal.vue';

import { _getCommunityRecommendDetail, _getCommunityRecommend, _getCommunityRcmTag, _getCommunityTagSave } from '@/api/service.js';

export default {
    components: { DefaultModal },
    setup() {
        const $Modal = inject('$Modal');
        const route = useRoute();
        const store = useStore();
        const dayJS = inject('dayJS');

        const isShowTag = ref(false); // 태그 추가
        const isShowOrder = ref(false); // 순서변경
        
        const { goToPage, tableResize } = useCommFunc();
        const { onChangeEditRol, onChangeDelRol } = authCommFunc();
        const menuInfo = computed(() => store.state.getMenuItem.menuInfo);
        
        const initColum = ref([
            {
                headerName: '선택',
                field: 'select',
                maxWidth: 50,
                checkboxSelection: true,
                headerCheckboxSelection: true
            },
            { headerName: '순서', field: 'tagRcmSrtSqn', maxWidth: 80 },
            { headerName: '추천 태그', field: 'tagRcmHashTagNm' },
            { headerName: '컨텐츠 수', field: 'ctgrCmnyCnt' }
        ]);
        const initColum_t = ref([
            { headerName: '번호', field: 'no', maxWidth: 80, valueGetter: 'node.rowIndex + 1' },
            { headerName: '태그명', field: 'hashTagNm' },
            { headerName: '전체', field: 'allCmnyCnt' },
            { headerName: '카테고리 소속', field: 'ctgrCmnyCnt' },
            {
                headerName: '선택',
                maxWidth: 90,
                cellRenderer: (params) => {
                    const tagString = `<button type="button" class="btn btn-ss" id="memberselect-${params.node.rowIndex}">선택</button>`;
                    const buttonTarget = document.createElement('div');
                    buttonTarget.innerHTML = tagString;
                    const buttonEventTarget = buttonTarget.querySelector(`#memberselect-${params.node.rowIndex}`);
                    buttonEventTarget.addEventListener('click', () => {
                        console.log('select', state.tagRcmList, params.data);
                        const item = params.data;
                        if (state.tagRcmList.length > 6) {
                            isShowTag.value = false;
                            $Modal.confirm({
                                message: '추천 태그는 최대 7개까지 설정 가능합니다.',
                                buttonText: {
                                    confirm: '확인'
                                }
                            })
                                .then(success => {
                                    console.log(success);
                                    isShowTag.value = true;
                                })
                                .catch(error => {
                                    console.log(error);
                                });
                        } else {
                            const addItem = {
                                ctgrCmnyCnt: params.data.ctgrCmnyCnt,
                                tagRcmHashTagNm: params.data.hashTagNm,
                                tagRcmSn: 0, // 0이면 신규
                                tagRcmSrtSqn: state.tagRcmList.length + 1, // order
                                tagRcmTagMngSn: params.data.tagMngSn
                                // tagRcmDelYn: "N"
                            };
                            
                            const hasItem = state.tagRcmList.filter(d => d.tagRcmTagMngSn === addItem.tagRcmTagMngSn);
                            const deletedItem = state.deletedTag;
                            if (hasItem.length > 0) {
                                isShowTag.value = false;
                                $Modal.confirm({
                                    message: '존재하는 추천 태그 입니다.',
                                    buttonText: {
                                        confirm: '확인'
                                    }
                                })
                                    .then(success => {
                                        console.log(success);
                                        isShowTag.value = true;
                                    })
                                    .catch(error => {
                                        console.log(error);
                                    });
                            } else if (state.deletedTag.some(d => d.tagRcmTagMngSn === addItem.tagRcmTagMngSn)) { // 추가 되는 항목이 삭제한 항목일 경우 ( tagRcmSn )
                                //
                                const _index = state.deletedTag.indexOf(d => d.tagRcmTagMngSn === addItem.tagRcmTagMngSn);
                                addItem.tagRcmSn = state.deletedTag[_index].tagRcmSn;
                                state.deletedTag.splice(_index, 1);
                                
                                const list = [...state.tagRcmList, addItem];
                                state.tagRcmList = list;
                            } else {
                                const list = [...state.tagRcmList, addItem];
                                state.tagRcmList = list;
                                // orderTagRcmList();
                            }
                        }
                    });
                    return buttonTarget;
                }
            }
        ]);

        const state = reactive({
            tableColum_c: _.clone(initColum.value),
            tableColum_t: _.clone(initColum_t.value),
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
            
            rcmTagDetail: {},
            tagRcmList: [], // 추천태그 목록
            tagList: [], // 추천태그 추가 할 목록 ( POPUP )
            selectedTag: [], // 추천태그 체크 항목
            deletedTag: [], // 추천태그 삭제 항목 ( 다시 추가될 경우 Sn 필요 )

            tagPopUseType: [
                { label: '사용', value: 'Y' },
                { label: '사용 안함', value: 'N' }
            ],
            tagRgtrType: [ // 태그 생성자
                { label: '전체', value: '' },
                { label: 'Admin', value: '377001' },
                { label: '사용자', value: '377002' }
            ],

            tagPopUseYn: 'Y',
            checkEditType: '', // ADD: 추가, ORDER: 순서변경, SAVE: 저장

            searchOptionsTag: {
                // size: 10,
                // offset: 0,
                ctgrMngSn: route.query.ctgrMngSn,
                tagPopTagMngSn: 0,
                searchType: 'tagNm',
                searchText: '',
                rgtrTyCd: ''
                // page: 0
            },

            pagesize: 10

        });

        /**
         * @pager
         */
        const pager = reactive({
            current: 1,
            currentPageSize: 1,
            size: computed(() => state.pagesize),
            offset: computed(() => (pager.current - 1) * pager.size),
            totalCnt: 0
        });
        const tagPager = reactive({
            current: 1,
            currentPageSize: 1,
            size: computed(() => state.pagesize),
            offset: computed(() => (tagPager.current - 1) * tagPager.size),
            totalCnt: 0
        });

        watch(state.formData, () => {
            resetState();
        });

        onMounted(() => {
            getCommunityRecommendDetail();

            emitter.$on('onChangeEdit', onChangeEdit);
            emitter.$on('onChangeDel', onChangeDel);
        });

        onUnmounted(() => {
            emitter.$off('onChangeEdit');
            emitter.$off('onChangeDel');
        });

        /**
         * 수정 권한 체크
         */
        const checkEdit = async (type) => {
            state.checkEditType = type;
            // console.log(state.checkEditType);
            await onChangeEditRol(menuInfo.value.auth2UpdateYn);
        };

        /**
         * 수정 권한 체크 callback
         */
        const onChangeEdit = () => {
            // actionBtns(state.pageType);
            // openCategoryModal('edit');
            if (state.checkEditType === 'ADD') { // 추가
                console.log(state.checkEditType);
                isShowTag.value = true;
                getCommunityRcmTag();
            } else if (state.checkEditType === 'ORDER') {
                //
                isShowOrder.value = true;
            } else if (state.checkEditType === 'SAVE') { // 저장
                //
                console.log('save');
                saveTagRcm();
            }
        };

        /**
         * 삭제 권한 체크
         */
        const checkDel = async () => {
            console.log('checkDel');
            await onChangeDelRol(menuInfo.value.auth3DeleteYn);
        };

        /**
         * 삭제 권한 체크 callback
         */
        const onChangeDel = () => {
            console.log('onChangeDel');
            if (state.selectedTag.length > 0) {
                // console.log(state.tagRcmList.filter(d => !state.selectedTag.some(v => v.tagRcmTagMngSn === d.tagRcmTagMngSn)));
                state.deletedTag = [...state.deletedTag, ...state.selectedTag.filter(d => d.tagRcmSn)];
                state.tagRcmList = state.tagRcmList.filter(d => !state.selectedTag.some(v => v.tagRcmTagMngSn === d.tagRcmTagMngSn));

                orderTagRcmList();
                console.log(state.tagRcmList);
                
            } else {
                $Modal.confirm({
                    message: '삭제할 태그를 선택해주세요.',
                    buttonText: {
                        confirm: '확인'
                    }
                })
                    .then(success => {
                        console.log(success);
                    })
                    .catch(error => {
                        console.log(error);
                    });
            }
        };

        /**
         * @order
         * state.tagRcmList 추천태그 ordering
         */
        const orderTagRcmList = () => {
            state.tagRcmList = state.tagRcmList.map((d, i) => {
                return {
                    ...d,
                    tagRcmSrtSqn: i + 1
                };
            });
        };

        /**
         * @save
         */
        const saveTagRcm = async () => {
            try {
                const params = {
                    ctgrMngSn: route.query.ctgrMngSn,
                    tagPopSn: state.rcmTagDetail.tagPopSn,
                    tagPopUseYn: state.tagPopUseYn,
                    tagRcmList: [
                        ...state.tagRcmList.map(d => {
                            return {
                                // ...d,
                                tagRcmSn: d.tagRcmSn,
                                tagRcmTagMngSn: d.tagRcmTagMngSn,
                                tagRcmSrtSqn: d.tagRcmSrtSqn,
                                tagRcmDelYn: 'N'
                            };
                        }),
                        ...state.deletedTag.map(d => {
                            return {
                                tagRcmSn: d.tagRcmSn,
                                tagRcmTagMngSn: d.tagRcmTagMngSn,
                                tagRcmSrtSqn: d.tagRcmSrtSqn,
                                tagRcmDelYn: 'Y'
                            };
                        })
                    ]
                };
                console.log(params);
                const response = await _getCommunityTagSave(params);
                if (response.data.code === 'OK') {
                    toast('저장되었습니다', 2000, 'success');
                    getCommunityRecommendDetail();
                    state.deletedTag = [];
                }
            } catch (error) {
                console.log(error);
            }
        };

        /**
         * community - 추천태그 상세 조회
         */
        const getCommunityRecommendDetail = async () => {
            try {
                const params = {
                    ctgrMngSn: route.query.ctgrMngSn
                };
                const response = await _getCommunityRecommendDetail(params);
                if (response.data.code === 'OK') {
                    state.rcmTagDetail = response.data.data;
                    state.tagRcmList = response.data.data.tagRcmList;

                    // 인기 태그 사용 여부
                    state.tagPopUseYn = state.rcmTagDetail.tagPopUseYn;
                }
            } catch (error) {
                console.log(error);
            }
        };

        /**
         * community - 추천태그 추가 태그 목록 조회
         */
        const getCommunityRcmTag = async () => {
            try {
                const params = {
                    ...state.searchOptionsTag,
                    size: tagPager.size,
                    offset: tagPager.offset
                };
                const response = await _getCommunityRcmTag(params);
                if (response.data.code === 'OK') {
                    state.tagList = response.data.data.list;
                    tagPager.totalCnt = response.data.data.totalCnt;
                }
            } catch (error) {
                console.log(error);
            }
        };
        
        // 테이블 리사이징을 위한 참조값
        const onGridReady = (params) => {
            state.gridApi = params.api;
            state.gridColumApi = params.columnApi;
        };

        //셀렉트박스 선택
        const selectedOptions = (value, type) => {
            console.log(value, type);
            if (type === 'page') {
                state.pagesize = value;
                clearList(1);
            }
        };

        /**
         * rowSelect 수정
         * @onRowSelect
         */
        const onRowSelect = (e) => {
            // 삭제 목록
            state.selectedTag = state.gridApi.getSelectedRows();
            console.log('rowSelected', state.selectedTag);
        };

        //페이징 처리 
        const onChangedPageTag = (num) => {
            tagPager.current = num;
            //테이블 인덱스 번호 처리
            initColum_t.value[0].valueGetter = 'node.rowIndex + ' + Number(tagPager.size * (tagPager.current - 1) + 1);
            //api호출
            getCommunityRcmTag();
        };

        // 팝업 닫기
        const modalControl = (type, modalName) => {
            console.log(type);
            if (modalName === 'isShowTag') {
                isShowTag.value = false;
            } else if (modalName === 'isShowOrder') {
                isShowOrder.value = false;
                orderTagRcmList();
                // if (type === 'modalconfirm') {
                //     orderTagRcmList();
                // }
            }
        };

        return {
            //공통 사용
            $Modal,
            dayJS,

            isShowTag,
            isShowOrder,
            
            state,
            pager,
            tagPager,
            goToPage,
            initColum,
            onGridReady,
            onRowSelect,
            selectedOptions,
            modalControl,
            onChangedPageTag,

            checkEdit,
            checkDel
        };
    }
};
</script>