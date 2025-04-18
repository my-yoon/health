<template>
    <section>
        <!-- 검색 -->
        <div class="ui-data-filter">
            <div class="form-item">
                <dateSerch :dateTitle="'기간조회'" @onSelectDate="onSelectPicker" :pickerOnly="false" :setDay="state.setDay"
                    ref="dateSearch" :selectOptions="[{ label: '이벤트종료일', value: '이벤트종료일' }]" />
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
            <!-- 상세검색 -->
            <div class="ui-data-filter-more" v-if="state.openMore">
                <div class="form-item">

                    <div class="item">
                        <label>이벤트명</label>
                        <span class="input">
                            <span class="dv">
                                <select class="custom-select sm" v-model="formData.cnSercSe">
                                    <option value="evntNm">
                                        이벤트 명
                                    </option>
                                </select>
                            </span>
                            <span class="dv">
                                <input v-model="formData.cnSercCts" class="form-control sm" type="text">
                            </span>
                        </span>
                    </div>
                    <div class="item">
                        <label>당첨 여부</label>
                        <span class="input">
                            <span class="dv">
                                <span class="radio">
                                    <input id="pamRdo1" name="pamRdoGroup" type="radio" value=""
                                        v-model="formData.evntPzwnYn">
                                    <label for="pamRdo1">전체</label>
                                </span>
                                <span class="radio">
                                    <input id="pamRdo2" name="pamRdoGroup" type="radio" value="Y"
                                        v-model="formData.evntPzwnYn">
                                    <label for="pamRdo2">당첨</label>
                                </span>
                                <span class="radio">
                                    <input id="pamRdo3" name="pamRdoGroup" type="radio" value="N"
                                        v-model="formData.evntPzwnYn">
                                    <label for="pamRdo3">미당첨</label>
                                </span>
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
            <NoData :nodatatext="'조회된 데이터가 없습니다.'" v-if="state.memberEventList.length === 0"></NoData>
            <div v-else>
                <AgGridVue :columnDefs="state.tableColum_c" :rowData="state.memberEventList"
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
import { _getMemberEvent } from '@/api/memberinfo.js';
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
                headerName: '유형',
                field: 'evntTy',
                valueGetter: (params) => {
                    if (params.data.evntTy === 'ROULETTE') {
                        return '룰렛';
                    } else if (params.data.evntTy === 'GENERAL') {
                        return '일반';
                    } else if (params.data.evntTy === 'QUIZ') {
                        return '퀴즈';
                    } else if (params.data.evntTy === 'ATTENDANCE') {
                        return '출석';
                    }
                }
            },
            { headerName: '이벤트명', field: 'evntNm' },
            { headerName: '이벤트 기간', field: 'evntTr' },
            { headerName: '참여일자', field: 'sppcDt' },
            {
                headerName: '당첨여부',
                field: 'evntPzwnYn',
                valueGetter: (params) => {
                    if (params.data.evntPzwnYn === 'Y') {
                        return '당첨';
                    } else if (params.data.evntPzwnYn === 'N') {
                        return '미당첨';
                    }
                }
            },
            { headerName: '당첨자발표', field: 'pzwnAncDt' }
        ]);

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
            download: { pass: '', reason: '' },
            pagesize: 10,
            setDay: '1month',
            startDay: '',
            endDay: '',
            memberEventList: [],
            mbrSn: ''
        });
        const formData = reactive({
            mbrSn: computed(() => state.mbrSn),
            inqType: '', // 기간조회타입
            bgnDate: computed(() => state.startDay), // 시작일
            endDate: computed(() => state.endDay), // 종료일
            cnSercSe: 'evntNm',
            cnSercCts: '',
            evntPzwnYn: ''
        });
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
        onMounted(() => {
            if (route.query.mbrSn) {
                state.mbrSn = route.query.mbrSn;
            }
            getMemberEvent();
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
            getMemberEvent();
        };

        const inniParams = () => {
            formData.cnSercSe = 'evntNm';
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
                formData.inqType = 'evntEndDt';
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
        const getMemberEvent = async () => {
            try {
                let params = {
                    size: pager.size,
                    offset: pager.offset,
                    inqType: formData.inqType,
                    mbrSn: formData.mbrSn,
                    bgnDate: formData.bgnDate,
                    endDate: formData.endDate,
                    cnSercSe: formData.cnSercSe,
                    cnSercCts: formData.cnSercCts,
                    evntPzwnYn: formData.evntPzwnYn
                };
                const response = await _getMemberEvent(params);
                console.log(response.data);
                state.memberEventList = response.data.data.list;
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
            // getMemberEvent();
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
                menuCode: state.menuInfo.menuCode,
                mbrSn: computed(() => formData.mbrSn),
                bgnDate: computed(() => formData.bgnDate),
                endDate: computed(() => formData.endDate),
                cnSercSe: computed(() => formData.cnSercSe),
                cnSercCts: computed(() => formData.cnSercCts)
            },
            url: '/common/api/v1/user/getUserMemberParticipationEventList/excel'
        });
        return {
            //공통 사용
            $Modal,
            dayJS,
            goToPage,
            tableResize,
            isPartnerShow,
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
            exelParams,
            onChangeDownRol


        };
    }
};

</script>