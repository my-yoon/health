<template>
    <section class="ui-section">
        <!-- 검색 -->
        <div>
            <subTitleBar :subTitle="'건강뉴스 열람 현황'" />
            <div class="ui-content">
                <div class="tbl-wrap">
                    <NoData :nodatatext="'조회된 데이터가 없습니다.'" v-if="state.healthNewList.length === 0"></NoData>
                    <div v-else>
                        <AgGridVue :columnDefs="state.tableColum_c" :rowData="state.healthNewList"
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
import { _getViewNews } from '@/api/memberinfo.js';
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
                headerName: '구분',
                field: 'viewPathSectionCode',
                maxWidth: 180,
                valueGetter: (params) => {
                    if (params.data.viewPathSectionCode === '316001') {
                        return '건강뉴스';
                    } else if (params.data.viewPathSectionCode === '316002') {
                        return '함께 볼만한 뉴스';
                    } else if (params.data.viewPathSectionCode === '316003') {
                        return '챌린지';
                    }
                }
            },
            { headerName: '건강뉴스제목', field: 'title' },
            { headerName: '열람일자', field: 'viewDate', maxWidth: 150 },
            { headerName: '관심뉴스저장여부', field: 'interestYn', maxWidth: 150 }
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
            pagesize: 10,
            healthNewList: [],
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
            getViewNews();
        };
        onMounted(() => {
            state.memberNum = route.query.mbrSn;
            if (state.memberNum) {
                getViewNews();
            }

        });

        //리스트 조회
        const getViewNews = async () => {
            try {
                let params = {
                    memberSerialNumber: formData.memberSerialNumber,
                    size: pager.size,
                    offset: pager.offset
                };
                console.log(formData.memberSerialNumber);
                const response = await _getViewNews(params);
                // console.log(response.data);
                state.healthNewList = response.data.data.list;
                pager.totalCnt = response.data.data.totalCnt;
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