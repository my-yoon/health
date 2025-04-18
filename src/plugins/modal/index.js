const $Modal = {
    simple: (v) => {
        console.log('>>>', app, emitter);
        return new Promise((resolve, reject) => {
            emitter.$emit('modalsimple', v, { resolve, reject });
        });
    },
    alert: (v) => {
        return new Promise((resolve, reject) => {
            emitter.$emit('modalalert', v, { resolve, reject });
        });
    },
    confirm: (v) => {
        console.log('>>>', app, emitter);
        return new Promise((resolve, reject) => {
            emitter.$emit('modalconfirm', v, { resolve, reject });
        });
    }
};

export default $Modal;