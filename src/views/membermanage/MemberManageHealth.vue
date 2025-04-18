<template>
    <section>
        <!-- 검색 -->
        <div class="ui-data-filter">
            <div class="form-item">
                <dateSerch :dateTitle="'기간조회'" @onSelectDate="onSelectPicker" :pickerOnly="false" :setDay="state.setDay"
                    ref="dateSearch"
                    :selectOptions="[{ label: '가입일자', value: 'jnDate' }, { label: '수정일자', value: 'utDate' }]" />
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
                                <commselect :className="'sm'" :selectType="'searchCode.mbrStCd'"
                                    @changedValue="selectedOptions" :initData="formData.mbrStCd" />
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
                        <label>연령대</label>
                        <span class="input">
                            <span class="dv">
                                <!-- 검색조건에 없음 -->
                                <commselect :selectType="'searchCode.agelist'" :initData="formData.aggpCd"
                                    @changedValue="selectedOptions" />

                            </span>
                        </span>
                    </div>
                    <div class="item">
                        <label>성별</label>
                        <span class="input">
                            <span class="dv">
                                <span class="radio">
                                    <input id="service01" name="openRdo" type="radio" v-model="formData.mbrSexCd" value=""
                                        @change="allCheck">
                                    <label for="service01">전체</label>
                                </span>
                                <commradio :selectType="'searchCode.mbrSexCd'" :initData="formData.mbrSexCd"
                                    @changedValue="selectedOptions" ref="sexRadio" />
                            </span>
                        </span>
                    </div>
                    <div class="item">
                        <label>마케팅수신동의</label>
                        <span class="input">
                            <span class="dv">
                                <span class="checkbox">
                                    <input id="columChk1" name="columChkGroup" type="checkbox" v-model="state.infAgrmAllYn"
                                        @change="allCheckMarketing(state.infAgrmAllYn)">
                                    <label for="columChk1">전체</label>
                                </span>
                                <span class="checkbox">
                                    <input id="columChk2" name="columChkGroup" type="checkbox" v-model="state.infAgrmCpmYn">
                                    <label for="columChk2">PUSH</label>
                                </span>
                                <span class="checkbox">
                                    <input id="columChk3" name="columChkGroup" type="checkbox" v-model="state.infAgrmSmsYn">
                                    <label for="columChk3">SMS</label>
                                </span>
                                <span class="checkbox">
                                    <input id="columChk4" name="columChkGroup" type="checkbox"
                                        v-model="state.infAgrmEmailYn">
                                    <label for="columChk4">EMAIL</label>
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

                    <button type="button" class="btn btn-opt-ico fit" @click="sizeToFit">
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
            <NoData :nodatatext="'조회된 데이터가 없습니다.'" v-if="state.memberInfoList.length === 0"></NoData>
            <div v-else>
                <AgGridVue :columnDefs="state.tableColum_c" :rowData="state.memberInfoList"
                    :defaultColDef="state.defaultColDef" @grid-ready="onGridReady" @cell-clicked="onCellClicked" class="ag-theme-alpine"
                    :domLayout="state.domLayout" style="width:100%">
                </AgGridVue>
                <PageNavigation :cntPerPage='pager.size' :itemCount='pager.totalCnt' :currentPage="pager.current"
                    @changedPage="onChangedPage" />
            </div>

        </div>
        <!-- 고객사검색 -->
        <DefaultModal :isShow="isPartnerShow" :modalTitle="'파트너 조회'" :buttonConfirm="'닫기'" :buttonCancel="''"
            :modalName="'isPartnerShow'" @modalclose="modalControl">
            <template #modalcontent>
                <PartnerSerch @selectPartner="selectPartner" />
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
import { getCurrentInstance, computed, reactive, inject, onMounted, ref, watchEffect, onUnmounted, watch } from 'vue';
import DefaultModal from '@/plugins/modal/modal/DefaultModal.vue';
import DateSerch from '@/components/ui/DateSerch.vue';
import { useCommFunc } from '@/core/helper/common.js';
import { authCommFunc } from '@/core/helper/authComm.js';
import { format } from 'date-fns';
import { useStore } from 'vuex';
import { _getMemberInfoList } from '@/api/memberinfo.js';
export default {
    components: { DefaultModal, DateSerch },
    setup() {
        const internalInstance = getCurrentInstance();
        const $Modal = inject('$Modal');
        const dayJS = inject('dayJS');
        const store = useStore();
        const dateSearchSingle = ref(null);
        const dateSearch = ref(null);
        const sexRadio = ref(null);
        const { goToPage, tableResize, openModal } = useCommFunc();
        const initColum = ref([
            {
                headerName: '번호',
                field: 'no',
                maxWidth: 80,
                valueGetter: 'node.rowIndex + 1',
                suppressSizetoFit: true
            },
            { headerName: '회원명', field: 'mbrNm' },
            { headerName: '회원번호', field: 'mbrSn' },
            { headerName: '회원상태', field: 'mbrSt' },
            {
                headerName: '성별',
                field: 'mbrSexCd',
                valueGetter: (params) => {
                    if (params.data.mbrSexCd === '109001') {
                        return '남성';
                    } else if (params.data.mbrSexCd === '109002') {
                        return '여성';
                    }
                }
            },
            { headerName: '생년월일', field: 'mbrBrth', maxWidth: 100 },
            // { headerName: '닉네임 ', field: 'mbrNcknm', maxWidth: 150 },
            { headerName: '연령대', field: 'aggp', maxWidth: 100 },
            { headerName: '휴대폰번호', field: 'mbrHhpno' },
            { headerName: '개인이메일', field: 'mbrEmad', maxWidth: 100 },
            { headerName: '기업명', field: '' },
            // { headerName: '가입일자', field: 'mbrJnDt', maxWidth: 150 },
            // { headerName: '최종로그인일자', field: 'ltlyLgnDt', maxWidth: 200 },
            {
                headerName: '가입일자',
                field: 'mbrJnDt',
                maxWidth: 150,
                valueGetter: (params) => {
                    return dayJS(params.data.mbrJnDt).format('YYYY-MM-DD HH:mm:ss');
                }
            },
            {
                headerName: '최종로그인일자',
                field: 'ltlyLgnDt',
                maxWidth: 200,
                valueGetter: (params) => {
                    return params.data.ltlyLgnDt ? dayJS(params.data.ltlyLgnDt).format('YYYY-MM-DD HH:mm:ss') : '';
                }
            },
            { headerName: '개인정보유효기간만료일자', field: 'pinfClctUseAgrmXpDt' },
            {
                headerName: '마케팅 수신동의',
                maxWidth: 450,
                children: [
                    { headerName: 'AppPush', field: 'infAgrmDtCpmYn' },
                    { headerName: 'SMS', field: 'infAgrmDtSmsYn' },
                    { headerName: 'E-Mail', field: 'infAgrmDtEmailYn' }
                ]
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
        const { onChangeMaskingRol, onChangeDownRol } = authCommFunc();
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
            gridApi: null,
            openMore: false,
            partnerName: '',
            setDay: '1month',
            startDay: '',
            endDay: '',
            searchcnSercSe: [
                { label: '전체', value: '' },
                { label: '회원명', value: 'mbrNm' },
                { label: '회원번호', value: 'mbrSn' },
                { label: '아이디', value: 'mbrJnMthAcsId' }
                // { label: '휴대폰번호', value: 'mbrHhpno' }
            ],
            ageList: [
                { label: '전체', value: '' },
                { label: '10대', value: '10대' },
                { label: '20대', value: '20대' },
                { label: '30대', value: '30대' },
                { label: '40대', value: '50대' },
                { label: '50대', value: '50대' },
                { label: '60대', value: '60대' },
                { label: '70대', value: '70대' }
            ],
            memberInfoList: [],
            pagesize: 10,
            pnltAplYn: false,
            kbAffiYn: false,
            mskgnRlsYn: true,
            mskgnTried: false, // 마스킹 해제 여부 ( 1회 실행 가능 - 1회 마스킹해제 시 제 실행 불가 )
            memberAge: '',
            infAgrmAllYn: false,
            infAgrmCpmYn: false,
            infAgrmSmsYn: false,
            infAgrmEmailYn: false
        });
        const formData = reactive({
            inqType: 'jnDate', // 기간조회타입
            bgnDate: computed(() => state.startDay), // 시작일
            endDate: computed(() => state.endDay), // 종료일
            mbrStCd: '',  // 회원상태코드 (104001: 정상)
            aggpCd: '', //연령대 코드 
            mbrSexCd: '', // 성별코드 (109001: 남성, 109002: 여성)
            infAgrmAllYn: computed(() => state.infAgrmAllYn ? 'Y' : 'N'), // 마케팅수신동의 (전체)
            infAgrmCpmYn: computed(() => state.infAgrmCpmYn ? 'Y' : 'N'), //마케팅수신동의 (Push)
            infAgrmSmsYn: computed(() => state.infAgrmSmsYn ? 'Y' : 'N'), //마케팅수신동의 (Sms)
            infAgrmEmailYn: computed(() => state.infAgrmEmailYn ? 'Y' : 'N'), //마케팅수신동의 (Email)
            cnSercSe: '', //조건검색구분 (mbrNm: 회원명, mbrSn: 회원순번, mbrJnMthAcsId: 아이디, mbrHhpno: 휴대폰번호)
            cnSercCts: '', //조건검색내용
            mskgnRlsYn: computed(() => state.mskgnRlsYn ? 'Y' : 'N'), //마스킹해제여부(Y/N)
            menuCode: computed(() => menuInfo.value.menuCode)
        });
        onMounted(async () => {
            if (menuInfo.value.menuCode) {
                getMemberInfoList();
            }
            //마스킹 권한 확인 후 리스트조회
            emitter.$on('onChangeMskgn', onChangeMskgn);

        });
        //메뉴 코드 감지

        watch([menuInfo, formData], async () => {
            if (menuInfo.value.menuCode) {
                getMemberInfoList();
            }
            console.log('change formData');
            if (state.mskgnTried) {
                state.mskgnRlsYn = true;
            }
        });


        // 마스킹 해제 이벤트 버스 해제
        onUnmounted(() => {
            emitter.$off('onChangeMskgn');
        });
        // 마스킹 권한 체크
        const changeMskgnRlsYn = async () => {
            await onChangeMaskingRol(menuInfo.value.auth6MaskingYn);
        };
        //마스킹 해제 처리 후 리스트 재조회 
        const onChangeMskgn = () => {
            state.mskgnRlsYn = !state.mskgnRlsYn;
            getMemberInfoList();
        };


        //마케팅 수신 동의 변경 감지
        watchEffect(() => {
            switch (true) {
                case state.infAgrmCpmYn === false || state.infAgrmSmsYn === false || state.infAgrmEmailYn === false:
                    return state.infAgrmAllYn = false;
                case state.infAgrmCpmYn === true && state.infAgrmSmsYn === true && state.infAgrmEmailYn === true:
                    return state.infAgrmAllYn = true;
                case state.infAgrmAllYn === true:
                    return state.infAgrmCpmYn = true, state.infAgrmSmsYn = true, state.infAgrmEmailYn = true;
            }
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
            getMemberInfoList();
        };

        const initParams = () => {
            formData.inqType = 'jnDate';
            formData.mbrStCd = '';
            formData.mbrSexCd = '';
            formData.aggpCd = '';
            formData.cnSercSe = '';
            formData.cnSercCts = '';
            state.infAgrmAllYn = false;
            state.infAgrmCpmYn = false;
            state.infAgrmSmsYn = false;
            state.infAgrmEmailYn = false;
            state.mskgnRlsYn = true;
            formData.downloadPass = '';
        };
        //리스트 갯수 변경 후 리스트 재 조회
        const clearList = (num) => {
            initParams();
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
            } else if (type === 'agelist') {
                formData.aggpCd = valueCode;
            } else {
                formData[type] = valueCode;
            }
            console.log(valueCode, valueName, type);
        };

        //마케팅 전체 체크
        const allCheckMarketing = (type) => {
            if (type) {
                state.infAgrmCpmYn = true;
                state.infAgrmSmsYn = true;
                state.infAgrmEmailYn = true;
            } else {
                state.infAgrmCpmYn = false;
                state.infAgrmSmsYn = false;
                state.infAgrmEmailYn = false;
            }
        };
        //성별 전체 체크
        const allCheck = () => {
            formData.mbrSexCd = '';
            console.log('11');
            if (formData.mbrSexCd === '') {
                sexRadio.value.state.selectOption = null;
            }
        };
        // 데이터 피커 날짜 검색
        const onSelectPicker = (type, value, status) => {
            // 버튼으로 선택된 기준
            if (type === 'day') {
                state.startDay = value[0];
                state.endDay = value[1];
                formData.inqType = status;

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

            // if (status === '가입일자') {
            //     formData.inqType = 'jnDate';
            // } else if (status === '수정일자') {
            //     formData.inqType = 'utDate';
            // }
            //api호출
            console.log('선택일:' + value, '선택된 버튼:' + type, '조회기준:' + status, dayJS(formData.from).format('MM-DD'));
        };
        // 검색 초기화
        const onInitDate = () => {
            dateSearch.value.initDate();
            clearList(1);
        };
        //리스트 조회
        const getMemberInfoList = async () => {
            try {
                let params = {
                    menuCode: formData.menuCode,
                    size: pager.size,
                    offset: pager.offset,
                    inqType: formData.inqType,
                    bgnDate: formData.bgnDate,
                    endDate: formData.endDate,
                    mbrStCd: formData.mbrStCd,
                    mbrSexCd: formData.mbrSexCd,
                    aggpCd: formData.aggpCd,
                    infAgrmAllYn: formData.infAgrmAllYn,
                    infAgrmCpmYn: formData.infAgrmCpmYn,
                    infAgrmSmsYn: formData.infAgrmSmsYn,
                    infAgrmEmailYn: formData.infAgrmEmailYn,
                    cnSercSe: formData.cnSercSe,
                    cnSercCts: formData.cnSercCts,
                    mskgnRlsYn: formData.mskgnRlsYn
                };
                console.log(formData.mskgnRlsYn);
                console.log(params);
                const response = await _getMemberInfoList(params);
                console.log(response.data);
                state.memberInfoList = response.data.data.list;
                pager.totalCnt = response.data.data.totalCnt;
                state.mskgnTried = false;
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
            getMemberInfoList();
        };

        const onCellClicked = (e) => {
            console.log(e.data);
            goToPage(`/member/health_info/detail?mbrSn=${e.data.mbrSn}`);
        };

        // 삭제할 컬럼 선택
        const checkOptions = (value) => {
            state.filterCoulm = value;
        };

        // 테이블 리사이징을 위한 참조값
        const onGridReady = (params) => {
            state.gridApi = params.api;
            // state.gridColumApi = params.columnApi;
            // console.log(params.columnApi);
        };

        // 테이블 현재창에 맞춤
        const sizeToFit = () => {
            state.gridApi.sizeColumnsToFit();
        };

        // 컬럼 변경
        const resetTable = () => {
            const columlist = _.clone(initColum.value);
            state.tableColum_c = columlist.filter(item => !state.filterCoulm.includes(item.headerName));
            return state.filterCoulm;
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
            } else if (!modalName) {
                isPartnerShow.value = false;
            }
            console.log(type, modalName);
        };
        // 엑셀용 함수
        const exelParams = reactive({
            params: {
                menuCode: formData.menuCode,
                inqType: computed(() => formData.inqType),
                bgnDate: computed(() => formData.bgnDate),
                endDate: computed(() => formData.endDate),
                mbrStCd: computed(() => formData.mbrStCd),
                mbrSexCd: computed(() => formData.mbrSexCd),
                infAgrmAllYn: computed(() => formData.infAgrmAllYn),
                infAgrmCpmYn: computed(() => formData.infAgrmCpmYn),
                infAgrmSmsYn: computed(() => formData.infAgrmSmsYn),
                infAgrmEmailYn: computed(() => formData.infAgrmSmsYn),
                cnSercSe: computed(() => formData.cnSercSe),
                cnSercCts: computed(() => formData.cnSercCts),
                mskgnRlsYn: computed(() => formData.mskgnRlsYn)
            },
            url: '/common/api/v1/user/userList/excel'

        });
        
        return {
            //공통 사용
            $Modal,
            dayJS,
            goToPage,
            tableResize,
            openModal,
            menuInfo,
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
            onGridReady,
            sizeToFit,
            resetTable,
            checkOptions,
            selectPartner,
            reloadList,
            onInitDate,
            changeMskgnRlsYn,
            allCheck,
            allCheckMarketing,
            sexRadio,
            onChangeDownRol,
            exelParams

        };
    }
};

</script>