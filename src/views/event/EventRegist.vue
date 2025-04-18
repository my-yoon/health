<template>
    <section>
        <!-- 기본정보 -->
        <div class="ui-section">
            <subTitleBar :subTitle="'기본 정보'" :ess="'표시는 필수항목입니다.'" />
            <div class="ui-content">
                <!-- {{ formData }} -->
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
                                <th scope="row">제목<span class="ess"><span class="offscreen">필수입력</span></span></th>
                                <td colspan="3">
                                    <div class="reg-group wp-100">
                                        <div class="reg-item">
                                            <input type="text" class="form-control" maxlength="60"
                                                v-model="formData.eventName"
                                                :class="checkValidState('eventName') ? 'error' : ''">
                                        </div>
                                    </div>
                                    <div v-if="checkValidState('eventName')">
                                        <p class="input-guide" :class="{ 'error': state.validState.errState }">
                                            {{ state.validState.message }}
                                        </p>
                                    </div>
                                </td>

                            </tr>
                            <tr>
                                <th scope="row">이벤트 유형<span class="ess"><span class="offscreen">필수입력</span></span></th>
                                <td>
                                    <div class="reg-group">
                                        <div class="reg-item">
                                            <span class="radio" v-for="(item, index) in state.eventType" :key="index">
                                                <input :id="'type' + index" name="openRdo1" type="radio" :value="item.value"
                                                    v-model="formData.eventType"
                                                    @change="changeCountType(formData.eventType)">
                                                <label :for="'type' + index">{{ item.label }}</label>
                                            </span>
                                        </div>
                                    </div>
                                </td>
                                <th scope="row">게시여부<span class="ess"><span class="offscreen">필수입력</span></span></th>
                                <td>
                                    <div class="reg-group">
                                        <div class="reg-item">
                                            <span class="radio" v-for="(item, index) in state.eventShow" :key="index">
                                                <input :id="'show' + index" name="openRd2" type="radio" :value="item.value"
                                                    v-model="formData.pstYn">
                                                <label :for="'show' + index">{{ item.label }}</label>
                                            </span>
                                        </div>
                                    </div>
                                </td>

                            </tr>
                            <tr>
                                <th scope="row">이벤트 대상<span class="ess"><span class="offscreen">필수입력</span></span></th>
                                <td colspan="3">
                                    <div class="reg-group">
                                        <div class="reg-item">
                                            <template v-for="(item, index) in state.eventTarget" :key="index">
                                                <span class="radio" v-if="index === 0">
                                                    <input :id="'target' + index" name="openRdo3" type="radio"
                                                        :value="item.value" v-model="formData.eventTarget"
                                                        :disabled="!(index === 0)">
                                                    <label :for="'target' + index">{{ item.label }}</label>
                                                </span>
                                            </template>
                                        </div>
                                    </div>
                                    <template v-if="formData.eventTarget === 'TARTGET'">
                                        <div class="reg-group">
                                            <div class="reg-item">
                                                <button type="button" class="btn btn-slm">회원 그룹 선택</button>
                                            </div>
                                        </div>
                                        <div class="reg-group wp-100">
                                            <div class="reg-item">
                                                <div class="ui-chips">
                                                    <div class="ui-chips-item">
                                                        <span>KB카드</span>
                                                        <button type="button" class="ui-chips-del">
                                                            <span class="offscreen">삭제하기</span>
                                                        </button>
                                                    </div>
                                                    <div class="ui-chips-item">
                                                        <span>KB손해보험</span>
                                                        <button type="button" class="ui-chips-del">
                                                            <span class="offscreen">삭제하기</span>
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </template>
                                </td>
                            </tr>
                            <tr>
                                <th scope="row">참여제한<span class="ess"><span class="offscreen">필수입력</span></span></th>
                                <td>
                                    <div class="reg-group wp-100">
                                        <div class="reg-item">
                                            <select class="custom-select sm" v-model="formData.pcpType"
                                                @change="changeCount(formData.pcpType)"
                                                v-if="formData.eventType === 'ATTENDANCE'">
                                                <template v-for="(option, index) in state.eventLimit" :key="index">
                                                    <option :value="option.value" v-if="index === 1">
                                                        {{ option.label }}
                                                    </option>
                                                </template>
                                            </select>
                                            <select v-else class="custom-select sm" v-model="formData.pcpType"
                                                @change="onChageBenefit(formData.pcpType, formData.eventType)">
                                                <template v-for="(option, index) in state.eventLimit" :key="index">
                                                    <option v-if="index === 0 && formData.eventType === 'GENERAL'"
                                                        value="NONE">참여제한없음
                                                    </option>
                                                    <option :value="option.value">
                                                        {{ option.label }}
                                                    </option>
                                                </template>
                                            </select>
                                        </div>
                                        <div class="reg-item" v-if="formData.pcpType === 'LIMIT'">
                                            <input type="number" class="form-control" v-model="formData.pcpCount">
                                            <span class="unit">회</span>
                                        </div>
                                    </div>
                                </td>
                                <th scope="row">이벤트기간<span class="ess"><span class="offscreen">필수입력</span></span></th>
                                <td>
                                    <div class="reg-group wp-100">
                                        <div class="reg-item">
                                            <dateSerch @onSelectDate="onSelectPicker" :pickerOnly="true"
                                                :setDay="state.setDay" ref="dateSearch" />
                                        </div>
                                    </div>
                                </td>
                            </tr>

                            <tr>
                                <th scope="row">혜택구분<span class="ess"><span class="offscreen">필수입력</span></span></th>
                                <td>
                                    <div class="reg-group wp-100">
                                        <div class="reg-item">
                                            <template v-for="(item, index) in state.benefitList" :key="index">
                                                <!-- 일반 혜택없음 -->
                                                <div
                                                    v-if="formData.pcpType === 'NONE' && (formData.eventType === 'GENERAL')">
                                                    <span class="radio" v-if="index == 0">
                                                        <input :id="'benefit' + index" name="openRdo41" type="radio"
                                                            :value="item.value" v-model="formData.eventBnefType">
                                                        <label :for="'benefit' + index">{{ item.label }}</label>
                                                    </span>
                                                </div>
                                                <!-- 일반 즉시, 당첨 -->
                                                <div
                                                    v-if="!(formData.pcpType === 'NONE') && (formData.eventType === 'GENERAL')">
                                                    <span class="radio" v-if="!(index == 0)">
                                                        <input :id="'benefit' + index" name="openRdo41" type="radio"
                                                            :value="item.value" v-model="formData.eventBnefType"
                                                            @change="changeCount(formData.eventBnefType, formData.eventType)">
                                                        <label :for="'benefit' + index">{{ item.label }}</label>
                                                    </span>
                                                </div>
                                                <!-- 퀴즈 -->
                                                <div v-if="formData.eventType === 'QUIZ'">
                                                    <span class="radio" v-if="!(index == 0)">
                                                        <input :id="'benefit' + index" name="openRdo41" type="radio"
                                                            :value="item.value" v-model="formData.eventBnefType"
                                                            :disabled="!(formData.eventType === 'GENERAL') && index == 0"
                                                            @change="changeCount(formData.eventBnefType, formData.eventType)">
                                                        <label :for="'benefit' + index">{{ item.label }}</label>
                                                    </span>
                                                </div>
                                                <!-- 룰렛 -->
                                                <div v-if="formData.eventType === 'ROULETTE'">
                                                    <span class="radio" v-if="!(index == 0)">
                                                        <input :id="'benefit' + index" name="openRdo41" type="radio"
                                                            :value="item.value" v-model="formData.eventBnefType"
                                                            :disabled="!(formData.eventType === 'GENERAL') && index == 0"
                                                            @change="changeCount(formData.eventBnefType, formData.eventType)">
                                                        <label :for="'benefit' + index">{{ item.label }}</label>
                                                    </span>
                                                </div>
                                                <!-- 출석-->
                                                <div v-if="formData.eventType === 'ATTENDANCE'">
                                                    <span class="radio" v-if="(index == 1)">
                                                        <input :id="'benefit' + index" name="openRdo41" type="radio"
                                                            :value="item.value" v-model="formData.eventBnefType"
                                                            :disabled="!(formData.eventType === 'GENERAL') && index == 0">
                                                        <label :for="'benefit' + index">{{ item.label }}</label>
                                                    </span>
                                                </div>
                                            </template>
                                        </div>
                                    </div>
                                </td>
                                <th scope="row" v-if="!(formData.eventType === 'ATTENDANCE')">당첨자발표일<span class="ess"><span
                                            class="offscreen">필수입력</span></span></th>
                                <td v-if="!(formData.eventType === 'ATTENDANCE')">
                                    <div class="reg-group wp-100">
                                        <div class="reg-item">
                                            <DateSingle @onSelectDate="onSelectPicker" :setDay="state.setSingleDay"
                                                :disabled="!(formData.eventBnefType === 'AFTER')" ref="dateSearch1">
                                            </DateSingle>
                                        </div>
                                    </div>
                                </td>
                            </tr>
                            <!-- 2차 약관추가 -->
                            <tr>
                                <th scope="row">약관</th>
                                <td colspan="3">
                                    <div class="table-util" style="margin-bottom:0">
                                        <div class="btn-set-m flex">
                                            <button type="button" class="btn btn-ss" @click="openClause">추가</button>
                                            <button type="button" class="btn btn-ss" @click="delClause">삭제</button>
                                        </div>
                                    </div>
                                    <div class="tbl-wrap mt-20" v-if="state.eventClusListTable.length > 0">
                                        <div class="table-list">
                                            <table class="table list">
                                                <caption>약관목록</caption>
                                                <colgroup>
                                                    <col style="width: 45px;">
                                                    <col style="width: 100px;">
                                                    <col style="width: 120px;">
                                                    <col style="width: auto;">
                                                    <!-- <col style="width: 100px;"> -->
                                                    <col style="width: 160px;">
                                                </colgroup>
                                                <thead>
                                                    <tr>
                                                        <th scope="col" class="t-left">
                                                            <span class="checkbox">
                                                                <input id="clauseAll" name="clauseGroup" type="checkbox">
                                                                <label for="clauseAll"></label>
                                                            </span>
                                                        </th>
                                                        <th scope="col">필수 여부</th>
                                                        <th scope="col">약관 주체</th>
                                                        <th scope="col">약관명</th>
                                                        <!-- <th scope="col">버전</th> -->
                                                        <th scope="col">개정 적용일</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    <tr v-for="(item, index) in state.eventClusListTable" :key="index">
                                                        <td>
                                                            <span class="checkbox" :id="'clause1' + index">
                                                                <input :id="'clause' + index" name="clauseGroup"
                                                                    type="checkbox"
                                                                    @change="onChangeClause(`clause${index}`, index)">
                                                                <label :for="`clause${index}`"></label>
                                                            </span>
                                                        </td>
                                                        <td>
                                                            <template v-if="item.seEsnChcCd === '253001'">
                                                                필수
                                                            </template>
                                                            <template v-if="item.seEsnChcCd === '253002'">
                                                                선택
                                                            </template>
                                                        </td>
                                                        <td>{{ item.clusMngOffrNtprSnNm }}</td>
                                                        <td>{{ item.clusGrpNm }}이벤트 이용 약관</td>
                                                        <!-- <td>V1.12.1</td> -->
                                                        <td>{{ dayJS(item.dstrbDt).format('YYYY-MM-DD hh:mm') }}</td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
        <template v-if="formData.eventBnefType.length > 0 && formData.eventName.length > 0">
            <!-- //show이벤트 유형 혜택구분 둘다 설정 완료시 노출 -->
            <div class="ui-section">
                <subTitleBar :subTitle="'이벤트 배너'" :ess="'표시는 필수항목입니다.'" />
                <div class="ui-content">
                    <!-- <button @click="uploadFile('bannerList')">파일API</button> -->
                    <div class="tbl-wrap mt-10">
                        <table class="table reg">
                            <colgroup>
                                <col style="width: 160px;">
                                <col style="width: auto;">
                                <col style="width: 160px;">
                                <col style="width: auto;">
                            </colgroup>
                            <tbody v-if="formData.eventBnefType === 'IMMEDIATELY' || formData.eventBnefType === 'NONE'">
                                <tr>
                                    <th scope="row">배너 이미지<span class="ess"><span class="offscreen">필수입력</span></span></th>
                                    <td>
                                        <div class="reg-group">
                                            <div class="reg-item">
                                                <div class="btn-file">
                                                    <input type="file" id="upload-file" hidden="" ref="fileUploadBanner"
                                                        @change="fileListUp('bannerList', fileUploadBanner)">
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
                                            <div class="upload-file-list" v-if="state.bannerList.length > 0">
                                                <div class="upload-file-list-item flex space-between"
                                                    v-for="(item, index) in state.bannerList" :key="index">
                                                    <button type="button" class="btn del btn-secondary"
                                                        @click="fileListDel('bannerList')">
                                                        <span class="offscreen">파일삭제</span>
                                                    </button>
                                                    <span class="name">{{ item.name }}</span>
                                                    <span class="volume">{{ (item.size / (1024 * 1024)).toFixed(1) }}
                                                        MB</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div v-if="checkValidState('bannerList')">
                                            <p class="input-guide" :class="{ 'error': state.validState.errState }">
                                                {{ state.validState.message }}
                                            </p>
                                        </div>
                                    </td>
                                    <th scope="row">이미지 설명<span class="ess"><span class="offscreen">필수입력</span></span></th>
                                    <td>
                                        <div class="reg-group wp-100">
                                            <div class="reg-item">
                                                <input type="text" class="form-control"
                                                    placeholder="텍스트 리더기로 읽을 수 있도록 이미지 내용을 입력하십시오"
                                                    v-model="formData.bannerImgDesc"
                                                    :class="checkValidState('bannerImgDesc') ? 'error' : ''">
                                            </div>
                                        </div>
                                        <div v-if="checkValidState('bannerImgDesc')">
                                            <p class="input-guide" :class="{ 'error': state.validState.errState }">
                                                {{ state.validState.message }}
                                            </p>
                                        </div>
                                    </td>
                                </tr>
                            </tbody>
                            <tbody v-if="formData.eventBnefType === 'AFTER'">
                                <tr>
                                    <th scope="row">배너 이미지<span class="ess"><span class="offscreen">필수입력</span></span></th>
                                    <td>
                                        <div class="reg-group">
                                            <div class="reg-item">
                                                <div class="btn-file">
                                                    <input type="file" id="upload-file" hidden="" ref="fileUploadBanner"
                                                        @change="fileListUp('bannerList', fileUploadBanner)">
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
                                            <div class="upload-file-list" v-if="state.bannerList.length > 0">
                                                <div class="upload-file-list-item flex space-between"
                                                    v-for="(item, index) in state.bannerList" :key="index">
                                                    <button type="button" class="btn del btn-secondary"
                                                        @click="fileListDel('bannerList')">
                                                        <span class="offscreen">파일삭제</span>
                                                    </button>
                                                    <span class="name">{{ item.name }}</span>
                                                    <span class="volume">{{ (item.size / (1024 * 1024)).toFixed(1) }}
                                                        MB</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div v-if="checkValidState('bannerList')">
                                            <p class="input-guide" :class="{ 'error': state.validState.errState }">
                                                {{ state.validState.message }}
                                            </p>
                                        </div>
                                    </td>
                                    <th scope="row">이미지 설명<span class="ess"><span class="offscreen">필수입력</span></span></th>
                                    <td>
                                        <div class="reg-group wp-100">
                                            <div class="reg-item">
                                                <input type="text" class="form-control"
                                                    placeholder="텍스트 리더기로 읽을 수 있도록 이미지 내용을 입력하십시오"
                                                    v-model="formData.bannerImgDesc"
                                                    :class="checkValidState('bannerImgDesc') ? 'error' : ''">

                                            </div>

                                        </div>
                                        <div v-if="checkValidState('bannerImgDesc')">
                                            <p class="input-guide" :class="{ 'error': state.validState.errState }">
                                                {{ state.validState.message }}
                                            </p>
                                        </div>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <div class="ui-table-guide">
                        <span class="input-guide">배너 이미지는 327*160, 654*320, 981*480px 기준으로 제작되어야 합니다.</span>
                        <span class="input-guide">이미지 설명은 시각 장애인이 텍스트 리더기를 통해 읽을 수 있도록 사용하는 목적이므로 가급적 자세한 정보를 입력하십시오.</span>
                    </div>
                </div>
            </div>
            <!-- 메인컨텐츠 -->
            <div class="ui-section">
                <div>
                    <subTitleBar :subTitle="'메인컨텐츠'" />
                    <div class="ui-content">
                        <div class=" table-util flex space-between">
                            <div class="btn-set-m flex">
                                <button type="button" class="btn btn-ss"
                                    @click="onSelectFile('fileInputList', 'add')">추가</button>
                                <button type="button" class="btn btn-ss"
                                    @click="onSelectFile('fileInputList', 'remove')">삭제</button>
                            </div>
                            <div class="btn-set-m"><span class="ess"></span> 표시는 필수항목입니다.</div>
                        </div>
                        <div class="tbl-wrap mt-10">
                            <table class="table reg">
                                <colgroup>
                                    <col style="width: 45px;">
                                    <col style="width: auto;">
                                    <col style="width: auto;">
                                    <col style="width: 120px;">
                                </colgroup>
                                <thead>
                                    <tr>
                                        <th scope="col" class="chk">
                                            <span class="checkbox">
                                                <input id="mainChkAll" name="mainGroup" type="checkbox">
                                                <label for="mainChkAll"></label>
                                            </span>
                                        </th>
                                        <th scope="col">메인 컨텐츠 이미지<span class="ess"><span
                                                    class="offscreen">필수입력</span></span>
                                        </th>
                                        <th scope="col">이미지 설명<span class="ess"><span class="offscreen">필수입력</span></span>
                                        </th>
                                        <th scope="col">노출 순서<span class="ess"><span class="offscreen">필수입력</span></span>
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <fileInput :fileInputList="state.fileInputList" @changefileList="onChangeFile"
                                        ref="fileInputMain" :checkValidState="checkValidState('fileInputList')"
                                        :errorMessage="state.validState.message" :errorStatus="state.validState.errState"
                                        :formData="formData" :checkValidState_dec="checkValidState('mainImgDesc1')"
                                        v-if="formData.eventBnefType === 'IMMEDIATELY' || formData.eventBnefType === 'NONE'" />
                                    <fileInput :fileInputList="state.fileInputList" @changefileList="onChangeFile"
                                        ref="fileInputMain" :checkValidState="checkValidState('fileInputList')"
                                        :errorMessage="state.validState.message" :errorStatus="state.validState.errState"
                                        :formData="formData" :checkValidState_dec="checkValidState('mainImgDesc1')"
                                        v-if="formData.eventBnefType === 'AFTER'" />

                                </tbody>
                            </table>
                            
                        </div>
                    </div>
                </div>
            </div>
            <!-- 룰렛 출석만 사용 -->
            <div class="ui-section" v-if="formData.eventType === 'ROULETTE' || formData.eventType === 'ATTENDANCE'">
                <subTitleBar :subTitle="'기타컨텐츠'" :ess="'표시는 필수항목입니다.'" />
                <div class="ui-content">
                    <div class="tbl-wrap mt-10">
                        <table class="table reg">
                            <colgroup>
                                <col style="width: 160px;">
                                <col style="width: auto;">
                                <col style="width: 160px;">
                                <col style="width: auto;">
                            </colgroup>
                            <tbody>
                                <tr>
                                    <th scope="row">백그라운드 이미지</th>
                                    <td>
                                        <div class="reg-group">
                                            <div class="reg-item">
                                                <div class="btn-file">
                                                    <input type="file" id="upload-filebg" hidden=""
                                                        @change="fileListUp('backImgList', fileUploadBack)"
                                                        ref="fileUploadBack">
                                                    <label class="btn-up" for="upload-filebg">파일첨부</label>
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
                                            <div class="upload-file-list" v-if="state.backImgList.length > 0">
                                                <div class="upload-file-list-item flex space-between"
                                                    v-for="(item, index) in state.backImgList" :key="index">
                                                    <button type="button" class="btn del btn-secondary"
                                                        @click="fileListDel('backImgList')">
                                                        <span class="offscreen">파일삭제</span>
                                                    </button>
                                                    <span class="name">{{ item.name }}</span>
                                                    <span class="volume">{{ (item.size / (1024 * 1024)).toFixed(1) }}
                                                        MB</span>
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <th scope="row">이미지 설명</th>
                                    <td>
                                        <div class="reg-group wp-100">
                                            <div class="reg-item">
                                                <input type="text" class="form-control"
                                                    placeholder="텍스트 리더기로 읽을 수 있도록 이미지 내용을 입력하십시오"
                                                    v-model="formData.bkgImgDesc">
                                            </div>
                                        </div>
                                    </td>
                                </tr>
                                <tr>
                                    <th scope="row">하단이미지 이미지</th>
                                    <td>
                                        <div class="reg-group">
                                            <div class="reg-item">
                                                <div class="btn-file">
                                                    <input type="file" id="upload-filebot" hidden=""
                                                        @change="fileListUp('bottomImgList', fileUploadBottom)"
                                                        ref="fileUploadBottom">
                                                    <label class="btn-up" for="upload-filebot">파일첨부</label>
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
                                            <div class="upload-file-list" v-if="state.bottomImgList.length > 0">
                                                <div class="upload-file-list-item flex space-between"
                                                    v-for="(item, index) in state.bottomImgList" :key="index">
                                                    <button type="button" class="btn del btn-secondary"
                                                        @click="fileListDel('bottomImgList')">
                                                        <span class="offscreen">파일삭제</span>
                                                    </button>
                                                    <span class="name">{{ item.name }}</span>
                                                    <span class="volume">{{ (item.size / (1024 * 1024)).toFixed(1) }}
                                                        MB</span>
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <th scope="row">이미지 설명</th>
                                    <td>
                                        <div class="reg-group wp-100">
                                            <div class="reg-item">
                                                <input type="text" class="form-control"
                                                    placeholder="텍스트 리더기로 읽을 수 있도록 이미지 내용을 입력하십시오"
                                                    v-model="formData.bottomImgDesc">
                                            </div>
                                        </div>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <div class="ui-table-guide">
                        <span class="input-guide">백그라운드 이미지는 룰렛 가로 000 * 세로 000 px / 출석 000 * 000 px 기준으로 제작되어야 합니다.</span>
                        <span class="input-guide">하단 컨텐츠 이미지는 가로 000px 기준으로 제작되어야 하며 참여 방법, 유의 사항 등에 사용할 수 있습니다.</span>
                        <span class="input-guide">이미지 설명은 시각 장애인이 텍스트 리더기를 통해 읽을 수 있도록 사용하는 목적이므로 가급적 자세한 정보를 입력하십시오.</span>
                    </div>
                </div>
            </div>

            <eventBenefit :formData="formData" @formDataChange="onChangeFormData" :eventBnefType="formData.eventBnefType"
                v-if="(formData.eventType === 'GENERAL' && !(formData.eventBnefType === 'NONE')) || (formData.eventType === 'QUIZ')">
                <template #pdtCon v-if="formData.eventBnefType === 'AFTER'">
                    <tr>
                        <th scope="row">당첨 후 지급 혜택<span class="ess"><span class="offscreen">필수입력</span></span></th>
                        <td colspan="3">
                            <div class="reg-group" v-if="false">
                                <div class="reg-item">
                                    <span class="dv">
                                        <!-- eventBnefType === 'AFTER' 당첨 후 지급 일때사용 -->
                                        <span class="checkbox">
                                            <input id="use" name="openRdo6" type="checkbox" v-model="state.eventProductYn">
                                            <label for="use">외부소싱상품</label>
                                        </span>
                                    </span>

                                </div>
                            </div>
                            <div class="table-util mt-20">
                                <div class="btn-set-m flex">
                                    <button type="button" class="btn btn-ss"
                                        @click="onSelectFile('addprodlist', 'add')">추가</button>
                                    <button type="button" class="btn btn-ss"
                                        @click="onSelectFile('addprodlist', 'remove')">삭제</button>
                                </div>
                                <div class="tbl-wrap mt-10">
                                    <table class="table reg">
                                        <colgroup>
                                            <col style="width: 45px;">
                                            <col style="width: auto;">
                                            <col style="width: 140px;">
                                            <col style="width: 140px;">
                                            <col style="width: 160px;">
                                        </colgroup>
                                        <thead>
                                            <tr>
                                                <th scope="col" class="chk">
                                                    <span class="checkbox">
                                                        <input id="benListChkAll" name="benListChkGroup" type="checkbox">
                                                        <label for="benListChkAll"></label>
                                                    </span>
                                                </th>
                                                <th scope="col">제품 명(최대 30자)
                                                    <span class="ess"><span class="offscreen">필수입력</span></span>
                                                </th>
                                                <th scope="col">당첨 수량
                                                    <span class="ess"><span class="offscreen">필수입력</span></span>
                                                </th>
                                                <th scope="col">제세공과금 대상
                                                    <span class="ess"><span class="offscreen">필수입력</span></span>
                                                </th>
                                                <th scope="col">당첨 등 수(최대10자)
                                                    <span class="ess"><span class="offscreen">필수입력</span></span>
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <PrdAdd :addprodlist="state.addprodlist" @onChangePdtList="onChangeFormData" />

                                        </tbody>
                                    </table>
                                    <div
                                        v-if="checkValidState('productNm') && !(state.addprodlist[state.addprodlist.length - 1].productNm)">
                                        <p class="input-guide" :class="{ 'error': state.validState.errState }">
                                            {{ state.validState.message }}
                                        </p>
                                    </div>
                                    <div
                                        v-if="checkValidState('text') && !(state.addprodlist[state.addprodlist.length - 1].text)">
                                        <p class="input-guide" :class="{ 'error': state.validState.errState }">
                                            {{ state.validState.message }}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </td>

                    </tr>
                </template>
            </eventBenefit>
            <div v-if="checkValidState('eventFrcCount') && formData.eventFrcYn === 'Y'">
                <p class="input-guide" :class="{ 'error': state.validState.errState }">
                    {{ state.validState.message }}
                </p>
            </div>
            <div v-if="checkValidState('eventPoint')">
                <p class="input-guide" :class="{ 'error': state.validState.errState }">
                    {{ state.validState.message }}
                </p>
            </div>

            <!-- 기능설정 -일반  -->
            <eventApprDefault :formData="formData" @formDataChange="onChangeFormData"
                v-if="formData.eventType === 'GENERAL'" />
            <!-- 일반 기능 에러 -->
            <div v-if="checkValidState('eventBtnType')">
                <p class="input-guide" :class="{ 'error': state.validState.errState }">
                    {{ state.validState.message }}
                </p>
            </div>
            <div
                v-if="checkValidState('eventBtnName') && (formData.eventBtnType === 'LINK' || formData.eventBtnType === 'JOIN')">
                <p class=" input-guide" :class="{ 'error': state.validState.errState }">
                    {{ state.validState.message }}
                </p>
            </div>
            <div v-if="checkValidState('eventBtnLink') && formData.eventBtnType === 'LINK'">
                <p class="input-guide" :class="{ 'error': state.validState.errState }">
                    {{ state.validState.message }}
                </p>
            </div>
            <!-- 기능설정 퀴즈  -->
            <eventApprQuiz :formData="formData" @formDataChange="onChangeFormData" v-if="formData.eventType === 'QUIZ'" />


            <!-- 퀴즈 기능 에러 -->
            <div v-if="checkValidState('eventAnswer') && !(formData.eventAnswer)">
                <p class="input-guide" :class="{ 'error': state.validState.errState }">
                    {{ state.validState.message }}
                </p>
            </div>
            <div
                v-if="checkValidState('eventQuiz1') || checkValidState('eventQuiz2') || checkValidState('eventQuiz3') || checkValidState('eventQuiz4')">
                <p class="input-guide" :class="{ 'error': state.validState.errState }">
                    {{ state.validState.message }}
                </p>
            </div>
            <div v-if="checkValidState('eventHintLink') && formData.eventHintType === 'LINK'">
                <p class="input-guide" :class="{ 'error': state.validState.errState }">
                    {{ state.validState.message }}
                </p>
            </div>
            <div v-if="checkValidState('eventHintTxt') && formData.eventHintType === 'TEXT'">
                <p class="input-guide" :class="{ 'error': state.validState.errState }">
                    {{ state.validState.message }}
                </p>
            </div>

            <!-- 기능설정 룰렛  -->
            <eventApprRoultte :formData="formData" @formDataChange="onChangeFormData"
                v-if="formData.eventType === 'ROULETTE'" ref="RoultteAppr">
                <!-- 룰렛 기능 에러 -->
                <template #errorCase>
                    <div v-if="checkValidState(`rouletteTxt${formData.rouletteCnt}`)">
                        <p class="input-guide" :class="{ 'error': state.validState.errState }">
                            {{ state.validState.message }}
                        </p>
                    </div>
                    <div v-if="checkValidState('roulettePoint1') || checkValidState('rouletteProductNm1')">
                        <p class="input-guide" :class="{ 'error': state.validState.errState }">
                            {{ state.validState.message }}
                        </p>
                    </div>
                    <div v-if="checkValidState('roulettePoint2') || checkValidState('rouletteProductNm2')">
                        <p class="input-guide" :class="{ 'error': state.validState.errState }">
                            {{ state.validState.message }}
                        </p>
                    </div>
                    <div v-if="checkValidState('roulettePoint3') || checkValidState('rouletteProductNm3')">
                        <p class="input-guide" :class="{ 'error': state.validState.errState }">
                            {{ state.validState.message }}
                        </p>
                    </div>
                    <div v-if="checkValidState('roulettePoint4') || checkValidState('rouletteProductNm4')">
                        <p class="input-guide" :class="{ 'error': state.validState.errState }">
                            {{ state.validState.message }}
                        </p>
                    </div>
                    <div v-if="checkValidState('roulettePoint5') || checkValidState('rouletteProductNm5')">
                        <p class="input-guide" :class="{ 'error': state.validState.errState }">
                            {{ state.validState.message }}
                        </p>
                    </div>
                    <div v-if="checkValidState('roulettePoint6') || checkValidState('rouletteProductNm6')">
                        <p class="input-guide" :class="{ 'error': state.validState.errState }">
                            {{ state.validState.message }}
                        </p>
                    </div>
                    <div v-if="checkValidState(`roulettePrbl${formData.rouletteCnt}`)">
                        <p class="input-guide" :class="{ 'error': state.validState.errState }">
                            {{ state.validState.message }}
                        </p>
                    </div>
                    <div
                        v-if="checkValidState('roulettePcpCnt1') || checkValidState('roulettePcpCnt2') || checkValidState('roulettePcpCnt3') || checkValidState('roulettePcpCnt4') || checkValidState('roulettePcpCnt5') || checkValidState('roulettePcpCnt6')">
                        <p class="input-guide" :class="{ 'error': state.validState.errState }">
                            {{ state.validState.message }}
                        </p>
                    </div>


                </template>
            </eventApprRoultte>


            <!-- 기능설정 출석  ATTENDANCE-->
            <eventApprAttendance :formData="formData" @formDataChange="onChangeFormData"
                v-if="formData.eventType === 'ATTENDANCE'">
                <template #btns>
                    <div class="btn-set-m flex">
                        <button type="button" class="btn btn-ss"
                            @click="onSelectFile('fileInputList_Atnd', 'add')">추가</button>
                        <button type="button" class="btn btn-ss"
                            @click="onSelectFile('fileInputList_Atnd', 'remove')">삭제</button>
                    </div>
                </template>
                <template #benefit>
                    <fileInputAtnd :fileInputList_Atnd="state.fileInputList_Atnd" :eventDayOption="state.eventDayOption"
                        @changefileList="atndOption">
                    </fileInputAtnd>
                </template>
                <template #pointError>
                    <div v-if="checkValidState('eventBasicPoint')">
                        <p class="input-guide" :class="{ 'error': state.validState.errState }">
                            {{ state.validState.message }}
                        </p>
                    </div>
                </template>
                <template #pointError1>
                    <div v-if="checkValidState('eventGaegnPoint')">
                        <p class="input-guide" :class="{ 'error': state.validState.errState }">
                            {{ state.validState.message }}
                        </p>
                    </div>
                </template>
                <template #benefitError>
                    <div v-if="checkValidState('chcEps')">
                        <p class="input-guide" :class="{ 'error': state.validState.errState }">
                            {{ state.validState.message }}
                        </p>
                    </div>
                    <div v-if="checkValidState('chcEpsPayPnt')">
                        <p class="input-guide" :class="{ 'error': state.validState.errState }">
                            {{ state.validState.message }}
                        </p>
                    </div>
                    <div v-if="checkValidState('file') || checkValidState('file1')">
                        <p class="input-guide" :class="{ 'error': state.validState.errState }">
                            {{ state.validState.message }}
                        </p>
                    </div>
                </template>
            </eventApprAttendance>

        </template>
        <div class="btn-bottom-set flex justify-center">
            <button type="button" class="btn btn-sl nega">취소</button>
            <button type="button" class="btn btn-sl posi" @click="registEvent(formData.eventType)">저장</button>
        </div>
        <DefaultModal :isShow="isEventclause" :modalTitle="'이벤트 약관 선택'" :buttonConfirm="''" :buttonCancel="'닫기'"
            :modalName="'isEventclause'" @modalclose="clauseModalControl">
            <template #modalcontent>
                <div>
                    <div class="ui-data-filter sm">
                        <div class="form-item">
                            <div class="item">
                                <label>필수 여부</label>
                                <span class="input">
                                    <span class="dv">
                                        <span class="radio" v-for="(item, index) in state.seEsnChcCdlist" :key="index">
                                            <input :id="'isEss' + index" name="isEssGroup" type="radio" :value="item.value"
                                                v-model="popupFormData.seEsnChcCd">
                                            <label :for="'isEss' + index">{{ item.label }}</label>
                                        </span>
                                    </span>
                                </span>
                            </div>
                            <div class="btn-filter-set">
                                <button type="button" class="btn btn-sm" @click="reloadList">
                                    <span class="ico-search"></span>검색
                                </button>
                            </div>
                        </div>
                        <div class="form-item">
                            <div class="item">
                                <label>약관명</label>
                                <span class="input">
                                    <span class="dv">
                                        <input type="text" class="form-control sm w-300" v-model="popupFormData.searchText">
                                    </span>
                                </span>
                            </div>
                        </div>
                    </div>
                    <div class="tbl-wrap">
                        <div class="table-util flex space-between">
                            <div></div>
                            <div class="btn-set-m flex align-end">
                                <span class="table-total">조회결과 총 <strong>{{ pager.totalCnt }}</strong>건</span>
                                <selectBox :selectType="'page'" @changedValue="selectedOptions_list" />
                            </div>
                        </div>
                        <NoData :nodatatext="'조회된 데이터가 없습니다.'" v-if="state.clauselist.length === 0"></NoData>
                        <div v-else>
                            <AgGridVue :columnDefs="state.tableColum_c" :rowData="state.clauselist"
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
    </section>
</template>
<script>
import { getCurrentInstance, computed, reactive, inject, ref, onMounted, watch } from 'vue';
import DefaultModal from '@/plugins/modal/modal/DefaultModal.vue';
import fileInput from './components/fileInput.vue';
import fileInputAtnd from './components/fileInputAtnd.vue';
import PrdAdd from './components/PrdAdd.vue';
import eventApprDefault from './components/eventApprDefault.vue';
import eventApprQuiz from './components/eventApprQuiz.vue';
import eventApprRoultte from './components/eventApprRoultte.vue';
import eventApprAttendance from './components/eventApprAttendance.vue';
import eventBenefit from './components/eventBenefit.vue';
import DateSerch from '@/components/ui/DateSerch.vue';
import DateSingle from '@/components/ui/DateSingle.vue';
import { useCommFunc } from '@/core/helper/common.js';
import { useStore } from 'vuex';
import { useRouter, useRoute } from 'vue-router';
import { _regGeneralEvent, _regQuizEvent, _regAtndEvent, _regAddEvent, _regRouletteEvent, _getEventClause } from '@/api/event.js';
import { _uploadFile } from '@/api/common.js';
export default {
    components: { DefaultModal, DateSerch, DateSingle, fileInput, PrdAdd, eventApprDefault, eventBenefit, eventApprQuiz, eventApprRoultte, eventApprAttendance, fileInputAtnd },
    setup() {
        const internalInstance = getCurrentInstance();
        const $Modal = inject('$Modal');
        const dayJS = inject('dayJS');
        const route = useRoute();
        const fileUploadBanner = ref(null);
        const fileUploadBack = ref(null);
        const fileUploadBottom = ref(null);
        const fileInputMain = ref(null);
        const dateSearch = ref(null);
        const RoultteAppr = ref(null);
        const isEventclause = ref(false);
        const { goToPage, fileDown, tableResize, openModal, isPartnerShow, isDownShow, isImgShow, isRequestShow } = useCommFunc();
        const store = useStore();
        const initColum = ref([
            {
                headerName: '번호',
                field: 'no',
                maxWidth: 80,
                valueGetter: 'node.rowIndex + 1',
                suppressSizetoFit: true
            },
            { headerName: '필수 여부', field: 'seEsnChcCdNm', maxWidth: 90 },
            { headerName: '약관명', field: 'clusNm' },
            { headerName: '개정적용일시', field: 'dstrbDt', maxWidth: 120 },
            {
                headerName: '선택',
                field: 'adminName',
                cellRenderer: (params) => {
                    const tagString = `<button type="button" class="btn btn-ss" id=eventselect-${params.node.rowIndex}>선택</button>`;
                    const buttonTarget = document.createElement('div');
                    buttonTarget.innerHTML = tagString;
                    const buttonEventTarget = buttonTarget.querySelector(`#eventselect-${params.node.rowIndex}`);
                    buttonEventTarget.addEventListener('click', () => {
                        let isListCheck = state.eventClusList.some(item => item.clusMngSn == params.data.clusMngSn);
                        let isListTableCheck = state.eventClusListTable.some(item => item.clusMngSn == params.data);
                        if (!isListCheck && !isListTableCheck) {
                            state.eventClusList.push({
                                'clusMngSn': params.data.clusMngSn
                            });
                            state.eventClusListTable.push(params.data);
                        }
                        isEventclause.value = false;
                        return isListCheck, isListTableCheck;
                    });
                    return buttonTarget;
                }
            }
        ]);
        const state = reactive({
            fileInfo: [],
            bannerList: [],
            mainImgList1: [],
            mainImgList2: [],
            mainImgList3: [],
            mainImgList4: [],
            mainImgList5: [],
            backImgList: [],
            bottomImgList: [],

            setDay: {
                from: new Date(), //시작일
                to: new Date().getTime() + 3600 * 1000 * 24 * 30 //종료일
            },
            setSingleDay: new Date().getTime() + 3600 * 1000 * 24 * 31, //당첨자 발표일
            startDay: '',
            endDay: '',
            mainImg1: '',
            mainImg2: '',
            mainImg3: '',
            mainImg4: '',
            mainImg5: '',
            bkgImg: '',
            bottomImg: '',
            point: false,
            eventProductYn: false,
            eventPzwnDt: '',
            fileInputList: [{
                checkbox: false,
                fileName: [{ name: '', size: '' }],
                filedec: '',
                order: 1
            }],
            fileInputList_Atnd: [{
                checkbox: false,
                chcEps: 0,
                chcEpsPayPnt: 0,
                chcEpsPayImg1: 0,
                chcEpsPayImg2: 0
            }],
            addprodlist: [
                {
                    checkbox: false,
                    tax: false,
                    productNm: '', //상품명
                    productCnt: 1, //tnwkd
                    productTax: 'N', //제세공과금
                    text: '' //당첨등수 표시명
                }
            ],
            eventAddAtnd: [
                {
                    atndEvntSn: 0,
                    chcEps: 0,
                    chcEpsPayPnt: 0,
                    chcEpsPayImg1: 0,
                    chcEpsPayImg2: 0
                }
            ],
            addImgList: [],

            eventType: [
                { label: '일반', value: 'GENERAL' },
                { label: '퀴즈', value: 'QUIZ' },
                { label: '룰렛', value: 'ROULETTE' },
                { label: '출석', value: 'ATTENDANCE' }
                // { label: '초대', value: 'INVITATION' }
            ],
            eventIng: [
                { label: '전체', value: '' },
                { label: '진행중', value: 'ING' },
                { label: '대기', value: 'WAITING' },
                { label: '마감', value: 'COMPLETE' },
                { label: '긴급종료', value: 'STOP' }
            ],
            benefitList: [
                { label: '혜택없음', value: 'NONE' },
                { label: '즉시지급', value: 'IMMEDIATELY' },
                { label: '당첨 후 지급', value: 'AFTER' }
            ],
            eventTarget: [
                { label: '모든사용자', value: 'ALL' },
                { label: '회원그룹', value: 'TARTGET' },
                { label: '건강정보동의 회원', value: '' }
            ],
            eventKeyword: [
                { label: '전체', value: '' },
                { label: '이벤트제목', value: 'NAME' },
                { label: '이벤트 번호', value: 'CODE' }
            ],
            eventShow: [
                { label: '게시', value: 'Y' },
                { label: '비게시', value: 'N' }
            ],
            eventLimit: [
                { label: '기간내 1회', value: 'ONCE' },
                { label: '1일 1회', value: 'ONEDAY' },
                { label: '기간내 n회', value: 'LIMIT' }
            ],
            eventDayOption: 28,
            validState: {
                errState: false, // error state
                message: '', // input message
                target: ''
            },
            eventPointYN: false,
            pointlist: [],
            delNum: 0,
            errorrouType: false,
            errorcntroucnt: false,
            seEsnChcCdlist: [
                { label: '전체', value: '' },
                { label: '필수', value: '253001' },
                { label: '선택', value: '253002' }
            ],
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
            pagesize: 10,
            clauselist: [],
            eventClusList: [], //약관 번호만 
            eventClusListTable: [], //약관 리스트 
            Clause: []


        });
        //약관 폼 params
        const popupFormData = reactive({
            clusAgrmDomnCd: '', //약관동의영역코드
            seEsnChcCd: '', //구분필수
            searchType: '', //조회조건
            searchText: '' //조회 조건 값
        });
        // 폼 params
        const formData = reactive({
            eventName: '', //제목
            eventType: 'GENERAL', //이벤트 유형
            pstYn: 'Y', //게시여부
            eventTarget: 'ALL', // 이벤트 대상
            pcpType: 'NONE', //참여제한
            pcpCount: '0', // 중복회수
            eventStartDt: computed(() => state.startDay), //시작일 
            eventEndDt: computed(() => state.endDay), //종료일
            eventBnefType: 'NONE', //참여혜택
            eventPzwnDt: computed(() => state.eventPzwnDt == '' ? '' : dayJS(state.eventPzwnDt).format('YYYY-MM-DD')),
            eventClusYn: computed(() => state.eventClusList.length > 0 ? 'Y' : 'N'), // 약관여부
            eventClusList: computed(() => state.eventClusList),
            // eventProgress: '', //이벤트 상태
            bannerImg: computed(() => state.bannerImg), //배너이미지
            bannerImgDesc: '', //배너이미지 설명
            mainImg1: computed(() => state.mainImg1), //이미지 1
            mainImgDesc1: '', //이미지 1설명
            mainImg2: computed(() => state.mainImg2), //이미지 2
            mainImgDesc2: '', //이미지 2설명
            mainImg3: computed(() => state.mainImg3), //이미지 3
            mainImgDesc3: '', //이미지 3설명
            mainImg4: computed(() => state.mainImg4), //이미지 4
            mainImgDesc4: '', //이미지 4설명
            mainImg5: computed(() => state.mainImg5), //이미지 5설명
            mainImgDesc5: '', //이미지 5설명
            bkgImg: computed(() => state.bkgImg), //배경이미지
            bkgImgDesc: '', // 배경이미지 설명
            bottomImg: computed(() => state.bottomImg), // 하단 이미지
            bottomImgDesc: '', // 하단 이미지 설명
            fstRgtrSn: 0,
            fstRgsDt: '',
            lastUpdrSn: 0,
            lastUpdDt: '',
            eventFrcYn: 'N', // 선착순 사용
            eventFrcCount: 0, // 선착순 인원
            eventPoint: 0, //이벤트 포인트
            eventProductYn: computed(() => state.eventProductYn ? 'Y' : 'N'), //이벤트 상품 여부
            eventBtnType: '', //이벤트 버튼 타입
            eventBtnName: '', //이벤트 버튼명
            eventBtnLink: '', // 이벤트 버튼 링크,
            prodlist: [], //상품 

            eventQuiz1: '', //퀴즈1
            eventQuiz2: '', //퀴즈2
            eventQuiz3: '', //퀴즈3
            eventQuiz4: '', //퀴즈4
            eventQuiz5: '', //퀴즈5
            eventAnswer: '', //정답번호
            eventHintType: '', //힌트 타입
            eventHintLink: '', //힌트 링크
            eventHintTxt: '', //힌트 문구
            immyPayBnef: '', //즉시지급혜택 포인트,상품
            pzwnPayBnef: '', //당첨후 지급혜택  포인트,상품
            rouletteCnt: 4, //룰렛판 갯수
            rouletteType1: 0, //당첨구분(0:꽝,1:당첨)
            rouletteTxt1: '', //1번 표시텍스트
            roulettePoint1: 0, //1번 지급포인트
            rouletteProductNm1: '', //1번 상품명
            rouletteProduct1: '', //1번 지급 상품
            rouletteTax1: 'N', //1번 재세공과금대상 Y/N
            roulettePcpCnt1: 0, //1번 참여가능 인원(0:무제한)
            roulettePrbl1: '', //1번 확률 두자리 두자리
            rouletteType2: 0,
            rouletteTxt2: '',
            roulettePoint2: 0,
            rouletteProductNm2: '',
            rouletteProduct2: '',
            rouletteTax2: 'N',
            roulettePcpCnt2: 0,
            roulettePrbl2: '',
            rouletteType3: 0,
            rouletteTxt3: '',
            roulettePoint3: 0,
            rouletteProductNm3: '',
            rouletteProduct3: '',
            rouletteTax3: 'N',
            roulettePcpCnt3: 0,
            roulettePrbl3: '',
            rouletteType4: 0,
            rouletteTxt4: '',
            roulettePoint4: 0,
            rouletteProductNm4: '',
            rouletteProduct4: '',
            rouletteTax4: 'N',
            roulettePcpCnt4: 0,
            roulettePrbl4: '',
            rouletteType5: 0,
            rouletteTxt5: '',
            roulettePoint5: 0,
            rouletteProductNm5: '',
            rouletteProduct5: '',
            rouletteTax5: 'N',
            roulettePcpCnt5: 0,
            roulettePrbl5: '',
            rouletteType6: 0,
            rouletteTxt6: '',
            roulettePoint6: 0,
            rouletteProductNm6: '',
            rouletteProduct6: '',
            rouletteTax6: 'N',
            roulettePcpCnt6: 0,
            roulettePrbl6: '',
            //출석
            eventDay: 0,
            eventBasicPoint: 0,
            eventGaegnPoint: 0,
            eventGaegnYn: computed(() => state.eventGaegnPoint > 0 ? 'Y' : 'N')
        });
        //퀴즈 유형 선택시 formData 리셋
        const resetParams = () => {
            // formData.eventName = '';
            formData.pstYn = 'Y';
            formData.eventTarget = 'ALL';
            formData.pcpCount = '';

            state.bannerImg = '';
            formData.bannerImgDesc = '';
            state.mainImg1 = '';
            formData.mainImgDesc1 = '';
            state.mainImg2 = '';
            state.mainImg2 = '';
            formData.mainImgDesc2 = '';
            state.mainImg3 = '';
            state.mainImg3 = '';
            formData.mainImgDesc3 = '';
            state.mainImg4 = '';
            formData.mainImgDesc4 = '';
            state.mainImg5 = '';
            formData.mainImgDesc5 = '';
            state.bkgImg = '';
            formData.bkgImgDesc = '';
            state.bottomImg = '';
            formData.bottomImgDesc = '';
            formData.fstRgtrSn = 0;
            formData.fstRgsDt = '';
            formData.lastUpdrSn = 0;
            formData.lastUpdDt = '';
            formData.eventFrcYn = 'N';
            formData.eventFrcCount = 0;
            formData.eventPoint = 0;
            state.eventProductYn = false;
            formData.eventBtnType = '';
            formData.eventBtnName = '';
            formData.eventBtnLink = '';
            formData.prodlist = [];

            formData.eventQuiz1 = '';
            formData.eventQuiz2 = '';
            formData.eventQuiz3 = '';
            formData.eventQuiz4 = '';
            formData.eventQuiz5 = '';
            formData.eventAnswer = '';
            formData.eventHintType = '';
            formData.eventHintLink = '';
            formData.eventHintTxt = '';

            formData.immyPayBnef = '';
            formData.pzwnPayBnef = '';
            formData.rouletteCnt = 4;
            formData.rouletteType1 = 0;
            formData.rouletteTxt1 = '';
            formData.roulettePoint1 = 0;
            formData.rouletteProductNm1 = '';
            formData.rouletteProduct1 = '';
            formData.rouletteTax1 = 'N';
            formData.roulettePcpCnt1 = 0;
            formData.roulettePrbl1 = '';
            formData.rouletteType2 = 0;
            formData.rouletteTxt2 = '';
            formData.roulettePoint2 = 0;
            formData.rouletteProductNm2 = '';
            formData.rouletteProduct2 = '';
            formData.rouletteTax2 = 'N';
            formData.roulettePcpCnt2 = 0;
            formData.roulettePrbl2 = '';
            formData.rouletteType3 = 0;
            formData.rouletteTxt3 = '';
            formData.roulettePoint3 = 0;
            formData.rouletteProductNm3 = '';
            formData.rouletteProduct3 = '';
            formData.rouletteTax3 = 'N';
            formData.roulettePcpCnt3 = 0;
            formData.roulettePrbl3 = '';
            formData.rouletteType4 = 0;
            formData.rouletteTxt4 = '';
            formData.roulettePoint4 = 0;
            formData.rouletteProductNm4 = '';
            formData.rouletteProduct4 = '';
            formData.rouletteTax4 = 'N';
            formData.roulettePcpCnt4 = 0;
            formData.roulettePrbl4 = '';
            formData.rouletteType5 = 0;
            formData.rouletteTxt5 = '';
            formData.roulettePoint5 = 0;
            formData.rouletteProductNm5 = '';
            formData.rouletteProduct5 = '';
            formData.rouletteTax5 = 'N';
            formData.roulettePcpCnt5 = 0;
            formData.roulettePrbl5 = '';
            formData.rouletteType6 = 0;
            formData.rouletteTxt6 = '';
            formData.roulettePoint6 = 0;
            formData.rouletteProductNm6 = '';
            formData.rouletteProduct6 = '';
            formData.rouletteTax6 = 'N';
            formData.roulettePcpCnt6 = 0;
            formData.roulettePrbl6 = '';
            //출석
            formData.eventDay = 0;
            formData.eventBasicPoint = 0;
            formData.eventGaegnYn = computed(() => state.eventGaegnPoint > 0 ? 'Y' : 'N');
            formData.eventGaegnPoint = 0;
        };

        const resetState = () => {
            state.isCheckTermsName = false; // 중복확인 
            state.validState.errState = false; // validation
            state.validState.message = '';
            state.errorrouType = false;
            state.errorcntroucnt = false;
        };
        watch(formData, () => {
            resetState();
            if (formData.eventType === 'GENERAL' && formData.pcpType === 'NONE') {
                formData.eventBnefType = 'NONE';
            }
        });

        // @validate
        const validCheck = (type) => {
            let Commtarget = ['eventName', 'bannerList', 'bannerImgDesc', 'fileInputList', 'mainImgDesc1'];
            let target = [];
            if (formData.eventType === 'GENERAL' && formData.eventBnefType === 'NONE') {
                target = [...Commtarget, ...['eventBtnType', 'eventBtnName', 'eventBtnLink']];
            }
            if (formData.eventType === 'GENERAL' && formData.eventBnefType === 'IMMEDIATELY') {
                target = [...Commtarget, ...['eventFrcYn', 'eventFrcCount', 'eventPoint', 'eventBtnType', 'eventBtnName', 'eventBtnLink']];
            }
            if (formData.eventType === 'GENERAL' && formData.eventBnefType === 'AFTER') {
                //,
                target = [...Commtarget, ...['eventFrcYn', 'eventFrcCount', 'productNm', 'text', 'eventBtnType', 'eventBtnName', 'eventBtnLink']];
            }
            if (formData.eventType === 'QUIZ' && formData.eventBnefType === 'IMMEDIATELY') {
                target = [...Commtarget, ...['eventFrcYn', 'eventFrcCount', 'eventPoint', 'eventAnswer', 'eventQuiz1', 'eventQuiz2', 'eventQuiz3', 'eventQuiz4', 'eventHintLink', 'eventHintLink', 'eventHintTxt']];
            }
            if (formData.eventType === 'QUIZ' && formData.eventBnefType === 'AFTER') {
                target = [...Commtarget, ...['productNm', 'text', 'eventAnswer', 'eventQuiz1', 'eventQuiz2', 'eventQuiz3', 'eventQuiz4', 'eventHintLink', 'eventHintTxt']];
            }
            if (formData.eventType === 'ROULETTE' && formData.eventBnefType === 'IMMEDIATELY') {
                target = [...Commtarget, ...[`rouletteTxt${formData.rouletteCnt}`, 'roulettePoint1', 'roulettePoint2', 'roulettePoint3', 'roulettePoint4', 'roulettePoint5', `roulettePrbl${formData.rouletteCnt}`]];
            }
            if (formData.eventType === 'ROULETTE' && formData.eventBnefType === 'AFTER') {
                target = [...Commtarget, ...[`rouletteTxt${formData.rouletteCnt}`, 'rouletteProductNm1', 'rouletteProductNm2', 'rouletteProductNm3', 'rouletteProductNm4', 'rouletteProductNm5', 'roulettePcpCnt1', 'roulettePcpCnt2', 'roulettePcpCnt3', 'roulettePcpCnt4', 'roulettePcpCnt5', 'roulettePcpCnt6', `roulettePrbl${formData.rouletteCnt}`]];

            }
            if (formData.eventType === 'ATTENDANCE') {
                target = [...Commtarget, ...['eventBasicPoint', 'chcEps', 'chcEpsPayPnt', 'file', 'file1']];
            }

            for (const item of target) {
                console.log(item, !formData[item], formData.eventAnswer);
                state.validState.target = item;
                if (!formData[item] &&
                    !(item === 'bannerList') &&
                    !(item === 'fileInputList') &&
                    !(item === 'mainImgDesc1') &&
                    !(item === 'eventFrcYn') &&
                    !(item === 'eventFrcCount') &&
                    !(item === 'productNm') &&
                    !(item === 'text') &&
                    !(item === 'eventPoint') &&
                    !(item === 'eventBtnName') &&
                    !(item === 'eventBtnLink') &&
                    !(item === `rouletteTxt${formData.rouletteCnt}`) &&
                    !(item == 'roulettePoint1') &&
                    !(item == 'roulettePoint2') &&
                    !(item == 'roulettePoint3') &&
                    !(item == 'roulettePoint4') &&
                    !(item == 'roulettePoint5') &&
                    !(item == 'roulettePoint6') &&
                    !(item == 'rouletteProductNm1') &&
                    !(item == 'rouletteProductNm2') &&
                    !(item == 'rouletteProductNm3') &&
                    !(item == 'rouletteProductNm4') &&
                    !(item == 'rouletteProductNm5') &&
                    !(item == 'rouletteProductNm6') &&
                    !(item == 'roulettePcpCnt1') &&
                    !(item == 'roulettePcpCnt2') &&
                    !(item == 'roulettePcpCnt3') &&
                    !(item == 'roulettePcpCnt4') &&
                    !(item == 'roulettePcpCnt5') &&
                    !(item == 'roulettePcpCnt6') &&
                    !(item == 'eventHintLink') &&
                    !(item == 'eventHintTxt') &&
                    !(item === `roulettePrbl${formData.rouletteCnt}`) &&
                    !(item === 'chcEps') && !(item === 'chcEpsPayPnt') && !(item === 'file') && !(item === 'file1')) {
                    if (item === 'eventName') {
                        state.validState.message = '이벤트 제목을 넣어 주세요';
                    } else if (item === 'bannerImgDesc') {
                        state.validState.message = '이벤트 배너 이미지 설명을 작성해야 합니다.';
                    } else if (item === 'eventBtnType') {
                        state.validState.message = '버튼 타입을 작성해주세요';
                    } else if (item === 'eventBtnLink' && formData.eventBtnType === 'LINK') {
                        state.validState.message = '링크을 등록해주세요';
                    } else if (item === 'eventAnswer') {
                        state.validState.message = '정답을 선택해 주세요';
                    } else if (item === 'eventQuiz1' || item === 'eventQuiz2' || item === 'eventQuiz3' || item === 'eventQuiz4') {
                        state.validState.message = '퀴즈 답변을 모두 작성해 주세요';
                    } else if (item === 'eventBasicPoint') {
                        state.validState.message = '기본포인트를 작성하세요';
                    } else if (item === 'eventGaegnPoint') {
                        state.validState.message = '개근혜택을 작성하세요';
                    }
                    state.validState.errState = true;
                    break;
                }
                if (item === 'eventBtnName' && (formData.eventBtnType === 'LINK' || formData.eventBtnType === 'JOIN') && !(formData.eventBtnName)) {
                    state.validState.message = '버튼명를 작성해주세요';
                    state.validState.errState = true;
                    break;
                }
                if (item === 'eventBtnLink' && formData.eventBtnType === 'LINK' && !(formData.eventBtnLink)) {
                    state.validState.message = '버튼명를 작성해주세요';
                    state.validState.errState = true;
                    break;
                }
                if (item === 'eventFrcCount' && formData.eventFrcYn === 'Y' && _.isEmpty(formData.eventFrcCount)) {
                    state.validState.message = '선착순 인원을 선택해 주세요';
                    state.validState.errState = true;
                    break;
                }
                if (item === 'productNm' && !(state.addprodlist[`${state.addprodlist.length - 1}`].productNm)) {
                    console.log(!(state.addprodlist[0].productNm));
                    state.validState.message = '상품명을 작성해 주세요';
                    state.validState.errState = true;
                    break;
                }
                if (item === 'text' && !(state.addprodlist[`${state.addprodlist.length - 1}`].text)) {
                    console.log(!(state.addprodlist[0].text));
                    state.validState.message = '당첨 등수를 등록해 주세요';
                    state.validState.errState = true;
                    break;
                }
                if (item === 'eventPoint' && !formData[item]) {
                    state.validState.message = '포인트를 등록해주세요';
                    state.validState.errState = true;
                    break;
                }
                if (item === 'bannerList' && _.isEmpty(state.bannerList)) {
                    state.validState.errState = true;
                    if (item === 'bannerList') {
                        state.validState.message = '이벤트 배너를 등록해야 합니다.';
                    }
                    break;
                }
                if (item === 'fileInputList' && _.isEmpty(state.fileInputList[0].fileName)) {
                    if (item === 'fileInputList') {
                        state.validState.message = '메인컨텐츠를 1개이상 등록해야합니다.';
                    }
                    state.validState.errState = true;
                    break;
                }
                if (item === 'mainImgDesc1' && _.isEmpty(state.fileInputList[0].filedec)) {
                    if (item === 'mainImgDesc1') {
                        state.validState.message = '메인컨텐츠 이미지 설명을 작성해야 합니다.';
                    }
                    state.validState.errState = true;
                    break;
                }
                if (item === 'eventHintLink' && formData.eventHintType === 'LINK' && _.isEmpty(formData.eventHintLink)) {
                    state.validState.message = '퀴즈 힌트 링크를 작성해 주세요';
                    state.validState.errState = true;
                    break;
                }
                if (item === 'eventHintTxt' && formData.eventHintType === 'TEXT' && _.isEmpty(formData.eventHintTxt)) {
                    state.validState.message = '퀴즈 힌트 내용을 작성해 주세요';
                    state.validState.errState = true;
                    break;
                }
                if (item === `rouletteTxt${formData.rouletteCnt}` && _.isEmpty(formData[`rouletteTxt${formData.rouletteCnt}`])) {
                    state.validState.message = '룰렛 텍스트를 작성해주세요 ';
                    state.validState.errState = true;
                    break;
                }
                if (item === 'roulettePoint1' && formData[item] == 0) {
                    if (formData.rouletteType1 == 1) {
                        state.validState.message = '룰렛 포인트를 작성해주세요';
                        state.validState.errState = true;
                        break;
                    }
                }
                if (item === 'roulettePoint2') {
                    if (formData.rouletteType2 == 1 && formData[item] == 0) {
                        state.validState.message = '룰렛 포인트를 작성해주세요';
                        state.validState.errState = true;
                        break;
                    }
                }
                if (item === 'roulettePoint3') {
                    if (formData.rouletteType3 == 1 && formData[item] == 0) {
                        state.validState.message = '룰렛 포인트를 작성해주세요';
                        state.validState.errState = true;
                        break;
                    }
                }
                if (item === 'roulettePoint4') {
                    if (formData.rouletteType4 == 1 && formData[item] == 0) {
                        state.validState.message = '룰렛 포인트를 작성해주세요';
                        state.validState.errState = true;
                        break;
                    }
                }
                if (item === 'roulettePoint5') {
                    if (formData.rouletteType5 == 1 && formData[item] == 0) {
                        state.validState.message = '룰렛 포인트를 작성해주세요';
                        state.validState.errState = true;
                        break;
                    }
                }
                if (item === 'roulettePoint6') {
                    if (formData.rouletteType6 == 1 && formData[item] == 0) {
                        state.validState.message = '룰렛 포인트를 작성해주세요';
                        state.validState.errState = true;
                        break;
                    }
                }

                let sum = 0;
                if (formData.rouletteCnt == '4') {
                    sum = Number(formData.roulettePrbl1) + Number(formData.roulettePrbl2) + Number(formData.roulettePrbl3) + Number(formData.roulettePrbl4);
                } else if (formData.rouletteCnt == '5') {
                    sum = Number(formData.roulettePrbl1) + Number(formData.roulettePrbl2) + Number(formData.roulettePrbl3) + Number(formData.roulettePrbl4) + Number(formData.roulettePrbl5);
                } else if (formData.rouletteCnt == '6') {
                    sum = Number(formData.roulettePrbl1) + Number(formData.roulettePrbl2) + Number(formData.roulettePrbl3) + Number(formData.roulettePrbl4) + Number(formData.roulettePrbl5) + Number(formData.roulettePrbl6);
                }
                if (item == `roulettePrbl${formData.rouletteCnt}` && !(sum == 100.00)) {
                    state.validState.errState = true;
                    state.validState.message = '합계는 100.00% 이어야 합니다.';
                    break;

                }
                if (item === 'rouletteProductNm1') {
                    if (formData.rouletteType1 == 1 && _.isEmpty(formData[item])) {
                        state.validState.message = '상품을 작성해주세요';
                        state.validState.errState = true;
                        break;
                    }
                }
                if (item === 'rouletteProductNm2') {
                    if (formData.rouletteType2 == 1 && _.isEmpty(formData[item])) {
                        state.validState.message = '상품을 작성해주세요';
                        state.validState.errState = true;
                        break;
                    }
                }
                if (item === 'rouletteProductNm3') {
                    if (formData.rouletteType3 == 1 && _.isEmpty(formData[item])) {
                        state.validState.message = '상품을 작성해주세요';
                        state.validState.errState = true;
                        break;
                    }
                }
                if (item === 'rouletteProductNm4') {
                    if (formData.rouletteType4 == 1 && _.isEmpty(formData[item])) {
                        state.validState.message = '상품을 작성해주세요';
                        state.validState.errState = true;
                        break;
                    }
                }
                if (item === 'rouletteProductNm5') {
                    if (formData.rouletteType5 == 1 && _.isEmpty(formData[item])) {
                        state.validState.message = '상품을 작성해주세요';
                        state.validState.errState = true;
                        break;
                    }
                }
                if (item === 'rouletteProductNm6') {
                    if (formData.rouletteType6 == 1 && _.isEmpty(formData[item])) {
                        state.validState.message = '상품을 작성해주세요';
                        state.validState.errState = true;
                        break;
                    }
                }
                if (item === 'roulettePcpCnt1') {
                    console.log(formData.rouletteType1 == 1 && formData[item] == 0);
                    if (formData.rouletteType1 == 1 && formData[item] == 0) {
                        state.validState.message = '당첨인원을 작성해 주세요';
                        state.validState.errState = true;
                        break;
                    }
                }
                if (item === 'roulettePcpCnt2') {
                    if (formData.rouletteType2 == 1 && formData[item] == 0) {
                        state.validState.message = '당첨인원을 작성해 주세요';
                        state.validState.errState = true;
                        break;
                    }
                }
                if (item === 'roulettePcpCnt3') {
                    if (formData.rouletteType3 == 1 && formData[item] == 0) {
                        state.validState.message = '당첨인원을 작성해 주세요';
                        state.validState.errState = true;
                        break;
                    }
                }
                if (item === 'roulettePcpCnt4') {
                    if (formData.rouletteType4 == 1 && formData[item] == 0) {
                        state.validState.message = '당첨인원을 작성해 주세요';
                        state.validState.errState = true;
                        break;
                    }
                }
                if (item === 'roulettePcpCnt5') {
                    if (formData.rouletteType5 == 1 && formData[item] == 0) {
                        state.validState.message = '당첨인원을 작성해 주세요';
                        state.validState.errState = true;
                        break;
                    }
                }
                if (item === 'roulettePcpCnt6') {
                    if (formData.rouletteType6 == 1 && formData[item] == 0) {
                        state.validState.message = '당첨인원을 작성해 주세요';
                        state.validState.errState = true;
                        break;
                    }
                }
                if (item === 'chcEps' && state.eventAddAtnd[(state.eventAddAtnd.length - 1)][item] < 1) {
                    console.log(state.eventAddAtnd[(state.eventAddAtnd.length - 1)][item]);
                    state.validState.message = '누적혜택 회차를 선택하세요';
                    state.validState.errState = true;
                    break;
                }
                if (item === 'chcEpsPayPnt' && state.eventAddAtnd[(state.eventAddAtnd.length - 1)][item] < 1) {
                    console.log(state.eventAddAtnd[(state.eventAddAtnd.length - 1)][item] < 1);
                    state.validState.message = '누적혜택 포인트를 입력하세요';
                    state.validState.errState = true;
                    break;
                } if (item === 'file' && state.addImgList.length === 0) {
                    state.validState.message = '이미지를 선택하세요';
                    state.validState.errState = true;
                    break;
                } if (item === 'file1' && _.isEmpty(state.addImgList[(state.eventAddAtnd.length - 1)].fileUploadtype2)) {
                    state.validState.message = '이미지를 선택하세요';
                    state.validState.errState = true;
                    break;
                }
            }
            return !state.validState.errState;
        };

        // 유효성 체크시 에러 태그 클래스 추가
        const checkValidState = (type) => {
            return state.validState.target === type && state.validState.errState;
        };

        onMounted(() => {
            formData.eventType = route.query.eventType;
            changeCountType(route.query.eventType);
        });

        //이벤트 등록시 확인 얼럿
        const registEvent = (type) => {
            if (validCheck()) {
                console.log('통과');
                $Modal.confirm({
                    message: formData.eventName + '를 등록 하시겠습니까?',
                    buttonText: {
                        confirm: '확인',
                        cancel: '취소'
                    }
                })
                    .then(async (success) => {
                        //이미지 등록
                        const imgs = ['bannerList', 'mainImgList1', 'mainImgList2', 'mainImgList3', 'mainImgList4', 'mainImgList5', 'backImgList', 'bottomImgList'];
                        await regImgUpload();
                        for (const item of imgs) {
                            if (state[item].length > 0) {
                                await uploadFile(item);
                            }
                        }
                        await regApiEvent(type);
                    })
                    .catch(error => {
                        console.log(error);
                    });
            }
        };

        //참여 제한선택시 기본값 체크
        const onChageBenefit = (type, eventCase) => {
            if (!(type === 'NONE') && (eventCase === 'GENERAL')) {
                formData.eventBnefType = 'IMMEDIATELY';
                formData.eventPoint = 100;
            }
            if (type == 'LIMIT') {
                formData.pcpCount = '10';
            }
            if (!(type == 'LIMIT')) {
                formData.pcpCount = '';
            }
        };
        //참여 혜택 선택시 기본값 체크
        const changeCount = (type, eventCase) => {
            if (eventCase == 'ROULETTE' && type == 'IMMEDIATELY') {
                resetParams();
                formData.immyPayBnef = 'POINT';
                formData.pzwnPayBnef = '';
                state.eventPzwnDt = '';
                state.bannerList = [];
                state.backImgList = [];
                state.bottomImgList = [];
                state.fileInputList.splice(1);
                state.fileInputList[0].filedec = '';
                formData.roulettePcpCnt1 = 0;
                formData.roulettePcpCnt2 = 0;
                formData.roulettePcpCnt3 = 0;
                formData.roulettePcpCnt4 = 0;
                formData.roulettePcpCnt5 = 0;
                formData.roulettePcpCnt6 = 0;
                RoultteAppr.value.state.isPrize0 = 0;
                RoultteAppr.value.state.isPrize1 = 0;
                RoultteAppr.value.state.isPrize2 = 0;
                RoultteAppr.value.state.isPrize3 = 0;
                RoultteAppr.value.state.isPrize4 = 0;
                RoultteAppr.value.state.isPrize5 = 0;

            }
            if (eventCase == 'ROULETTE' && type == 'AFTER') {
                resetParams();
                state.bannerList = [];
                state.backImgList = [];
                state.bottomImgList = [];
                state.fileInputList.splice(1);
                state.fileInputList[0].filedec = '';
                formData.pzwnPayBnef = 'PRODUCT';
                formData.immyPayBnef = '';
                state.eventPzwnDt = state.setSingleDay;
                RoultteAppr.value.state.isPrize0 = 0;
                RoultteAppr.value.state.isPrize1 = 0;
                RoultteAppr.value.state.isPrize2 = 0;
                RoultteAppr.value.state.isPrize3 = 0;
                RoultteAppr.value.state.isPrize4 = 0;
                RoultteAppr.value.state.isPrize5 = 0;
                // fileInputMain.value.state.mainImgList1 = [];
                // console.log(.filedec);

            }
            if ((eventCase == 'GENERAL' || eventCase == 'QUIZ') && type == 'AFTER') {
                resetParams();
                state.eventProductYn = true;
                formData.eventPoint = 0;
                state.eventPzwnDt = state.setSingleDay;

                state.bannerList = [];
                state.backImgList = [];
                state.bottomImgList = [];
                state.fileInputList.splice(1);
                state.fileInputList[0].filedec = '';


            }
            if ((eventCase == 'GENERAL' || eventCase == 'QUIZ') && type == 'IMMEDIATELY') {
                resetParams();
                state.eventProductYn = false;
                formData.eventPoint = 100;
                state.bannerList = [];
                state.backImgList = [];
                state.bottomImgList = [];
                state.fileInputList.splice(1);
                state.fileInputList[0].filedec = '';

            }
        };
        //유형에 따른 기본값 체크
        const changeCountType = (type, eventCase) => {
            console.log(type, eventCase);
            resetParams();
            if (type == 'GENERAL') {
                goToPage('/event/register/genaral');
            }
            if (type == 'QUIZ') {
                goToPage('/event/register/quiz');
            }
            if (type == 'ROULETTE') {
                goToPage('/event/register/roulette');
            }
            if (type == 'ATTENDANCE') {
                formData.pcpType = 'ONEDAY';
                formData.eventBnefType = 'IMMEDIATELY';
                formData.eventDay = 28;
            }
        };
        //이벤트 등록
        const regApiEvent = async (type) => {
            try {
                let paramsComm = {
                    eventName: formData.eventName,
                    eventType: formData.eventType,
                    pstYn: formData.pstYn,
                    eventTarget: formData.eventTarget,
                    pcpType: formData.pcpType,
                    pcpCount: formData.pcpCount,
                    eventStartDt: formData.eventStartDt,
                    eventEndDt: formData.eventEndDt,
                    eventBnefType: formData.eventBnefType,
                    eventPzwnDt: formData.eventPzwnDt,
                    eventClusYn: formData.eventClusYn,
                    eventClusList: formData.eventClusList,
                    bannerImg: formData.bannerImg,
                    bannerImgDesc: formData.bannerImgDesc,
                    mainImg1: formData.mainImg1,
                    mainImgDesc1: formData.mainImgDesc1,
                    mainImg2: formData.mainImg2,
                    mainImgDesc2: formData.mainImgDesc2,
                    mainImg3: formData.mainImg3,
                    mainImgDesc3: formData.mainImgDesc3,
                    mainImg4: formData.mainImg4,
                    mainImgDesc4: formData.mainImgDesc4,
                    mainImg5: formData.mainImg5,
                    mainImgDesc5: formData.mainImgDesc5,
                    bkgImg: formData.bkgImg,
                    bkgImgDesc: formData.bkgImgDesc,
                    bottomImg: formData.bottomImg,
                    bottomImgDesc: formData.bottomImgDesc,
                    fstRgtrSn: formData.fstRgtrSn,
                    fstRgsDt: formData.fstRgsDt,
                    lastUpdrSn: formData.lastUpdrSn,
                    lastUpdDt: formData.lastUpdDt

                };
                //일반 이벤트 추가 params
                let paramsGen = {
                    eventFrcYn: formData.eventFrcYn,
                    eventFrcCount: formData.eventFrcCount,
                    eventPoint: formData.eventPoint,
                    eventProductYn: formData.eventProductYn,
                    eventBtnType: formData.eventBtnType,
                    eventBtnName: formData.eventBtnName,
                    eventBtnLink: formData.eventBtnLink,
                    prodlist: formData.prodlist

                };
                //퀴즈 이벤트 추가 params
                let paramsQuiz = {
                    eventFrcYn: formData.eventFrcYn,
                    eventFrcCount: formData.eventFrcCount,
                    eventPoint: formData.eventPoint,
                    eventProductYn: formData.eventProductYn,
                    prodlist: formData.prodlist,
                    eventQuiz1: formData.eventQuiz1,
                    eventQuiz2: formData.eventQuiz2,
                    eventQuiz3: formData.eventQuiz3,
                    eventQuiz4: formData.eventQuiz4,
                    eventAnswer: formData.eventAnswer,
                    eventHintType: formData.eventHintType,
                    eventHintLink: formData.eventHintLink,
                    eventHintTxt: formData.eventHintTxt
                };

                //룰렛 이벤트 추가 params
                let paramsRoulette = {
                    immyPayBnef: formData.immyPayBnef,
                    pzwnPayBnef: formData.pzwnPayBnef,
                    rouletteCnt: formData.rouletteCnt,
                    rouletteType1: formData.rouletteType1,
                    rouletteTxt1: formData.rouletteTxt1,
                    roulettePoint1: formData.roulettePoint1,
                    rouletteProductNm1: formData.rouletteProductNm1,
                    rouletteProduct1: formData.rouletteProduct1,
                    rouletteTax1: formData.rouletteTax1,
                    roulettePcpCnt1: formData.roulettePcpCnt1,
                    roulettePrbl1: formData.roulettePrbl1,
                    rouletteType2: formData.rouletteType2,
                    rouletteTxt2: formData.rouletteTxt2,
                    roulettePoint2: formData.roulettePoint2,
                    rouletteProductNm2: formData.rouletteProductNm2,
                    rouletteProduct2: formData.rouletteProduct2,
                    rouletteTax2: formData.rouletteTax2,
                    roulettePcpCnt2: formData.roulettePcpCnt2,
                    roulettePrbl2: formData.roulettePrbl2,
                    rouletteType3: formData.rouletteType3,
                    rouletteTxt3: formData.rouletteTxt3,
                    roulettePoint3: formData.roulettePoint3,
                    rouletteProductNm3: formData.rouletteProductNm3,
                    rouletteProduct3: formData.rouletteProduct3,
                    rouletteTax3: formData.rouletteTax3,
                    roulettePcpCnt3: formData.roulettePcpCnt3,
                    roulettePrbl3: formData.roulettePrbl3,
                    rouletteType4: formData.rouletteType4,
                    rouletteTxt4: formData.rouletteTxt4,
                    roulettePoint4: formData.roulettePoint4,
                    rouletteProductNm4: formData.rouletteProductNm4,
                    rouletteProduct4: formData.rouletteProduct4,
                    rouletteTax4: formData.rouletteTax4,
                    roulettePcpCnt4: formData.roulettePcpCnt4,
                    roulettePrbl4: formData.roulettePrbl4,
                    rouletteType5: formData.rouletteType5,
                    rouletteTxt5: formData.rouletteTxt5,
                    roulettePoint5: formData.roulettePoint5,
                    rouletteProductNm5: formData.rouletteProductNm5,
                    rouletteProduct5: formData.rouletteProduct5,
                    rouletteTax5: formData.rouletteTax5,
                    roulettePcpCnt5: formData.roulettePcpCnt5,
                    roulettePrbl5: formData.roulettePrbl5,
                    rouletteType6: formData.rouletteType6,
                    rouletteTxt6: formData.rouletteTxt6,
                    roulettePoint6: formData.roulettePoint6,
                    rouletteProductNm6: formData.rouletteProductNm6,
                    rouletteProduct6: formData.rouletteProduct6,
                    rouletteTax6: formData.rouletteTax6,
                    roulettePcpCnt6: formData.roulettePcpCnt6,
                    roulettePrbl6: formData.roulettePrbl6
                };

                //출석 이벤트 추가 params
                let paramsAttend = {
                    eventDay: formData.eventDay,
                    eventBasicPoint: formData.eventBasicPoint,
                    eventGaegnYn: formData.eventGaegnYn,
                    eventGaegnPoint: formData.eventGaegnPoint
                };
                if (type === 'GENERAL') {
                    let params = {
                        ...paramsComm,
                        ...paramsGen
                    };
                    console.log(params);
                    // return false;
                    const response = await _regGeneralEvent(params);
                    if (response.data.code === 'OK') {
                        goToPage('/event/list');
                    }
                    console.log(response);
                } else if (type === 'QUIZ') {
                    let params = {
                        ...paramsComm,
                        ...paramsQuiz
                    };
                    console.log(params);
                    const response = await _regQuizEvent(params);
                    if (response.data.code === 'OK') {
                        goToPage('/event/list');
                    }
                    console.log(response);
                } else if (type === 'ROULETTE') {
                    let params = {
                        ...paramsComm,
                        ...paramsRoulette
                    };
                    console.log(params);
                    const response = await _regRouletteEvent(params);
                    console.log(response);
                    if (response.data.code === 'OK') {
                        goToPage('/event/list');
                    }
                } else if (type === 'ATTENDANCE') {
                    let params = {
                        ...paramsComm,
                        ...paramsAttend
                    };
                    console.log(params);

                    const response = await _regAtndEvent(params);
                    state.eventGaegnPoint = 0;
                    if (response.data.code === 'OK') {

                        await addendUploadFile(state.addImgList);
                        state.eventAddAtnd = state.eventAddAtnd.map((item, index) => {
                            item.atndEvntSn = response.data.data.atndEvntSn;
                            return item;
                        });

                        let params = [{
                            atndEvntSn: 40,
                            chcEps: 5,
                            chcEpsPayPnt: 0,
                            chcEpsPayImg1: 0,
                            chcEpsPayImg2: 0
                        }];
                        const res = await _regAddEvent(state.eventAddAtnd);
                        if (res.data.code === 'OK') {
                            goToPage('/event/list');
                        }
                    }
                }
            } catch (error) {
                console.log(error);
            }
        };
        //이미지 등록폼 추가 || 삭제
        const onSelectFile = (caseType, type) => {
            // console.log(type, caseType);
            let filedName = {
                checkbox: false,
                fileName: [{ name: '', size: '' }],
                filedec: '',
                order: state[caseType].length + 1
            };
            // 2차 상품 추가시
            let filedName1 = {
                checkbox: false,
                tax: false,
                productNm: '',
                productCnt: 1,
                productTax: 'N',
                text: ''
            };
            if (type === 'add') {
                //출석
                if (caseType === 'fileInputList_Atnd') {
                    let filedName = {
                        checkbox: false,
                        chcEps: 0,
                        chcEpsPayPnt: 0,
                        chcEpsPayImg1: 0,
                        chcEpsPayImg2: 0
                    };
                    // 추가 혜택 받을 params담기
                    let addlist = {
                        atndEvntSn: 0,
                        chcEps: 0,
                        chcEpsPayPnt: 0,
                        chcEpsPayImg1: 0,
                        chcEpsPayImg2: 0
                    };
                    state[caseType].push(filedName);
                    state.eventAddAtnd.push(addlist);
                } else if (caseType === 'addprodlist') {
                    state[caseType].push(filedName1);
                } else {
                    if (state[caseType].length < 5) {
                        state[caseType].push(filedName);
                    } else {
                        $Modal.simple({
                            title: '',
                            message: '5개 까지만 추가 할 수 있습니다.',
                            buttonText: {
                                ok: '확인'
                            }
                        });
                    }
                }

            } else if (type === 'remove') {
                if (caseType === 'addprodlist') {
                    console.log(state.delNum);
                    formData.prodlist.splice(state.delNum, 1);

                    console.log(formData.prodlist, state.addprodlist);
                }
                if (caseType === 'fileInputList_Atnd') {
                    console.log(state.delNum);

                    state.fileInputList_Atnd.splice(state.delNum, 1);
                    console.log(state.fileInputList_Atnd);
                }
                if (caseType === 'fileInputList') {
                    state.fileInputList = state.fileInputList.filter((item) => {
                        if (!item.checkbox == true) {
                            return item;
                        }

                    });
                    console.log(state.fileInputList);
                }
            }
        };
        // 컴포넌트 value받아 오기
        const onChangeFormData = (caseType, value, index) => {
            let idType = document.querySelector(`#${caseType}`);
            if (value === 'text' || value === 'point') {
                console.log(idType, idType.value);
                formData[caseType] = idType.value;
            } else if (value === 'tax') {
                if (idType.checked) {
                    formData[caseType] = 'Y';
                } else {
                    formData[caseType] = 'N';
                }
            } else if (value === 'PcpCnt') {
                if (idType.checked) {
                    formData[`roulettePcpCnt${index + 1}`] = 1;
                } else {
                    formData[`roulettePcpCnt${index + 1}`] = 0;
                }
            } else if (caseType.indexOf('roulettePcpCntText') === 0) {
                let idType = document.querySelector(`#roulettePcpCntText${value}`);
                formData[`roulettePcpCnt${value}`] = Number(idType.value);
                console.log(formData[`roulettePcpCnt${value}`]);

            } else if (caseType.indexOf('roulettePrbl') === 0) {
                let per1 = document.querySelector(`#roulettePrbl_first${value}`).value;
                let per2 = document.querySelector(`#roulettePrbl_last${value}`).value;
                formData[`roulettePrbl${value}`] = `${per1}.${per2}`;
            } else if (value === 'Product') {
                let idType = document.querySelector(`#${caseType}`);
                formData[caseType] = idType.value;
            } else if (caseType === 'eventDay') {
                formData[caseType] = value;
                state.eventDayOption = value;
            } else if (caseType === 'eventFrcYn') {
                formData[caseType] = value;
                if (value === 0) {
                    formData.eventFrcCount = 0;
                }
            } else if (caseType === 'eventPointYN' && !(formData.eventPoint)) {
                state.eventPointYN = value;
                formData.eventPoint = 100;

            } else if (caseType === 'productNm' || caseType === 'productCnt' || caseType === 'productCnt' || caseType === 'tax' || caseType === 'text') {
                const key = 'checkbox';
                const taxkey = 'tax';
                state.addprodlist[index][caseType] = value;
                const array = state.addprodlist.map(item => {
                    if (item.tax == true) {
                        item.productTax = 'Y';
                    } else {
                        item.productTax = 'N';
                    }
                    const { [key]: checkbox, [taxkey]: tax, ...rest } = item;
                    return rest;
                });
                formData.prodlist = array;
            } else if (caseType === 'eventAnswer') {
                formData[caseType] = value + 1;
            } else if (caseType === 'eventHintType') {
                console.log('힌트타입설정');
                if (value === 'LINK') { formData.eventHintTxt = ''; }
                if (value === 'TEXT') { formData.eventHintLink = ''; }
                formData[caseType] = value;
            } else if (caseType === 'eventGaegnPoint') {
                state.eventGaegnPoint = value;
                formData[caseType] = value;
                console.log(state.eventGaegnPoint);
            } else if (caseType.indexOf('rouletteType') > -1) {
                console.log(index, value);
                formData[caseType] = value;
                // 룰렛 꽝인지 당첨인지에 따른 리셋처리
                if (value == 0) {
                    // console.log('꽝입니다.');
                    formData[`rouletteTax${index + 1}`] = 'N';
                    formData[`rouletteProductNm${index + 1}`] = '';
                    formData[`rouletteTxt${index + 1}`] = '';
                    formData[`rouletteProduct${index + 1}`] = '';
                    formData[`roulettePoint${index + 1}`] = '';
                    formData[`roulettePcpCnt${index + 1}`] = 0;
                    formData[`rouletteTxt${index + 1}`] = '';

                } else {
                    if (formData.eventBnefType === 'AFTER') {
                        console.log('당첨입니다', index, `roulettePcpCnt${index + 1}`);
                        formData[`roulettePcpCnt${index + 1}`] = 1;
                    }
                }
            } else {
                console.log(caseType, value);
                formData[caseType] = value;
                if (caseType == 'checkbox' && value.indexOf('mainChkpdt') > -1) {
                    state.delNum = index;
                }
            }
            console.log(formData);
            resetState();
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
            } else if (type === 'singleday') {
                console.log(value);
                state.eventPzwnDt = '';
                if (formData.eventBnefType === 'AFTER') {
                    state.eventPzwnDt = value;
                }
            }
            //api호출
            console.log('선택일:' + value, '선택된 버튼:' + type, '조회기준:' + status, dayJS(formData.from).format('MM-DD'));
        };

        // 데이터 피커 초기화
        const onInitDate = () => {
            dateSearch.value.initDate();
        };
        // 배너 파일업로드
        const fileListUp = (type) => {
            let inputName = null;
            if (type === 'bannerList') {
                inputName = fileUploadBanner;
            }
            if (type === 'backImgList') {
                inputName = fileUploadBack;
            }
            if (type === 'bottomImgList') {
                inputName = fileUploadBottom;
            }
            state[type] = (Array.from(inputName.value.files));
            resetState();
        };
        //파일업로드 API
        const uploadFile = async (type) => {
            // console.log(type);
            const formData = new FormData();
            formData.append('file', state[type][0]);
            try {
                const response = await _uploadFile(formData);
                // console.log(response.data.fileId);
                if (type === 'bannerList') {
                    state.bannerImg = response.data.fileId;
                } else if (type === 'mainImgList1') {
                    state.mainImg1 = response.data.fileId;
                } else if (type === 'mainImgList2') {
                    state.mainImg2 = response.data.fileId;
                } else if (type === 'mainImgList3') {
                    state.mainImg3 = response.data.fileId;
                } else if (type === 'mainImgList4') {
                    state.mainImg4 = response.data.fileId;
                } else if (type === 'mainImgList5') {
                    state.mainImg5 = response.data.fileId;
                } else if (type === 'backImgList') {
                    state.bkgImg = response.data.fileId;
                } else if (type === 'bottomImgList') {
                    state.bottomImg = response.data.fileId;
                }
                state.fileInfo.push(response.data);
            } catch (error) {
                console.log(error);
            }
        };
        //메인콘텐츠 이미지 순서에 따라 params에 전달
        const regImgUpload = () => {
            //일반 이벤트 이미지 등록
            state.fileInputList.map((item, index) => {
                if (item.order === 1) {
                    state.mainImgList1 = item.fileName;
                    formData.mainImgDesc1 = item.filedec;
                } else if (item.order === 2) {
                    state.mainImgList2 = item.fileName;
                    formData.mainImgDesc2 = item.filedec;
                } else if (item.order === 3) {
                    state.mainImgList3 = item.fileName;
                    formData.mainImgDesc3 = item.filedec;
                } else if (item.order === 4) {
                    state.mainImgList4 = item.fileName;
                    formData.mainImgDesc4 = item.filedec;
                } else if (item.order === 5) {
                    state.mainImgList5 = item.fileName;
                    formData.mainImgDesc5 = item.filedec;
                }
                return item;
            });
        };
        // 파일 리스트 삭제 
        const fileListDel = (type) => {
            state[type] = [];
        };
        // 메인 콘텐츠 컴포넌트 폼 데이터 추가 
        const onChangeFile = (type, typeName, index, data) => {
            // console.log(type, typeName, index, data);
            if (type === 'inputFile') {
                state.fileInputList[index].fileName = data;
            }
            resetState();
        };
        // 추가혜택 이미지 순차 등록API
        const addendUploadFile = async (type) => {
            // console.log(type);
            let index = 0;
            const formData = new FormData();
            for (const item of type) {
                for (let i = 1; i <= 2; i++) {
                    formData.append('file', item[`fileUploadtype${i}`][0]);
                    let response = await _uploadFile(formData);
                    state.eventAddAtnd[index][`chcEpsPayImg${i}`] = response.data.fileId;
                    formData.delete('file');
                }
                index++;
            }
        };
        //출석 이벤트 추가혜택
        const atndOption = (caseType, index, type, value) => {
            console.log(caseType, index, type, value);
            if (caseType === 'checkbox') {
                state.delNum = type;
            } else if (caseType === 'inputFile') {
                state.addImgList = value;
            } else {
                state.eventAddAtnd[index][type] = value;
            }
            resetState();
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
        };

        const getEventClause = async () => {
            try {
                let params = {
                    size: pager.size,
                    offset: pager.offset,
                    clusAgrmDomnCd: '285006',
                    seEsnChcCd: popupFormData.seEsnChcCd,
                    searchType: popupFormData.searchType,
                    searchText: popupFormData.searchText
                };
                const response = await _getEventClause(params);
                console.log(response);
                state.clauselist = response.data.data.list;
                pager.totalCnt = response.data.data.totalCnt;
            }
            catch (error) {
                console.log(error);
            }
        };
        const openClause = () => {
            isEventclause.value = true;
            getEventClause();
        };
        const clauseModalControl = (type, modalName) => {
            console.log(type, modalName);
            if (modalName === 'isEventclause') {
                if (type === 'modalclose' || type === 'modalcancel') {
                    isEventclause.value = false;
                }

            } else {
                isEventclause.value = false;
            }
        };
        //검색조건에 따른 리스트 재조회
        const reloadList = () => {
            pager.current = 1;
            onChangedPage(pager.current);
            console.log(formData);
            getEventClause();
        };
        //셀렉트박스 선택
        const selectedOptions_list = (value, type) => {
            if (type === 'page') {
                state.pagesize = value;
                clearList(1);
            }
        };
        //리스트 갯수 변경 후 리스트 재 조회
        const clearList = (num) => {
            popupFormData.seEsnChcCd = '';
            popupFormData.searchType = '';
            popupFormData.searchText = '';
            onChangedPage(num);
        };
        //약관 삭제
        const delClause = () => {
            for (const item of state.Clause) {
                let inputName = document.getElementById(item.value);
                if (inputName.checked) {
                    console.log(state.Clause, state.eventClusListTable, state.eventClusList, item.num);
                    state.eventClusListTable = state.eventClusListTable.filter((j, index) => {
                        if (index !== item.num) {
                            return item;
                        }
                    });
                    state.eventClusList = state.eventClusList.filter((j, index) => {
                        if (index !== item.num) {
                            return item;
                        }
                    });
                }
            }
            state.Clause = [];
            console.log(state.Clause, state.eventClusListTable, state.eventClusListTable);
        };
        const onChangeClause = (type, index) => {
            console.log('#' + type);
            let inputName = document.getElementById(type);
            let arrCheck = state.Clause.some(item => item.value === type);
            if (!arrCheck) {
                state.Clause.push({ 'value': type, 'num': index });
            }
        };

        return {
            $Modal,
            dayJS,
            goToPage,
            fileDown,
            fileUploadBanner,
            fileUploadBack,
            fileUploadBottom,
            fileInputMain,
            RoultteAppr,
            isEventclause,
            tableResize,
            isDownShow,
            isPartnerShow,
            isImgShow,
            isRequestShow,
            openModal,
            formData,
            popupFormData,
            pager,
            state,
            onSelectPicker,
            onInitDate,
            fileListUp,
            uploadFile,
            fileListDel,
            onChangeFile,
            onSelectFile,
            regImgUpload,
            onChangeFormData,
            regApiEvent,
            registEvent,
            atndOption,
            changeCount,
            onChageBenefit,
            changeCountType,

            checkValidState,
            onChangedPage,
            reloadList,
            openClause,
            clauseModalControl,
            onChangeClause,
            delClause

        };
    }
};

</script>