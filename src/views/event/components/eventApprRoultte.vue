<template>
    <div class="ui-section">
        <subTitleBar :subTitle="'기능설정'" :ess="'표시는 필수항목입니다.'" />
        <div class="ui-content">
            <div class="tbl-wrap mt-10">
                <table class="table reg">
                    <colgroup>
                        <col style="width: 160px;">
                        <col style="width: auto;">
                        <col style="width: 160px;">
                        <col style="width: auto;">

                    </colgroup>
                    <tbody v-if="state.formData.eventBnefType === 'IMMEDIATELY'">
                        <tr>
                            <th scope="row">즉시 지급 혜택<span class="ess"><span class="offscreen">필수입력</span></span></th>
                            <td colspan="3">
                                <div class="reg-item">
                                    <span class="radio" v-for="(item, index) in state.eventimmyPay" :key="index">
                                        <input :id="'eventimmypay' + index" name="eventimmypayGroup" type="radio"
                                            :value="item.value" v-model="state.immyPayBnef" :disabled="item.disabled"
                                            @change="onChangeValue('immyPayBnef', state.immyPayBnef)">
                                        <label :for="'eventimmypay' + index">{{ item.label }}</label>
                                    </span>
                                </div>
                            </td>
                        </tr>

                        <tr>
                            <th scope="row">파이 개수<span class="ess"><span class="offscreen">필수입력</span></span></th>
                            <td colspan="3">
                                <div class="reg-item">
                                    <span class="radio" v-for="(item, index) in state.roulette" :key="index">
                                        <input :id="'rouletteCnt' + index" name="rouletteCntGroup" type="radio"
                                            :value="item.value" v-model="state.rouletteCnt" :disabled="item.disabled"
                                            @change="onChangeValue('rouletteCnt', state.rouletteCnt, index)">
                                        <label :for="'rouletteCnt' + index">{{ item.label }}</label>
                                    </span>
                                </div>
                            </td>
                        </tr>
                        <tr>
                            <th scope="row">파이 정보<span class="ess"><span class="offscreen">필수입력</span></span></th>
                            <td colspan="3">
                                <div class="tbl-wrap">
                                    <table class="table reg">
                                        <colgroup>
                                            <col style="width: 100px;">
                                            <col style="width: 160px;">
                                            <col style="width: auto;">
                                            <col style="width: 160px;">
                                            <col style="width: 240px;">
                                            <col style="width: 160px;">
                                            <col style="width: 200px;">
                                        </colgroup>
                                        <thead>
                                            <tr>
                                                <th scope="col" class="t-center">위치</th>
                                                <th scope="col">당첨 구분</th>
                                                <th scope="col">
                                                    표시 텍스트<span class="ess"><span class="offscreen">필수입력</span></span><br>
                                                    (파이 개수에 따라 글자 수 차등제한)
                                                </th>

                                                <th scope="col">상품명
                                                    <span class="ess"><span class="offscreen">필수입력</span></span><br>
                                                </th>

                                                <!-- <th scope="col">지급 상품
                                                    <span class="ess"><span class="offscreen">필수입력</span></span><br>
                                                    (꽝 설정 시 상품 호출 불가)
                                                </th> -->
                                                <th scope="col">제세공과금 대상
                                                    <span class="ess"><span class="offscreen">필수입력</span></span><br>
                                                    (설정 시 수동 방송)
                                                </th>
                                                <th scope="col">당첨 인원 제한 설정
                                                    <span class="ess"><span class="offscreen">필수입력</span></span><br> (사용 체크
                                                    안함 : 무제한 당첨)
                                                </th>
                                                <th scope="col">기본 확률
                                                    <span class="ess"><span class="offscreen">필수입력</span></span><br>
                                                    (합계 100%)
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr v-for="(item, index) in Number(state.rouletteCnt)" :key="index">
                                                <td class="t-center">
                                                    <div :class="`'evt-pie-${state.rouletteCnt}-${(index + 1)}`"></div>
                                                </td>
                                                <td>
                                                    <div class="reg-group wp-100">
                                                        <div class="reg-item">
                                                            <span class="radio">
                                                                <input :id="'isPrize' + item + index"
                                                                    :name="'isPrizeGroup' + item" value=0 type="radio"
                                                                    @change="onChangeValue(`rouletteType${index + 1}`, 0, index)"
                                                                    v-model="state['isPrize' + index]">
                                                                <label :for="'isPrize' + item + index">꽝</label>
                                                            </span>
                                                            <span class="radio">
                                                                <input :id="'isPrize' + item + index + 1"
                                                                    :name="'isPrizeGroup' + item" type="radio" value=1
                                                                    @change="onChangeValue(`rouletteType${index + 1}`, 1, index)"
                                                                    v-model="state['isPrize' + index]">
                                                                <label :for="'isPrize' + item + index + 1">당첨</label>
                                                            </span>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td>
                                                    <div class="reg-group wp-100">
                                                        <div class="reg-item">
                                                            <input type="text" class="form-control"
                                                                placeholder="00자까지 입력할 수 있습니다."
                                                                :id="'rouletteTxt' + (index + 1)"
                                                                @change="onChangeValue(`rouletteTxt${index + 1}`, 'text')"
                                                                value="">

                                                        </div>
                                                    </div>
                                                </td>
                                                <td>
                                                    <div class="reg-group wp-100">
                                                        <div class="reg-item">
                                                            <input type="number" class="form-control"
                                                                :id="'roulettePoint' + (index + 1)"
                                                                @focus="onChangeValue(`roulettePoint${index + 1}`, 'point', (index + 1))"
                                                                :disabled="state['isPrize' + index] == 0">
                                                            <span class="unit">P</span>
                                                        </div>

                                                    </div>
                                                </td>
                                                <!-- //2차대상 -->
                                                <td v-if="false">
                                                    <div class="reg-group wp-100">
                                                        <div class="reg-item">
                                                            <input type="text" class="form-control">
                                                            <button type="button" class="btn btn-slm">상품 검색</button>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td>
                                                    <div class="reg-group wp-100">
                                                        <div class="reg-item">
                                                            <span class="checkbox">
                                                                <input :name="'taxTarGroup' + (index + 1)" type="checkbox"
                                                                    :id="'rouletteTax' + (index + 1)"
                                                                    @change="onChangeValue(`rouletteTax${index + 1}`, 'tax')"
                                                                    :disabled="state['isPrize' + index] == 0">
                                                                <label :for="'rouletteTax' + (index + 1)">대상</label>
                                                            </span>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td>
                                                    <div class="reg-group wp-100">
                                                        <div class="reg-item">
                                                            <span class="checkbox">
                                                                <input :name="'limPrizeGroup' + (index + 1)" type="checkbox"
                                                                    :id="'roulettePcpCnt' + (index + 1)" value=""
                                                                    :disabled="state['isPrize' + index] == 0"
                                                                    @change="onChangeValue(`roulettePcpCnt${index + 1}`, 'PcpCnt', index)">
                                                                <label :for="'roulettePcpCnt' + (index + 1)">사용</label>
                                                            </span>
                                                        </div>
                                                        <div class="reg-item">
                                                            <input type="text" class="form-control"
                                                                :class="{ error: state.error && state.errorNum == index }"
                                                                :id="'roulettePcpCntText' + (index + 1)"
                                                                :disabled="!(state['isPrize' + index] == 1 && state.formData.eventBnefType == 'AFTER')"
                                                                min-value=1
                                                                @change="onChangeValue(`roulettePcpCntText${index + 1}`, `${index + 1}`, index)">
                                                            <span class="unit">명</span>
                                                        </div>
                                                    </div>
                                                    <div v-if="state.error && state.errorNum == index" style="width:160px">
                                                        <p class="input-guide error">
                                                            당첨 인원은 0보다 커야 합니다.
                                                        </p>
                                                    </div>

                                                </td>
                                                <td>
                                                    <div class="reg-group wp-100">
                                                        <div class="reg-item">
                                                            <input type="number" :id="`roulettePrbl_first${index + 1}`"
                                                                class="form-control w-30" maxlength=2 value="00"
                                                                @change="onChangeValue(`roulettePrbl_first${index + 1}`, `${index + 1}`)">
                                                            <span class="unit">.</span>
                                                            <input type="number" :id="`roulettePrbl_last${index + 1}`"
                                                                class="form-control w-30" maxlength=2 value="00"
                                                                @change="onChangeValue(`roulettePrbl_last${index + 1}`, `${index + 1}`)">
                                                            <span class=" unit">%</span>
                                                        </div>
                                                    </div>
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                                <slot name="errorCase"></slot>
                            </td>
                        </tr>

                    </tbody>
                    <tbody v-if="state.formData.eventBnefType === 'AFTER'">
                        <tr>
                            <th scope="row">당첨 후 지급 혜택<span class="ess"><span class="offscreen">필수입력</span></span></th>
                            <td colspan="3">
                                <div class="reg-item">
                                    <span class="radio" v-for="(item, index) in state.eventpzwnPay" :key="index">
                                        <input :id="'eventpzwnPay' + index" name="eventpzwnPayGroup" type="radio"
                                            :value="item.value" v-model="state.pzwnPayBnef" :disabled="item.disabled"
                                            @change="onChangeValue('pzwnPayBnef', state.pzwnPayBnef)">
                                        <label :for="'eventpzwnPay' + index">{{ item.label }}</label>
                                    </span>
                                    <span class="dv" v-if="false">
                                        시계 컴포넌트
                                    </span>
                                </div>
                            </td>
                        </tr>
                        <tr>
                            <th scope="row">파이 개수<span class="ess"><span class="offscreen">필수입력</span></span></th>
                            <td colspan="3">
                                <div class="reg-item">
                                    <span class="radio" v-for="(item, index) in state.roulette" :key="index">
                                        <input :id="'rouletteCnt' + index" name="rouletteCntGroup" type="radio"
                                            :value="item.value" v-model="state.rouletteCnt" :disabled="item.disabled"
                                            @change="onChangeValue('rouletteCnt', state.rouletteCnt, index)">
                                        <label :for="'rouletteCnt' + index">{{ item.label }}</label>
                                    </span>
                                </div>
                            </td>
                        </tr>
                        <tr>
                            <th scope="row">파이 정보<span class="ess"><span class="offscreen">필수입력</span></span></th>
                            <td colspan="3">
                                <div class="tbl-wrap">
                                    <table class="table reg">
                                        <colgroup>
                                            <col style="width: 100px;">
                                            <col style="width: 160px;">
                                            <col style="width: auto;">
                                            <col style="width: 160px;">
                                            <col style="width: 240px;">
                                            <col style="width: 160px;">
                                            <col style="width: 200px;">
                                        </colgroup>
                                        <thead>
                                            <tr>
                                                <th scope="col" class="t-center">위치</th>
                                                <th scope="col">당첨 구분</th>
                                                <th scope="col">
                                                    표시 텍스트<span class="ess"><span class="offscreen">필수입력</span></span><br>
                                                    (파이 개수에 따라 글자 수 차등제한)
                                                </th>
                                                <th scope="col" colspan="2">
                                                    상품명
                                                    <span class="ess"><span class="offscreen">필수입력</span></span><br>
                                                </th>
                                                <th scope="col">제세공과금 대상
                                                    <span class="ess"><span class="offscreen">필수입력</span></span><br>
                                                    (설정 시 수동 방송)
                                                </th>
                                                <th scope="col">당첨 인원 제한 설정
                                                    <span class="ess"><span class="offscreen">필수입력</span></span><br> (사용 체크
                                                    안함 : 무제한 당첨)
                                                </th>
                                                <th scope="col">기본 확률
                                                    <span class="ess"><span class="offscreen">필수입력</span></span><br>
                                                    (합계 100%) {{ state.rouletteCnt }}11
                                                </th>
                                            </tr>
                                        </thead>

                                        <tbody>
                                            <tr v-for="(item, index) in Number(state.rouletteCnt)" :key="index">
                                                <td class="t-center">
                                                    <div :class="`'evt-pie-${state.rouletteCnt}-${(index + 1)}`"></div>
                                                </td>
                                                <td>
                                                    <div class="reg-group wp-100">
                                                        <div class="reg-item">
                                                            <span class="radio">
                                                                <input :id="'isPrize' + item + index"
                                                                    :name="'isPrizeGroup' + item" value=0 type="radio"
                                                                    @change="onChangeValue(`rouletteType${index + 1}`, 0, index)"
                                                                    v-model="state['isPrize' + index]">
                                                                <label :for="'isPrize' + item + index">꽝</label>
                                                            </span>
                                                            <span class="radio">
                                                                <input :id="'isPrize' + item + index + 1"
                                                                    :name="'isPrizeGroup' + item" type="radio" value=1
                                                                    @change="onChangeValue(`rouletteType${index + 1}`, 1, index)"
                                                                    v-model="state['isPrize' + index]">
                                                                <label :for="'isPrize' + item + index + 1">당첨</label>
                                                            </span>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td>
                                                    <div class="reg-group wp-100">
                                                        <div class="reg-item">

                                                            <input type="text" class="form-control"
                                                                placeholder="00자까지 입력할 수 있습니다."
                                                                :id="'rouletteTxt' + (index + 1)"
                                                                @change="onChangeValue(`rouletteTxt${index + 1}`, 'text')"
                                                                value="">
                                                        </div>
                                                    </div>
                                                </td>
                                                <td colspan="2">
                                                    <div class="reg-group wp-100">
                                                        <div class="reg-item">
                                                            <input type="text" class="form-control"
                                                                :id="'rouletteProductNm' + (index + 1)"
                                                                @change="onChangeValue(`rouletteProductNm${index + 1}`, 'Product')"
                                                                :disabled="state['isPrize' + index] == 0">
                                                        </div>
                                                    </div>
                                                </td>
                                                <!-- //2차대상 -->
                                                <td v-if="false">
                                                    <div class="reg-group wp-100">
                                                        <div class="reg-item">
                                                            <input type="text" class="form-control">
                                                            <button type="button" class="btn btn-slm">상품 검색</button>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td>
                                                    <div class="reg-group wp-100">
                                                        <div class="reg-item">
                                                            <span class="checkbox">
                                                                <input :name="'taxTarGroup' + (index + 1)" type="checkbox"
                                                                    :id="'rouletteTax' + (index + 1)"
                                                                    @change="onChangeValue(`rouletteTax${index + 1}`, 'tax')"
                                                                    :disabled="state['isPrize' + index] == 0">
                                                                <label :for="'rouletteTax' + (index + 1)">대상</label>
                                                            </span>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td>
                                                    <div class="reg-group wp-100">
                                                        <div class="reg-item">
                                                            <input type="text" class="form-control"
                                                                :class="{ error: state.error && state.errorNum == index }"
                                                                :id="'roulettePcpCntText' + (index + 1)"
                                                                :disabled="!(state['isPrize' + index] == 1 && state.formData.eventBnefType == 'AFTER')"
                                                                min-value=1
                                                                @change="onChangeValue(`roulettePcpCntText${index + 1}`, `${index + 1}`, index)">
                                                            <span class="unit">명</span>
                                                        </div>
                                                    </div>
                                                    <div v-if="state.error && state.errorNum == index" style="width:160px">
                                                        <p class="input-guide error">
                                                            당첨 인원은 0보다 커야 합니다.
                                                        </p>
                                                    </div>

                                                </td>
                                                <td>
                                                    <div class="reg-group wp-100">
                                                        <div class="reg-item">
                                                            <input type="number" :id="`roulettePrbl_first${index + 1}`"
                                                                class="form-control w-30" value="00"
                                                                @change="onChangeValue(`roulettePrbl_first${index + 1}`, `${index + 1}`)">
                                                            <span class="unit">.</span>
                                                            <input type="number" :id="`roulettePrbl_last${index + 1}`"
                                                                class="form-control w-30" value="00"
                                                                @change="onChangeValue(`roulettePrbl_last${index + 1}`, `${index + 1}`)">
                                                            <span class=" unit">%</span>
                                                        </div>
                                                    </div>
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                                <slot name="errorCase"></slot>
                            </td>
                        </tr>

                    </tbody>
                </table>
            </div>
        </div>
    </div>
</template>
<script>
import { getCurrentInstance, computed, reactive, inject, ref, onMounted, watch, nextTick } from 'vue';
import { useRouter, useRoute } from 'vue-router';
export default {
    props: ['formData'],
    emits: ['formDataChange', 'chiocePoint'],
    setup(props) {
        const { emit } = getCurrentInstance();
        const route = useRoute();
        const state = reactive({
            formData: computed(() => props.formData),
            eventimmyPay: [
                { label: '리워드 포인트', value: 'POINT', disabled: false }
                // { label: 'B2B몰 상품', value: 'PRODUCT', disabled: true }
            ],
            eventpzwnPay: [
                { label: '외부 소싱 상품', value: 'PRODUCT', disabled: false }
                // { label: 'B2B몰 상품', value: 'POINT', disabled: true }
            ],
            roulette: [
                { label: '4', value: 4 },
                { label: '5', value: 5 },
                { label: '6', value: 6 }
            ],
            immyPayBnef: 'POINT',
            pzwnPayBnef: 'PRODUCT',
            rouletteCnt: 4,
            PcpCnt: false,
            isPrize0: 1,
            isPrize1: 0,
            isPrize2: 0,
            isPrize3: 0,
            isPrize4: 0,
            isPrize5: 0,
            disabledType: true,
            error: false,
            errorNum: 0,
            initEventType: _.clone(props.formData.eventBnefType)

        });
        watch(props.formData, () => {
            // console.log(state.formData.pzwnPayBnef, state.formData.immyPayBnef);
            if (route.query.eventSn && (state.formData.eventBnefType === state.initEventType)) {
                initDataSet();
            } else {
                // console.log('첨과 다름');
            }

        });
        onMounted(() => {
            if (route.query.eventSn) {
                initDataSet();
            }
        });
        const initDataSet = () => {
            state.rouletteCnt = state.formData.rouletteCnt;
            state.immyPayBnef = computed(() => state.formData.immyPayBnef);
            state.pzwnPayBnef = computed(() => state.formData.pzwnPayBnef);
            nextTick(() => {
                for (let i = 0; i < state.rouletteCnt; i++) {
                    state['isPrize' + i] = state.formData['rouletteType' + (i + 1)];
                    document.querySelector('#rouletteTxt' + (i + 1)).value = state.formData['rouletteTxt' + (i + 1)];
                    document.querySelector('#rouletteTax' + (i + 1)).checked = state.formData['rouletteTax' + (i + 1)] === 'N' ? false : true;
                    if (state.formData.immyPayBnef === 'POINT') {
                        if (state.formData['roulettePcpCnt' + (i + 1)] !== 0) {
                            document.querySelector('#roulettePcpCntText' + (i + 1)).disabled = false;
                            document.querySelector('#roulettePcpCnt' + (i + 1)).checked = true;
                        }
                        document.querySelector('#roulettePoint' + (i + 1)).value = state.formData['roulettePoint' + (i + 1)];
                    }
                    if (state.formData.pzwnPayBnef === 'PRODUCT') {
                        for (let i = 0; i < (state.formData.rouletteCnt); i++) {
                            if (state.formData['rouletteProduct' + (i + 1)] !== 0) {
                                document.querySelector('#rouletteProductNm' + (i + 1)).value = state.formData['rouletteProductNm' + (i + 1)];
                            }
                        }
                    }
                    document.querySelector('#roulettePcpCntText' + (i + 1)).value = state.formData['roulettePcpCnt' + (i + 1)];
                    let prbl = state.formData['roulettePrbl' + (i + 1)].split('.');
                    document.querySelector('#roulettePrbl_first' + (i + 1)).value = prbl[0];
                    document.querySelector('#roulettePrbl_last' + (i + 1)).value = prbl[1];
                }
            });
        };
        const onChangeValue = (caseType, value, index) => {
            console.log(caseType, value, index);
            //당첨인원제한 체크시
            if (value === 'PcpCnt') {
                let checkid = document.querySelector(`#${caseType}`);
                let inputid = document.querySelector(`#roulettePcpCntText${index + 1}`);
                if (checkid.checked) {
                    if (inputid.disabled == true) {
                        inputid.disabled = false;
                        inputid.value = 1;
                        emit('formDataChange', `roulettePcpCnt${index + 1}`, value, index);
                    }
                } else {
                    inputid.disabled = true;
                    inputid.value = '';
                }
            }
            //입력값이 0이면
            if (caseType.indexOf('roulettePcpCntText') > -1) {
                let inputid = document.querySelector(`#roulettePcpCntText${index + 1}`);
                console.log(inputid.value);
                if (inputid.value < 0 || isNaN(inputid.value)) {
                    state.errorNum = index;
                    state.error = true;
                    inputid.value = null;
                } else {
                    state.error = false;
                    emit('formDataChange', caseType, value, index);
                }

            }
            if (caseType.indexOf('rouletteType') > -1) {
                let inputid = document.querySelector(`#roulettePcpCntText${index + 1}`);
                let inputpdt = document.querySelector(`#rouletteProductNm${index + 1}`);
                let inputpoint = document.querySelector(`#roulettePoint${index + 1}`);
                let inputcheckbox = document.querySelector(`#roulettePcpCnt${index + 1}`);
                let inputtext = document.querySelector(`#rouletteTxt${index + 1}`);
                let inputtax = document.querySelector(`#rouletteTax${index + 1}`);
                if (state.formData.eventBnefType === 'AFTER') {
                    console.log(state['isPrize' + index]);
                    if (state['isPrize' + index] == 1) {
                        inputid.value = 1;
                        emit('formDataChange', `rouletteType${index + 1}`, 1, index);
                    } else {
                        emit('formDataChange', caseType, value, index);
                        inputid.value = null;
                        inputpdt.value = null;
                        inputtax.checked = false;
                        inputtext.value = '';


                    }
                } else {
                    if (state['isPrize' + index] == 1) {
                        emit('formDataChange', caseType, value, index);
                    } else {
                        emit('formDataChange', caseType, value, index);
                        console.log();
                        inputid.value = null;
                        inputpoint.value = null;
                        inputcheckbox.checked = false;
                        inputtax.checked = false;
                        inputtext.value = '';
                        state.error = false;
                        state.errorNum = 0;
                        if (state.formData.eventBnefType !== 'AFTER') {
                            inputid.disabled = true;
                            inputtext.value = '';
                        }
                    }
                }
            } else if (caseType.indexOf('roulettePoint') > -1) {
                emit('chiocePoint', 'open', caseType, index);
            } else if (caseType.indexOf('roulettePrbl_first') > -1) {
                let num = document.querySelector(`#roulettePrbl_first${value}`);
                if (num.value.length > 2) {
                    num.value = num.value.substr(0, 2);
                }
                emit('formDataChange', caseType, value, index);
            } else if (caseType.indexOf('roulettePrbl_last') > -1) {
                let num = document.querySelector(`#roulettePrbl_last${value}`);
                if (num.value.length > 2) {
                    num.value = num.value.substr(0, 2);
                }
                emit('formDataChange', caseType, value, index);
            } else {
                emit('formDataChange', caseType, value, index);
            }
        };
        return {
            state,
            onChangeValue
        };
    }
};
</script>