<template>
    <div>
        <div class="ui-data-filter sm">
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
                                        <!-- <option value="269003">투데이</option>
                                        <option value="269005">건강</option>
                                        <option value="269007">챌린지</option>
                                        <option value="269009">커뮤니티</option> -->
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
                    <button type="button" class="btn btn-sm" @click="openMoreSerch">
                        <span class="txt">상세검색 열기</span>
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
                                <!-- 1차 대상 아님
                                    <commradio :className="'sm'" :selectType="'searchCode.indnTrgPopup'"
                                    @changedValue="selectedOptions" :initData="formData.indnTrg" /> -->
                            </span>
                        </span>
                    </div>
                    <!-- <div class="item">
                        <label>노출상태 </label>
                        <span class="input">
                            <span class="dv">
                                <commselect :className="'sm'" :selectType="'searchCode.indnStCd'"
                                    @changedValue="selectedOptions" :initData="formData.indnStCd" />
                            </span>
                        </span>
                    </div> -->
                </div>
            </div>
        </div>
        <div class="flex mt-20">
            <span class="table-total">조회결과 총 <strong>{{ pager.totalCnt }}</strong>건</span>
        </div>
        <NoData :nodatatext="'조회된 데이터가 없습니다.'" v-if="state.bannerlist.length === 0"></NoData>
        <div class="ui-dragdrop-menu full mt-10" v-else>
            <!-- {{ state.seqGroup }} -->
            <ul class="ui-dragdrop-list bannerlist">
                <li class="ui-dragdrop-item" v-for="(item, index) in state.bannerlist" :key="index">
                    <div class="ui-dragdrop-item-display">
                        <span class="dv num">{{ item.indnSqn }}</span>
                        <span class="dv"><span class="ui-tag bc1">{{ item.bnrTySeNm }}</span></span>
                        <span class="dv page">{{ item.bnrIndnLctSeNm }}</span>
                        <span class="dv pos">{{ item.bnrIndnLctDtlSeNm }}</span>
                        <span class="dv name">{{ item.bnrNm }}</span>
                        <span class="dv img">
                            <img :src="item.imgFlUrl" alt="이벤트 상세 내용">
                        </span>
                        <span class="dv ing">{{ item.bnrPrgStSeNm }}</span>
                        <span class="dv target">{{ item.bnrIndnTrgSeNm }}</span>
                        <span class="dv period">{{ item.bnrIndnBgnDt }} ~ {{ item.bnrIndnEndDt }}</span>
                        <!-- <span class="dv open">{{ item.bnrIndnStSeNm }}</span> -->
                        <span class="dv open">
                            <input type="number" class="form-control" :id="'order' + index" min="1"
                                :value="state.seqGroup[index].afterSeq"
                                @change="onChangeOrder(state.seqGroup[index].afterSeq, 'order' + index, index)" />
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
import { useCommFunc } from '@/core/helper/common.js';
import { format } from 'date-fns';
import { useStore } from 'vuex';
import { _getExhibitOrderList } from '@/api/exhibit.js';

// import DefaultModal from '@/plugins/modal/modal/DefaultModal.vue';
// import DateSerch from '@/components/ui/DateSerch.vue';

export default {
    // components: { DefaultModal, DateSerch },
    setup() {
        const internalInstance = getCurrentInstance();
        const { emit } = getCurrentInstance();
        const $Modal = inject('$Modal');
        // const dayJS = inject('dayJS');
        const store = useStore();
        // const dateSearch = ref(null);
        // const isbannerOrderShow = ref(null);
        // const DownModalConRef = ref(null);
        // const { goToPage } = useCommFunc();

        const state = reactive({
            openMore: false,
            download: { pass: '', reason: '' },
            pagesize: 10000,
            // mskgnRlsYn: false,
            // setDay: '1month',
            // startDay: '',
            // endDay: '',
            bannerlist: [],
            seqGroup: [
                {
                    exhbSn: '', //전시번호
                    beforSeq: '', //변경전 노출순서
                    afterSeq: '' //변경후 노출순서
                }
            ],
            validState: {
                errState: false, // error state
                message: '', // input message
                target: ''
            },
            // menuCode: '1014001',
            typePosition: {
                default: [
                    {label: '투데이(최상단)', value: '269004'},
                    {label: '건강(최상단)', value: '269006'},
                    {label: '챌린지(최상단)', value: '269008'},
                    {label: '커뮤니티(최상단)', value: '269010'}
                ],
                today: [
                    {label: '띠배너1', value: '269013'},
                    {label: '띠배너2', value: '269014'},
                    {label: '띠배너3', value: '269015'}
                ],
                health: [{label: '띠배너1', value: '269017'}],
                challenge: [{label: '띠배너1', value: '269019'}],
                community: [{label: '띠배너1', value: '269021'}]
            },
            /**
             * searchCode.indnLctSeCd 유형 선택에 따른 값으로 typePosition 이 바뀜
             * 메인배너는 해당 없음 / 띠배너일때만 적용
             */
            selectType: 'default'

        });

        const formData = reactive({
            exhbTyCd: '268002', // 전시유형코드 [ 배너유형 : {268002:메인배너, 268003:띠배너} ]
            indnLctSeCd: '', // 노출페이지 [ 배너 : {269003:투데이, 269005:건강, 269007:챌린지, 269009:커뮤니티} ]
            indnLctDtlSeCd: '', // 노출위치 [ 배너 : { 미선택 [269004:투데이(최상단), 269006:건강(최상단), 269008:챌린지(최상단), 269010:커뮤니티(최상단)] 투데이 [269013:띠배너1, 269014:띠배너2, 269015:띠배너3] 건강 [269017:띠배너1] 챌린지 [269019:띠배너1] 커뮤니티 [269021:띠배너1] }, 팝업 : 없음 ]
            prgStCd: '', // 진행상태 [ 팝업 : {271006:대기, 271007:진행중} ]
            indnTrg: '', //노출대상 [274002:전체B2C회원, 274003:회원그룹]

            seqGroup: [
                {
                    exhbSn: '', //전시번호
                    beforSeq: '', //변경전 노출순서
                    afterSeq: '' //변경후 노출순서
                }
            ]
            // memuCode: computed(() => state.menuCode)
        });

        // 페이징
        const pager = reactive({
            current: 1,
            currentPageSize: 1,
            size: computed(() => state.pagesize),
            offset: computed(() => (pager.current - 1) * pager.size),
            totalCnt: 0
        });

        // watch(formData, () => {
        //     resetState();
        // });

        onMounted(() => {
            getExhibitBanner();
        });

        // const resetState = () => {
        //     state.isCheckTermsName = false; // 중복확인
        //     state.validState.errState = false; // validation
        //     state.validState.message = '';
        // };
        
        const onChangeOrder = (value, id, index) => {
            console.log('order change', value, id, index);
            let idType = document.querySelector(`#${id}`);
            state.seqGroup[index].afterSeq = Number(idType.value);
            // console.log(idType.value, orderCheck(state.seqGroup));
            // resetState();
            emit('onChangeOrder', state.seqGroup);
        };
        
        const checkValidState = (type) => {
            return state.validState.target === type && state.validState.errState;
        };

        // 공통코드 셀렉트
        const selectedOptions = (valueCode, valueName, type) => {
            console.log(formData[type]);
            if (type === 'bnrTyCd') {
                formData.exhbTyCd = valueCode;
            } else if (type === 'indnLctSeCd') {
                formData.indnLctSeCd = valueCode;
                console.log('typePosition change', valueCode);
                formData.indnLctDtlSeCd = '';

                // state.selectType = ''; // default // today // health // challenge // community
                state.selectType = (valueCode === '269003') ? 'today' :
                    (valueCode === '269005') ? 'health' :
                        (valueCode === '269007') ? 'challenge' :
                            (valueCode === '269009') ? 'community' : 'default';

            } else if (type === 'indnTrgPopup') { // 1차 대상 아님
                formData.indnTrg = valueCode;
            } else {
                formData[type] = valueCode;
            }

            console.log(valueCode, valueName, type);
        };

        // 데이터 피커 초기화
        const onInitDate = () => {
            // dateSearch.value.initDate();
            //재조회  api 호출
            clearList(1);
        };

        // 리스트 조회
        const getExhibitBanner = async () => {
            try {
                let params = {
                    exhbSe: 'B', // B: banner P: popup
                    exhbTyCd: formData.exhbTyCd, // 전시유형코드 [ 배너유형 : {268002:메인배너, 268003:띠배너}, 팝업유형 : {268005:바텀팝업, 268006:레이어팝업, 268007:전면노출팝업} ]
                    indnLctSeCd: formData.indnLctSeCd, // 노출페이지 [ 배너 : {269003:투데이, 269005:건강, 269007:챌린지, 269009:커뮤니티}, 팝업 : {269023:투데이, 269024:건강, 269025:챌린지, 269026:커뮤니티} ]
                    indnLctDtlSeCd: formData.indnLctDtlSeCd, // 노출위치 [ 배너 : { 미선택 [269004:투데이(최상단), 269006:건강(최상단), 269008:챌린지(최상단), 269010:커뮤니티(최상단)] 투데이 [269013:띠배너1, 269014:띠배너2, 269015:띠배너3] 건강 [269017:띠배너1] 챌린지 [269019:띠배너1] 커뮤니티 [269021:띠배너1] }, 팝업 : 없음 ]
                    prgStCd: formData.prgStCd, // 진행상태 [ 배너 : {271002:대기, 271003:진행중}, 팝업 : {271006:대기, 271007:진행중} ]
                    indnTrg: formData.indnTrg, // 노출대상 [ 배너 : {274002:전체B2C회원, 274003:회원그룹}, 팝업 : {274005:전체B2C회원, 274006:회원그룹} ]

                    size: pager.size,
                    offset: pager.offset
                    // inqType: formData.inqType,
                    // bgnDate: formData.bgnDate,
                    // endDate: formData.endDate,
                    // cnSercSe: formData.cnSercSe,
                    // cnSercCts: formData.cnSercCts,
                    // bnrTyCd: formData.bnrTyCd,
                    // prgStCd: formData.prgStCd,
                    // indnTrg: formData.indnTrg,
                    // indnStCd: formData.indnStCd
                };
                console.log(params);
                const response = await _getExhibitOrderList(params);
                pager.totalCnt = response.data.data.totalCnt;
                state.bannerlist = response.data.data.list;
                state.seqGroup = [];
                for (let i = 0; i <= (response.data.data.list.length - 1); i++) {
                    let item = {
                        exhbSn: state.bannerlist[i].exhbBnrMngSn, //전시번호
                        beforSeq: state.bannerlist[i].indnSqn, //변경전 노출순서
                        afterSeq: state.bannerlist[i].indnSqn //변경후 노출순서
                    };
                    state.seqGroup.push(item);
                }
                // console.log(response.data, state.seqGroup);
            } catch (error) {
                console.log(error);
            }
        };

        const initParams = () => {
            formData.exhbTyCd = '268002';
            formData.indnLctSeCd = '';
            formData.indnLctDtlSeCd = '';
            formData.prgStCd = '';
            formData.indnTrg = '';
        };
        
        //리스트 갯수 변경 후 리스트 재 조회
        const clearList = (num) => {
            initParams();
        };
        
        // 상세 검색 열기
        const openMoreSerch = () => {
            state.openMore = !state.openMore;
        };

        //검색조건에 따른 리스트 재조회
        const reloadList = () => {
            pager.current = 1;
            // onChangedPage(pager.current);
            console.log(formData);
            getExhibitBanner();
        };

        return {
            //공통 사용
            pager,
            state,
            formData,
            // initColum,
            // dateSearch,
            // isbannerOrderShow,
            selectedOptions,
            onInitDate,
            openMoreSerch,
            reloadList,
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