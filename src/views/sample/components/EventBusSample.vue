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
이벤트 송신
&lt;template&gt;
    &lt;button @click="selectedCallback"&gt;&lt;/button&gt;
&lt;/template&gt;
&lt;script&gt;
export default {
    setup() {
        ...
        const selectedCallback = () => {
            emitter.$emit('eventBus_bus', '데이터 전달');
        };
        return {
            
        }
    }
}
&lt;/script&gt;
이벤트 수신
&lt;script&gt;
export default {
    setup() {
        ...
        onMounted(() => {
            emitter.$on('eventBus_bus', resiveCallback);
        });
        const resiveCallback = () => {
            console.log('Eventbus 사용');
        };
        return {
            
        }
    }
}
&lt;/script&gt;
`
        });
        return {
            state
        };
    }
};
</script>
