<template>
    <div class="guides">
        <div class="sample">
            <pre class="language-javasciprt">
                <code class="language-javasciprt"  v-html="state.sampleCodeJS"  />
            </pre>
        </div>
    </div>
</template>
<script>

import { reactive } from 'vue';
export default {
    setup() {
        const state = reactive({
            sampleCodeJS: `
&lt;template&gt;
    &lt;div&gt;
        &lt;button @click="openModal('isPartnerShow')" &gt;파트너조회 팝업&lt;/button&gt;
        &lt;button @click="openModal('isDownShow')" &gt;다운로드 사유 등록 팝업&lt;/button&gt;
        &lt;button @click="openModal('isImgShow')" &gt;사업자등록증 사본 팝업&lt;/button&gt;
        &lt;button @click="openModal('isRequestShow')" &gt;가입재신청 사유 등록 팝업&lt;/button&gt;
        &lt;DefaultModal :isShow="isPartnerShow" :modalTitle="'파트너 조회'" :buttonConfirm="'닫기'" :buttonCancel="''"
            :modalName="'isPartnerShow'" @modalclose="modalControl"&gt;
            &lt;template #modalcontent&gt;
                //파트너 리스트 조회 공통 컴포넌트 처리(컴포넌트 글로벌등록)
                &lt;PartnerSerch @selectPartner="selectPartner" /&gt;
            &lt;/template&gt;
        &lt/DefaultModal&gt;
        &ltDefaultModal :isShow="isDownShow" :modalTitle="'다운로드 사유 등록'" :buttonConfirm="'저장'" :buttonCancel="''"
            :modalName="'isDownShow'" @modalclose="modalControl"&gt;
            &lttemplate #modalcontent&gt;
                //사유등록 폼 공통 컴포넌트 처리(컴포넌트 글로벌등록)
                &ltDownModalCon @downloadFormat="downConfirm" /&gt;
            &lt/template&gt;
        &lt/DefaultModal&gt;
        &ltDefaultModal :isShow="isImgShow" :modalTitle="'사업자등록증 사본'" :buttonConfirm="'닫기'" :buttonCancel="''"
            :modalName="'isImgShow'" @modalclose="modalControl"&gt;
            &lttemplate #modalcontent&gt;
                &ltdiv class="ui-img-section"&gt;
                    {{ state.imgName }}
                &lt/div&gt;
            &lt/template&gt;
        &lt/DefaultModal&gt;
        &ltDefaultModal isShow="isRequestShow" :modalTitle="'가입재신청 사유 등록'" :buttonConfirm="'확인'" :buttonCancel="'취소'"
            :modalName="'isRequestShow'" @modalclose="modalControl"&gt;
            &lt/template #modalcontent&gt;
                //사유등록 폼 공통 컴포넌트 처리(컴포넌트 글로벌등록)
                &ltRequestRegist @requestFormat="requestConfirm" /&gt;
            &lt/template&gt;
        &lt/DefaultModal&gt;
    &lt;/div&gt;
&lt;/template&gt;
&lt;script&gt;
import { ref } from 'vue';
import { useCommFunc } from '@/core/helper/common.js';
import DefaultModal from '@/plugins/modal/modal/DefaultModal.vue';
export default {
    components: { DefaultModal },
    setup() {
        const { 
            //공통팝업 함수 
            openModal, 
            //공통팝업 사용 데이터 
            isPartnerShow, 
            isDownShow, 
            isImgShow,
            isRequestShow 
        } = useCommFunc();
        const state = reactive({
            // 사유등록 내용
            download: { pass: '', reason: '' }
        })
        //파트너 선택
        const selectPartner = (data) => {
            state.partnerName = data;
            console.log(data);
        };
        // 재가입요청 데이터 처리
        const requestConfirm = (type, con) => {
            console.log(type, con);
            if (type === 'title') {
                state.request.title = con;
            } else {
                state.request.con = con;
            }
        };
        //사업자등록증 사본
        const imgfile = (fileName) => {
            state.imgName = fileName;
        };
        // 모달창 닫기
        const modalControl = (type, modalName) => {
            if (modalName === 'isPartnerShow') {
                isPartnerShow.value = false;
            } else if (modalName === 'isDownShow') {
                isDownShow.value = false;
                fileDown(state.download);
            } else if (!modalName) {
                isPartnerShow.value = false;
                isDownShow.value = false;
            }
            console.log(type, modalName);
        };
        return {
            isDownShow,
            isPartnerShow,
            isImgShow,
            openModal,
            selectPartner,
            requestConfirm,
            imgfile,
            modalControl
        }
    }
}
&lt;/script&gt;`
        });
        return {
            state
        };
    }
};
</script>
