import { reactive, ref, inject } from 'vue';

export function dmCommFunc() {
    const Modal = inject('$Modal');
    const searchShow = ref(false);
    const isShow = ref(false);

    const addComma = (num) => num ? num.toLocaleString('ko') : '';

    const popInfo = reactive({
        modalType: null,
        modalTitle: null,
        modalMessage: null,
        confirmNm: '확인',
        cancelNm: '취소'
    });

    const toggleSearch = () => {
        searchShow.value = !searchShow.value;
    };

    const modal = (message) => {
        Modal.simple({title: '경고', message: message, buttonText: {ok: '확인'}});
    };
    
    return {
        searchShow,
        popInfo,
        isShow,
        toggleSearch,
        modal,
        addComma
    };
}