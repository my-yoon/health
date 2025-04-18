<template>
    <section>
        <!-- 검색 -->
        <div class="ui-data-filter">
            <div class="form-item">
                <div class="item">
                    <label>작성자 타입</label>
                    <span class="input">
                        <span class="dv">
                            <span class="radio" v-for="(item, index) in state.searchOptions.posterType" :key="index">
                                <input :id="'posterType' + index" name="posterType" type="radio" :value="item.value" v-model="state.searchOptions.rgtrOptpTyCd">
                                <label :for="'posterType' + index">{{ item.label }}</label>
                            </span>
                        </span>
                    </span>
                </div>
                <div class="item">
                    <label>이미지 첨부</label>
                    <span class="input">
                        <span class="dv">
                            <span class="radio" v-for="(item, index) in state.searchOptions.imageType" :key="index">
                                <input :id="'imageType' + index" name="imageType" type="radio" :value="item.value" v-model="state.searchOptions.imgEsnYn">
                                <label :for="'imageType' + index">{{ item.label }}</label>
                            </span>
                        </span>
                    </span>
                </div>
                <div class="item">
                    <label>게시 여부</label>
                    <span class="input">
                        <span class="dv">
                            <span class="radio" v-for="(item, index) in state.searchOptions.postingType" :key="index">
                                <input :id="'postingType' + index" name="postingType" type="radio" :value="item.value" v-model="state.searchOptions.pstYn">
                                <label :for="'postingType' + index">{{ item.label }}</label>
                            </span>
                        </span>
                    </span>
                </div>

                <div class="btn-filter-set">
                    <button type="button" class="btn btn-sm" @click="reloadList"><span class="ico-search"></span>조회</button>
                    <button type="button" class="btn btn-sm" @click="clearList(1)">
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
                        <label>대상</label>
                        <span class="input">
                            <span class="dv">
                                <span class="radio" v-for="(item, index) in state.searchOptions.targetType" :key="index">
                                    <input :id="'targetType' + index" name="targetType" type="radio" :value="item.value" v-model="state.searchOptions.trgTyCd">
                                    <label :for="'targetType' + index">{{ item.label }}</label>
                                </span>
                            </span>
                            <span class="dv">
                                <input type="text" class="form-control" v-model="state.searchOptions.mbrGrpNm" @click="openSelectGroup" :disabled="state.searchOptions.trgTyCd !== '378002'">
                                <button type="button" class="btn btn-sm" @click="openSelectGroup" :disabled="state.searchOptions.trgTyCd !== '378002'">
                                    <span class="txt">그룹검색</span>
                                </button>
                            </span>
                        </span>
                    </div>
                </div>
                <div class="form-item">
                    <div class="item">
                        <label>키워드</label>
                        <span class="input">
                            <span class="dv">
                                <select class="custom-select sm" v-model="state.searchOptions.searchType">
                                    <option v-for="(item, index) in state.searchOptions.keywordType" :key="index" :value="item.value">
                                        {{ item.label }}
                                    </option>
                                </select>
                            </span>
                            <span class="dv">
                                <input type="text" class="form-control sm" v-model="state.searchOptions.searchText">
                            </span>

                        </span>
                    </div>
                    
                </div>
            </div>

        </div>
        <div class="tbl-wrap">
            <div class="table-util flex space-between">
                <div class="btn-set-m flex">
                    <!-- <button type="button" class="btn btn-ss" @click="checkDel">
                        미사용
                    </button> -->
                    <button type="button" class="btn btn-ss" @click="checkRegist">등록</button>
                    <button type="button" class="btn btn-ss" @click="openModalOrder">노출 순서 변경</button>
                </div>
                <div class="btn-set-m flex align-end">
                    <span class="table-total">조회결과 총 <strong>{{ pager.totalCnt }}</strong>건</span>
                    <!-- <button type="button" class="btn btn-opt" @click="onChangeDownRol(menuInfo.auth5DownloadYn, 'Y', exelParams)">
                        <span class="ico-download"></span>파일다운로드
                    </button> -->
                    <selectBox :selectType="'page'" @changedValue="selectedOptions" />

                    <button type="button" class="btn btn-opt-ico fit" @click="tableResize">
                        <span class="offscreen">컬럼 리사이징</span>
                    </button>
                    <button type="button" class="btn btn-opt-ico filter full" @click="resetTable">
                        <span class="offscreen">컬럼 셋팅</span>
                    </button>
                </div>
            </div>
            <columlist :columlists="initColum" @checkColum="checkOptions" />
            <NoData :nodatatext="'조회된 데이터가 없습니다.'" v-if="state.categoryList.length === 0"></NoData>
            <div v-else>
                <AgGridVue
                    :columnDefs="state.tableColum_c"
                    :defaultColDef="state.defaultColDef"
                    :rowData="state.categoryList"
                    :domLayout="'autoHeight'"
                    class="ag-theme-alpine"
                    style="width:100%"
                    @grid-ready="onGridReady"
                />
                <PageNavigation :cntPerPage='pager.size' :itemCount='pager.totalCnt' :currentPage="pager.current"
                    @changedPage="onChangedPage" />
            </div>
        </div>

        <!-- 카테고리 등록 -->
        <DefaultModal :isShow="isShowCategory" :modalName="'isShowCategory'" :modalTitle="'카테고리 설정'" :buttonConfirm="'저장'" :buttonCancel="'취소'" :className="'full'" @modalclose="modalControl">
            <template #modalcontent>
                <div>
                    <div class="ui-grid-top-guide t-right">
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
                                    <th scope="row">카테고리 명<span class="ess"><span class="offscreen">필수입력</span></span></th>
                                    <td>
                                        <div class="reg-group">
                                            <div class="reg-item">
                                                <input type="text" :class="['form-control', { error: checkValidState('ctgrNm') }]" v-model="state.formData.ctgrNm" />
                                            </div>
                                        </div>
                                        <span v-if="checkValidState('ctgrNm')" class="input-guide" :class="{ 'error': checkValidState('ctgrNm') }">
                                            {{ state.validState.message }}
                                        </span>
                                    </td>
                                    <th scope="row">게시 여부<span class="ess"><span class="offscreen">필수입력</span></span></th>
                                    <td>
                                        <div>
                                            <template v-for="(item, index) in state.searchOptions.postingType" :key="index">
                                                <span class="radio" v-if="item.value !== ''">
                                                    <input :id="'formPostingType' + index" name="formPostingType" type="radio" :value="item.value" v-model="state.formData.pstYn">
                                                    <label :for="'formPostingType' + index">{{ item.label }}</label>
                                                </span>
                                            </template>
                                        </div>
                                    </td>
                                </tr>
                                <tr>
                                    <th scope="row">카테고리 코드<span class="ess"><span class="offscreen">필수입력</span></span></th>
                                    <td colspan="3">
                                        <div class="reg-group">
                                            <div class="reg-item">
                                                <input type="text" :class="['form-control', { error: checkValidState('ctgrCd') }]" v-model="state.formData.ctgrCd" />
                                            </div>
                                        </div>
                                        <span class="input-guide" :class="{ 'error': checkValidState('ctgrCd') }">8~16자 이내의 영어 대,소문자 또는 숫자를 입력하세요. (카테고리 코드는 생성 이후 수정할 수 없습니다.)</span>
                                    </td>
                                </tr>
                                <tr>
                                    <th scope="row">소개 문구<span class="ess"><span class="offscreen">필수입력</span></span></th>
                                    <td colspan="3">
                                        <div class="reg-group">
                                            <div class="reg-item">
                                                <textarea id="formData_textarea" v-model="state.formData.ctgrIntrdCts" :class="['form-control', { error: checkValidState('ctgrIntrdCts') }]" placeholder="" style="height: 60px">
                                                </textarea>
                                            </div>
                                        </div>
                                        <span v-if="checkValidState('ctgrIntrdCts')" class="input-guide" :class="{ 'error': checkValidState('ctgrIntrdCts') }">
                                            {{ state.validState.message }}
                                        </span>
                                    </td>
                                </tr>
                                <tr>
                                    <th scope="row">대상<span class="ess"><span class="offscreen">필수입력</span></span></th>
                                    <td colspan="3">
                                        <div class="reg-group">
                                            <div class="reg-item">
                                                <template v-for="(item, index) in state.searchOptions.targetType" :key="index">
                                                    <span class="radio" v-if="item.value !== ''">
                                                        <input :id="'formTargetType' + index" name="formTargetType" type="radio" :value="item.value" v-model="state.formData.trgTyCd">
                                                        <label :for="'formTargetType' + index">{{ item.label }}</label>
                                                    </span>
                                                </template>
                                                <!-- {{ state.formData.trgTyCd }} -->
                                                <button type="button" class="btn btn-sm" @click="openModalMember" :disabled="state.formData.trgTyCd !== '378002'">선택</button>
                                            </div>
                                        </div>
                                        <template v-if="state.formData.trgTyCd === '378002'">
                                            <MemberList :memberlist="state.memberListTable" @onChangeMember="onChangeMember" v-if="state.memberListTable.length > 0" />
                                        </template>
                                    </td>
                                </tr>
                                <tr>
                                    <th scope="row">작성자 타입<span class="ess"><span class="offscreen">필수입력</span></span></th>
                                    <td>
                                        <div class="form-item">
                                            <template v-for="(item, index) in state.searchOptions.posterType" :key="index">
                                                <span class="radio" v-if="item.value !== ''">
                                                    <input :id="'formPosterType' + index" name="formPosterType" type="radio" :value="item.value" v-model="state.formData.rgtrOptpTyCd">
                                                    <label :for="'formPosterType' + index">{{ item.label }}</label>
                                                </span>
                                            </template>
                                        </div>
                                    </td>
                                    <th scope="row">이미지 첨부<span class="ess"><span class="offscreen">필수입력</span></span></th>
                                    <td>
                                        <div class="form-item">
                                            <template v-for="(item, index) in state.searchOptions.imageType" :key="index">
                                                <span class="radio" v-if="item.value !== ''">
                                                    <input :id="'formImageType' + index" name="formImageType" type="radio" :value="item.value" v-model="state.formData.imgEsnYn"
                                                        :disabled="state.categoryOpenType === 'edit' && state.formData.imgEsnYn === 'N'"
                                                    >
                                                    <label :for="'formImageType' + index">{{ item.label }}</label>
                                                </span>
                                            </template>
                                        </div>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </template>
        </DefaultModal>
        <!-- 회원그룹 선택 -->
        <DefaultModal :isShow="isShowGroup" :modalName="'isShowGroup'" :modalTitle="'카테고리 설정'" :buttonConfirm="'확인'" :className="'full'" @modalclose="modalControl">
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
                                            <select class="custom-select" v-model="state.searchOptionsGrp.cnSercSe">
                                                <option :value="item.value" v-for="( item, index ) in  state.searchOptionsGrp.searchType" :key="index">
                                                    {{ item.label }}
                                                </option>
                                            </select>
                                        </span>
                                        <span class="dv">
                                            <input type="text" class="form-control" v-model="state.searchOptionsGrp.cnSercCts"
                                                :disabled="state.searchOptionsGrp.cnSercSe === ''">
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
                                <span class="table-total">조회결과 총 <strong>{{ grpPager.totalCnt }}</strong>건</span>
                            </div>
                        </div>
                        <NoData :nodatatext="'조회된 데이터가 없습니다.'" v-if="state.memberGroup.length == 0"></NoData>
                        <div v-else>
                            <AgGridVue :columnDefs="state.tableColum_m" :rowData="state.memberGroup"
                                :defaultColDef="state.defaultColDef" class="ag-theme-alpine" :domLayout="'autoHeight'" style="width:100%">
                            </AgGridVue>
                            <PageNavigation :cntPerPage='grpPager.size' :itemCount='grpPager.totalCnt' :currentPage="grpPager.current" @changedPage="onChangedPageGrp" />
                        </div>
                    </div>
                </div>
            </template>
        </DefaultModal>
        <!-- 노출순서변경 -->
        <DefaultModal :buttonCancel="'취소'" :buttonConfirm="'저장'" :isShow="isShowOrder"
            :modalName="'isShowOrder'" :modalTitle="'노출순서변경'" @modalclose="modalControl" :className="'full'">
            <template #modalcontent>
                <CategoryOrder @onChangeOrder="onChangeOrder" />
            </template>
        </DefaultModal>

    </section>
</template>

<script>
import { computed, reactive, inject, onMounted, onUnmounted, ref, watch } from 'vue';
// import DateSerch from '@/components/ui/DateSerch.vue';
import DefaultModal from '@/plugins/modal/modal/DefaultModal.vue';
import MemberList from './components/MemberList.vue';
import CategoryOrder from './components/CategoryOrder.vue';
import { useCommFunc } from '@/core/helper/common.js';
import { authCommFunc } from '@/core/helper/authComm.js';
import { useStore } from 'vuex';
import { _upDateMessage, _registMessage, _setUnused } from '@/api/standard.js';
import { _getCommunityCategory, _getMemberGroup, _createCategory, _modifyCategory, _modifyCategoryOrder, _getCategoryDetail, _deleteCategory } from '@/api/service.js';

export default {
    components: { DefaultModal, MemberList, CategoryOrder },
    setup() {
        const $Modal = inject('$Modal');
        const store = useStore();
        
        const { goToPage, tableResize } = useCommFunc();
        const { onChangeRegistRol, onChangeEditRol, onChangeDelRol, onChangeDownRol } = authCommFunc();
        const menuInfo = computed(() => store.state.getMenuItem.menuInfo);
        
        const isShowCategory = ref(false); // 카테고리 등록
        const isShowGroup = ref(false); // 그룹선택
        const isShowOrder = ref(false); // 노출순서변경
        const initColum = ref([
            { headerName: '번호', field: 'no', maxWidth: 80, valueGetter: 'node.rowIndex + 1' },
            { headerName: '순서', field: 'srtSqn', maxWidth: 80 },
            { headerName: '카테고리', field: 'ctgrNm' },
            { headerName: '소개문구', field: 'ctgrIntrdCts' },
            { headerName: '컨텐츠 수', field: 'cmnyCnt' },
            { headerName: '대상', field: 'trgTyCdNm' },
            { headerName: '작성자 타입', field: 'rgtrOptpTyCdNm' },
            { headerName: '이미지 첨부', field: 'imgEsnYn' },
            { headerName: '게시 여부', field: 'pstYn' },
            { headerName: '등록일시', field: 'fstRgsDt' },
            {
                headerName: '수정/삭제',
                field: 'ctgrIntrdCts',
                cellRenderer: (params) => {
                    // console.log(params.data.iclusYn);
                    // const template = `<input type="checkbox" false-value="N" true-value="Y" value="${params.data.iclusYn}" ${params.data.iclusYn === 'Y' ? 'checked' : ''} id="event-${params.node.rowIndex}" />`;
                    const template = `
                        <button type="button" class="btn btn-ss" id="btn-edit-${params.node.rowIndex}">수정</button>
                        <button type="button" class="btn btn-ss" id="btn-delete-${params.node.rowIndex}">삭제</button>
                    `;

                    const target = document.createElement('div');
                    target.innerHTML = template;
                    const editTarget = target.querySelector(`#btn-edit-${params.node.rowIndex}`);
                    editTarget.addEventListener('click', (e) => {
                        console.log('edit', params.data.ctgrMngSn);
                        state.categoryOpenTarget = params.data.ctgrMngSn;
                        checkEdit();
                    });
                    const deleteTarget = target.querySelector(`#btn-delete-${params.node.rowIndex}`);
                    deleteTarget.addEventListener('click', (e) => {
                        console.log('delete', params.data.cmnyCnt);
                        if (params.data.cmnyCnt > 0) {
                            $Modal.confirm({
                                title: '',
                                message: '컨텐츠가 있는 카테고리는 삭제할 수 없습니다. 컨텐츠 관리에서 카테고리 이동 후 다시 시도하세요.',
                                buttonText: {
                                    confirm: '확인'
                                }
                            })
                                .then(success => {
                                    if (success === 'confirm') {
                                        // deleteCategory();
                                    }
                                })
                                .catch(error => {
                                    console.log(error);
                                });
                        } else {
                            state.categoryOpenTarget = params.data.ctgrMngSn;
                            checkDel();
                        }
                    });
                    return target;
                }
            }
        ]);
        const initColum_member = ref([
            { headerName: '그룹명', field: 'mbrGrpNm' },
            { headerName: '그룹설명', field: 'mbrGrpDscr' },
            { headerName: '그룹회원수', field: 'mbrGrpTgpCnt', maxWidth: 120 },
            {
                headerName: '선택',
                maxWidth: 90,
                cellRenderer: (params) => {
                    const tagString = `<button type="button" class="btn btn-ss" id="memberselect-${params.node.rowIndex}">선택</button>`;
                    const buttonTarget = document.createElement('div');
                    buttonTarget.innerHTML = tagString;
                    const buttonEventTarget = buttonTarget.querySelector(`#memberselect-${params.node.rowIndex}`);
                    buttonEventTarget.addEventListener('click', () => {
                        console.log('member select');
                        if (state.categoryOpenType === 'regist' || state.categoryOpenType === 'edit') { // regist
                            console.log(params.data);
                            // state.memberListTable.push(params.data);
                            state.memberListTable.splice(params.node.rowIndex, 1, params.data);
                        } else { // search
                            state.searchOptions.mbrGrpNm = params.data.mbrGrpNm;
                            state.searchOptions.mbrGrpSn = params.data.mbrGrpSn;
    
                            isShowGroup.value = false;
                        }
                    });
                    return buttonTarget;
                }
            }
        ]);

        const state = reactive({
            tableColum_c: _.clone(initColum.value),
            tableColum_m: _.clone(initColum_member.value),
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
            openMore: false,
            // download: { pass: '', reason: '' },
            searchOptions: {
                rgtrOptpTyCd: '', // 등록자공개유형코드(376001:프로필공개/376002:익명)
                imgEsnYn: '', // 이미지필수여부(Y: 필수/N: 선택)
                pstYn: '', // 게시여부(Y: 공개/N: 비공개)
                trgTyCd: '', // 대상유형코드(378001:모든 사용자/378002:회원 그룹 선택)
                mbrGrpSn: '', // 회원그룹순번
                mbrGrpNm: '', // 회원그룹명
                searchType: 'ctgrNm', // 조회조건 ctgrNm(카테고리명)/ctgrCd(카테고리코드)
                searchText: '', // 조회조건값

                posterType: [
                    { label: '전체', value: '' },
                    { label: '공개', value: '376001' },
                    { label: '익명', value: '376002' }
                ],
                imageType: [
                    { label: '전체', value: '' },
                    { label: '선택', value: 'N' },
                    { label: '필수', value: 'Y' }
                ],
                postingType: [
                    { label: '전체', value: '' },
                    { label: '공개', value: 'Y' },
                    { label: '비공개', value: 'N' }
                ],
                targetType: [
                    { label: '전체', value: '' },
                    { label: '모든 사용자', value: '378001' },
                    { label: '회원그룹', value: '378002' }
                ],
                keywordType: [
                    { label: '카테고리명', value: 'ctgrNm' },
                    { label: '카테고리 코드', value: 'ctgrCd' }
                ]
            },

            // 검색옵션 group
            searchOptionsGrp: {
                cnSercSe: '',
                cnSercCts: '',

                searchType: [
                    { label: '선택', value: '' },
                    { label: '그룹명', value: 'grpNm' },
                    { label: '그룹설명', value: 'grpDscr' }
                ]
            },

            pagesize: 10,
            categoryList: [],

            editmode: true,
            // messageModalTitle: '메세지 상세/수정',
            // messageModalType: 'detail',
            // unusedList: [],
            gridApi: null,
            gridColumApi: null,

            categoryOpenType: '', // regist: 등록 | edit: 수정 | search: 검색
            categoryOpenTarget: '', // 수정 open target sn (@ctgrMngSn)
            memberGroup: [],
            memberListTable: [], // 등록 > 회원그룹 멤버 (selected)
            selectedGroup: '', // 선택 그룹명
            changeOrderItems: [],
            formData: {
                ctgrMngSn: 0,
                ctgrCd: '', // 카테고리 코드
                ctgrNm: '', // 카테고리 명
                ctgrIntrdCts: '', // 카테고리소개내용
                rgtrOptpTyCd: '376001', // 등록자공개유형코드(376001:프로필공개/376002:익명)
                imgEsnYn: 'N', // 이미지필수여부(Y: 필수/N: 선택)
                pstYn: 'Y', // 게시여부(Y: 공개/N: 비공개)
                ctgrImgMaxCnt: '', // 카테고리이미지최대건수
                trgTyCd: '378001', // 대상유형코드(378001:모든 사용자/378002:회원 그룹 선택)
                mbrGrpSnList: []
                // {
                //     ctgrMngSn: '',
                //     mbrGrpSn: '',
                //     delYn: ''
                // }
            },

            validState: {
                type: '', // validation check ( formData )
                errState: false, // error state
                message: '' // input message
            }

        });

        // 엑셀용 함수
        const exelParams = reactive({
            params: {
                menuCode: computed(() => menuInfo.value.menuCode)
            },
            url: '/common/api/v1/user/userList/excel'

        });

        /**
         * @pager
         */
        const pager = reactive({
            current: 1,
            currentPageSize: 1,
            size: computed(() => state.pagesize),
            offset: computed(() => (pager.current - 1) * pager.size),
            totalCnt: 0
        });
        /**
         * @pager (member group)
         */
        const grpPager = reactive({
            current: 1,
            currentPageSize: 1,
            size: 5,
            offset: computed(() => (grpPager.current - 1) * grpPager.size),
            totalCnt: 0
        });

        watch(() => state.searchOptions.trgTyCd, () => {
            state.searchOptions.mbrGrpNm = '';
            state.searchOptions.mbrGrpSn = '';
        });
        watch(state.formData, () => {
            resetState();
        });

        onMounted(() => {
            // getMessageList();
            getCommunityCategory();

            emitter.$on('onChangeRegist', onChangeRegist);
            emitter.$on('onChangeEdit', onChangeEdit);
            emitter.$on('onChangeDel', onChangeDel);
        });

        onUnmounted(() => {
            emitter.$off('onChangeRegist');
            emitter.$off('onChangeEdit');
            emitter.$off('onChangeDel');
        });

        /**
         * 등록 권한 체크
         */
        const checkRegist = async () => {
            await onChangeRegistRol(menuInfo.value.auth1RegistYn);
        };

        /**
         * 등록 권한 체크 callback
         */
        const onChangeRegist = () => {
            openCategoryModal('regist');
            // goToPage('/cs_center/notice/detail');
        };

        /**
         * 수정 권한 체크
         */
        const checkEdit = async () => {
            await onChangeEditRol(menuInfo.value.auth2UpdateYn);
        };

        /**
         * 수정 권한 체크 callback
         */
        const onChangeEdit = () => {
            // actionBtns(state.pageType);
            openCategoryModal('edit');
        };

        /**
         * 삭제 권한 체크
         */
        const checkDel = async () => {
            await onChangeDelRol(menuInfo.value.auth3DeleteYn);
        };

        /**
         * 삭제 권한 체크 callback
         */
        const onChangeDel = () => {
            $Modal.confirm({
                title: '',
                message: '삭제하시겠습니까?',
                buttonText: {
                    confirm: '확인',
                    cancel: '취소'
                }
            })
                .then(success => {
                    if (success === 'confirm') {
                        deleteCategory();
                    }
                })
                .catch(error => {
                    console.log(error);
                });
        };

        /**
         * community - category 목록 조회
         */
        const getCommunityCategory = async () => {
            try {
                const params = {
                    rgtrOptpTyCd: state.searchOptions.rgtrOptpTyCd, // 등록자공개유형코드(376001:프로필공개/376002:익명)
                    imgEsnYn: state.searchOptions.imgEsnYn, // 이미지필수여부(Y: 필수/N: 선택)
                    pstYn: state.searchOptions.pstYn, // 게시여부(Y: 공개/N: 비공개)
                    trgTyCd: state.searchOptions.trgTyCd, // 대상유형코드(378001:모든 사용자/378002:회원 그룹 선택)
                    mbrGrpSn: state.searchOptions.mbrGrpSn, // 회원그룹순번
                    searchType: state.searchOptions.searchType, // 조회조건 ctgrNm(카테고리명)/ctgrCd(카테고리코드)
                    searchText: state.searchOptions.searchText, // 조회조건값

                    size: pager.size,
                    offset: pager.offset
                    // page: pager.current
                };
                const response = await _getCommunityCategory(params);
                state.categoryList = response.data.data.list;
                pager.totalCnt = response.data.data.totalCnt;

            } catch (error) {
                console.log(error);
            }
        };
        
        // 테이블 리사이징을 위한 참조값
        const onGridReady = (params) => {
            state.gridApi = params.api;
            state.gridColumApi = params.columnApi;
        };

        //페이징 처리 
        const onChangedPage = (num) => {
            pager.current = num;
            //테이블 인덱스 번호 처리
            initColum.value[1].valueGetter = 'node.rowIndex + ' + Number(pager.size * (pager.current - 1) + 1);
            //api호출
            getCommunityCategory();
        };
        //검색조건에 따른 리스트 재조회
        const reloadList = () => {
            pager.current = 1;
            onChangedPage(pager.current);
        };
        //페이징 처리 (group)
        const onChangedPageGrp = (num) => {
            grpPager.current = num;
            //테이블 인덱스 번호 처리
            initColum_member.value[1].valueGetter = 'node.rowIndex + ' + Number(grpPager.size * (grpPager.current - 1) + 1);
            getMemberGroup();
        };
        
        const clearList = (num) => {
            state.searchOptions.rgtrOptpTyCd = ''; // 등록자공개유형코드(376001:프로필공개/376002:익명)
            state.searchOptions.imgEsnYn = ''; // 이미지필수여부(Y: 필수/N: 선택)
            state.searchOptions.pstYn = ''; // 게시여부(Y: 공개/N: 비공개)
            state.searchOptions.trgTyCd = ''; // 대상유형코드(378001:모든 사용자/378002:회원 그룹 선택)
            state.searchOptions.mbrGrpNm = ''; // 회원그룹명
            state.searchOptions.mbrGrpSn = ''; // 회원그룹순번
            state.searchOptions.searchType = 'ctgrNm'; // 조회조건 ctgrNm(카테고리명)/ctgrCd(카테고리코드)
            state.searchOptions.searchText = ''; // 조회조건값
            onChangedPage(num);
            // getTodoCategory();
        };

        // 상세 검색 열기
        const openMoreSerch = () => {
            state.openMore = !state.openMore;
        };

        /**
         * 상세검색 > 회원그룹 선택
         */
        const openSelectGroup = () => {
            state.categoryOpenType = 'search';
            isShowGroup.value = true;
            getMemberGroup();
        };

        /**
         * 등록 팝업 > 회원그룹 선택
         */
        const openModalMember = () => {
            // state.categoryOpenType = 'regist'; // regist | edit (@openCategoryModal 에서 처리)
            isShowCategory.value = false;
            isShowGroup.value = true;
            getMemberGroup();
        };

        /**
         * 노출순서변경 팝업 @open
         */
        const openModalOrder = () => {
            isShowOrder.value = true;
        };

        //회원그룹조회
        const getMemberGroup = async () => {
            try {
                let params = {
                    cnSercSe: state.searchOptionsGrp.cnSercSe,
                    cnSercCts: state.searchOptionsGrp.cnSercCts,

                    size: grpPager.size,
                    offset: grpPager.offset
                };
                const response = await _getMemberGroup(params);
                grpPager.totalCnt = response.data.data.totalCnt;
                state.memberGroup = response.data.data.list;
            } catch (error) {
                console.log(error);
            }
        };

        /**
         * 등록 > 선택 그룹회원 삭제
         */
        const onChangeMember = (value) => {
            if (value.length === state.memberListTable.length) {
                state.memberListTable = [];
                // formData.popupIndnTrgSeGrp = [];
                // formData.popupIndnTrgSeCd = '274005';
            } else {
                value.forEach(item => {
                    state.memberListTable = state.memberListTable.filter(b => value.some(item => item !== b.mbrGrpSn));
                    // formData.popupIndnTrgSeGrp = formData.popupIndnTrgSeGrp.filter(b => value.some(item => item !== b.mbrGrpMngSn));
                });
            }
        };

        // 카테고리 수정 등록 팝업 열기 
        const openCategoryModal = (type) => {
            resetState();
            resetFormData();
            if (type === 'edit') {
                state.categoryOpenType = 'edit';
                isShowCategory.value = true;
                getCategoryDetail();
            } else {
                state.categoryOpenType = 'regist';
                isShowCategory.value = true;
            }

        };

        /**
         * @reset formData
         */
        const resetFormData = () => {
            state.formData = {
                ctgrMngSn: 0,
                ctgrCd: '', // 카테고리 코드
                ctgrNm: '', // 카테고리 명
                ctgrIntrdCts: '', // 카테고리소개내용
                rgtrOptpTyCd: '376001', // 등록자공개유형코드(376001:프로필공개/376002:익명)
                imgEsnYn: 'N', // 이미지필수여부(Y: 필수/N: 선택)
                pstYn: 'Y', // 게시여부(Y: 공개/N: 비공개)
                ctgrImgMaxCnt: '', // 카테고리이미지최대건수
                trgTyCd: '378001', // 대상유형코드(378001:모든 사용자/378002:회원 그룹 선택)
                mbrGrpSnList: []
            };
        };

        /**
         * @regist category
         */
        const createCategory = async () => {
            try {
                const params = {
                    ctgrCd: state.formData.ctgrCd, // 카테고리 코드
                    ctgrNm: state.formData.ctgrNm, // 카테고리 명
                    ctgrIntrdCts: state.formData.ctgrIntrdCts, // 카테고리소개내용
                    rgtrOptpTyCd: state.formData.rgtrOptpTyCd, // 등록자공개유형코드(376001:프로필공개/376002:익명)
                    imgEsnYn: state.formData.imgEsnYn, // 이미지필수여부(Y: 필수/N: 선택)
                    pstYn: state.formData.pstYn, // 게시여부(Y: 공개/N: 비공개)
                    ctgrImgMaxCnt: state.formData.ctgrImgMaxCnt, // 카테고리이미지최대건수
                    trgTyCd: state.formData.trgTyCd, // 대상유형코드(378001:모든 사용자/378002:회원 그룹 선택)
                    mbrGrpSnList: state.memberListTable.map(d => {
                        return {
                            ctgrMngSn: state.formData.ctgrMngSn,
                            mbrGrpSn: d.mbrGrpSn,
                            delYn: 'N'
                        };
                    })
                };
                const response = await _createCategory(params);

                if (response.data.code === 'OK') {
                    getCommunityCategory();
                    toast('저장되었습니다', 2000, 'success');
                }
            } catch (error) {
                console.log(error);
            }
        };

        /**
         * @edit category 수정
         */
        const modifyCategory = async () => {
            try {
                const params = {
                    ctgrMngSn: state.formData.ctgrMngSn,
                    ctgrCd: state.formData.ctgrCd, // 카테고리 코드
                    ctgrNm: state.formData.ctgrNm, // 카테고리 명
                    ctgrIntrdCts: state.formData.ctgrIntrdCts, // 카테고리소개내용
                    rgtrOptpTyCd: state.formData.rgtrOptpTyCd, // 등록자공개유형코드(376001:프로필공개/376002:익명)
                    imgEsnYn: state.formData.imgEsnYn, // 이미지필수여부(Y: 필수/N: 선택)
                    pstYn: state.formData.pstYn, // 게시여부(Y: 공개/N: 비공개)
                    ctgrImgMaxCnt: state.formData.ctgrImgMaxCnt, // 카테고리이미지최대건수
                    trgTyCd: state.formData.trgTyCd, // 대상유형코드(378001:모든 사용자/378002:회원 그룹 선택)
                    mbrGrpSnList: state.memberListTable.map(d => {
                        return {
                            ctgrMngSn: state.formData.ctgrMngSn,
                            mbrGrpSn: d.mbrGrpSn,
                            delYn: 'N'
                        };
                    })
                };
                const response = await _modifyCategory(params);

                if (response.data.code === 'OK') {
                    getCommunityCategory();
                    toast('수정되었습니다', 2000, 'success');
                }
            } catch (error) {
                console.log(error);
            }
        };

        /**
         * @detail category 상세 조회
         */
        const getCategoryDetail = async () => {
            try {
                const params = { ctgrMngSn: state.categoryOpenTarget }; // 카테고리 순번
                const response = await _getCategoryDetail(params);
                console.log(response.data.data);
                const item = response.data.data;
                state.formData = {
                    ctgrMngSn: item.ctgrMngSn,
                    ctgrCd: item.ctgrCd,
                    ctgrNm: item.ctgrNm,
                    ctgrIntrdCts: item.ctgrIntrdCts,
                    rgtrOptpTyCd: item.rgtrOptpTyCd,
                    imgEsnYn: item.imgEsnYn,
                    pstYn: item.pstYn,
                    ctgrImgMaxCnt: item.ctgrImgMaxCnt,
                    trgTyCd: item.trgTyCd
                };
                state.memberListTable = item.mbrGrpInfoList;
            } catch (error) {
                console.log(error);
            }
        };

        /**
         * @delete category 삭제
         */
        const deleteCategory = async () => {
            try {
                const params = { ctgrMngSn: state.categoryOpenTarget }; // 카테고리 순번
                const response = await _deleteCategory(params);
                console.log(response.data.data);
                // const item = response.data.data;
                if (response.data.code === 'OK') {
                    reloadList();
                    toast('삭제되었습니다', 2000, 'success');
                }
            } catch (error) {
                console.log(error);
            }
        };

        // 팝업 닫기
        const modalControl = (type, modalName) => {
            console.log(type);
            if (modalName === 'isShowCategory') {
                if (type === 'modalconfirm') {
                    console.log(state.formData);
                    if (validFormData()) {
                        isShowCategory.value = false;

                        if (state.categoryOpenType === 'regist') {
                            createCategory();
                        } else { // edit
                            modifyCategory();
                        }
                    }
                    // if (state.messageModalType === 'regist') {
                    //     registMessage();
                    // } else {
                    //     checkEdit();
                    //     // upDateMessage();
                    // }
                } else {
                    isShowCategory.value = false;
                }
            } else if (modalName === 'isShowGroup') {
                isShowGroup.value = false;
                if (state.categoryOpenType === 'regist' || state.categoryOpenType === 'edit') {
                    isShowCategory.value = true;
                }
                if (type === 'modalconfirm') {
                    console.log(state.formData);
                }
            } else if (modalName === 'isShowOrder') {
                isShowOrder.value = false;
                // if (state.categoryOpenType === 'regist' || state.categoryOpenType === 'edit') {
                //     isShowCategory.value = true;
                // }
                if (type === 'modalconfirm') {
                    console.log(state.formData);
                    modifyOrder();
                }
            }
        };

        const onChangeOrder = (updateItem) => {
            console.log('노출순서변경', updateItem);
            // state.seqGroup = updateItem;
            state.changeOrderItems = updateItem;
            // resetState();
        };

        /**
         * @modify 노출순서변경
         */
        const modifyOrder = async () => {
            try {
                const params = state.changeOrderItems;
                const response = await _modifyCategoryOrder(params);
                console.log(response.data);
                if (response.data.code === 'OK') {
                    reloadList();
                    toast('수정되었습니다', 2000, 'success');
                }
            } catch (error) {
                console.log(error);
            }
        };

        /**
         * @validate (카테고리 등록/ 수정)
         */
        const validFormData = () => {
            const target = ['ctgrNm', 'ctgrCd', 'ctgrIntrdCts'];
            for (const item of target) {
                // console.log('check check >>', _.isEmpty(state.bizfilelist), formData['bzlcCpAtflSn']);
                state.validState.target = item;

                let msg = '';
                if (item === 'ctgrNm') msg = '카테고리명을 입력해주세요.';
                if (item === 'ctgrCd') msg = '카테고리 코드를 입력해주세요.';
                if (item === 'ctgrIntrdCts') msg = '소개 문구를 입력해주세요.';

                state.validState.message = msg;

                if (_.isEmpty(state.formData[item])) {
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
         * @validation 상태 초기화
         */
        const resetState = () => {
            console.log('reset valide state');
            state.validState.type = ''; // validation
            state.validState.errState = false;
            state.validState.message = '';
        };

        //셀렉트박스 선택
        const selectedOptions = (value, type) => {
            console.log(value, type);
            if (type === 'page') {
                state.pagesize = value;
                clearList(1);
            }
        };

        // 삭제할 컬럼 선택
        const checkOptions = (value) => {
            state.filterCoulm = value;
        };
        
        // 컬럼 변경
        const resetTable = () => {
            const columlist = _.clone(initColum.value);
            state.tableColum_c = columlist.filter(item => !state.filterCoulm.includes(item.headerName));
            return state.filterCoulm;
        };

        return {
            //공통 사용
            $Modal,
            tableResize,
            
            state,
            pager,
            grpPager,
            isShowCategory,
            isShowGroup,
            isShowOrder,
            initColum,
            
            openModalMember,
            openMoreSerch,
            openSelectGroup,
            openModalOrder,
            onGridReady,
            reloadList,
            onChangedPage,
            selectedOptions,
            modalControl,
            checkOptions,
            resetTable,
            onChangeMember,
            onChangeOrder,

            onChangeDownRol,
            exelParams,
            checkRegist,
            checkValidState
        };
    }
};
</script>