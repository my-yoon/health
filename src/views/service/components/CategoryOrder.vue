<template>
    <div>
        <!-- <div class="ui-data-filter sm">
            <div class="form-item">
                <div class="form-item">
                    <div class="item">
                        <label>배너유형</label>
                        <span class="input">
                            <span class="dv">
                                <commselect :className="'sm'" :selectType="'searchCode.bnrTyCd'"
                                    @changedValue="selectedOptions" :initData="formData.exhbTyCd" />
                            </span>
                            <span class="dv">
                                <commselect :className="'sm'" :selectType="'searchCode.indnLctSeCd'"
                                        @changedValue="selectedOptions" :initData="formData.indnLctSeCd" />
                            </span>
                            <span class="dv">
                                <div class="reg-item">
                                    <select class="custom-select sm" v-model="formData.indnLctDtlSeCd" :disabled="formData.exhbTyCd === '268002'">
                                        <option value="">전체</option>
                                        <option v-for="(item, index) in state.typePosition[state.selectType]" :value="item.value" :key="index">
                                            {{ item.label }}
                                        </option>
                                    </select>
                                </div>
                            </span>
                        </span>
                    </div>
                    <div class="item">
                        <label>진행상태</label>
                        <span class="input">
                            <span class="dv">
                                <commselect :className="'sm'" :selectType="'searchCode.prgStCd'"
                                    @changedValue="selectedOptions" :initData="formData.prgStCd" />
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
                </div>
            </div>


            <div class="ui-data-filter-more" v-if="state.openMore">
                <div class="form-item">
                    <div class="item">
                        <label>노출대상</label>
                        <span class="input">
                            <span class="dv">
                                <span class="radio"><input id="service274001" name="service274001" type="radio" value=""
                                    v-model="formData.indnTrg"><label for="service274001">전체</label></span>
                            </span>
                        </span>
                    </div>
                </div>
            </div>
        </div> -->
        <div class="flex mt-20">
            <span class="table-total">조회결과 총 <strong>{{ pager.totalCnt }}</strong>건</span>
        </div>
        <NoData :nodatatext="'조회된 데이터가 없습니다.'" v-if="state.categoryList.length === 0"></NoData>
        <div class="ui-dragdrop-menu full mt-10" v-else>
            <!-- {{ state.seqGroup }} -->
            <ul class="ui-dragdrop-list bannerlist">
                <li class="ui-dragdrop-item" v-for="(item, index) in state.categoryList" :key="index">
                    <div class="ui-dragdrop-item-display">
                        <span class="dv num">{{ item.ctgrMngSn }}</span>
                        <span class="dv name"><span class="ui-tag bc1">{{ item.ctgrNm }}</span></span>
                        <span class="dv name">{{ item.ctgrIntrdCts }}</span>
                        <span class="dv page">{{ item.ctgrCd }}</span>
                        <span class="dv pos">{{ item.rgtrOptpTyCdNm }}</span>
                        <span class="dv pos">{{ item.trgTyCdNm }}</span>
                        <span class="dv open">
                            <input type="number" class="form-control" :id="'order' + index" min="1"
                                v-model="state.seqGroup[index].srtSqn"
                                @change="onChangeOrder(state.seqGroup[index].srtSqn, 'order' + index, index)" />
                        </span>
                    </div>
                </li>
            </ul>
            <div v-if="checkValidState('afterSeq')">
                <p class="input-guide" :class="{ 'error': state.validState.errState }">
                    {{ state.validState.message }}
                </p>
            </div>
        </div>
    </div>
</template>

<script>
import { getCurrentInstance, computed, reactive, inject, onMounted, ref, watch } from 'vue';
import { _getCommunityCategory } from '@/api/service.js';

export default {
    setup() {
        const internalInstance = getCurrentInstance();
        const { emit } = getCurrentInstance();

        const state = reactive({
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

            categoryList: [],

            pagesize: 10000,
            seqGroup: [
                {
                    ctgrMngSn: 0,
                    srtSqn: 0
                }
            ],

            validState: {
                errState: false, // error state
                message: '', // input message
                target: ''
            }
        });

        const formData = reactive({
            seqGroup: [
                {
                    ctgrMngSn: 0,
                    srtSqn: 0
                }
            ]
        });

        // 페이징
        const pager = reactive({
            current: 1,
            currentPageSize: 1,
            size: computed(() => state.pagesize),
            offset: computed(() => (pager.current - 1) * pager.size),
            totalCnt: 0
        });

        onMounted(() => {
            getCommunityCategory();
        });

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

                state.seqGroup = [];
                for (let i = 0; i <= (response.data.data.list.length - 1); i++) {
                    let item = {
                        ctgrMngSn: state.categoryList[i].ctgrMngSn,
                        srtSqn: state.categoryList[i].srtSqn
                    };
                    state.seqGroup.push(item);
                }

            } catch (error) {
                console.log(error);
            }
        };
        
        const onChangeOrder = (value, id, index) => {
            console.log('order change', state.seqGroup);
            // let idType = document.querySelector(`#${id}`);
            // state.seqGroup[index].srtSqn = Number(idType.value);

            const changeItems = state.seqGroup.filter((d, i) => state.categoryList[i].srtSqn !== d.srtSqn);
            console.log(changeItems);
            
            emit('onChangeOrder', changeItems);
        };
        
        const checkValidState = (type) => {
            return state.validState.target === type && state.validState.errState;
        };

        return {
            //공통 사용
            pager,
            state,
            formData,
            // initColum,
            // dateSearch,
            // isbannerOrderShow,
            // selectedOptions,
            // onInitDate,
            // openMoreSerch,
            // reloadList,
            checkValidState,
            onChangeOrder


        };
    }
};

</script>

<style scoped>
.bannerlist .ui-dragdrop-item::after {
    display: none;
}
</style>