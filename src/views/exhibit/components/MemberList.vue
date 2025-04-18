<template>
    <div>
        <div class="mt-20">
            <button type="button" class="btn btn-slm" @click="onChangeMember">삭제</button>
        </div>
        <div class="tbl-wrap mt-10">
            <div class="table-list">
                <table class="table list">
                    <caption>회원그룹관리</caption>
                    <colgroup>
                        <col style="width: 45px;">
                        <col style="width: 100px;">
                        <col style="width: 120px;">
                        <col style="width: auto;">
                        <col style="width: 160px;">
                    </colgroup>
                    <thead>
                        <tr>
                            <th scope="col" class="t-left">
                                <span class="checkbox">
                                    <input id="memberAll" name="memberGroup" type="checkbox" @change="onSelectedRow('all')">
                                    <label for="memberAll"></label>
                                </span>
                            </th>
                            <th scope="col">번호</th>
                            <th scope="col">그룹명</th>
                            <th scope="col">그룹설명</th>
                            <th scope="col">그룹회원수</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(item, index) in state.memberlist" :key="index">
                            <td>
                                <span class="checkbox">
                                    <input :id="'memberAll' + index" name="memberGroup" type="checkbox"
                                        @change="onSelectedRow('list', index, item.grpSn)">
                                    <label :for="'memberAll' + index"></label>
                                </span>
                            </td>
                            <td>{{ item.grpSn }}</td>
                            <td>{{ item.grpNm }}</td>
                            <td>{{ item.grpDscr }}</td>
                            <td>{{ item.mbrCnt }}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
</template>
<script>
import { getCurrentInstance, computed, reactive, inject, onMounted, ref, watch } from 'vue';
import { useCommFunc } from '@/core/helper/common.js';
import { format } from 'date-fns';
import { useStore } from 'vuex';
export default {
    props: ['memberlist'],
    setup(props) {
        const internalInstance = getCurrentInstance();
        const { emit } = getCurrentInstance();
        // const dayJS = inject('dayJS');
        const store = useStore();
        const state = reactive({
            memberlist: computed(() => props.memberlist),
            // emit('onChangeOrder', state.seqGroup);
            rowlist: []
        });
        const onChangeallCheck = (type) => {
            for (let i = 0; i < state.memberlist.length; i++) {
                if (type) {
                    document.querySelector(`#memberAll${i}`).checked = true;
                    for (let i = 0; i < state.memberlist.length; i++) {
                        if (!state.rowlist.includes(state.memberlist[i].grpSn))
                            state.rowlist.push(state.memberlist[i].grpSn);
                    }
                } else {
                    document.querySelector(`#memberAll${i}`).checked = false;
                    state.rowlist = [];
                }
            }
        };
        const onSelectedRow = (type, index, value) => {
            if (type === 'all') {
                onChangeallCheck(document.querySelector(`#memberAll`).checked);
            } else {
                if (document.querySelector(`#memberAll${index}`).checked) {
                    state.rowlist.splice(index, 0, value);
                } else {
                    state.rowlist.splice(index, 1);
                }

                //전체 선택
                if ((state.rowlist.length === state.memberlist.length) && state.rowlist.length !== 0) {
                    document.querySelector(`#memberAll`).checked = true;
                } else {
                    document.querySelector(`#memberAll`).checked = false;
                }
            }

        };
        const onChangeMember = () => {
            emit('onChangeMember', state.rowlist);
        };
        return {
            state,
            onChangeMember,
            onSelectedRow
        };
    }
};
</script>