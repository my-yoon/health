<template>
    <section>
        <div class="ui-section">
            <!-- <subTitleBar :subTitle="'기업 정보'" /> -->
            <div class="ui-section">
                <div class="ui-title-3">
                    <h3>기업 정보</h3>
                    <div class="abs"><button type="button" class="btn btn-ss" @click="getChangehistory">개인정보 변경이력
                            조회</button></div>
                </div>
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
                                <th scope="row">아이디</th>
                                <td>{{ state.infoDetail.admnId }}</td>
                                <th scope="row">가입상태</th>
                                <td>{{ state.infoDetail.jnStNm }}</td>
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
                                <td>
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
                                <th scope="row">대표자<span class="ess"><span class="offscreen">필수입력</span></span></th>
                                <td>
                                    <div class="reg-group inline">
                                        <div class="reg-item">
                                            <input type="text"
                                                :class="['form-control', { error: checkValidState('rprsvNm') }]"
                                                v-model="state.infoDetail.rprsvNm">
                                        </div>
                                    </div>
                                    <span v-if="checkValidState('rprsvNm')" class="input-guide"
                                        :class="{ 'error': checkValidState('rprsvNm') }">
                                        {{ state.validState.message }}
                                    </span>
                                </td>
                            </tr>
                            <tr>
                                <th scope="row">사업자유형<span class="ess"><span class="offscreen">필수입력</span></span></th>
                                <td colspan="3">
                                    <div class="reg-group inline">
                                        <div class="reg-item">
                                            <commselect :selectType="'searchCode.bzmTyCd'" @changedValue="selectedOptions"
                                                :initData="state.infoDetail.bzmTyCd" ref="bzmTyCd" />
                                        </div>
                                        <div class="reg-item" v-show="formData.bzmTyCd === '221001'">
                                            <!-- 법인 -->
                                            <commselect :selectType="'searchCode.bzmTyCdtype1'"
                                                @changedValue="selectedOptions" :initData="state.infoDetail.bzmTyDtlCd"
                                                ref="bzmTyDtlCd" />
                                        </div>
                                        <div class="reg-item" v-show="formData.bzmTyCd === '221002'">
                                            <!-- 개인 -->
                                            <commselect :selectType="'searchCode.bzmTyCdtype2'"
                                                @changedValue="selectedOptions" :initData="state.infoDetail.bzmTyDtlCd"
                                                ref="bzmTyDtlCd" />
                                        </div>
                                    </div>
                                    <span v-if="checkValidState('bzmTyCd')" class="input-guide"
                                        :class="{ 'error': checkValidState('bzmTyCd') }">
                                        {{ state.validState.message }}
                                    </span>
                                </td>
                            </tr>
                            <tr>
                                <th scope="row">업태<span class="ess"><span class="offscreen">필수입력</span></span></th>
                                <td>
                                    <div class="reg-group">
                                        <div class="reg-item">
                                            <input type="text"
                                                :class="['form-control', { error: checkValidState('bcoNm') }]"
                                                v-model="state.infoDetail.bcoNm">
                                        </div>
                                    </div>
                                    <span v-if="checkValidState('bcoNm')" class="input-guide"
                                        :class="{ 'error': checkValidState('bcoNm') }">
                                        {{ state.validState.message }}
                                    </span>
                                </td>
                                <th scope="row">종목<span class="ess"><span class="offscreen">필수입력</span></span></th>
                                <td>
                                    <div class="reg-group">
                                        <div class="reg-item">
                                            <input type="text"
                                                :class="['form-control', { error: checkValidState('indtpNm') }]"
                                                v-model="state.infoDetail.indtpNm">
                                        </div>
                                    </div>
                                    <span v-if="checkValidState('indtpNm')" class="input-guide"
                                        :class="{ 'error': checkValidState('indtpNm') }">
                                        {{ state.validState.message }}
                                    </span>
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
                                    <span v-if="checkValidState('rprsTlnoMno')" class="input-guide"
                                        :class="{ 'error': checkValidState('rprsTlnoMno') }">
                                        {{ state.validState.message }}
                                    </span>
                                </td>
                                <th scope="row">팩스번호</th>
                                <td>
                                    <div class="reg-group">
                                        <div class="reg-item">
                                            <commselect :selectType="'searchCode.rprsTlnoFno'" ref="faxFno"
                                                @changedValue="selectedOptions" :initData="state.faxFno" />
                                        </div>
                                        <span class="ui-coupler">-</span>
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
                                            <input type="text" :class="['form-control', { error: checkValidState('adr') }]"
                                                placeholder="주소" v-model="state.infoDetail.adr">
                                        </div>
                                        <div class="reg-item">
                                            <input type="text" :class="['form-control', { error: checkValidState('adr') }]"
                                                placeholder="상세주소" v-model="state.infoDetail.adrCts">
                                        </div>
                                    </div>
                                    <span v-if="checkValidState('adr')" class="input-guide"
                                        :class="{ 'error': checkValidState('adr') }">
                                        {{ state.validState.message }}
                                    </span>
                                </td>
                            </tr>
                            <tr>
                                <th scope="row">법인계좌번호<span class="ess"><span class="offscreen">필수입력</span></span></th>
                                <td>
                                    <div class="reg-group">
                                        <div class="reg-item">
                                            <commselect :selectType="'searchCode.bkcd'" @changedValue="selectedOptions"
                                                :initData="formData.bkcd" ref="bkcd" />
                                        </div>
                                        <div class="reg-item">
                                            <input type="text" :class="['form-control', { error: checkValidState('acno') }]"
                                                placeholder="'-'없이 계좌번호 입력" v-model="state.infoDetail.acno">
                                        </div>
                                        <div class="reg-item">
                                            <input type="text"
                                                :class="['form-control', { error: checkValidState('accountNm') }]"
                                                placeholder="예금주명" v-model="state.infoDetail.accountNm">
                                        </div>
                                    </div>
                                    <span class="input-guide"
                                        v-if="checkValidState('bkcd') || checkValidState('acno') || checkValidState('accountNm')"
                                        :class="{ 'error': checkValidState('bkcd') || checkValidState('acno') || checkValidState('accountNm') }">
                                        {{ state.validState.message }}
                                    </span>
                                </td>
                                <th scope="row">기업코드<span class="ess"><span class="offscreen">필수입력</span></span>
                                </th>
                                <td>
                                    {{ state.infoDetail.ntprUcd }}
                                    <!-- <div class="reg-group inline">
                                        <div class="reg-item">
                                            <input type="text" :class="['form-control', { error: checkValidState('ntprUcd') }]"
                                                placeholder="영문4자리의 기업코드를 입력하여 주세요" v-model="state.infoDetail.ntprUcd">
                                        </div>
                                        <div class="reg-item">
                                            <button type="button" class="btn btn-slm"
                                                :disabled="state.infoDetail.ntprUcd?.length < 4"
                                                @click="modalOpen('isShowCcd', state.infoDetail.ntprUcd)">
                                                중복체크
                                            </button>
                                        </div>
                                    </div>
                                    <span v-if="checkValidState('ntprUcd')" class="input-guide"
                                        :class="{ 'error': checkValidState('ntprUcd') }">
                                        {{ state.validState.message }}
                                    </span> -->
                                </td>
                            </tr>
                            <tr>
                                <th scope="row">서비스타입</th>
                                <td>{{ state.infoDetail.admnPtnrSelrSvcTyNm }}
                                </td>
                                <th scope="row">추천기업</th>
                                <td>{{ state.infoDetail.rcmNtprNm ?
                                    `${state.infoDetail.rcmNtprNm}(${state.infoDetail.rcmNtprUcd})` : '-' }}</td>
                                <!-- <td>{{ state.infoDetail.rcmNtprNm }}({{ state.infoDetail.rcmNtprUcd }})</td> -->
                            </tr>
                            <tr>
                                <th scope="row">패널티 적용여부</th>
                                <td>
                                    <template v-if="state.infoDetail.pnltAplYn === 'Y'">
                                        적용
                                    </template>
                                    <template v-if="state.infoDetail.pnltAplYn === 'N'">
                                        미적용
                                    </template>
                                </td>
                                <th scope="row">마진율<span class="ess"><span class="offscreen">필수입력</span></span></th>
                                <td>
                                    <div class="reg-group inline">
                                        <div class="reg-item">
                                            <input type="text"
                                                :class="['form-control', { error: checkValidState('mgnRt') }]"
                                                v-model="state.infoDetail.mgnRt"> &nbsp; %
                                        </div>
                                    </div>
                                    <span v-if="checkValidState('mgnRt')" class="input-guide"
                                        :class="{ 'error': checkValidState('mgnRt') }">
                                        {{ state.validState.message }}
                                    </span>
                                </td>
                            </tr>
                            <tr>
                                <th scope="row">담당MD<span class="ess"><span class="offscreen">필수입력</span></span>
                                </th>
                                <td>
                                    <div class="reg-group">
                                        <!-- 담당MD순번: {{ state.infoDetail.mdAdmnSn }} -->
                                        <div class="reg-item">
                                            <input type="text"
                                                :class="['form-control', { error: checkValidState('mdAdmnSn') }]"
                                                v-model="state.infoDetail.mdAdmnNm">
                                        </div>
                                        <div class="reg-item">
                                            <button type="button" class="btn btn-slm" @click="openMdModal">조회</button>
                                        </div>
                                    </div>
                                    <span v-if="checkValidState('mdAdmnSn')" class="input-guide"
                                        :class="{ 'error': checkValidState('mdAdmnSn') }">
                                        {{ state.validState.message }}
                                    </span>
                                </td>
                                <th scope="row">거래처코드(더존ERP)<span class="ess"><span class="offscreen">필수입력</span></span>
                                </th>
                                <td>
                                    <div class="reg-group inline">
                                        <div class="reg-item">
                                            <input type="text"
                                                :class="['form-control', { error: checkValidState('dlngPlcCd') }]"
                                                v-model="state.infoDetail.dlngPlcCd">
                                        </div>
                                    </div>
                                    <span v-if="checkValidState('dlngPlcCd')" class="input-guide"
                                        :class="{ 'error': checkValidState('dlngPlcCd') }">
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
                                            <button type="button" class="btn btn-slm"
                                                :disabled="_.isEmpty(state.mailType1) || state.emadCheck === 'N' || (formData.admnEmad === state.infoDetailOrigin.admnEmad)"
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
                                    <span v-if="checkValidState('bzlcCpAtflSn')" class="input-guide"
                                        :class="{ 'error': checkValidState('bzlcCpAtflSn') }">
                                        {{ state.validState.message }}
                                    </span>
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
                                    <span v-if="checkValidState('ntprAcnCpAtflSn')" class="input-guide"
                                        :class="{ 'error': checkValidState('ntprAcnCpAtflSn') }">
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
                                        dayJS(state.infoDetail.admnJnDt).format('YYYY-MM-DD HH:mm:ss') : ' - '
                                    }}
                                </td>
                                <th scope="row">로그인 잠김</th>
                                <td>Y(실패횟수)</td>
                            </tr>
                            <tr>
                                <th scope="row">최종로그인일시</th>
                                <td>
                                    {{ state.infoDetail.admnLtlyLgnDt ? dayJS(state.infoDetail.admnLtlyLgnDt).format('YYYY-MM-DD HH:mm:ss') : '-' }}
                                </td>
                                <th scope="row">비밀번호 수정일자</th>
                                <td>
                                    {{ state.infoDetail.admnPwdChgDt ? dayJS(state.infoDetail.admnPwdChgDt).format('YYYY-MM-DD HH:mm:ss') : '-' }}
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
                                    {{ state.infoDetail.updLvlEngNm ? `${state.infoDetail.updLvlEngNm}(${state.infoDetail.updUsrNm})` : '-' }}
                                </td>
                                <th scope="row">수정일자</th>
                                <td>
                                    {{ state.infoDetail.updDt ? dayJS(state.infoDetail.updDt).format('YYYY-MM-DD HH:mm:ss') : '-' }}
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
        <div class="btn-bottom-set flex justify-center">
            <button type="button" class="btn btn-sl nega" @click="goToPage('/seller/info/list')">취소</button>
            <button :disabled="!state.mskgnRlsYn" class="btn btn-sl nega" type="button" @click="changeMskgnRlsYn">
                마스킹해제
            </button>
            <button type="button" class="btn btn-sl posi" @click="checkEdit">저장</button>
        </div>


        <!-- MD검색 -->
        <DefaultModal :buttonCancel="''" :buttonConfirm="'닫기'" :isShow="isMdShow" :modalName="'isMdShow'" modalTitle="MD조회"
            @modalclose="modalControl">
            <template #modalcontent>
                <MdSearch @selectValue="onChangemdSearch" />
            </template>
        </DefaultModal>

        <!-- 가입 및 이력 정보 -->
        <DefaultModal :buttonCancel="''" :buttonConfirm="'닫기'" :className="'full'" :isShow="isHistoryShow"
            :modalName="'isHistoryShow'" modalTitle="개인정보 변경 사유" @modalclose="modalControl">
            <template #modalcontent>
                <div>
                    <NoData v-if="_.isEmpty(state.infoHistory)" :nodatatext="'조회된 데이터가 없습니다.'">
                    </NoData>
                    <div v-else>
                        <!-- <div class="ui-grid-top-guide mt-16">
                            <p>회원 개인정보 변경이 발생할 경우 변경 요청자 정보와 사유, 녹취 파일명을 등록해주세요.</p>
                        </div>
                        <div class="ui-grid-top-guide mt-10 t-right">
                            <span class="ess"></span> 표시는 필수항목입니다.
                        </div> -->
                        <div class="tbl-wrap mt-20" v-for="(history, index) in state.infoHistory" :key="index">
                            <table class="table reg">
                                <colgroup>
                                    <col style="width: 120px;">
                                    <col style="width: auto;">
                                </colgroup>
                                <tbody v-if="history">
                                    <tr>
                                        <th scope="row">대상 항목</th>
                                        <td>{{ history.infChgItmNmCts }}</td>
                                    </tr>
                                    <tr>
                                        <th scope="row">수정자</th>
                                        <td>{{ history.admnNm }}</td>
                                    </tr>
                                    <tr>
                                        <th scope="row">수정일자</th>
                                        <td>{{ history.fstRgsDt }}</td>
                                    </tr>
                                    <tr>
                                        <th scope="row">요청자</th>
                                        <td>{{ history.rqstpNm }}</td>
                                    </tr>
                                    <tr>
                                        <th scope="row">요청자 소속</th>
                                        <td>{{ history.rqstpBln }}</td>
                                    </tr>
                                    <tr>
                                        <th scope="row">요청자 사유</th>
                                        <td>{{ history.rqstpRsn }}</td>
                                    </tr>
                                    <tr>
                                        <th scope="row">녹취 파일명</th>
                                        <td>{{ history.recFlNm }}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </template>
        </DefaultModal>

        <!-- 개인정보 변경 사유 -->
        <DefaultModal :buttonCancel="''" :buttonConfirm="'저장'" :isShow="infoChangeShow" :modalName="'infoChangeShow'"
            modalTitle="개인정보 변경 사유" @modalclose="modalControl">
            <template #modalcontent>
                <div>
                    <div class="ui-grid-top-guide mt-16">
                        <p>회원 개인정보 변경이 발생할 경우 변경 요청자 정보와 사유, 녹취 파일명을 등록해주세요.</p>
                    </div>
                    <div class="ui-grid-top-guide mt-10 t-right">
                        <span class="ess"></span> 표시는 필수항목입니다.
                    </div>
                    <div class="tbl-wrap mt-10">
                        <table class="table reg">
                            <colgroup>
                                <col style="width: 120px;">
                                <col style="width: auto;">
                            </colgroup>
                            <tbody>
                                <tr>
                                    <th scope="row">요청자<span class="ess"><span class="offscreen">필수입력</span></span></th>
                                    <td>
                                        <div class="reg-group">
                                            <div class="reg-item">
                                                <input v-model="state.pinfChgRsn.rqstpNm"
                                                    :class="['form-control', { error: checkValidState('rqstpNm') }]"
                                                    type="text">
                                            </div>
                                        </div>
                                        <div v-if="checkValidState('rqstpNm')">
                                            <p :class="{ 'error': state.validState.errState }" class="input-guide">
                                                {{ state.validState.message }}
                                            </p>
                                        </div>
                                    </td>
                                </tr>
                                <tr>
                                    <th scope="row">요청자 소속</th>
                                    <td>
                                        <div class="reg-group">
                                            <div class="reg-item">
                                                <input v-model="state.pinfChgRsn.rqstpBln" class="form-control" type="text">
                                            </div>
                                        </div>
                                    </td>
                                </tr>
                                <tr>
                                    <th scope="row">대상정보</th>
                                    <td>
                                        <div class="reg-group">
                                            <div class="reg-item">
                                                <span class="checkbox">
                                                    <input id="trgInf_acno" name="kbGroup" type="checkbox" value="담당자명"
                                                        disabled
                                                        :checked="state.infoDetail.acno !== state.infoDetailOrigin.acno">
                                                    <label for="trgInf_acno">법인계좌번호</label>
                                                </span>
                                                <span class="checkbox">
                                                    <input id="trgInf_admnNm" name="kbGroup" type="checkbox" value="담당자명"
                                                        disabled
                                                        :checked="state.infoDetail.admnNm !== state.infoDetailOrigin.admnNm">
                                                    <label for="trgInf_admnNm">담당자명</label>
                                                </span>
                                                <span class="checkbox">
                                                    <input id="trgInf_admnHhpno" name="kbGroup" type="checkbox"
                                                        value="담당자휴대폰번호" disabled
                                                        :checked="`${state.admnHhpnoFno}-${state.admnHhpnoMno}-${state.admnHhpnoBno}` !== state.infoDetailOrigin.admnHhpno">
                                                    <label for="trgInf_admnHhpno">담당자휴대폰번호</label>
                                                </span>
                                                <span class="checkbox">
                                                    <input id="trgInf_admnEmad" name="kbGroup" type="checkbox"
                                                        value="담당자이메일주소" disabled
                                                        :checked="formData.admnEmad !== state.infoDetailOrigin.admnEmad">
                                                    <label for="trgInf_admnEmad">담당자이메일주소</label>
                                                </span>
                                            </div>
                                        </div>
                                        <div class="reg-item">
                                            <span class="checkbox">
                                                <input id="trgInf_bizBank" name="kbGroup" type="checkbox" value="법인계좌사본"
                                                    disabled
                                                    :checked="state.bizBanklist[0].name !== state.infoDetailOrigin.ntprAcnCpAtflNm">
                                                <label for="trgInf_bizBank">법인계좌사본</label>
                                            </span>
                                        </div>
                                    </td>
                                </tr>
                                <tr>
                                    <th scope="row">요청 사유<span class="ess"><span class="offscreen">필수입력</span></span>
                                    </th>
                                    <td>
                                        <div class="reg-group">
                                            <div class="reg-item">
                                                <textarea id="textarea" v-model="state.pinfChgRsn.rqstRsn"
                                                    :class="['form-control', { error: checkValidState('rqstRsn') }]"
                                                    placeholder="개인정보 변경이 발생한 사유를 입력해주세요." style="height: 100px"></textarea>
                                            </div>
                                        </div>
                                        <div v-if="checkValidState('rqstRsn')">
                                            <p :class="{ 'error': state.validState.errState }" class="input-guide">
                                                {{ state.validState.message }}
                                            </p>
                                        </div>
                                    </td>
                                </tr>
                                <tr>
                                    <th scope="row">녹취 파일명<span class="ess"><span class="offscreen">필수입력</span></span>
                                    </th>
                                    <td>
                                        <div class="reg-group">
                                            <div class="reg-item">
                                                <input v-model="state.pinfChgRsn.recFnm"
                                                    :class="['form-control', { error: checkValidState('recFnm') }]"
                                                    type="text">
                                            </div>
                                        </div>
                                        <div v-if="checkValidState('recFnm')">
                                            <p :class="{ 'error': state.validState.errState }" class="input-guide">
                                                {{ state.validState.message }}
                                            </p>
                                        </div>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </template>
        </DefaultModal>
    </section>
</template>
<script>
import { reactive, inject, onMounted, onUnmounted, ref, computed, watch } from 'vue';
import { useStore } from 'vuex';
import { useRoute } from 'vue-router';
import { useCommFunc } from '@/core/helper/common.js';
import { authCommFunc } from '@/core/helper/authComm.js';
import { commoCode } from '@/data/commcode';

import { _getSellerInfoDetail, _registSellerInfoDetail, _duplicateEidCheck, _duplicateEmailCheck, _getChangehistory } from '@/api/seller.js';

import DefaultModal from '@/plugins/modal/modal/DefaultModal.vue';
import MdSearch from '@/components/ui/MdSearch.vue';
export default {
    components: { DefaultModal, MdSearch },
    setup() {
        const $Modal = inject('$Modal');
        const dayJS = inject('dayJS');
        const fileUploadBiz = ref(null);
        const fileUploadBankBiz = ref(null);
        const bzmTyCd = ref(null);
        const bzmTyDtlCd = ref(null);
        const rprsTlnoFno = ref(null);
        const faxFno = ref(null);
        const bkcd = ref(null);
        const mailType = ref(null);
        const { goToPage, openModal, validEmail, getImageInfo } = useCommFunc();
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
        const { onChangeMaskingRol, onChangeEditRol } = authCommFunc();
        const menuInfo = computed(() => store.state.getMenuItem.menuInfo);

        const store = useStore();
        const route = useRoute();
        const isMdShow = ref(false);
        const infoChangeShow = ref(false);
        const isHistoryShow = ref(false);
        const state = reactive({
            infoDetail: {},
            infoDetailOrigin: {}, // 담당자명, 담당자 휴대폰번호, 담당자 이메일주소, 법인계좌사본 change value 확인용 ( 개인정보 변경 사유 )
            infoHistory: [],
            pagesize: 10,
            masking: 'N',
            detailNum: '',
            brn1: '',
            brn2: '',
            brn3: '',
            brnCheck: '',
            emadCheck: '', // 이메일 중복체크
            brnInfo: {},
            mailType1: '',
            mailType2: '103014',
            mailType2Name: '',
            bzlcCpAtflSn: '',
            ntprAcnCpAtflSn: '',
            bizfilelist: [],
            bizBanklist: [],
            mskgnRlsYn: true,
            rprsTlnoFno: '102001', //대표전화번호(앞번호)
            rprsTlnoMno: '', //대표전화번호(중간번호)
            rprsTlnoBno: '', //대표전화번호(뒷번호)
            faxFno: '102001', //팩스번호(앞번호)
            faxMno: '', //팩스번호(중간번호)
            faxBno: '', //팩스번호(뒷번호)
            admnHhpnoFno: '010', //담당자휴대폰번호(앞번호
            admnHhpnoMno: '', //담당자휴대폰번호(중간번호)
            admnHhpnoBno: '', //담당자휴대폰번호(뒷번호)
            // dlngPlcCd: '', //거래처코드(더존ERP)

            validState: {
                type: '', // validation check ( formData )
                errState: false, // error state
                message: '' // input message
            },

            /**
             * 개인정보 변경 사유 ( 변경내용 없을 경우 null )
             * @trgInf 변경이 있을 경우 해당 target 을 push 한다.
             */
            pinfChgRsn: {
                rqstpNm: '',
                rqstpBln: '',
                rqstRsn: '',
                trgInf: [
                    // { trgItmNm: '담당자명' },
                    // { trgItmNm: '담당자휴대폰번호' },
                    // { trgItmNm: '담당자이메일주소' }
                    // { trgItmNm: '법인계좌번호' },
                    // { trgItmNm: '법인계좌사본' }
                    // { trgItmNm: '의사면허증사본' }
                ],
                recFnm: ''
            }

        });

        const formData = reactive({
            admnSn: computed(() => state.infoDetail.admnSn), //어드민순번
            ntprSn: computed(() => state.infoDetail.ntprSn), //기업순번
            brn: computed(() => `${state.brn1}${state.brn2}${state.brn3}`), //사업자등록번호
            rprsvNm: computed(() => state.infoDetail.rprsvNm),
            bzmTyCd: '', //사업자 유형
            bzmTyDtlCd: '',
            bcoNm: computed(() => state.infoDetail.bcoNm), //업태 
            indtpNm: computed(() => state.infoDetail.indtpNm), //종목
            rprsTlnoFno: computed(() => commoCode.searchCode.rprsTlnoFno.filter(d => d.cmnCd === state.rprsTlnoFno)[0].cmnCdNm), //대표전화번호(앞번호)
            rprsTlnoMno: computed(() => state.rprsTlnoMno), //대표전화번호(중간번호)
            rprsTlnoBno: computed(() => state.rprsTlnoBno), //대표전화번호(뒷번호)
            faxFno: computed(() => commoCode.searchCode.rprsTlnoFno.filter(d => d.cmnCd === state.faxFno)[0].cmnCdNm), //대표전화번호(앞번호)
            faxMno: computed(() => state.faxMno), //팩스번호(중간번호)
            faxBno: computed(() => state.faxBno), //팩스번호(뒷번호)
            zc: '12345', //우편번호
            adr: computed(() => state.infoDetail.adr), //주소
            adrCts: computed(() => state.infoDetail.adrCts), //상세주소
            bkcd: '', //은행
            acno: computed(() => state.infoDetail.acno), //법인계좌번호
            accountNm: computed(() => state.infoDetail.accountNm), //예금주명
            mdAdmnSn: computed(() => state.infoDetail.mdAdmnSn), //담당MD(MD관리자순번)
            dlngPlcCd: computed(() => state.infoDetail.dlngPlcCd), //거래처코드(더존ERP)
            admnDepNm: computed(() => state.infoDetail.admnDepNm), //담당부서
            admnNm: computed(() => state.infoDetail.admnNm), //담당자명
            admnHhpnoFno: computed(() => state.admnHhpnoFno), //담당자휴대폰번호(앞번호
            admnHhpnoMno: computed(() => state.admnHhpnoMno), //담당자휴대폰번호(중간번호)
            admnHhpnoBno: computed(() => state.admnHhpnoBno), //담당자휴대폰번호(뒷번호)
            admnEmad: computed(() => state.mailType2 === '103014' ? `${state.mailType1}` : `${state.mailType1}@${state.mailType2Name}`), //담당자이메일주소 (103014: 직접입력)
            bzlcCpAtflSn: computed(() => state.infoDetail.bzlcCpAtflSn), //사업자등록증 사본(첨부파일순번)
            ntprAcnCpAtflSn: computed(() => state.infoDetail.ntprAcnCpAtflSn), //법인계좌 사본(첨부파일순번)
            mgnRt: computed(() => state.infoDetail.mgnRt) //마진율
        });

        watch(formData, () => {
            resetState();
        });
        watch(state.pinfChgRsn, () => {
            resetState();
        });
        watch(() => [state.brnType1, state.brnType2, state.brnType3], () => {
            state.brnCheck = '';
        });
        // 개인정보 변경 사유 check
        watch(() => [formData.acno, formData.admnNm, formData.admnHhpnoFno, formData.admnHhpnoMno, formData.admnHhpnoBno, state.bizBanklist], () => {
            console.log('watch 개인정보변경');
            if (state.infoDetailOrigin) {
                console.log(state.infoDetail.admnNm, state.infoDetailOrigin.admnNm);
                if (state.infoDetail.acno !== state.infoDetailOrigin.acno) {
                    // console.log('1');
                    const item = { trgItmNm: '법인계좌번호' };
                    if (!state.pinfChgRsn.trgInf.some(obj => JSON.stringify(obj) === JSON.stringify(item))) state.pinfChgRsn.trgInf.push(item);
                } else {
                    // console.log('2');
                    const item = { trgItmNm: '법인계좌번호' };
                    const _index = state.pinfChgRsn.trgInf.findIndex(obj => JSON.stringify(obj) === JSON.stringify(item));
                    if (_index !== -1) state.pinfChgRsn.trgInf.splice(_index, 1);
                }

                if (state.infoDetail.admnNm !== state.infoDetailOrigin.admnNm) {
                    // console.log('1');
                    const item = { trgItmNm: '담당자명' };
                    if (!state.pinfChgRsn.trgInf.some(obj => JSON.stringify(obj) === JSON.stringify(item))) state.pinfChgRsn.trgInf.push(item);
                } else {
                    // console.log('2');
                    const item = { trgItmNm: '담당자명' };
                    const _index = state.pinfChgRsn.trgInf.findIndex(obj => JSON.stringify(obj) === JSON.stringify(item));
                    if (_index !== -1) state.pinfChgRsn.trgInf.splice(_index, 1);
                }
                if (`${formData.admnHhpnoFno}-${formData.admnHhpnoMno}-${formData.admnHhpnoBno}` !== state.infoDetailOrigin.admnHhpno) {
                    // console.log('3');
                    const item = { trgItmNm: '담당자휴대폰번호' };
                    if (!state.pinfChgRsn.trgInf.some(obj => JSON.stringify(obj) === JSON.stringify(item))) state.pinfChgRsn.trgInf.push(item);
                } else {
                    // console.log('4');
                    const item = { trgItmNm: '담당자휴대폰번호' };
                    const _index = state.pinfChgRsn.trgInf.findIndex(obj => JSON.stringify(obj) === JSON.stringify(item));
                    if (_index !== -1) state.pinfChgRsn.trgInf.splice(_index, 1);
                }

                if (formData.admnEmad !== state.infoDetailOrigin.admnEmad) {
                    // console.log('5');
                    state.emadCheck = '';
                    const item = { trgItmNm: '담당자이메일주소' };
                    if (!state.pinfChgRsn.trgInf.some(obj => JSON.stringify(obj) === JSON.stringify(item))) state.pinfChgRsn.trgInf.push(item);
                } else {
                    // console.log('6');
                    const item = { trgItmNm: '담당자이메일주소' };
                    const _index = state.pinfChgRsn.trgInf.findIndex(obj => JSON.stringify(obj) === JSON.stringify(item));
                    if (_index !== -1) state.pinfChgRsn.trgInf.splice(_index, 1);
                }

                if (state.bizBanklist.lenght > 0 && state.bizBanklist[0].name !== state.infoDetailOrigin.ntprAcnCpAtflNm) {
                    const item = { trgItmNm: '법인계좌사본' };
                    if (!state.pinfChgRsn.trgInf.some(obj => JSON.stringify(obj) === JSON.stringify(item))) state.pinfChgRsn.trgInf.push(item);
                } else {
                    const item = { trgItmNm: '법인계좌사본' };
                    const _index = state.pinfChgRsn.trgInf.findIndex(obj => JSON.stringify(obj) === JSON.stringify(item));
                    if (_index !== -1) state.pinfChgRsn.trgInf.splice(_index, 1);
                }
            }
        });
        watch(() => [formData.admnEmad], () => {
            console.log('watch 개인정보변경');
            if (state.infoDetailOrigin) {
                if (formData.admnEmad !== state.infoDetailOrigin.admnEmad) {
                    // console.log('5');
                    state.emadCheck = '';
                    const item = { trgItmNm: '담당자이메일주소' };
                    if (!state.pinfChgRsn.trgInf.some(obj => JSON.stringify(obj) === JSON.stringify(item))) state.pinfChgRsn.trgInf.push(item);
                } else {
                    state.emadCheck = 'N';
                    // console.log('6');
                    const item = { trgItmNm: '담당자이메일주소' };
                    const _index = state.pinfChgRsn.trgInf.findIndex(obj => JSON.stringify(obj) === JSON.stringify(item));
                    if (_index !== -1) state.pinfChgRsn.trgInf.splice(_index, 1);
                }
            }
        });

        onMounted(() => {
            console.log(route.query.ntprSn);
            state.detailNum = route.query.ntprSn;
            // state.mskgnRlsYn = route.query.mskgnRlsYn;
            getSellerInfoDetail();

            emitter.$on('onChangeEdit', onChangeEdit);
            emitter.$on('onChangeMskgn', onChangeMskgn);
        });

        // 마스킹 해제 이벤트 버스 해제
        onUnmounted(() => {
            emitter.$off('onChangeEdit');
            emitter.$off('onChangeMskgn');
        });

        /**
         * 수정 권한 체크
         */
        const checkEdit = async () => {
            // await onChangeEditRol(menuInfo.value.auth2UpdateYn);
            await onChangeEditRol('Y');
        };

        /**
         * 수정 권한 체크 callback
         */
        const onChangeEdit = () => {
            checkChangeInfo(); // 개인정보 변경 여부 체크 후
            // actionBtns('confirm');
        };

        /**
         * 마스킹 권한 체크
         */
        const changeMskgnRlsYn = async () => {
            // await onChangeMaskingRol(menuInfo.value.auth6MaskingYn);
            await onChangeMaskingRol('Y');
        };

        /**
         * 마스킹 해제 처리 callback
         */
        const onChangeMskgn = () => {
            state.mskgnRlsYn = !state.mskgnRlsYn;
            getSellerInfoDetail();
        };

        /**
         * 공통 코드 컴포넌트 callback
         */
        const selectedOptions = (valueCode, valueName, type) => {
            if (type === 'rprsTlnoFno') {
                // formData[type] = valueName;
                state[type] = valueCode;
            } else if (type === 'mailType2') {
                state.mailType2 = valueCode;
                state.mailType2Name = valueName;
            } else if (type === 'bzmTyCdtype1' || type === 'bzmTyCdtype2') { // 사업자유형 상세
                formData.bzmTyDtlCd = valueCode;
            } else {
                formData[type] = valueCode;
            }
            console.log(valueCode, valueName, type);
        };

        /**
         * 개인정보 변경 히스토리 조회
         */
        const getChangehistory = async () => {
            try {
                isHistoryShow.value = true;
                const response = await _getChangehistory(formData.admnSn);
                console.log(response);
                state.infoHistory = response.data.data;
            } catch (error) {
                console.log(error);
            }
        };

        /**
         * 개인정보 변경 체크
         * @pinfChgRsn : { // 개인정보 변경
            rqstpNm: '',
            rqstpBln: '',
            rqstRsn: '',
            trgInf
         */
        const checkChangeInfo = () => {
            // infoChangeShow
            console.log(state.pinfChgRsn.trgInf);
            if (state.pinfChgRsn.trgInf.length > 0) {
                infoChangeShow.value = true;
            } else {
                actionBtns('confirm');
            }
        };
        const actionBtns = async (type) => {
            if (type === 'confirm') {
                if (state.mskgnRlsYn) {
                    $Modal.confirm({
                        title: '',
                        message: '마스킹 해제 후 저장이 가능합니다.',
                        buttonText: {
                            confirm: '확인'
                        }
                    })
                        .then(async (success) => {
                            console.log(success);
                        })
                        .catch(error => {
                            console.log(error);
                        });
                } else {
                    if (validFormData()) {
                        // state.modalMsg = 'Seller정보를 저장할까요??';
                        $Modal.confirm({
                            title: '',
                            message: 'Seller정보를 저장할까요??',

                            buttonText: {
                                confirm: '확인',
                                cancel: '취소'
                            }
                        })
                            .then(async (success) => {
                                console.log(success);
                                if (type === 'confirm') {
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
                        // 
                    }
                }
            }
        };

        /**
         * 상세조회 ( _getSellerInfoDetail )
         */
        const getSellerInfoDetail = async () => {
            try {
                let params = {
                    mskgnRlsYn: state.mskgnRlsYn ? 'Y' : 'N'
                };
                const response = await _getSellerInfoDetail(state.detailNum, params);
                console.log(response.data.data);
                state.infoDetail = response.data.data;
                state.infoDetailOrigin = _.cloneDeep(response.data.data);
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
            // state.brnTextList;
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

            state.rprsTlnoFno = commoCode.searchCode.rprsTlnoFno.filter(d => d.cmnCdNm === telNum)[0]?.cmnCd || '102001';
            state.rprsTlnoMno = state.mskgnRlsYn ? state.infoDetail.rprsTlno.split('-')[1].slice(0, 4) : state.infoDetail.rprsTlno.split('-')[1];
            state.rprsTlnoBno = state.infoDetail.rprsTlno.slice(-4);
            state.faxFno = commoCode.searchCode.rprsTlnoFno.filter(d => d.cmnCdNm === faxNum)[0]?.cmnCd || '102001';
            state.faxMno = state.infoDetail.fax.split('-')[1];
            state.faxBno = state.infoDetail.fax.split('-')[2];

            rprsTlnoFno.value.state.selectOption = state.rprsTlnoFno;
            faxFno.value.state.selectOption = state.faxFno;

            // 사업자유형
            bzmTyCd.value.state.selectOption = state.infoDetail.bzmTyCd;
            formData.bzmTyCd = state.infoDetail.bzmTyCd;
            if (state.infoDetail.bzmTyDtlCd) {
                bzmTyDtlCd.value.state.selectOption = state.infoDetail.bzmTyDtlCd;
                formData.bzmTyDtlCd = state.infoDetail.bzmTyDtlCd;
            }

            //이메일 cmnCdNm
            let mail = state.infoDetail.admnEmad.split('@')[0];
            let mailD = state.infoDetail.admnEmad.split('@')[1];
            let mailDomain = null;

            mailDomain = mailType.value.state.selectComm.filter(item => mailD === item.cmnCdNm);
            if (mailDomain.length > 0) {
                state.mailType2 = mailType.value.state.selectOption = mailDomain[0].cmnCd;
                state.mailType2Name = mailDomain[0].cmnCdNm;
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

            // formData.dlngPlcCd = state.infoDetail.dlngPlcCd; // 거래처코드(더존ERP)

        };

        //상세 수정시
        const registSellerInfoDetail = async () => {
            try {
                let params = {
                    admnSn: formData.admnSn,
                    ntprSn: formData.ntprSn,
                    brn: formData.brn,
                    rprsvNm: formData.rprsvNm,
                    bzmTyCd: formData.bzmTyCd,
                    bzmTyDtlCd: formData.bzmTyDtlCd,

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
                    mgnRt: formData.mgnRt,
                    dlngPlcCd: formData.dlngPlcCd,
                    pinfChgRsn: state.pinfChgRsn
                };
                console.log(params);
                const response = await _registSellerInfoDetail(params);
                // await goToPage('/seller/info/list');
                if (response.data.code === 'OK') {
                    toast('저장되었습니다', 2000, 'success');
                }
            } catch (error) {
                console.log(error);
            }
        };
        // 모달창 닫기
        const modalControl = (type, modalName) => {
            console.log(type, modalName);
            if (modalName === 'isMdShow') {
                isMdShow.value = false;
            } else if (modalName === 'infoChangeShow') {
                if (type === 'modalconfirm') {
                    if (validInfoChange()) {
                        infoChangeShow.value = false;
                        if (type === 'modalconfirm') {
                            actionBtns('confirm'); // 저장
                        }
                    }
                } else {
                    infoChangeShow.value = false;
                }
            } else if (modalName === 'isHistoryShow') {
                isHistoryShow.value = false;
            } else if (!modalName) {
                isMdShow.value = false;
                infoChangeShow.value = false;
                isHistoryShow.value = false;
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
        const fileListUp = async (type) => {
            let inputName = null;
            type === 'bizfilelist' ? inputName = fileUploadBiz : inputName = fileUploadBankBiz;
            console.log(state[type]);
            state[type] = Array.from(inputName.value.files);
            await getImageInfo(state[type][0], imageSizeCallback);
            function imageSizeCallback(callback) {
                console.log('111', callback, callback.fileType.includes('png'));
                if (!(callback.fileType.includes('png') || callback.fileType.includes('jpg') || callback.fileType.includes('jpeg') || callback.fileType.includes('gif') || callback.fileType.includes('pdf'))) {
                    $Modal.simple({
                        message: '파일의 확장자를 확인해주세요.',
                        buttonText: {
                            ok: '확인'
                        }
                    })
                        .then(success => {
                            state[type] = '';
                        })
                        .catch(error => {
                            console.log(error);
                        });
                } else if (callback.fileSize > 2048) {
                    $Modal.simple({
                        message: '이미지 용량을 확인해주세요.',
                        buttonText: {
                            ok: '확인'
                        }
                    })
                        .then(success => {
                            state[type] = '';
                        })
                        .catch(error => {
                            console.log(error);
                        });
                }
            }
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
            console.log('fileListDel state.bizfilelist', type);
            state[type] = [];
        };

        const modalOpen = async (modalName, params) => {
            resetState(); // validation reset
            if (modalName === 'isShowBrn') {
                await duplicateEidCheck();
                let msg = '';

                console.log('state.brnCheck', state.brnCheck);
                // 페이어 111002, 메디컬 111004 셀러 111003 디벨로퍼 111005 
                // C00 페이어, B00 셀러, E00 메디컬, F00 디벨로퍼
                /**
                 * @brnCheck 사업자등록번호 존재 유무 ( Y | N ) @dplYn
                 * @membertype 신청/가입 된 ptnr ( num, num, num ) @admnPtnrTyCd
                 */
                if (state.brnCheck === 'Y' && state.membertype !== null) {
                    console.log('state.brnCheck', state.membertype.includes('111003'));
                    let joinType = '';
                    if (state.membertype.includes('111002')) joinType = `${joinType}${joinType === '' ? '' : ','} 페이어`;
                    if (state.membertype.includes('111003')) joinType = `${joinType}${joinType === '' ? '' : ','} 셀러`;
                    if (state.membertype.includes('111004')) joinType = `${joinType}${joinType === '' ? '' : ','} 메디컬`;
                    if (state.membertype.includes('111005')) joinType = `${joinType}${joinType === '' ? '' : ','} 디벨로퍼`;

                    if (state.membertype.includes('111003')) { // 셀러로 가입 되어 있을 때 ( 여기는 셀러 가입 페이지 )
                        msg = '셀러로 가입되어 있는 사업자등록번호 입니다. 동일 사업자등록번호로 중복가입이 불가 합니다.';
                    } else {
                        msg = `${joinType}으로 가입되어 있는 사업자등록번호 입니다. 해당사업자 번호로 가입하시겠습니까?`;
                    }
                } else {
                    msg = '등록 가능한 사업자 번호 입니다.';
                }

                $Modal.simple({
                    message: msg,
                    buttonText: {
                        ok: '확인'
                    }
                })
                    .then(success => {
                        console.log(success);

                        if (state.brnCheck === 'Y') {
                            if (state.membertype !== null && state.membertype.includes('111003')) {
                                state.brnType1 = '';
                                state.brnType2 = '';
                                state.brnType3 = '';

                                state.brnCheck = '';
                            } else {
                                setBrnSetting();
                            }
                        }
                    })
                    .catch(error => {
                        console.log(error);
                    });
            } else if (modalName === 'isShowEmad') { // 이메일 중복체크
                //
                await duplicateEmailCheck();
                let msg = '';
                if (state.emadCheck === 'N') {
                    // ok
                    console.log(validEmail(formData.admnEmad));
                    msg = validEmail(formData.admnEmad) ? '등록 가능한 이메일 입니다.' : '유효하지 않은 이메일 주소 입니다.';
                } else {
                    // 중복 state.emadCheck === 'Y'
                    msg = '중복된 이메일이 있습니다.';
                }
                $Modal.simple({
                    message: msg,
                    buttonText: {
                        ok: '확인'
                    }
                }).then(success => {
                    if (state.ccdCheck === 'Y') {
                        // 중복
                        // formData.admnEmad = '';
                        state.mailType1 = '';
                    }
                });
            }
        };

        /**
         * @setting 사업자등록번호 조회 등록 정보
         */
        const setBrnSetting = () => {
            formData.ntprNm = state.brnInfo.ntprNm;
            formData.bzmTyCd = state.brnInfo.bzmTyCd || '';
            formData.bzmTyDtlCd = state.brnInfo.bzmTyDtlCd || '';
            state.infoDetail.bcoNm = state.brnInfo.bcoNm;
            state.infoDetail.indtpNm = state.brnInfo.indtpNm;

            state.rprsTlnoFno = commoCode.searchCode.rprsTlnoFno.filter(d => d.cmnCdNm === state.brnInfo.rprsTlnoFno)[0]?.cmnCd || '102001';
            state.rprsTlnoMno = state.brnInfo.rprsTlnoMno;
            state.rprsTlnoBno = state.brnInfo.rprsTlnoBno;
            state.faxFno = commoCode.searchCode.rprsTlnoFno.filter(d => d.cmnCdNm === state.brnInfo.faxFno)[0]?.cmnCd || '102001';
            state.faxMno = state.brnInfo.faxMno;
            state.faxBno = state.brnInfo.faxBno;

            state.infoDetail.zc = state.brnInfo.zc;
            state.infoDetail.adr = state.brnInfo.adr;
            state.infoDetail.adrCts = state.brnInfo.adrCts;
            bkcd.value.state.selectOption = state.infoDetail.bkcd;
            formData.bkcd = state.infoDetail.bkcd;
            state.infoDetail.acno = state.brnInfo.acno;
            state.infoDetail.accountNm = state.brnInfo.accountNm;
            state.infoDetail.ntprUcd = state.brnInfo.ntprUcd;
            state.infoDetail.rcmNtprUcd = state.brnInfo.rcmNtprUcd;
            state.infoDetail.dlngPlcCd = state.brnInfo.dlngPlcCd;
        };

        /**
         * 이메일 중복체크
         */
        const duplicateEmailCheck = async () => {
            try {
                const params = formData.admnEmad;
                const response = await _duplicateEmailCheck(params);
                if (response.data.code === 'OK') {
                    console.log(response.data.data);
                    state.emadCheck = response.data.data.dplYn;
                } else {
                    console.log(response.data.message);
                }
            } catch (error) {
                console.log(error);
            }
        };

        /**
         * @validate
         */
        const validFormData = () => {
            const target = ['rprsvNm', 'bzmTyCd', 'bcoNm', 'indtpNm', 'rprsTlnoMno', 'adr', 'bkcd', 'acno', 'accountNm', 'mgnRt', 'mdAdmnSn', 'dlngPlcCd', 'admnDepNm', 'admnNm', 'admnHhpnoFno', 'admnHhpnoMno', 'admnHhpnoBno', 'admnEmad', 'bzlcCpAtflSn', 'ntprAcnCpAtflSn'];

            // bzlcCpAtflSn: computed(() => state.bzlcCpAtflSn), //사업자등록증 사본
            // ntprAcnCpAtflSn: computed(() => state.ntprAcnCpAtflSn), //법인계좌  첨부파일순번

            for (const item of target) {
                console.log('check check >>', _.isEmpty(state.bizfilelist), formData['bzlcCpAtflSn']);
                state.validState.target = item;

                let msg = '';
                // if (item === 'brn') msg = '사업자등록번호를 입력해주세요.';
                if (item === 'rprsvNm') msg = '대표자명을 입력해주세요.';
                if (item === 'bzmTyCd') msg = '사업자유형을 선택해주세요.';
                if (item === 'bcoNm') msg = '업태를 입력해주세요.';
                if (item === 'indtpNm') msg = '종목을 입력해주세요.';
                if (item === 'rprsTlnoMno') msg = '대표 전화번호를 입력해주세요.';
                if (item === 'adr') msg = '주소를 입력해주세요.';
                if (item === 'bkcd') msg = '법인계좌은행을 선택해주세요.';
                if (item === 'acno') msg = '법인계좌번호를 입력해주세요.';
                if (item === 'accountNm') msg = '예금주명을 입력해주세요.';
                // if (item === 'ntprUcd') msg = '기업코드를 입력해주세요.';
                if (item === 'mgnRt') msg = '마진율을 입력해주세요.';
                if (item === 'mdAdmnSn') msg = '담당MD를 입력해주세요.';
                if (item === 'dlngPlcCd') msg = '거래처코드(더존ERP)를 입력해주세요.';

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
                // 예외 케이스 (담당자 이메일)
                if (item === 'admnEmad' && _.isEmpty(state.mailType1)) {
                    state.validState.message = '담당자 이메일 주소를 입력해주세요.';
                    state.validState.errState = true;
                    break;
                }
                // 예외 케이스 (담당자 이메일 중복체크)
                if (item === 'admnEmad' && (state.mailType1 !== state.infoDetailOrigin.admnEmad && (state.emadCheck === 'Y' || state.emadCheck === ''))) {
                    state.validState.message = '담당자 이메일 주소 중복체크를 해주세요.';
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
                    !(item === 'bzlcCpAtflSn' || item === 'ntprAcnCpAtflSn') // 예외 ( formData 없는 아이들 )
                ) {
                    if (typeof formData[item] === 'number') {
                        if (!formData[item]) {
                            state.validState.errState = true;
                            break;
                        }
                    } else {
                        state.validState.errState = true;
                        break;
                    }
                }
            }

            return !state.validState.errState;
        };
        const validInfoChange = () => {
            const target = ['rqstpNm', 'rqstRsn', 'recFnm'];

            for (const item of target) {
                state.validState.target = item;

                let msg = '';
                if (item === 'rqstpNm') msg = '요청자를 입력해주세요.';
                if (item === 'rqstRsn') msg = '요청 사유를 입력해주세요.';
                if (item === 'recFnm') msg = '녹취 파일명을 입력해주세요.';

                state.validState.message = msg;

                if (_.isEmpty(state.pinfChgRsn[item])) {
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
            
            isMdShow,
            infoChangeShow,
            isHistoryShow,
            // ref()
            fileUploadBankBiz,
            fileUploadBiz,
            bzmTyCd,
            bzmTyDtlCd,
            rprsTlnoFno,
            faxFno,
            bkcd,
            mailType,
            // data()
            state,
            formData,
            
            fileListDel,
            openModal,
            modalControl,
            openMdModal,
            selectedOptions,
            onChangemdSearch,
            actionBtns,
            fileListUp,
            modalOpen,

            changeMskgnRlsYn,
            checkEdit,
            checkValidState,
            setInputNumber,
            getChangehistory

        };
    }
};
</script>