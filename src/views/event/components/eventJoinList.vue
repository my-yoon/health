<template>
    <div>
        <div class="ui-panel-item">
            <div class="tbl-wrap">
                <div class="table-util flex space-between">
                    <div class="btn-set-m flex">
                        <button type="button" class="btn btn-ss" @click="actionBtns('draw')"
                            :disabled="!(state.eventBnefType == 'AFTER' && state.eventProgress == 'END') || state.confirmed == 'Y' || state.joinlist.length === 0">
                            당첨자 추첨
                        </button>
                        <button type="button" class="btn btn-ss"
                            :disabled="state.confirmed == 'Y' || state.eventpzwList.length == 0"
                            @click="actionBtns('confirm')">확정</button>
                        <button type="button" class="btn btn-ss" @click="changeMskgnRlsYn()"
                            :disabled="!state.mskgnRlsYn || state.mskgnTried">
                            마스킹해제
                        </button>
                    </div>
                    <div class="btn-set-m flex align-end">
                        <span class="table-total">조회결과 총 <strong>{{ pager.totalCnt }}</strong>건</span>
                        <button type="button" class="btn btn-opt"
                            @click="onChangeDownRol(menuInfo.auth5DownloadYn, formData.mskgnRlsYn, excelParams)">
                            <span class="ico-download"></span>파일다운로드
                        </button>
                        <selectBox :selectType="'page'" @changedValue="selectedOptions_list" />

                        <button type="button" class="btn btn-opt-ico fit" @click="tableResize">
                            <span class="offscreen">컬럼 리사이징</span>
                        </button>
                        <!-- 클래스 : full -->
                        <!-- 클래스 : close -->
                        <button type="button" class="btn btn-opt-ico filter" @click="resetTable">
                            <span class="offscreen">컬럼 셋팅</span>
                        </button>

                    </div>
                </div>
                <!-- {{ state.eventpzwList }} -->
                <div v-if="state.eventpzwList.length === 0">
                    <columlist :columlists="initColum" @checkColum="checkOptions" />
                    <NoData :nodatatext="'조회된 데이터가 없습니다.'" v-if="state.joinlist.length === 0"></NoData>
                    <div v-else>
                        <AgGridVue :columnDefs="state.tableColum_c" :rowData="state.joinlist"
                            :defaultColDef="state.defaultColDef" @cell-clicked="onCellClicked" class="ag-theme-alpine"
                            :domLayout="state.domLayout" style="width:100%">
                        </AgGridVue>
                        <PageNavigation :cntPerPage='pager.size' :itemCount='pager.totalCnt' :currentPage="pager.current"
                            @changedPage="onChangedPage" />
                    </div>
                </div>
                <div class="ui-dragdrop-menu full mt-10" v-if="state.eventpzwList.length > 0">
                    <ul class="ui-dragdrop-list bannerlist">
                        <li class="ui-dragdrop-item">
                            <div class="ui-dragdrop-item-display">
                                <span class="dv w-50">번호</span>
                                <span class="dv w-150">회원번호</span>
                                <span class="dv w-100">회원명</span>
                                <span class="dv w-150">휴대폰번호</span>
                                <span class="dv w-150">이메일</span>
                                <span class="dv w-150">응모일시</span>
                                <span class="dv w-100">상품명</span>
                                <span class="dv ">제세공과금 대상</span>
                                <span class="dv">당첨 등 수</span>
                            </div>
                        </li>
                        <li class="ui-dragdrop-item" v-for="(item, index) in state.eventpzwList" :key="index">
                            <div class="ui-dragdrop-item-display">
                                <span class="w-50">
                                    <span class="dv num" style="width:50px; margin-left:0">{{ index + 1 }}</span>
                                </span>
                                <span class="w-150" style="text-align:center;">
                                    <span class="dv ui-tag bc1" style="width:100px; display: inline-block;">
                                        {{ item.mbrSn }}
                                    </span>
                                </span>
                                <span class="dv w-100">{{ item.mbrNm }}</span>
                                <span class="dv w-150">{{ item.mbrHpNo }}</span>
                                <span class="dv w-150">{{ item.mbrEmail }}</span>
                                <span class="dv w-150">{{ item.eventJoinDate }}</span>
                                <span class="dv w-100">{{ item.productNm }}</span>
                                <span class="dv">
                                    <template v-if="item.productTaxYn === 'Y'"> 대상</template>
                                    <template v-if="item.productTaxYn === 'N'"> 대상아님</template>
                                </span>
                                <span class="dv">{{ item.rank }}</span>
                            </div>
                        </li>
                    </ul>
                </div>
            </div>
        </div>

    </div>
</template>
<style scope>
.ui-dragdrop-item-display span {
    display: inline-block;
    text-align: center;
    width: 80px;
    margin-left: 10px
}

.ui-dragdrop-item-display span>span {
    display: inline-block;
}
</style>
<script>
import { reactive, inject, ref, onMounted, computed, onUnmounted } from 'vue';
import DefaultModal from '@/plugins/modal/modal/DefaultModal.vue';
import { useCommFunc } from '@/core/helper/common.js';
import { authCommFunc } from '@/core/helper/authComm.js';
import { useStore } from 'vuex';
import { useRouter, useRoute } from 'vue-router';
import { _getEventJoinList, _getDrawList, _confirmPzwr } from '@/api/event.js';
export default {
    components: { DefaultModal },
    props: ['eventSn', 'eventBnefType', 'eventProgress', 'eventType'],
    setup(props) {
        const $Modal = inject('$Modal');
        const dayJS = inject('dayJS');
        const { goToPage, fileDown, pageReload } = useCommFunc();

        const store = useStore();
        const route = useRoute();
        const initColum = ref([
            {
                headerName: '번호',
                field: 'no',
                maxWidth: 80,
                valueGetter: 'node.rowIndex + 1',
                suppressSizetoFit: true
            },
            { headerName: '회원번호', field: 'mbrSn', Width: 350 },
            { headerName: '소속', field: '', width: 350 },
            { headerName: '이름', field: 'mbrNm', maxWidth: 120 },
            { headerName: '휴대폰번호', field: 'mbrHpNo', maxWidth: 150 },
            {
                headerName: '이메일주소',
                field: 'mbrEmail',
                maxWidth: 350
            },
            { headerName: '응모일시 ', field: 'eventJoinDate', maxWidth: 150 },
            {
                headerName: '순위',
                field: 'rank',
                maxWidth: 130
            },
            { headerName: '당첨상품 ', field: 'productNm', maxWidth: 150 }


        ]);
        /**
        * 권한은 스토어에서 가져옴 (권한여부는 메뉴리스트에서 가져온다)
        * store.state.getMenuItem.menuInfo
        * "auth1RegistYn": "Y/N",  등록
        * "auth2UpdateYn": "Y/N",  수정
        * "auth3DeleteYn": "Y/N",  삭제
        * "auth4ApproveYn": "Y/N", 승인
        * "auth5DownloadYn": "Y/N", 다운 
        * "auth6MaskingYn": "Y/N" 마스킹
        */
        const { onChangeMaskingRol, onChangeDownRol } = authCommFunc();
        const menuInfo = computed(() => store.state.getMenuItem.menuInfo);
        const state = reactive({
            joinlist: [],
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
            eventSn: '',
            pagesize: 10,
            confirmed: '',
            eventBnefType: computed(() => props.eventBnefType),
            eventProgress: computed(() => props.eventProgress),
            eventType: computed(() => props.eventType),
            modalMsg: '',
            eventpzwList: [],
            download: { pass: '', reason: '' },
            mskgnRlsYn: true,
            mskgnTried: false
        });


        const formData = reactive({
            mskgnRlsYn: computed(() => state.mskgnRlsYn ? 'Y' : 'N')
        });


        //마스킹 해제 처리 후 리스트 재조회 
        const onChangeMskgn = async () => {
            state.mskgnRlsYn = !state.mskgnRlsYn;
            await getJoinList();
            state.mskgnTried = true;
        };

        onMounted(() => {
            state.eventSn = route.query.eventSn;
            if (menuInfo.value.menuCode) {
                getJoinList();
            }
            //마스킹 권한 확인 후 리스트조회
            emitter.$on('onChangeMskgn', onChangeMskgn);
            console.log(state.eventSn);
        });
        // 마스킹 해제 이벤트 버스 해제
        onUnmounted(() => {
            emitter.$off('onChangeMskgn');
        });
        // 마스킹 권한 체크
        const changeMskgnRlsYn = async () => {
            if (!state.mskgnTried) {
                await onChangeMaskingRol(menuInfo.value.auth6MaskingYn);
            }
        };

        const actionBtns = async (type) => {
            if (type === 'draw') {
                state.modalMsg = '당첨자 추점을 하시겠습니까?';
            }
            if (type === 'confirm') {
                state.modalMsg = '당첨자 확정을 하시겠습니까?';
            }
            $Modal.confirm({
                title: '',
                message: state.modalMsg,

                buttonText: {
                    confirm: '확인',
                    cancel: '취소'
                }
            })
                .then(async (success) => {
                    console.log(success);
                    if (type === 'draw') {
                        await getDrawList();
                    }
                    if (type === 'confirm') {
                        await confirmPzwr();
                    }

                })
                .catch(error => {
                    console.log(error);
                });
        };



        // 엑셀용 함수
        const excelParams = reactive({
            params: {
                menuCode: computed(() => menuInfo.value.menuCode),
                eventSn: computed(() => state.eventSn),
                mskgnRlsYn: state.mskgnRlsYn ? 'Y' : 'N',
                downloadPass: state.download.pass,
                downloadReason: state.download.reason
            },
            url: '/common/api/v1/event/joinlist/excel'

        });
        //마스킹 해제
        const onChangeMsking = () => {
            if (state.mskgnRlsYn) {
                $Modal.confirm({
                    title: '',
                    message: '마스킹 해제 하시겠습니까?',

                    buttonText: {
                        confirm: '확인',
                        cancel: '취소'
                    }
                })
                    .then(async (success) => {
                        console.log(success);
                        state.mskgnRlsYn = false;
                        await getJoinList();

                    })
                    .catch(error => {
                        console.log(error);
                    });
            } else {
                state.mskgnRlsYn = true;
                getJoinList();
            }
        };
        //셀렉트박스 선택
        const selectedOptions_list = (value, type) => {
            if (type === 'page') {
                state.pagesize = value;
                clearList(1);
            }
        };
        // 삭제할 컬럼 선택
        const checkOptions = (value) => {
            state.filterCoulm = value;
        };
        // 컬럼 변경
        const resetTable = () => {
            const initColum = _.clone(tablelist_payermanage_label);
            state.tableColum_c = initColum.filter(item => !state.filterCoulm.includes(item.headerName));
            return state.filterCoulm;
        };
        // 페이징 처리
        const pager = reactive({
            current: 1,
            currentPageSize: 1,
            size: computed(() => state.pagesize),
            offset: computed(() => (pager.current - 1) * pager.size),
            totalCnt: 0
        });
        const onChangedPage = (pagenum) => {
            //console.log(pagenum);
            pager.current = pagenum;
            //테이블 인덱스 번호 처리
            initColum.value[0].valueGetter = 'node.rowIndex + ' + Number(pager.size * (pager.current - 1) + 1);
            //api호출
            getJoinList();
        };
        //참여내역 리스트
        const getJoinList = async () => {
            try {
                let num = state.eventSn;
                let params = {
                    size: pager.size,
                    offset: pager.offset,
                    mskgnRlsYn: state.mskgnRlsYn ? 'Y' : 'N'
                };
                console.log(num);
                const response = await _getEventJoinList(num, params);
                console.log(response);
                state.joinlist = response.data.data.list;
                pager.totalCnt = response.data.data.totalCount;
                state.confirmed = computed(() => response.data.data.confirmed);
                console.log(state.joinlist);
            } catch (error) {
                console.log(error);
            }
        };
        //당첨자 조회
        const getDrawList = async () => {
            try {
                let num = state.eventSn;
                console.log(num);
                const response = await _getDrawList(num);
                console.log(response);
                state.eventpzwList = response.data.data;
                console.log(state.eventpzwList);
            } catch (error) {
                console.log(error);
            }
        };
        //당첨자 확정
        const confirmPzwr = async () => {
            try {
                let params = [];
                params = state.eventpzwList.map((item, index) => {
                    return Object.fromEntries(
                        Object.entries(item).filter(([key]) => key === 'eventSn' || key === 'mbrSn' || key === 'eventPrdSn')
                    );
                });

                console.log(params);
                const response = await _confirmPzwr(params);
                console.log(response);
                pageReload();
            } catch (error) {
                console.log(error);
            }
        };

        return {
            //공통 사용
            $Modal,
            dayJS,
            goToPage,

            state,
            pager,
            initColum,
            excelParams,
            menuInfo,
            formData,
            selectedOptions_list,
            resetTable,
            checkOptions,
            actionBtns,
            onChangeMsking,
            changeMskgnRlsYn,
            onChangeDownRol

        };
    }
};
</script>