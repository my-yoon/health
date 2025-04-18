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
        &lt;button @click="modal('simple')"&gt;단순 심플&lt;/button&gt;
        &lt;button @click="modal('alert')"&gt;alert modal&lt;/button&gt;&gt;
        &lt;button @click="modal('confirm')"&gt;confirm modal&lt;/button&gt;
    &lt;/div&gt;
&lt;/template&gt;
&lt;script&gt;
import { inject } from 'vue';
export default {
    setup() {
        const $Modal = inject('$Modal');
        const modal = (type) => {
            if (type === 'simple') {
                $Modal.simple({
                    title: 'default modal title',
                    message: 'This is a simple modal.',
                    buttonText: {
                        ok: '확인'
                    }
                })
                    .then(success => {
                        console.log(success);
                    })
                    .catch(error => {
                        console.log(error);
                    });
            } else if (type === 'alert') {
                $Modal.alert({
                    title: 'alertt modal title',
                    message: 'alert modal.',
                    closeButtonHide: true
                });
            } else if (type === 'confirm') {
                $Modal.confirm({
                    title: 'confirm modal title',
                    message: 'This is a confirm modal.',

                    buttonText: {
                        confirm: '확인',
                        cancel: '취소'
                    }
                })
                    .then(success => {
                        console.log(success);
                    })
                    .catch(error => {
                        console.log(error);
                    });
            }
        };
        return {
            $Modal,
            modal
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
