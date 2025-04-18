<template>
    <section>
        <!-- 검색 -->
        <div class="ui-data-filter">
            <div class="form-item">
                <dateSerch :dateTitle="'기간조회'" @onSelectDate="onSelectPicker" :pickerOnly="false" :setDay="state.setDay"
                    ref="dateSearch"
                    :selectOptions="[{ label: '문의일자', value: '문의일자' }, { label: '답변일자', value: '답변일자' }]" />
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
            <!-- 상세검색 state.openMore-->
            <div class="ui-data-filter-more" v-if="state.openMore">
                <div class="form-item">
                    <div class="item">
                        <label>문의유형</label>
                        <span class="input">
                            <span class="dv">
                                <select class="custom-select sm" v-model="formData.qstnTyCd">
                                    <option v-for="(item, index) in state.qstnTyCd" :key="index" :value="item.value">
                                        {{ item.label }}
                                    </option>
                                </select>
                            </span>
                        </span>
                    </div>
                    <div class="item">
                        <label>문의구분</label>
                        <span class="input">
                            <span class="dv">
                                <span class="radio" v-for="(item, index) in state.inqSeCd" :key="index">
                                    <input :id="'inqSeCd' + index" name="inqSeCdGroup" type="radio" :value="item.value"
                                        v-model="formData.inqSeCd">
                                    <label :for="'inqSeCd' + index">{{ item.label }}</label>
                                </span>
                            </span>
                        </span>
                    </div>
                    <div class="item">
                        <label>답변 상태</label>
                        <span class="input">
                            <span class="dv">
                                <select class="custom-select sm" v-model="formData.admnAswStCd">
                                    <option v-for="(item, index) in state.aswStCd" :key="index" :value="item.value">

                                        {{ item.label }}
                                    </option>
                                </select>
                            </span>
                        </span>
                    </div>
                </div>
                <div class="form-item">
                    <div class="item">
                        <label>조회조건</label>
                        <span class="input">
                            <span class="dv">
                                <select class="custom-select sm" v-model="formData.cnSercSe" disabled>
                                    <option value="qstnTtl">
                                        제목
                                    </option>
                                </select>
                            </span>
                            <span class="dv">
                                <input v-model="formData.cnSercCts" class="form-control sm" type="text">
                            </span>
                        </span>
                    </div>
                </div>
                <div class="form-item">
                    <div class="item">
                        <label>해결상태</label>
                        <span class="input">
                            <span class="radio">
                                <input id="pamRdo1" name="pamRdoGroup" type="radio" value="" v-model="formData.soltnYn">
                                <label for="pamRdo1">전체</label>
                            </span>
                            <span class="radio">
                                <input id="pamRdo2" name="pamRdoGroup" type="radio" value="Y" v-model="formData.soltnYn">
                                <label for="pamRdo2">해결</label>
                            </span>
                            <span class="radio">
                                <input id="pamRdo3" name="pamRdoGroup" type="radio" value="N" v-model="formData.soltnYn">
                                <label for="pamRdo3">미해결</label>
                            </span>
                        </span>
                        <span class="input ml-20">
                            <span class="checkbox">
                                <input id="pamRdo4" name="pamRdoGroup" type="checkbox" value="" v-model="state.badClmYn">
                                <label for="pamRdo4">악성클레임</label>
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
                    <button type="button" class="btn btn-opt"
                        @click="onChangeDownRol(menuInfo.auth5DownloadYn, 'Y', exelParams)">
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

            <columlist :columlists="initColum" @checkColum="checkOptions" />
            <NoData :nodatatext="'조회된 데이터가 없습니다.'" v-if="state.memberVocList.length === 0"></NoData>
            <div v-else>
                <AgGridVue :columnDefs="state.tableColum_c" :rowData="state.memberVocList"
                    :defaultColDef="state.defaultColDef" class="ag-theme-alpine" :domLayout="state.domLayout"
                    style="width:100%">
                </AgGridVue>
                <PageNavigation :cntPerPage='pager.size' :itemCount='pager.totalCnt' :currentPage="pager.current"
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
import { _getMemberVOC } from '@/api/memberinfo.js';
export default {
    props: ['menuInfo'],
    components: { DefaultModal, DateSerch },
    setup(props) {
        const internalInstance = getCurrentInstance();
        const $Modal = inject('$Modal');
        const dayJS = inject('dayJS');
        const store = useStore();
        const route = useRoute();
        const dateSearch = ref(null);
        const { goToPage, tableResize, openModal, isImgShow } = useCommFunc();
        const initColum = ref([
            {
                headerName: '번호',
                field: 'no',
                maxWidth: 80,
                valueGetter: 'node.rowIndex + 1',
                suppressSizetoFit: true
            },
            { headerName: '문의구분', field: 'inqSeNm', maxWidth: 100 },
            { headerName: '문의유형', field: 'qstnTyNm', maxWidth: 150 },
            { headerName: '제목', field: 'qstnTtl' },
            { headerName: '문의일자', field: 'fstRgsDt', maxWidth: 150 },
            { headerName: '답변상태', field: 'admnAswStNm', maxWidth: 100 },
            { headerName: '접수완료일자', field: 'aswAcpCmplDt', maxWidth: 150 },
            { headerName: '답변자', field: 'aswChgpNm', maxWidth: 130 },
            { headerName: '답변일자', field: 'aswRgsDt', maxWidth: 150 },
            { headerName: '악성클레임', field: 'badClmYn', maxWidth: 120 }

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
            mskgnRlsYn: false,
            setDay: '1month',
            startDay: '',
            endDay: '',
            memberVocList: [],
            qstnTyCd: [
                { label: '전체', value: '' },
                { label: '회원관련 문의', value: '152001' },
                { label: '챌린지/커뮤니티 문의', value: '152002' },
                { label: '오류 문의', value: '152003' },
                { label: '리워드포인트 문의', value: '152004' },
                { label: '건강검진 문의', value: '152005' },
                { label: '건강기록 문의', value: '152006' },
                { label: '건강뉴스(컨텐츠) 문의', value: '152007' },
                // { label: '제휴서비스 문의', value: '152008' },
                { label: '심리검사/상담 문의', value: '152009' },
                // { label: '커머스 문의', value: '152010' },
                // { label: '오케어M 문의', value: '152021' },
                { label: '메디컬 문의', value: '152021' },
                { label: '기타 문의', value: '152022' }
            ],
            inqSeCd: [
                { label: '전체', value: '' },
                { label: '1:1문의', value: '287001' },
                { label: '유선문의', value: '287002' }
            ],
            aswStCd: [
                { label: '전체', value: '' },
                { label: '검토중', value: '158001' },
                { label: '문의이관', value: '158002' },
                { label: '접수완료', value: '158003' },
                { label: '답변완료', value: '158004' },
                { label: '답변조회', value: '158005' }
            ],
            badClmYn: false,
            mbrSn: ''


        });
        const formData = reactive({
            mbrSn: computed(() => state.mbrSn),
            inqType: '', // 기간조회타입
            bgnDate: computed(() => state.startDay), // 시작일
            endDate: computed(() => state.endDay), // 종료일
            qstnTyCd: '',
            inqSeCd: '',
            admnAswStCd: '',
            cnSercSe: 'qstnTtl',
            cnSercCts: '',
            soltnYn: '',
            badClmYn: computed(() => state.badClmYn ? 'Y' : ''),
            menuCode: computed(() => state.menuInfo.menuCode)
        });

        onMounted(() => {
            if (route.query.mbrSn) {
                state.mbrSn = route.query.mbrSn;
            }
            getMemberVOC();
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
            getMemberVOC();
        };

        const inniParams = () => {
            formData.qstnTyCd = '';
            formData.inqSeCd = '';
            formData.admnAswStCd = '';
            formData.soltnYn = '';
            state.badClmYn = false;
            formData.cnSercSe = 'qstnTtl';
            formData.cnSercCts = '';
            formData.evntPzwnYn = '';
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
            if (status === '이벤트종료일') {
                formData.inqType = 'evntEndDt ';
            }
            //api호출
            console.log('선택일:' + value, '선택된 버튼:' + type, '조회기준:' + status, dayJS(formData.from).format('MM-DD'));
        };
        // 데이터 피커 초기화
        const onInitDate = () => {
            dateSearch.value.initDate();
            //재조회  api 호출
            clearList(1);
        };
        //리스트 조회
        const getMemberVOC = async () => {
            try {
                let params = {
                    size: pager.size,
                    offset: pager.offset,
                    inqType: formData.inqType,
                    mbrSn: formData.mbrSn,
                    bgnDate: formData.bgnDate,
                    endDate: formData.endDate,
                    qstnTyCd: formData.qstnTyCd,
                    inqSeCd: formData.inqSeCd,
                    admnAswStCd: formData.admnAswStCd,
                    cnSercSe: formData.cnSercSe,
                    cnSercCts: formData.cnSercCts,
                    soltnYn: formData.soltnYn,
                    badClmYn: formData.badClmYn,
                    menuCode: formData.menuCode
                };
                const response = await _getMemberVOC(params);
                console.log(response.data);
                state.memberVocList = response.data.data.list;
                pager.totalCnt = response.data.data.totalCnt;
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
            console.log(formData);
            getMemberEvent();
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
                inqType: computed(() => formData.inqType),
                mbrSn: computed(() => formData.mbrSn),
                bgnDate: computed(() => formData.bgnDate),
                endDate: computed(() => formData.endDate),
                qstnTyCd: computed(() => formData.qstnTyCd),
                inqSeCd: computed(() => formData.inqSeCd),
                admnAswStCd: computed(() => formData.admnAswStCd),
                cnSercSe: computed(() => formData.cnSercSe),
                cnSercCts: computed(() => formData.cnSercCts),
                soltnYn: computed(() => formData.soltnYn),
                badClmYn: computed(() => formData.badClmYn),
                menuCode: computed(() => formData.menuCode)
            },
            url: '/common/api/v1/user/getUserMemberVocListExcelList/excel'
        });
        return {
            //공통 사용
            $Modal,
            dayJS,
            goToPage,
            tableResize,
            isImgShow,
            openModal,
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