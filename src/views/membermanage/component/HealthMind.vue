<template>
    <section class="ui-section mt-20">
        <!-- 검색 -->
        <div>
            <subTitleBar :subTitle="'심리검사 이용 현황'" />
            <div class="ui-content">
                <div class="tbl-wrap">
                    <NoData :nodatatext="'조회된 데이터가 없습니다.'" v-if="state.memberMindList.length === 0"></NoData>
                    <div v-else>
                        <AgGridVue :columnDefs="state.tableColum_c" :rowData="state.memberMindList"
                            :defaultColDef="state.defaultColDef" class="ag-theme-alpine" :domLayout="state.domLayout"
                            style="width:100%">
                        </AgGridVue>
                        <PageNavigation :cntPerPage='pager.size' :itemCount='pager.totalCnt' :currentPage="pager.current"
                            @changedPage="onChangedPage" />
                    </div>
                </div>
            </div>
        </div>
    </section>
</template>
<script>
import { getCurrentInstance, computed, reactive, inject, onMounted, ref, watchEffect } from 'vue';
import DefaultModal from '@/plugins/modal/modal/DefaultModal.vue';
import DateSerch from '@/components/ui/DateSerch.vue';
import { useCommFunc } from '@/core/helper/common.js';
import { format } from 'date-fns';
import { useStore } from 'vuex';
import { useRouter, useRoute } from 'vue-router';
import { _getMemberMindInfo } from '@/api/memberinfo.js';
export default {
    components: { DefaultModal, DateSerch },
    props: ['memberNum'],
    setup(props) {
        const internalInstance = getCurrentInstance();
        const $Modal = inject('$Modal');
        const dayJS = inject('dayJS');
        const store = useStore();
        const route = useRoute();
        const dateSearch = ref(null);
        const { goToPage, fileDown, tableResize, openModal, isPartnerShow, isDownShow, isImgShow } = useCommFunc();
        const initColum = ref([
            {
                headerName: '번호',
                field: 'no',
                maxWidth: 80,
                valueGetter: 'node.rowIndex + 1',
                suppressSizetoFit: true
            },
            {
                headerName: '심리검사명',
                field: 'psychologicalTestName'
            },
            { headerName: '참여일자', field: 'participationDate', maxWidth: 250 },

            {
                headerName: '진행상태',
                field: 'progressStatus',
                maxWidth: 150,
                valueGetter: (params) => {
                    if (params.data.progressStatus === '243001') {
                        return '미진행';
                    } else if (params.data.progressStatus === '243002') {
                        return '진행중';
                    } else if (params.data.progressStatus === '243003') {
                        return '완료';
                    }
                }
            },
            { headerName: '이용횟수', field: 'serviceUseCount', maxWidth: 150 }
        ]);


        const state = reactive({
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
            memberAgreeList: [],
            pagesize: 10,
            memberMindList: [],
            memberNum: ''
        });
        const formData = reactive({
            memberSerialNumber: computed(() => state.memberNum)
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
            //console.log(pagenum);
            pager.current = pagenum;
            //테이블 인덱스 번호 처리
            initColum.value[0].valueGetter = 'node.rowIndex + ' + Number(pager.size * (pager.current - 1) + 1);
            //api호출
            getMemberMindInfo();
        };
        onMounted(() => {
            state.memberNum = route.query.mbrSn;
            getMemberMindInfo();
        });

        //리스트 조회
        const getMemberMindInfo = async () => {
            try {
                let params = {
                    size: pager.size,
                    offset: pager.offset,
                    memberSerialNumber: formData.memberSerialNumber
                };
                console.log(params);
                const response = await _getMemberMindInfo(params);
                console.log(response.data);
                state.memberMindList = response.data.data.psytstUstkPrstList;
                pager.totalCnt = response.data.data.psytstUstkPrstTotalCount;
            } catch (error) {
                console.log(error);
            }
        };

        return {
            //공통 사용
            $Modal,
            dayJS,
            goToPage,
            openModal,
            state,
            formData,
            initColum,
            pager,
            onChangedPage


        };
    }
};

</script>