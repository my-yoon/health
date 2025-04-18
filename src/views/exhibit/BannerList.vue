<template>
    <section>
        <!-- 검색 -->
        <div class="ui-data-filter">
            <div class="form-item">
                <dateSerch :dateTitle="'기간조회'" @onSelectDate="onSelectPicker" :pickerOnly="false" :setDay="state.setDay"
                    ref="dateSearch"
                    :selectOptions="[{ label: '노출 시작일', value: '노출 시작일' }, { label: '노출 종료일', value: '노출 종료일' }, { label: '등록일', value: '등록일' }]" />
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
                    <div class="item">
                        <label>배너유형</label>
                        <span class="input">
                            <span class="dv">
                                <commselect :className="'sm'" :selectType="'searchCode.bnrTyCd'"
                                    @changedValue="selectedOptions" :initData="formData.bnrTyCd" />
                            </span>
                            <span class="dv">
                                <select class="custom-select sm" v-model="formData.indnLctSeCd">
                                    <option v-for="(item, index) in state.searchindnLctSeCd" :key="index"
                                        :value="item.value">
                                        {{ item.label }}
                                    </option>
                                </select>
                            </span>
                        </span>
                    </div>
                </div>
                <div class="form-item">
                    <div class="item">
                        <label>진행상태</label>
                        <span class="input">
                            <span class="dv">
                                <commselect :className="'sm'" :selectType="'searchCode.prgStCd'"
                                    @changedValue="selectedOptions" :initData="formData.prgStCd" />
                            </span>
                        </span>
                    </div>
                    <div class="item">
                        <label>노출대상</label>
                        <span class="input">
                            <span class="dv">
                                <span class="radio"><input id="isPost1" name="service274001" type="radio" value=""
                                        v-model="formData.indnTrg"><label for="isPost1">전체</label></span>
                                <commradio :className="'sm'" :selectType="'searchCode.indnTrg'"
                                    @changedValue="selectedOptions" :initData="formData.indnTrg" />
                            </span>
                        </span>
                    </div>
                    <div class="item">
                        <label>노출상태 </label>
                        <span class="input">
                            <span class="dv">
                                <commselect :className="'sm'" :selectType="'searchCode.indnStCd'"
                                    @changedValue="selectedOptions" :initData="formData.indnStCd" />
                            </span>
                        </span>
                    </div>
                </div>
            </div>
        </div>

        <div class="tbl-wrap">
            <div class="table-util flex space-between">
                <div class="btn-set-m flex">
                    <!-- @click="goToPage('/display/banner/regist')" -->
                    <button type="button" class="btn btn-ss" @click="onChangeRegistRol(menuInfo.auth1RegistYn)">등록</button>
                    <button type="button" class="btn btn-ss" @click="actionBtns('isbannerOrderShow')">노출순서변경</button>
                </div>
                <div class="btn-set-m flex align-end">
                    <span class="table-total">조회결과 총 <strong>{{ pager.totalCnt }}</strong>건</span>
                    <button type="button" class="btn btn-opt"
                        @click="onChangeDownRol(menuInfo.auth5DownloadYn, 'Y', excelParams)">
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
            <NoData :nodatatext="'조회된 데이터가 없습니다.'" v-if="state.bannerlist.length === 0"></NoData>
            <div v-else>
                <AgGridVue :columnDefs="state.tableColum_c" :rowData="state.bannerlist" :defaultColDef="state.defaultColDef"
                    @cell-clicked="onCellClicked" class="ag-theme-alpine" :domLayout="state.domLayout" style="width:100%">
                </AgGridVue>
                <PageNavigation :cntPerPage='pager.size' :itemCount='pager.totalCnt' :currentPage="pager.current"
                    @changedPage="onChangedPage" />
            </div>

        </div>
        <DefaultModal :buttonCancel="'취소'" :buttonConfirm="'저장'" :isShow="isbannerOrderShow"
            :modalName="'isbannerOrderShow'" :modalTitle="'노출순서변경'" @modalclose="modalControl" :className="'wide'">
            <template #modalcontent>
                <BannerOrder @onChangeOrder="onChangeOrder" />
            </template>
        </DefaultModal>

    </section>
</template>
<style scoped>
.bannerlist .ui-dragdrop-item::after {
    display: none;
}
</style>
<script>
import { getCurrentInstance, computed, reactive, inject, onMounted, ref, watch, onUnmounted } from 'vue';
import { useCommFunc } from '@/core/helper/common.js';
import { authCommFunc } from '@/core/helper/authComm.js';
import { format } from 'date-fns';
import { useStore } from 'vuex';
import { _getExhibitBanner, _setExhibitOrder } from '@/api/exhibit.js';

import DefaultModal from '@/plugins/modal/modal/DefaultModal.vue';
import DateSerch from '@/components/ui/DateSerch.vue';
import BannerOrder from './components/BannerOrder.vue';

export default {
    components: { DefaultModal, DateSerch, BannerOrder },
    setup() {
        const internalInstance = getCurrentInstance();
        const $Modal = inject('$Modal');
        const dayJS = inject('dayJS');
        const store = useStore();
        const dateSearch = ref(null);
        const isbannerOrderShow = ref(null);
        const { goToPage, tableResize, openModal } = useCommFunc();
        const initColum = ref([
            {
                headerName: '번호',
                field: 'no',
                maxWidth: 80,
                valueGetter: 'node.rowIndex + 1',
                suppressSizetoFit: true
            },
            { headerName: '유형', field: 'bnrTySeNm' },
            { headerName: '노출페이지', field: 'bnrIndnLctSeNm' },
            { headerName: '노출위치', field: 'bnrIndnLctDtlSeNm' },
            { headerName: '배너명', field: 'bnrNm' },
            {
                headerName: '배너 이미지',
                field: 'imgFlUrl',
                maxWidth: 150,
                cellRenderer: (params) => {
                    const tagString = `<img src="${params.data.imgFlUrl}">`;
                    const buttonTarget = document.createElement('div');
                    buttonTarget.innerHTML = tagString;
                    return buttonTarget;
                }
            },
            { headerName: '진행상태', field: 'bnrPrgStSeNm', maxWidth: 100 },
            { headerName: '노출대상', field: 'bnrIndnTrgSeNm', maxWidth: 100 },
            {
                headerName: '노출기간',
                field: 'bnrIndnBgnDt',
                maxWidth: 100,
                valueGetter: (params) => {
                    return params.data.bnrIndnBgnDt + '~' + params.data.bnrIndnEndDt;
                }
            },
            { headerName: '노출상태', field: 'bnrIndnStSeNm', maxWidth: 100 },
            { headerName: '배너코드', field: 'exhbBnrMngSn', maxWidth: 100 },
            { headerName: '등록자', field: 'fstRgtrNm', maxWidth: 100 },
            { headerName: '등록일자', field: 'fstRgtrDt', maxWidth: 100 },
            { headerName: '수정자', field: 'lastUpdrNm', maxWidth: 100 },
            { headerName: '최종수정일자', field: 'lastUpdrDt', maxWidth: 100 }
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

        const { onChangeMaskingRol, onChangeDownRol, onChangeRegistRol } = authCommFunc();
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
                flex: 1,
                headerClass: 'centered',
                cellClass: 'centered'
            },
            domLayout: 'autoHeight',
            openMore: false,
            download: { pass: '', reason: '' },
            pagesize: 10,
            mskgnRlsYn: false,
            setDay: '1month',
            startDay: '',
            endDay: '',
            bannerlist: [],
            searchcnSercSe: [
                { label: '배너명', value: 'bnrNm' },
                { label: '배너코드', value: 'bnrSn' }
            ],
            searchindnLctSeCd: [
                { label: '전체', value: '' },
                { label: '투데이', value: '269003' },
                { label: '건강', value: '269005' },
                { label: '챌린지', value: '269007' },
                { label: '커뮤니티', value: '269009' }
            ],
            seqGroup: [
                {
                    exhbSn: '', //전시번호
                    beforSeq: '', //변경전 노출순서
                    afterSeq: '' //변경후 노출순서
                }
            ],
            validState: {
                errState: false, // error state
                message: '', // input message
                target: ''
            },
            menuCode: computed(() => menuInfo.value.menuCode)
        });
        const formData = reactive({
            inqType: 'indnBgnDt', // 기간조회 = [노출 시작일: indnBgnDt, 노출 종료일: indnEndDt, 등록일: fstRgtrDt]
            bgnDate: computed(() => state.startDay), // 시작일
            endDate: computed(() => state.endDay), // 종료일
            cnSercSe: 'bnrNm', //검색옵션 = [배너명(bnrNm), 배너코드(bnrSn)]
            cnSercCts: '', //검색내용
            bnrTyCd: '', //배너유형 [268002:메인배너, 268003:띠배너]
            indnLctSeCd: '', // 노출페이지 [269003:투데이, 269005:건강, 269007:챌린지, 269009:커뮤니티]
            prgStCd: '', //진행상태 [271002:대기, 271003:진행중, 271004:종료]
            indnTrg: '', //노출대상 [274002:전체B2C회원, 274003:회원그룹]
            indnStCd: '', //노출상태 [270002:노출, 270003:비노출],
            exhbType: '', //전시형식 [ B:배너, P:팝업 ]
            seqGroup: [
                {
                    exhbSn: '', //전시번호
                    beforSeq: '', //변경전 노출순서
                    afterSeq: '' //변경후 노출순서
                }
            ],
            menuCode: computed(() => state.menuCode)
        });

        onMounted(() => {
            getExhibitBanner();
            //등록 권한 확인 후  페이지 이동
            emitter.$on('onChangeRegist', onChangeRegist);
        });
        onUnmounted(() => {
            emitter.$off('onChangeRegist');
        });
        const onChangeRegist = () => {
            goToPage('/display/banner/regist');
        };
        const resetState = () => {
            state.isCheckTermsName = false; // 중복확인
            state.validState.errState = false; // validation
            state.validState.message = '';
        };
        watch(formData, () => {
            resetState();
        });
        // 배너 관리 번호
        // 팝업관리 번호

        const onChangeOrder = (updateItem) => {
            state.seqGroup = updateItem;
            resetState();
        };

        // 에러체크 
        const orderCheck = (arr) => {
            let sqnSet = new Set();
            for (let i of arr) {
                console.log(i.afterSeq);
                if (sqnSet.has(i.afterSeq)) {
                    return true;
                }
                sqnSet.add(i.afterSeq);
            }
            return false;
        };

        // @validate
        const validCheck = (type) => {
            let target = ['afterSeq'];
            for (const item of target) {
                state.validState.target = item;
                if (item == 'afterSeq' && orderCheck(state.seqGroup)) {
                    state.validState.errState = true;
                    state.validState.message = '같은순번이 들어갈 수 없습니다.';
                    break;
                }
                return !state.validState.errState;
            }
        };

        const checkValidState = (type) => {
            return state.validState.target === type && state.validState.errState;
        };

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
            getExhibitBanner();
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
            if (status === '노출 시작일') {
                formData.inqType = 'indnBgnDt';
            } else if (status === '노출 종료일') {
                formData.inqType = 'indnEndDt';
            } else if (status === '등록일') {
                formData.inqType = 'fstRgtrDt';
            }
        };
        // 데이터 피커 초기화
        const onInitDate = () => {
            dateSearch.value.initDate();
            //재조회  api 호출
            clearList(1);
        };


        const actionBtns = async (type) => {
            if (type === 'isbannerOrderShow') {
                isbannerOrderShow.value = true;
            }

        };
        //리스트 조회
        const getExhibitBanner = async () => {
            try {
                let params = {
                    size: pager.size,
                    offset: pager.offset,
                    inqType: formData.inqType,
                    bgnDate: formData.bgnDate,
                    endDate: formData.endDate,
                    cnSercSe: formData.cnSercSe,
                    cnSercCts: formData.cnSercCts,
                    bnrTyCd: formData.bnrTyCd,
                    indnLctSeCd: formData.indnLctSeCd,
                    prgStCd: formData.prgStCd,
                    indnTrg: formData.indnTrg,
                    indnStCd: formData.indnStCd,
                    menuCode: formData.menuCode
                };
                console.log(params);
                const response = await _getExhibitBanner(params);
                pager.totalCnt = response.data.data.totalCnt;
                state.bannerlist = response.data.data.list;
                state.seqGroup = [];
                // for (let i = 0; i <= (response.data.data.list.length - 1); i++) {
                //     let item = {
                //         exhbSn: state.bannerlist[i].exhbBnrMngSn, //전시번호
                //         beforSeq: state.bannerlist[i].indnSqn, //변경전 노출순서
                //         afterSeq: state.bannerlist[i].indnSqn //변경후 노출순서
                //     };
                //     state.seqGroup.push(item);
                // }
                // console.log(response.data, state.seqGroup);
            } catch (error) {
                console.log(error);
            }
        };

        //순서변경
        const setExhibitOrder = async () => {
            try {
                formData.seqGroup = state.seqGroup;
                let params = {
                    exhbType: 'B',
                    seqGroup: formData.seqGroup
                };
                const response = await _setExhibitOrder(params);
                if (response.data.code === 'OK') {
                    clearList(1);
                }
                console.log(params);
            } catch (error) {
                console.log(error);
            }
        };

        const initParams = () => {
            formData.inqType = 'indnBgnDt';
            formData.cnSercSe = 'bnrNm';
            state.cnSercCts = '';
            formData.bnrTyCd = '';

            formData.prgStCd = '';
            formData.indnStCd = '';
        };
        //리스트 갯수 변경 후 리스트 재 조회
        const clearList = (num) => {
            initParams();
            onChangedPage(num);
            dateSearch.value.initDate();
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
            // getExhibitBanner();
        };

        const onCellClicked = (e) => {
            console.log(e.data);
            goToPage(`/display/banner/detail?sn=${e.data.indnSqn}&exhbBnrMngSn=${e.data.exhbBnrMngSn}`);
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
            if (modalName === 'isbannerOrderShow') {
                if (type === 'modalconfirm') {
                    console.log(state.seqGroup);

                    if (validCheck()) {
                        isbannerOrderShow.value = false;
                        $Modal.confirm({
                            title: '',
                            message: '저장하시겠습니까?',

                            buttonText: {
                                confirm: '확인',
                                cancel: '취소'
                            }
                        })
                            .then(success => {
                                if (success === 'confirm') {
                                    setExhibitOrder();
                                    state.openMore = false;
                                    clearList(1);
                                    toast('저장되었습니다.', 2000, 'success');
                                }
                                console.log(success);
                            })
                            .catch(error => {
                                console.log(error);
                            });
                    } else {
                        console.log('fail');
                        toast('같은순번이 들어갈 수 없습니다.', 2000, 'error');
                    }
                }
                if (type === 'modalclose' || type === 'modalcancel') {
                    isbannerOrderShow.value = false;
                    state.openMore = false;
                    clearList(1);
                }

            } else if (!modalName) {
                isPartnerShow.value = false;
                isDownShow.value = false;
                isbannerOrderShow.value = false;
            }
            console.log(type, modalName);
        };
        // 엑셀용 함수
        const excelParams = reactive({
            params: {
                menuCode: computed(() => formData.menuCode),
                inqType: computed(() => formData.inqType),
                bgnDate: computed(() => formData.bgnDate),
                endDate: computed(() => formData.endDate),
                cnSercSe: computed(() => formData.cnSercSe),
                cnSercCts: computed(() => formData.cnSercCts),
                bnrTyCd: computed(() => formData.bnrTyCd),
                prgStCd: computed(() => formData.prgStCd),
                indnTrg: computed(() => formData.indnTrg),
                indnStCd: computed(() => formData.indnStCd),
                exhbType: computed(() => formData.exhbType)
            },
            url: '/common/api/v1/exhibit/banners/excel'

        });
        return {
            //공통 사용
            $Modal,
            dayJS,
            goToPage,
            tableResize,
            openModal,
            pager,
            state,
            formData,
            initColum,
            dateSearch,
            isbannerOrderShow,
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
            downConfirm,
            selectPartner,
            reloadList,
            actionBtns,
            checkValidState,
            onChangeOrder,
            onChangeDownRol,
            menuInfo,
            excelParams,
            onChangeRegistRol


        };
    }
};

</script>