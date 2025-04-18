<template>
    <section>
        <div class="ui-section">
            <subTitleBar :subTitle="'회원 정보'" />
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
                                <th scope="row">회원명</th>
                                <td> {{ state.memberInfoDetail.mbrNm }}</td>
                                <th scope="row">회원번호</th>
                                <td> {{ state.memberInfoDetail.mbrSn }}</td>
                            </tr>
                            <tr>


                                <th scope="row">회원상태</th>
                                <td> {{ state.memberInfoDetail.mbrSt }}</td>
                                <th scope="row">아이디</th>
                                <td>{{ state.memberInfoDetail.mbrJnMthTyp }} {{ state.memberInfoDetail.mbrJnMthAcsId }}
                                </td>
                            </tr>
                            <tr>
                                <th scope="row">닉네임</th>
                                <td> {{ state.memberInfoDetail.mbrNcknm }}</td>
                                <th scope="row">생년월일</th>
                                <td> {{ state.memberInfoDetail.mbrBrth }}</td>
                            </tr>
                            <tr>
                                <th scope="row">개인이메일</th>
                                <td>
                                    <div class="reg-group">
                                        <!-- {{ state.memberInfoDetail.mbrEmad }} -->
                                        <div class="reg-item">
                                            <input v-model="state.mailType1"
                                                :class="['form-control', { error: (state.mailType1 == '' && state.mskgnRlsYn == false) || (state.mailType1.includes('@') && state.mailType2 !== '103014') }]"
                                                type="text" :disabled="state.mskgnRlsYn == true">
                                        </div>
                                        <span class="ui-coupler">@</span>
                                        <div class="reg-item">
                                            <commselect ref="mailType" :initData="state.mailType2"
                                                :selectType="'searchCode.mailType2'" @changedValue="selectedOptions"
                                                :disabled="state.mskgnRlsYn == true" />
                                        </div>
                                        <span class="dv ml-10">
                                            <button class="btn btn-slm" type="button"
                                                @click="onChangeAuthEdit('edit', '이메일')"
                                                :disabled="state.mailType1 == ''">수정</button>
                                        </span>
                                        <!-- 한번이라도 수정된 이력이 있을때노출 -->
                                        <span v-if="state.memberInfoDetail.lastUpdrAdmnYn === 'Y'" class="dv ml-10">
                                            <button class="btn btn-slm" type="button"
                                                @click="onChangeAuthEdit('list', '이메일')">조회</button>
                                        </span>
                                    </div>
                                    <div v-if="state.mailType1 == '' && state.mskgnRlsYn == false">
                                        <p class="input-guide error">
                                            변경할 메일 주소를 입력해 주세요
                                        </p>
                                    </div>
                                    <div v-if="state.mailType1.includes('@') && state.mailType2 !== '103014'">
                                        <p class="input-guide error">
                                            메일 주소를 형식을 확인해 주세요
                                        </p>
                                    </div>

                                </td>
                                <th scope="row">휴대폰번호</th>
                                <td>
                                    <div class="reg-group">
                                        <div class="reg-item inline w-100">
                                            <!-- <input v-model="formData.mbrHhpnoFno" class="form-control" type="text"> -->
                                            <input :value="formData.mbrHhpnoFno" class="form-control"
                                                data-target="mbrHhpnoFno" maxlength="3" type="text" @input="setInputNumber">
                                        </div>
                                        <span class="ui-coupler">-</span>
                                        <div class="reg-item">
                                            <!-- <input v-model="formData.mbrHhpnoMno" class="form-control" type="text"> -->
                                            <input :value="formData.mbrHhpnoMno" class="form-control"
                                                data-target="mbrHhpnoMno" maxlength="4" type="text" @input="setInputNumber">
                                        </div>
                                        <span class="ui-coupler">-</span>
                                        <div class="reg-item">
                                            <!-- <input v-model="formData.mbrHhpnoBno" class="form-control" type="text"> -->
                                            <input :value="formData.mbrHhpnoBno" class="form-control"
                                                data-target="mbrHhpnoBno" maxlength="4" type="text" @input="setInputNumber">
                                        </div>
                                        <span class="dv ml-10">
                                            <button class="btn btn-slm" type="button"
                                                @click="onChangeAuthEdit('edit', '휴대폰번호')">수정</button>
                                        </span>
                                        <!-- 한번이라도 수정된 이력이 있을때노출  -->
                                        <span v-if="state.memberInfoDetail.lastUpdrAdmnYn === 'Y'" class="dv ml-10">
                                            <button class="btn btn-slm" type="button"
                                                @click="onChangeAuthEdit('list', '휴대폰번호')">조회</button>
                                        </span>
                                    </div>
                                </td>
                            </tr>
                            <tr>
                                <th scope="row">배송지 주소</th>
                                <td colspan="3">
                                    <!-- {{ state.memberInfoDetail.mbrDlvLcnm }} -->
                                    <div class="reg-group">
                                        <div class="reg-item">
                                            <input v-model="formData.mbrDlvLcnmZc" class="form-control" readonly
                                                type="text">
                                        </div>
                                        <div class="reg-item">
                                            <button class="btn btn-slm" type="button">우편번호 검색</button>
                                        </div>
                                    </div>
                                    <div class="reg-group">
                                        <div class="reg-item">
                                            <input v-model="formData.mbrDlvLcnmAdr" class="form-control" placeholder="주소"
                                                type="text">
                                        </div>
                                        <div class="reg-item">
                                            <input v-model="formData.mbrDlvLcnmAdrCts" class="form-control"
                                                placeholder="상세주소" type="text">
                                        </div>
                                        <span class="dv ml-10">
                                            <button class="btn btn-slm" type="button"
                                                @click="onChangeAuthEdit('edit', '주소')">수정</button>
                                        </span>
                                        <!-- 한번이라도 수정된 이력이 있을때노출 -->
                                        <span v-if="state.memberInfoDetail.lastUpdrAdmnYn === 'Y'" class="dv ml-10">
                                            <button class="btn btn-slm" type="button"
                                                @click="onChangeAuthEdit('list', '주소')">조회</button>
                                        </span>
                                    </div>

                                </td>
                            </tr>
                            <tr>
                                <th scope="row">성별</th>
                                <td>{{ state.memberInfoDetail.mbrSex }}</td>
                                <th scope="row">연령대</th>
                                <td>{{ state.memberInfoDetail.aggp }}</td>
                            </tr>
                            <tr>
                                <th scope="row">키</th>
                                <td>{{ state.memberInfoDetail.htVl }}{{ state.memberInfoDetail.htVl ? 'Cm' : '' }}</td>
                                <th scope="row">몸무게</th>
                                <td>{{ state.memberInfoDetail.mbrBdwtVl }}{{ state.memberInfoDetail.mbrBdwtVl ? 'Kg' : '' }}
                                </td>
                            </tr>
                            <tr>
                                <th scope="row">해외통관번호</th>
                                <td colspan="3">{{ state.memberInfoDetail.pcccNo }}</td>
                            </tr>
                            <tr>
                                <th scope="row">개인정보유효기간</th>
                                <td colspan="3">
                                    {{ state.memberInfoDetail.pinfClctUseAgrmTm }}/
                                    {{ state.memberInfoDetail.pinfClctUseAgrmXpDt }}
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
        <div class="ui-section">
            <subTitleBar :subTitle="'정보수신 동의 여부/일시'" />
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
                                <th scope="row">서비스 수신동의<br /> 여부 일자</th>
                                <td>
                                    {{ state.memberInfoDetail.infAgrmDtCpmYn }}
                                    <template v-if="state.memberInfoDetail.infAgrmDtCpm">
                                        /
                                        {{ dayJS(state.memberInfoDetail.infAgrmDtCpm).format('YYYY-MM-DD HH:mm') }}
                                    </template>
                                </td>
                                <th scope="row">마케팅 정보수신동의<br /> 여부 일자(PUSH)</th>
                                <td>
                                    {{ state.memberInfoDetail.infAgrmDtCpmYn }}
                                    <template v-if="state.memberInfoDetail.infAgrmDtCpm">
                                        /
                                        {{ dayJS(state.memberInfoDetail.infAgrmDtCpm).format('YYYY-MM-DD HH:mm') }}
                                    </template>
                                </td>
                            </tr>
                            <tr>
                                <th scope="row">마케팅 정보수신동의<br /> 여부 일자(SMS)</th>
                                <td>
                                    {{ state.memberInfoDetail.infAgrmDtSmsYn }}
                                    <template v-if="state.memberInfoDetail.infAgrmDtSms">
                                        /
                                        {{ dayJS(state.memberInfoDetail.infAgrmDtSms).format('YYYY-MM-DD HH:mm') }}
                                    </template>
                                </td>
                                <th scope="row">마케팅 정보수신동의<br /> 여부 일자(E-mail)</th>
                                <td>
                                    {{ state.memberInfoDetail.infAgrmDtEmailYn }}
                                    <template v-if="state.memberInfoDetail.infAgrmDtEmail">
                                        /
                                        {{ dayJS(state.memberInfoDetail.infAgrmDtEmail).format('YYYY-MM-DD HH:mm') }}
                                    </template>
                                </td>
                            </tr>

                        </tbody>
                    </table>
                </div>
            </div>
        </div>


        <div class="ui-section">
            <subTitleBar :subTitle="'가입 및 이력 정보'">
                <template #btn>
                    <button class="btn btn-sm" type="button" @click="actionModal('isHistoryShow')"><span class="txt">회원 이력
                            정보</span></button>
                </template>
            </subTitleBar>
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
                                <td> {{ dayJS(state.memberInfoDetail.mbrJnDt).format('YYYY-MM-DD HH:mm') }}</td>
                                <th scope="row">수정일자</th>
                                <td> {{ state.memberInfoDetail.updDt }}</td>
                            </tr>
                            <tr>
                                <th scope="row">자격상실 변경일자</th>
                                <td> {{ }}</td>
                                <th scope="row">자격상실 변경사유</th>
                                <td> {{ }}</td>
                            </tr>

                            <tr>
                                <th scope="row">자격상실 해제일자</th>
                                <td colspan="3"> <!--{{ dayJS().format('YYYY-MM-DD HH:mm') }}--></td>
                            </tr>
                            <tr v-if="state.memberInfoDetail.mbrStCd === '104005'">
                                <th scope="row">이용중지 전환일자</th>
                                <td> {{ dayJS(state.memberInfoDetail.fultApnmDt).format('YYYY-MM-DD HH:mm') }}</td>
                                <th scope="row">이용중지 사유</th>
                                <td> {{ state.memberInfoDetail.fultRsn }}</td>
                            </tr>
                            <tr v-if="!(state.memberInfoDetail.mbrStCd === '104005')">
                                <th scope="row">이용중지 해제일자</th>
                                <td colspan="3">
                                    <template v-if="state.memberInfoDetail.fultRlsDt === null">
                                        -
                                    </template>
                                    <template v-else>
                                        {{ dayJS(state.memberInfoDetail.fultRlsDt).format('YYYY-MM-DD HH:mm') }}
                                    </template>
                                </td>
                            </tr>
                            <tr v-if="state.memberInfoDetail.mbrStCd === '104006'">
                                <th scope="row">강제탈퇴 일자</th>
                                <td> {{ dayJS(state.memberInfoDetail.frcdScsnNoticeDt).format('YYYY-MM-DD HH:mm') }}</td>
                                <th scope="row">강제탈퇴 사유</th>
                                <td> {{ state.memberInfoDetail.frcdScsnRsn }}</td>
                            </tr>
                            <tr v-if="state.memberInfoDetail.mbrStCd === '104002'">
                                <th scope=" row">회원탈퇴 일자</th>
                                <td> {{ dayJS(state.memberInfoDetail.mscsnDt).format('YYYY-MM-DD HH:mm') }}</td>
                                <th scope="row">회원탈퇴 사유</th>
                                <td> {{ state.memberInfoDetail.scsnRsn }}</td>
                            </tr>
                            <tr>
                                <th scope="row">최종 로그인 일자</th>
                                <td colspan="3">
                                    {{ dayJS(state.memberInfoDetail.ltlyLgnDt).format('YYYY-MM-DD HH:mm') }}
                                </td>
                            </tr>

                        </tbody>
                    </table>
                </div>
            </div>
        </div>

        <!-- mbrStCd 104001 == 정상
        mbrStCd 104002 == 탈퇴
        mbrStCd 104004 == 유효기간 만료탈퇴
        mbrStCd 104005 == 불량
        mbrStCd 104006 == 불량확정 강제탈퇴 -->

        <div class="ui-tab-wrap mt-30">
            <div class="ui-tabs">
                <ul>
                    <li v-for="(tab, index) in state.tablist" :key="index"
                        :class="{ 'active': state.tabPannel === tab.value }">
                        <button class="ui-tab-item" type="button" @click="onChangeTab(tab.value)">
                            <span>
                                {{ tab.label }}
                            </span>
                        </button>
                    </li>
                </ul>
            </div>
            <div class="ui-panels">
                <div class="ui-panel-item">
                    <div v-if="state.tabPannel === 'healthInfo'" class="ui-section">
                        <MemberHealthInfo :memberNum="state.detailNum" :menuCode="menuInfo.menuCode" />
                    </div>

                    <div v-if="state.tabPannel === 'defaultInfo'" class="ui-section">
                        <DefaultHealth :memberNum="state.detailNum" :menuInfo="menuInfo" />
                    </div>
                    <div v-if="state.tabPannel === 'service'" class="ui-section">
                        <!-- 메디컬서비스이용 -->
                        <HealthService :memberNum="state.detailNum" :menuInfo="menuInfo" />
                    </div>
                    <div v-if="state.tabPannel === 'healthCheck'" class="ui-section">
                        KB건강체크
                    </div>
                </div>
            </div>
        </div>

        <div class=" btn-bottom-set flex justify-center">
            <button class="btn btn-sl nega" type="button" @click="goToPage('/member/health_info/list')">
                목록으로
            </button>

            <button :disabled="!state.mskgnRlsYn" class="btn btn-sl nega" type="button" @click="changeMskgnRlsYn()">
                마스킹해제
            </button>
            <button :disabled="state.memberInfoDetail.mbrStCd === '104005'" class="btn btn-sl posi" type="button"
                @click="onChangeAuthEdit('fault')">
                이용중지설정
            </button>

        </div>


        <!-- 이용중지 설정 -->
        <DefaultModal :buttonCancel="'닫기'" :buttonConfirm="'저장'" :className="'full'" :isShow="isUseStop"
            :modalName="'isUseStop'" modalTitle="이용중지 설정" @modalclose="modalControl">
            <template #modalcontent>
                <div>

                    <div class="ui-grid-top-guide mt-10 t-right">
                        <span class="ess"></span> 표시는 필수항목입니다.
                    </div>
                    <div class="tbl-wrap mt-10">
                        <table class="table reg">
                            <colgroup>
                                <col style="width: 150px;">
                                <col style="width: auto;">
                            </colgroup>
                            <tbody>
                                <tr>
                                    <th scope="row">사유선택<span class="ess"><span class="offscreen">필수입력</span></span></th>
                                    <td>
                                        <div class="reg-group">
                                            <div class="reg-item">
                                                <commselect :className="'sm'" :initData="formData.fultRsnCd"
                                                    :selectType="'searchCode.fultRsnCd'" @changedValue="selectedOptions" />
                                            </div>
                                        </div>
                                        <div v-if="checkValidState('fultRsnCd')">
                                            <p :class="{ 'error': checkValidState('fultRsnCd') }" class="input-guide">
                                                {{ state.validState.message }}
                                            </p>
                                        </div>
                                    </td>
                                </tr>
                                <tr>
                                    <th scope="row">이용중지 기간설정<span class="ess"><span class="offscreen">필수입력</span></span>
                                    </th>
                                    <td>
                                        <div class="form-item" style="margin-left:-20px">
                                            <dateSerch ref="dateSearch" :dateTitle="''" :pickerOnly="false"
                                                :setDay="state.setDay" @onSelectDate="onSelectPicker" />
                                        </div>

                                    </td>
                                </tr>
                                <tr>
                                    <th scope="row">사유 설명<span class="ess"><span class="offscreen">필수입력</span></span>
                                    </th>
                                    <td>
                                        <div class="reg-group">
                                            <div class="reg-item">
                                                <textarea id="textarea" v-model="formData.fultRsn" class="form-control"
                                                    placeholder="" style="height: 100px"></textarea>
                                            </div>
                                        </div>
                                        <div v-if="checkValidState('fultRsn')">
                                            <p :class="{ 'error': checkValidState('fultRsn') }" class="input-guide">
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

        <!-- 가입 및 이력 정보 -->
        <DefaultModal :buttonCancel="''" :buttonConfirm="'닫기'" :className="'full'" :isShow="isHistoryShow"
            :modalName="'isHistoryShow'" modalTitle="가입 및 이력 정보" @modalclose="modalControl">
            <template #modalcontent>
                <div>
                    <MemberHistory :mbrSn="state.detailNum" :mskgnRlsYn="state.mskgnRlsYn" />
                </div>
            </template>
        </DefaultModal>
        <!-- 개인정보 사유 -->
        <DefaultModal :buttonCancel="''" :buttonConfirm="state.modalMode === 'list' ? '닫기' : '저장'" :isShow="infoChangeShow"
            :modalName="'infoChangeShow'" modalTitle="개인정보 변경 사유" @modalclose="modalControl">
            <template #modalcontent>
                <div>

                    <NoData v-if="state.modalMode === 'list' && !(state.infoHistory)" :nodatatext="'조회된 데이터가 없습니다.'">
                    </NoData>
                    <div v-else>
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
                                <tbody v-if="state.modalMode === 'edit'">
                                    <tr>
                                        <th scope="row">요청자<span class="ess"><span class="offscreen">필수입력</span></span></th>
                                        <td>
                                            <div class="reg-group">
                                                <div class="reg-item">
                                                    <input v-model="formData.rqstpNm"
                                                        :class="checkValidState('rqstpNm') ? 'error' : ''"
                                                        class="form-control" type="text">
                                                </div>
                                            </div>
                                            <div v-if="checkValidState('rqstpNm')">
                                                <p :class="{ 'error': checkValidState('rqstpNm') }" class="input-guide">
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
                                                    <input v-model="formData.rqstpBln" class="form-control" type="text">
                                                </div>
                                            </div>
                                        </td>
                                    </tr>
                                    <tr>
                                        <th scope="row">요청 사유<span class="ess"><span class="offscreen">필수입력</span></span>
                                        </th>
                                        <td>
                                            <div class="reg-group">
                                                <div class="reg-item">
                                                    <textarea id="textarea" v-model="formData.rqstpRsn"
                                                        :class="checkValidState('rqstpRsn') ? 'error' : ''"
                                                        class="form-control" placeholder="개인정보 변경이 발생한 사유를 입력해주세요."
                                                        style="height: 100px"></textarea>
                                                </div>
                                            </div>
                                            <div v-if="checkValidState('rqstpRsn')">
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
                                                    <input v-model="formData.recFnm" class="form-control" type="text">
                                                </div>
                                            </div>
                                            <div v-if="checkValidState('recFnm')">
                                                <p :class="{ 'error': state.validState.errState }" class="input-guide">
                                                    {{ state.validState.message }}
                                                </p>
                                            </div>
                                            <!-- <div class="reg-item">
                                                <div class="btn-file">
                                                    <input id="upload-file" ref="fileUploadFile" hidden="" type="file"
                                                        @change="fileListUp('fileList', fileUploadFile)">
                                                    <label class="btn-up" for="upload-file">파일첨부</label>

                                                </div>
                                            </div>
                                            <div class="upload-file-box wp-100">
                                                <div class="upload-file-head flex space-between">
                                                    <button class="btn del-all btn-secondary" type="button">
                                                        <span class="offscreen">전체파일삭제</span>
                                                    </button>
                                                    <span class="name">파일명</span><span class="volume">용량</span>
                                                </div>
                                                <div v-if="state.fileList.length > 0" class="upload-file-list">
                                                    <div v-for="(item, index) in state.fileList" :key="index"
                                                        class="upload-file-list-item flex space-between">
                                                        <button class="btn del btn-secondary" type="button"
                                                            @click="fileListDel('bannerList')">
                                                            <span class="offscreen">파일삭제</span>
                                                        </button>
                                                        <span class="name">{{ item.name }}</span>
                                                        <span class="volume">{{
                                                            (item.size / (1024 *
                                                                1024)).toFixed(1)
                                                        }}
                                                            MB</span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div v-if="checkValidState('wtdAtflSn')">
                                                <p :class="{ 'error': state.validState.errState }" class="input-guide">
                                                    {{ state.validState.message }}
                                                </p>
                                            </div> -->
                                        </td>
                                    </tr>
                                </tbody>
                                <tbody v-if="state.modalMode === 'list' && (state.infoHistory)">
                                    <tr>
                                        <th scope="row">대상 항목</th>
                                        <td>
                                            <template v-if="state.infoHistory.pinfChgItmCd === '258001'">
                                                이메일
                                            </template>
                                            <template v-if="state.infoHistory.pinfChgItmCd === '258002'">
                                                휴대폰번호
                                            </template>
                                            <template v-if="state.infoHistory.pinfChgItmCd === '258003'">
                                                주소
                                            </template>
                                        </td>
                                    </tr>
                                    <tr>
                                        <th scope="row">수정자</th>
                                        <td>{{ state.infoHistory.admnNm }}</td>
                                    </tr>
                                    <tr>
                                        <th scope="row">수정일자</th>
                                        <td>{{ state.infoHistory.fstRgsDt }}</td>
                                    </tr>
                                    <tr>
                                        <th scope="row">요청자</th>
                                        <td>{{ state.infoHistory.rqstpNm }}</td>
                                    </tr>
                                    <tr>
                                        <th scope="row">요청자 소속</th>
                                        <td>{{ state.infoHistory.rqstpBln }}</td>
                                    </tr>
                                    <tr>
                                        <th scope="row">요청자 사유</th>
                                        <td>{{ state.infoHistory.rqstpRsn }}</td>
                                    </tr>
                                    <tr>
                                        <th scope="row">녹취 파일명</th>
                                        <td>{{ state.infoHistory.recFnm }}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </template>
        </DefaultModal>
    </section>
</template>

<script>
import { reactive, inject, onMounted, ref, computed, watch, onUnmounted } from 'vue';
import DefaultModal from '@/plugins/modal/modal/DefaultModal.vue';
import DateSerch from '@/components/ui/DateSerch.vue';
import MemberHealthInfo from './component/MemberHealthInfo.vue';
import DefaultHealth from './component/DefaultHealth.vue';
import HealthService from './component/HealthService.vue';
import MemberHistory from './component/MemberHistory.vue';
import { useCommFunc } from '@/core/helper/common.js';
import { authCommFunc } from '@/core/helper/authComm.js';
import { useStore } from 'vuex';
import { _getMemberInfoDetail, _changeInfoHistory, _getInfoHistory, _addFaultMember } from '@/api/memberinfo.js';
// import { _uploadFile } from '@/api/common.js';
import { useRouter, useRoute } from 'vue-router';

export default {
    components: { DefaultModal, DateSerch, MemberHistory, MemberHealthInfo, DefaultHealth, HealthService },
    setup() {
        const $Modal = inject('$Modal');
        const dayJS = inject('dayJS');
        const { goToPage, tableResize, openModal, isPartnerShow } = useCommFunc();
        const store = useStore();
        const route = useRoute();
        const isHistoryShow = ref(false);
        const mailType = ref(null);
        const infoChangeShow = ref(false);
        const isUseStop = ref(false);
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
        const state = reactive({
            imgName: '',
            request: {
                rsnCd: '',
                rsnCts: ''
            },
            memberInfoDetail: {},
            pagesize: 10,
            mskgnRlsYn: true,
            detailNum: '',
            modalMsg: '',
            saleFeeRt: '',
            mdSn: '',
            mdNm: '',
            mailType1: '',
            mailType2: '',
            // fileList: [],
            modalMode: '',
            setDay: '1month',
            startDay: '',
            endDay: '',
            tablist: [
                { label: '건강정보요약', value: 'healthInfo' },
                { label: '일반건강검진결과', value: 'defaultInfo' },
                { label: '메디컬서비스이용', value: 'service' },
                { label: 'KB건강체크', value: 'healthCheck' }
            ],
            tabPannel: 'healthInfo',
            validState: {
                errState: false, // error state
                message: '', // input message
                target: ''
            }
        });
        const formData = reactive({
            mbrHhpnoFno: '', //담당자휴대폰번호(앞번호
            mbrHhpnoMno: '', //담당자휴대폰번호(중간번호)
            mbrHhpnoBno: '', //담당자휴대폰번호(뒷번호)
            mbrEmad: computed(() => (state.mailType2 === '' || state.mailType2 === '103014') ? `${state.mailType1}` : `${state.mailType1}@${state.mailType2}`), //담당자이메일주소
            mbrDlvLcnmZc: '12345', //우편번호
            mbrDlvLcnmAdr: '', //주소
            mbrDlvLcnmAdrCts: '', //상세주소,
            mbrSn: computed(() => state.detailNum), //회원순번,
            pinfChgItmCd: null, // //개인정보변경항목코드(258001: 이메일, 258002: 휴대폰번호),
            rqstpNm: null, // //요청자명,
            rqstpBln: null, // //요청자소속,
            rqstpRsn: null, // //요청사유,
            // wtdAtflSn: null, // //녹취파일순번,
            recFnm: '', // 녹취 파일명
            fultRsnCd: '226001', //이용중지사유코드(226001: 불건전이용)
            fultApnmDt: computed(() => state.startDay), //시작일
            fultRlsDt: computed(() => state.endDay), //종료일자
            fultRsn: '', //이용중지사유
            menuCode: computed(() => menuInfo.value.menuCode)

        });

        watch(formData, () => {
            resetState();
        });

        /**
         * 휴대폰 번호
         */
        watch(() => formData.mbrHhpnoFno, (value) => {
            checkReg('mbrHhpnoFno', value);
        });
        watch(() => formData.mbrHhpnoMno, (value) => {
            checkReg('mbrHhpnoMno', value);
        });
        watch(() => formData.mbrHhpnoBno, (value) => {
            checkReg('mbrHhpnoBno', value);
        });

        const checkReg = (type, value) => {
            // const reg = /[ㄱ-ㅎ|ㅏ-ㅣ|가-힣|a-z]/;
            // if (reg.exec(value) !== null) formData[type] = formData[type].replace(/[^0-9*]/g, '');
            const reg = /^[0-9*]+$/;
            if (!reg.test(value)) formData[type] = formData[type].replace(/[^0-9*]/g, '');
        };

        onMounted(() => {
            console.log(route.query);
            if (route.query.activeTab) {
                const tabOffset = document.querySelector('.ui-tab-wrap').offsetTop;
                console.log(route.query.activeTab, tabOffset);
                onChangeTab(route.query.activeTab);
                document.querySelector('.contents').scrollTop = tabOffset;
            } else {
                // console.log('top 이동');
                document.querySelector('.contents').scrollTop = 0;
            }

            state.detailNum = route.query.mbrSn;
            getMemberInfoDetail();
            emitter.$on('onChangeMskgn', onChangeMskgn);
            emitter.$on('onChangeEdit', onChangeEdit);
        });
        // 마스킹 해제 이벤트 버스 해제
        onUnmounted(() => {
            emitter.$off('onChangeMskgn');
            emitter.$off('onChangeEdit');
        });
        // 마스킹 권한 체크
        const changeMskgnRlsYn = async () => {
            await onChangeMaskingRol(menuInfo.value.auth6MaskingYn);
        };
        //마스킹 해제 처리 후 리스트 재조회 
        const onChangeMskgn = () => {
            state.mskgnRlsYn = !state.mskgnRlsYn;
            getMemberInfoDetail();
        };
        //수정권한 처리
        const onChangeAuthEdit = async (type, caseType) => {
            state.editMode = type;
            state.caseMode = caseType;
            await onChangeEditRol(menuInfo.value.auth2UpdateYn);
            // @click="() => state.mskgnRlsYn === 'Y' ? actionBtns('maskingFault') : actionModal('infoChangeShow', '이메일', 'edit')"
        };
        // 버튼별 권한 처리 
        const onChangeEdit = () => {
            if (state.editMode !== 'fault') {
                state.mskgnRlsYn ? actionBtns('maskingFault') : actionModal('infoChangeShow', state.caseMode, state.editMode);
            } else {
                state.mskgnRlsYn ? actionBtns('maskingFault') : actionModal('isUseStop');
            }
        };
        // 상세 
        const getMemberInfoDetail = async () => {
            try {
                let params = {
                    mskgnRlsYn: state.mskgnRlsYn ? 'Y' : 'N'
                };
                const response = await _getMemberInfoDetail(state.detailNum, params);
                console.log(response.data.data);
                state.memberInfoDetail = response.data.data;
                formData.mbrDlvLcnmZc = state.memberInfoDetail.mbrDlvLcnmZc;
                formData.mbrDlvLcnmAdr = state.memberInfoDetail.mbrDlvLcnmAdr;
                formData.mbrDlvLcnmAdrCts = state.memberInfoDetail.mbrDlvLcnmAdrCts;
                valueCheck();
            } catch (error) {
                console.log(error);
            }
        };
        //개인정보 변경 사유 등록
        const changeInfoHistory = async () => {
            try {
                let params = {
                    mbrSn: formData.mbrSn,
                    pinfChgItmCd: formData.pinfChgItmCd,
                    rqstpNm: formData.rqstpNm,
                    rqstpBln: formData.rqstpBln,
                    rqstpRsn: formData.rqstpRsn,
                    // wtdAtflSn: formData.wtdAtflSn,
                    recFnm: formData.recFnm,
                    mbrEmad: formData.mbrEmad,
                    mbrHhpnoFno: formData.mbrHhpnoFno,
                    mbrHhpnoMno: formData.mbrHhpnoMno,
                    mbrHhpnoBno: formData.mbrHhpnoBno,
                    mbrDlvLcnmZc: formData.mbrDlvLcnmZc,
                    mbrDlvLcnmAdr: formData.mbrDlvLcnmAdr,
                    mbrDlvLcnmAdrCts: formData.mbrDlvLcnmAdrCts,
                    menuCode: '1002004'
                };
                console.log(params);
                const response = await _changeInfoHistory(params);
                console.log(response.data);
                if (response.data.code === 'OK') {
                    getMemberInfoDetail();
                    formData.rqstpNm = null;
                    formData.rqstpBln = null;
                    formData.rqstpRsn = null;
                    // formData.wtdAtflSn = null;
                    formData.recFnm = '';
                    // state.fileList = [];
                }
            } catch (error) {
                console.log(error);
            }
        };
        //개인정보 변경 사유 조회
        const getInfoHistory = async () => {
            try {
                let params = {
                    mbrSn: formData.mbrSn,
                    pinfChgItmCd: formData.pinfChgItmCd,
                    menuCode: '1002004'
                };
                console.log(params);
                const response = await _getInfoHistory(params);
                state.infoHistory = response.data.data;
                console.log(response);
            } catch (error) {

            }
        };
        //형식에 맞게 쪼개기
        const valueCheck = () => {
            if (state.memberInfoDetail.mbrEmad) {
                //이메일 cmnCdNm
                let mail = state.memberInfoDetail.mbrEmad.split('@')[0];
                let mailD = state.memberInfoDetail.mbrEmad.split('@')[1];
                let mailDomain = null;

                mailDomain = mailType.value.state.selectComm.filter(item => mailD === item.cmnCdNm);
                if (mailDomain.length > 0) {
                    state.mailType2 = mailType.value.state.selectOption = mailDomain[0].cmnCd;
                    state.mailType1 = state.memberInfoDetail.mbrEmad.split('@')[0];
                } else {
                    state.mailType2 = mailType.value.state.selectOption = '103014';
                    state.mailType1 = state.memberInfoDetail.mbrEmad.split('@')[0] + '@' + state.memberInfoDetail.mbrEmad.split('@')[1];
                }
            }
            // console.log(mailDomain);
            //휴대폰 번호
            formData.mbrHhpnoFno = state.memberInfoDetail.mbrHhpno.split('-')[0];
            formData.mbrHhpnoMno = state.memberInfoDetail.mbrHhpno.split('-')[1];
            formData.mbrHhpnoBno = state.memberInfoDetail.mbrHhpno.split('-')[2];

        };
        //이용중지 설정
        const addFaultMember = async () => {
            try {
                let params = {
                    mbrSn: formData.mbrSn,
                    fultRsnCd: formData.fultRsnCd,
                    fultApnmDt: formData.fultApnmDt,
                    fultRlsDt: formData.fultRlsDt,
                    fultRsn: formData.fultRsn,
                    menuCode: '1002001'
                };
                const response = await _addFaultMember(params);
                if (response.data.code === 'OK') {
                    getMemberInfoDetail();
                    formData.fultRsnCd = '226001';
                    formData.fultRsn = '';
                    if (response.data.code === 'OK') {
                        goToPage('/member/health_info/list');
                    }
                }
            } catch (error) {
                console.log(error);
            }
        };
        //탭 메뉴 이동
        const onChangeTab = (type) => {
            state.tabPannel = type;
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
        //모달창열기
        const actionBtns = async (type) => {
            if (type === 'maskingFault') {
                state.modalMsg = '마스킹 해제 후  설정이 가능합니다.';
            } else if (type === 'confirm') {
                if (state.masking === 'N') {
                    state.modalMsg = '마스킹 해제 후 가입 승인 가능합니다.';
                } else {
                    state.modalMsg = '승인처리 하시겠습니까?';
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
                .then(success => {
                    console.log(success);
                    if (type === 'masking') {
                        state.mskgnRlsYn = false;
                        getMemberInfoDetail();
                    }
                })
                .catch(error => {
                    console.log(error);
                });
        };
        const actionModal = (type, code, mode) => {
            if (type === 'infoChangeShow') {
                infoChangeShow.value = true;
                state.modalMode = mode;
                if (code === '휴대폰번호') {
                    formData.pinfChgItmCd = 258002;
                } else if (code === '이메일') {
                    formData.pinfChgItmCd = 258001;
                } else if (code === '주소') {
                    formData.pinfChgItmCd = 258003;
                }
                if (mode === 'list') getInfoHistory();
            } else if (type === 'isHistoryShow') {
                console.log(type);
                isHistoryShow.value = true;
            } else if (type === 'isUseStop') {
                isUseStop.value = true;
            }

        };
        // 모달창 닫기
        const modalControl = async (type, modalName) => {
            console.log(state.modalMode);
            if (modalName === 'infoChangeShow') {
                if (state.modalMode === 'edit') {
                    if (validCheck('infoChangeShow')) {
                        // await uploadFile('fileList');
                        infoChangeShow.value = false;
                        await changeInfoHistory();
                    }
                }
                if (state.modalMode === 'list') {
                    infoChangeShow.value = false;
                }
                if (type === 'modalclose') {
                    infoChangeShow.value = false;
                }

            } else if (modalName === 'isHistoryShow') {
                isHistoryShow.value = false;
            } else if (modalName === 'isUseStop') {
                if (type === 'modalconfirm') {
                    if (validCheck('isUseStop')) {
                        isUseStop.value = false;
                        await addFaultMember();
                    }
                } else {
                    isUseStop.value = false;
                }
            } else if (!modalName) {
                infoChangeShow.value = false;
                isHistoryShow.value = false;
                isHistoryShow.value = false;
                isUseStop.value = false;
            }
            console.log(type, modalName);
        };

        const resetState = () => {
            state.isCheckTermsName = false; // 중복확인
            state.validState.errState = false; // validation
            state.validState.message = '';
        };

        /**
         * @check setInputNumber
         */
        const setInputNumber = (event) => {
            const target = event.target.getAttribute('data-target');
            formData[target] = event.target.value;
            console.log(event.target.getAttribute('data-target'), formData[target]);
        };

        const validCheck = (type) => {
            console.log(type);
            let target = [];
            if (type === 'infoChangeShow') {
                target = ['rqstpNm', 'rqstpRsn', 'recFnm'];
            } else if (type === 'isUseStop') {
                target = ['fultRsnCd', 'fultRsn'];
            }

            for (const item of target) {
                state.validState.target = item;
                state.validState.message = (item === 'fultRsnCd') ? '요청코드를 입력해 주세요' : (item === 'fultRsn') ? '요청사유를 입력해 주세요' : (item === 'rqstpNm') ? '요청자를 입력해주세요' : (item === 'rqstpRsn') ? '요청자사유를 입력해 주세요' : '녹취 파일명을 입력해 주세요';

                if (!formData[item]) {
                    state.validState.errState = true;
                    break;
                }
            }
            return !state.validState.errState;
        };
        const checkValidState = (type) => {
            return state.validState.target === type && state.validState.errState;
        };



        const selectedOptions = (valueCode, valueName, type) => {
            console.log(type);
            if (type === 'rprsTlnoFno' || type === 'mailType2') {
                if (type === 'mailType2') {
                    state.mailType1 = '';
                    state.mailType2 = valueCode;
                    state.mailType2Name = valueName;
                } else {
                    formData[type] = valueName;
                }
            } else if (type === 'mailType1') {
                console.log();
            } else {
                formData[type] = valueCode;
            }
            console.log(valueCode, valueName, type);
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
            pager.current = pagenum;
            //api호출
        };

        return {
            //공통 사용
            $Modal,
            dayJS,
            goToPage,
            tableResize,
            isHistoryShow,
            infoChangeShow,
            isUseStop,
            mailType,
            state,
            formData,
            openModal,
            pager,
            menuInfo,

            actionModal,
            modalControl,
            onChangedPage,
            actionBtns,
            selectedOptions,
            onSelectPicker,
            onChangeTab,
            checkValidState,
            onChangeAuthEdit,
            changeMskgnRlsYn,

            setInputNumber
        };
    }
};
</script>