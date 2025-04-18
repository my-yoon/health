<template>
    <section>
        <!-- 기업정보 -->
        <div class="ui-section">
            <subTitleBar :subTitle="'기업 정보'" :ess="'표시는 필수항목입니다.'" />
            <div class="ui-content">
                <div class="tbl-wrap">
                    <!-- {{ formData }} -->
                    <table class="table reg">
                        <colgroup>
                            <col style="width: 160px;">
                            <col style="width: auto;">
                            <col style="width: 160px;">
                            <col style="width: auto;">
                        </colgroup>
                        <tbody>
                            <tr>
                                <th scope="row">아이디<span class="ess"><span class="offscreen">필수입력</span></span></th>
                                <td colspan="3">
                                    <div class="reg-group">
                                        <div class="reg-item">
                                            <input type="text"
                                                :class="['form-control', { error: checkValidState('admnId') }]"
                                                v-model="formData.admnId" maxlength="16">
                                        </div>
                                        <div class="reg-item">
                                            <button type="button" class="btn btn-slm"
                                                :disabled="formData.admnId.length === 0"
                                                @click=" modalOpen('isShowID', formData.admnId)">중복체크</button>
                                        </div>
                                    </div>
                                    <span v-if="checkValidState('admnId')" class="input-guide"
                                        :class="{ 'error': checkValidState('admnId') }">
                                        {{ state.validState.message }}
                                    </span>
                                </td>

                            </tr>
                            <tr>
                                <th scope="row">비밀번호<span class="ess"><span class="offscreen">필수입력</span></span></th>
                                <td>
                                    <div class="reg-group">
                                        <div class="reg-item">
                                            <input type="password"
                                                :class="['form-control', { error: checkValidState('admnPwd') }]"
                                                v-model="formData.admnPwd">
                                        </div>
                                    </div>
                                    <span class="input-guide" v-if="!checkValidState('admnPwd')">영문, 숫자, 특수기호의 조합으로 8~16자리를
                                        입력해 주세요.</span>
                                    <span v-if="checkValidState('admnPwd')" class="input-guide"
                                        :class="{ 'error': checkValidState('admnPwd') }">
                                        {{ state.validState.message }}
                                    </span>
                                </td>
                                <th scope="row">비밀번호확인<span class="ess"><span class="offscreen">필수입력</span></span></th>
                                <td>
                                    <div class="reg-group">
                                        <div class="reg-item">
                                            <input type="password"
                                                :class="['form-control', { error: state.checkAdmnPwd.length > 0 && !(formData.admnPwd === state.checkAdmnPwd) }]"
                                                v-model="state.checkAdmnPwd">
                                        </div>
                                    </div>
                                    <span
                                        v-if="!checkValidState('checkAdmnPwd') && (state.checkAdmnPwd.length > 0) && !(formData.admnPwd === state.checkAdmnPwd)"
                                        class="input-guide error">
                                        비밀번호를 확인해주세요
                                    </span>
                                    <span v-if="checkValidState('checkAdmnPwd')" class="input-guide"
                                        :class="{ 'error': checkValidState('checkAdmnPwd') }">
                                        {{ state.validState.message }}
                                    </span>

                                </td>
                            </tr>
                            <tr>
                                <th scope="row">기업명<span class="ess"><span class="offscreen">필수입력</span></span></th>
                                <td colspan="3">
                                    <div class="reg-group">
                                        <div class="reg-item">
                                            <input type="text"
                                                :class="['form-control', { error: checkValidState('ntprNm') }]"
                                                v-model="formData.ntprNm" :disabled="state.brnCheck === 'Y'">
                                        </div>
                                        <div class="reg-item">
                                            <span class="checkbox">
                                                <input id="columChk1" name="columChkGroup" type="checkbox"
                                                    v-model="state.kbAffiYn" :disabled="state.brnCheck === 'Y'">
                                                <label for="columChk1">KB계열사 여부</label>
                                            </span>
                                        </div>
                                    </div>
                                    <span class="input-guide">사업자등록증 법인명과 동일한 기업명을 입력해 주세요.</span>

                                    <span v-if="checkValidState('ntprNm')" class="input-guide"
                                        :class="{ 'error': checkValidState('ntprNm') }">
                                        {{ state.validState.message }}
                                    </span>
                                </td>
                            </tr>
                            <tr>
                                <th scope="row">사업자등록번호<span class="ess"><span class="offscreen">필수입력</span></span></th>
                                <td>
                                    <div class="reg-group">
                                        <div class="reg-item">
                                            <input type="text" :class="['form-control', { error: checkValidState('brn') }]"
                                                maxlength="3" :value="state.brnType1" data-target="brnType1"
                                                :disabled="state.brnCheck === 'Y'" @input="setInputNumber">
                                        </div>
                                        <span class="ui-coupler">-</span>
                                        <div class="reg-item">
                                            <input type="text" :class="['form-control', { error: checkValidState('brn') }]"
                                                maxlength="2" :value="state.brnType2" data-target="brnType2"
                                                :disabled="state.brnCheck === 'Y'" @input="setInputNumber">
                                        </div>
                                        <span class="ui-coupler">-</span>
                                        <div class="reg-item">
                                            <input type="text" :class="['form-control', { error: checkValidState('brn') }]"
                                                maxlength="5" :value="state.brnType3" data-target="brnType3"
                                                :disabled="state.brnCheck === 'Y'" @input="setInputNumber">
                                        </div>
                                        <div class="reg-item">
                                            <button type="button" class="btn btn-slm"
                                                :disabled="formData.brn.length < 10 || state.brnCheck === 'Y'"
                                                @click="modalOpen('isShowBrn', formData.brn)">
                                                중복체크
                                            </button>
                                        </div>
                                    </div>
                                    <span class="input-guide" v-if="!checkValidState('brn')">사업자등록번호 중복체크를 해주세요.</span>
                                    <span v-if="checkValidState('brn')" class="input-guide"
                                        :class="{ 'error': checkValidState('brn') }">
                                        {{ state.validState.message }}
                                    </span>
                                </td>
                                <th scope="row">대표자<span class="ess"><span class="offscreen">필수입력</span></span></th>
                                <td>
                                    <input type="text" :class="['form-control', { error: checkValidState('rprsvNm') }]"
                                        v-model="formData.rprsvNm" :disable="state.brnCheck === 'Y'">
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
                                                :initData="formData.bzmTyCd" />
                                        </div>
                                        <div class="reg-item" v-if="formData.bzmTyCd === '221001'">
                                            <!-- 법인 -->
                                            <commselect :selectType="'searchCode.bzmTyCdtype1'"
                                                @changedValue="selectedOptions" :initData="state.bzmTyCd1" />
                                        </div>
                                        <div class="reg-item" v-if="formData.bzmTyCd === '221002'">
                                            <!-- 개인 -->
                                            <commselect :selectType="'searchCode.bzmTyCdtype2'"
                                                @changedValue="selectedOptions" :initData="state.bzmTyCd2" />
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
                                                v-model="formData.bcoNm" :disabled="state.brnCheck === 'Y'">
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
                                                v-model="formData.indtpNm" :disabled="state.brnCheck === 'Y'">
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
                                                @changedValue="selectedOptions" :initData="state.rprsTlnoFno"
                                                :disabled="state.brnCheck === 'Y'" />
                                        </div>
                                        <span class="ui-coupler">-</span>
                                        <div class="reg-item">
                                            <input type="text" maxlength="4"
                                                :class="['form-control', { error: checkValidState('rprsTlnoMno') }]"
                                                :value="state.rprsTlnoMno" data-target="rprsTlnoMno"
                                                :disabled="state.brnCheck === 'Y'" @input="setInputNumber">
                                        </div>
                                        <span class="ui-coupler">-</span>
                                        <div class="reg-item">
                                            <input type="text" maxlength="4"
                                                :class="['form-control', { error: checkValidState('rprsTlnoMno') }]"
                                                :value="state.rprsTlnoBno" data-target="rprsTlnoBno"
                                                :disabled="state.brnCheck === 'Y'" @input="setInputNumber">
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
                                                :disabled="state.brnCheck === 'Y'" @changedValue="selectedOptions"
                                                :initData="state.faxFno" />
                                        </div>
                                        <span class="ui-coupler">-</span>
                                        <div class="reg-item">
                                            <input type="text" class="form-control" maxlength="4" :value="state.faxMno"
                                                data-target="faxMno" @input="setInputNumber"
                                                :disabled="state.brnCheck === 'Y'">
                                        </div>
                                        <span class="ui-coupler">-</span>
                                        <div class="reg-item">
                                            <input type="text" class="form-control" maxlength="4" :value="state.faxBno"
                                                data-target="faxBno" @input="setInputNumber"
                                                :disabled="state.brnCheck === 'Y'">
                                        </div>
                                    </div>
                                </td>
                            </tr>
                            <tr>
                                <th scope="row">주소<span class="ess"><span class="offscreen">필수입력</span></span></th>
                                <td colspan="3">
                                    <div class="reg-group">
                                        <div class="reg-item">
                                            <input type="text" class="form-control" readonly v-model="formData.zc">
                                        </div>
                                        <div class="reg-item">
                                            <button type="button" class="btn btn-slm"
                                                :disabled="state.brnCheck === 'Y'">우편번호 검색</button>
                                        </div>
                                    </div>
                                    <div class="reg-group">
                                        <div class="reg-item">
                                            <input type="text" :class="['form-control', { error: checkValidState('adr') }]"
                                                placeholder="주소" v-model="formData.adr" :disabled="state.brnCheck === 'Y'">
                                        </div>
                                        <div class="reg-item">
                                            <input type="text" :class="['form-control', { error: checkValidState('adr') }]"
                                                placeholder="상세주소" v-model="formData.adrCts"
                                                :disabled="state.brnCheck === 'Y'">
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
                                                :initData="formData.bkcd" ref="bankName"
                                                :disabled="state.brnCheck === 'Y'" />
                                        </div>
                                        <div class="reg-item">
                                            <input type="text" :class="['form-control', { error: checkValidState('acno') }]"
                                                placeholder="'-'없이 계좌번호 입력" :value="state.acno" data-target="acno"
                                                :disabled="state.brnCheck === 'Y'" @input="setInputNumber">
                                        </div>
                                        <div class="reg-item">
                                            <input type="text"
                                                :class="['form-control', { error: checkValidState('accountNm') }]"
                                                placeholder="예금주명" v-model="formData.accountNm"
                                                :disabled="state.brnCheck === 'Y'">
                                        </div>
                                    </div>
                                    <span class="input-guide"
                                        v-if="checkValidState('bkcd') || checkValidState('acno') || checkValidState('accountNm')"
                                        :class="{ 'error': checkValidState('bkcd') || checkValidState('acno') || checkValidState('accountNm') }">
                                        {{ state.validState.message }}
                                    </span>
                                </td>
                                <th scope="row">기업코드<span class="ess"><span class="offscreen">필수입력</span></span></th>
                                <td>
                                    <div class="reg-group">
                                        <div class="reg-item">
                                            <input type="text"
                                                :class="['form-control', { error: checkValidState('ntprUcd') }]"
                                                :disabled="state.brnCheck === 'Y'" placeholder="영문4자리의 기업코드를 입력하여 주세요"
                                                v-model="formData.ntprUcd">


                                        </div>
                                        <div class="reg-item">
                                            <button type="button" class="btn btn-slm"
                                                :disabled="formData.ntprUcd.length < 4 || state.brnCheck === 'Y'"
                                                @click="modalOpen('isShowCcd', formData.ntprUcd)">
                                                중복체크
                                            </button>
                                        </div>
                                    </div>
                                    <span v-if="checkValidState('ntprUcd')" class="input-guide"
                                        :class="{ 'error': checkValidState('ntprUcd') }">
                                        {{ state.validState.message }}
                                    </span>
                                </td>
                            </tr>
                            <tr>
                                <th scope="row">서비스타입<span class="ess"><span class="offscreen">필수입력</span></span></th>
                                <td>
                                    <div class="reg-group">
                                        <div class="reg-item">
                                            <!-- {{ formData.ptnrSelrSvcTyCd }} -->
                                            <commradio :selectType="'searchCode.ptnrSelrSvcTyCd'"
                                                :initData="formData.ptnrSelrSvcTyCd" @changedValue="selectedOptions" />
                                        </div>
                                    </div>
                                </td>
                                <th scope="row">추천기업</th>
                                <td>
                                    <div class="reg-group">
                                        <div class="reg-item">
                                            <input type="text" class="form-control" @input="setInputEng"
                                                :value="state.rcmNtprUcd" data-target="rcmNtprUcd" maxlength="4"
                                                :disabled="state.brnCheck === 'Y'" placeholder="영문4자리의 기업코드를 입력하여 주세요">

                                            <!-- <input type="text" :class="['form-control', { error: checkValidState('acno') }]"
                                                placeholder="'-'없이 계좌번호 입력" :value="state.acno" data-target="acno"
                                                :disabled="state.brnCheck === 'Y'"> -->
                                        </div>
                                    </div>
                                </td>
                            </tr>
                            <tr>
                                <th scope="row">패널티 적용 여부<span class="ess"><span class="offscreen">필수입력</span></span></th>
                                <td>
                                    <div class="reg-group">
                                        <div class="reg-item">
                                            <span class="checkbox">
                                                <input id="columChk2" name="columChkGroup" type="checkbox"
                                                    v-model="state.pnltAplYn">
                                                <label for="columChk2">적용</label>
                                            </span>
                                        </div>
                                    </div>
                                </td>
                                <th scope="row">거래처코드(더존ERP)<span class="ess"><span class="offscreen">필수입력</span></span>
                                </th>
                                <td>
                                    <div class="reg-group inline">
                                        <div class="reg-item">
                                            <input type="text"
                                                :class="['form-control', { error: checkValidState('dlngPlcCd') }]"
                                                v-model="formData.dlngPlcCd" :disabled="state.brnCheck === 'Y'">
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
        <!-- 담당자정보 -->
        <div class="ui-section">
            <subTitleBar :subTitle="'담당자 정보'" :ess="'표시는 필수항목입니다.'" />
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
                                            <input type="text"
                                                :class="['form-control', { error: checkValidState('admnDepNm') }]"
                                                v-model="formData.admnDepNm">
                                        </div>
                                    </div>
                                    <span v-if="checkValidState('admnDepNm')" class="input-guide"
                                        :class="{ 'error': checkValidState('admnDepNm') }">
                                        {{ state.validState.message }}
                                    </span>
                                </td>
                                <th scope="row">담당자명<span class="ess"><span class="offscreen">필수입력</span></span></th>
                                <td>
                                    <div class="reg-group">
                                        <div class="reg-item">
                                            <input type="text"
                                                :class="['form-control', { error: checkValidState('admnNm') }]"
                                                v-model="formData.admnNm">
                                        </div>
                                    </div>
                                    <span v-if="checkValidState('admnNm')" class="input-guide"
                                        :class="{ 'error': checkValidState('admnNm') }">
                                        {{ state.validState.message }}
                                    </span>
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
                                            <commselect :selectType="'searchCode.mailType2'" @changedValue="selectedOptions"
                                                :initData="state.mailType2" />
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
        <!-- 첨부 서류-->
        <div class="ui-section">
            <subTitleBar :subTitle="'첨부 서류'" :ess="'표시는 필수항목입니다.'" />
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
                                        </div>
                                    </div>
                                    <div class="upload-file-box">
                                        <div class="upload-file-head flex space-between">
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
                                    <!-- 법인계좌 사본 첨부파일순번:
                                    {{ formData.ntprAcnCpAtflSn }} -->
                                    <div class="reg-group">
                                        <div class="reg-item">
                                            <div class="btn-file">
                                                <input type="file" id="upload-file1" hidden="" ref="fileUploadBankBiz"
                                                    @change="fileListUp('bizBanklist')">
                                                <label class="btn-up" for="upload-file1">파일첨부</label>
                                            </div>
                                            <span class="input-guide inline">용량 : 2MB 이하 | 형식 : jpg, gif, pdf</span>
                                        </div>

                                    </div>
                                    <div class="upload-file-box">
                                        <div class="upload-file-head flex space-between">
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
        <div class="btn-bottom-set flex justify-center">
            <button type="button" class="btn btn-sl nega" @click="goToPage('/seller/regist/list')">취소</button>
            <button type="button" class="btn btn-sl nega" @click="resetFormData">초기화</button>
            <button type="button" class="btn btn-sl posi" @click="registSeller">저장</button>
        </div>

        <!-- <VueDaumPostcode /> -->

    </section>
</template>
<script>
import { onMounted, watch, computed, reactive, inject, ref, nextTick } from 'vue';
import DefaultModal from '@/plugins/modal/modal/DefaultModal.vue';
import { useCommFunc } from '@/core/helper/common.js';
import { commoCode } from '@/data/commcode';
import { useStore } from 'vuex';
import { _duplicateCheck, _registJoinReqeust, _duplicateEidCheck, _duplicateCcdCheck, _duplicateEmailCheck } from '@/api/seller.js';
import { _uploadFile, _fileDownload } from '@/api/common.js';
// import { VueDaumPostcode } from 'vue-daum-postcode';
export default {
    components: { DefaultModal },
    setup() {
        const $Modal = inject('$Modal');
        const dayJS = inject('dayJS');
        const fileUploadBiz = ref(null);
        const fileUploadBankBiz = ref(null);
        const bankName = ref(null);
        const { goToPage, validEmail, getImageInfo } = useCommFunc();

        const rprsTlnoFno = ref();
        const faxFno = ref();

        const state = reactive({
            idCheck: '',
            membertype: '',
            companyInfo: {},
            checkAdmnPwd: '',
            kbAffiYn: false,
            pnltAplYn: false,
            emadCheck: '', // 이메일 중복체크
            fileNum: '',
            fileInfo: [],
            brnType1: '',
            brnType2: '',
            brnType3: '',
            rprsTlnoFno: '102001', //대표전화번호(앞번호)
            rprsTlnoMno: '', //대표전화번호(중간번호)
            rprsTlnoBno: '', //대표전화번호(뒷번호)
            faxFno: '102001', //팩스번호(앞번호)
            faxMno: '', //팩스번호(중간번호)
            faxBno: '', //팩스번호(뒷번호)
            acno: '', //법인계좌번호
            brnCheck: '',
            ntprSn: '',
            ccdCheck: '', // 기업코드 중복체크
            admnHhpnoFno: '010', //담당자휴대폰번호(앞번호
            admnHhpnoMno: '', //담당자휴대폰번호(중간번호)
            admnHhpnoBno: '', //담당자휴대폰번호(뒷번호)
            brnInfo: {},
            mailType1: '',
            mailType2: '103014',
            mailType2Name: '',
            bzmTyCd1: '',
            bzmTyCd2: '',
            bzlcCpAtflSn: '',
            ntprAcnCpAtflSn: '',
            bizfilelist: [],
            bizBanklist: [],

            validState: {
                type: '', // validation check ( formData )
                errState: false, // error state
                message: '' // input message
            },
            rcmNtprUcd: ''
        });

        const formData = reactive({
            admnId: '', //아이디
            admnPwd: '', //비밀번호
            ntprNm: '', //기업명,
            kbAffiYn: computed(() => state.kbAffiYn ? 'Y' : 'N'),
            brn: computed(() => `${state.brnType1}${state.brnType2}${state.brnType3}`), //사업자등록번호
            rprsvNm: '',
            bzmTyCd: '', //사업자유형
            bzmTyDtlCd: '', //사업자유형 상세
            bcoNm: '', //업태 
            indtpNm: '', //종목
            rprsTlnoFno: computed(() => commoCode.searchCode.rprsTlnoFno.filter(d => d.cmnCd === state.rprsTlnoFno)[0].cmnCdNm), //대표전화번호(앞번호)
            rprsTlnoMno: computed(() => state.rprsTlnoMno), //대표전화번호(중간번호)
            rprsTlnoBno: computed(() => state.rprsTlnoBno), //대표전화번호(뒷번호)
            faxFno: computed(() => commoCode.searchCode.rprsTlnoFno.filter(d => d.cmnCd === state.faxFno)[0].cmnCdNm), //대표전화번호(앞번호)
            faxMno: computed(() => state.faxMno), //팩스번호(중간번호)
            faxBno: computed(() => state.faxBno), //팩스번호(뒷번호)
            zc: '12345', //우편번호
            adr: '', //주소
            adrCts: '', //상세주소
            bkcd: '', //은행
            acno: computed(() => state.acno), //법인계좌번호
            accountNm: '', //예금주명
            ntprUcd: '', //기업코드
            rcmNtprUcd: computed(() => state.rcmNtprUcd), //추천기업
            pnltAplYn: computed(() => state.pnltAplYn ? 'Y' : 'N'), //패널티적용(Y/N)
            admnDepNm: '', //담당부서
            admnNm: '', //담당자명
            admnHhpnoFno: computed(() => state.admnHhpnoFno), //담당자휴대폰번호(앞번호
            admnHhpnoMno: computed(() => state.admnHhpnoMno), //담당자휴대폰번호(중간번호)
            admnHhpnoBno: computed(() => state.admnHhpnoBno), //담당자휴대폰번호(뒷번호)
            // admnEmad: computed(() => state.mailType2 === '' ? `${state.mailType1}` : `${state.mailType1}@${state.mailType2}`), //담당자이메일주소
            admnEmad: computed(() => state.mailType2 === '103014' ? `${state.mailType1}` : `${state.mailType1}@${state.mailType2Name}`), //담당자이메일주소 (103014: 직접입력)
            bzlcCpAtflSn: computed(() => state.bzlcCpAtflSn), //사업자등록증 사본
            ntprAcnCpAtflSn: computed(() => state.ntprAcnCpAtflSn), //법인계좌  첨부파일순번
            ptnrSelrSvcTyCd: '1120001',  //상품타입,
            admnLvlId: 'C00', // 관리자레벨 Manager:C00,Associate:C01
            dlngPlcCd: '' // 거래처코드(더존ERP),

        });

        watch(formData, () => {
            resetState();
        });
        watch(() => state.checkAdmnPwd, () => {
            resetState();
        });
        watch(() => [state.brnType1, state.brnType2, state.brnType3], () => {
            state.brnCheck = '';
        });
        watch(() => [formData.ntprUcd], () => { // 기업코드
            if (formData.ntprUcd.length < 4) state.ccdCheck = '';
        });

        onMounted(() => {
            // console.log('mounted', userInfo.value.userInfomation.admnSn);
        });

        const resetFormData = () => {
            formData.admnId = ''; //아이디
            formData.admnPwd = ''; //비밀번호
            formData.ntprNm = ''; //기업명,
            formData.rprsvNm = '';
            state.kbAffiYn = false;
            state.brnType1 = '';
            state.brnType2 = '';
            state.brnType3 = '';
            formData.bzmTyCd = ''; //사업자유형
            formData.bzmTyDtlCd = ''; //사업자유형 상세
            formData.bcoNm = ''; //업태 
            formData.indtpNm = ''; //종목
            state.rprsTlnoFno = '102001';
            state.rprsTlnoMno = '';
            state.rprsTlnoBno = '';
            state.faxFno = '102001';
            state.faxMno = '';
            state.faxBno = '';
            formData.zc = '12345'; //우편번호
            formData.adr = ''; //주소
            formData.adrCts = ''; //상세주소
            formData.bkcd = ''; //은행
            state.acno = '';
            formData.accountNm = ''; //예금주명
            formData.ntprUcd = ''; //기업코드
            state.rcmNtprUcd = ''; //추천기업
            state.pnltAplYn = false;
            formData.admnDepNm = ''; //담당부서
            formData.admnNm = ''; //담당자명
            state.admnHhpnoFno = '010';
            state.admnHhpnoMno = '';
            state.admnHhpnoBno = '';
            state.mailType1 = '';
            state.mailType2 = '103014';
            state.bzlcCpAtflSn = '';
            state.ntprAcnCpAtflSn = '';
            formData.ptnrSelrSvcTyCd = '1120001';  //상품타입,
            formData.admnLvlId = 'C00'; // 관리자레벨 Manager:C00,Associate:C01
            formData.dlngPlcCd = ''; // 거래처코드(더존ERP)
        };

        const selectedOptions = (valueCode, valueName, type) => {
            console.log('selectedOptions', valueCode, valueName, type);
            if (type === 'rprsTlnoFno') {
                // formData[type] = valueName;
                state[type] = valueCode;
            } else if (type === 'mailType1') {
                //
            } else if (type === 'mailType2') {
                state.mailType2 = valueCode;
                state.mailType2Name = valueName;
            } else if (type === 'bzmTyCdtype1' || type === 'bzmTyCdtype2') { // 사업자유형 상세
                formData.bzmTyDtlCd = valueCode;
            } else {
                formData[type] = valueCode;
            }
        };

        const modalOpen = async (modalName, params) => {
            resetState(); // validation reset
            if (modalName === 'isShowID') {

                await duplicateCheck();
                $Modal.simple({
                    message: state.idCheck === 'Y' ? '중복된 아이디가 있습니다. 다시 입력해 주세요' : '사용 가능한 아이디 입니다.',
                    buttonText: {
                        ok: '확인'
                    }
                })
                    .then(success => {
                        state.idCheck === 'Y' ? formData.admnId = '' : formData.admnId;
                    })
                    .catch(error => {
                        console.log(error);
                    });
            } else if (modalName === 'isShowCcd') {
                //
                await duplicateCcdCheck();
                let msg = '';
                if (state.ccdCheck === 'N') {
                    // ok
                    msg = '등록 가능한 기업코드 입니다.';
                } else {
                    // 중복 state.ccdCheck === 'Y'
                    msg = '중복된 기업코드가 있습니다.';
                }
                $Modal.simple({
                    message: msg,
                    buttonText: {
                        ok: '확인'
                    }
                }).then(success => {
                    if (state.ccdCheck === 'Y') {
                        // 중복
                        formData.ntprUcd = '';
                    }
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
            } else if (modalName === 'isShowBrn') {
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
            }
        };

        const modalclose = (type, modalName) => {
            console.log(modalName);
        };

        //아이디 중복체크 
        const duplicateCheck = async () => {
            try {
                let params = formData.admnId;
                const response = await _duplicateCheck(params);
                state.idCheck = response.data.data.dplYn;
                console.log(response);
            } catch (error) {
                console.log(error);
            }
        };
        //사업자 중복체크 
        const duplicateEidCheck = async () => {
            try {
                let params = formData.brn;
                const response = await _duplicateEidCheck(params);
                console.log('ckeck duplicateEidCheck', response);
                if (response.data.code === 'OK') {
                    console.log(state.brnInfo, state.membertype);

                    state.brnCheck = response.data.data.dplYn;
                    state.brnInfo = response.data.data;
                    state.membertype = response.data.data.admnPtnrTyCd;
                    state.ntprSn = response.data.data.ntprSn;
                } else {
                    console.log(response.data.message);
                }
            } catch (error) {
                console.log(error);
            }
        };

        /**
         * @setting 사업자등록번호 조회 등록 정보
         */
        const setBrnSetting = () => {
            formData.ntprNm = state.brnInfo.ntprNm;
            formData.bzmTyCd = state.brnInfo.bzmTyCd || '';
            formData.bzmTyDtlCd = state.brnInfo.bzmTyDtlCd || '';
            formData.bcoNm = state.brnInfo.bcoNm;
            formData.indtpNm = state.brnInfo.indtpNm;
            formData.rprsvNm = state.brnInfo.rprsvNm;

            state.rprsTlnoFno = commoCode.searchCode.rprsTlnoFno.filter(d => d.cmnCdNm === state.brnInfo.rprsTlnoFno)[0]?.cmnCd || '102001';
            state.rprsTlnoMno = state.brnInfo.rprsTlnoMno;
            state.rprsTlnoBno = state.brnInfo.rprsTlnoBno;
            state.faxFno = commoCode.searchCode.rprsTlnoFno.filter(d => d.cmnCdNm === state.brnInfo.faxFno)[0]?.cmnCd || '102001';
            state.faxMno = state.brnInfo.faxMno;
            state.faxBno = state.brnInfo.faxBno;

            formData.zc = state.brnInfo.zc;
            formData.adr = state.brnInfo.adr;
            formData.adrCts = state.brnInfo.adrCts;
            formData.bkcd = state.brnInfo.bkcd;
            state.acno = state.brnInfo.acno;
            formData.accountNm = state.brnInfo.accountNm;
            formData.ntprUcd = state.brnInfo.ntprUcd;
            state.rcmNtprUcd = state.brnInfo.rcmNtprUcd;
            formData.dlngPlcCd = state.brnInfo.dlngPlcCd;
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

        //기업코드 중복체크 
        const duplicateCcdCheck = async () => {
            try {
                let params = formData.ntprUcd;
                const response = await _duplicateCcdCheck(params);
                console.log('ckeck response', response);
                if (response.data.code === 'OK') {
                    console.log(response.data.data);
                    state.ccdCheck = response.data.data.dplYn;
                    // state.brnInfo = response.data.data;
                    // state.membertype = response.data.data.admnPtnrTyCd;
                    // console.log(state.brnInfo, state.membertype);
                } else {
                    console.log(response.data.message);
                }
            } catch (error) {
                console.log(error);
            }
        };
        //가입신청 등록 모달
        const registSeller = () => {
            console.log('validFormData()', validFormData());
            if (validFormData()) {
                //
                $Modal.confirm({
                    className: 'ui-alert confirm',
                    title: '',
                    message: '가입신청을 저장하시겠습니까?',
                    buttonText: {
                        confirm: '확인',
                        cancel: '취소'
                    }
                })
                    .then(async (success) => {
                        console.log(success);
                        const filelist = ['bizBanklist', 'bizfilelist'];
                        for (const item of filelist) {
                            await uploadFile(item);
                        }
                        await registJoinReqeust();

                    })
                    .catch(error => {
                        console.log(error);
                    });
            }
        };
        //가입신청 등록
        const registJoinReqeust = async () => {
            try {
                let params = {
                    admnId: formData.admnId,
                    admnPwd: formData.admnPwd,
                    ntprNm: formData.ntprNm,
                    kbAffiYn: formData.kbAffiYn,
                    brn: formData.brn,
                    rprsvNm: formData.rprsvNm,
                    bzmTyCd: formData.bzmTyCd,
                    bzmTyDtlCd: formData.bzmTyDtlCd,
                    bcoNm: formData.bcoNm,
                    indtpNm: formData.indtpNm,
                    rprsTlnoFno: String(formData.rprsTlnoFno),
                    rprsTlnoMno: String(formData.rprsTlnoMno),
                    rprsTlnoBno: String(formData.rprsTlnoBno),
                    faxFno: String(formData.faxFno),
                    faxMno: String(formData.faxMno),
                    faxBno: String(formData.faxBno),
                    zc: formData.zc,
                    adr: formData.adr,
                    adrCts: formData.adrCts,
                    bkcd: formData.bkcd,
                    acno: formData.acno,
                    accountNm: formData.accountNm,
                    ntprUcd: formData.ntprUcd,
                    rcmNtprUcd: formData.rcmNtprUcd,
                    pnltAplYn: formData.pnltAplYn,
                    admnDepNm: formData.admnDepNm,
                    admnNm: formData.admnNm,
                    admnHhpnoFno: String(formData.admnHhpnoFno),
                    admnHhpnoMno: String(formData.admnHhpnoMno),
                    admnHhpnoBno: String(formData.admnHhpnoBno),
                    admnEmad: formData.admnEmad,
                    bzlcCpAtflSn: String(formData.bzlcCpAtflSn),
                    ntprAcnCpAtflSn: String(formData.ntprAcnCpAtflSn),
                    ptnrSelrSvcTyCd: formData.ptnrSelrSvcTyCd,
                    admnLvlId: formData.admnLvlId,
                    // adminLvlID:'c00,c01'
                    dlngPlcCd: formData.dlngPlcCd
                };
                if (state.ntprSn) params.ntprSn = state.ntprSn;
                const response = await _registJoinReqeust(params);
                if (response.data.code === 'OK') {
                    await goToPage('/seller/regist/list');
                }
                console.log(response);
            } catch (error) {
                console.log(error);
            }
        };
        //파일업로드
        const fileListUp = async (type) => {
            resetState();
            let inputName = null;
            type === 'bizfilelist' ? inputName = fileUploadBiz : inputName = fileUploadBankBiz;
            console.log(state[type]);
            state[type] = Array.from(inputName.value.files);
            await getImageInfo(state[type][0], imageSizeCallback);
            function imageSizeCallback(callback) {
                console.log('111', callback);
                if (!(callback.fileType.includes('jpeg') || callback.fileType.includes('jpg') || callback.fileType.includes('gif') || callback.fileType.includes('pdf'))) {
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
        // const imageSizeCallback = (callback) => {
        //     console.log(callback);
        //     if (callback) {
        //         //
        //     } else {
        //         console.log('이미지가 아닙니다.');
        //     }

        // };
        //파일업로드 API
        const uploadFile = async (type) => {
            const formData = new FormData();
            formData.append('file', state[type][0]);
            formData.append('privateYn', 'Y');
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

        //파일다운로드
        const fileDownload = async (params) => {
            console.log(params);
            try {
                const response = await _fileDownload(params);
                const blob = new Blob([response.data], { type: response.headers['content-type'] });
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                const match = /filename="(.+?)"/.exec([response.headers['content-disposition']]);
                a.href = url;
                a.download = match ? match[1] : null;
                a.click();
                a.remove();
                window.URL.revokeObjectURL(url);
            } catch (error) {
                console.log(error);
            }
        };

        /**
         * @validate
         */
        const validFormData = () => {
            const target = ['admnId', 'admnPwd', 'checkAdmnPwd', 'ntprNm', 'brn', 'rprsvNm', 'bzmTyCd', 'bcoNm', 'indtpNm', 'rprsTlnoMno', 'adr', 'bkcd', 'acno', 'accountNm', 'ntprUcd', 'dlngPlcCd', 'admnDepNm', 'admnNm', 'admnHhpnoFno', 'admnHhpnoMno', 'admnHhpnoBno', 'admnEmad', 'bzlcCpAtflSn', 'ntprAcnCpAtflSn'];
            // const target = ['admnEmad', 'bzlcCpAtflSn', 'ntprAcnCpAtflSn'];

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
                if (item === 'rprsvNm') msg = '대표자명을 입력해주세요.';
                if (item === 'bzmTyCd') msg = '사업자유형을 선택해주세요.';
                if (item === 'bcoNm') msg = '업태를 입력해주세요.';
                if (item === 'indtpNm') msg = '종목을 입력해주세요.';
                if (item === 'rprsTlnoMno') msg = '대표 전화번호를 입력해주세요.';
                if (item === 'adr') msg = '주소를 입력해주세요.';
                if (item === 'bkcd') msg = '법인계좌은행을 선택해주세요.';
                if (item === 'acno') msg = '법인계좌번호를 입력해주세요.';
                if (item === 'accountNm') msg = '예금주명을 입력해주세요.';
                if (item === 'ntprUcd') msg = '기업코드를 입력해주세요.';
                if (item === 'dlngPlcCd') msg = '거래처코드(더존ERP)를 입력해주세요.';
                if (item === 'admnDepNm') msg = '담당부서를 입력해주세요.';
                if (item === 'admnNm') msg = '담당자명을 입력해주세요.';
                if (item === 'admnHhpnoFno' || item === 'admnHhpnoMno' || item === 'admnHhpnoBno') msg = '휴대폰번호를 입력해주세요.';
                if (item === 'admnEmad') msg = '담당자 이메일 주소를 입력해주세요.';

                state.validState.message = msg;

                // 예외 케이스 (아이디 중복체크)
                if (item === 'admnId' && !_.isEmpty(formData[item]) && (state.idCheck === 'Y' || state.idCheck === '')) {
                    state.validState.message = '아이디 중복체크 해주세요.';
                    state.validState.errState = true;
                    break;
                }
                // 예외 케이스 (비밀번호 규칙 오류)
                if (item === 'admnPwd' && !checkPasswordReg(formData[item])) {
                    state.validState.message = '영문, 숫자, 특수기호가 포함된 8~16자리로 입력해주세요.';
                    state.validState.errState = true;
                    break;
                }
                // 예외 케이스 (비밀번호 확인 이랑 다를때)
                if (item === 'checkAdmnPwd' && (formData['admnPwd'] !== state['checkAdmnPwd'])) {
                    state.validState.message = '비밀번호를 확인해주세요';
                    state.validState.errState = true;
                    break;
                }
                // 예외 케이스 (비밀번호 확인 _.isEmpty)
                if (item === 'checkAdmnPwd' && _.isEmpty(state['checkAdmnPwd'])) {
                    state.validState.message = '비밀번호확인을 입력해주세요';
                    state.validState.errState = true;
                    break;
                }
                // 예외 케이스 (사업자등록번호 중복체크)
                if (item === 'brn' && !_.isEmpty(formData[item]) && state.brnCheck === '') {
                    state.validState.message = '사업자등록번호 중복체크를 해주세요.';
                    state.validState.errState = true;
                    break;
                }
                // 예외 케이스 (사업자유형상세 중복체크)
                if (item === 'bzmTyCd' && _.isEmpty(formData.bzmTyDtlCd)) {
                    state.validState.message = '사업자유형 상세 항목을 선택해주세요.';
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
         * 비밀번호 생성규칙
         * @reg 영문, 숫자, 특수기호가 포함된 8~16자리
         */
        const checkPasswordReg = (password) => {
            const reg = /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[!@#$%^&*]).{8,16}$/;
            return reg.test(password);
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


        const setInputEng = (event) => {
            const target = event.target.getAttribute('data-target');
            state[target] = event.target.value;
            // console.log(event.target.getAttribute('data-target'), state[target]);
            checkEngReg(target, state[target]);
        };
        const checkEngReg = (type, value) => {
            const reg = /^[a-zA-Z]{0,4}$/;
            if (!reg.test(value)) state[type] = state[type].replace(/^[ㄱ-ㅎ |ㅏ-ㅣ|가-힣]/g, '');
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
            _,
            $Modal,
            dayJS,
            goToPage,
            fileUploadBiz,
            fileUploadBankBiz,
            formData,
            state,
            bankName,
            modalclose,
            selectedOptions,
            modalOpen,
            uploadFile,
            fileDownload,
            registSeller,
            resetFormData,
            setInputEng,

            rprsTlnoFno,
            faxFno,

            fileListUp,
            fileListDel,
            setInputNumber,
            checkValidState
        };
    }
};

</script>