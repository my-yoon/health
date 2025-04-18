<template>
    <section>
        <!-- 검색 -->

        <div class="ui-data-filter">
            <div class="form-item">
                <!-- :selectOptions="[{ label: '전체', value: '전체' }, { label: '노출 종료일', value: '노출 종료일' }, { label: '등록일', value: '등록일' }]" /> -->
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
                                <input v-model="formData.cnSercCts" class="form-control sm" type="text"
                                    :disabled="formData.cnSercSe === ''">
                            </span>
                        </span>
                    </div>
                    <div class="item">
                        <label>팝업유형</label>
                        <span class="input">
                            <span class="dv">
                                <commselect :className="'sm'" :selectType="'searchCode.popupTyCd'"
                                    @changedValue="selectedOptions" :initData="formData.popupTyCd" />
                            </span>
                            <span class="dv">
                                <commselect :className="'sm'" :selectType="'searchCode.indnLctSeCd2'"
                                    @changedValue="selectedOptions" :initData="formData.popupTyCd" />
                            </span>
                        </span>
                    </div>
                </div>
                <div class="form-item">

                    <div class="item">
                        <label>진행상태</label>
                        <span class="input">
                            <span class="dv">
                                <commselect :className="'sm'" :selectType="'searchCode.prgStCd2'"
                                    @changedValue="selectedOptions" :initData="formData.prgStCd" />
                            </span>
                        </span>
                    </div>
                    <div class="item">
                        <label>노출대상</label>
                        <span class="input">
                            <span class="dv">
                                <span class="radio"><input id="isos1" name="openisos" type="radio" value=""
                                        v-model="formData.indnTrg"><label for="isos1">전체</label></span>
                                <!-- <commradio :className="'sm'" :selectType="'searchCode.indnTrg'"
                                    @changedValue="selectedOptions" :initData="formData.indnTrg" /> -->
                            </span>
                        </span>
                    </div>
                    <div class="item">
                        <label>노출상태 </label>
                        <span class="input">
                            <span class="dv">
                                <commselect :className="'sm'" :selectType="'searchCode.indnStCd1'"
                                    @changedValue="selectedOptions" :initData="formData.indnStCd" />
                            </span>
                        </span>
                    </div>
                    <div class="item">
                        <label>노출OS </label>
                        <span class="input">
                            <span class="dv" v-for="(item, index) in state.ositem" :key="index">
                                <span class="checkbox" @change="selectOsItem"><input :id="'isPost' + index" name="openRdo"
                                        type="checkbox" :value="item.value" v-model="state.indnOsSeCd"><label
                                        :for="'isPost' + index">{{
                                            item.label }}</label>
                                </span>
                            </span>

                        </span>
                    </div>
                </div>
            </div>
        </div>
        <!-- {{ menuInfo }} -->
        <div class="tbl-wrap">
            <div class="table-util flex space-between">
                <div class="btn-set-m flex">
                    <button type="button" class="btn btn-ss" @click="onChangeRegistRol(menuInfo.auth1RegistYn)">등록</button>
                    <button type="button" class="btn btn-ss" @click="actionBtns('isbannerOrderShow')">노출순서변경</button>
                    <button type="button" class="btn btn-ss" @click="actionBtns('isPopupStop')">그만보기설정</button>
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
            <NoData :nodatatext="'조회된 데이터가 없습니다.'" v-if="state.popuplist.length === 0"></NoData>
            <div v-else>
                <AgGridVue :columnDefs="state.tableColum_c" :rowData="state.popuplist" :defaultColDef="state.defaultColDef"
                    @cell-clicked="onCellClicked" class="ag-theme-alpine" :domLayout="state.domLayout" style="width:100%">
                </AgGridVue>
                <PageNavigation :cntPerPage='pager.size' :itemCount='pager.totalCnt' :currentPage="pager.current"
                    @changedPage="onChangedPage" />
            </div>

        </div>
        <DefaultModal :buttonCancel="'취소'" :buttonConfirm="'저장'" :isShow="isbannerOrderShow"
            :modalName="'isbannerOrderShow'" :modalTitle="'노출순서변경'" @modalclose="modalControl" :className="'wide'">
            <template #modalcontent>
                <PopupOrder @onChangeOrder="onChangeOrder" />
            </template>
        </DefaultModal>
        <!-- 팝업 그만보기 -->
        <DefaultModal :isShow="isPopupStop" :modalTitle="'팝업그만보기 설정'" :buttonConfirm="'저장'" :buttonCancel="'닫기'"
            :modalName="'isPopupStop'" @modalclose="modalControl">
            <template #modalcontent>
                <div class="tbl-wrap">
                    <table class="table reg">
                        <colgroup>
                            <col style="width: 120px;">
                            <col style="width: auto;">
                        </colgroup>
                        <thead>
                            <tr>
                                <th scope="col" style="text-align:center">팝업유형</th>
                                <th scope="col" style="text-align:center">그만보기 설정</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <th scope="row" class="t-center">바텀팝업</th>
                                <td>
                                    <div class="reg-group">
                                        <div class="reg-item">
                                            <span class="radio">
                                                <input id="notToday1-1" name="notToday1Group" type="radio" value="Y"
                                                    v-model="state.btmPopupTodayStvwYn">
                                                <label for="notToday1-1">오늘 그만보기</label>
                                            </span>
                                            <span class="radio">
                                                <input id="notToday1-2" name="notToday1Group" type="radio" value="N"
                                                    v-model="state.btmPopupTodayStvwYn">
                                                <label for="notToday1-2">없음</label>
                                            </span>
                                        </div>
                                    </div>
                                </td>
                            </tr>
                            <tr>
                                <th scope="row" class="t-center">레이어팝업</th>
                                <td>
                                    <div class="reg-group">
                                        <div class="reg-item">
                                            <span class="radio">
                                                <input id="notToday2-1" name="notToday2Group" type="radio" value="Y"
                                                    v-model="state.layerPopupTodayStvwYn">
                                                <label for="notToday2-1">오늘 그만보기</label>
                                            </span>
                                            <span class="radio">
                                                <input id="notToday2-2" name="notToday2Group" type="radio" value="N"
                                                    v-model="state.layerPopupTodayStvwYn">
                                                <label for="notToday2-2">없음</label>
                                            </span>
                                        </div>
                                    </div>
                                </td>
                            </tr>
                            <tr>
                                <th scope="row" class="t-center">전면노출팝업</th>
                                <td>
                                    <div class="reg-group">
                                        <div class="reg-item">
                                            <span class="radio">
                                                <input id="notToday3-1" name="notToday3Group" type="radio"
                                                    v-model="state.frpgIndnPopupTodayStvwYn" value="Y">
                                                <label for="notToday3-1">오늘 그만보기</label>
                                            </span>
                                            <span class="radio">
                                                <input id="notToday3-2" name="notToday3Group" type="radio"
                                                    v-model="state.frpgIndnPopupTodayStvwYn" value="N">
                                                <label for="notToday3-2">없음</label>
                                            </span>
                                        </div>
                                    </div>
                                </td>
                            </tr>
                            <tr>
                                <th scope="row" class="t-center">최종 수정자</th>
                                <td>{{ state.popupSetting.lastUpdrLvlNm }}({{ state.popupSetting.lastUpdrNm }})</td>
                            </tr>
                            <tr>
                                <th scope="row" class="t-center">최종 수정일자</th>
                                <td>{{ state.popupSetting.lastUpdrDt }}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
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
import { _getExhibitPopup, _setExhibitOrder, _stopExhibitPopup, _getStopExhibitPopup, _getOrderExhibitPopup } from '@/api/exhibit.js';
import DefaultModal from '@/plugins/modal/modal/DefaultModal.vue';
import DateSerch from '@/components/ui/DateSerch.vue';
import PopupOrder from './components/PopupOrder.vue';

export default {
    components: { DefaultModal, DateSerch, PopupOrder },
    setup() {
        const internalInstance = getCurrentInstance();
        const $Modal = inject('$Modal');
        const dayJS = inject('dayJS');
        const store = useStore();
        const dateSearch = ref(null);
        const isbannerOrderShow = ref(null);
        const isPopupStop = ref(null);
        const { goToPage, fileDown, tableResize, openModal } = useCommFunc();
        const initColum = ref([
            {
                headerName: '번호',
                field: 'no',
                maxWidth: 80,
                valueGetter: 'node.rowIndex + 1',
                suppressSizetoFit: true
            },
            { headerName: '팝업유형', field: 'popupTySeNm' },
            { headerName: '노출위치', field: 'popupIndnLctSeNm' },
            { headerName: '제목', field: 'ttl' },
            {
                headerName: '내용',
                field: 'ctsTxt',
                maxWidth: 150,
                cellRenderer: (params) => {
                    const tagString = `<img src="${params.data.imgFlUrl}" style="width:100px">`;
                    const buttonTarget = document.createElement('div');
                    if (params.data.ctsImgYn === 'Y') {
                        buttonTarget.innerHTML = tagString;
                        return buttonTarget;
                    } else {
                        return buttonTarget.innerHTML = params.data.ctsTxt;

                    }

                }
            },

            { headerName: '진행상태', field: 'popupPrgStSeNm', maxWidth: 100 },
            { headerName: '노출대상', field: 'popupIndnTrgSeNm', maxWidth: 100 },
            { headerName: '노출상태', field: 'popupIndnStSeNm', maxWidth: 100 },
            { headerName: 'OS', field: 'indnOsSeNm', maxWidth: 100 },
            {
                headerName: '노출기간',
                field: 'popupIndnBgnDt',
                maxWidth: 100,
                valueGetter: (params) => {
                    return params.data.popupIndnBgnDt + '~' + params.data.popupIndnEndDt;
                }
            },
            { headerName: '팝업코드', field: 'popupTySeCd', maxWidth: 100 },
            { headerName: '등록자', field: 'fstRgtrNm', maxWidth: 100 },
            { headerName: '등록일자', field: 'fstRgtrDt', maxWidth: 140 },
            { headerName: '최종 수정자', field: 'lastUpdrNm', maxWidth: 100 },
            { headerName: '최종 수정일자', field: 'lastUpdrDt', maxWidth: 100 }
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
            popuplist: [],
            // orderPopuplist: [],
            searchcnSercSe: [
                { label: '전체', value: '' },
                { label: '제목', value: 'ttl' },
                { label: '팝업코드', value: 'popupSn' }
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
            btmPopupTodayStvwYn: 'Y',
            layerPopupTodayStvwYn: 'Y',
            frpgIndnPopupTodayStvwYn: 'Y',
            popupSetting: {},
            menuCode: computed(() => menuInfo.value.menuCode),
            ositem: [
                { label: '전체', value: '275003' },
                { label: 'iOS', value: '275001' },
                { label: 'Android', value: '275002' }
            ],
            indnOsSeCd: [],
            indnOsSeCdText: null

        });

        const formData = reactive({
            inqType: 'indnBgnDt', // 기간조회 = [노출 시작일: indnBgnDt, 노출 종료일: indnEndDt, 등록일: fstRgtrDt]
            bgnDate: computed(() => state.startDay), // 시작일
            endDate: computed(() => state.endDay), // 종료일
            cnSercSe: 'ttl', // 검색옵션 = [제목(ttl), 팝업코드(popupSn)]
            cnSercCts: '', // 검색내용
            popupTyCd: '', // 팝업유형 [268005:바텀팝업, 268006:레이어팝업, 268007:전면노출팝업]
            indnLctSeCd: '', // 노출페이지 [269023:투데이, 269024:건강, 269025:챌린지, 269026:커뮤니티]
            prgStCd: '', // 진행상태 [271006:대기, 271007:진행중, 271008:종료]
            indnTrg: '', // 노출대상 [274002:전체B2C회원, 274003:회원그룹]
            indnStCd: '', // 노출상태 [270002:노출, 270003:비노출],
            indnOsSeCd: computed(() => state.indnOsSeCdText), // 노출OS [275001:iOS, 275002:Android, 275003:전체]
            exhbPopupStvwStngSn: '', // 팝업그만보기설정순번
            btmPopupTodayStvwYn: computed(() => state.btmPopupTodayStvwYn), // 바텀팝업 오늘그만보기 [ Y/N 
            layerPopupTodayStvwYn: computed(() => state.layerPopupTodayStvwYn), // 레이어팝업 오늘그만보기 [ Y/N ]
            frpgIndnPopupTodayStvwYn: computed(() => state.frpgIndnPopupTodayStvwYn), // 전면노출팝업 오늘그만보기 [ Y/N ],
            menuCode: computed(() => state.menuCode)

        });

        watch(formData, () => {
            resetState();
        });

        onMounted(() => {
            getExhibitPopup();
            //등록 권한 확인 후  페이지 이동
            emitter.$on('onChangeRegist', onChangeRegist);
        });
        onUnmounted(() => {
            emitter.$off('onChangeRegist');
        });
        const onChangeRegist = () => {
            goToPage('/display/popup/regist');
        };
        const resetState = () => {
            state.isCheckTermsName = false; // 중복확인
            state.validState.errState = false; // validation
            state.validState.message = '';
        };

        /**
         * 노출순서 변경 input[number] 수정 했을 때
         */
        const onChangeOrder = (updateItem) => {
            console.log(updateItem);
            state.seqGroup = updateItem;
            resetState();
        };
        const selectOsItem = () => {
            console.log(state.indnOsSeCd);
            state.indnOsSeCdText = Array.from(state.indnOsSeCd).join(',');
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
            getExhibitPopup();
        };

        //셀렉트박스 선택
        const selectedOptions_list = (value, type) => {
            if (type === 'page') {
                state.pagesize = value;
                clearList(1);
            }
        };
        // 공통코드 셀렉트indnStCd1
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
            } else if (type === 'indnLctSeCd2') { // 팝업유형 (indnLctSeCd: banner, indnLctSeCd2: popup)
                formData.indnLctSeCd = valueCode;
            } else if (type === 'prgStCd2') { // 진행상태 (prgStCd: banner, prgStCd2: popup)
                formData.prgStCd = valueCode;
            } else if (type === 'indnStCd1') {
                formData.indnStCd = valueCode;
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
            console.log('선택일:' + value, '선택된 버튼:' + type, '조회기준:' + status, dayJS(formData.from).format('MM-DD'));
        };
        // 데이터 피커 초기화
        const onInitDate = () => {
            initParams();
            dateSearch.value.initDate();
            //재조회  api 호출
            clearList(1);
        };


        const actionBtns = async (type) => {
            if (type === 'isbannerOrderShow') {
                isbannerOrderShow.value = true;
                // getOrderExhibitPopup();
            }
            if (type === 'isPopupStop') {
                isPopupStop.value = true;
                getStopExhibitPopup();
            }

        };
        const orderFormData = reactive({
            exhbSe: 'P', //전시 유형
            exhbTyCd: '268005',
            indnLctSeCd: '', //팝업 : {269023:투데이, 269024:건강, 269025:챌린지, 269026:커뮤니티}
            indnLctDtlSeCd: '',
            prgStCd: '', //팝업 : {271006:대기, 271007:진행중}
            indnTrg: ''
        });

        //리스트 조회
        const getExhibitPopup = async () => {
            try {
                let params = {
                    size: pager.size,
                    offset: pager.offset,
                    inqType: formData.inqType,
                    bgnDate: formData.bgnDate,
                    endDate: formData.endDate,
                    cnSercSe: formData.cnSercSe,
                    cnSercCts: formData.cnSercCts,
                    popupTyCd: formData.popupTyCd,
                    indnLctSeCd: formData.indnLctSeCd,
                    prgStCd: formData.prgStCd,
                    indnTrg: formData.indnTrg,
                    indnStCd: formData.indnStCd,
                    indnOsSeCd: formData.indnOsSeCd,
                    menuCode: formData.memuCode
                };
                console.log(params);
                const response = await _getExhibitPopup(params);
                pager.totalCnt = response.data.data.totalCnt;
                state.popuplist = response.data.data.list;

                console.log(response.data, state.seqGroup);
            } catch (error) {
                console.log(error);
            }
        };
        //순서변경
        const setExhibitOrder = async () => {
            try {
                formData.seqGroup = state.seqGroup;
                let params = {
                    exhbType: 'P',
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
        //팝업조회
        const getStopExhibitPopup = async () => {
            try {
                const response = await _getStopExhibitPopup();
                console.log(response.data.data);
                state.popupSetting = response.data.data;
                formData.exhbPopupStvwStngSn = response.data.data.exhbPopupStvwStngSn;
                state.btmPopupTodayStvwYn = response.data.data.btmPopupTodayStvwYn;
                state.layerPopupTodayStvwYn = response.data.data.layerPopupTodayStvwYn;
                state.frpgIndnPopupTodayStvwYn = response.data.data.frpgIndnPopupTodayStvwYn;
            }
            catch (error) {
                console.log(error);
            }
        };
        //팝업 그만보기 설정
        const stopExhibitPopup = async () => {
            try {
                let params = {
                    exhbPopupStvwStngSn: formData.exhbPopupStvwStngSn,
                    btmPopupTodayStvwYn: formData.btmPopupTodayStvwYn,
                    layerPopupTodayStvwYn: formData.layerPopupTodayStvwYn,
                    frpgIndnPopupTodayStvwYn: formData.frpgIndnPopupTodayStvwYn
                };
                const response = await _stopExhibitPopup(params);
                console.log(response);
            }
            catch (error) {
                console.log(error);
            }
        };



        const initParams = () => {
            formData.inqType = 'indnBgnDt';
            formData.cnSercSe = 'ttl';
            formData.cnSercCts = '';
            formData.popupTyCd = '';
            formData.indnLctSeCd = '';
            formData.indnTrg = '';
            formData.prgStCd = '';
            formData.indnStCd = '';
            state.indnOsSeCd = [];
        };
        //리스트 갯수 변경 후 리스트 재 조회
        const clearList = (num) => {
            initParams();
            onChangedPage(num);
            dateSearch.value.initDate();
        };
        // 상세 검색 열기
        const openMoreSerch = () => {
            console.log(state.openMore);
            state.openMore = !state.openMore;
        };
        //검색조건에 따른 리스트 재조회
        const reloadList = () => {
            pager.current = 1;
            onChangedPage(pager.current);
        };

        const onCellClicked = (e) => {
            console.log(e.data);
            goToPage(`/display/popup/detail?sn=${e.data.indnSqn}&exhbPopupMngSn=${e.data.exhbPopupMngSn}`);
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
        // 모달창 닫기
        const modalControl = (type, modalName) => {
            if (modalName === 'isbannerOrderShow') {
                // console.log(validCheck());
                if (type === 'modalconfirm') {
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

            } else if (modalName === 'isPopupStop') {
                if (type === 'modalclose' || type === 'modalcancel') {
                    isPopupStop.value = false;
                }
                if (type === 'modalconfirm') {
                    isPopupStop.value = false;
                    $Modal.confirm({
                        title: '',
                        message: '저장하시겠습니까?.',
                        buttonText: {
                            confirm: '확인',
                            cancel: '취소'
                        }
                    })
                        .then(success => {
                            stopExhibitPopup();
                        })
                        .catch(error => {
                            console.log(error);
                            isPopupStop.value = true;
                        });

                }
            } else if (!modalName) {
                isbannerOrderShow.value = false;
                isPopupStop.value = false;
            }
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
                popupTyCd: computed(() => formData.popupTyCd),
                prgStCd: computed(() => formData.prgStCd),
                indnTrg: computed(() => formData.indnTrg),
                indnStCd: computed(() => formData.indnStCd)
            },
            url: '/common/api/v1/exhibit/popups/excel'

        });
        return {
            //공통 사용
            $Modal,
            dayJS,
            goToPage,
            fileDown,
            tableResize,
            isPopupStop,
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
            selectPartner,
            reloadList,
            actionBtns,
            checkValidState,
            onChangeOrder,
            orderFormData,
            selectOsItem,
            menuInfo,
            onChangeDownRol,
            onChangeRegistRol,
            excelParams


        };
    }
};

</script>