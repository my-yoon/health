<template>
    <section>
        <!-- 검색 -->
        <div class="ui-data-filter">
            <div class="form-item">
                <dateSerch :dateTitle="'기간조회'" @onSelectDate="onSelectPicker" :pickerOnly="false" :setDay="state.setDay"
                    ref="dateSearch" :selectOptions="[{ label: '탈퇴일자', value: 'scsnDt' }]" />
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
                        <label>회원상태</label>
                        <span class="input">
                            <span class="dv">
                                <select class="custom-select sm" v-model="formData.mbrStCd">
                                    <option v-for="(item, index) in state.memberStatus" :key="index" :value="item.value">
                                        {{ item.label }}
                                    </option>
                                </select>
                            </span>
                        </span>
                    </div>
                    <!-- 2차 -->
                    <div class="item" v-if="false">
                        <label>회원구분/등급</label>
                        <span class="input">
                            <span class="dv">
                                <select class="custom-select sm">
                                    <option>
                                        전체
                                    </option>
                                </select>
                            </span>
                            <span class="dv">
                                <!-- 조회 코드 상세 없음 추가 처리 예정 -->
                                <span class="checkbox">
                                    <input id="columChk0" name="columChkGroup" type="checkbox">
                                    <label for="columChk0">1등급</label>
                                </span>
                            </span>
                        </span>
                    </div>
                </div>

                <div class="form-item">
                    <div class="item">
                        <label>조건검색</label>
                        <span class="input">
                            <span class="dv">
                                <select class="custom-select sm" v-model="formData.cnSercSe">
                                    <option v-for="(item, index) in state.searchcnSercSe" :key="index" :value="item.value">
                                        {{ item.label }}
                                    </option>
                                </select>
                            </span>
                            <span class="dv">
                                <input v-model="formData.cnSercCts" class="form-control sm" type="text">
                            </span>
                        </span>
                    </div>
                </div>
            </div>
        </div>
        <div class="tbl-wrap">
            <div class="table-util flex space-between">
                <div class="btn-set-m flex">
                    <!-- <button type="button" :class="['btn btn-ss', { active: state.mskgnRlsYn }]"
                        @click="() => { state.mskgnRlsYn = !state.mskgnRlsYn }">
                        <template v-if="!state.mskgnRlsYn">마스킹해제</template>
                        <template v-else>마스킹</template>
                    </button> -->
                </div>
                <div class="btn-set-m flex align-end">
                    <span class="table-total">조회결과 총 <strong>{{ pager.totalCnt }}</strong>건</span>
                    <button type="button" class="btn btn-opt"
                        @click="onChangeDownRol(menuInfo.auth5DownloadYn, 'Y', exelParams)">
                        <span class="ico-download"></span>파일다운로드
                    </button>
                    <selectBox :selectType="'page'" @changedValue="selectedOptions_list" />

                    <!-- <button type="button" class="btn btn-opt-ico fit" @click="tableResize">
                        <span class="offscreen">컬럼 리사이징</span>
                    </button> -->
                    <!-- 클래스 : full -->
                    <!-- 클래스 : close -->
                    <!-- <button type="button" class="btn btn-opt-ico filter" @click="resetTable">
                        <span class="offscreen">컬럼 셋팅</span>
                    </button> -->

                </div>
            </div>

            <!-- <columlist :columlists="initColum" @checkColum="checkOptions" /> -->
            <NoData :nodatatext="'조회된 데이터가 없습니다.'" v-if="state.faultList.length === 0"></NoData>
            <div v-else>
                <AgGridVue :columnDefs="state.tableColum_c" :rowData="state.faultList" :defaultColDef="state.defaultColDef"
                    @cell-clicked="onCellClicked" class="ag-theme-alpine" :domLayout="state.domLayout" style="width:100%">
                </AgGridVue>
                <PageNavigation :cntPerPage='pager.size' :itemCount='pager.totalCnt' :currentPage="pager.current"
                    @changedPage="onChangedPage" />
            </div>

        </div>

        <!-- 다운로드 사유 등록 -->
        <DefaultModal :isShow="isDownShow" :modalTitle="'다운로드 사유 등록'" :buttonConfirm="'저장'" :buttonCancel="''"
            :modalName="'isDownShow'" @modalclose="modalControl">
            <template #modalcontent>
                <DownModalCon @downloadFormat="downConfirm" />
            </template>
        </DefaultModal>

    </section>
</template>
<style>
.ag-body-horizontal-scroll-viewport {
    display: none
}
</style>
<script>
import { getCurrentInstance, computed, reactive, inject, onMounted, ref, watchEffect } from 'vue';
import DefaultModal from '@/plugins/modal/modal/DefaultModal.vue';
import DateSerch from '@/components/ui/DateSerch.vue';
import { useCommFunc } from '@/core/helper/common.js';
import { authCommFunc } from '@/core/helper/authComm.js';
import { format } from 'date-fns';
import { useStore } from 'vuex';
import { _memberOutList } from '@/api/memberinfo.js';
export default {
    components: { DefaultModal, DateSerch },
    setup() {
        const internalInstance = getCurrentInstance();
        const $Modal = inject('$Modal');
        const dayJS = inject('dayJS');
        const store = useStore();
        const dateSearchSingle = ref(null);
        const dateSearch = ref(null);
        const { goToPage, fileDown, tableResize, openModal, isPartnerShow, isDownShow, isImgShow } = useCommFunc();

        const initColum = ref([
            {
                headerName: '번호',
                field: 'no',
                maxWidth: 80,
                valueGetter: 'node.rowIndex + 1'
            },
            { headerName: '회원번호', field: 'mbrSn' },
            { headerName: '회원상태', field: 'mbrSt' },
            {
                headerName: '탈퇴일자',
                field: 'scsnDt',
                valueGetter: (params) => {
                    return dayJS(params.data.scsnDt).format('YYYY-MM-DD');
                },
                maxWidth: 300
            },
            { headerName: '탈퇴사유', field: 'scsnRsn', flex: 1 }
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
        const menuInfo = computed(() => store.state.getMenuItem.menuInfo);
        const state = reactive({
            //테이블데이터
            tableColum_c: _.clone(initColum),
            filterCoulm: [],
            //테이블 옵션
            defaultColDef: {
                sortable: true,
                filter: false,
                resizable: true,
                width: 150,
                headerClass: 'centered',
                cellClass: 'centered'
            },
            domLayout: 'autoHeight',
            openMore: false,
            download: { pass: '', reason: '' },
            partnerName: '',
            setDay: '1month',
            startDay: '',
            endDay: '',
            searchcnSercSe: [
                { label: '전체', value: '' },
                { label: '회원번호', value: 'mbrSn' }
            ],
            memberStatus: [
                { label: '전체', value: '' },
                { label: '강제탈퇴', value: '104006' },
                { label: '탈퇴', value: '104002' }
            ],
            faultList: [],
            pagesize: 10,
            pnltAplYn: false,
            kbAffiYn: false,
            mskgnRlsYn: false,
            memberAge: '',
            mbrSexCd: 'all',
            infAgrmAllYn: true,
            infAgrmCpmYn: true,
            infAgrmSmsYn: true,
            infAgrmEmailYn: true

        });
        const formData = reactive({
            inqType: 'scsnDt', // 기간조회타입
            bgnDate: computed(() => state.startDay), // 시작일
            endDate: computed(() => state.endDay), // 종료일
            mbrStCd: '',  // 회원상태코드 (104001: 정상)
            cnSercSe: '', //조건검색구분 (mbrNm: 회원명, mbrSn: 회원순번, mbrJnMthAcsId: 아이디, mbrHhpno: 휴대폰번호)
            cnSercCts: '', //조건검색내용
            menuCode: menuInfo.value.menuCode
        });

        onMounted(() => {
            memberOutList();
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
            memberOutList();
        };
        //리스트 갯수 변경 후 리스트 재 조회
        const clearList = (num) => {
            formData.inqType = 'scsnDt';
            formData.mbrStCd = '';
            formData.cnSercSe = '';
            formData.cnSercCts = '';
            dateSearch.value.initDate();
            onChangedPage(num);
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
            } else if (type === 'select') { // 가입일자 | 탈퇴일자
                formData.inqType = status;
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
        const memberOutList = async () => {
            try {
                let params = {
                    size: pager.size,
                    offset: pager.offset,
                    inqType: formData.inqType,
                    bgnDate: formData.bgnDate,
                    endDate: formData.endDate,
                    mbrStCd: formData.mbrStCd,
                    cnSercSe: formData.cnSercSe,
                    cnSercCts: formData.cnSercCts,
                    menuCode: formData.menuCode
                };
                console.log(params);
                const response = await _memberOutList(params);

                state.faultList = response.data.data.list;
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
        };

        const onCellClicked = (e) => {
            console.log(e.data);
            goToPage(`/member/ban/detail?mbrSn=${e.data.mbrSn}&&mskgnRlsYn=${(state.mskgnRlsYn ? 'Y' : 'N')}`);
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
        const downConfirm = (type, con) => {
            console.log(type, con);
            if (type === 'pass') {
                state.download.pass = con;
            } else {
                state.download.reason = con;
            }
        };
        //파트너 선택
        const selectPartner = (data) => {
            state.partnerName = data;
            console.log(data);
        };
        // 모달창 닫기
        const modalControl = (type, modalName) => {
            if (modalName === 'isPartnerShow') {
                isPartnerShow.value = false;
            } else if (modalName === 'isDownShow') {
                isDownShow.value = false;
                console.log(formData);
                fileDown(state.download);
            } else if (!modalName) {
                isPartnerShow.value = false;
                isDownShow.value = false;
            }
            console.log(type, modalName);
        };
        // 엑셀용 함수
        const exelParams = reactive({
            params: {
                inqType: computed(() => formData.inqType),
                bgnDate: computed(() => formData.bgnDate),
                endDate: computed(() => formData.endDate),
                mbrStCd: computed(() => formData.mbrStCd),
                cnSercSe: computed(() => formData.cnSercSe),
                cnSercCts: computed(() => formData.cnSercCts),
                menuCode: computed(() => formData.menuCode)
            },
            url: '/common/api/v1/user/secessionUserList/excel'

        });
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
            openModal,
            pager,
            state,
            formData,
            initColum,
            dateSearchSingle,
            dateSearch,
            onChangedPage,
            onSelectPicker,
            selectedOptions,
            selectedOptions_list,
            openMoreSerch,
            modalControl,
            onCellClicked,
            resetTable,
            checkOptions,
            downConfirm,
            selectPartner,
            reloadList,
            onInitDate,
            menuInfo,
            exelParams,
            onChangeDownRol

        };
    }
};

</script>