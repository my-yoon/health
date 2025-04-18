<template>
    <div class="ui-section">
        <div class="ui-title-3">
            <h3>포인트 정책정보</h3>
            <div class="abs"><span class="ess"></span> 표시는 필수항목입니다. </div>
        </div>
        <div class="ui-content">
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
                            <th scope="row">정책정보</th>
                            <td colspan="3">
                                <div class="reg-group inline">
                                    <div class="reg-item"><input type="text" class="form-control w-100" :disabled="true"
                                            v-model="state.data.pntPlcyCd"></div>
                                    <div class="reg-item"><input type="text" class="form-control" :disabled="true"
                                            v-model="state.data.pntPlcyNm"></div>
                                    <div class="reg-item"><button type="button" class="btn btn-slm"
                                            @click="showModal('pntPlcySearch')">찾기</button></div>
                                </div>
                            </td>
                        </tr>
                        <PntDcsIssDetail :params="state.data" />
                    </tbody>
                </table>
            </div>
        </div>
    </div>

    <PntCategoryInfo :params="state.data" />

    <div class="ui-section">
        <div class="ui-title-3">
            <h3>발급시기</h3>
        </div>
        <div class="ui-content">
            <div class="tbl-wrap">
                <table class="table reg">
                    <colgroup>
                        <col style="width: 160px;">
                        <col style="width: auto;">
                    </colgroup>
                    <tbody>
                        <tr>
                            <th scope="row">발급일시</th>
                            <td>
                                <div class="reg-group inline">
                                    <div class="reg-item">
                                        <CommonBtn :btn="'radio'" :grCdId="'216000'" :val="state.data.issDtSeCd"
                                            @changedValue="(value) => state.data.issDtSeCd = value"
                                            :className="'custom-select sm'" />
                                    </div>
                                    <div class="reg-item">
                                        <DateSingle @onSelectDate="onSelectPicker" :setDay="state.data.bknIssDate"
                                            :disabled="!(state.data.issDtSeCd === '216002')" />
                                    </div>
                                </div>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
    <div class="ui-section">
        <div class="ui-title-3">
            <h3>발급대상</h3>
        </div>
        <div class="ui-content">
            <div class="tbl-wrap">
                <table class="table reg">
                    <colgroup>
                        <col style="width: 160px;">
                        <col style="width: auto;">
                    </colgroup>
                    <tbody>
                            <tr>
                                <th scope="row">발급대상</th>
                                <td>
                                    <div class="reg-group inline">
                                        <div class="reg-item">
                                            <span class="radio">
                                                <input id="sdTar1" name="issTrgCd" v-model="state.data.issTrgCd" value="217001" type="radio">
                                                <label for="sdTar1">전체 B2C회원</label>
                                            </span>
                                            <template v-if="state.data.issTrgCd == '217001'">
                                                (기준
                                                <DateSingle @onSelectDate="selectIssBstdDate"
                                                    :setDay="state.data.issBstdDate" />
                                                )
                                            </template>
                                        </div>
                                        <div class="reg-item">
                                            <span class="radio">
                                                <input id="sdTar2" name="issTrgCd" v-model="state.data.issTrgCd" value="217002" type="radio">
                                                <label for="sdTar2">회원조회</label>
                                            </span>
                                            <button type="button" class="btn btn-slm"
                                                :disabled="state.data.issTrgCd != '217002'"
                                                @click="showModal('userInfoPop')">찾기</button>
                                        </div>
                                        <!-- <div class="reg-item">
                                            <span class="radio">
                                                <input id="sdTar3" name="issTrgCd" v-model="state.data.issTrgCd" value="217003" type="radio">
                                                <label for="sdTar3">회원그룹</label>
                                            </span>
                                            <button type="button" class="btn btn-slm" :disabled="state.data.issTrgCd != '217003'" @click="showModal('userGroupPop')">찾기</button>
                                        </div> -->
                                    </div>
                                    <div class="reg-group">
                                        <div class="reg-item">
                                            <span class="radio">
                                                <input id="sdTar4" name="issTrgCd" v-model="state.data.issTrgCd" value="217004" type="radio">
                                                <label for="sdTar4">발급대상 업로드</label>
                                            </span>
                                            <div class="btn-file">
                                                <input type="file" id="upload-file" hidden="" @change="uploadFile"
                                                    :disabled="state.data.issTrgCd != '217004'">
                                                <label class="btn-up" for="upload-file">파일첨부</label>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="upload-file-box" v-if="state.data.issTrgCd == '217004'">
                                        <div class="upload-file-head flex space-between">
                                            <button type="button" class="btn del-all btn-secondary">
                                                <span class="offscreen">전체파일삭제</span>
                                            </button>
                                            <span class="name">파일명</span>
                                            <span class="volume">용량</span>
                                        </div>
                                        <div class="upload-file-list" v-if="state.data.uploadFile">
                                            <div class="upload-file-list-item flex space-between">
                                                <button type="button" class="btn del btn-secondary" @click="deleteFile">
                                                    <span class="offscreen">{{ state.data.uploadFile ? '파일삭제' : '' }}</span>
                                                </button>
                                                <span class="name">{{ state.data.uploadFile ? state.data.uploadFile.name :
                                                    '' }}</span>
                                                <span class="volume">{{ state.data.uploadFile ? (state.data.uploadFile.size /
                                                    (1024 * 1024)).toFixed(2) : '' }} MB</span>
                                            </div>
                                        </div>
                                    </div>
                                </td>
                            </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>

    <div class="btn-bottom-set flex justify-center"
        v-if="state.data.issTrgCd == '217001' || state.data.issTrgCd == '217004'">
        <button type="button" class="btn btn-sl posi" @click="getIssTrgInfo(true)">발급대상 불러오기</button>
    </div>


    <div class="ui-section" v-if="issListShow">
        <div class="ui-title-3">
            <h3>발급대상목록</h3>
            <template v-if="state.data.issTrgCd == '217004'">
                <div class="abs">
                    <button type="button" class="btn btn-opt" @click="onChangeDownRol('Y', 'Y', exelParams)">
                        <span class="ico-download"></span>오류대상 다운로드
                    </button>
                </div>
            </template>
        </div>
        <div class="ui-content">
            <template v-if="state.data.issTrgCd == '217001'">
                <div class="tbl-wrap">
                    <table class="table reg">
                        <colgroup>
                            <col style="width: auto;">
                        </colgroup>
                        <thead>
                            <th scope="col" class="t-center">전체 B2C회원수</th>
                        </thead>
                        <tbody>
                            <tr>
                                <td class="t-center"><strong class="fz-15">{{ numberFormat(state.data.issCount, 'issCount',
                                    'won') }}명</strong>(기준일
                                    {{ state.data.issBstdDate }})</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </template>
            <template v-else-if="state.data.issTrgCd == '217002'">
                <div class="tbl-wrap">
                    <NoData v-if="pager.totalCnt <= 0" :nodatatext="'조회된 데이터가 없습니다.'"></NoData>
                    <template v-else>
                        <div class="table-util">
                            <button type="button" class="btn btn-ss" @click="delList">삭제</button>
                        </div>
                        <AgGridVue :defaultColDef="state.defaultColDef" :columnDefs="state.tableColum_c"
                            :rowData="state.rowData" @grid-ready="onGridReady" :suppressRowClickSelection="true"
                            @selection-changed="onRowSelect" :rowSelection="'multiple'" class="ag-theme-alpine"
                            :domLayout="'autoHeight'">
                        </AgGridVue>
                        <PageNavigation :cntPerPage='pager.size' :itemCount='pager.totalCnt' :currentPage="pager.current"
                            @changedPage="onChangedPage" />
                    </template>
                </div>
            </template>
            <!-- <template v-else-if="state.data.issTrgCd == '217003'">
                <div class="tbl-wrap">
                    <NoData v-if="pager.totalCnt <= 0" :nodatatext="'조회된 데이터가 없습니다.'"></NoData>
                    <template v-else>
                        <div class="table-util">
                            <button type="button" class="btn btn-ss" @click="delList">삭제</button>
                        </div>
                        <AgGridVue :defaultColDef="state.defaultColDef" :columnDefs="state.tableColum_c"
                            :rowData="state.rowData" @grid-ready="onGridReady" :suppressRowClickSelection="true"
                            @selection-changed="onRowSelect" :rowSelection="'multiple'" class="ag-theme-alpine"
                            :domLayout="'autoHeight'">
                        </AgGridVue>
                        <PageNavigation :cntPerPage='pager.size' :itemCount='pager.totalCnt' :currentPage="pager.current"
                            @changedPage="onChangedPage" />
                    </template>
                </div>
            </template> -->
            <template v-else-if="state.data.issTrgCd == '217004'">
                <div class="tbl-wrap mt-10">
                    <table class="table reg">
                        <colgroup>
                            <col style="width: auto;">
                        </colgroup>
                        <thead>
                            <th scope="col" class="t-center">총 대상수</th>
                            <th scope="col" class="t-center">정상 대상수</th>
                            <th scope="col" class="t-center">오류 대상수</th>
                        </thead>
                        <tbody>
                            <tr>
                                <td class="t-center">{{ numberFormat(state.data.totalCount, 'totalCount', 'won') }}</td>
                                <td class="t-center">{{ numberFormat(state.data.sucCount, 'sucCount', 'won') }}</td>
                                <td class="t-center">{{ numberFormat(state.data.failCount, 'failCount', 'won') }}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </template>
        </div>
    </div>

    <div class="btn-bottom-set flex justify-center" v-if="issListShow || state.data.issTrgCd == '217002'">
        <button type="button" class="btn btn-sl nega" @click="goToPage('/point/publish/list');">취소</button>
        <button type="button" class="btn btn-sl posi" @click="checkAuth">{{ state.pageType == 'modify' ? '수정' : '발급등록' }}</button>
    </div>

    <DefaultModal :isShow="isShow && popInfo.modalType == 'save'" :modalTitle="popInfo.modalTitle" :buttonConfirm="'확인'"
        :buttonCancel="'취소'" @modalclose="closeModal">
        <template #modalcontent>
            <div>{{ popInfo.modalMessage }}</div>
        </template>
    </DefaultModal>
    <UserInfoPop v-if="isShow && popInfo.modalType === 'userInfoPop'" :title="'userInfoPop'" :menuCode="state.menuCode"
        :auth6MaskingYn="menuInfo.auth6MaskingYn" @modalPlcyclose="closeModal" />
    <DcsPntPlcySearchPop v-if="isShow && popInfo.modalType === 'pntPlcySearch'" :type="'pntmnlissreg'"
        @modalPlcyclose="closeModal" />
    <!-- <UserGroupPop v-if="isShow && popInfo.modalType === 'userGroupPop'" @modalPlcyclose="closeModal" /> -->
</template>
<script>
import { reactive, ref, inject, onBeforeMount, onMounted, onUnmounted } from 'vue';
import { useCommFunc } from '@/core/helper/common.js';
import {
    _setPntMnlIssReg,
    _setPntMnlIssMod,
    _getDcsPntPlcyDetail,
    _getIssB2CTrgInfo,
    _getIssTrgInfo,
    _getPntMnlIssDetail
} from '@/api/pntmng.js';
import DefaultModal from '@/plugins/modal/modal/DefaultModal.vue';
import DateSingle from '@/components/ui/DateSingle.vue';
import DcsPntPlcySearchPop from '@/views/pntmng/component/DcsPntPlcySearchPop.vue';
import UserInfoPop from '@/views/pntmng/component/UserInfoPop.vue';
import UserGroupPop from '@/views/pntmng/component/UserGroupPop.vue';
import PntDcsIssDetail from '@/views/pntmng/component/PntDcsIssDetail.vue';
import { computed } from 'vue';
import { dmCommFunc } from '@/views/pntmng/common/common.js';
import CommonBtn from '@/views/pntmng/component/CommonBtn.vue';
import PntCategoryInfo from '@/views/pntmng/component/PntCategoryInfo.vue';
import { useRouter } from 'vue-router';
import { useStore } from 'vuex';
import { authCommFunc } from '@/core/helper/authComm.js';

export default {
    components: {
        DateSingle,
        DefaultModal,
        DcsPntPlcySearchPop,
        UserInfoPop,
        UserGroupPop,
        PntDcsIssDetail,
        CommonBtn,
        PntCategoryInfo
    },
    setup() {
        const router = useRouter();
        const { goToPage } = useCommFunc();
        const { modal, popInfo, isShow } = dmCommFunc();
        const dayJS = inject('dayJS');
        const store = useStore();
        const menuInfo = computed(() => store.state.getMenuItem.menuInfo);
        const { onChangeDownRol, onChangeEditRol, onChangeRegistRol } = authCommFunc();
        const issListShow = reactive(
            computed(() =>
                (state.data.issTrgCd == '217001' && !_.isEmpty(state.data.issCount))
                || state.data.issTrgCd == '217002'
                || (state.data.issTrgCd == '217004' && !_.isEmpty(state.data.totalCount)))
        );
        const state = reactive({
            setDay: new Date(),
            setSingleDay: new Date().getTime() - 3600 * 1000 * 24 * 1,
            pageType: '',
            tableColum_c: _.clone([
                { headerCheckboxSelection: true, headerName: '', field: 'checkbox', checkboxSelection: true, width: 50 },
                { headerName: '번호', field: '', valueGetter: 'node.rowIndex + 1 ', width: 70 },
                { headerName: '이름', field: 'mbrNm', width: 120 },
                { headerName: '회원번호', field: 'mbrSn', width: 200 },
                { headerName: '성별', field: 'mbrSex', width: 120 },
                { headerName: '연령대', field: 'aggp', width: 130 },
                {
                    headerName: '가입일자',
                    field: 'mbrJnDt',
                    width: 200,
                    cellRenderer: params => {
                        return params.value ? params.value.substring(0, 10) : '';
                    }
                },
                { headerName: '휴대전화번호', field: 'mbrHhpno', flex: 1 },
                { headerName: '이메일', field: 'mbrEmad', flex: 1 }
            ]),
            rowData: [],
            defaultColDef: {
                sortable: true,
                resizable: true,
                width: 50,
                headerClass: 'centered',
                cellClass: 'centered'
            },
            data: {
                pntPlcyCd: '',
                pntPlcyNm: '',
                pntPlcyDscr: '',
                pntPlcyCrtRsn: '',
                pntPlcyBgnDate: '',
                pntPlcyEndDate: '',
                pntIssTyCd: '',
                pntIssSeCd: '',
                pntAmt: '',
                dplIssPsbYn: '',
                dplStngSeCd: '',
                dplIssPsbNum: '',
                pntIssLmtCnt: '',
                pntVldTrStngCd: '',
                pntVldTrSeCd: '',
                pntVldTr: '',
                pntVldBgnDate: '',
                pntVldEndDate: '',
                pntCtgrMjcsCd: '',
                pntCtgrMdcsCd: '',
                issDtSeCd: '216001',
                issBstdDate: new Date().getTime() - 3600 * 1000 * 24 * 1,
                issTrgCd: '217001',
                mbrSnArr: [],
                delUserList: [],
                mbrGrpCd: '',
                issTrgUpldFnm: '',
                bknIssDate: new Date(),
                uploadFile: null,
                issCount: '',
                totalCount: '',
                sucCount: '',
                failCount: '',
                key: ''
            },
            athrTypCd: '212005',
            menuCode: menuInfo.value.menuCode
        });

        const exelParams = reactive({
            params: {
                key: computed(() => state.data.key),
                menuCode: state.menuCode
            },
            url: computed(() => `/common/api/v1/mna/iss/user/fail/excel?key=${state.data.key}&&menuCode=${state.menuCode}`)
        });

        const pager = reactive({
            current: 1,
            currentPageSize: 1,
            size: 5,
            offset: computed(() => (pager.current - 1) * pager.size),
            totalCnt: 0
        });

        onMounted(async () => {
            emitter.$on('onChangeRegist', modalSave);
            emitter.$on('onChangeEdit', modalSave);
        });

        onUnmounted(() => {
            emitter.$off('onChangeRegist');
            emitter.$off('onChangeEdit');
        });

        onBeforeMount(async () => {
            if (history.state.type == 'pntmnlissmod') {
                state.pageType = 'modify';
                state.data.pntPlcyCd = history.state.pntPlcyCd;
                state.data.issStCd = history.state.issStCd;
                state.data.athrNoSn = history.state.athrNoSn;
                state.data.cstPntIssMngSn = history.state.cstPntIssMngSn;
                await getPntMnlIssDetail();
                if (state.data.issTrgCd == '217001') {
                    state.data.mbrSnArr = [];
                    state.data.issCount = state.data.issTgpNum;
                } else if (state.data.issTrgCd == '217002') {
                    pager.totalCnt = state.data.mbrSnArr.length;
                    onChangedPage(pager.current);
                } else if (state.data.issTrgCd == '217004') {
                    state.data.mbrSnArr = [];
                    state.data.totalCount = state.data.issTgpNum;
                    state.data.sucCount = state.data.issTgpNum;
                }
            }
        });
        const getPntMnlIssDetail = async () => {
            let params = {
                cstPntIssMngSn: state.data.cstPntIssMngSn
            };
            try {
                const response = await _getPntMnlIssDetail(params);
                let resData = response.data;
                if (response.code == 'OK') {
                    state.data = {
                        ...state.data,
                        ...resData
                    };
                    state.data.issBstdDate = dayJS(state.data.issBstdDate).format('YYYY-MM-DD');
                } else {
                    modal(response.message);
                }
            } catch (error) {
                modal(error);
            }
        };

        const numberFormat = (val, col, type) => {
            let temp = typeof val == 'string' ? val : val.toString();
            let num = temp.replace(/[^0-9]/g, '');
            if (type == 'won') {
                var regexp = /\B(?=(\d{3})+(?!\d))/g;
                num = num.toString().replace(regexp, ',');
            }
            state.data[col] = num;

            return num;
        };

        const reqData = () => {
            let check = checkColList();
            let params = {
                pntPlcyCd: state.data.pntPlcyCd,
                issDtSeCd: state.data.issDtSeCd,
                bknIssDate: dayJS(state.data.issDtSeCd == '216001' ? new Date() : state.data.bknIssDate).format('YYYYMMDD'),
                issBstdDate: dayJS(state.data.issTrgCd == '217001' ? state.data.issBstdDate : new Date().getTime() - 3600 * 1000 * 24 * 1).format('YYYYMMDD'),
                issTrgCd: state.data.issTrgCd,
                mbrSnArr: state.data.issTrgCd == '217002' ? state.data.mbrSnArr.map(obj => { return { mbrSn: obj.mbrSn, mbrNm: obj.mbrNm }; }) : [],
                mbrGrpCd: state.data.issTrgCd == '217003' ? state.data.mbrGrpCd : '',
                issTrgUpldFnm: state.data.issTrgCd == '217004' ? state.data.uploadFile.name : '',
                issTgpNum: state.data.issTrgCd == '217001' ? 0 :
                    state.data.issTrgCd == '217002' ? pager.totalCnt :
                        state.data.issTrgCd == '217004' ? state.data.sucCount : 0
            };

            if (state.pageType == 'modify') params.cstPntIssMngSn = state.data.cstPntIssMngSn;
            console.log('params:', params);

            return { params, check };
        };

        const setPntMnlIss = async () => {
            try {
                let { params, check } = await reqData();
                if (check) return;
                let response = null;
                if (state.pageType == 'modify') {
                    response = await _setPntMnlIssMod(params);
                } else {
                    response = await _setPntMnlIssReg(params);
                }
                if (response.data.code == 'OK') {
                    goToPage('/point/publish/list');
                } else {
                    modal(response.data.message);
                }
            } catch (error) {
                modal(error);
            }
        };

        const showModal = (type) => {
            popInfo.modalType = type;
            isShow.value = true;
            if (type == 'save') {
                popInfo.modalMessage = `포인트 발급 ${state.pageType == 'modify' ? '수정' : '등록'}을 하시겠습니까?`;
                popInfo.modalTitle = `포인트 발급 ${state.pageType == 'modify' ? '수정' : '등록'}`;
            } else if (type == 'pntPlcySearch' || type == 'userInfoPop' || type == 'userGroupPop') {
                popInfo.modalMessage = '';
            }
        };

        const modalSave = () => showModal('save');

        const closeModal = async (type, value) => {
            let status = popInfo.modalType;
            isShow.value = false;
            if (type == 'modalconfirm') {
                if (status == 'save') {
                    await setPntMnlIss();
                } else if (status == 'pntPlcySearch') {
                    state.data.pntPlcyCd = value.pntPlcyCd;
                    state.data.pntPlcyNm = value.pntPlcyNm;
                    state.data.plcyStCd = value.plcyStCd;
                    getDcsPntPlcyDetail();
                } else if (status == 'userInfoPop') {
                    value.forEach(item => { state.data.mbrSnArr.push(item); });
                    let { uniqueArray, duplicatSts } = await rmDuplicate(state.data.mbrSnArr);
                    if (duplicatSts) modal('중복된 회원이 있습니다. 중복된 회원은 하나로 보입니다.');
                    state.data.mbrSnArr = uniqueArray;
                    pager.totalCnt = state.data.mbrSnArr.length;
                    onChangedPage(pager.current);
                }
                // else if (status == 'userGroupPop') {
                //     console.log('userGroupPop value  : ', value);
                // }
            }
        };

        const rmDuplicate = (arr) => {
            let uniqueArray = [];
            let duplicatSts = false;
            arr.forEach((obj, index, self) => {
                if (index === self.findIndex((o) =>
                    o.mbrNm === obj.mbrNm
                )) {
                    uniqueArray.push(obj);
                } else {
                    duplicatSts = true;
                }
            });

            return { uniqueArray, duplicatSts };
        };

        const delList = () => {
            if (state.data.delUserList.length <= 0) {
                modal('삭제할 대상이 없습니다.');
                return;
            }
            state.data.mbrSnArr = state.data.mbrSnArr.filter(item => !state.data.delUserList.includes(item));
            pager.totalCnt = state.data.mbrSnArr.length;
            onChangedPage(pager.current);
        };

        const checkColList = () => {
            let regDate = dayJS(new Date()).format('YYYYMMDD');
            let issBstdDate = dayJS(state.data.issBstdDate).format('YYYYMMDD');
            let bknIssDate = dayJS(state.data.issDtSeCd == '216001' ? new Date() : state.data.bknIssDate).format('YYYYMMDD');
            let issTrgCd = state.data.issTrgCd;
            let message = '';

            if (issTrgCd == '217002' && state.data.mbrSnArr.length == 0) { // 발급대항 회원조회인 경우
                message = '발급대상 회원을 등록하지 않았습니다.';
            }
            // else if (issTrgCd == '217003' && state.data.mbrGrpCd == []) { //2차에 진행할 회원그룹내용
            //     message = '발급대상 회원그룹을 선택하지 않았습니다.';
            // } 
            else if (issTrgCd == '217004' && state.data.uploadFile == null && state.pageType != 'modify') { // 발급대상 업로드인경우
                message = '발급대상 파일 업로드를 하지 않았습니다.';
            }
            //발급대상 전체 B2C회원
            if (issTrgCd == '217001') {
                if (state.data.issDtSeCd == '216001') { //즉시발급
                    if (issBstdDate >= regDate) {
                        message = '즉시발급일경우 기준일은 등록일보다 이전으로 등록해야합니다.';
                    }
                } else if (state.data.issDtSeCd == '216002') { //예약발급
                    if (regDate >= bknIssDate) {
                        message = '예약발급일경우 예약발급일이 등록일보다 이후로 등록해야합니다.';
                    } else if (issBstdDate >= bknIssDate) {
                        message = '예약발급일경우 기준일은 예약발급일 이전으로 등록해야합니다.';
                    }
                }
            }

            if (_.isEmpty(state.data.pntPlcyCd)) message = '정책을 선택하지 않았습니다.';

            if (message) modal(message);
            return message ? true : false;
        };

        const getDcsPntPlcyDetail = async () => {
            try {
                const response = await _getDcsPntPlcyDetail({
                    pntPlcyCd: state.data.pntPlcyCd
                });
                let resData = response.data;
                if (response.code == 'OK') {
                    state.data = {
                        ...state.data,
                        ...resData
                    };

                    //새로운 정책이 적용되는 경우 모든 상황 초기화 진행
                    state.data.issCount = '';
                    state.data.mbrSnArr = [];
                    onChangedPage(1);
                    // state.data.mbrGrpCd = [];
                    state.data.totalCount = '';
                    state.data.uploadFile = '';
                    state.data.issTrgCd = '217001';
                } else {
                    modal(response.message);
                }
            } catch (error) {
                modal(error);
            }
        };

        const getIssTrgInfo = async () => {
            if (checkColList()) return;
            try {
                let response = null;
                if (state.data.issTrgCd == '217004') {
                    let formData = new FormData();
                    formData.append('file', state.data.uploadFile);
                    response = await _getIssTrgInfo(formData);
                } else if (state.data.issTrgCd == '217001') {
                    response = await _getIssB2CTrgInfo(dayJS(state.data.issBstdDate).format('YYYYMMDD'));
                }
                if (response.code == 'OK') {
                    let resData = response.data;
                    if (state.data.issTrgCd == '217004') {
                        state.data.key = resData.key;
                        state.data.totalCount = resData.totalCount;
                        state.data.sucCount = resData.sucCount;
                        state.data.failCount = resData.failCount;
                    } else if (state.data.issTrgCd == '217001') {
                        numberFormat(resData.issCount, 'issCount', 'won');
                    }
                } else {
                    modal(response.message);
                }
            } catch (error) {
                modal(error);
            }
        };

        // 데이터 피커 날짜 검색
        const onSelectPicker = (type, value, status) => state.data.bknIssDate = value;

        // 데이터 피커 날짜 검색
        const selectIssBstdDate = (type, value, status) => {
            state.data.issCount = '';
            state.data.issBstdDate = dayJS(value).format('YYYY-MM-DD');
        };

        // 체크 박스 선택시 
        const onRowSelect = (e) => state.data.delUserList = state.gridApi.getSelectedRows();

        // 테이블 리사이징을 위한 참조값
        const onGridReady = (params) => {
            state.gridApi = params.api;
            state.gridColumApi = params.columnApi;
        };

        // 파일 업로드
        const uploadFile = async (e) => {
            state.data.totalCount = 0;
            const file = e.target.files[0];
            if (e.target.files[0].name.includes('xlsx') || e.target.files[0].name.includes('xls')) {
                state.data.uploadFile = file ? file : null;
                state.data.issTrgUpldFnm = e.target.files[0].name;
            } else {
                modal('파일 확장자를 확인하세요(.xlsx, .xls)');
            }
        };

        // 파일 삭제
        const deleteFile = async (e) => state.data.uploadFile = null;

        // 페이징 처리
        const onChangedPage = (num) => {
            state.data.delUserList = [];
            pager.current = num;
            const start = (pager.current - 1) * pager.size;
            const end = start + pager.size;
            state.tableColum_c[1].valueGetter = 'node.rowIndex + ' + Number(pager.size * (pager.current - 1) + 1);
            state.rowData = state.data.mbrSnArr.slice(start, end);
        };

        const checkAuth = async () => {
            if (state.pageType == 'modify') await onChangeEditRol(menuInfo.value.auth2UpdateYn);
            else await onChangeRegistRol(menuInfo.value.auth1RegistYn);
        };

        return {
            state,
            popInfo,
            isShow,
            issListShow,
            pager,
            goToPage,
            getPntMnlIssDetail,
            setPntMnlIss,
            getDcsPntPlcyDetail,
            showModal,
            closeModal,
            numberFormat,
            getIssTrgInfo,
            onSelectPicker,
            selectIssBstdDate,
            onRowSelect,
            onGridReady,
            uploadFile,
            deleteFile,
            delList,
            onChangedPage,
            exelParams,
            onChangeDownRol,
            menuInfo,
            checkAuth
        };
    }
};
</script>