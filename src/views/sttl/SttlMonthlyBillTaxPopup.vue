<template>
    <button type="button" class="btn btn-ss" @click="open">세금계산서</button>
    <DefaultModal :isShow="modalIsShow" :modalName="'sttlTaxBill'" :modalTitle="'세금계산서'" @modalclose="modalclose" >
		<template #modalcontent>
            <div class="ui-modal-body">
                <div class="ui-title-3">
                    <p>* 본 화면에 기재된 값을 팝빌로 전송합니다. 최종 발행/수정은 팝빌에서 진행합니다.</p>
                </div>
                <div class="ui-section">
                    <div class="ui-title-3">
                        <h3>기본 정보</h3>
                        <!-- <div class="abs">
                            <button type="button" class="btn btn-ss">수정하기</button>
                        </div> -->
                    </div>
                    <div class="ui-content">
                        <div class="tbl-wrap">
                            <table class="table reg">
                                <colgroup>
                                    <col style="width: 120px;">
                                    <col style="width: auto;">
                                    <col style="width: 120px;">
                                    <col style="width: auto;">
                                    <col style="width: 120px;">
                                    <col style="width: auto;">
                                </colgroup>
                                <tbody>
                                    <tr>
                                        <th scope="row">과세구분</th>
                                        <td>{{taxBillInfo.taxType}}</td>
                                        <th scope="row">거래처유형</th>
                                        <td>{{taxBillInfo.invoiceeType}}</td>
                                        <th scope="row">작성일자</th>
                                        <td>{{dayJS(taxBillInfo.writeDate, 'YYYYMMDD').format('YYYY.MM.DD') }}</td>
                                        
                                    </tr>
                                    <tr>
                                        <th scope="row">공급가액</th>
                                        <td class="right">{{sttlLib.formatMoney({value:taxBillInfo.supplyCostTotal})}}원</td>
                                        <th scope="row">세액</th>
                                        <td class="right">{{sttlLib.formatMoney({value:taxBillInfo.taxTotal})}}원</td>
                                        <th scope="row">합계</th>
                                        <td class="right">{{sttlLib.formatMoney({value:taxBillInfo.supplyCostTotal + taxBillInfo.taxTotal})}}원</td>
                                    </tr>
                                    <tr>
                                        <th scope="row">비고</th>
                                        <td colspan="5">
                                            <input type="text" class="form-control sm w-600" maxlength="150" placeholder="150자 이하로 작성" v-model="taxBillInfo.remark1">
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
                <div class="ui-section">
                    <div class="ui-title-3">
                        <h3>공급자 정보</h3>
                        <!-- <div class="abs">
                            <button type="button" class="btn btn-ss">수정하기</button>
                        </div> -->
                    </div>
                    <div class="ui-content">
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
                                        <th scope="row">등록번호</th>
                                        <td>{{sttlLib.formatBrm(taxBillInfo.invoicerCorpNum)}}</td>
                                        <th scope="row">종사업장</th>
                                        <td>{{taxBillInfo.invoicerTaxRegID}}</td>
                                    </tr>
                                    <tr>
                                        <th scope="row">상호</th>
                                        <td>{{taxBillInfo.invoicerCorpName}}</td>
                                        <th scope="row">성명</th>
                                        <td>{{taxBillInfo.invoicerCeoName}}</td>
                                    </tr>
                                    <tr>
                                        <th scope="row">사업장주소</th>
                                        <td colspan="3">{{taxBillInfo.invoicerAddress}}</td>
                                    </tr>
                                    <tr>
                                        <th scope="row">업태</th>
                                        <td>{{taxBillInfo.invoicerBizType}}</td>
                                        <th scope="row">종목</th>
                                        <td>{{taxBillInfo.invoicerBizClass}}</td>
                                    </tr>
                                    <tr>
                                        <th scope="row">담당자</th>
                                        <td><input type="text" class="form-control sm w-200" maxlength="100" placeholder="담당자" v-model="taxBillInfo.invoicerContactName"></td>
                                        <th scope="row">연락처</th>
                                        <td><input type="text" class="form-control sm w-200" maxlength="20" placeholder="연락처" v-model="taxBillInfo.invoicerTel"></td>
                                    </tr>
                                 
                                    <tr>
                                        <th scope="row">이메일</th>
                                        <td colspan="3"><input type="text" class="form-control sm w-200" maxlength="100" placeholder="이메일" v-model="taxBillInfo.invoicerEmail" ></td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
                <div class="ui-section">
                    <div class="ui-title-3">
                        <h3>공급받는자 정보</h3>
                        <!-- <div class="abs">
                            <button type="button" class="btn btn-ss">수정하기</button>
                        </div> -->
                    </div>
                    <div class="ui-content">
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
                                        <th scope="row">등록번호</th>
                                        <td>{{sttlLib.formatBrm(taxBillInfo.invoiceeCorpNum)}}</td>
                                        <th scope="row">종사업장</th>
                                        <td>{{taxBillInfo.invoiceeTaxRegID}}</td>
                                    </tr>
                                    <tr>
                                        <th scope="row">상호</th>
                                        <td>{{taxBillInfo.invoiceeCorpName}}</td>
                                        <th scope="row">성명</th>
                                        <td>{{taxBillInfo.invoiceeCeoName}}</td>
                                    </tr>
                                    <tr>
                                        <th scope="row">사업장주소</th>
                                        <td colspan="3">{{taxBillInfo.invoiceeAddress}}</td>
                                    </tr>
                                    <tr>
                                        <th scope="row">업태</th>
                                        <td>{{taxBillInfo.invoiceeBizType}}</td>
                                        <th scope="row">종목</th>
                                        <td>{{taxBillInfo.invoiceeBizClass}}</td>
                                    </tr>
                                    <tr>
                                        <th scope="row">담당자</th>
                                        <td><input type="text" class="form-control sm w-200" maxlength="100" v-model="taxBillInfo.invoiceeContactName"></td>
                                        <th scope="row">연락처</th>
                                        <td><input type="text" class="form-control sm w-200" maxlength="20" v-model="taxBillInfo.invoiceeTel"></td>
                                    </tr>
                                    <tr>
                                        <th scope="row">이메일</th>
                                        <td colspan="3"><input type="text" class="form-control sm w-200" maxlength="100" v-model="taxBillInfo.invoiceeEmail" ></td>
                                    </tr>
                                    <tr>
                                        <th scope="row">추가 담당자</th>
                                        <td colspan="3">
                                            <div class="reg-group" v-for="(item, index) in taxBillInfo.addContactList" :key="index">
                                                <div class="reg-item">
                                                    <input type="text" class="form-control" placeholder="성명" v-model="item.contactName">
                                                </div>
                                                <div class="reg-item">
                                                    <input type="text" class="form-control" placeholder="이메일" v-model="item.email">
                                                </div>
                                                <div class="reg-item">
                                                    <button type="button" class="btn btn-slm" @click="onRemove(index)" >삭제</button>
                                                    <button v-if="index===0" type="button" class="btn btn-slm" @click="()=>onAdd(item)">추가</button>
                                                </div>
                                            </div>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
                <div class="ui-section">
                    <div class="ui-title-3">
                        <h3>내역<span class="sub">(최대99개 까지만 표기됩니다.)</span></h3>
                    </div>
                    <div class="ui-content">
                        <div class="tbl-wrap">
                            <table class="table reg">
                                <colgroup>
                                    <col style="width: 40px">
                                    <col style="width: 40px">
                                    <col style="width: 170px">
                                    <col style="width: 70px">
                                    <col style="width: auto">
                                    <col style="width: auto">
                                    <col style="width: auto">
                                    <col style="width: auto">
                                    <col style="width: auto">
                                </colgroup>
                                <thead>
                                    <tr>
                                        <th scope="col" class="t-center">월</th>
                                        <th scope="col" class="t-center">일</th>
                                        <th scope="col" class="t-center">품목</th>
                                        <th scope="col" class="t-center">규격</th>
                                        <th scope="col" class="t-center">수량</th>
                                        <th scope="col" class="t-center">단가</th>
                                        <th scope="col" class="t-center">공급가액</th>
                                        <th scope="col" class="t-center">세액</th>
                                        <th scope="col" class="t-center">비고</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr v-for="(item, index) in taxBillInfo.detailList" :key="index">
                                        <td class="t-center">{{dayJS(item.purchaseDT, 'YYYYMMDD').format('MM')}}</td>
                                        <td class="t-center">{{dayJS(item.purchaseDT, 'YYYYMMDD').format('DD')}}</td>
                                        <td class="t-center">{{item.itemName}}</td>
                                        <td class="t-center">{{item.spec}}</td>
                                        <td class="t-center">{{item.qty}}</td>
                                        <td class="t-center">{{sttlLib.formatMoney({value:item.unitCost})}}원</td>
                                        <td class="t-center">{{sttlLib.formatMoney({value:item.supplyCost})}}원</td>
                                        <td class="t-center">{{sttlLib.formatMoney({value:item.tax})}}원</td>
                                        <td class="t-center">{{item.remark}}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                        <div class="tbl-wrap mt-10">
                            <table class="table reg">
                                <colgroup>
                                    <col style="width: 20%;">
                                </colgroup>
                                <thead>
                                    <tr>
                                        <th scope="col" class="t-center">합계금액</th>
                                        <th scope="col" class="t-center">현금</th>
                                        <th scope="col" class="t-center">수표</th>
                                        <th scope="col" class="t-center">어음</th>
                                        <th scope="col" class="t-center">외상미수금</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td class="t-right">{{sttlLib.formatMoney({value:taxBillInfo.totalAmount})}}원</td>
                                        <td class="t-right">{{sttlLib.formatMoney({value:taxBillInfo.cash})}}원</td>
                                        <td class="t-right">{{sttlLib.formatMoney({value:taxBillInfo.chkBill})}}원</td>
                                        <td class="t-right">{{sttlLib.formatMoney({value:taxBillInfo.note})}}원</td>
                                        <td class="t-right">{{sttlLib.formatMoney({value:taxBillInfo.credit})}}원</td>
                                    </tr>
                                </tbody>
                            </table>
                            <div class="table-bottom-option">
                                위 금액을 청구 합니다.
                            </div>
                        </div>
                        <div class="tbl-wrap">
                            <table class="table reg mt-10">
                                <colgroup>
                                    <col style="width: 160px;">
                                    <col style="width: auto;">
                                </colgroup>
                                <tbody>
                                    <tr>
                                        <th scope="row">첨부</th>
                                        <td>
                                            <div class="reg-group">
                                                <div class="reg-item">
                                                    <span class="checkbox">
                                                        <input :id="'billcolumChk1'" type="checkbox" v-model="taxBillInfo.businessLicenseYN">
                                                        <label :for="'billcolumChk1'" class="none-select">사업자등록증 첨부여부</label>
                                                    </span>
                                                    <span class="checkbox">
                                                        <input :id="'billcolumChk2'" type="checkbox" v-model="taxBillInfo.bankBookYN">
                                                        <label :for="'billcolumChk2'" class="none-select">통장사본첨부여부</label>
                                                    </span>
                                                </div>
                                            </div>
                                        </td>
                                    </tr>
                                    <tr>
                                        <th scope="row">관리메모</th>
                                        <td>
                                            <div class="reg-group">
                                                <div class="reg-item">
                                                    <textarea id="textarea" class="form-control" style="height: 100px" v-model="taxBillInfo.memo"></textarea>
                                                </div>
                                            </div>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
                <div class=" btn-bottom-set flex justify-center">
                    <button class="btn btn-sl posi"  type="button" :disabled="taxBillInfo.starRsStCd!=='30'" @click="onSave">
                        저장
                    </button>
                    <button type="button" class="btn btn-sl posi" :disabled="taxBillInfo.starRsStCd!=='30'" @click="onClickSend">팝빌 전송</button>
                    <button class="btn btn-sl nega" type="button" @click="modalclose">
                        확인
                    </button>
                </div>
            </div>
		</template>
	</DefaultModal>
</template>
<script setup>
import DefaultModal from '@/plugins/modal/modal/DefaultModal.vue';
import { inject, onMounted, reactive, ref, computed } from 'vue';
const dayJS = inject('dayJS');
import { _getCodeApply, _setInstlMonthlyStarTbi, _setInstlMonthlyStarTbimodify, _setInstlMonthlyStarNts } from '@/api/sttl.js';
import { sttlLib } from './module/sttlLib';
const $Modal = inject('$Modal');
const props = defineProps({
    params: Object
});
const modalIsShow = ref(false);
const emit = defineEmits(['onCloseDown']);
const modalclose = async (btn, name) => {
    console.log(btn, name);
    if (btn === 'modalconfirm') {
        // $Modal.confirm({
        //     title: '',
        //     message: '수정을 진행합니다.',
        //     buttonText: {
        //         confirm: '확인',
        //         cancel: '취소'
        //     }
        // }).then(success => {
        //     console.log(success);
        //     $Modal.alert({ message: '일자가 변경되었습니다.', buttonText: { ok: '확인' } });
        //     modalIsShow.value = false;
        // }).catch(error => {
        //     console.log(error);
        // });
        // modalIsShow.value = false;
        // emit('onCloseDown');
    } else {
        modalIsShow.value = false;
        emit('onCloseDown');
    }
};

const open = () => {
    modalIsShow.value = true;
    getDataInfo();
};

const taxBillInfo = reactive({
    invoicerCorpNum: '',
    prDlngAmt: 0,
    invoiceeTel: '',
    taxTotal: '',
    writeDate: '',
    invoicerSMSSendYN: false,
    plDlngAmt: 0,
    invoiceeEmail: '',
    addContactList: [],
    prVat: 0,
    credit: '',
    purposeType: '',
    cash: '',
    invoiceeCeoName: '',
    taxType: '',
    invoiceeSMSSendYN: false,
    businessLicenseYN: false,
    invoicerMgtKey: '',
    supplyCostTotal: 0,
    invoicerContactName: '',
    vat: 0,
    invoiceeContactName: '',
    invoiceeType: '',
    issueType: '',
    totalAmount: 0,
    starRsStCd: '',
    mbrCnt: 0,
    invoicerTaxRegID: '',
    detailList: [],
    invoiceeTaxRegID: '',
    sttlEps: 0,
    remark1: '',
    dlngAmt: 0,
    note: '',
    ntsRsltCd: '',
    invoicerDeptName: '',
    chkBill: '',
    invoiceeCorpName: '',
    tbiNo: '',
    ntsFrwDt: '',
    invoicerAddress: '',
    invoicerBizType: '',
    plVat: 0,
    invoiceeDeptName: '',
    plSpvl: 0,
    sttlYm: '',
    invoicerCorpName: '',
    tbiPlDate: '',
    invoicerTel: '',
    invoiceeBizType: '',
    invoicerCeoName: '',
    invoicerBizClass: '',
    invoiceeCorpNum: '',
    pyrId: '',
    spvl: 0,
    invoiceeBizClass: '',
    bankBookYN: false,
    invoiceeAddress: '',
    invoicerEmail: '',
    chargeDirection: '',
    ntsTbiNo: '',
    prdCnt: 0,
    prSpvl: 0,
    memo: ''
});


const getDataInfo = async () => {
    // await _getCodeApply('STAR_DLNG_SE_CD', starDlngSeCdList);
    // await _getCodeApply('STAR_STTL_SE_CD', starSttlSeCdList);
    
    const response = await _setInstlMonthlyStarTbi({ ...props.params.data });
    if (response.data) {
        Object.keys(response.data.data).forEach(key => {
            taxBillInfo[key] = response.data.data[key];
        });
        if (taxBillInfo.addContactList?.length < 1) {
            onAdd();
        }
    }
};

const validatePhoneNumber = (num) => {
    const regex = /^\d{2,3}-\d{3,4}-\d{4}$/;
    return regex.test(num);
};

const validateEmail = (email) => {
    const regex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z]{2,4}$/;
    return regex.test(email);
};

const fieldValidation = async () => {
    if (!taxBillInfo.invoicerContactName) {
        await $Modal.alert({ message: '공급자 정보의  담당자는 필수 값입니다.', buttonText: { ok: '확인' } });
        return false;
    }
    if (!taxBillInfo.invoicerTel) {
        await $Modal.alert({ message: '공급자 정보의  담당자 연락처는 필수 값입니다.', buttonText: { ok: '확인' } });
        return false;
    }
    if (!validatePhoneNumber(taxBillInfo.invoicerTel)) {
        await $Modal.alert({ message: '공급자 정보의  담당자 연락처는 전화번호 형식에 맞지 않습니다.', buttonText: { ok: '확인' } });
        return false;
    }
    if (!taxBillInfo.invoicerEmail) {
        await $Modal.alert({ message: '공급자 정보의 담당자 이메일은 필수 값입니다.', buttonText: { ok: '확인' } });
        return false;
    }
    if (!validateEmail(taxBillInfo.invoicerEmail)) {
        await $Modal.alert({ message: '공급자 정보의 담당자 이메일 형식에 맞지 않습니다..', buttonText: { ok: '확인' } });
        return false;
    }
    if (!taxBillInfo.invoiceeContactName) {
        await $Modal.alert({ message: '공급받는자 정보의 담당자는 필수 값입니다.', buttonText: { ok: '확인' } });
        return false;
    }
    if (!taxBillInfo.invoiceeTel) {
        await $Modal.alert({ message: '공급받는자 정보의 담당자 연락처는 필수 값입니다.', buttonText: { ok: '확인' } });
        return false;
    }
    if (!validatePhoneNumber(taxBillInfo.invoiceeTel)) {
        await $Modal.alert({ message: '공급받는자 정보의 담당자 연락처는 전화번호 형식에 맞지 않습니다.', buttonText: { ok: '확인' } });
        return false;
    }
    if (!taxBillInfo.invoiceeEmail) {
        await $Modal.alert({ message: '공급받는자 정보의 담당자 이메일은 필수 값입니다.', buttonText: { ok: '확인' } });
        return false;
    }
    if (!validateEmail(taxBillInfo.invoiceeEmail)) {
        await $Modal.alert({ message: '공급받는자 정보의 담당자 이메일 형식에 맞지 않습니다.', buttonText: { ok: '확인' } });
        return false;
    }
    return true;
};

const onClickSend = async () => {
    const isError = await onSave({send: true});
    if (isError) {
        reOpen();
        return;
    }
    const response = await _setInstlMonthlyStarNts({ list: [...props.params.data] });
    if (response.data.code === 'OK') {
        await $Modal.alert({ message: '팝빌로 전송되었습니다.', buttonText: { ok: '확인' } });
        modalclose();
    } else {
        await $Modal.alert({ message: response.data.message, buttonText: { ok: '확인' } });
        reOpen();
    }
};

const validateAddcontactList = async () => {
    let isEmpty = false;
    let isErrorOnEmail = false;
    taxBillInfo.addContactList.forEach((r) => {
        if (!isEmpty && (!r.email && r.contactName || r.email && !r.contactName)) {
            isEmpty = true;
        }
        if (r.email && !validateEmail(r.email)) {
            isErrorOnEmail = true;
        }
    });
    if (isEmpty) {
        await $Modal.alert({ message: '추가 담당자 입력시 성명과 이메일을 모두 입력하셔야합니다.', buttonText: { ok: '확인' } });
        return false;
    }
    if (isErrorOnEmail) {
        await $Modal.alert({ message: '추가 담당자 이메일이 형식에 맞지 않습니다.', buttonText: { ok: '확인' } });
        return false;
    }
    return true;
};

const onSave = async (params) => {
    console.log(params);
    const validated = await fieldValidation();
    const validatedAdd = await validateAddcontactList();
    if (validated && validatedAdd) {
        taxBillInfo.addContactList = taxBillInfo.addContactList.map((r, i) => {
            r.serialNum = i + 1;
            return r;
        }).filter(r => r.email && r.contactName);
        
        const response = await _setInstlMonthlyStarTbimodify({ ...taxBillInfo });
        if (response.data.code === 'OK') {
            if (taxBillInfo.addContactList?.length < 1) {
                onAdd();
            }
            if (params?.send) {
                return false;
            } else {
                await $Modal.alert({ message: '저장 되었습니다.', buttonText: { ok: '확인' } });
                reOpen();
            }
        } else {
            if (params?.send) {
                return true;
            }
            await $Modal.alert({ message: response.data.message, buttonText: { ok: '확인' } });
            getDataInfo();
            reOpen();
        }
    } else {
        if (params?.send) {
            return true;
        }
        reOpen();
    }
};

const reOpen = () => {
    modalIsShow.value = false;
    window.setTimeout(() => {
        modalIsShow.value = true;
    }, 10);
};

const onRemove = (index) => {
    taxBillInfo.addContactList = [...taxBillInfo.addContactList.slice(0, index), ...taxBillInfo.addContactList.slice(index + 1)];
    if (taxBillInfo.addContactList?.length < 1) {
        onAdd();
    }
};

const onAdd = (e) => {
    if (taxBillInfo.addContactList.length < 5)
        taxBillInfo.addContactList.push({
            email: '',
            serialNum: taxBillInfo.addContactList.length + 1,
            contactName: ''
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
.none-select{
    user-select: none;
}
</style>