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
                    <button type="button" class="btn btn-sm" @click="openMoreSerch">
                        <span class="txt">상세검색 열기</span>
                    </button>
                </div>
            </div>
            <div class="ui-data-filter-more" v-if="state.openMore">
                <div class="form-item">
                    <div class="item">
                        <label>서비스구분</label>
                        <span class="input">
                            <span class="dv">
                                <span class="checkbox">
                                    <input :id="'columChk' + 1" name="columChkGroup" type="checkbox"
                                        v-model="state.serviceSectionOrganizationSearchYn"
                                        @change="checkAllValid('serviceSectionOrganizationSearchYn')">
                                    <label :for="'columChk' + 1">기관검색</label>
                                </span>
                                <span class="checkbox">
                                    <input :id="'columChk' + 2" name="columChkGroup" type="checkbox"
                                        v-model="state.serviceSectionOrganizationBookingYn"
                                        @change="checkAllValid('serviceSectionOrganizationBookingYn')">
                                    <label :for="'columChk' + 2">기관예약</label>
                                </span>
                                <span class="checkbox">
                                    <input :id="'columChk' + 3" name="columChkGroup" type="checkbox"
                                        v-model="state.serviceSectionSymptomsSearchYn"
                                        @change="checkAllValid('serviceSectionSymptomsSearchYn')">
                                    <label :for="'columChk' + 3">증상검색</label>
                                </span>
                                <span class="checkbox">
                                    <input :id="'columChk' + 4" name="columChkGroup" type="checkbox"
                                        v-model="state.serviceSectionMedicalTeamInquiryYn"
                                        @change="checkAllValid('serviceSectionMedicalTeamInquiryYn')">
                                    <label :for="'columChk' + 4">의료진 문의</label>
                                </span>
                                <span class="checkbox">
                                    <input :id="'columChk' + 5" name="columChkGroup" type="checkbox"
                                        v-model="state.serviceSectionLossInsuranceYn"
                                        @change="checkAllValid('serviceSectionLossInsuranceYn')">
                                    <label :for="'columChk' + 5">실손 보험</label>
                                </span>
                            </span>
                        </span>
                    </div>
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
                            <button type="button" class="btn btn-opt" :disabled="state.serviceList == null"
                                @click="onChangeDownRol(menuInfo.auth5DownloadYn, 'Y', exelParams,)">
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
                    <NoData :nodatatext="'조회된 데이터가 없습니다.'" v-if="state.serviceList === null"></NoData>
                    <div v-else>
                        <AgGridVue :columnDefs="state.tableColum_c" :rowData="state.serviceList"
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
import { _getServiceHealth } from '@/api/memberinfo.js';
import { watch } from 'vue';
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
                headerName: '이용일자',
                field: 'searchDateTime',
                maxWidth: 180
            },
            { headerName: '서비스구분', field: 'serviceSection' },
            { headerName: '분류', field: 'classification' },
            { headerName: '세분류', field: 'detailClassification' },
            { headerName: '명칭', field: 'name', maxWidth: 150 }
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
            serviceList: [],
            pagesize: 10,
            openMore: false,
            service: [
                { label: '기관검색', value: '' },
                { label: '기관예약', value: '' },
                { label: '증상검색', value: '' },
                { label: '의료진 문의', value: '' },
                { label: '실손보험', value: '' }
            ],
            setDay: '1month',
            startDay: '',
            endDay: '',
            memberNum: '',
            menuCode: computed(() => props.menuCode),
            serviceSectionOrganizationSearchYn: true,
            serviceSectionOrganizationBookingYn: true,
            serviceSectionSymptomsSearchYn: true,
            serviceSectionMedicalTeamInquiryYn: true,
            serviceSectionLossInsuranceYn: true
        });
        const formData = reactive({
            mbrSn: computed(() => state.memberNum),
            bgnDate: computed(() => state.startDay),
            endDate: computed(() => state.endDay),
            serviceSectionOrganizationSearchYn: computed(() => state.serviceSectionOrganizationSearchYn ? 'Y' : 'N'),
            serviceSectionOrganizationBookingYn: computed(() => state.serviceSectionOrganizationBookingYn ? 'Y' : 'N'),
            serviceSectionSymptomsSearchYn: computed(() => state.serviceSectionSymptomsSearchYn ? 'Y' : 'N'),
            serviceSectionMedicalTeamInquiryYn: computed(() => state.serviceSectionMedicalTeamInquiryYn ? 'Y' : 'N'),
            serviceSectionLossInsuranceYn: computed(() => state.serviceSectionLossInsuranceYn ? 'Y' : 'N'),
            menuCode: computed(() => state.menuInfo.menuCode)
        });
        // const checkAll
        const checkAllValid = (item) => {
            if (
                !state.serviceSectionOrganizationSearchYn &&
                !state.serviceSectionOrganizationBookingYn &&
                !state.serviceSectionSymptomsSearchYn &&
                !state.serviceSectionMedicalTeamInquiryYn &&
                !state.serviceSectionLossInsuranceYn
            ) {
                state[item] = true;
            }
        };

        watch(() => [state.serviceSectionOrganizationSearchYn, state.serviceSectionOrganizationBookingYn, state.serviceSectionSymptomsSearchYn, state.serviceSectionMedicalTeamInquiryYn, state.serviceSectionLossInsuranceYn], (item) => {
            console.log(
                formData.serviceSectionOrganizationSearchYn,
                formData.serviceSectionOrganizationBookingYn,
                formData.serviceSectionSymptomsSearchYn,
                formData.serviceSectionMedicalTeamInquiryYn,
                formData.serviceSectionLossInsuranceYn
            );
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
            getServiceHealth();
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
            getServiceHealth();
        });
        // 상세 검색 열기
        const openMoreSerch = () => {
            state.openMore = !state.openMore;
        };

        const reloadList = () => {
            pager.current = 1;
            onChangedPage(pager.current);
        };

        //리스트 조회
        const getServiceHealth = async () => {
            try {
                let params = {
                    size: pager.size,
                    offset: pager.offset,
                    menuCode: formData.menuCode,
                    mbrSn: formData.mbrSn,
                    bgnDate: formData.bgnDate,
                    endDate: formData.endDate,
                    serviceSectionOrganizationSearchYn: formData.serviceSectionOrganizationSearchYn,
                    serviceSectionOrganizationBookingYn: formData.serviceSectionOrganizationBookingYn,
                    serviceSectionSymptomsSearchYn: formData.serviceSectionSymptomsSearchYn,
                    serviceSectionMedicalTeamInquiryYn: formData.serviceSectionMedicalTeamInquiryYn,
                    serviceSectionLossInsuranceYn: formData.serviceSectionLossInsuranceYn
                };
                console.log(params);
                const response = await _getServiceHealth(params);
                console.log(response.data);
                state.serviceList = response.data.data.list;
                pager.totalCnt = response.data.data.totalCnt;
            } catch (error) {
                console.log(error);
            }
        };
        // 엑셀용 함수
        const exelParams = reactive({
            params: {
                menuCode: computed(() => formData.menuCode),
                mbrSn: computed(() => formData.mbrSn),
                bgnDate: computed(() => formData.bgnDate),
                endDate: computed(() => formData.endDate),
                serviceSectionOrganizationSearchYn: computed(() => formData.serviceSectionOrganizationSearchYn),
                serviceSectionOrganizationBookingYn: computed(() => formData.serviceSectionOrganizationBookingYn),
                serviceSectionSymptomsSearchYn: computed(() => formData.serviceSectionSymptomsSearchYn),
                serviceSectionMedicalTeamInquiryYn: computed(() => formData.serviceSectionMedicalTeamInquiryYn),
                serviceSectionLossInsuranceYn: computed(() => formData.serviceSectionLossInsuranceYn)
            },
            url: '/common/api/v1/user/getMedicalServiceUseList/excel'

        });

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
            openMoreSerch,
            onSelectPicker,
            reloadList,
            checkAllValid,
            onChangeDownRol,
            exelParams
        };
    }
};

</script>