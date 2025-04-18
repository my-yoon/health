<template>
    <div>
        <div class="ui-section">
            <subTitleBar :subTitle="state.pageType === 'regist' ? '팝업 관리 등록' : '팝업 관리수정'" :ess="'표시는 필수항목입니다.'" />
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
                                <th scope="row">제목<span class="ess"><span class="offscreen">필수입력</span></span></th>
                                <td colspan="3">
                                    <div class="reg-group wp-100">
                                        <div class="reg-item">
                                            <input type="text" class="form-control" v-model="formData.ttl"
                                                :class="checkValidState('ttl') ? 'error' : ''">
                                        </div>
                                    </div>
                                    <div v-if="checkValidState('ttl')">
                                        <p class="input-guide" :class="{ 'error': state.validState.errState }">
                                            {{ state.validState.message }}
                                        </p>
                                    </div>
                                </td>
                            </tr>
                            <tr>
                                <th scope="row">팝업유형<span class="ess"><span class="offscreen">필수입력</span></span></th>
                                <td colspan="3">
                                    <div class="reg-group">
                                        <div class="reg-item">
                                            <commradio :className="'sm'" :selectType="'searchCode.popupTyCd'"
                                                ref="commbnrTyCd" @changedValue="selectedOptions"
                                                :initData="formData.popupTySeCd" />
                                        </div>
                                    </div>
                                </td>
                            </tr>
                            <tr>
                                <th scope="row">노출 위치<span class="ess"><span class="offscreen">필수입력</span></span></th>
                                <td colspan="3">
                                    <div class="reg-group wp-100">
                                        <div class="reg-item">
                                            <template v-for="( item, index ) in  state.displaylist " :key="index">
                                                <span class="dv">
                                                    <span class="radio">

                                                        <input :id="'bnrIndn' + index" name="bnrIndnGroup" type="radio"
                                                            v-model="formData.popupIndnLctSeCd" :value="item.value"
                                                            @change="onChangeReste">
                                                        <label :for="'bnrIndn' + index">{{ item.label }}</label>
                                                    </span>
                                                </span>
                                            </template>
                                        </div>
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
                                                        :value="item.value" v-model="formData.popupIndnStSeCd">
                                                    <label :for="'display' + index">{{ item.label }}</label>
                                                </span>
                                            </div>
                                            <div class="reg-item" v-if="index === 0">
                                                <span class="dv">
                                                    <dateTimeSingle v-model="state.startDay" :setDay="state.startDay"
                                                        ref="dateTimeSingle1"
                                                        :disabled="!(formData.popupIndnStSeCd === '270005')">
                                                    </dateTimeSingle>
                                                </span>
                                                <span>~</span>
                                                <span class="dv">
                                                    <dateTimeSingle v-model="state.endDay" :setDay="state.endDay"
                                                        ref="dateTimeSingle2"
                                                        :disabled="!(formData.popupIndnStSeCd === '270005')">
                                                    </dateTimeSingle>
                                                </span>
                                            </div>
                                        </template>
                                    </div>

                                </td>
                            </tr>
                            <tr>
                                <th scope="row">팝업 내용<span class="ess"><span class="offscreen">필수입력</span></span></th>
                                <td colspan="3">
                                    <div class="reg-gropup">
                                        <div class="reg-item">
                                            <span class="dv">
                                                <span class="radio" v-for="(item, index) in state.popupCon" :key="index">
                                                    <input :id="'popup' + index" name="popupGroup" type="radio"
                                                        :value="item.value" v-model="state.popupStyle">
                                                    <label :for="'popup' + index">{{ item.label }}</label>
                                                </span>
                                            </span>
                                        </div>
                                    </div>

                                    <template v-if="state.popupStyle === 'text'">
                                        <div class="editor_container mt-20">
                                            <CKEditor :model-value="state.ctsTxt" :editor="ClassicEditor" />
                                        </div>
                                        <div v-if="checkValidState('ctsTxt')">
                                            <p class=" input-guide" :class="{ 'error': state.validState.errState }">
                                                {{ state.validState.message }}
                                            </p>
                                        </div>
                                    </template>

                                    <template v-if="state.popupStyle === 'img'">
                                        <div class="tbl-wrap">
                                            <table class="table reg">
                                                <colgroup>
                                                    <col style="width: 160px;">
                                                    <col style="width: auto;">
                                                </colgroup>
                                                <tbody>
                                                    <tr>
                                                        <th scope="row">이미지 파일<span class="ess"><span
                                                                    class="offscreen">필수입력</span></span>
                                                        </th>
                                                        <td>
                                                            <div class="reg-group">
                                                                <div class="reg-item">
                                                                    <div class="btn-file">
                                                                        <input type="file" id="upload-file" hidden=""
                                                                            ref="bannerImg"
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
                                                                    <span class="name">파일명</span><span
                                                                        class="volume">용량</span>
                                                                </div>

                                                                <div class="upload-file-list"
                                                                    v-if="state.bannerImg.length > 0">
                                                                    <div class="upload-file-list-item flex space-between"
                                                                        v-for="( item, index ) in  state.bannerImg "
                                                                        :key="index">
                                                                        <button type="button" class="btn del btn-secondary"
                                                                            @click="fileListDel('bannerImg')">
                                                                            <span class="offscreen">파일삭제</span>
                                                                        </button>
                                                                        <span class="name">{{ item.name }}</span>
                                                                        <span class="volume">{{ (item.size / (1024 *
                                                                            1024)).toFixed(1) }}
                                                                            MB</span>
                                                                    </div>
                                                                </div>
                                                            </div>

                                                            <div v-if="checkValidState('bannerImg')">
                                                                <p class="input-guide"
                                                                    :class="{ 'error': state.validState.errState }">
                                                                    {{ state.validState.message }}
                                                                </p>
                                                            </div>
                                                        </td>

                                                    </tr>
                                                    <tr>
                                                        <th scope="row">이미지설명<span class="ess"><span
                                                                    class="offscreen">필수입력</span></span></th>
                                                        <td>
                                                            <div class="reg-group wp-100">
                                                                <div class="reg-item">
                                                                    <input type="text" class="form-control"
                                                                        placeholder="텍스트 리더기로 읽을 수 있도록 이미지 내용을 입력하십시오"
                                                                        v-model="formData.imgDscr"
                                                                        :class="checkValidState('imgDscr') ? 'error' : ''">
                                                                </div>
                                                            </div>
                                                            <div v-if="checkValidState('imgDscr')">
                                                                <p class="input-guide"
                                                                    :class="{ 'error': state.validState.errState }">
                                                                    {{ state.validState.message }}
                                                                </p>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <th>랜딩URL</th>
                                                        <td>
                                                            <div class="reg-group inline">
                                                                <div class="reg-item wp-10">
                                                                    <select class="custom-select"
                                                                        v-model="formData.bnrLndSeCd"
                                                                        @change="onInputChagnge('URL', formData.bnrLndSeCd)">
                                                                        <option :value="item.value"
                                                                            v-for="( item, index ) in  state.bnrLndSeCd "
                                                                            :key="index">
                                                                            {{ item.label }}
                                                                        </option>
                                                                    </select>
                                                                </div>
                                                                <div class="reg-item wp-70">
                                                                    <template v-if="formData.bnrLndSeCd === '272007'">
                                                                        <input type="text" class="form-control"
                                                                            v-model="state.eventName.name"
                                                                            :disabled="!(formData.bnrLndSeCd == '272007')">
                                                                    </template>
                                                                    <template v-if="formData.bnrLndSeCd === '272006'">
                                                                        <input type="text" class="form-control"
                                                                            v-model="state.eventName.name"
                                                                            :disabled="!(formData.bnrLndSeCd == '272007')">
                                                                    </template>
                                                                    <template v-if="formData.bnrLndSeCd === '272005'">
                                                                        <input type="text" class="form-control"
                                                                            v-model="state.noticeSn"
                                                                            :disabled="!(formData.bnrLndSeCd == '272007')">
                                                                    </template>
                                                                    <button type="button" class="btn btn-slm"
                                                                        :disabled="formData.bnrLndSeCd == '272007'"
                                                                        @click="onSearchEvent(formData.bnrLndSeCd)">선택</button>
                                                                </div>
                                                                <div class="reg-item wp-10">
                                                                    <select class="custom-select"
                                                                        v-model="formData.bnrLndActionSeCd"
                                                                        v-if="formData.bnrLndSeCd == '272005'">
                                                                        <option :value="item.value"
                                                                            v-for="( item, index ) in  state.bnrLndActionSeCdtype1 "
                                                                            :key="index">
                                                                            {{ item.label }}
                                                                        </option>
                                                                    </select>
                                                                    <select class="custom-select"
                                                                        v-model="formData.bnrLndActionSeCd"
                                                                        v-if="formData.bnrLndSeCd == '272006'">
                                                                        <option :value="item.value"
                                                                            v-for="( item, index ) in  state.bnrLndActionSeCdtype2 "
                                                                            :key="index">
                                                                            {{ item.label }}
                                                                        </option>
                                                                    </select>
                                                                    <select class="custom-select"
                                                                        v-model="formData.bnrLndActionSeCd"
                                                                        v-if="formData.bnrLndSeCd == '272007'">
                                                                        <option :value="item.value"
                                                                            v-for="( item, index ) in  state.bnrLndActionSeCdtype3 "
                                                                            :key="index">
                                                                            {{ item.label }}
                                                                        </option>
                                                                    </select>
                                                                </div>
                                                            </div>

                                                        </td>
                                                    </tr>
                                                </tbody>
                                            </table>

                                        </div>


                                    </template>
                                </td>

                            </tr>
                            <tr>
                                <th scope="row">노출 OS<span class="ess"><span class="offscreen">필수입력</span></span></th>
                                <td colspan="3">
                                    <div class="reg-group">
                                        <div class="reg-item wp-10">
                                            <span class="radio">
                                                <input id="service275003" name="service275000" type="radio" value="275003"
                                                    v-model="formData.indnOsSeCd">
                                                <label for="service275003">전체</label>
                                            </span>
                                            <commradio :className="'sm'" :selectType="'searchCode.indnOsSeCd'"
                                                ref="indnOsSeCdType" @changedValue="selectedOptions"
                                                :initData="formData.indnOsSeCd" />
                                        </div>

                                    </div>
                                </td>
                            </tr>
                            <tr>
                                <th scope="row">노출대상<span class="ess"><span class="offscreen">필수입력</span></span></th>
                                <td colspan="3">
                                    <div class="reg-group">
                                        <div class="reg-item">
                                            <span class="radio" v-for="(item, index) in state.userGroupList" :key="index">
                                                <input :id="'displayuser' + index" name="displayuserGroup" type="radio"
                                                    v-model="formData.popupIndnTrgSeCd" :value="item.value">
                                                <label :for="'displayuser' + index">{{ item.label }}</label>
                                            </span>
                                            <button type="button" class="btn btn-sm" @click="openModalMember"
                                                :disabled="formData.popupIndnTrgSeCd === '274005'">팝업</button>
                                        </div>
                                    </div>
                                    <MemberList :memberlist="state.memberListTable" @onChangeMember="onChangeMember"
                                        v-if="state.memberListTable.length > 0" />
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <div class="ui-table-guide">
                    <span class="input-guide">이미지사이즈<br />
                        <span class="dv"> -전체팝업: 375*626px(2배수 750*1252, 3배수 1125*1878)</span><br />
                        <span class="dv"> -바텀시트팝업: 375*240px(2배수 750*480, 3배수 1125*720)</span><br />
                        <span class="dv"> -레이어팝업: 326*420px(2배수 652*840, 3배수 978*1260)</span>
                    </span>
                    <span class="input-guide">업로드 파일은 최대 200KB입니다.(지원가능 이미지 확장자:jpg, jpeg, png)</span>
                    <span class="input-guide">이미지설명은 시각장애인 텍스트 리더기를 통해 읽을수 있도록 사용하는 목적이므로 가급적 자세히 정보를 입력하십시오</span>
                </div>
            </div>
            <div class="btn-bottom-set flex justify-center">
                <button type="button" class="btn btn-sl nega" @click="goToPage('/display/popup/list')">취소</button>
                <button type="button" class="btn btn-sl posi" @click="actionBtns('regist')"
                    v-if="state.pageType === 'regist'">저장</button>
                <button type="button" class="btn btn-sl posi" @click="actionBtns('edit')"
                    v-if="state.pageType === 'edit'">수정</button>
            </div>
        </div>
        <!-- 이벤트 검색 모달 -->
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
                                            <option :value="item.value" v-for="( item, index ) in  state.eventprogess "
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
        <!-- 공지사항 검색 모달 -->
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
                                            <select class="custom-select" v-model="formData.searchType">
                                                <option :value="item.value"
                                                    v-for="( item, index ) in  state.searchTypeNotice " :key="index">
                                                    {{ item.label }}
                                                </option>
                                            </select>
                                        </span>
                                        <span class="dv">
                                            <input type="text" class="form-control" v-model="formData.searchText"
                                                :disabled="formData.searchType === 'all'">
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
                                    <label>공지 구분</label>
                                    <span class="input">
                                        <commselect ref="noticeCategoryCdBC" :className="'sm'"
                                            :initData="formData.NoticeCategoryCd"
                                            :selectType="'searchCode.noticeCategoryCdBC'" @changedValue="selectedOptions" />
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
                        <NoData :nodatatext="'조회된 데이터가 없습니다.'" v-if="state.noticelist.length == 0"></NoData>
                        <div v-else>
                            <AgGridVue :columnDefs="state.tableColum_n" :rowData="state.noticelist"
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
        <DefaultModal :buttonCancel="'닫기'" :buttonConfirm="''" :isShow="isMemberGroupShow" :modalName="'isMemberGroupShow'"
            :modalTitle="'회원그룹 선택'" @modalclose="modalControl" :className="'full'" class="ui-modal">
            <template #modalcontent>
                <div>
                    <div class="ui-title-3">
                        <h3>회원그룹 선택</h3>
                    </div>
                    <div class="ui-data-filter sm mt-10">
                        <div class="form-item">
                            <div class="form-item">
                                <div class="item">
                                    <label>조건검색</label>
                                    <span class="input">
                                        <span class="dv">
                                            <select class="custom-select" v-model="formData.cnSercSe">
                                                <option :value="item.value" v-for="( item, index ) in  state.searchOptions "
                                                    :key="index">
                                                    {{ item.label }}
                                                </option>
                                            </select>
                                        </span>
                                        <span class="dv">
                                            <input type="text" class="form-control" v-model="formData.cnSercCts"
                                                :disabled="formData.cnSercSe === ''">
                                        </span>
                                    </span>
                                </div>

                            </div>
                            <div class="btn-filter-set">
                                <button type="button" class="btn btn-sm" @click="reloadList"><span
                                        class="ico-search"></span>조회
                                </button>
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
                        <NoData :nodatatext="'조회된 데이터가 없습니다.'" v-if="state.memberGroup.length == 0"></NoData>
                        <div v-else>
                            <AgGridVue :columnDefs="state.tableColum_m" :rowData="state.memberGroup"
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
import { _registExhibitPopup, _getExhibitPopupDetail, _getExhibitEvent, _getMemberGroup } from '@/api/exhibit.js';
import { _getNoticeList } from '@/api/customer.js';
import { _uploadFile } from '@/api/common.js';
import { format } from 'date-fns';
import { initializeEditor } from '@/core/helper/common.js';
import CKEditor from '@ckeditor/ckeditor5-vue';
import ClassicEditor from '@ckeditor/ckeditor5-editor-classic/src/classiceditor';
import MemberList from './components/MemberList.vue';


export default {
    components: {
        DefaultModal,
        dateTimeSingle,
        MemberList,
        'ck-editor': CKEditor.component
    },
    setup() {
        const $Modal = inject('$Modal');
        const dayJS = inject('dayJS');
        const dateTimeSingle1 = ref(null);
        const dateTimeSingle2 = ref(null);
        const isEventShow = ref(null);
        const bannerImg = ref(null);
        const indnOsSeCdType = ref(null);
        const commbnrTyCd = ref(null);
        const isNoticeShow = ref(null);
        const isMemberGroupShow = ref(false);
        const { goToPage, getImageInfo } = useCommFunc();
        let editor;

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
            { headerName: '진행상태', field: 'prgSt', maxWidth: 90 },
            {
                headerName: '이벤트기간',
                field: 'evntBgnDt',
                maxWidth: 160,
                valueGetter: (params) => {
                    return dayJS(params.data.evntBgnDt).format('YYYY-MM-DD') + '~' + dayJS(params.data.evntEndDt).format('YYYY-MM-DD');
                }
            },
            { headerName: '이벤트 코드', field: 'eventSn', maxWidth: 100 },
            {
                headerName: '선택',
                maxWidth: 90,
                cellRenderer: (params) => {
                    const tagString = `<button type="button" class="btn btn-ss" id=eventselect-${params.node.rowIndex}>선택</button>`;
                    const buttonTarget = document.createElement('div');
                    buttonTarget.innerHTML = tagString;
                    const buttonEventTarget = buttonTarget.querySelector(`#eventselect-${params.node.rowIndex}`);
                    buttonEventTarget.addEventListener('click', () => {
                        console.log(params.data);
                        state.eventName.name = '/event/detail/prod/' + params.data.evntSn;
                        state.eventName.sn = params.data.evntSn;
                        isEventShow.value = false;
                    });
                    return buttonTarget;
                }
            }
        ]);

        const initColum_notice = ref([
            {
                headerName: '번호',
                field: 'no',
                maxWidth: 70,
                valueGetter: 'node.rowIndex + 1',
                suppressSizetoFit: true
            },
            {
                headerName: '공지구분',
                field: 'noticeCategoryCd',
                maxWidth: 80,
                valueGetter: (params) => {
                    (params) => {
                        //        
                        if (params.data.noticeCategoryCd === 227006) return '일반';
                        if (params.data.noticeCategoryCd === 227007) return '서비스';
                        if (params.data.noticeCategoryCd === 227008) return '커머스';
                        if (params.data.noticeCategoryCd === 227009) return '메디컬/디벨로퍼';
                        if (params.data.noticeCategoryCd === 227010) return '루틴/커뮤니티/챌린지';
                        if (params.data.noticeCategoryCd === 227011) return '이벤트/프로모션';
                        if (params.data.noticeCategoryCd === 227012) return '기타';
                    };
                }
            },
            { headerName: '제목', field: 'title' },
            { headerName: '작성기업', field: 'corporationName' },
            {
                headerName: '등록일자',
                field: 'createAt',
                maxWidth: 160,
                valueGetter: (params) => {
                    return dayJS(params.data.createAt).format('YYYY-MM-DD');
                }
            },
            {
                headerName: '선택',
                maxWidth: 90,
                cellRenderer: (params) => {
                    const tagString = `<button type="button" class="btn btn-ss" id=eventselect-${params.node.rowIndex}>선택</button>`;
                    const buttonTarget = document.createElement('div');
                    buttonTarget.innerHTML = tagString;
                    const buttonEventTarget = buttonTarget.querySelector(`#eventselect-${params.node.rowIndex}`);
                    buttonEventTarget.addEventListener('click', () => {
                        console.log(params.data.noticeSn);
                        state.eventName.sn = params.data.noticeSn;
                        state.noticeName = params.data.title;
                        state.noticeSn = '/noticeDetail/' + params.data.noticeSn;

                        isNoticeShow.value = false;
                    });
                    return buttonTarget;
                }
            }
        ]);
        const initColum_member = ref([
            {
                headerName: '그룹명',
                field: 'grpNm'
            },
            { headerName: '그룹설명', field: 'grpDscr' },
            { headerName: '그룹회원수', field: 'mbrCnt', maxWidth: 120 },
            {
                headerName: '선택',
                maxWidth: 90,
                cellRenderer: (params) => {
                    const tagString = `<button type="button" class="btn btn-ss" id=memberselect-${params.node.rowIndex}>선택</button>`;
                    const buttonTarget = document.createElement('div');
                    buttonTarget.innerHTML = tagString;
                    const buttonEventTarget = buttonTarget.querySelector(`#memberselect-${params.node.rowIndex}`);
                    buttonEventTarget.addEventListener('click', () => {
                        formData.popupIndnTrgSeGrp.splice(params.node.rowIndex, 1, { 'mbrGrpMngSn': params.data.grpSn, 'mbrGrpMngNm': params.data.grpNm });
                        state.memberListTable.splice(params.node.rowIndex, 1, params.data);
                        console.log(formData.popupIndnTrgSeGrp);
                    });
                    return buttonTarget;
                }
            }
        ]);
        const state = reactive({
            bannerSn: '',
            exhbPopupMngSn: '',
            bannerDetail: {},
            bannerImg: [],
            bannerNum: 0,
            bannerOriginName: '',
            modalMsg: '',
            pageType: '',
            popupStyle: 'text',
            displaylist: [
                {
                    label: '투데이',
                    value: '269023'
                },
                {
                    label: '건강',
                    value: '269024'
                },
                {
                    label: '챌린지',
                    value: '269025'
                },
                {
                    label: '커뮤니티',
                    value: '269026'
                }
            ],
            displayType: [
                { label: '노출', value: '270005' },
                { label: '비노출', value: '270006' }
            ],
            popupCon: [
                { label: '텍스트', value: 'text' },
                { label: '이미지 ', value: 'img' }
            ],
            bnrLndSeCd: [
                { label: '직접입력', value: '272007' },
                { label: '공지사항', value: '272005' },
                { label: '이벤트 ', value: '272006' }
            ],
            //공지사항
            bnrLndActionSeCdtype1: [
                { label: '선택', value: '' },
                { label: '인앱현재창', value: '273011' },
                { label: '인앱새창 ', value: '273012' }
            ],
            //이벤트
            bnrLndActionSeCdtype2: [
                { label: '선택', value: '' },
                { label: '인앱현재창', value: '273014' },
                { label: '인앱새창 ', value: '273015' }
                // { label: '외부새창 ', value: '273003' }
            ],
            //직접입력
            bnrLndActionSeCdtype3: [
                { label: '선택', value: '' },
                { label: '외부새창 ', value: '273019' }
            ],
            userGroupList: [
                { label: '모든사용자', value: '274005' },
                { label: '회원그룹', value: '274006' }
            ],
            searchOptions: [
                { label: '선택', value: '' },
                { label: '그룹명', value: 'grpNm' },
                { label: '그룹설명', value: 'grpDscr' }
            ],
            startDay: new Date(),
            endDay: new Date().getTime() + 3600 * 1000 * 24 * 1,
            eventlist: [],

            validState: {
                errState: false, // error state
                message: '', // input message
                target: ''
            },
            searchOption: [
                { label: '선택', value: '' },
                { label: '이벤트제목', value: 'evntNm' },
                { label: '이벤트코드', value: 'eventSn' },
                { label: '이벤트대상', value: 'evntTrg' }
            ],
            searchType: [
                { label: '선택', value: '' },
                { label: '일반', value: 'GENERAL' },
                { label: '퀴즈', value: 'QUIZ' },
                { label: '룰렛', value: 'ROULETTE' },
                { label: '출석', value: 'ATTENDANCE' }
            ],
            eventprogess: [
                { label: '선택', value: '' }
            ],
            eventName: {
                name: '',
                sn: ''
            },
            ckeditor: ClassicEditor, // 사용 에디터
            ctsTxt: '', // 에디터에 들어갈 데이터
            // editorconfig: EditorOptions.editorConfig, // 에디터 옵션 설정
            //테이블데이터
            tableColum_c: _.clone(initColum),
            tableColum_n: _.clone(initColum_notice),
            tableColum_m: _.clone(initColum_member),

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
            noticelist: [],
            noticeSn: '',
            noticeName: '',
            searchTypeNotice: [
                { label: '전체', value: 'all' },
                { label: '제목', value: 'title' },
                { label: '내용', value: 'content' }
            ],
            memberGroup: [],
            memberListTable: []
        });

        watch(() => state.popupStyle, async () => {
            console.log(state.popupStyle);
            if (state.popupStyle === 'text') {
                setTimeout(() => {
                    initEditor();
                }, 10);
            }
        });

        onMounted(async () => {
            if (route.query.sn) {
                state.exhbPopupMngSn = route.query.exhbPopupMngSn;
                state.pageType = 'edit';
                //수정조회
                await getExhibitPopupDetail();
            } else {
                state.pageType = 'regist';
            }

            editor = await initializeEditor();
            console.log(editor);
            editor.setData(state.ctsTxt);
            editor.model.document.on('change', () => {
                state.ctsTxt = editor.getData();
            });
        });

        const initEditor = async () => {

            editor = await initializeEditor();
            editor.setData(state.ctsTxt);
            editor.model.document.on('change', () => {
                state.ctsTxt = editor.getData();
            });
            // if (state.ctsTxt !== '') {
            // }
        };


        const formData = reactive({
            exhbPopupMngSn: computed(() => state.exhbPopupMngSn ? state.exhbPopupMngSn : ''), //배너관리순번
            mpnSn: computed(() => state.bannerSn ? state.bannerSn : ''), //맵핑순번
            ttl: '', //배너명
            popupTySeCd: '268005', //팝업유형코드 [ 268005:바텀팝업, 268006:레이어팝업, 268007:전면노출팝업 ]
            popupIndnLctSeCd: '269023', //노출위치코드 [ 269023:투데이, 269024:건강, 269025:챌린지, 269026:커뮤니티 ]
            popupIndnStSeCd: '270005', //노출상태코드 [ 270005:노출, 270006:비노출 ]
            popupIndnBgnDt: computed(() => state.startDay), //노출상태가 노출인 경우 노출시작일 입력
            popupIndnEndDt: computed(() => state.endDay), //노출상태가 노출인 경우 노출종료일 입력
            ctsTxtYn: computed(() => state.popupStyle === 'text' ? 'Y' : 'N'), //팝업형식
            ctsTxt: computed(() => state.popupStyle === 'text' ? state.ctsTxt : ''),
            ctsImgYn: computed(() => state.popupStyle === 'img' ? 'Y' : 'N'),
            imgFlSn: computed(() => state.popupStyle === 'img' ? state.bannerNum : ''), //배너이미지(첨부파일순번)
            imgDscr: '', //이미지설명
            indnOsSeCd: '275003', //노출OS [ 275001:iOS, 275002:Android, 275003:전체 ]
            dy1IndnCot: 0,
            popupIndnTrgSeCd: '274005', //노출대상코드 [ 274005:모든사용자, 274006:회원그룹 ]
            popupIndnTrgSeGrp: [
                //노출대상코드가 회원그룹(274003)인 경우 노출대상그룹

            ],
            bnrLndSeCd: '272007',
            bnrLndActionSeCd: '273017',
            bnrLndUrl: computed(() => formData.bnrLndSeCd === '272005' ? state.noticeSn : state.eventName.name), //랜딩 URL 
            lndTrgSn: computed(() => state.eventName.sn ? state.eventName.sn : ''), //랜딩구분코드가 직업입력(272003)이 아닌 경우 해당 순번
            // 랜딩동작구분코드 [
            // 공지사항 = 273011:인앱현재창, 273012:인앱새창
            // 직접입력 = 273017:인앱현재창, 273018:인앱새창, 273019:외부새창(기본브라우저 호출)
            // 이벤트 = 273014:인앱현재창, 273015:인앱새창
            // ],
            searchType: 'all', //조건검색
            searchText: '', //텍스트 검색
            noticeCategoryCd: '', //공지구분
            cnSercSe: '',
            cnSercCts: ''
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
            let target = ['ttl', 'ctsTxt', 'bannerImg', 'imgDscr', 'bnrLndActionSeCd'];
            for (const item of target) {
                state.validState.target = item;
                if (item === 'ttl') {
                    state.validState.message = '제목을 작성해 주세요 ';
                }
                if (_.isEmpty(formData[item]) && (item !== 'bannerImg') && (item !== 'ctsTxt') && (item !== 'imgDscr') && (item !== 'bnrLndUrl') && (item !== 'bnrLndActionSeCd')) {
                    state.validState.errState = true;
                    break;
                }
                if (item === 'bannerImg' && state.bannerImg.length === 0 && state.popupStyle === 'img') {
                    state.validState.message = '배너 이미지를 등록해 주세요';
                    state.validState.errState = true;
                    break;
                }
                if (item === 'ctsTxt' && state.popupStyle === 'text' && _.isEmpty(formData[item])) {
                    state.validState.message = '팝업 내용을 작성해 주세요';
                    state.validState.errState = true;
                    break;
                }
                if (item === 'imgDscr' && state.popupStyle === 'img' && _.isEmpty(formData[item])) {
                    state.validState.message = '배너 이미지 설명을 작성해 주세요';
                    state.validState.errState = true;
                    break;
                }
                if (item === 'bnrLndUrl' && state.popupStyle === 'img' && _.isEmpty(formData[item])) {
                    console.log('>> test ', item, state.eventName.name, state.noticeSn, formData[item]);
                    state.validState.message = '랜딩 URL을 작성해 주세요';
                    state.validState.errState = true;
                    break;
                }
                if (item === 'bnrLndActionSeCd' && state.popupStyle === 'img' && _.isEmpty(formData[item])) {
                    state.validState.message = '노출 방식을 선택해 주세요';
                    state.validState.errState = true;
                    break;
                }
            }
            return !state.validState.errState;
        };
        const checkValidState = (type) => {
            return state.validState.target === type && state.validState.errState;
        };
        //회원그룹조회
        const getMemberGroup = async () => {
            try {
                let params = {
                    cnSercSe: formData.cnSercSe,
                    cnSercCts: formData.cnSercCts
                };
                const response = await _getMemberGroup(params);
                pager.totalCnt = response.data.data.totalCnt;
                state.memberGroup = response.data.data.list;
            } catch (error) {
                console.log(error);
            }
        };
        // 회원그룹 노출대상 삭제
        const onChangeMember = (value) => {
            if (value.length === state.memberListTable.length) {
                state.memberListTable = [];
                formData.popupIndnTrgSeGrp = [];
                formData.popupIndnTrgSeCd = '274005';
            } else {

                value.forEach(item => {
                    state.memberListTable = state.memberListTable.filter(b => value.some(item => item !== b.grpSn));
                    formData.popupIndnTrgSeGrp = formData.popupIndnTrgSeGrp.filter(b => value.some(item => item !== b.mbrGrpMngSn));

                });
            }


        };
        //회원그룹 팝업열기
        const openModalMember = () => {
            isMemberGroupShow.value = true;
            getMemberGroup();
        };
        //배너 상세 조회
        const getExhibitPopupDetail = async () => {
            try {
                let params = state.exhbPopupMngSn;
                const response = await _getExhibitPopupDetail(params);
                state.bannerDetail = response.data.data;
                console.log(state.bannerDetail);
                formData.popupTySeCd = response.data.data.popupTySeCd;
                commbnrTyCd.value.state.selectOption = response.data.data.popupTySeCd;
                formData.popupIndnLctSeCd = response.data.data.popupIndnLctSeCd;
                formData.popupIndnStSeCd = response.data.data.popupIndnStSeCd;
                formData.ttl = response.data.data.ttl;
                state.startDay = response.data.data.popupIndnBgnDt.slice(0, -3);
                state.endDay = response.data.data.popupIndnEndDt.slice(0, -3);
                response.data.data.ctsImgYn === 'Y' ? state.popupStyle = 'img' : '';
                response.data.data.ctsTxtYn === 'Y' ? state.popupStyle = 'text' : '';
                state.ctsTxt = response.data.data.ctsTxt;
                formData.indnOsSeCd = response.data.data.indnOsSeCd;
                indnOsSeCdType.value.state.selectOption = response.data.data.indnOsSeCd;
                formData.bnrLndSeCd = response.data.data.bnrLndSeCd;
                formData.bnrIndnStSeCd = response.data.data.bnrIndnStSeCd;
                console.log(response.data.data.bnrLndSeCd, response.data.data.bnrIndnStSeCd);
                state.bannerSn = response.data.data.mpnSn;
                state.eventName.sn = response.data.data.lndTrgSn;
                if (response.data.data.bnrLndSeCd === '272005') {
                    state.noticeSn = response.data.data.bnrLndUrl;
                } else {
                    state.eventName.name = response.data.data.bnrLndUrl;

                }

                formData.bnrLndActionSeCd = response.data.data.bnrLndActionSeCd;

                state.bannerImg.push({ name: response.data.data.imgFlNm, size: response.data.data.imgFlSize });
                state.bannerOriginName = _.clone(response.data.data.imgFlNm);
                state.bannerNum = response.data.data.imgFlSn;
                formData.imgDscr = response.data.data.imgDscr;
                console.log(state.bannerOriginName);
                console.log(response.data.data, commbnrTyCd.value.searchOption);


            } catch (error) {
                console.log(error);
            }
        };
        // 배너 파일업로드
        const fileListUp = (type) => {
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
                    if (formData.popupTySeCd === '268005') {
                        imgSize = callback.width % 375 !== 0 && callback.height % 240 !== 0;
                        if (callback.fileSize > 200) {
                            massage = '이미지 용량을 확인 해 주세요  권장 용량: 200KB';
                        } else {
                            massage = '이미지 사이즈를 확인해 주세요. 권장 이미지 사이즈 375*240px(2배수 750*480, 3배수 1125*720)';
                        }
                    }
                    if (formData.popupTySeCd === '268006') {
                        imgSize = callback.width % 326 !== 0 && callback.height % 420 !== 0;
                        if (callback.fileSize > 200) {
                            massage = '이미지 용량을 확인 해 주세요  권장 용량: 200KB';
                        } else {
                            massage = '이미지 사이즈를 확인해 주세요. 권장 이미지 사이즈 326*420px(2배수 652*840, 3배수 978*1260)';
                        }
                    }
                    if (formData.popupTySeCd === '268007') {
                        imgSize = callback.width % 375 !== 0 && callback.height % 626 !== 0;
                        if (callback.fileSize > 200) {
                            massage = '이미지 용량을 확인 해 주세요  권장 용량: 200KB';
                        } else {
                            massage = '이미지 사이즈를 확인해 주세요. 권장 이미지 사이즈 375*626px(2배수 750*1252, 3배수 1125*1878)';
                        }
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

                                state[type] = [];
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

        //팝업 등록/ 수정
        const registExhibitPopup = async () => {
            try {
                let paramsComm = {
                    ttl: formData.ttl,
                    popupTySeCd: formData.popupTySeCd,
                    popupIndnLctSeCd: formData.popupIndnLctSeCd,
                    popupIndnStSeCd: formData.popupIndnStSeCd,
                    ctsTxtYn: formData.ctsTxtYn,
                    ctsTxt: formData.ctsTxt,
                    ctsImgYn: formData.ctsImgYn,
                    imgFlSn: formData.imgFlSn,
                    imgDscr: formData.imgDscr,
                    indnOsSeCd: formData.indnOsSeCd,
                    dy1IndnCot: formData.dy1IndnCot,
                    popupIndnTrgSeCd: formData.popupIndnTrgSeCd,
                    popupIndnTrgSeGrp: formData.popupIndnTrgSeGrp,
                    bnrLndSeCd: formData.bnrLndSeCd || '272007',
                    bnrLndActionSeCd: formData.bnrLndActionSeCd || '273017',
                    bnrLndUrl: formData.bnrLndUrl,
                    lndTrgSn: formData.lndTrgSn
                };
                let paramsEdit = {
                    exhbPopupMngSn: formData.exhbPopupMngSn,
                    mpnSn: formData.mpnSn
                };
                if (state.pageType === 'regist') {
                    let params = {
                        ...paramsComm,
                        ...{ popupIndnBgnDt: formData.popupIndnBgnDt + ':00', popupIndnEndDt: formData.popupIndnEndDt + ':59' }
                    };
                    console.log(params);
                    const response = await _registExhibitPopup(params);
                    if (response.data.code === 'OK') {
                        goToPage('/display/popup/list');
                    }
                }
                if (state.pageType === 'edit') {
                    let params = {
                        ...paramsComm,
                        ...{
                            popupIndnBgnDt: formData.popupIndnBgnDt + ':00',
                            popupIndnEndDt: formData.popupIndnEndDt + ':59'
                        },
                        ...paramsEdit

                    };
                    console.log(params, formData.imgFlSn);
                    const response = await _registExhibitPopup(params);
                    if (response.data.code === 'OK') {
                        goToPage('/display/popup/list');
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
            } else if (type === 'popupTyCd') {
                formData.popupTySeCd = valueCode;
            } else if (type === 'noticeCategoryCdBC') {
                formData.noticeCategoryCd = valueCode;
            } else {
                formData[type] = valueCode;
            }
        };
        // 파일삭제 
        // 파일 리스트 삭제 
        const fileListDel = (type) => {
            const target = document.getElementById('upload-file');
            target.value = '';
            state[type] = [];
        };
        //모달창열기 
        const actionBtns = async (type) => {
            console.log(type);
            if (type === 'regist') {
                state.modalMsg = '저장하시겠습니까?';
            }
            if (type === 'edit') {
                state.modalMsg = '수정하시겠습니까?';
            }
            if (validCheck()) {
                console.log('통과');
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
                            if (state.popupStyle === 'img') {
                                await uploadFile('bannerImg');
                            }
                            await registExhibitPopup();
                        }
                        if (type === 'edit') {
                            if (state.bannerOriginName !== state.bannerImg[0].name) {
                                console.log(state.bannerImg);
                                await uploadFile('bannerImg');
                            }
                            await registExhibitPopup();
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
            } else if (modalName === 'isNoticeShow') {
                isNoticeShow.value = false;
                state.openMore = false;
            } else if (modalName === 'isMemberGroupShow') {
                isMemberGroupShow.value = false;
            } else if (!modalName) {
                isEventShow.value = false;
                isNoticeShow.value = false;
                isMemberGroupShow.value = false;
            }
        };
        //공지사항
        const getNoticeList = async () => {
            try {
                let params = {
                    size: pager.size,
                    offset: pager.offset,
                    fromDate: '',
                    toDate: '',
                    inqType: '',
                    searchType: formData.searchType, //조건검색
                    searchText: formData.searchText, //텍스트 검색
                    noticeCategoryCd: formData.noticeCategoryCd, //공지구분
                    noticeTargetCd: '',
                    approvalStatusCd: '135002',
                    exposeTypeCd: '132001',
                    corporationCode: '',
                    fixed: 'N',
                    page: 0
                };

                const response = await _getNoticeList(params);
                state.noticelist = response.data.data.list;
                pager.totalCnt = response.data.data.totalCnt;
                console.log(response);
            } catch (error) {
                console.log(error);
            }
        };

        //이벤트 검색
        const onSearchEvent = (type) => {
            if (type === '272005') {
                isEventShow.value = false;
                isNoticeShow.value = true;
                getNoticeList();
            } else {
                getExhibitEvent();
                isEventShow.value = true;
                isNoticeShow.value = false;
            }

        };
        const initParams = () => {
            formData.cnSercSe = '';
            formData.cnSercCts = '';
            formData.evntTy = '';
            formData.prgSt = '';
            formData.pstYn = '';
            formData.searchText = '';
            formData.searchType = '';
            formData.NoticeCategoryCd = '';

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

            //api호출
            if (formData.bnrLndSeCd === '272005') {
                //테이블 인덱스 번호 처리
                initColum_notice.value[0].valueGetter = 'node.rowIndex + ' + Number(pager.size * (pager.current - 1) + 1);
                getNoticeList();
            } else if (formData.popupIndnTrgSeCd === '274006') {
                getMemberGroup();
            } else {

                //테이블 인덱스 번호 처리
                initColum.value[0].valueGetter = 'node.rowIndex + ' + Number(pager.size * (pager.current - 1) + 1);
                getExhibitEvent();
            }

        };
        //이벤트 조회
        const getExhibitEvent = async () => {
            try {
                let params = {
                    size: pager.size,
                    offset: pager.offset,
                    cnSercSe: formData.cnSercSe,
                    cnSercCts: formData.cnSercCts,
                    evntTy: formData.evntTy,
                    prgSt: formData.prgSt,
                    pstYn: formData.pstYn
                };
                const response = await _getExhibitEvent(params);
                state.eventlist = response.data.data.list;
                pager.totalCnt = response.data.data.totalCnt;
            } catch (error) {
                console.log(error);
            }
        };

        const onInputChagnge = (type, value) => {
            if (type == 'URL') {
                if (value == '272003') state.eventName.name = '';
                // default setting
                console.log(type, value);
                // v-model="formData.bnrLndActionSeCd"
                // 공지사항 = 273011:인앱현재창, 273012:인앱새창
                // 직접입력 = 273017:인앱현재창, 273018:인앱새창, 273019:외부새창(기본브라우저 호출)
                // 이벤트 = 273014:인앱현재창, 273015:인앱새창
                if (value === '272005') {
                    // 공지사항
                    formData.bnrLndActionSeCd = '273011';
                } else if (value === '272006') {
                    // 이벤트
                    formData.bnrLndActionSeCd = '273014';
                } else if (value === '272007') {
                    // 직접입력
                    formData.bnrLndActionSeCd = '273017';
                }
            }
        };

        return {
            //공통 사용
            $Modal,
            dayJS,
            goToPage,
            dateTimeSingle1,
            dateTimeSingle2,
            isNoticeShow,
            isEventShow,
            bannerImg,
            commbnrTyCd,
            indnOsSeCdType,
            state,
            formData,
            pager,
            modalControl,
            actionBtns,
            selectedOptions,
            fileListUp,
            onChangeReste,
            checkValidState,
            onInputChagnge,
            onChangedPage,
            reloadList,
            openMoreSerch,
            onInitDate,
            onSearchEvent,
            openModalMember,
            isMemberGroupShow,
            onChangeMember,
            fileListDel
        };
    }
};
</script>