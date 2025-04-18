<template>
    <section>
        <div class="ui-section">
            <!-- 디테일 정보{{ state.infoDetail }} <br />

            파라메타 정보{{ formData }} -->
            <subTitleBar :subTitle="'기업 정보'" />
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
                                <th scope="row">아이디</th>
                                <td colspan="3">{{ state.infoDetail.admnId }}</td>

                            </tr>
                            <tr>
                                <th scope="row">기업명</th>
                                <td>{{ state.infoDetail.ntprNm }}</td>
                                <th scope="row">KB계열사</th>
                                <td>
                                    <template v-if="state.infoDetail.kbAffiYn === 'Y'">
                                        해당함
                                    </template>
                                    <template v-if="state.infoDetail.kbAffiYn === 'N'">
                                        해당하지 않음
                                    </template>
                                </td>
                            </tr>
                            <tr>

                                <th scope="row">사업자등록번호<span class="ess"><span class="offscreen">필수입력</span></span></th>
                                <td colspan="3">
                                    <div class="reg-group">
                                        <div class="reg-item">
                                            <input type="text" :class="['form-control', { error: checkValidState('brn') }]"
                                                maxlength="3" :value="state.brn1" data-target="brn1"
                                                @input="setInputNumber">
                                        </div>
                                        <span class="ui-coupler">-</span>
                                        <div class="reg-item">
                                            <input type="text" :class="['form-control', { error: checkValidState('brn') }]"
                                                maxlength="2" :value="state.brn2" data-target="brn2"
                                                @input="setInputNumber">
                                        </div>
                                        <span class="ui-coupler">-</span>
                                        <div class="reg-item">
                                            <input type="text" :class="['form-control', { error: checkValidState('brn') }]"
                                                maxlength="5" :value="state.brn3" data-target="brn3"
                                                @input="setInputNumber">
                                        </div>

                                        <div class="reg-item">
                                            <button type="button" class="btn btn-slm"
                                                :disabled="formData.brn === state.infoDetail.brn"
                                                @click="modalOpen('isShowBrn', formData.brn)">중복체크</button>
                                        </div>
                                    </div>
                                    <span class="input-guide">사업자등록번호 중복체크를 해주세요.</span>
                                </td>

                            </tr>
                            <tr>
                                <th scope="row">업태<span class="ess"><span class="offscreen">필수입력</span></span></th>
                                <td>
                                    <div class="reg-group">
                                        <div class="reg-item">
                                            <input type="text" class="form-control" v-model="state.infoDetail.bcoNm">
                                        </div>
                                    </div>
                                </td>
                                <th scope="row">종목<span class="ess"><span class="offscreen">필수입력</span></span></th>
                                <td>
                                    <div class="reg-group">
                                        <div class="reg-item">
                                            <input type="text" class="form-control" v-model="state.infoDetail.indtpNm">
                                        </div>
                                    </div>
                                </td>
                            </tr>
                            <tr>
                                <th scope="row">대표 전화번호<span class="ess"><span class="offscreen">필수입력</span></span></th>
                                <td>
                                    <div class="reg-group">

                                        <div class="reg-item">
                                            <commselect :selectType="'searchCode.rprsTlnoFno'" ref="rprsTlnoFno"
                                                @changedValue="selectedOptions" :initData="state.rprsTlnoFno" />
                                        </div>
                                        <span class="ui-coupler">-</span>
                                        <div class="reg-item">
                                            <input type="text" maxlength="4"
                                                :class="['form-control', { error: checkValidState('rprsTlnoMno') }]"
                                                :value="state.rprsTlnoMno" data-target="rprsTlnoMno"
                                                @input="setInputNumber">
                                        </div>
                                        <span class="ui-coupler">-</span>
                                        <div class="reg-item">
                                            <input type="text" maxlength="4"
                                                :class="['form-control', { error: checkValidState('rprsTlnoMno') }]"
                                                :value="state.rprsTlnoBno" data-target="rprsTlnoBno"
                                                @input="setInputNumber">
                                        </div>
                                    </div>
                                </td>
                                <th scope="row">팩스번호</th>
                                <td>
                                    <div class="reg-group">
                                        <div class="reg-item">
                                            <commselect :selectType="'searchCode.rprsTlnoFno'" ref="faxFno"
                                                @changedValue="selectedOptions" :initData="state.faxFno" />
                                        </div>
                                        <span class="ui-coupler">-</span>
                                        <!-- <div class="reg-item">
                                            <input type="text" class="form-control" v-model="formData.faxMno">
                                        </div>
                                        <span class="ui-coupler">-</span>
                                        <div class="reg-item">
                                            <input type="text" class="form-control" v-model="formData.faxBno">
                                        </div> -->
                                        <div class="reg-item">
                                            <input type="text" class="form-control" maxlength="4" :value="state.faxMno"
                                                data-target="faxMno" @input="setInputNumber">
                                        </div>
                                        <span class="ui-coupler">-</span>
                                        <div class="reg-item">
                                            <input type="text" class="form-control" maxlength="4" :value="state.faxBno"
                                                data-target="faxBno" @input="setInputNumber">
                                        </div>
                                    </div>
                                </td>
                            </tr>
                            <tr>
                                <th scope="row">주소<span class="ess"><span class="offscreen">필수입력</span></span></th>
                                <td colspan="3">
                                    <div class="reg-group">
                                        <div class="reg-item">
                                            <input type="text" class="form-control" readonly v-model="state.infoDetail.zc">
                                        </div>
                                        <div class="reg-item">
                                            <button type="button" class="btn btn-slm">우편번호 검색</button>
                                        </div>
                                    </div>
                                    <div class="reg-group">
                                        <div class="reg-item">
                                            <input type="text" class="form-control" placeholder="주소"
                                                v-model="state.infoDetail.adr">
                                        </div>
                                        <div class="reg-item">
                                            <input type="text" class="form-control" placeholder="상세주소"
                                                v-model="state.infoDetail.adrCts">
                                        </div>
                                    </div>
                                </td>
                            </tr>
                            <tr>
                                <th scope="row">법인계좌번호<span class="ess"><span class="offscreen">필수입력</span></span></th>
                                <td colspan="3">
                                    <div class="reg-group">
                                        <div class="reg-item">
                                            <commselect :selectType="'searchCode.bkcd'" @changedValue="selectedOptions"
                                                :initData="formData.bkcd" ref="bkcd" />
                                        </div>
                                        <div class="reg-item">
                                            <input type="text" class="form-control" placeholder="'-'없이 계좌번호 입력"
                                                v-model="state.infoDetail.acno">
                                        </div>
                                        <div class="reg-item">
                                            <input type="text" class="form-control" placeholder="예금주명"
                                                v-model="state.infoDetail.accountNm">
                                        </div>
                                    </div>
                                </td>

                            </tr>
                            <tr>
                                <th scope="row">기업코드<span class="ess"><span class="offscreen">필수입력</span></span>
                                </th>
                                <td>
                                    {{ state.infoDetail.ntprUcd }}
                                </td>
                                <th scope="row">추천기업</th>
                                <td>{{ state.infoDetail.rcmNtprNm ?
                                    `${state.infoDetail.rcmNtprNm}(${state.infoDetail.rcmNtprUcd})` : '-' }}</td>
                                <!-- <td>{{ state.infoDetail.rcmNtprNm }}({{ state.infoDetail.rcmNtprUcd }})</td> -->
                            </tr>

                            <tr>

                                <th scope="row">거래처코드(더존ERP)<span class="ess"><span class="offscreen">필수입력</span></span>
                                </th>
                                <td colspan="3">
                                    <div class="reg-group inline">
                                        <div class="reg-item">
                                            <input type="text" class="form-control" v-model="state.infoDetail.dlngPlcCd">
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
            <subTitleBar :subTitle="'담당자 정보'" />
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
                                <th scope="row">담당부서<span class="ess"><span class="offscreen">필수입력</span></span></th>
                                <td>
                                    <div class="reg-group">
                                        <div class="reg-item">
                                            <input type="text" class="form-control" v-model="state.infoDetail.admnDepNm">
                                        </div>
                                    </div>
                                </td>
                                <th scope="row">담당자명<span class="ess"><span class="offscreen">필수입력</span></span></th>
                                <td>
                                    <div class="reg-group">
                                        <div class="reg-item">
                                            <input type="text" class="form-control" v-model="state.infoDetail.admnNm">
                                        </div>
                                    </div>
                                </td>
                            </tr>
                            <tr>
                                <th scope="row">담당자 휴대폰 번호<span class="ess"><span class="offscreen">필수입력</span></span></th>
                                <td>
                                    <div class="reg-group">
                                        <div class="reg-item">
                                            <input type="text" maxlength="3"
                                                :class="['form-control', { error: checkValidState('admnHhpnoFno') || checkValidState('admnHhpnoMno') || checkValidState('admnHhpnoBno') }]"
                                                :value="state.admnHhpnoFno" data-target="admnHhpnoFno"
                                                @input="setInputNumber">
                                        </div>
                                        <span class="ui-coupler">-</span>
                                        <div class="reg-item">
                                            <input type="text" maxlength="4"
                                                :class="['form-control', { error: checkValidState('admnHhpnoFno') || checkValidState('admnHhpnoMno') || checkValidState('admnHhpnoBno') }]"
                                                :value="state.admnHhpnoMno" data-target="admnHhpnoMno"
                                                @input="setInputNumber">
                                        </div>
                                        <span class="ui-coupler">-</span>
                                        <div class="reg-item">
                                            <input type="text" maxlength="4"
                                                :class="['form-control', { error: checkValidState('admnHhpnoFno') || checkValidState('admnHhpnoMno') || checkValidState('admnHhpnoBno') }]"
                                                :value="state.admnHhpnoBno" data-target="admnHhpnoBno"
                                                @input="setInputNumber">
                                        </div>
                                    </div>
                                    <span
                                        v-if="checkValidState('admnHhpnoFno') || checkValidState('admnHhpnoMno') || checkValidState('admnHhpnoBno')"
                                        class="input-guide"
                                        :class="{ 'error': checkValidState('admnHhpnoFno') || checkValidState('admnHhpnoMno') || checkValidState('admnHhpnoBno') }">
                                        {{ state.validState.message }}
                                    </span>
                                </td>
                                <th scope="row">담당자 이메일 주소<span class="ess"><span class="offscreen">필수입력</span></span></th>
                                <td>
                                    <div class="reg-group">
                                        <div class="reg-item">
                                            <input type="text"
                                                :class="['form-control', { error: checkValidState('admnEmad') }]"
                                                v-model="state.mailType1">
                                        </div>
                                        <span class="ui-coupler">@</span>
                                        <div class="reg-item">
                                            <commselect :selectType="'searchCode.mailType2'" ref="mailType"
                                                @changedValue="selectedOptions" :initData="state.mailType2" />
                                        </div>
                                        <div class="reg-item">
                                            <button type="button" class="btn btn-slm" :disabled="_.isEmpty(state.mailType1)"
                                                @click="modalOpen('isShowEmad', formData.admnEmad)">
                                                중복체크
                                            </button>
                                        </div>
                                    </div>
                                    <span v-if="checkValidState('admnEmad')" class="input-guide"
                                        :class="{ 'error': checkValidState('admnEmad') }">
                                        {{ state.validState.message }}
                                    </span>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
        <div class="ui-section">
            <subTitleBar :subTitle="'첨부 서류'" />
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
                                <th scope="row">사업자등록증 사본<span class="ess"><span class="offscreen">필수입력</span></span></th>
                                <td>
                                    <!-- 사업자등록증 사본 첨부파일순번: {{ formData.bzlcCpAtflSn }} -->
                                    <div class="reg-group">
                                        <!-- uploadFile -->
                                        <div class="reg-item">
                                            <div class="btn-file">
                                                <input type="file" id="upload-file" hidden=""
                                                    @change="fileListUp('bizfilelist')" ref="fileUploadBiz">
                                                <label class="btn-up" for="upload-file">파일첨부</label>
                                            </div>
                                            <span class="input-guide inline">용량 : 2MB 이하 | 형식 : jpg, gif, pdf</span>
                                            <!-- <button @click="uploadFile('bizfilelist')">파일API</button> -->
                                        </div>
                                    </div>
                                    <div class="upload-file-box">
                                        <div class="upload-file-head flex space-between">
                                            <!-- <button type="button" class="btn del-all btn-secondary">
                                                <span class="offscreen">전체파일삭제</span>
                                            </button> -->
                                            <span class="name">파일명</span>
                                            <span class="volume">용량</span>
                                        </div>
                                        <div class="upload-file-list" v-if="state.bizfilelist.length > 0">
                                            <div class="upload-file-list-item flex space-between"
                                                v-for="(item, index) in state.bizfilelist" :key="index">
                                                <button type="button" class="btn del btn-secondary"
                                                    @click="fileListDel('bizfilelist')">
                                                    <span class="offscreen">파일삭제</span>
                                                </button>
                                                <span class="name">{{ item.name }}</span>
                                                <span class="volume">{{ (item.size / (1024 * 1024)).toFixed(1) }} MB</span>
                                            </div>
                                        </div>
                                    </div>
                                </td>
                                <th scope="row">법인계좌 사본<span class="ess"><span class="offscreen">필수입력</span></span></th>
                                <td>
                                    <!-- 법인계좌 사본 첨부파일순번: {{ formData.ntprAcnCpAtflSn }} -->
                                    <div class="reg-group">
                                        <div class="reg-item">
                                            <div class="btn-file">
                                                <input type="file" id="upload-file1" hidden="" ref="fileUploadBankBiz"
                                                    @change="fileListUp('bizBanklist')">
                                                <label class="btn-up" for="upload-file1">파일첨부</label>
                                            </div>
                                            <span class="input-guide inline">용량 : 2MB 이하 | 형식 : jpg, gif, pdf</span>
                                            <!-- <button @click="uploadFile('bizBanklist')">파일API</button> -->
                                        </div>

                                    </div>
                                    <div class="upload-file-box">
                                        <div class="upload-file-head flex space-between">
                                            <!-- <button type="button" class="btn del-all btn-secondary">
                                                <span class="offscreen">전체파일삭제</span>
                                            </button> -->
                                            <span class="name">파일명</span>
                                            <span class="volume">용량</span>
                                        </div>
                                        <div class="upload-file-list">
                                            <div class="upload-file-list-item flex space-between"
                                                v-for="(item, index) in state.bizBanklist" :key="index">
                                                <button type="button" class="btn del btn-secondary"
                                                    @click="fileListDel('bizBanklist')">
                                                    <span class="offscreen">파일삭제</span>
                                                </button>
                                                <span class="name">{{ item.name }}</span>
                                                <span class="volume">{{ (item.size / (1024 * 1024)).toFixed(1) }} MB</span>
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
        <div class="ui-section">
            <subTitleBar :subTitle="'이력 정보'" />
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
                                <th scope="row">가입일자</th>
                                <td>
                                    {{ state.infoDetail.admnJnDt ?
                                        dayJS(state.infoDetail.admnJnDt).format('YYYY-MM-DD hh:mm: ss') : ' - ' }}
                                </td>
                                <th scope="row">로그인 잠김</th>
                                <td>
                                    {{ state.infoDetail.admnPwdErrCotLgnLockYn }}
                                    <template v-if="state.infoDetail.admnPwdErrCot">
                                        ({{ state.infoDetail.admnPwdErrCot }})
                                    </template>
                                </td>
                            </tr>
                            <tr>
                                <th scope="row">최종로그인일시</th>
                                <td>
                                    {{ state.infoDetail.admnLtlyLgnDt ?
                                        dayJS(state.infoDetail.admnLtlyLgnDt).format('YYYY-MM-DD HH:mm:ss') : '-' }}
                                </td>
                                <th scope="row">비밀번호 수정일자</th>
                                <td>
                                    {{ state.infoDetail.admnPwdChgDt ?
                                        dayJS(state.infoDetail.admnPwdChgDt).format('YYYY-MM-DD HH:mm:ss') : '-' }}
                                </td>
                            </tr>
                            <tr>
                                <th scope="row">등록자</th>
                                <td>{{ state.infoDetail.rgsLvlEngNm }}({{ state.infoDetail.rgsUsrNm }})</td>
                                <th scope="row">등록일자</th>
                                <td>{{ dayJS(state.infoDetail.rgsDt).format('YYYY-MM-DD HH:mm:ss') }}</td>
                            </tr>
                            <tr>
                                <th scope="row">수정자</th>
                                <td>
                                    {{ state.infoDetail.updLvlEngNm ?
                                        `${state.infoDetail.updLvlEngNm}(${state.infoDetail.updUsrNm})` : '-' }}
                                </td>
                                <th scope="row">수정일자</th>
                                <td>
                                    {{ state.infoDetail.updDt ? dayJS(state.infoDetail.updDt).format('YYYY-MM-DD HH:mm:ss')
                                        : '-' }}
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
        <div class="btn-bottom-set flex justify-center">
            <button type="button" class="btn btn-sl nega" @click="goToPage('/developer/info/list')">취소</button>
            <button :disabled="!state.mskgnRlsYn" class="btn btn-sl nega" type="button" @click="changeMskgnRlsYn">
                마스킹해제
            </button>
            <button type="button" class="btn btn-sl posi" @click="changeEditRol">저장</button>
        </div>


        <!-- MD검색 -->
        <DefaultModal :buttonCancel="''" :buttonConfirm="'닫기'" :isShow="isMdShow" :modalName="'isMdShow'" modalTitle="MD조회"
            @modalclose="modalControl">
            <template #modalcontent>
                <MdSearch @selectValue="onChangemdSearch" />
            </template>
        </DefaultModal>
    </section>
</template>
<script>
import { reactive, inject, onMounted, onUnmounted, ref, computed } from 'vue';
import { useStore } from 'vuex';
import { useRoute } from 'vue-router';
import { useCommFunc } from '@/core/helper/common.js';
import { authCommFunc } from '@/core/helper/authComm.js';
import { _getDevInfoDetail, _duplicateEidCheck } from '@/api/developer.js';

import DefaultModal from '@/plugins/modal/modal/DefaultModal.vue';
import MdSearch from '@/components/ui/MdSearch.vue';
export default {
    components: { DefaultModal, MdSearch },
    setup() {
        const $Modal = inject('$Modal');
        const dayJS = inject('dayJS');
        const fileUploadBiz = ref(null);
        const fileUploadBankBiz = ref(null);
        const rprsTlnoFno = ref(null);
        const faxFno = ref(null);
        const bkcd = ref(null);
        const mailType = ref(null);
        const { goToPage, fileDown, tableResize, openModal, isPartnerShow, isDownShow, isImgShow, isRequestShow } = useCommFunc();

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
        const { onChangeMaskingRol, onChangeEditRol, onChangeDelRol } = authCommFunc();
        const menuInfo = computed(() => store.state.getMenuItem.menuInfo);

        const store = useStore();
        const route = useRoute();
        const isMdShow = ref(false);
        const state = reactive({
            infoDetail: {},
            pagesize: 10,
            masking: 'N',
            detailNum: '',
            brn1: '',
            brn2: '',
            brn3: '',
            brnCheck: '',
            brnInfo: {},
            mailType1: '',
            mailType2: '',
            bzlcCpAtflSn: '',
            ntprAcnCpAtflSn: '',
            bizfilelist: [],
            bizBanklist: [],
            mskgnRlsYn: true,
            rprsTlnoMno: '', //대표전화번호(중간번호)
            rprsTlnoBno: '', //대표전화번호(뒷번호)
            faxFno: '', //팩스번호(앞번호)
            faxMno: '', //팩스번호(중간번호)
            faxBno: '', //팩스번호(뒷번호)
            admnHhpnoFno: '010', //담당자휴대폰번호(앞번호
            admnHhpnoMno: '', //담당자휴대폰번호(중간번호)
            admnHhpnoBno: '', //담당자휴대폰번호(뒷번호)
            dlngPlcCd: '', //거래처코드(더존ERP)

            validState: {
                type: '', // validation check ( formData )
                errState: false, // error state
                message: '' // input message
            }
        });

        const formData = reactive({
            admnSn: computed(() => state.infoDetail.admnSn), //어드민순번
            ntprSn: computed(() => state.infoDetail.ntprSn), //기업순번
            brn: computed(() => `${state.brn1}${state.brn2}${state.brn3}`), //사업자등록번호
            bcoNm: computed(() => state.infoDetail.bcoNm), //업태 
            indtpNm: computed(() => state.infoDetail.indtpNm), //종목
            rprsTlnoFno: '',  //대표전화번호(앞번호)
            rprsTlnoMno: computed(() => state.rprsTlnoMno), //대표전화번호(중간번호)
            rprsTlnoBno: computed(() => state.rprsTlnoBno), //대표전화번호(뒷번호)
            faxFno: '', //팩스번호(앞번호)
            faxMno: computed(() => state.faxMno), //팩스번호(중간번호)
            faxBno: computed(() => state.faxBno), //팩스번호(뒷번호)
            zc: '12345', //우편번호
            adr: computed(() => state.infoDetail.adr), //주소
            adrCts: computed(() => state.infoDetail.adrCts), //상세주소
            bkcd: '', //은행
            acno: computed(() => state.infoDetail.acno), //법인계좌번호
            accountNm: computed(() => state.infoDetail.accountNm), //예금주명
            mdAdmnSn: computed(() => state.infoDetail.mdAdmnSn), //담당MD(MD관리자순번)
            admnDepNm: computed(() => state.infoDetail.admnDepNm), //담당부서
            admnNm: computed(() => state.infoDetail.admnNm), //담당자명
            admnHhpnoFno: computed(() => state.admnHhpnoFno), //담당자휴대폰번호(앞번호
            admnHhpnoMno: computed(() => state.admnHhpnoMno), //담당자휴대폰번호(중간번호)
            admnHhpnoBno: computed(() => state.admnHhpnoBno), //담당자휴대폰번호(뒷번호)
            admnEmad: computed(() => state.mailType2 === '' ? `${state.mailType1}` : `${state.mailType1}`), //담당자이메일주소
            bzlcCpAtflSn: computed(() => state.infoDetail.bzlcCpAtflSn), //사업자등록증 사본(첨부파일순번)
            ntprAcnCpAtflSn: computed(() => state.infoDetail.ntprAcnCpAtflSn) //법인계좌 사본(첨부파일순번)
        });

        onMounted(() => {
            console.log(route.query.Sn);
            state.detailNum = route.query.Sn;
            // state.mskgnRlsYn = route.query.mskgnRlsYn;
            getDevInfoDetail();

            emitter.$on('onChangeMskgn', onChangeMskgn);
            emitter.$on('onChangeEdit', onChangeEdit);
            emitter.$on('onChangeDel', onChangeDel);
        });

        // 마스킹 해제 이벤트 버스 해제
        onUnmounted(() => {
            emitter.$off('onChangeMskgn');
            emitter.$off('onChangeEdit');
            emitter.$off('onChangeDel');
        });

        // 마스킹 권한 체크
        const changeMskgnRlsYn = async () => {
            // await onChangeMaskingRol(menuInfo.value.auth6MaskingYn);
            await onChangeMaskingRol('Y');
        };

        //마스킹 해제 처리 후 리스트 재조회 
        const onChangeMskgn = () => {
            state.mskgnRlsYn = !state.mskgnRlsYn;
            getDevInfoDetail();
        };
        /**
         * 수정changeApprRol 권한 체크
         */
        const changeEditRol = async () => {
            // await onChangeApprRol(menuInfo.value.auth4ApproveYn);
            await onChangeEditRol('Y');
        };

        /**
         * 수정 권한 체크 callback
         */
        const onChangeEdit = () => {
            actionBtns('confirm');
        };

        /**
         * 삭제 권한 체크
         */
        const changeDelRol = async () => {
            await onChangeDelRol(menuInfo.value.auth3DeleteYn);
            // await onChangeDelRol('Y');
        };

        /**
         * 삭제 권한 체크 callback
         */
        const onChangeDel = () => {
            actionBtns('cancel');
        };

        //공통 코드 컴포넌트
        const selectedOptions = (valueCode, valueName, type) => {
            if (type === 'faxFno' || type === 'rprsTlnoFno' || type === 'mailType2') {
                if (type === 'mailType2') {
                    state.mailType2 = valueName;
                } else {
                    formData[type] = valueName;
                }
            } else {
                formData[type] = valueCode;
            }
            console.log(valueCode, valueName, type);
        };
        const actionBtns = async (type) => {
            if (type === 'confirm') {
                if (state.mskgnRlsYn) {
                    state.modalMsg = '마스킹 해제 후 저장이 가능합니다.';
                } else {
                    state.modalMsg = '개발자정보를 저장할까요??';

                }
            } else if (type === 'masking') {
                state.modalMsg = '마스킹 해제 하시겠습니까?';
            }

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
                    if (type === 'masking') {
                        state.mskgnRlsYn = false;
                        await getDevInfoDetail();
                    } else if (type === 'confirm') {
                        //파일변경이 있으면
                        if (!state.mskgnRlsYn) {
                            if (!(state.infoDetail.bzlcCpAtflNm === state.bizfilelist[0].name)) {
                                await uploadFile('bizfilelist');
                            } else if (!(state.infoDetail.ntprAcnCpAtflNm === state.bizBanklist[0].name)) {
                                await uploadFile('bizBanklist');
                            }
                            await registSellerInfoDetail();
                        }
                    }
                })
                .catch(error => {
                    console.log(error);
                });
        };
        //상세조회
        const getDevInfoDetail = async () => {
            try {
                let params = {
                    mskgnRlsYn: state.mskgnRlsYn ? 'Y' : 'N'
                };
                const response = await _getDevInfoDetail(state.detailNum, params);
                console.log(response.data.data);
                state.infoDetail = response.data.data;
                // 사업자 번호 
                await brnDash();
                await valueCheck();

            } catch (error) {
                console.log(error);
            }
        };
        //사업자 번호 쪼개기
        const brnDash = () => {
            console.log(state.infoDetail.brn.length);
            const len = state.infoDetail.brn.length;
            state.brn1 = len >= 3 ? state.infoDetail.brn.substring(0, 3) : state.infoDetail.brn;
            state.brn2 = len >= 3 && len - 3 >= 2 ? state.infoDetail.brn.substring(3, 5) : '';
            state.brn3 = len >= 5 ? state.infoDetail.brn.substring(5) : '';
            state.brnTextList;
            console.log(state.brn1, state.brn2, state.brn3);
            return [state.brn1, state.brn2, state.brn3];
        };
        //형식에 맞게 쪼개기
        const valueCheck = () => {
            // 전화번호 팩스 공통코드 변환
            let telCode = null;
            let faxCode = null;
            let telNum = state.infoDetail.rprsTlno.split('-')[0];
            let faxNum = state.infoDetail.fax.split('-')[0];

            telCode = rprsTlnoFno.value.state.selectComm.filter(item => telNum === item.cmnCdNm);
            faxCode = rprsTlnoFno.value?.state?.selectComm.filter(item => faxNum === item.cmnCdNm);
            rprsTlnoFno.value.state.selectOption = telCode[0].cmnCd;
            formData.rprsTlnoFno = telCode[0].cmnCdNm;
            state.rprsTlnoMno = state.mskgnRlsYn ? state.infoDetail.rprsTlno.split('-')[1].slice(0, 4) : state.infoDetail.rprsTlno.split('-')[1];
            state.rprsTlnoBno = state.infoDetail.rprsTlno.slice(-4);
            faxFno.value.state.selectOption = faxCode[0].cmnCd;
            formData.faxFno = faxCode[0].cmnCdNm;
            state.faxMno = state.infoDetail.fax.split('-')[1];
            state.faxBno = state.infoDetail.fax.split('-')[2];


            //이메일 cmnCdNm
            let mail = state.infoDetail.admnEmad.split('@')[0];
            let mailD = state.infoDetail.admnEmad.split('@')[1];
            let mailDomain = null;

            mailDomain = mailType.value.state.selectComm.filter(item => mailD === item.cmnCdNm);
            if (mailDomain.length > 0) {
                state.mailType2 = mailType.value.state.selectOption = mailDomain[0].cmnCd;
                state.mailType1 = state.infoDetail.admnEmad.split('@')[0];
            } else {
                state.mailType2 = mailType.value.state.selectOption = '103014';
                state.mailType1 = mail + '@' + mailD;
            }
            console.log(mailDomain);

            //은행
            bkcd.value.state.selectOption = state.infoDetail.bkcd;
            formData.bkcd = state.infoDetail.bkcd;
            //휴대폰 번호 
            // console.log(state.infoDetail.admnHhpno);
            state.admnHhpnoFno = state.infoDetail.admnHhpno.split('-')[0]; //담당자휴대폰번호(앞번호)
            state.admnHhpnoMno = state.infoDetail.admnHhpno.split('-')[1];
            state.admnHhpnoBno = state.infoDetail.admnHhpno.split('-')[2];

            state.bizfilelist[0] = { 'name': state.infoDetail.bzlcCpAtflNm, 'size': state.infoDetail.bzlcCpAtflSize };
            state.bizBanklist[0] = { 'name': state.infoDetail.ntprAcnCpAtflNm, 'size': state.infoDetail.ntprAcnCpAtflSize };

            formData.dlngPlcCd = state.infoDetail.dlngPlcCd; // 거래처코드(더존ERP)

        };

        //상세 수정시
        const registSellerInfoDetail = async () => {
            try {
                let params = {
                    admnSn: formData.admnSn,
                    ntprSn: formData.ntprSn,
                    brn: formData.brn,
                    bcoNm: formData.bcoNm,
                    indtpNm: formData.indtpNm,
                    rprsTlnoFno: formData.rprsTlnoFno,
                    rprsTlnoMno: formData.rprsTlnoMno,
                    rprsTlnoBno: formData.rprsTlnoBno,
                    faxFno: formData.faxFno,
                    faxMno: formData.faxMno,
                    faxBno: formData.faxBno,
                    zc: '12345', //우편번호
                    adr: formData.adr,
                    adrCts: formData.adrCts,
                    bkcd: formData.bkcd,
                    acno: formData.acno,
                    accountNm: formData.accountNm,
                    mdAdmnSn: formData.mdAdmnSn,
                    admnDepNm: formData.admnDepNm,
                    admnNm: formData.admnNm,
                    admnHhpnoFno: formData.admnHhpnoFno,
                    admnHhpnoMno: formData.admnHhpnoMno,
                    admnHhpnoBno: formData.admnHhpnoBno,
                    admnEmad: formData.admnEmad,
                    bzlcCpAtflSn: formData.bzlcCpAtflSn,
                    ntprAcnCpAtflSn: formData.ntprAcnCpAtflSn,
                    mgnRt: '50',
                    dlngPlcCd: formData.dlngPlcCd
                };
                console.log(params);
                await _registSellerInfoDetail(params);
                // await goToPage('/seller/info/list');
            } catch (error) {
                console.log(error);
            }
        };
        // 모달창 닫기
        const modalControl = (type, modalName) => {
            if (modalName === 'isMdShow') {
                isMdShow.value = false;
            } else if (!modalName) {
                isMdShow.value = false;
            }
        };

        //md조회 팝업
        const openMdModal = () => {
            isMdShow.value = true;
        };

        //md조회 검색
        const onChangemdSearch = (value) => {
            console.log(value);
            state.infoDetail.mdAdmnSn = String(value.sn);
            state.infoDetail.mdAdmnNm = value.admnNm;
            isMdShow.value = false;
        };

        //사업자 중복체크 
        const duplicateEidCheck = async () => {
            try {
                let params = formData.brn;
                const response = await _duplicateEidCheck(params);
                console.log(response.data.data);
                state.brnCheck = response.data.data.dplYn;
                state.brnInfo = response.data.data;
                state.membertype = response.data.data.admnPtnrTyCd;
                console.log(state.brnInfo, state.membertype);
            } catch (error) {
                console.log(error);
            }
        };

        //파일업로드
        const fileListUp = (type) => {
            let inputName = null;
            type === 'bizfilelist' ? inputName = fileUploadBiz : inputName = fileUploadBankBiz;
            console.log(state[type]);
            state[type] = Array.from(inputName.value.files);
        };

        //파일업로드 API
        const uploadFile = async (type) => {
            const formData = new FormData();
            formData.append('file', state[type][0]);
            // console.log(state[type][0], type);
            try {
                const response = await _uploadFile(formData);
                console.log(response.data.fileId);
                if (type === 'bizfilelist') {
                    state.bzlcCpAtflSn = response.data.fileId;
                } else {
                    state.ntprAcnCpAtflSn = response.data.fileId;
                }

                state.fileInfo.push(response.data);
            } catch (error) {
                console.log(error);
            }
        };

        // 파일 리스트 삭제 
        const fileListDel = (type) => {
            state[type] = [];
        };

        const modalOpen = async (modalName, params) => {
            resetState(); // validation reset
            if (modalName === 'isShowBrn') {
                await duplicateEidCheck();
                let msg = '';

                console.log('state.brnCheck', state.brnCheck);
                //페이어 111002, 메디컬 111004 셀러111003 디벨로퍼 111005
                if (state.brnCheck === 'Y' && state.membertype === '111005') {
                    msg = 'Seller로 가입되어 있는 사업자등록번호 입니다. 동일 사업자등록번호로 중복가입이 불가 합니다.';
                } else if (state.brnCheck === 'Y' && (state.membertype === '111005' || state.membertype === '111004' || state.membertype === '111002')) {
                    msg = state.membertype + '으로 가입되어 있는 사업자등록번호 입니다. 해당사업자 번호로 가입하시겠습니까?';
                } else if (state.brnCheck === 'N') {
                    msg = '등록 가능한 사업자 번호 입니다.';
                } else {
                    msg = '유효하지 않는 인증 번호 입니다.';
                }

                $Modal.simple({
                    message: msg,
                    buttonText: {
                        ok: '확인'
                    }
                })
                    .then(success => {
                        console.log(success);
                        if (state.brnCheck === 'Y' && state.membertype === '111003') {
                            state.brnType1 = '';
                            state.brnType2 = '';
                            state.brnType3 = '';
                        } else if (state.brnCheck === 'Y' && (state.membertype === '111005' || state.membertype === '111004' || state.membertype === '111002')) {
                            console.log();
                        } else {
                            console.log('11');
                        }
                    })
                    .catch(error => {
                        console.log(error);
                    });
            }
        };

        /**
         * @validate
         */
        const validFormData = () => {
            // const target = ['admnId', 'admnPwd', 'checkAdmnPwd', 'ntprNm', 'brn',  'bcoNm', 'indtpNm', 'rprsTlnoMno', 'adr', 'bkcd', 'acno', 'accountNm', 'ntprUcd', 'admnDepNm', 'admnNm', 'admnHhpnoFno', 'admnHhpnoMno', 'admnHhpnoBno', 'admnEmad', 'bzlcCpAtflSn', 'ntprAcnCpAtflSn'];
            const target = ['admnEmad'];

            // bzlcCpAtflSn: computed(() => state.bzlcCpAtflSn), //사업자등록증 사본
            // ntprAcnCpAtflSn: computed(() => state.ntprAcnCpAtflSn), //법인계좌  첨부파일순번

            for (const item of target) {
                console.log('check check >>', _.isEmpty(state.bizfilelist), formData['bzlcCpAtflSn']);
                // console.log('valid check item :', _.isEmpty(formData[item]));
                // console.log('value :', state.idCheck);
                // state.validState.target
                state.validState.target = item;

                // state.validState.message
                let msg = '';
                if (item === 'admnId') msg = '아이디를 입력해주세요.';
                if (item === 'admnPwd') msg = '비밀번호를 입력해주세요.';
                if (item === 'ntprNm') msg = '기업명을 입력해주세요.';
                if (item === 'brn') msg = '사업자등록번호를 입력해주세요.';
                if (item === 'bcoNm') msg = '업태를 입력해주세요.';
                if (item === 'indtpNm') msg = '종목을 입력해주세요.';
                if (item === 'rprsTlnoMno') msg = '대표 전화번호를 입력해주세요.';
                if (item === 'adr') msg = '주소를 입력해주세요.';
                if (item === 'bkcd') msg = '법인계좌은행을 선택해주세요.';
                if (item === 'acno') msg = '법인계좌번호를 입력해주세요.';
                if (item === 'accountNm') msg = '예금주명을 입력해주세요.';
                if (item === 'ntprUcd') msg = '기업코드를 입력해주세요.';
                if (item === 'admnDepNm') msg = '담당부서를 입력해주세요.';
                if (item === 'admnNm') msg = '담당자명을 입력해주세요.';
                if (item === 'admnHhpnoFno' || item === 'admnHhpnoMno' || item === 'admnHhpnoBno') msg = '휴대폰번호를 입력해주세요.';
                if (item === 'admnEmad') msg = '담당자 이메일 주소를 입력해주세요.';

                state.validState.message = msg;

                // 예외 케이스 (사업자등록번호 중복체크)
                if (item === 'brn' && !_.isEmpty(formData[item]) && (state.brnCheck === 'Y' || state.brnCheck === '')) {
                    state.validState.message = '사업자등록번호 중복체크 해주세요.';
                    state.validState.errState = true;
                    break;
                }
                // 예외 케이스 (대표번호 - 뒷자리체크)
                if (item === 'rprsTlnoMno' && _.isEmpty(formData['rprsTlnoBno'])) {
                    state.validState.message = '대표 전화번호를 입력해주세요.';
                    state.validState.errState = true;
                    break;
                }
                // 예외 케이스 (기업코드 중복체크)
                if (item === 'ntprUcd' && !_.isEmpty(formData[item]) && (state.ccdCheck === 'Y' || state.ccdCheck === '')) {
                    state.validState.message = '기업코드 중복체크 해주세요.';
                    state.validState.errState = true;
                    break;
                }
                // 예외 케이스 (보조 이메일)
                if (item === 'admnEmad' && _.isEmpty(state.mailType1)) {
                    state.validState.message = '담당자 이메일 주소를 입력해주세요.';
                    state.validState.errState = true;
                    break;
                }
                // 예외 케이스 (사업자등록증 사본 등록)
                if (item === 'bzlcCpAtflSn' && _.isEmpty(state.bizfilelist)) {
                    state.validState.message = '사업자등록증 사본을 등록해주세요.';
                    state.validState.errState = true;
                    break;
                }
                // 예외 케이스 (법인계좌 사본 등록)
                if (item === 'ntprAcnCpAtflSn' && _.isEmpty(state.bizBanklist)) {
                    state.validState.message = '법인계좌 사본을 등록해주세요.';
                    state.validState.errState = true;
                    break;
                }

                if (_.isEmpty(formData[item]) &&
                    !(item === 'bzlcCpAtflSn' || item === 'ntprAcnCpAtflSn' || item === 'checkAdmnPwd') // 예외 ( formData 없는 아이들 )
                ) {
                    state.validState.errState = true;
                    break;
                }
            }

            return !state.validState.errState;
        };

        const checkValidState = (type) => {
            return state.validState.target === type && state.validState.errState;
        };

        /**
         * @check setInputNumber
         */
        const setInputNumber = (event) => {
            const target = event.target.getAttribute('data-target');
            state[target] = event.target.value;
            console.log(event.target.getAttribute('data-target'), state[target]);
            checkReg(target, state[target]);
        };

        const checkReg = (type, value) => {
            const reg = /^[0-9*]+$/;
            if (!reg.test(value)) state[type] = state[type].replace(/[^0-9*]/g, '');
        };

        /**
         * @validation 상태 초기화
         */
        const resetState = () => {
            console.log('reset valide state');
            state.validState.type = ''; // validation
            state.validState.errState = false;
            state.validState.message = '';
        };


        return {
            //공통 사용
            _,
            $Modal,
            dayJS,
            goToPage,
            fileDown,
            tableResize,
            isDownShow,
            isPartnerShow,
            isImgShow,
            isRequestShow,
            isMdShow,
            fileUploadBankBiz,
            fileUploadBiz,
            state,
            openModal,
            formData,
            rprsTlnoFno,
            faxFno,
            bkcd,
            mailType,
            modalControl,
            openMdModal,
            selectedOptions,
            onChangemdSearch,
            actionBtns,
            fileListUp,
            modalOpen,

            changeMskgnRlsYn,
            checkValidState,
            setInputNumber,
            changeEditRol

        };
    }
};
</script>