<template>
    <section class="temp-section">
        <div class="ui-data-filter">
            <div class="form-item">
                <div class="item">
                    <label>파트너 어드민 구분</label>
                    <span class="input">
                        <span class="dv">
                            <select v-model="formData.adminType" class="custom-select sm">
                                <option v-for="(item, index) in state.adminType" :key="index" :value="item.value">
                                    {{ item.label }}
                                </option>
                            </select>
                        </span>
                    </span>
                </div>

                <div class="item">
                    <label>조회조건</label>
                    <span class="input">
                        <span class="dv">
                            <select v-model="formData.searchType" class="custom-select sm">
                                <option v-for="(item, index) in state.searchType" :key="index" :value="item.value">
                                    {{ item.label }}
                                </option>
                            </select>
                        </span>
                        <span class="dv">
                            <input type="text" v-model="formData.searchText" class="form-control sm"
                                :disabled="formData.searchType === ''">
                        </span>
                    </span>
                </div>
                <div class="btn-filter-set">
                    <button type="button" class="btn btn-sm" @click="onInitDate">
                        <span class="ico-reload sg"></span>
                        <span class="offscreen">초기화</span>
                    </button>
                    <button type="button" class="btn btn-sm" @click="reloadList"><span class="ico-search"></span>검색</button>
                </div>
            </div>
        </div>
        <div class="ui-section flex align-start">
            <div class="ui-section wp-50">
                <subTitleBar :subTitle="'파트너 어드민 목록'">
                    <template #btn>
                        <button type="button" class="btn btn-ss" @click="changeMskgnRlsYn('list')"
                            :disabled="!state.mskgnRlsYn || state.mskgnTried">
                            마스킹해제
                        </button>
                    </template>
                </subTitleBar>


                <div class="ui-content">
                    <div class="tbl-wrap">
                        <!-- <div id="myGrid" class="ag-theme-alpine"></div> -->
                        <NoData v-if="state.adminMemberList.length === 0" :nodatatext="'조회된 데이터가 없습니다.'"></NoData>
                        <div v-else ref="agGrid">
                            <AgGridVue :columnDefs="state.tableColum_c" :defaultColDef="state.defaultColDef"
                                :domLayout="state.domLayout" :rowData="state.adminMemberList" class="ag-theme-alpine"
                                style="width:100%" @cell-clicked="onRowSelect">
                            </AgGridVue>
                            <PageNavigation :cntPerPage='pager.size' :itemCount='pager.totalCnt'
                                :currentPage="pager.current" @changedPage="onChangedPage" />
                        </div>
                    </div>
                </div>
            </div>
            <div class="ui-section wp-50">
                <subTitleBar :subTitle="'메뉴목록'">
                    <template #btn>
                        <button type="button" class="btn btn-ss" @click="changeMskgnRlsYn('menu')"
                            :disabled="!state.mskgnRlsYn1 || state.mskgnTried1">
                            마스킹해제
                        </button>
                    </template>
                </subTitleBar>
                <div class="ui-content">
                    <div class="tbl-wrap">
                        <div class="table-list">
                            <table class="table list">
                                <caption>메뉴목록</caption>
                                <colgroup>
                                    <col style="min-width: 260px; width: auto">
                                    <col style="width: 550px">
                                    <col style="width: 100px">
                                    <col style="width: 170px">
                                </colgroup>
                                <thead>
                                    <tr>
                                        <th scope="col" class="t-left">
                                            <span class="checkbox">
                                                <input id="menuChk1" name="menuGroup" type="checkbox">
                                                <label for="menuChk1">메뉴명</label>
                                            </span>
                                        </th>
                                        <th scope="col">메뉴 상세 권한</th>
                                        <th scope="col">등록자</th>
                                        <th scope="col">등록일시</th>
                                    </tr>
                                </thead>
                            </table>
                            <div class="table-scroller">
                                <table class="table list">
                                    <caption>메뉴목록</caption>
                                    <colgroup>
                                        <col style="min-width: 260px; width: auto">
                                        <col style="width: 550px">
                                        <col style="width: 100px">
                                        <col style="width: 170px">
                                    </colgroup>
                                    <tbody>
                                        <template v-for="(item, i) in state.adminMenuList" :key="i">
                                            <PermissionMenu :formData="item" :updateAllCheck="state.updateAllCheck" :dep="0"
                                                :index="i" @formDataChange="formDataChange" />
                                            <template v-if="item.list">
                                                <template v-for="(item, j) in item.list" :key="j">
                                                    <PermissionMenu :parentData="state.adminMenuList[i]" :formData="item"
                                                        :dep="2" :index="`${i}${j}`" @formDataChange="formDataChange" />
                                                    <template v-if="item.list">
                                                        <template v-for="(item, k) in item.list" :key="k">
                                                            <PermissionMenu :parentData="state.adminMenuList[i].list[j]"
                                                                :formData="item" :dep="3" :index="`${i}${j}${k}`"
                                                                @formDataChange="formDataChange" />
                                                            <template v-if="item.list">
                                                                <template v-for="(item, l) in item.list" :key="l">
                                                                    <PermissionMenu
                                                                        :parentData="state.adminMenuList[i].list[j].list[k]"
                                                                        :formData="item" :dep="4"
                                                                        :index="`${i}${j}${k}${l}`"
                                                                        @formDataChange="formDataChange" />
                                                                </template>
                                                            </template>
                                                        </template>
                                                    </template>
                                                </template>
                                            </template>
                                        </template>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                    <div class="btn-bottom-set flex justify-center">
                        <button type="button" class="btn btn-sl posi" @click="updateMenuRole"
                            :disabled="!state.admnSn || state.updateMenuRoleList.length === 0">저장</button>
                    </div>
                </div>
            </div>
        </div>
    </section>
</template>
<script>
import { computed, reactive, onMounted, inject, ref, onUnmounted, watch } from 'vue';
import { _getAdminMember, _getAdminMenuList, _updateAdminMenuRole } from '@/api/permission';
import { authCommFunc } from '@/core/helper/authComm.js';
import { useStore } from 'vuex';

import DefaultModal from '@/plugins/modal/modal/DefaultModal.vue';
import DateSerch from '@/components/ui/DateSerch.vue';
import SellerSerch from '@/components/ui/SellerSerch.vue';
import PermissionMenu from './components/PermissionMenu.vue';

export default {
    components: { DefaultModal, DateSerch, SellerSerch, PermissionMenu },
    setup() {
        const store = useStore();
        const $Modal = inject('$Modal');
        const dayJS = inject('dayJS');
        const initColum = ref([
            { headerName: '번호', field: 'no', valueGetter: 'node.rowIndex + 1', maxWidth: 100 },
            { headerName: '파트너어드민', field: 'admnPtnrTyCdNm', flex: 1 },
            { headerName: '파트너명', field: 'ntprNm', flex: 1 },
            { headerName: '레벨', field: 'authSeCdNm', flex: 1 },
            { headerName: '아이디', field: 'admnId', flex: 1 },
            { headerName: '이름', field: 'admnNm', flex: 1 },
            { headerName: '부서명', field: 'admnDepNm', flex: 1 }
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
        const { onChangeMaskingRol, onChangeEditRol } = authCommFunc();
        const menuInfo = computed(() => store.state.getMenuItem.menuInfo);

        const state = reactive({
            // 검색 조건
            adminType: [
                { label: '전체', value: '' },
                { label: 'Payer', value: '111002' },
                { label: 'Seller', value: '111003' },
                { label: 'Medical', value: '111004' },
                { label: 'Developer', value: '111005' }
            ],
            permissionLevel: [
                { label: '전체', value: '' },
                { label: 'Manager', value: '144002' },
                { label: 'Associate Manager', value: '144003' }
            ],
            searchType: [
                { label: '선택', value: '' },
                { label: '이름', value: 'admnNm' },
                { label: '아이디', value: 'admnId' },
                { label: '부서명', value: 'admnDepNm' },
                { label: '파트너명', value: 'ntprNm' }
            ],
            pagesize: 10,
            adminMemberList: [], // 어드민 회원 목록
            adminMenuList: [], // 메뉴목록
            selectedAdmin: null,

            tableColum_c: _.clone(initColum.value),
            // 테이블 옵션
            defaultColDef: {
                sortable: false,
                filter: false,
                resizable: true,
                flex: 1,
                headerClass: 'centered',
                cellClass: 'centered'
            },
            sellerMDList: [],
            gridApi: null,
            gridColumApi: null,
            searchKeyword: '',
            admnSn: null, // 선택 admin ( selected row )
            domLayout: 'autoHeight',
            // 권한레벨
            authTypeList: [
                { label: '전체', value: '' },
                { label: 'Manager', value: 144002 },
                { label: 'Associate Manager', value: 144003 }
            ],
            // 검색조건
            searchTypeList: [
                { label: '선택', value: '' },
                { label: '이름', value: 'admnNm' },
                { label: '아이디', value: 'admnId' },
                { label: '부서명', value: 'admnDepNm' },
                { label: '셀러명', value: 'ntprNm' }
            ],
            // 메뉴권한관리 수정할 항목 List
            updateMenuRoleList: [
                // {
                //     admnSn: 1,
                //     authMnufeaSn: 0,
                //     bscMnuSn: 0,
                //     mnuCd: '1001000',
                //     mnuNm: '회원관리',
                //     uprMnuCd: '0',
                //     uprMnuNm: '회원관리',
                //     auth1RgsYn: 'N',
                //     auth2UpdYn: 'N',
                //     auth3DelYn: 'N',
                //     auth4AprvYn: 'N',
                //     auth5DwnlYn: 'N',
                //     auth6MskgnYn: 'N',
                //     lastUpdrSn: '7'
                // }
            ],

            updateAllCheck: false, // PermissionMenu update all check 확인용,
            mskgnRlsYn: true,
            mskgnTried: false,
            mskgnRlsYn1: true,
            mskgnTried1: false,
            pageType: ''
        });

        // 검색 조건
        const formData = reactive({
            searchType: '', //공지검색구분
            searchText: '', //내용
            maskingReleaseYn: computed(() => state.mskgnRlsYn ? 'Y' : 'N'), // 마스킹 해제 여부
            maskingReleaseYnMenu: computed(() => state.mskgnRlsYn1 ? 'Y' : 'N'), // 마스킹 해제 여부
            page: 0,
            adminType: ''
        });

        onMounted(() => {
            getAdminMemberList();

            emitter.$on('onChangeEdit', onChangeEdit);
            //마스킹 권한 확인 후 리스트조회
            emitter.$on('onChangeMskgn', onChangeMskgn);
        });

        // 마스킹 권한 체크
        const changeMskgnRlsYn = async (type) => {
            state.pageType = type;
            if (!state.mskgnTried || !state.mskgnTried1) {
                await onChangeMaskingRol(menuInfo.value.auth6MaskingYn);
            }
        };
        //마스킹 해제 처리 후 리스트 재조회 
        const onChangeMskgn = async () => {
            if (state.pageType === 'list') {
                state.mskgnRlsYn = !state.mskgnRlsYn;
                await getAdminMemberList();
                state.mskgnTried = true;
            } else {
                state.mskgnRlsYn1 = !state.mskgnRlsYn1;
                await onRowSelect(state.selectedAdmin);
                state.mskgnTried1 = true;
            }

        };



        //메뉴 코드 감지
        watch(formData, async () => {
            console.log('change formData');
            if (state.mskgnTried) {
                state.mskgnRlsYn = true;
            }
        });

        onUnmounted(() => {
            emitter.$off('onChangeEdit');
            emitter.$off('onChangeMskgn');
        });

        /**
         * 수정 권한 체크
         */
        const checkEdit = () => {
            onChangeEditRol(menuInfo.value.auth2UpdateYn);
        };

        /**
         * 수정 권한 체크 callback
         */
        const onChangeEdit = () => {
            // setTermsGroup(); // 등록(수정)
            // resetState(); // validation 상태 초기화
            updateMenuRole();
        };

        // 페이징 처리
        const pager = reactive({
            current: 1,
            currentPageSize: 1,
            size: computed(() => state.pagesize),
            offset: computed(() => (pager.current - 1) * pager.size),
            totalCnt: 0
        });

        // 페이징 처리
        const onChangedPage = (pagenum) => {
            pager.current = pagenum;
            initColum.value[0].valueGetter = 'node.rowIndex + ' + Number(pager.size * (pager.current - 1) + 1);
            getAdminMemberList();
        };

        /**
         * 어드민 회원 목록 조회
         */
        const getAdminMemberList = async () => {
            try {
                let params = {
                    size: pager.size,
                    offset: pager.offset,
                    admnPtnrTyCd: formData.adminType,
                    admnPtalSitCd: '', // 130001(KBHC Admin Portal - All) / 130003(KBHC Admin Portal - Seller) / ... // 사용 안함 (admnPtnrTyCd중복)
                    ptnrpYn: 'Y', // 파트너 여부
                    mskgnRlsYn: formData.maskingReleaseYn
                };
                if (formData.searchType !== '') {
                    params.searchType = formData.searchType;
                    params.searchText = formData.searchText;
                }

                const response = await _getAdminMember(params);

                console.log('>> getAdminMember', response);

                state.adminMemberList = response.data.data.list;
                pager.totalCnt = response.data.data.totalCnt;
                state.mskgnTried1 = false;
            } catch (error) {
                console.log(error);
            }
        };

        /**
         * 메뉴권한관리 메뉴목록 조회
         */
        const getAdminMenuList = async (target) => {
            try {
                state.adminMenuList = [];
                state.updateMenuRoleList = [];
                const rowData = target.data;
                state.admnSn = rowData.admnSn;
                const params = {
                    mskgnRlsYn: formData.maskingReleaseYnMenu,
                    admnSn: state.admnSn // 관리자순번
                    // udtAdmnSn: '' // 로그인관리자순번
                };
                const response = await _getAdminMenuList(params);
                console.log('>> getAdminMenuList', response);
                state.adminMenuList = response.data.data.list;
                state.mskgnTried = false;
            } catch (error) {
                console.log(error);
            }
        };

        // 조회 초기화
        const onInitDate = () => {
            //리스트 재조회
            clearList(1);
            getAdminMemberList();
        };

        const clearList = (num) => {
            formData.searchType = ''; //공지검색구분
            formData.searchText = ''; //내용
            state.mskgnRlsYn = true;// 마스킹 해제 여부
            formData.adminType = ''; // 어드민구분
            formData.authType = ''; // 권한레벨
            formData.page = num;

            onChangedPage(num);
            state.adminMenuList = [];
        };

        const reloadList = () => {
            pager.current = 1;
            onChangedPage(pager.current);

            state.admnSn = null;
            // state.adminMenuList = [];
        };

        const onChangeMasking = () => {
            pager.current = 1;
            formData.maskingReleaseYn = formData.maskingReleaseYn === 'N' ? 'Y' : 'N';
            onChangedPage(pager.current);
        };

        // 셀 선택
        const onRowSelect = (target) => {
            state.admnSn = null;
            state.selectedAdmin = target; // target 저장 refresh 용
            // state.adminMenuList = [];
            getAdminMenuList(target);
        };

        /**
         * 메뉴권한관리 메뉴권한 수정
         */
        const updateMenuRole = async () => {
            try {
                const params = [
                    // {
                    //     admnSn: 1,
                    //     authMnufeaSn: 0,
                    //     bscMnuSn: 0,
                    //     mnuCd: '1001000',
                    //     mnuNm: '회원관리',
                    //     uprMnuCd: '0',
                    //     uprMnuNm: '회원관리',
                    //     auth1RgsYn: 'N',
                    //     auth2UpdYn: 'N',
                    //     auth3DelYn: 'N',
                    //     auth4AprvYn: 'N',
                    //     auth5DwnlYn: 'N',
                    //     auth6MskgnYn: 'N',
                    //     lastUpdrSn: '7'
                    // }
                ];
                console.log('>> _updateAdminMenuRole params', state.updateMenuRoleList);
                const response = await _updateAdminMenuRole(state.updateMenuRoleList);
                console.log('>> updateMenuRole', response);
                toast('저장되었습니다', 2000, 'success');
                onRowSelect(state.selectedAdmin);
            } catch (error) {
                console.log(error);
            }
        };

        /**
         * 메뉴권한수정
         */
        const formDataChange = (data) => {
            console.log('formDataChange', data);
            if (data.list.length > 0) {
                console.log('update all');
                for (let i = 0; i < data.list.length; i++) {
                    if (data.list[i].list.length > 0) {
                        for (let j = 0; j < data.list[i].list.length; j++) {
                            if (data.list[i].list[j].list.length > 0) {
                                for (let k = 0; k < data.list[i].list[j].list.length; k++) {
                                    const changeData = updateData(data.list[i].list[j].list[k]);
                                    updateParamsData(changeData);
                                }
                            } else {
                                const changeData = updateData(data.list[i].list[j]);
                                updateParamsData(changeData);
                            }
                        }
                    } else {
                        const changeData = updateData(data.list[i]);
                        updateParamsData(changeData);
                    }
                }
            } else {
                const changeData = updateData(data);
                updateParamsData(changeData);
            }
        };
        const updateData = (data) => {
            const changeData = {
                admnSn: state.admnSn,
                authMnufeaSn: data.authMnufeaSn, // 권한관리자별메뉴순번 "authMnufeaSn": 113, --> 번호 있으면 update // null이면 insert
                bscMnuSn: data.bscMnuSn, // 기본메뉴순번
                mnuCd: data.mnuCd, // 메뉴코드
                mnuNm: data.mnuNm, // 메뉴명칭
                uprMnuCd: data.uprMnuCd, // 상위메뉴코드
                uprMnuNm: data.uprMnuNm, // 상위메뉴명칭
                // 권한여부
                auth1RgsYn: data.auth1RgsYn,
                auth2UpdYn: data.auth2UpdYn,
                auth3DelYn: data.auth3DelYn,
                auth4AprvYn: data.auth4AprvYn,
                auth5DwnlYn: data.auth5DwnlYn,
                auth6MskgnYn: data.auth6MskgnYn,
                lastUpdrSn: data.lastUpdrSn,
                currentMenuCode: '1010001' // log를 위한 코드값
            };
            return changeData;
        };

        /**
         * update params 존재유무 확인
         * @mnuCd
         */
        const updateParamsData = (data) => {
            console.log('check data', data);
            const isData = state.updateMenuRoleList.filter(d => d.mnuCd === data.mnuCd);
            if (isData.length > 0) state.updateMenuRoleList = state.updateMenuRoleList.map(d => (d.mnuCd === data.mnuCd) ? data : d);
            else state.updateMenuRoleList.push(data);
            console.log('updateParamsData', state.updateMenuRoleList);
            state.updateAllCheck = !state.updateAllCheck;
        };

        return {
            $Modal,
            dayJS,
            state,
            pager,
            initColum,
            formData,
            onChangedPage,
            onInitDate,
            reloadList,
            onChangeMasking,
            onRowSelect,
            formDataChange,
            updateMenuRole,
            changeMskgnRlsYn,

            checkEdit
        };
    }
};

</script>