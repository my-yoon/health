<template>

    <DefaultModal :isShow="modalIsShow" :modalName="'editDate'" :modalTitle="'요청/종료일 수정'" :buttonConfirm="'확인'" @modalclose="modalclose" >
		<template #modalcontent>
            <div class="tbl-wrap mt-10">
                <table class="table reg mt-10">
                    <colgroup>
                        <col style="width: 100px;">
                        <col style="width: auto;">
                    </colgroup>
                    <tbody>
                        <tr>
                            <th scope="row">요청일</th>
                            <td>
                                <div class="reg-group">
                                    <div class="reg-item">
                                        <div class="ui-datepicker relative"> <!-- 캘린더가 나올 공간이 없어 position 속성 변경 'relative' 클래스 추가 -->
                                            <Datepicker v-model="date" position="left" :enableTimePicker="false"
                                                :clearable="false" :format="dateFormat" autoApply></Datepicker>
                                        </div>
                                    </div>
                                </div>
                            </td>
                        </tr>
                        <tr>
                            <th scope="row">종료일</th>
                            <td>
                                <div class="reg-group">
                                    <div class="reg-item">
                                        <div class="ui-datepicker relative"> <!-- 캘린더가 나올 공간이 없어 position 속성 변경 'relative' 클래스 추가 -->
                                            <Datepicker v-model="date" position="left" :enableTimePicker="false"
                                                :clearable="false" :format="dateFormat" autoApply></Datepicker>
                                        </div>
                                    </div>
                                </div>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
		</template>
	</DefaultModal>
</template>
<script setup>
import DefaultModal from '@/plugins/modal/modal/DefaultModal.vue';
import { inject, onMounted, ref } from 'vue';
const $Modal = inject('$Modal');
const modalIsShow = ref(false);
const modalclose = async (btn, name) => {
    console.log(btn, name);
    if (btn === 'modalconfirm') {
        $Modal.confirm({
            title: '',
            message: '수정을 진행합니다.',
            buttonText: {
                confirm: '확인',
                cancel: '취소'
            }
        }).then(success => {
            console.log(success);
            $Modal.alert({ message: '일자가 변경되었습니다.', buttonText: { ok: '확인' } });
            modalIsShow.value = false;
        }).catch(error => {
            console.log(error);
        });
    } else {
        modalIsShow.value = false;
    }
};
const open = () => {
    modalIsShow.value = true;
};

// onMounted(() => {
//     open();
// });

defineExpose({
    open
});

</script>
