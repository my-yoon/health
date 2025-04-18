<template>
    <div>
        <div class="ui-section">
            <subTitleBar :subTitle="state.pageType === 'regist' ? '배너 등록' : '배너수정'" :ess="'표시는 필수항목입니다.'" />
            <div class="ui-content">
                <!-- {{ formData }} -->
                <!-- <br /><br /> -->

                <!--{{ state.bannerDetail }} -->
                <div class="tbl-wrap">
                    <table class="table reg">
                        <colgroup>
                            <col style="width: 160px;">
                            <col style="width: auto;">
                            <col style="width: 160px;">
                            <col style="width: auto;">
                        </colgroup>
                        <tbody>
                            <tr>
                                <th scope="row">배너명<span class="ess"><span class="offscreen">필수입력</span></span></th>
                                <td colspan="3">
                                    <div class="reg-group wp-100">
                                        <div class="reg-item">
                                            <input type="text" class="form-control" v-model="formData.bnrNm" maxlength="60"
                                                :class="checkValidState('bnrNm') ? 'error' : ''">
                                        </div>
                                    </div>
                                    <div v-if="checkValidState('bnrNm')">
                                        <p class="input-guide" :class="{ 'error': state.validState.errState }">
                                            {{ state.validState.message }}
                                        </p>
                                    </div>
                                </td>
                            </tr>
                            <tr>
                                <th scope="row">배너유형<span class="ess"><span class="offscreen">필수입력</span></span></th>
                                <td colspan="3">
                                    <div class="reg-group">
                                        <div class="reg-item">

                                            <commradio :className="'sm'" :selectType="'searchCode.bnrTyCd'"
                                                ref="commbnrTyCd" @changedValue="selectedOptions"
                                                :initData="formData.bnrTySeCd" />
                                        </div>
                                    </div>
                                </td>
                            </tr>
                            <tr>
                                <th scope="row">노출 위치<span class="ess"><span class="offscreen">필수입력</span></span></th>
                                <td colspan="3">
                                    <div class="reg-group wp-100">
                                        <div class="reg-item">
                                            <!-- displaylist -->
                                            <template v-for="( item, index ) in  state.displaylist " :key="index">
                                                <span class="dv">
                                                    <span class="radio">
                                                        <input :id="'bnrIndn' + index" name="bnrIndnGroup" type="radio"
                                                            v-model="formData.bnrIndnLctSeCd" :value="item.value"
                                                            @change="onChangeReste">
                                                        <label :for="'bnrIndn' + index">{{ item.label }}</label>
                                                    </span>
                                                </span>
                                                <span class="dv">
                                                    <select class="custom-select sm" v-model="formData.bnrIndnLctDtlSeCd"
                                                        :disabled="!(item.value == formData.bnrIndnLctSeCd)"
                                                        :class="checkValidState('bnrIndnLctDtlSeCd') ? 'error' : ''">
                                                        <option value="">선택하세요</option>
                                                        <template v-for="( item, idx ) in  item.select" :key="idx">
                                                            <template v-if="formData.bnrTySeCd === '268002'">
                                                                <option :value="item.value" v-if="idx === 0">
                                                                    {{ item.label }}
                                                                </option>
                                                            </template>
                                                            <template v-if="formData.bnrTySeCd === '268003'">
                                                                <option :value="item.value" v-if="idx !== 0">
                                                                    {{ item.label }}
                                                                </option>
                                                            </template>
                                                        </template>

                                                    </select>
                                                </span>
                                            </template>
                                        </div>
                                    </div>
                                    <div v-if="checkValidState('bnrIndnLctDtlSeCd')">
                                        <p class="input-guide" :class="{ 'error': state.validState.errState }">
                                            {{ state.validState.message }}
                                        </p>
                                    </div>
                                </td>
                            </tr>
                            <tr>
                                <th scope="row">노출 상태<span class="ess"><span class="offscreen">필수입력</span></span></th>
                                <td colspan="3">
                                    <div class="reg-group inline">
                                        <template v-for="( item, index ) in  state.displayType " :key="index">
                                            <div class="reg-item">
                                                <span class="radio">
                                                    <input :id="'display' + index" name="displayGroup" type="radio"
                                                        :value="item.value" v-model="formData.bnrIndnStSeCd">
                                                    <label :for="'display' + index">{{ item.label }}</label>
                                                </span>
                                            </div>
                                            <div class="reg-item" v-if="index === 0">
                                                <span class="dv">
                                                    <dateTimeSingle v-model="state.startDay" :setDay="state.startDay"
                                                        ref="dateTimeSingle1"
                                                        :disabled="!(formData.bnrIndnStSeCd === '270002')">
                                                    </dateTimeSingle>
                                                </span>
                                                <span>~</span>
                                                <span class="dv">
                                                    <dateTimeSingle v-model="state.endDay" :setDay="state.endDay"
                                                        ref="dateTimeSingle2"
                                                        :disabled="!(formData.bnrIndnStSeCd === '270002')">
                                                    </dateTimeSingle>
                                                </span>
                                            </div>
                                        </template>
                                    </div>
                                </td>
                            </tr>
                            <tr>
                                <th scope="row">배너이미지<span class="ess"><span class="offscreen">필수입력</span></span></th>
                                <td>
                                    <div class="reg-group">
                                        <div class="reg-item">
                                            <div class="btn-file">
                                                <input type="file" id="upload-file" hidden="" ref="bannerImg"
                                                    @change="fileListUp('bannerImg')">
                                                <label class="btn-up" for="upload-file">파일첨부</label>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="upload-file-box">
                                        <div class="upload-file-head flex space-between">
                                            <button type="button" class="btn del-all btn-secondary">
                                                <span class="offscreen">전체파일삭제</span>
                                            </button>
                                            <span class="name">파일명</span><span class="volume">용량</span>
                                        </div>

                                        <div class="upload-file-list" v-if="state.bannerImg.length > 0">
                                            <div class="upload-file-list-item flex space-between"
                                                v-for="( item, index ) in  state.bannerImg " :key="index">
                                                <button type="button" class="btn del btn-secondary"
                                                    @click="fileListDel('bannerImg')">
                                                    <span class="offscreen">파일삭제</span>
                                                </button>
                                                <span class="name">{{ item.name }}</span>
                                                <span class="volume">{{ (item.size / (1024 * 1024)).toFixed(1) }}
                                                    MB</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div v-if="checkValidState('bannerImg')">
                                        <p class="input-guide" :class="{ 'error': state.validState.errState }">
                                            {{ state.validState.message }}
                                        </p>
                                    </div>
                                </td>
                                <th scope="row">이미지설명<span class="ess"><span class="offscreen">필수입력</span></span></th>
                                <td>
                                    <div class="reg-group wp-100">
                                        <div class="reg-item">
                                            <input type="text" class="form-control"
                                                placeholder="텍스트 리더기로 읽을 수 있도록 이미지 내용을 입력하십시오" v-model="formData.imgDscr"
                                                :class="checkValidState('imgDscr') ? 'error' : ''">
                                        </div>
                                    </div>
                                    <div v-if="checkValidState('imgDscr')">
                                        <p class="input-guide" :class="{ 'error': state.validState.errState }">
                                            {{ state.validState.message }}
                                        </p>
                                    </div>
                                </td>
                            </tr>
                            <tr>
                                <th scope="row">랜딩 URL<span class="ess"><span class="offscreen">필수입력</span></span></th>
                                <td colspan="3">
                                    <div class="reg-group inline">
                                        <div class="reg-item wp-10">
                                            <select class="custom-select" v-model="formData.bnrLndSeCd"
                                                @change="onInputChagnge('URL', formData.bnrLndSeCd)">
                                                <option :value="item.value" v-for="( item, index ) in  state.bnrLndSeCd "
                                                    :key="index">
                                                    {{ item.label }}
                                                </option>
                                            </select>
                                        </div>
                                        <div class="reg-item wp-70">
                                            <input type="text" class="form-control" ref="bnrLndUrl" v-model="state.eventUrl"
                                                :disabled="formData.bnrLndSeCd == '272002'"
                                                :class="checkValidState('bnrLndUrl') ? 'error' : ''">
                                            <button type="button" class="btn btn-slm"
                                                :disabled="formData.bnrLndSeCd == '272003'"
                                                @click="onSearchEvent">선택</button>
                                        </div>
                                        <div class="reg-item wp-10">
                                            <select class="custom-select" v-model="formData.bnrLndActionSeCd"
                                                v-if="formData.bnrLndSeCd == '272002'">
                                                <option :value="item.value"
                                                    v-for="( item, index ) in  state.bnrLndActionSeCdtype1 " :key="index">
                                                    {{ item.label }}
                                                </option>
                                            </select>
                                            <select class="custom-select" v-model="formData.bnrLndActionSeCd"
                                                v-if="formData.bnrLndSeCd == '272003'">
                                                <option :value="item.value"
                                                    v-for="( item, index ) in  state.bnrLndActionSeCdtype2 " :key="index">
                                                    {{ item.label }}
                                                </option>
                                            </select>
                                        </div>
                                    </div>


                                    <div v-if="checkValidState('bnrLndUrl') || checkValidState('bnrLndActionSeCd')">
                                        <p class="input-guide" :class="{ 'error': state.validState.errState }">
                                            {{ state.validState.message }}
                                        </p>
                                    </div>
                                </td>
                            </tr>
                            <tr>
                                <th scope="row">노출대상<span class="ess"><span class="offscreen">필수입력</span></span></th>
                                <td colspan="3">
                                    <div class="reg-group">
                                        <div class="reg-item">
                                            <span class="radio">
                                                <input id="displayuser1" name="displayuserGroup" type="radio"
                                                    v-model="formData.bnrIndnTrgSeCd" value="274002">
                                                <label for="displayuser1">모든 사용자</label>
                                            </span>
                                        </div>
                                    </div>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <div class="ui-table-guide">
                    <span class="input-guide">이미지사이즈<br />
                        <span class="dv"> -메인배너: 343*84px(2배수 626*168, 3배수 1029*252)</span><br />
                        <span class="dv"> -띠배너 메인, 건강: 343*84px(2배수 626*168, 3배수 1029*252)</span><br />
                        <span class="dv"> -띠배너 챌린지: 343*84px(2배수 626*168, 3배수 1029*252)</span>
                    </span>
                    <span class="input-guide">업로드 파일은 최대 200KB입니다.(지원가능 이미지 확장자:jpg, jpeg, png)</span>
                    <span class="input-guide">이미지설명은 시각장애인 텍스트 리더기를 통해 읽을수 있도록 사용하는 목적이므로 가급적 자세히 정보를 입력하십시오</span>
                </div>
            </div>
            <div class="btn-bottom-set flex justify-center">
                <button type="button" class="btn btn-sl nega" @click="goToPage('/display/banner/list')">취소</button>
                <button type="button" class="btn btn-sl posi" @click="actionBtns('regist')"
                    v-if="state.pageType === 'regist'">저장</button>
                <button type="button" class="btn btn-sl posi" @click="actionBtns('edit')"
                    v-if="state.pageType === 'edit'">수정</button>
            </div>
        </div>
        <DefaultModal :buttonCancel="'닫기'" :buttonConfirm="''" :isShow="isEventShow" :modalName="'isEventShow'"
            :modalTitle="'이벤트 검색'" @modalclose="modalControl" :className="'full'">
            <template #modalcontent>
                <div>
                    <div class="ui-data-filter sm">
                        <div class="form-item">
                            <div class="form-item">
                                <div class="item">
                                    <label>조건검색</label>
                                    <span class="input">
                                        <span class="dv">
                                            <select class="custom-select" v-model="formData.cnSercSe">
                                                <option :value="item.value" v-for="( item, index ) in  state.searchOption "
                                                    :key="index">
                                                    {{ item.label }}
                                                </option>
                                            </select>
                                        </span>
                                        <span class="dv">
                                            <input type="text" class="form-control" v-model="formData.cnSercCts">
                                        </span>
                                    </span>
                                </div>

                            </div>
                            <div class="btn-filter-set">
                                <button type="button" class="btn btn-sm" @click="reloadList"><span
                                        class="ico-search"></span>조회
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
                                    <label>이벤트 유형</label>
                                    <span class="input">
                                        <select class="custom-select" v-model="formData.evntTy">
                                            <option :value="item.value" v-for="( item, index ) in  state.searchType "
                                                :key="index">
                                                {{ item.label }}
                                            </option>
                                        </select>
                                    </span>
                                </div>
                                <div class="item">
                                    <label>진행상태 </label>
                                    <span class="input">
                                        <select class="custom-select" v-model="formData.prgSt">
                                            <option :value="item.value" v-for="( item, index ) in  state.eventprogess"
                                                :key="index">
                                                {{ item.label }}
                                            </option>
                                        </select>
                                    </span>
                                </div>
                                <div class="item">
                                    <label>게시 구분 </label>
                                    <span class="input">
                                        <select class="custom-select" v-model="formData.pstYn">
                                            <option :value="item.value" v-for="( item, index ) in  state.pstYn"
                                                :key="index">
                                                {{ item.label }}
                                            </option>
                                        </select>
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="tbl-wrap">
                        <div class="table-util flex space-between">
                            <div class="btn-set-m flex"></div>
                            <div class="btn-set-m flex align-end">
                                <span class="table-total">조회결과 총 <strong>{{ pager.totalCnt }}</strong>건</span>
                            </div>
                        </div>
                        <NoData :nodatatext="'조회된 데이터가 없습니다.'" v-if="state.eventlist.length == 0"></NoData>
                        <div v-else>
                            <AgGridVue :columnDefs="state.tableColum_c" :rowData="state.eventlist"
                                :defaultColDef="state.defaultColDef" class="ag-theme-alpine" :domLayout="state.domLayout"
                                style="width:100%">
                            </AgGridVue>
                            <PageNavigation :cntPerPage='pager.size' :itemCount='pager.totalCnt'
                                :currentPage="pager.current" @changedPage="onChangedPage" />
                        </div>
                    </div>
                </div>
            </template>
        </DefaultModal>
        <DefaultModal :buttonCancel="'닫기'" :buttonConfirm="''" :isShow="isNoticeShow" :modalName="'isNoticeShow'"
            :modalTitle="'공지사항 검색'" @modalclose="modalControl" :className="'full'">
            <template #modalcontent>
                <div>
                    <div class="ui-data-filter sm">
                        <div class="form-item">
                            <div class="form-item">
                                <div class="item">
                                    <label>조건검색</label>
                                    <span class="input">
                                        <span class="dv">
                                            <select class="custom-select" v-model="formData.cnSercSe">
                                                <option :value="item.value" v-for="( item, index ) in  state.searchOption "
                                                    :key="index">
                                                    {{ item.label }}
                                                </option>
                                            </select>
                                        </span>
                                        <span class="dv">
                                            <input type="text" class="form-control" v-model="formData.cnSercCts">
                                        </span>
                                    </span>
                                </div>

                            </div>
                            <div class="btn-filter-set">
                                <button type="button" class="btn btn-sm" @click="reloadList"><span
                                        class="ico-search"></span>조회
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
                                    <label>이벤트 유형</label>
                                    <span class="input">
                                        <select class="custom-select" v-model="formData.evntTy">
                                            <option :value="item.value" v-for="( item, index ) in  state.searchType "
                                                :key="index">
                                                {{ item.label }}
                                            </option>
                                        </select>
                                    </span>
                                </div>
                                <div class="item">
                                    <label>진행상태 </label>
                                    <span class="input">
                                        <select class="custom-select" v-model="formData.prgSt">
                                            <option :value="item.value" v-for="( item, index ) in  state.eventprogess "
                                                :key="index">
                                                {{ item.label }}
                                            </option>
                                        </select>
                                    </span>
                                </div>
                                <div class="item">
                                    <label>게시 구분 </label>
                                    <span class="input">
                                        <select class="custom-select" v-model="formData.pstYn">
                                            <option :value="item.value" v-for="( item, index ) in  state.pstYn"
                                                :key="index">
                                                {{ item.label }}
                                            </option>
                                        </select>
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="tbl-wrap">
                        <div class="table-util flex space-between">
                            <div class="btn-set-m flex"></div>
                            <div class="btn-set-m flex align-end">
                                <span class="table-total">조회결과 총 <strong>{{ pager.totalCnt }}</strong>건</span>
                            </div>
                        </div>
                        <NoData :nodatatext="'조회된 데이터가 없습니다.'" v-if="state.eventlist.length == 0"></NoData>
                        <div v-else>
                            <AgGridVue :columnDefs="state.tableColum_c" :rowData="state.eventlist"
                                :defaultColDef="state.defaultColDef" class="ag-theme-alpine" :domLayout="state.domLayout"
                                style="width:100%">
                            </AgGridVue>
                            <PageNavigation :cntPerPage='pager.size' :itemCount='pager.totalCnt'
                                :currentPage="pager.current" @changedPage="onChangedPage" />
                        </div>
                    </div>
                </div>
            </template>
        </DefaultModal>
    </div>
</template>
<script>
import { reactive, inject, ref, onMounted, computed, watch } from 'vue';
import DefaultModal from '@/plugins/modal/modal/DefaultModal.vue';
import dateTimeSingle from '@/components/ui/DateTimeSingle.vue';
import { useCommFunc } from '@/core/helper/common.js';
import { useStore } from 'vuex';
import { useRouter, useRoute } from 'vue-router';
import { _getNoticeList } from '@/api/customer.js';
import { _getExhibitEvent, _registExhibitBanner, _detailExhibitBanner } from '@/api/exhibit.js';
import { _uploadFile } from '@/api/common.js';
import { format } from 'date-fns';


export default {
    components: { DefaultModal, dateTimeSingle },
    setup() {
        const $Modal = inject('$Modal');
        const dayJS = inject('dayJS');
        const dateTimeSingle1 = ref(null);
        const dateTimeSingle2 = ref(null);
        const isNoticeShow = ref(null);
        const isEventShow = ref(null);
        const bannerImg = ref(null);
        const commbnrTyCd = ref(null);
        const bnrLndUrl = ref(null);
        const { goToPage, getImageInfo } = useCommFunc();
        const store = useStore();
        const route = useRoute();
        const initColum = ref([
            {
                headerName: '번호',
                field: 'no',
                maxWidth: 70,
                valueGetter: 'node.rowIndex + 1',
                suppressSizetoFit: true
            },
            { headerName: '이벤트 제목', field: 'evntNm' },
            {
                headerName: '유형',
                field: 'evntTy',
                maxWidth: 80,
                valueGetter: (params) => {
                    return params.data.evntTy === 'GENERAL' ? '일반' : params.data.evntTy === 'QUIZ' ? '퀴즈' : params.data.evntTy === 'ROULETTE' ? '룰렛' : '출석';
                }
            },
            {
                headerName: '게시 구분',
                field: 'pstYn',
                maxWidth: 100,
                valueGetter: (params) => {
                    return params.data.pstYn === 'Y' ? '게시' : params.data.pstYn === 'N' ? '비게시' : '전체';
                }
            },
            {
                headerName: '진행상태',
                field: 'prgSts',
                maxWidth: 90,
                valueGetter: (params) => {
                    return params.data.prgSts === 'B' ? '대기' : '진행중';
                }
            },
            {
                headerName: '이벤트기간',
                field: 'evntBgnDt',
                maxWidth: 160,
                valueGetter: (params) => {
                    return dayJS(params.data.evntBgnDt).format('YYYY-MM-DD') + '~' + dayJS(params.data.evntEndDt).format('YYYY-MM-DD');
                }
            },
            { headerName: '이벤트 코드', field: 'evntSn', maxWidth: 100 },
            {
                headerName: '선택',
                maxWidth: 90,
                cellRenderer: (params) => {
                    const tagString = `<button type="button" class="btn btn-ss" id=eventselect-${params.node.rowIndex}>선택</button>`;
                    const buttonTarget = document.createElement('div');
                    buttonTarget.innerHTML = tagString;
                    const buttonEventTarget = buttonTarget.querySelector(`#eventselect-${params.node.rowIndex}`);
                    buttonEventTarget.addEventListener('click', () => {
                        console.log(params.data.evntSn);
                        state.eventName.name = params.data.evntNm;
                        state.eventName.sn = params.data.evntSn;
                        state.eventUrl = '/event/detail/prog/' + params.data.evntSn;
                        isEventShow.value = false;
                    });
                    return buttonTarget;
                }
            }
        ]);
        const state = reactive({
            bannerSn: '',
            exhbBnrMngSn: '',
            bannerDetail: {},
            bannerImg: [],
            bannerNum: 0,
            bannerOriginName: '',
            modalMsg: '',
            pageType: '',
            displaylist: [
                {
                    label: '투데이',
                    value: '269003',
                    select: [
                        { label: '최상단', value: '269004' },
                        { label: '띠배너1', value: '269013' },
                        { label: '띠배너2', value: '269014' },
                        { label: '띠배너3', value: '269015' }
                    ]
                },
                {
                    label: '건강',
                    value: '269005',
                    select: [
                        { label: '최상단', value: '269006' },
                        { label: '띠배너1', value: '269017' }
                    ]
                },
                {
                    label: '챌린지',
                    value: '269007',
                    select: [
                        { label: '최상단', value: '269008' },
                        { label: '띠배너1', value: '269019' }
                    ]
                },
                {
                    label: '커뮤니티',
                    value: '269009',
                    select: [
                        { label: '최상단', value: '269010' },
                        { label: '띠배너1', value: '269021' }
                    ]
                }
            ],
            displayType: [
                { label: '노출', value: '270002' },
                { label: '비노출', value: '270003' }
            ],
            bnrLndSeCd: [
                { label: '이벤트', value: '272002' },
                { label: '직접입력 ', value: '272003' }
            ],
            //이벤트
            bnrLndActionSeCdtype1: [
                { label: '선택하세요', value: '' },
                { label: '인앱현재창', value: '273003' },
                { label: '인앱새창 ', value: '273004' }
            ],
            //직접입력 경우
            bnrLndActionSeCdtype2: [
                { label: '선택하세요', value: '' },
                { label: '외부새창 ', value: '273008' }
            ],

            // 게시 구분
            pstYn: [
                { label: '전체', value: '' },
                { label: '게시', value: 'Y' },
                { label: '비게시', value: 'N' }
            ],

            startDay: new Date(),
            endDay: new Date().getTime() + 3600 * 1000 * 24 * 1,
            eventlist: [],
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
            validState: {
                errState: false, // error state
                message: '', // input message
                target: ''
            },
            searchOption: [
                { label: '선택하세요', value: '' },
                { label: '이벤트제목', value: 'evntNm' },
                { label: '이벤트코드', value: 'eventSn' },
                { label: '이벤트대상', value: 'evntTrg' }
            ],
            searchType: [
                { label: '선택하세요', value: '' },
                { label: '일반', value: 'GENERAL' },
                { label: '퀴즈', value: 'QUIZ' },
                { label: '룰렛', value: 'ROULETTE' },
                { label: '출석', value: 'ATTENDANCE' }
            ],
            eventprogess: [
                { label: '전체', value: '' },
                { label: '진행중', value: 'I' },
                { label: '대기', value: 'B' }
            ],
            eventName: {
                name: '',
                sn: ''
            },
            eventUrl: '',
            indnSqn: ''
        });


        onMounted(() => {

            if (route.query.sn) {
                // state.bannerSn = route.query.sn;
                state.exhbBnrMngSn = route.query.exhbBnrMngSn;
                state.pageType = 'edit';
                //수정조회
                detailExhibitBanner();
            } else {
                state.pageType = 'regist';
                // getNoticeList();
            }

        });
        const formData = reactive({
            exhbBnrMngSn: computed(() => state.exhbBnrMngSn ? state.exhbBnrMngSn : ''), //배너관리순번
            mpnSn: computed(() => state.bannerSn ? state.bannerSn : ''), //맵핑순번
            bnrNm: '', //배너명
            bnrTySeCd: '268002', //배너유형코드 [ 268002:메인배너, 268003:띠배너 ]
            bnrIndnLctSeCd: '269003', //노출위치코드 [ 269003:투데이, 269005:건강, 269007:챌린지, 269009:커뮤니티 ]
            bnrIndnLctDtlSeCd: '',
            bnrIndnStSeCd: '270002', //노출상태코드 [ 270002:노출, 270003:비노출 ]
            bnrIndnBgnDt: computed(() => state.startDay), //노출상태가 노출인 경우 노출시작일 입력
            bnrIndnEndDt: computed(() => state.endDay), //노출상태가 노출인 경우 노출종료일 입력
            imgFlSn: computed(() => state.bannerNum), //배너이미지(첨부파일순번)
            imgDscr: '', //이미지설명
            bnrIndnTrgSeCd: '274002', //노출대상코드 [ 274002:전체B2C회원, 274003:회원그룹 ]
            bnrIndnTrgSeGrp: [ //노출대상코드가 회원그룹(274003)인 경우 노출대상그룹
            ],
            bnrLndSeCd: '272002', //랜딩구분코드 [ 272002:이벤트, 272003:직접입력 ]
            bnrLndUrl: computed(() => state.eventUrl),
            lndTrgSn: computed(() => state.eventName.sn ? state.eventName.sn : ''), //랜딩구분코드가 직업입력(272003)이 아닌 경우 해당 순번
            indnSqn: computed(() => state.indnSqn),
            bnrLndActionSeCd: '',
            // 랜딩형식코드 [
            // 직접입력 = 273006:인앱현재창, 273007:인앱새창, 273008:외부새창(기본브라우저 호출)
            // 이벤트 = 273003:인앱현재창, 273004:인앱새창]

            //이벤트 검색 조건
            cnSercSe: '', // [이벤트제목(evntNm), 이벤트코드(eventSn), 이벤트대상(evntTrg)]
            cnSercCts: '',
            evntTy: '', //이벤트유형 [일반:GENERAL, 퀴즈:QUIZ, 룰렛:ROULETTE, 출석:ATTENDANCE]
            prgSt: '', //진행상태 [NONE]
            pstYn: ''//게시여부 [Y/N]
        });

        watch(formData, () => {
            resetState();
        });
        const resetState = () => {
            state.validState.errState = false; // validation
            state.validState.message = '';
        };
        // @validate
        const validCheck = (type) => {
            let target = ['bnrNm', 'bnrIndnLctDtlSeCd', 'bannerImg', 'imgDscr', 'bnrLndUrl', 'bnrLndActionSeCd'];
            for (const item of target) {
                state.validState.target = item;
                if (item === 'bnrNm') {
                    state.validState.message = '배너명을 작성해 주세요 ';
                }
                if (item === 'bnrIndnLctDtlSeCd') {
                    state.validState.message = '노출 위치를 지정해 주세요 ';
                }
                if (item === 'imgDscr') {
                    state.validState.message = '배너 이미지 설명을 작성해 주세요';
                }
                if (item === 'bnrLndUrl') {
                    state.validState.message = '랜딩 URL을 작성해 주세요';
                }
                if (item === 'bnrLndActionSeCd') {
                    state.validState.message = '노출 방식을 선택해 주세요';
                }
                if (_.isEmpty(formData[item]) && (item !== 'bannerImg')) {
                    state.validState.errState = true;
                    break;
                }
                if (item === 'bannerImg' && state.bannerImg.length === 0) {
                    state.validState.message = '배너 이미지를 등록해 주세요';
                    state.validState.errState = true;
                    break;
                }
            }
            return !state.validState.errState;
        };
        const checkValidState = (type) => {
            return state.validState.target === type && state.validState.errState;
        };
        //배너 상세 조회
        const detailExhibitBanner = async () => {
            try {
                let params = state.exhbBnrMngSn;
                const response = await _detailExhibitBanner(params);
                state.bannerDetail = response.data.data;
                formData.bnrTySeCd = response.data.data.bnrTySeCd;
                commbnrTyCd.value.state.selectOption = response.data.data.bnrTySeCd;
                formData.bnrIndnLctSeCd = response.data.data.bnrIndnLctSeCd;
                formData.bnrNm = response.data.data.bnrNm;
                formData.bnrIndnLctSeCd = response.data.data.bnrIndnLctSeCd;
                formData.bnrIndnLctDtlSeCd = response.data.data.bnrIndnLctDtlSeCd;
                formData.bnrIndnStSeCd = response.data.data.bnrIndnStSeCd;
                formData.bnrLndSeCd = response.data.data.bnrLndSeCd;
                state.eventName.name = response.data.data.bnrLndUrl;
                state.eventName.sn = response.data.data.lndTrgSn;
                state.bannerSn = response.data.data.mpnSn;
                formData.bnrLndActionSeCd = response.data.data.bnrLndActionSeCd;
                state.startDay = response.data.data.bnrIndnBgnDt.slice(0, -3);
                state.endDay = response.data.data.bnrIndnEndDt.slice(0, -3);
                state.bannerImg.push({ name: response.data.data.imgFlNm, size: response.data.data.imgFlSize });
                state.bannerOriginName = _.clone(response.data.data.imgFlNm);
                state.bannerNum = response.data.data.imgFlSn;
                state.indnSqn = response.data.data.indnSqn;
                formData.imgDscr = response.data.data.imgDscr;
                state.eventUrl = response.data.data.bnrLndUrl;
                console.log(state.bannerOriginName);
                console.log(response.data.data, commbnrTyCd.value.searchOption);


            } catch (error) {
                console.log(error);
            }
        };
        // 배너 파일업로드
        const fileListUp = async (type) => {
            state.imgType = type;
            resetState();
            let inputName = bannerImg;
            let fileType = inputName.value.files[0].type;
            state[type] = (Array.from(inputName.value.files));
            getImageInfo(state[type][0], imageSizeCallback);
            /**
             * @getImageInfo
             * callback { width, height, ratio }
             */
            function imageSizeCallback(callback) {
                console.log('callback', callback);
                if (fileType.indexOf('png') > -1 || fileType.indexOf('jpeg') > -1 || fileType.indexOf('jpg') > -1) {
                    let imgSize = null;
                    let massage = null;
                    imgSize = callback.width % 343 !== 0 && callback.height % 84 !== 0;
                    if (callback.fileSize > 200) {
                        massage = '이미지 용량을 확인 해 주세요  권장 용량: 200KB';
                    } else {
                        massage = '이미지 사이즈를 확인해 주세요  권장 이미지 사이즈:343*84px(2배수 626*168, 3배수 1029*252)';
                    }
                    if (imgSize || callback.fileSize > 200) {
                        $Modal.simple({
                            message: massage,
                            buttonText: {
                                ok: '확인'
                            }
                        })
                            .then(async (success) => {
                                console.log(success);
                                state[type] = [];
                            })
                            .catch(error => {
                                console.log(error);
                            });
                    }
                } else {
                    state[type] = [];
                    $Modal.simple({
                        message: '파일의 확장자를 확인해 주세요  (JPG, PNG만 가능합니다.)',
                        buttonText: {
                            ok: '확인'
                        }
                    });
                }
            }
        };






        /**
         * upload images 삭제
         */
        const fileListDel = () => {
            // bannerImg.value.files = [];
            state.bannerImg = [];
            bannerImg.value.files = null;

            console.log('delete image', bannerImg.value.files, bannerImg.value.files.fileList);
        };

        //파일업로드 API
        const uploadFile = async (type) => {
            console.log(type);
            const formData = new FormData();
            formData.append('file', state[type][0]);
            try {
                const response = await _uploadFile(formData);
                // console.log(response.data.fileId);
                state.bannerNum = response.data.fileId;
                console.log(formData.imgFlSn);
            } catch (error) {
                console.log(error);
            }
        };
        //배너 등록/ 수정
        const registExhibitBanner = async () => {
            try {
                let paramsComm = {
                    bnrNm: formData.bnrNm,
                    bnrTySeCd: formData.bnrTySeCd,
                    bnrIndnLctSeCd: formData.bnrIndnLctSeCd,
                    bnrIndnLctDtlSeCd: formData.bnrIndnLctDtlSeCd,
                    bnrIndnStSeCd: formData.bnrIndnStSeCd,
                    imgFlSn: formData.imgFlSn,
                    imgDscr: formData.imgDscr,
                    bnrIndnTrgSeCd: formData.bnrIndnTrgSeCd,
                    bnrIndnTrgSeGrp: formData.bnrIndnTrgSeGrp,
                    bnrLndSeCd: formData.bnrLndSeCd,
                    bnrLndUrl: formData.bnrLndUrl,
                    lndTrgSn: formData.lndTrgSn,
                    bnrLndActionSeCd: formData.bnrLndActionSeCd
                };
                // 수정시에만 배너순번, 노출순번, 맵핑순서 넘김
                let paramsEdit = {
                    exhbBnrMngSn: Number(state.exhbBnrMngSn),
                    mpnSn: Number(state.bannerSn),
                    indnSqn: formData.indnSqn
                };
                if (state.pageType === 'regist') {
                    let params = {
                        ...paramsComm,
                        ...{ bnrIndnBgnDt: formData.bnrIndnBgnDt + ':00', bnrIndnEndDt: formData.bnrIndnEndDt + ':59' }
                    };
                    console.log(params);
                    const response = await _registExhibitBanner(params);
                    if (response.data.code === 'OK') {
                        goToPage('/display/banner/list');
                    }
                }
                if (state.pageType === 'edit') {
                    let params = {
                        ...paramsComm,
                        ...{
                            bnrIndnBgnDt: formData.bnrIndnBgnDt + ':00',
                            bnrIndnEndDt: formData.bnrIndnEndDt + ':59'
                        },
                        ...paramsEdit

                    };
                    console.log(params);
                    const response = await _registExhibitBanner(params);
                    if (response.data.code === 'OK') {
                        goToPage('/display/banner/list');
                    }
                }
            } catch (error) {
                console.log(error);
            }
        };
        //노출 위치 선택시 params초기화
        const onChangeReste = () => {
            formData.bnrIndnLctDtlSeCd = '';
        };


        // 공통코드 셀렉트
        const selectedOptions = (valueCode, valueName, type) => {
            console.log(formData[type]);
            if (type === 'bnrTyCd') {
                formData.bnrTySeCd = valueCode;
            } else {
                formData[type] = valueCode;
            }
        };
        //모달창열기 
        const actionBtns = async (type) => {
            if (type === 'regist') {
                state.modalMsg = '저장하시겠습니까?';
            }
            if (type === 'edit') {
                state.modalMsg = '수정하시겠습니까?';
            }
            console.log();
            if (validCheck()) {
                // console.log(통과);
                $Modal.confirm({
                    title: '',
                    message: state.modalMsg,
                    buttonText: {
                        confirm: '확인',
                        cancel: '취소'
                    }
                })
                    .then(async (success) => {
                        console.log(success);
                        if (type === 'regist') {
                            console.log('저장');
                            await uploadFile('bannerImg');
                            await registExhibitBanner();
                        }
                        if (type === 'edit') {
                            if (state.bannerOriginName !== state.bannerImg[0].name) {
                                console.log(state.bannerImg);
                                await uploadFile('bannerImg');
                            }
                            await registExhibitBanner();
                        }
                    })
                    .catch(error => {
                        console.log(error);
                    });

            }
        };
        // 모달창 닫기
        const modalControl = (type, modalName) => {
            if (modalName === 'isEventShow') {
                isEventShow.value = false;
                state.openMore = false;
                clearList(1);
            } else if (!modalName) {
                isEventShow.value = false;
            }
        };
        //이벤트 검색
        const onSearchEvent = () => {
            getExhibitEvent();
            isEventShow.value = true;
        };

        const getNoticeList = async () => {
            try {
                let params = {
                    size: pager.size,
                    offset: pager.offset,
                    inqType: 'regDate',
                    fromDate: '2023-01-01',
                    toDate: '2023-11-01',
                    searchType: '',
                    fixed: 'N'
                };
                const response = await _getNoticeList(params);
                console.log(response);
            } catch (error) {
                console.log(error);

            }
        };
        const initParams = () => {
            formData.cnSercSe = '';
            formData.cnSercCts = '';
            formData.evntTy = '';
            formData.prgSt = '';
            formData.pstYn = '';

        };
        // 데이터 피커 초기화
        const onInitDate = () => {
            //재조회  api 호출
            clearList(1);
        };

        //리스트 갯수 변경 후 리스트 재 조회
        const clearList = (num) => {
            initParams();
            onChangedPage(num);
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
            getExhibitEvent();
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
            console.log(pagenum);
            pager.current = pagenum;
            //테이블 인덱스 번호 처리
            initColum.value[0].valueGetter = 'node.rowIndex + ' + Number(pager.size * (pager.current - 1) + 1);
            //api호출
            getExhibitEvent();
        };
        //이벤트 조회
        const getExhibitEvent = async () => {
            try {
                let params = {
                    offset: pager.offset,
                    size: pager.size,
                    cnSercSe: formData.cnSercSe,
                    cnSercCts: formData.cnSercCts,
                    evntTy: formData.evntTy,
                    prgSt: formData.prgSt,
                    pstYn: formData.pstYn
                };


                const response = await _getExhibitEvent(params);
                console.log(params);
                state.eventlist = response.data.data.list;
                pager.totalCnt = response.data.data.totalCnt;
            } catch (error) {
                coonsole.log(error);
            }
        };

        const onInputChagnge = (type, value) => {
            if (type == 'URL' && value == '272003') {
                state.eventName.name = '';
            }
        };

        return {
            //공통 사용
            $Modal,
            dayJS,
            goToPage,
            // fileDown,
            // tableResize,
            // isDownShow,
            // isPartnerShow,
            // isImgShow,
            isNoticeShow,
            // isRequestShow,
            dateTimeSingle1,
            dateTimeSingle2,
            isEventShow,
            bannerImg,
            commbnrTyCd,
            bnrLndUrl,
            state,
            formData,
            pager,
            // openModal,
            modalControl,
            actionBtns,
            selectedOptions,
            fileListUp,
            onChangeReste,
            onSearchEvent,
            checkValidState,
            onInputChagnge,
            reloadList,
            openMoreSerch,
            onInitDate,
            fileListDel,
            onChangedPage
        };
    }
};
</script>