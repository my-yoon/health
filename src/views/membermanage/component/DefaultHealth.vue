<template>
    <section>
        <div class="ui-data-filter">
            <div class="form-item">
                <dateSerch :dateTitle="'기간조회'" @onSelectDate="onSelectPicker" :pickerOnly="false" :setDay="state.setDay"
                    ref="dateSearch" />
                <div class="btn-filter-set">
                    <button type="button" class="btn btn-sm" @click="reloadList"><span class="ico-search"></span>조회
                    </button>
                    <button type="button" class="btn btn-sm" @click="onInitDate">
                        <span class="ico-reload sg"></span>
                        <span class="offscreen">리로드</span>
                    </button>
                </div>
            </div>
        </div>
        <!-- 검색 -->
        <div class="ui-section">
            <div class="ui-content">
                <div class="tbl-wrap">
                    <div class="table-util flex space-between">
                        <div>
                            서비스 이용 현황 집계: {{ state.startDay }} ~ {{ state.endDay }} |
                            <strong>{{ pager.totalCnt }}</strong>건
                        </div>
                        <div class="btn-set-m flex align-end">
                            <button type="button" class="btn btn-opt" :disabled="state.defaultHealthList.length === 0"
                                @click="onChangeDownRol(state.menuInfo.auth5DownloadYn, 'Y', exelParams)">
                                <span class="ico-download"></span>파일다운로드
                            </button>
                            <selectBox :selectType="'page'" @changedValue="selectedOptions_list"
                                :disabled="state.defaultHealthList.length === 0" />

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
                    <NoData :nodatatext="'조회된 데이터가 없습니다.'" v-if="state.defaultHealthList.length === 0"></NoData>
                    <div v-else>
                        <AgGridVue :columnDefs="state.tableColum_c" :rowData="state.defaultHealthList"
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
import { authCommFunc } from '@/core/helper/authComm.js';
import { format } from 'date-fns';
import { useStore } from 'vuex';
import { useRouter, useRoute } from 'vue-router';
import { _getDefaultHealth } from '@/api/memberinfo.js';

export default {
    props: ['memberNum', 'menuInfo'],
    components: { DefaultModal, DateSerch },
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
                headerName: '건강검진일',
                field: 'healthMedicalExaminationDt',
                maxWidth: 150
            },
            { headerName: '판정', field: 'judgement', maxWidth: 150 },
            { headerName: '문진정보', field: 'medicalExaminationInformation', maxWidth: 150 },

            { headerName: 'BMI(kg/m2)', field: 'bmi' },
            { headerName: '혈압-수축(mmHg)', field: 'systolicBloodPressure' },
            { headerName: '혈압-이완(mmHg)', field: 'diastolicBloodPressure' },
            { headerName: '공복혈당(mg/dl)', field: 'fastingGlucose' },
            { headerName: '총콜레스테롤(mg/dl)', field: 'totolCholesterol' }
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
        const { onChangeDownRol } = authCommFunc();

        const state = reactive({
            memberNum: '',
            menuCode: computed(() => props.menuInfo.menuCode),
            menuInfo: computed(() => props.menuInfo),
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
            defaultHealthList: [],
            pagesize: 10,
            setDay: '1month',
            startDay: '',
            endDay: ''

        });
        const formData = reactive({
            mbrSn: computed(() => state.memberNum),
            menuCode: computed(() => state.menuCode),
            bgnDate: computed(() => state.startDay),
            endDate: computed(() => state.endDay)

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
        };
        // 데이터 피커 날짜 검색
        const onSelectPicker = (type, value, status) => {
            // 버튼으로 선택된 기준
            if (type === 'day') {
                state.startDay = value[0];
                state.endDay = value[1];

            } else if (type === 'self_end' || type === 'self_start') {
                // 직접 데이터 피커 설정
                if (type === 'self_start') {
                    state.startDay = value;
                } else if (type === 'self_end') {
                    state.endDay = value;
                }
            }
            //api호출
            console.log('선택일:' + value, '선택된 버튼:' + type, '조회기준:' + status, dayJS(formData.from).format('MM-DD'));
        };
        onMounted(() => {
            state.memberNum = route.query.mbrSn;
            if (state.memberNum) {
                getDefaultHealth();
            }

        });

        //리스트 조회
        const getDefaultHealth = async () => {
            try {
                let params = {
                    size: pager.size,
                    offset: pager.offset,
                    mbrSn: formData.mbrSn,
                    menuCode: formData.menuCode,
                    bgnDate: formData.bgnDate,
                    endDate: formData.endDate
                };
                const response = await _getDefaultHealth(params);
                console.log(response.data);
                state.defaultHealthList = response.data.data.list;
                pager.totalCnt = response.data.data.totalCnt;
            } catch (error) {
                console.log(error);
            }
        };
        // 엑셀용 함수
        const exelParams = reactive({
            params: {
                mbrSn: computed(() => formData.mbrSn),
                menuCode: computed(() => formData.menuCode),
                bgnDate: computed(() => formData.menuCode),
                endDate: computed(() => formData.menuCode)
            },
            url: '/common/api/v1/user/getGeneralHealthMedicalExaminationResultList'

        });
        //검색조건에 따른 리스트 재조회
        const reloadList = () => {
            pager.current = 1;
            state.mskgnRlsYn = true;
            onChangedPage(pager.current);
            getDefaultHealth();
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
            onChangedPage,
            onSelectPicker,
            onChangeDownRol,
            exelParams,
            reloadList


        };
    }
};

</script>