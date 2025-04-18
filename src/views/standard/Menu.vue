<template>
    <div>
        <DefaultModal :isShow="isPartnerShow" :modalTitle="'파트너 조회'" :buttonConfirm="'닫기'" :buttonCancel="''"
            :modalName="'isPartnerShow'" @modalclose="modalControl">
            <template #modalcontent>
                <PartnerSerch @selectPartner="selectPartner" />
            </template>
        </DefaultModal>
        <div class="ui-code-group">
            <div class="ui-code-tree">
                <div class="ui-code-tree-wrap">
                    <div class="ui-code-tree-head">
                        <div class="ui-code-tree-form">
                            <label for="adminCh">어드민 구분</label>
                            <select id="adminCh" class="custom-select wp-100" @change="onChangeAdminPortalSiteCode"
                                v-model="state.selectedAdminPortalSiteCode">
                                <option v-for="code in adminPortalSiteCodeList" :value="code.cmnCd" :key="code.cmnCd">
                                    {{ code.cmnCdNm }}
                                </option>
                            </select>
                        </div>
                    </div>
                    <div class="ui-code-tree-head">
                        <h3>메뉴목록</h3>
                        <div class="ui-code-tree-search">
                            <input type="text" class="form-control slm wp-80" v-model="state.searchKeyword">
                            <button type="button" class="btn btn-sm wp-20" @click="getMenuTree">
                                <span class="ico-search"></span>
                                검색
                            </button>
                        </div>
                        <div class="ui-code-tree-btn-set">
                            <span class="checkbox">
                                <input id="useMenu" name="useMenuGroup" type="checkbox"
                                    v-model="state.isVisibleOnlyUsingMenu">
                                <label for="useMenu">사용중인 메뉴만 보기</label>
                            </span>
                            <button type="button" class="btn btn-ss" @click.stop="onClickAddMenu">
                                <span class="ico-plus"></span>
                                추가
                            </button>
                            <button type="button" class="btn btn-ss" @click.stop="onClickDeleteMenu">
                                <span class="ico-minus"></span>
                                삭제
                            </button>
                            <button type="button" class="btn btn-ss" @click.stop="foldAll" v-if="isAllUnfolded">
                                전체닫기
                                <span class="ico-all-open right"></span>
                            </button>
                            <button type="button" class="btn btn-ss" @click.stop="unfoldAll" v-else>
                                전체펼침
                                <span class="ico-all-open right"></span>
                            </button>
                        </div>
                    </div>
                    <div class="ui-code-tree-list" @click="onClickBlankBody">
                        <div class="home" v-if="isMenuListFetched">
                            <a href="#" class="target-home">
                                <span class="offscreen">홈</span>
                            </a>
                        </div>
                        <ul class="ui-tree-list">

                            <template v-for="firstDepth in state.menuList" :key="firstDepth.mnuCd">
                                <li :class="['dep-item', isFolded(firstDepth)]"
                                    v-if="!state.isVisibleOnlyUsingMenu ? true : firstDepth.bscMnuUseYn !== 'N'">
                                    <a href="#" :class="['target-item', { on: isSelectedMenu(firstDepth) }]"
                                        @click.stop="() => setSelectedMenu(firstDepth)">
                                        <em :class="isFolded(firstDepth)"
                                            @click.stop="() => onClickFoldToggle(firstDepth)" />
                                        <span :class="{ folder: !isEmptySubList(firstDepth) }">{{ firstDepth.mnuNm }}</span>
                                    </a><!-- 선택시 'on' 클래스 적용 -->
                                    <ul class="dep" v-if="!isEmptySubList(firstDepth)">

                                        <template v-for="secondDepth in firstDepth.subMenuList" :key="secondDepth.mnuCd">
                                            <li :class="['dep-item', isFolded(secondDepth)]">
                                                <a href="#" :class="['target-item', { on: isSelectedMenu(secondDepth) }]"
                                                    @click.stop="() => setSelectedMenu(secondDepth)">
                                                    <em :class="isFolded(secondDepth)"
                                                        @click.stop="() => onClickFoldToggle(secondDepth)" />
                                                    <span :class="{ folder: !isEmptySubList(secondDepth) }">{{
                                                        secondDepth.mnuNm }}</span>
                                                </a>
                                                    <ul class="dep" v-if="!isEmptySubList(secondDepth)">

                                            <template v-for="thirdDepth in secondDepth.subMenuList" :key="thirdDepth.mnuCd">
                                                <li :class="['dep-item', isFolded(thirdDepth)]">
                                                    <a href="#" :class="['target-item', { on: isSelectedMenu(thirdDepth) }]"
                                                        @click.stop="() => setSelectedMenu(thirdDepth)">
                                                        <em :class="isFolded(thirdDepth)"
                                                            @click.stop="() => onClickFoldToggle(thirdDepth)" />
                                                        <span :class="{ folder: !isEmptySubList(thirdDepth) }">{{
                                                            thirdDepth.mnuNm }}</span>
                                                    </a>
                                                    <ul class="dep" v-if="!isEmptySubList(thirdDepth)">

                                                        <template v-for="fourthDepth in thirdDepth.subMenuList"
                                                            :key="fourthDepth.mnuCd">
                                                            <li class="dep-item">
                                                                <a href="#"
                                                                    :class="['target-item', { on: isSelectedMenu(fourthDepth) }]"
                                                                    @click.stop="() => setSelectedMenu(fourthDepth)">
                                                                    <span>{{ fourthDepth.mnuNm }}</span>
                                                                </a>
                                                            </li>
                                                        </template>

                                                    </ul>
                                                </li>
                                            </template>
                                                </ul>
                                            </li>
                                        </template>

                                    </ul>
                                </li>
                            </template>

                        </ul>
                    </div>
                </div>
            </div>
            <div class="ui-code-reg">
                <div class="ui-grid-top-guide">
                    <h3>메뉴상세정보</h3>
                    <p>좌측 트리영역에서 추가할 위치 선택 후, ‘추가‘ 버튼 클릭 시 신규 메뉴그룹 등록이 가능합니다.</p>
                    <div class="abs">
                        <span class="ess"></span> 표시는 필수항목입니다.
                    </div>
                </div>
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
                                <th scope="row">상위메뉴ID</th>
                                <td>
                                    <div class="reg-group inline">
                                        <div class="reg-item">
                                            <input type="text" class="form-control" v-model="state.selectedMenu.uprMnuCd"
                                                readonly>
                                        </div>
                                    </div>
                                </td>
                                <th scope="row">메뉴ID</th>
                                <td>
                                    <div class="reg-group inline">
                                        <div class="reg-item">
                                            <input type="text" class="form-control" v-model="state.selectedMenu.mnuCd"
                                                readonly>
                                        </div>
                                    </div>
                                </td>
                            </tr>
                            <tr>
                                <th scope="row">
                                    메뉴명
                                    <span class="ess">
                                        <span class="offscreen">필수입력</span>
                                    </span>
                                </th>
                                <td colspan="3">
                                    <div class="reg-group">
                                        <div class="reg-item">
                                            <input type="text" class="form-control" v-model="state.selectedMenu.mnuNm">
                                        </div>
                                    </div>
                                </td>
                            </tr>
                            <tr>
                                <th scope="row">
                                    메뉴경로
                                    <span class="ess">
                                        <span class="offscreen">필수입력</span>
                                    </span>
                                </th>
                                <td colspan="3">
                                    <div class="reg-group">
                                        <div class="reg-item">
                                            <span class="radio">
                                                <input id="menuPath1" name="menuPathGroup" type="radio" value="INT"
                                                    v-model="state.selectedMenu.mnuPthSeTyp">
                                                <label for="menuPath1">내부경로</label>
                                            </span>
                                            <span class="radio">
                                                <input id="menuPath2" name="menuPathGroup" type="radio" value="EXT"
                                                    v-model="state.selectedMenu.mnuPthSeTyp">
                                                <label for="menuPath2">외부링크 (새창으로 열기)</label>
                                            </span>
                                        </div>
                                    </div>
                                    <div class="reg-group">
                                        <div class="reg-item">
                                            <input type="text" class="form-control" v-model="state.selectedMenu.mnuUriVl" :readonly="!state.selectedMenu.isNew">
                                        </div>
                                    </div>
                                </td>
                            </tr>
                            <tr>
                                <th scope="row">메뉴설명</th>
                                <td colspan="3">
                                    <div class="reg-group">
                                        <div class="reg-item">
                                            <textarea id="textarea" class="form-control" style="height: 50px"
                                                v-model="state.selectedMenu.mnuDscr" />
                                        </div>
                                    </div>
                                </td>
                            </tr>
                            <tr>
                                <th scope="row">
                                    노출순서
                                    <span class="ess">
                                        <span class="offscreen">필수입력</span>
                                    </span>
                                </th>
                                <td>
                                    <div class="reg-group inline">
                                        <div class="reg-item">
                                            <input type="text" class="form-control" v-model="state.selectedMenu.indnSqn">
                                        </div>
                                        <div class="ui-unit">(1~999)</div>
                                    </div>
                                </td>
                                <th scope="row">Depth</th>
                                <td>
                                    <div class="reg-group inline">
                                        <div class="reg-item">
                                            <input type="text" class="form-control" v-model="state.selectedMenu.depth"
                                                readonly>
                                        </div>
                                        <div class="ui-unit">(1~3)</div>
                                    </div>
                                </td>
                            </tr>
                            <tr>
                                <th scope="row">
                                    사용여부
                                    <span class="ess">
                                        <span class="offscreen">필수입력</span>
                                    </span>
                                </th>
                                <td>
                                    <div class="reg-group inline">
                                        <div class="reg-item">
                                            <select class="custom-select" v-model="state.selectedMenu.bscMnuUseYn">
                                                <option value="Y">사용</option>
                                                <option value="N">미사용</option>
                                            </select>
                                        </div>
                                    </div>
                                </td>
                                <th scope="row">
                                    관리제한
                                    <span class="ess">
                                        <span class="offscreen">필수입력</span>
                                    </span>
                                </th>
                                <td>
                                    <div class="reg-group inline">
                                        <div class="reg-item">
                                            <select class="custom-select" v-model="state.selectedMenu.mngRstSeCd">
                                                <template v-for="code in adminRestrictCodeList" :key="code.cmnCd">
                                                    <template v-if="code.cmnCd === '228001'">
                                                        <option :value="code.cmnCd"
                                                            v-if="state.selectedAdminPortalSiteCode === '130001'">
                                                            {{ code.cmnCdNm }}
                                                        </option>
                                                    </template>
                                                    <template v-else>
                                                        <option :value="code.cmnCd">
                                                            {{ code.cmnCdNm }}
                                                        </option>
                                                    </template>
                                                </template>
                                            </select>
                                        </div>
                                    </div>
                                </td>
                            </tr>
                            <tr>
                                <th scope="row">
                                    권한기능
                                    <span class="ess">
                                        <span class="offscreen">필수입력</span>
                                    </span>
                                </th>
                                <td colspan="3">
                                    <div class="reg-group inline">
                                        <div class="reg-item">
                                            <span class="checkbox">
                                                <input id="auth1RgsYn" type="checkbox" value="auth1RgsYn"
                                                    @input="onChangeAuth" :checked="state.selectedMenu.auth1RgsYn === 'Y'">
                                                <label for="auth1RgsYn">등록</label>
                                            </span>
                                            <span class="checkbox">
                                                <input id="auth2UpdYn" type="checkbox" value="auth2UpdYn"
                                                    @input="onChangeAuth" :checked="state.selectedMenu.auth2UpdYn === 'Y'">
                                                <label for="auth2UpdYn">수정</label>
                                            </span>
                                            <span class="checkbox">
                                                <input id="auth3DelYn" type="checkbox" value="auth3DelYn"
                                                    @input="onChangeAuth" :checked="state.selectedMenu.auth3DelYn === 'Y'">
                                                <label for="auth3DelYn">삭제</label>
                                            </span>
                                            <span class="checkbox">
                                                <input id="auth4AprvYn" type="checkbox" value="auth4AprvYn"
                                                    @input="onChangeAuth" :checked="state.selectedMenu.auth4AprvYn === 'Y'">
                                                <label for="auth4AprvYn">승인</label>
                                            </span>
                                            <span class="checkbox">
                                                <input id="auth5DwnlYn" type="checkbox" value="auth5DwnlYn"
                                                    @input="onChangeAuth" :checked="state.selectedMenu.auth5DwnlYn === 'Y'">
                                                <label for="auth5DwnlYn">다운로드</label>
                                            </span>
                                            <span class="checkbox">
                                                <input id="auth6MskgnYn" type="checkbox" value="auth6MskgnYn"
                                                    @input="onChangeAuth"
                                                    :checked="state.selectedMenu.auth6MskgnYn === 'Y'">
                                                <label for="auth6MskgnYn">마스킹해제</label>
                                            </span>
                                        </div>
                                    </div>
                                </td>
                            </tr>
                            <tr v-if="isPartnerAdminPortal">
                                <th scope="row">
                                    사용가능 파트너
                                    <span class="ess">
                                        <span class="offscreen">필수입력</span>
                                    </span>
                                </th>
                                <td colspan="3">
                                    <div class="reg-group">
                                        <div class="reg-item">
                                            <span class="radio">
                                                <input id="typeAll" name="usePsbPtnrTyp" type="radio" value="ALL"
                                                    v-model="state.selectedMenu.usePsbPtnrTyp">
                                                <label for="typeAll">전체</label>
                                            </span>
                                            <span class="radio">
                                                <input id="typeChc" name="usePsbPtnrTyp" type="radio" value="CHC"
                                                    v-model="state.selectedMenu.usePsbPtnrTyp">
                                                <label for="typeChc">선택</label>
                                            </span>
                                        </div>
                                    </div>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <template v-if="state.selectedMenu.usePsbPtnrTyp === 'CHC'">
                    <div class="ui-grid-top-guide mt-15">
                        <h3>메뉴사용 파트너 목록</h3>
                    </div>
                    <div class="tbl-wrap mt-10">
                        <div class="table-util flex space-between">
                            <div class="btn-set-m flex">
                                <button type="button" class="btn btn-ss">삭제</button>
                                <button type="button" class="btn btn-ss" @click="openModal('isPartnerShow')">등록</button>
                            </div>
                        </div>
                        <AgGridVue :columnDefs="partnerState.tableColum_c" :rowData="partnerState.rowData"
                            :defaultColDef="partnerState.defaultColDef" rowSelection="multiple" :rowHeight="GRID_ROW_HEIGHT"
                            :headerHeight="GRID_HEADER_HEIGHT" class="ag-theme-alpine mt-15"
                            style="width:100%; height: 200px; overflow: hidden;" @cell-clicked="() => { }">
                        </AgGridVue>
                    </div>
                </template>
                <div class="btn-bottom-set flex justify-center">
                    <button type="button" class="btn btn-sl nega" @click="onClickCancel">취소</button>
                    <button type="button" class="btn btn-sl posi" @click="onClickSaveMenu">저장</button>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { computed, inject, onMounted, reactive, watch, watchEffect } from 'vue';
import { _getMenuTree, _deleteMenu, _modifyMenu, _registerMenu } from '@/api/standard';
import { useCommFunc } from '@/core/helper/common';
import DefaultModal from '@/plugins/modal/modal/DefaultModal.vue';
import { AgGridVue } from 'ag-grid-vue3';
import { useStore } from 'vuex';
import { _getPartnerList } from '@/api/common';

const GRID_ROW_HEIGHT = 36;
const GRID_HEADER_HEIGHT = GRID_ROW_HEIGHT + 3;
const GRID_SELECT_COLUMN_WIDTH = 52;

const adminPortalSiteCodeList = [
    { cmnCd: '130001', cmnCdNm: 'KBHC Admin Portal - All' }
    /*
    {cmnCd: '130002', cmnCdNm: 'KBHC Admin Portal - Payer'},
    {cmnCd: '130003', cmnCdNm: 'KBHC Admin Portal - Seller'},
    {cmnCd: '130004', cmnCdNm: 'KBHC Admin Portal - Medical'},
    {cmnCd: '130005', cmnCdNm: 'KBHC Admin Portal - Developer'},
    {cmnCd: '130006', cmnCdNm: 'Partner Admin Portal - Payer'},
    {cmnCd: '130007', cmnCdNm: 'Partner Admin Portal - Seller'},
    {cmnCd: '130008', cmnCdNm: 'Partner Admin Portal - Medical'},
    {cmnCd: '130009', cmnCdNm: 'Partner Admin Portal - Developer'}
    */
];

const adminRestrictCodeList = [
    { cmnCd: '228001', cmnCdNm: 'Master에게만 권한 부여 가능' },
    { cmnCd: '228002', cmnCdNm: 'Manager까지 권한 부여 가능' },
    { cmnCd: '228003', cmnCdNm: '전체 권한 부여 가능' }
];

const store = useStore();
const partnerState = reactive({
    rowData: [],
    tableColum_c: _.clone([
        {
            maxWidth: GRID_SELECT_COLUMN_WIDTH,
            checkboxSelection: true,
            headerCheckboxSelection: true,
            headerCheckboxSelectionFilteredOnly: true
        },
        { headerName: '번호', field: 'ntprSn', flex: 1 },
        { headerName: '파트너명', field: 'ntprNm', flex: 3 },
        { headerName: '기업코드', field: 'ntprUcd', flex: 2 },
        { headerName: '사용자 등록번호', field: 'brn', flex: 3 }
    ]),
    defaultColDef: {
        sortable: true,
        filter: false,
        resizable: true,
        lockPosition: true,
        flex: 1,
        headerClass: 'centered',
        cellClass: 'centered'
    }
});

const emptyMenu = {
    mnuCd: '',
    uprMnuCd: '',
    caps1AdmnPtalSitCd: '',
    mnuNm: '',
    mnuDscr: '',
    indnSqn: 999,
    mnuPthSeTyp: undefined,
    mnuUriVl: '',
    bscMnuUseYn: 'Y',
    mngRstSeCd: '228003',
    auth1RgsYn: 'N',
    auth2UpdYn: 'N',
    auth3DelYn: 'N',
    auth4AprvYn: 'N',
    auth5DwnlYn: 'N',
    auth6MskgnYn: 'N',
    usePsbPtnrTyp: 'ALL',
    depth: 0,
    subMenuList: [],
    isNew: true
};

const partnerAdminPortalSiteCode = new Set(['130006', '130007', '130008', '130009']);

const {
    openModal,
    isPartnerShow
} = useCommFunc();

const selectPartner = (data) => {
    state.partnerName = data;
};

const modalControl = (type, modalName) => {
    if (modalName === 'isPartnerShow') {
        isPartnerShow.value = false;
    }
};

const state = reactive(
    {
        selectedAdminPortalSiteCode: '',
        oldSelectedAdminPortalSiteCode: '',
        menuList: [],
        isVisibleOnlyUsingMenu: false,
        allMenuCode: [],
        foldList: new Set(),
        searchKeyword: '',
        selectedMenu: {},
        previousMenu: {},
        isNotSaved: false,
        isChanged: false,
        uprMnu: {},
        isMenuSelected: false,
        partnerName: {},
        companyList: [],
        maxDepth: 0
    }
);

const isMenuListFetched = computed(() => state.selectedAdminPortalSiteCode !== '');
const isPartnerAdminPortal = computed(() => partnerAdminPortalSiteCode.has(state.selectedAdminPortalSiteCode));

const isEmptySubList = (menu) => menu.subMenuList.length === 0;

const cancelModal = async () => {
    if (state.isNotSaved || state.isChanged && state.isMenuSelected) {
        return !(await isConfirmed('진행중인 작업이 완료되지 않았습니다. 벗어나시겠습니까?'));
    }
};

const isConfirmed = async (message) => {
    try {
        await confirmModal(message);
        return true;
    } catch (error) {
        return false;
    }
};

const getMenuTree = async () => {
    if (state.selectedAdminPortalSiteCode === '') return;

    if (await cancelModal()) {
        state.selectedAdminPortalSiteCode = state.oldSelectedAdminPortalSiteCode;
        return;
    }

    state.foldList.clear();
    state.allMenuCode = [];
    clearSelectedMenu();

    const response = await _getMenuTree(state.selectedAdminPortalSiteCode, state.searchKeyword);
    state.menuList = response.data.data.menuTree;
    state.maxDepth = response.data.data.maxDepth;
    pushCode();

    state.oldSelectedAdminPortalSiteCode = state.selectedAdminPortalSiteCode;
};

const onChangeAdminPortalSiteCode = () => {
    state.searchKeyword = '';
    getMenuTree();
};

const isFolded = menu => isEmptySubList(menu) ? '' : state.foldList.has(menu.mnuCd) ? 'fold' : 'unfold';
const isAllUnfolded = computed(() => state.foldList.size === 0);
const unfoldAll = () => state.foldList.clear();
const foldAll = () => state.allMenuCode.forEach(code => state.foldList.add(code));

const pushCode = (menuList = state.menuList) => {
    for (const menu of menuList) {
        state.allMenuCode.push(menu.mnuCd);
        if (menu.subMenuList.length === 0) continue;
        pushCode(menu.subMenuList);
    }
};

const findMenu = (menuList = state.menuList, mnuCd = state.selectedMenu.mnuCd) => {
    for (const menu of menuList) {
        if (menu.mnuCd === mnuCd) return menu;
        if (menu.subMenuList.length === 0) continue;
        let result = findMenu(menu.subMenuList, mnuCd);
        if (result != null) return result;
    }
};

const setSelectedMenu = async (menu) => {
    if (menu === state.selectedMenu) return;

    if (await cancelModal()) return;

    clearSelectedMenu();

    state.selectedMenu = menu;
    state.isMenuSelected = true;
    deepCopyMenu(state.selectedMenu, state.previousMenu);
};
const isSelectedMenu = menu => menu.mnuCd === state.selectedMenu.mnuCd;
const onClickFoldToggle = menu => state.foldList.has(menu.mnuCd)
    ? state.foldList.delete(menu.mnuCd)
    : state.foldList.add(menu.mnuCd);


const deepCopyMenu = (originalMenu, newMenu) => {
    const menuKeys = Object.keys(originalMenu);
    menuKeys.forEach(key => newMenu[key] = originalMenu[key]);
};

const isChanged = (selectedMenu) => {
    if (!state.isMenuSelected) return false;
    const menuKeys = Object.keys(selectedMenu);
    for (const key of menuKeys) {
        if (state.previousMenu[key] != selectedMenu[key]) return true;
    }
    return false;
};

const onClickBlankBody = async () => {
    if (await cancelModal()) {
        return;
    }
    clearSelectedMenu();
};

const onClickAddMenu = async () => {
    if (state.isNotSaved) return;
    if (!isMenuListFetched.value) return await $Modal.alert({ message: '어드민 구분을 선택해주세요.', buttonText: { ok: '확인' } });
    if (state.selectedMenu.depth === state.maxDepth) return await $Modal.alert({ message: '다음 단계의 메뉴는 생성할 수 없습니다.', buttonText: { ok: '확인' } });

    if (await cancelModal()) {
        // deepCopyMenu(state.previousMenu, state.selectedMenu);
        return;
    }

    state.uprMnu = !state.isMenuSelected ? undefined
        : state.selectedMenu.isNew ? findMenu(undefined, state.selectedMenu.uprMnuCd) : findMenu();

    state.selectedMenu = {
        ...emptyMenu,
        uprMnuCd: state.uprMnu ? state.uprMnu.mnuCd : 0,
        mnuNm: '새 메뉴',
        depth: state.uprMnu ? state.uprMnu.depth + 1 : 1,
        caps1AdmnPtalSitCd: state.selectedAdminPortalSiteCode
    };
    state.isMenuSelected = true;

    state.uprMnu ? state.uprMnu.subMenuList.push(state.selectedMenu) : state.menuList.push(state.selectedMenu);

    state.isNotSaved = true;
};

const onChangeAuth = (e) => {
    state.selectedMenu[e.target.value] = e.target.checked ? 'Y' : 'N';
};

const onClickCancel = () => {
    if (state.isNotSaved) {
        clearSelectedMenu();
    } else {
        deepCopyMenu(state.previousMenu, state.selectedMenu);
    }
};

const onClickSaveMenu = async () => {
    if (!state.isMenuSelected) return;

    if (!(await isConfirmed('저장하시겠습니까?'))) return;

    try {
        const params = JSON.stringify(state.selectedMenu);
        let mnuCd = state.selectedMenu.mnuCd;

        if (state.selectedMenu.isNew) {
            const result = await _registerMenu(params);
            mnuCd = result.data.data;
        } else {
            await _modifyMenu(params);
        }

        await $Modal.alert({ message: '정상적으로 저장되었습니다.', buttonText: { ok: '확인' } });

        clearSelectedMenu();

        await getMenuTree();
        const menu = findMenu(undefined, mnuCd);

        state.selectedMenu = menu;
        state.isMenuSelected = true;
        deepCopyMenu(state.selectedMenu, state.previousMenu);
    } catch (error) {
        await $Modal.alert({ message: '다시 시도해주세요.', buttonText: { ok: '확인' } });
    }
};

const clearSelectedMenu = () => {
    if (state.selectedMenu.isNew) {
        state.uprMnu ? state.uprMnu.subMenuList.pop() : state.menuList.pop();
    } else if (state.isChanged) {
        deepCopyMenu(state.previousMenu, state.selectedMenu);
    }

    state.uprMnu = {};
    state.selectedMenu = {};
    state.previousMenu = {};
    state.isChanged = false;
    state.isNotSaved = false;
    state.isMenuSelected = false;
};

const onClickDeleteMenu = async () => {
    if (!isEmptySubList(state.selectedMenu)) {
        $Modal.alert({ message: '하위메뉴가 존재하여 삭제할 수 없습니다.', buttonText: { ok: '확인' } });
        return;
    }

    if (!(await isConfirmed('삭제하시겠습니까?'))) return;

    try {
        if (!state.selectedMenu.isNew) {
            await _deleteMenu(state.selectedMenu.mnuCd);
            await $Modal.alert({ message: '정상적으로 삭제되었습니다.', buttonText: { ok: '확인' } });
        }
    } catch (error) {
        await $Modal.alert({ message: '다시 시도해주세요.', buttonText: { ok: '확인' } });

    } finally {
        clearSelectedMenu();
        await getMenuTree();
    }
};

watch(() => state.selectedMenu, (value) => {
    state.isChanged = isChanged(value);
}, { deep: true });

watch(() => state.partnerName, () => {
    isPartnerShow.value = false;
});

watchEffect(() => {
    if (state.isVisibleOnlyUsingMenu && state.selectedMenu.bscMnuUseYn === 'N') {
        deepCopyMenu(state.previousMenu, state.selectedMenu);
        state.selectedMenu = {};
        state.previousMenu = {};
        state.isChanged = false;
    }
});

onMounted(async () => {
    const response = await _getPartnerList({ size: 10, offset: 10 });
    partnerState.rowData = response.data.data.list;

    state.selectedAdminPortalSiteCode = adminPortalSiteCodeList[0].cmnCd;
    onChangeAdminPortalSiteCode();
});

watchEffect(() => {
    console.log('state.selectedMenu.usePsbPtnrTyp: ', state.selectedMenu.usePsbPtnrTyp);
});



const $Modal = inject('$Modal');
const confirmModal = async (message) => {
    await $Modal.confirm({
        title: '확인',
        message: message,

        buttonText: {
            confirm: '확인',
            cancel: '취소'
        }
    });
};


</script>

<style>
em.fold,
em.unfold {
    position: absolute;
    left: 0;
    width: 21px;
    height: 21px;
    z-index: 100;
}

/* 스크롤이 두개 나타나는 현상이 있어서, 스크롤바를 감춤 */
.ag-body-viewport::-webkit-scrollbar {
    display: none;
}

.ag-body-viewport {
    scrollbar-width: none !important;
    -ms-overflow-style: none;
}</style>