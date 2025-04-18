<template>
    <section>
        <!-- 검색 -->
        <div class="ui-data-filter">
            <div class="form-item">
                <dateSerch ref="dateSearch" :dateTitle="'기간조회'" :pickerOnly="false" :selectOptions="[{ label: '적립일자' }]"
                    :setDay="state.setDay" :setOptionsType="'type-2'" @onSelectDate="onSelectPicker" />
                <div class="btn-filter-set">
                    <button class="btn btn-sm" type="button" @click="reloadList"><span class="ico-search"></span>조회
                    </button>
                    <button class="btn btn-sm" type="button" @click="onInitDate">
                        <span class="ico-reload sg"></span>
                        <span class="offscreen">리로드</span>
                    </button>
                    <button class="btn btn-sm" type="button" @click="openMoreSerch">
                        <span class="txt">상세검색 열기</span>
                    </button>
                </div>
            </div>
            <!-- 상세검색 -->
            <div v-if="state.openMore" class="ui-data-filter-more">
                <div class="form-item">
                    <div class="item">
                        <label>조회조건</label>
                        <span class="input">
                            <span class="dv">
                                <select v-model="formData.cnSercSe" class="custom-select sm">
                                    <option :value="item.value" v-for="(item, index) in state.pointOption" :key="index">
                                        {{ item.label }}
                                    </option>
                                </select>
                            </span>
                            <span class="dv">
                                <input v-model="formData.cnSercCts" class="form-control sm" type="text"
                                    :disabled="formData.cnSercSe === ''">
                            </span>
                        </span>
                    </div>
                </div>
            </div>
        </div>
        <div class="tbl-wrap">
            <div class="table-util flex space-between">
                <div class="btn-set-m flex">
                </div>
                <div class="btn-set-m flex align-end">
                    <span class="table-total">조회결과 총 <strong>{{ pager.totalCnt }}</strong>건</span>
                    <button class="btn btn-opt" type="button"
                        @click="onChangeDownRol(state.menuInfo.auth5DownloadYn, 'Y', exelParams)">
                        <span class="ico-download"></span>파일다운로드
                    </button>
                    <selectBox :selectType="'page'" @changedValue="selectedOptions_list" />

                    <button class="btn btn-opt-ico fit" type="button" @click="tableResize">
                        <span class="offscreen">컬럼 리사이징</span>
                    </button>
                    <!-- 클래스 : full -->
                    <!-- 클래스 : close -->
                    <button class="btn btn-opt-ico filter" type="button" @click="resetTable">
                        <span class="offscreen">컬럼 셋팅</span>
                    </button>

                </div>
            </div>
            <columlist :columlists="initColum" @checkColum="checkOptions" />
            <NoData v-if="state.memberPointList.length === 0" :nodatatext="'조회된 데이터가 없습니다.'"></NoData>
            <div v-else>
                <AgGridVue :columnDefs="state.tableColum_c" :defaultColDef="state.defaultColDef"
                    :domLayout="state.domLayout" :rowData="state.memberPointList" class="ag-theme-alpine"
                    style="width:100%">
                </AgGridVue>
                <PageNavigation :cntPerPage='pager.size' :currentPage="pager.current" :itemCount='pager.totalCnt'
                    @changedPage="onChangedPage" />
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
import { _getMemberPoint } from '@/api/memberinfo.js';

export default {
    components: { DefaultModal, DateSerch },
    props: ['menuInfo'],
    setup(props) {
        const internalInstance = getCurrentInstance();
        const $Modal = inject('$Modal');
        const dayJS = inject('dayJS');
        const store = useStore();
        const route = useRoute();
        const dateSearch = ref(null);
        const { goToPage, tableResize } = useCommFunc();
        const initColum = ref([
            {
                headerName: '번호',
                field: 'no',
                maxWidth: 80,
                valueGetter: 'node.rowIndex + 1',
                suppressSizetoFit: true
            },
            { headerName: '구분', field: 'dvdCdNm' },
            { headerName: '적립일자', field: 'dvdDt' },
            {
                headerName: '포인트',
                field: 'pntAmt',
                valueGetter: (params) => {
                    return '+' + parseInt(params.data.pntAmt).toLocaleString('ko');
                }
            },
            { headerName: '적립내역', field: 'ctgrMdcsNm' },
            {
                headerName: '유효기간 종료일',
                field: 'pntVldEndDate',
                valueGetter: (params) => {
                    return dayJS(params.data.pntVldEndDate).format('YYYY-MM-DD');
                }
            },
            { headerName: '발급자', field: 'rgstNm' },
            {
                headerName: '잔여포인트',
                field: 'pntRmdAmt',
                valueGetter: (params) => {
                    return parseInt(params.data.pntRmdAmt).toLocaleString('ko');
                }
            }
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
            openMore: false,
            pagesize: 10,
            setDay: '1month',
            startDay: '',
            endDay: '',
            memberPointList: [],
            mbrSn: '',
            pointOption: [
                { label: '전체', value: '' },
                { label: '적립 내역', value: 'mdcs' },
                { label: '발급자', value: 'rgst' }

            ]
        });
        const formData = reactive({
            mbrSn: computed(() => state.mbrSn),
            inqType: '', // 기간조회타입
            bgnDate: computed(() => state.startDay), // 시작일
            endDate: computed(() => state.endDay), // 종료일
            cnSercSe: '',
            cnSercCts: '',
            menuCode: computed(() => state.menuInfo.menuCode)
        });

        onMounted(() => {
            if (route.query.mbrSn) {
                state.mbrSn = route.query.mbrSn;
            }
            getMemberPoint();
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
            getMemberPoint();
        };

        const inniParams = () => {
            formData.cnSercSe = '';
            formData.cnSercCts = '';
        };
        //리스트 갯수 변경 후 리스트 재 조회
        const clearList = (num) => {
            inniParams();
            onChangedPage(num);
            dateSearch.value.initDate();
        };
        //셀렉트박스 선택
        const selectedOptions_list = (value, type) => {
            if (type === 'page') {
                state.pagesize = value;
                clearList(1);
            }
        };
        // 공통코드 셀렉트
        const selectedOptions = (valueCode, valueName, type) => {
            console.log(formData[type]);
            if (type === 'rprsTlnoFno' || type === 'mailType2') {
                if (type === 'mailType2') {
                    state.mailType2 = valueName;
                } else {
                    formData[type] = valueName;
                }
            } else if (type === 'mailType1') {
                console.log();
            } else if (type === 'ptnrSelrSvcTyCd') {
                formData.svcSe = valueCode;
            } else {
                formData[type] = valueCode;
            }
            console.log(valueCode, valueName, type);
        };

        // 데이터 피커 날짜 검색
        const onSelectPicker = (type, value, status) => {
            // 버튼으로 선택된 기준
            if (type === 'day') {
                state.startDay = dayJS(value[0]).format('YYYYMMDD');
                state.endDay = dayJS(value[1]).format('YYYYMMDD');
            } else if (type === 'self_end' || type === 'self_start') {
                // 직접 데이터 피커 설정
                if (type === 'self_start') {
                    state.startDay = dayJS(value).format('YYYYMMDD');
                } else if (type === 'self_end') {
                    state.endDay = dayJS(value).format('YYYYMMDD');
                }
            }
            console.log('선택일:' + value, '선택된 버튼:' + type, '조회기준:' + status, dayJS(formData.from).format('MM-DD'));
        };
        // 데이터 피커 초기화
        const onInitDate = () => {
            dateSearch.value.initDate();
            //재조회  api 호출
            clearList(1);
        };
        //리스트 조회
        const getMemberPoint = async () => {
            try {
                let params = {
                    size: pager.size,
                    offset: pager.offset,
                    inqType: formData.inqType,
                    mbrSn: formData.mbrSn,
                    dvdCd: '001', //구분코드 조회키 (001: 적립 002:차감)
                    menuCode: formData.menuCode,
                    rgsDtFr: formData.bgnDate, //조회시작일
                    rgsDtTo: formData.endDate, //조회종료일
                    searchCustKey: formData.cnSercSe, //검색조건 조회 키 (내역:mdcs, 등록자:rgst)
                    searchCustValue: formData.cnSercCts //검색값
                };
                console.log(params);
                const response = await _getMemberPoint(params);
                console.log(response.data);
                state.memberPointList = response.data.data.list;
                pager.totalCnt = response.data.data.totalCount;
            } catch (error) {
                console.log(error);
            }
        };
        // 상세 검색 열기
        const openMoreSerch = () => {
            state.openMore = !state.openMore;
        };
        //검색조건에 따른 리스트 재조회
        const reloadList = () => {
            pager.current = 1;
            onChangedPage(pager.current);
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

        //파트너 선택
        const selectPartner = (data) => {
            state.partnerName = data;
            console.log(data);
        };
        // 엑셀용 함수
        const exelParams = reactive({
            params: {
                size: 0,
                offset: 0,
                inqType: computed(() => formData.inqType),
                mbrSn: computed(() => formData.mbrSn),
                dvdCd: '001', //구분코드 조회키 (001: 적립 002:차감)
                menuCode: computed(() => formData.menuCode),
                rgsDtFr: computed(() => formData.bgnDate), //조회시작일
                rgsDtTo: computed(() => formData.endDate), //조회종료일
                searchCustKey: computed(() => formData.cnSercSe), //검색조건 조회 키 (내역:mdcs, 등록자:rgst)
                searchCustValue: computed(() => formData.cnSercCts) //검색값
            },
            url: '/common/api/v1/iss/hst/customer/list/excel'
        });
        return {
            //공통 사용
            $Modal,
            dayJS,
            goToPage,
            tableResize,
            pager,
            state,
            formData,
            initColum,
            dateSearch,
            onChangedPage,
            onSelectPicker,
            selectedOptions,
            selectedOptions_list,
            onInitDate,
            openMoreSerch,
            resetTable,
            checkOptions,
            selectPartner,
            reloadList,
            onChangeDownRol,
            exelParams


        };
    }
};

</script>