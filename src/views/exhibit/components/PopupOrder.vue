<template>
    <div>
        <div class="ui-data-filter sm">
            <div class="form-item">
                <div class="form-item">
                    <div class="item">
                        <label>팝업유형</label>
                        <span class="input">
                            <span class="dv">
                                <commselect :className="'sm'" :selectType="'searchCode.popupTyCd'"
                                    @changedValue="selectedOptions" :initData="formData.exhbTyCd" />
                            </span>
                            <span class="dv">
                                <commselect :className="'sm'" :selectType="'searchCode.indnLctSeCd2'"
                                    @changedValue="selectedOptions" :initData="formData.indnLctSeCd" />
                            </span>
                        </span>
                    </div>
                    <div class="item">
                        <label>진행상태</label>
                        <span class="input">
                            <span class="dv">
                                <commselect :className="'sm'" :selectType="'searchCode.prgStCd2'"
                                    @changedValue="selectedOptions" :initData="formData.prgStCd" />
                            </span>
                        </span>
                    </div>
                </div>
                <div class="btn-filter-set">
                    <button type="button" class="btn btn-sm" @click="reloadList"><span class="ico-search"></span>조회
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
                    <div class="item">
                        <label>노출OS </label>
                        <span class="input">
                            <span class="dv" v-for="(item, index) in state.ositem" :key="index">
                                <span class="checkbox" @change="selectOsItem"><input :id="'isPostOrder' + index"
                                        name="openRdoOrder" type="checkbox" :value="item.value"
                                        v-model="state.indnOsSeCd"><label :for="'isPostOrder' + index">{{
                                            item.label }}</label>
                                </span>
                            </span>
                        </span>
                    </div>
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
                        <span class="dv"><span class="ui-tag bc1">{{ item.popupIndnLctSeNm }}</span></span>
                        <span class="dv pos">{{ item.popupTySeNm }}</span>
                        <span class="dv pos">{{ item.popupIndnLctSeNm }}</span>
                        <span class="dv name">{{ item.ttl }}</span>
                        <span class="dv img">
                            <template v-if="item.ctsTxtYn === 'Y'">
                                <span v-html="item.ctsTxt"></span>
                            </template>
                            <template v-if="item.ctsImgYn === 'Y'">
                                <img :src="item.imgFlUrl" alt="이벤트 상세 내용">
                            </template>
                        </span>
                        <span class="dv ing">{{ item.popupPrgStSeNm }}</span>
                        <span class="dv target">{{ item.popupIndnTrgSeNm }}</span>
                        <span class="dv period">{{ item.popupIndnBgnDt }} ~ {{ item.popupIndnEndDt }}</span>
                        <span class="dv open">{{ item.bnrIndnStSeNm }}</span>
                        <span class="dv open">{{ item.indnOsSeNm }}</span>
                        <span class="dv open">
                            <input type="number" class="form-control" :id="'order' + index" min="1"
                                :class="checkValidState('afterSeq') ? 'error' : ''" :value="state.seqGroup[index].afterSeq"
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

export default {
    // components: { DefaultModal, DateSerch },
    setup() {
        const internalInstance = getCurrentInstance();
        const { emit } = getCurrentInstance();
        const $Modal = inject('$Modal');
        const store = useStore();

        const state = reactive({
            openMore: false,
            download: { pass: '', reason: '' },
            pagesize: 10,
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
                    { label: '투데이(최상단)', value: '269004' },
                    { label: '건강(최상단)', value: '269006' },
                    { label: '챌린지(최상단)', value: '269008' },
                    { label: '커뮤니티(최상단)', value: '269010' }
                ],
                today: [
                    { label: '띠배너1', value: '269013' },
                    { label: '띠배너2', value: '269014' },
                    { label: '띠배너3', value: '269015' }
                ],
                health: [{ label: '띠배너1', value: '269017' }],
                challenge: [{ label: '띠배너1', value: '269019' }],
                community: [{ label: '띠배너1', value: '269021' }]
            },
            /**
             * searchCode.indnLctSeCd 유형 선택에 따른 값으로 typePosition 이 바뀜
             * 메인배너는 해당 없음 / 띠배너일때만 적용
             */
            selectType: 'default',

            ositem: [
                { label: '전체', value: '275003' },
                { label: 'iOS', value: '275001' },
                { label: 'Android', value: '275002' }
            ],
            indnOsSeCd: [],
            indnOsSeCdText: '275003'
        });

        const formData = reactive({
            // popupTyCd: '268005', // 전시유형코드 [ 팝업유형 : {268005:바텀팝업, 268006:레이어팝업, 268007:전면노출팝업} ]
            exhbTyCd: '268005',
            indnLctSeCd: '', // 노출페이지 [ 팝업 : {269023:투데이, 269024:건강, 269025:챌린지, 269026:커뮤니티} ]
            prgStCd: '', // 진행상태 [ 팝업 : {271006:대기, 271007:진행중} ]
            indnTrg: '', //노출대상 [274002:전체B2C회원, 274003:회원그룹]
            indnOsSeCd: computed(() => state.indnOsSeCdText), // 노출OS [275001:iOS, 275002:Android, 275003:전체]

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

        onMounted(() => {
            getExhibitBanner();
        });

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
            if (type === 'popupTyCd') {
                formData.exhbTyCd = valueCode;
                // formData.exhbTyCd 
            } else if (type === 'bnrTyCd') {
                formData.exhbTyCd = valueCode;
            } else if (type === 'indnLctSeCd2') {
                formData.indnLctSeCd = valueCode;
                console.log('typePosition change', valueCode);
                // formData.indnLctDtlSeCd = '';

                // state.selectType = ''; // default // today // health // challenge // community
                // 팝업 : {269023:투데이, 269024:건강, 269025:챌린지, 269026:커뮤니티}
                state.selectType = (valueCode === '269023') ? 'today' :
                    (valueCode === '269024') ? 'health' :
                        (valueCode === '269025') ? 'challenge' :
                            (valueCode === '269026') ? 'community' : 'default';

            } else if (type === 'prgStCd2') { // 1차 대상 아님
                formData.prgStCd = valueCode;
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
                    exhbSe: 'P', // B: banner P: popup
                    exhbTyCd: formData.exhbTyCd, // 전시유형코드 [ 팝업유형 : {268005:바텀팝업, 268006:레이어팝업, 268007:전면노출팝업} ]
                    indnLctSeCd: formData.indnLctSeCd, // 노출페이지 [ 팝업 : {269023:투데이, 269024:건강, 269025:챌린지, 269026:커뮤니티} ]
                    indnLctDtlSeCd: '',
                    prgStCd: formData.prgStCd, // 진행상태 [ 팝업 : {271006:대기, 271007:진행중} ]
                    indnTrg: formData.indnTrg, // 노출대상 [ 팝업 : {274005:전체B2C회원, 274006:회원그룹} ]

                    indnOsSeCd: formData.indnOsSeCd,

                    size: pager.size,
                    offset: pager.offset
                };
                console.log(params);
                const response = await _getExhibitOrderList(params);
                pager.totalCnt = response.data.data.totalCnt;
                state.bannerlist = response.data.data.list;
                state.seqGroup = [];
                for (let i = 0; i <= (response.data.data.list.length - 1); i++) {
                    let item = {
                        exhbSn: state.bannerlist[i].exhbPopupMngSn, //전시번호
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
            formData.exhbTyCd = '268005';
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

        const selectOsItem = () => {
            console.log(state.indnOsSeCd);
            state.indnOsSeCdText = Array.from(state.indnOsSeCd).join(',');
        };

        return {
            //공통 사용
            pager,
            state,
            formData,
            selectedOptions,
            onInitDate,
            openMoreSerch,
            reloadList,
            checkValidState,
            onChangeOrder,
            selectOsItem

        };
    }
};

</script>

<style scoped>
.bannerlist .ui-dragdrop-item::after {
    display: none;
}
</style>