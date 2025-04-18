<template>
    <section>
        <!-- 검색 -->
        <div class="ui-data-filter">
            <div class="form-item">
                <dateSerch :dateTitle="'포인트지급일'" @onSelectDate="onSelectPicker" :pickerOnly="false" :setDay="state.setDay"
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
            <!-- 상세검색 -->
            <div class="ui-data-filter-more" v-if="state.openMore">
                <div class="form-item">
                    <div class="item">
                        <label>초대 유형</label>
                        <span class="input">
                            <span class="dv">
                                <select class="custom-select sm" v-model="formData.inviteType">
                                    <option v-for="(item, index) in state.inviteTypelist" :key="index" :value="item.value">
                                        {{ item.label }}
                                    </option>
                                </select>
                            </span>
                        </span>
                    </div>
                    <div class="item">
                        <label>키워드</label>
                        <span class="input">
                            <span class="dv">
                                <select class="custom-select sm" v-model="formData.searchType">
                                    <option v-for="(item, index) in state.keywordlist" :key="index" :value="item.value">
                                        {{ item.label }}
                                    </option>
                                </select>
                            </span>
                            <span class="dv">
                                <input v-model="formData.searchText" class="form-control sm" type="text">
                            </span>
                        </span>
                    </div>
                </div>
            </div>
        </div>

        <div class="tbl-wrap">
            <div class="table-util flex space-between">
                <div class="btn-set-m flex">
                    <button type="button" :class="['btn btn-ss']" @click="goToPage('/event/winner_notice/register')">
                        등록
                    </button>
                    <button type="button" class="btn btn-ss" @click="changeMskgnRlsYn()"
                        :disabled="!state.mskgnRlsYn || state.mskgnTried">
                        마스킹해제
                    </button>
                </div>
                <div class="btn-set-m flex align-end">
                    <span class="table-total">조회결과 총 <strong>{{ pager.totalCnt }}</strong>건</span>
                    <button type="button" class="btn btn-opt"
                        @click="onChangeDownRol(menuInfo.auth5DownloadYn, formData.mskgnRlsYn, exelParams)">
                        <span class="ico-download"></span>파일다운로드
                    </button>
                    <selectBox :selectType="'page'" @changedValue="selectedOptions_list" />

                    <!-- <button type="button" class="btn btn-opt-ico fit" @click="tableResize">
                        <span class="offscreen">컬럼 리사이징</span>
                    </button> -->
                    <!-- 클래스 : full -->
                    <!-- 클래스 : close -->
                    <button type="button" class="btn btn-opt-ico filter" @click="resetTable">
                        <span class="offscreen">컬럼 셋팅</span>
                    </button>
                </div>
            </div>
            <!-- {{ formData }} -->
            <columlist :columlists="initColum" @checkColum="checkOptions" />
            <NoData :nodatatext="'조회된 데이터가 없습니다.'" v-if="state.inviteList.length === 0"></NoData>
            <div v-else>
                <AgGridVue :columnDefs="state.tableColum_c" :rowData="state.inviteList" :defaultColDef="state.defaultColDef"
                    @cell-clicked="onCellClicked" class="ag-theme-alpine" :domLayout="state.domLayout" style="width:100%">
                </AgGridVue>
                <PageNavigation :cntPerPage='pager.size' :itemCount='pager.totalCnt' :currentPage="pager.current"
                    @changedPage="onChangedPage" />
            </div>
        </div>
    </section>
</template>
<script>
import { computed, reactive, inject, onMounted, onUnmounted, ref, watch } from 'vue';
import DefaultModal from '@/plugins/modal/modal/DefaultModal.vue';
import DateSerch from '@/components/ui/DateSerch.vue';
import { useCommFunc } from '@/core/helper/common.js';
import { authCommFunc } from '@/core/helper/authComm.js';
import { useStore } from 'vuex';
import { _getInviteList } from '@/api/event.js';
export default {
    components: { DefaultModal, DateSerch },
    setup() {
        const $Modal = inject('$Modal');
        const dayJS = inject('dayJS');
        const store = useStore();
        const dateSearch = ref(null);
        const DownModalConRef = ref(null);
        const { goToPage, fileDown, tableResize, isPartnerShow, isDownShow, isImgShow } = useCommFunc();
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
                field: 'invTy',
                maxWidth: 130,
                valueGetter: (params) => {
                    if (params.data.invTy === 'GUEST') {
                        return '초대';
                    } else if (params.data.invTy === 'HOST') {
                        return '가입';
                    }
                }
            },
            { headerName: '초대코드', field: 'invCd' },
            { headerName: '회원번호', field: 'mbrSn' },
            { headerName: '이름', field: 'mbrNm' },
            { headerName: '휴대폰번호', field: 'mbrHp' },
            { headerName: '이메일주소', field: 'mbrEmail' },
            { headerName: '고유코드', field: 'myInvCd' },
            { headerName: '지급포인트', field: 'eventPnt' },
            {
                headerName: '지급일',
                field: 'fstRgsDt',
                valueGetter: (params) => {
                    return dayJS(params.data.fstRgsDt).format('YYYY-MM-DD');
                }
            }
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
            openMore: false,
            // download: { pass: '', reason: '' },
            pagesize: 10,
            mskgnRlsYn: true,
            mskgnTried: false, // 마스킹 해제 여부 ( 1회 실행 가능 - 1회 마스킹해제 시 제 실행 불가 )
            setDay: '1month',
            startDay: '',
            endDay: '',
            inviteList: [],
            inviteTypelist: [
                { label: '전체', value: '' },
                { label: '초대자', value: 'HOST' },
                { label: '신규가입자', value: 'GUEST' }
            ],
            keywordlist: [
                { label: '전체', value: '' },
                { label: '초대코드', value: 'invCd' },
                { label: '회원번호', value: 'mbrSn' },
                { label: '회원이름', value: 'mbrNm' }
            ]
        });
        const formData = reactive({
            startDt: computed(() => state.startDay), // 시작일
            endDt: computed(() => state.endDay), // 종료일
            inviteType: '',
            searchType: '',
            searchText: '',
            mskgnRlsYn: computed(() => state.mskgnRlsYn ? 'Y' : 'N') //마스킹해제여부(Y/N)
        });

        // 엑셀용 함수
        const exelParams = reactive({
            params: {
                startDt: computed(() => formData.startDt),
                endDt: computed(() => formData.endDt),
                inviteType: computed(() => formData.inviteType),
                eventTaxYn: computed(() => formData.eventTaxYn),
                searchType: computed(() => formData.searchType),
                searchText: computed(() => formData.searchText),
                mskgnRlsYn: computed(() => formData.mskgnRlsYn),
                menuCode: computed(() => menuInfo.value.menuCode)
            },
            url: '/common/api/v1/event/invite/list/excel'
        });

        onMounted(() => {
            getInviteList();
            emitter.$on('onChangeMskgn', onChangeMskgn);
        });

        // 마스킹 해제 이벤트 버스 해제
        onUnmounted(() => {
            emitter.$off('onChangeMskgn');
        });

        /**
         * 마스킹 권한 체크
         */
        const changeMskgnRlsYn = async () => {
            await onChangeMaskingRol(menuInfo.value.auth6MaskingYn);
        };

        /**
         * 마스킹 해제 처리 후 리스트 재조회
         */
        const onChangeMskgn = () => {
            state.mskgnRlsYn = !state.mskgnRlsYn;
            getInviteList();
        };
        watch(formData, () => {
            console.log('change formData');
            if (state.mskgnTried) {
                state.mskgnRlsYn = true;
            }
        });

        // const initParams = () => {
        //     formData.inviteType = '';
        //     formData.searchType = '';
        //     formData.searchText = '';
        //     state.mskgnRlsYn = true;
        // };

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
            getInviteList();
        };
        //리스트 갯수 변경 후 리스트 재 조회
        const clearList = (num) => {
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
            //api호출
            console.log('선택일:' + value, '선택된 버튼:' + type, '조회기준:' + status, dayJS(formData.from).format('MM-DD'));
        };
        // 데이터 피커 초기화
        const onInitDate = () => {
            dateSearch.value.initDate();
            //재조회  api 호출
            getInviteList();
        };
        //리스트 조회
        const getInviteList = async () => {
            try {
                let params = {
                    size: pager.size,
                    offset: pager.offset,
                    startDt: formData.startDt,
                    endDt: formData.endDt,
                    inviteType: formData.inviteType,
                    searchType: formData.searchType,
                    searchText: formData.searchText,
                    mskgnRlsYn: formData.mskgnRlsYn
                };

                const response = await _getInviteList(params);
                state.inviteList = response.data.data;
                pager.totalCnt = response.data.data.length;
                state.mskgnTried = false;
                console.log(params);
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
            getInviteList();
        };

        const onCellClicked = (e) => {
            console.log(e.data);
            //goToPage(`/memberinfodetail?mbrSn=${e.data.mbrSn}&&mskgnRlsYn=${(state.mskgnRlsYn ? 'Y' : 'N')}`);
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
        //다운로드 사유 등록 
        // const downConfirm = (type, con) => {
        //     console.log(type, con);
        //     if (type === 'pass') {
        //         state.download.pass = con;
        //     } else {
        //         state.download.reason = con;
        //     }
        // };
        //파트너 선택
        const selectPartner = (data) => {
            state.partnerName = data;
            console.log(data);
        };
        // 모달창 닫기
        const modalControl = (type, modalName) => {
            if (modalName === 'isDownShow') {
                // if (type === 'modalclose' || type === 'modalcancel') {
                //     isDownShow.value = false;
                // }
                // if (type === 'modalconfirm') {
                //     console.log(type, modalName);
                //     if (_.isEmpty(state.download.pass) || _.isEmpty(state.download.reason)) {
                //         DownModalConRef.value.validCheck();
                //         console.log(_.isEmpty(state.download.pass), _.isEmpty(state.download.reason));
                //     } else {
                //         let params = {
                //             startDt: formData.startDt,
                //             endDt: formData.endDt,
                //             inviteType: formData.inviteType,
                //             eventTaxYn: formData.eventTaxYn,
                //             searchType: formData.searchType,
                //             searchText: formData.searchText,
                //             mskgnRlsYn: formData.mskgnRlsYn,
                //             downloadPass: state.download.pass,
                //             downloadReason: state.download.reason,
                //             menuCode: '1023004'
                //         };

                //         fileDown(state.download, params, '/common/api/v1/event/invite/list/excel');
                //         state.download = {};
                //         isDownShow.value = false;
                //     }
                // }
            } else if (!modalName) {
                isDownShow.value = false;
            }
            console.log(type, modalName);
        };

        return {
            //공통 사용
            $Modal,
            dayJS,
            goToPage,
            fileDown,
            tableResize,
            isDownShow,
            isPartnerShow,
            isImgShow,
            // openModal,
            DownModalConRef,
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
            modalControl,
            onCellClicked,
            resetTable,
            checkOptions,
            // downConfirm,
            selectPartner,
            reloadList,

            menuInfo,
            exelParams,
            onChangeDownRol,
            changeMskgnRlsYn
        };
    }
};

</script>