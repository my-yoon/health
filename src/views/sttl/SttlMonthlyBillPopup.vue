<template>
    <button type="button" :disabled="props.detailInfo.starRsStCd==='10'" class="btn btn-sl posi" @click="open">다운로드</button>
    <DefaultModal :isShow="modalIsShow" :modalName="'sttlBillGenerate'" :modalTitle="'청구서'" :buttonConfirm="'다운로드'" :buttonCancel="'확인'" @modalclose="modalclose" className="ui-modal-wrap-bill2" >
		<template #modalcontent>
            <div class="ui-bill-form2">
                <div ref="pdfArea">
                    <div class="ui-bill-form-header" >
                            <img src="/img/kbhc-logo.png" alt="kb 헬스케어" />
                    </div>
                    <div class="ui-bill-form-content">
                        <div class="ui-bill-form-title">
                            <h1>KB 오케어 X 사용스타 청구서</h1>
                            <span class="date">({{dayJS(props.detailInfo.sttlYm, 'YYYYMM').format('YYYY.MM') }}월분)</span>
                        </div>
                        <div class="ui-bill-form-item">
                            <h2>발행정보</h2>
                            <div class="ui-bill-form-item-cont">
                                <div class="tbl-wrap">
                                    <table class="table reg">
                                        <colgroup>
                                            <col style="width: 120px;">
                                            <col style="width: auto;">
                                            <col style="width: 120px;">
                                            <col style="width: auto;">
                                        </colgroup>
                                        <tbody>
                                            <tr>
                                                <th scope="row">등록번호</th>
                                                <td>{{props.detailInfo.invoiceeCorpNum}}</td>
                                                <th scope="row">종사업장</th>
                                                <td>{{props.detailInfo.invoiceeTaxRegId}}</td>
                                            </tr>
                                            <tr>
                                                <th scope="row">상호</th>
                                                <td>{{props.detailInfo.invoiceeCorpName}}</td>
                                                <th scope="row">성명</th>
                                                <td>{{props.detailInfo.invoiceeCeoName}}</td>
                                            </tr>
                                            <tr>
                                                <th scope="row">등록번호</th>
                                                <td colspan="3">{{props.detailInfo.invoiceeAddress}}</td>
                                            </tr>
                                            <tr>
                                                <th scope="row">업태</th>
                                                <td>{{props.detailInfo.invoiceeBizType}}</td>
                                                <th scope="row">종목</th>
                                                <td>{{props.detailInfo.invoiceeBizClass}}</td>
                                            </tr>
                                            <tr>
                                                <th scope="row">담당자</th>
                                                <td>{{props.detailInfo.invoiceeContactName}}</td>
                                                <th scope="row">연락처</th>
                                                <td>{{props.detailInfo.invoiceeTel}}</td>
                                            </tr>
                                            <tr>
                                                <th scope="row">이메일</th>
                                                <td colspan="3">{{props.detailInfo.invoiceeEmail}}</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                        <div class="ui-bill-form-item">
                            <h2>정산금액</h2>
                            <div class="ui-bill-form-item-cont">
                                <div class="tbl-wrap">
                                    <table class="table reg">
                                        <colgroup>
                                            <col style="width: 20%;">
                                        </colgroup>
                                        <thead>
                                            <tr>
                                                <th scope="col" class="t-center">발행처</th>
                                                <th scope="col" class="t-center">상품구매임직원</th>
                                                <th scope="col" class="t-center">구매상품건수</th>
                                                <th scope="col" class="t-center">총스타사용금액</th>
                                                <th scope="col" class="t-center">총정산금액</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr>
                                                <td class="t-center">KB헬스케어</td>
                                                <td class="t-right">{{props.detailInfo.mbrCnt}}명</td>
                                                <td class="t-right">{{props.detailInfo.prdCnt}}건</td>
                                                <td class="t-right">{{sttlLib.formatMoney({value:props.detailInfo.dlngAmt})}}원</td>
                                                <td class="t-right">{{sttlLib.formatMoney({value:props.detailInfo.dlngAmt})}}원</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                        <div class="ui-bill-form-item">
                            <h2>세금계산서</h2>
                            <div class="ui-bill-form-item-cont">
                                <div class="ui-bill-box">
                                    <div class="ui-bill-box-item">
                                        <span class="lb">공급가액</span>
                                        <strong class="amount">
                                            <span>￦</span>
                                            {{sttlLib.formatMoney({value:props.detailInfo.spvl})}}
                                        </strong>
                                    </div>
                                    <div class="ui-bill-box-item">
                                        <span class="lb">부가세</span>
                                        <strong class="amount">
                                            <span>￦</span>
                                            {{sttlLib.formatMoney({value:props.detailInfo.vat})}}
                                        </strong>
                                    </div>
                                    <div class="ui-bill-box-item total">
                                        <span class="lb">총액</span>
                                        <strong class="amount">
                                            <span>￦</span>
                                            {{sttlLib.formatMoney({value:props.detailInfo.dlngAmt})}}
                                        </strong>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="ui-bill-form-item">
                            <h2>청구금액 입금계좌 정보</h2>
                            <div class="ui-bill-form-item-cont">
                                <div class="tbl-wrap">
                                    <table class="table reg">
                                        <colgroup>
                                            <col style="width: 120px;">
                                            <col style="width: auto;">
                                        </colgroup>
                                        <tbody>
                                            <tr>
                                                <th scope="row">은행명</th>
                                                <td>%text%</td>
                                            </tr>
                                            <tr>
                                                <th scope="row">계좌번호</th>
                                                <td>%num%</td>
                                            </tr>
                                            <tr>
                                                <th scope="row">예금주</th>
                                                <td>%text%</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                        <div class="ui-bill-form-item">
                            <h2>첨부서류</h2>
                            <div class="ui-bill-form-item-cont">
                                <div class="ui-bill-box">
                                    <ul>
                                        <li>1. 정산금내역서</li>
                                        <li>2. 정산금내역서</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                        <div class="ui-bill-date">
                            <strong>발행일 : {{dayJS(props.detailInfo.tbiPlDate, 'YYYYMMDD').format('YYYY-MM-DD')}}</strong>
                        </div>
                        <div class="ui-bill-form-item flex justify-end">
                            <ul class="half-list">
                                <li>
                                    <span class="lb">상호</span>
                                    <strong class="value">주식회사 케이비 헬스케어</strong>
                                </li>
                                <li>
                                    <span class="lb">주소</span>
                                    <strong class="value">서울시 강남구 테헤란로 334, 5층</strong>
                                </li>
                                <li>
                                    <span class="lb">대표이사</span>
                                    <strong class="value">최 낙 천</strong>
                                </li>
                            </ul>
                        </div>
                        <div class="ui-bill-end">
                            <strong>
                                주식회사 : {{props.detailInfo.invoiceeCorpName}} 귀중
                                <!-- <img src="/admin-publish/assets/img/stamp-sample.png" alt="" /> 날인필요없으면 삭제해주세요 -->
                            </strong>
                        </div>
                    </div>
                </div>
            </div>
		</template>
	</DefaultModal>
</template>
<script setup>
import DefaultModal from '@/plugins/modal/modal/DefaultModal.vue';
import html2pdf from 'html2pdf.js';
import { inject, onMounted, ref } from 'vue';
import { sttlLib } from './module/sttlLib';
const dayJS = inject('dayJS');
const $Modal = inject('$Modal');
const modalIsShow = ref(false);
const props = defineProps({
    selectedList: Array,
    detailInfo: Object,
    params: Object
});
const emit = defineEmits(['onCloseDown']);

const modalclose = async (btn, name) => {
    console.log(btn, name);
    if (btn === 'modalconfirm') {
        exportToPDF();
    } else {
        modalIsShow.value = false;
        emit('onCloseDown');
    }
    
    
};
const open = () => {
    modalIsShow.value = true;
};

const pdfArea = ref(null);

const exportToPDF = () => {
    html2pdf(pdfArea.value, {
        margin: [10,0,40,0],
        filename: 'bill.pdf',
        image: {type: 'jpg', qulity: 0.95},
        html2canvas: {
            useCORS: true,
            scrollY: 0,
            scale: 1,
            dpi: 300,
            latterRendering: true,
            allowTaint: false
        },
        jsPDF: {orientation: 'portrait', unit: 'mm', format: 'a4', compressPDF: true}
    });
};

// onMounted(() => {
//     open();
// });

defineExpose({
    open
});

</script>
<style>
.ui-modal-wrap-bill2 {
    width: 900px !important;
}
.ui-bill-form2 {
    /* width: 1180px !important; */
    margin: 0 auto;
    border: 1px solid #eee;
}

</style>