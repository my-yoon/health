<template>
    <div class="treegroup">
        <span class="treeTitle">{{ state.treeTitle }}</span>
        <ul>
            <li v-for="(tree, index) in state.trees" :key="index">
                <span @click.prevent="(e) => tree.subtree ? openFolder(e) : null">{{ tree.label }}</span>
                <ul class="hidden">
                    <li v-for="(item, idx) in tree.subtree" :key="idx">
                        <span @click.prevent="(e) => item.subtree ? openFolder(e) : null">{{ item.label }}</span>
                        <ul class="hidden">
                            <li v-for="(type, index) in item.subtree" :key="index">
                                <span>{{ type.label }}</span>
                            </li>
                        </ul>
                    </li>
                </ul>
            </li>
        </ul>
    </div>
</template>
<script>
import { reactive, computed } from 'vue';
export default {
    props: ['treelist', 'treeTitle'],
    setup(props) {
        const state = reactive({
            trees: computed(() => props.treelist),
            treeTitle: computed(() => props.treeTitle)
        });
        const openFolder = (e) => {
            let node = e.target.parentNode.lastChild;
            if (node.classList.contains('hidden')) {
                node.classList.remove('hidden');
            } else {
                node.classList.add('hidden');
            }
        };
        return {
            state,
            openFolder
        };
    }
};
</script>