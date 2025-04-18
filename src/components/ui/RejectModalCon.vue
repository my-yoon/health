<template>
    <div>
        <div class="ui-title-3">
            <h3>{{ state.subTitle }}</h3>
        </div>
        <div class="form-item mt-10">
        <textarea id="textarea" v-model="state.rejectReason" class="form-control" placeholder="반려사유를 입력하세요." style="height: 150px"
                  @change="rejectConfirm('reason', state.rejectReason)"></textarea>
        </div>
    </div>
</template>
<style scoped>
.reg-item #textarea {
    height: 100px
}
</style>
<script>
import {computed, getCurrentInstance, reactive} from 'vue';

export default {
    props: ['subTitle'],
    emits: ['rejectFormat'],
    setup(props) {
        const {emit} = getCurrentInstance();
        const state = reactive({
            subTitle: computed(() => props.subTitle ?? '반려사유를 등록해주세요.'),
            rejectReason: ''
        });
        const rejectConfirm = (type, con) => {
            console.log(type, con);
            emit('rejectFormat', type, con);
        };
        return {
            state,
            rejectConfirm
        };
    }

};

</script>