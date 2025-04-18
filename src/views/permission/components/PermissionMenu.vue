<template>
    <tr>
        <td class="t-left">
            <div class="menu-tree" :class="dep ? `dep-${dep}` : ''">
                <span class="checkbox">
                    <input :id="`menuChk_${dep}_${index}`" name="menuGroup" type="checkbox" :checked="!state.formData.isMenu ? state.isAllDisabled ? false : state.isAllChecked : state.rowAllChecked"
                        @input="onChange" :disabled="(!state.formData.isMenu && state.isRowDisabled) || (state.formData.isMenu && isRowDisabledItem(state.formData))" />
                    <label :for="`menuChk_${dep}_${index}`">{{ state.formData.mnuNm }}</label>
                </span>
            </div>
        </td>
        <td>
            <template v-if="state.formData.isMenu">
                <span class="checkbox">
                    <input :id="`auth1RgsYn_${dep}_${index}`" name="auth1RgsYn" type="checkbox"
                        v-model="state.formData.auth1RgsYn" true-value="Y" false-value="N"
                        @change="onChangeItem(state.formData, 'auth1RgsYn')"
                        :disabled="state.formData.menuAuth1RgsYn === 'N'" />
                    <label :for="`auth1RgsYn_${dep}_${index}`">등록</label>
                </span>
                <span class="checkbox">
                    <input :id="`auth2UpdYn_${dep}_${index}`" name="auth2UpdYn" type="checkbox"
                        v-model="state.formData.auth2UpdYn" true-value="Y" false-value="N"
                        @change="onChangeItem(state.formData, 'auth2UpdYn')"
                        :disabled="state.formData.menuAuth2UpdYn === 'N'" />
                    <label :for="`auth2UpdYn_${dep}_${index}`">수정</label>
                </span>
                <span class="checkbox">
                    <input :id="`auth3DelYn_${dep}_${index}`" name="auth3DelYn" type="checkbox"
                        v-model="state.formData.auth3DelYn" true-value="Y" false-value="N"
                        @update="state.formData.auth3DelYn"
                        @change="onChangeItem(state.formData, 'auth3DelYn')"
                        :disabled="state.formData.menuAuth3DelYn === 'N'" />
                    <label :for="`auth3DelYn_${dep}_${index}`">삭제</label>
                </span>
                <span class="checkbox">
                    <!-- {{ state.formData.auth5DwnlYn }} -->
                    <input :id="`auth5DwnlYn_${dep}_${index}`" name="auth5DwnlYn" type="checkbox"
                        v-model="state.formData.auth5DwnlYn" true-value="Y" false-value="N"
                        @change="onChangeItem(state.formData, 'auth5DwnlYn')"
                        :disabled="state.formData.menuAuth5DwnlYn === 'N'" />
                    <label :for="`auth5DwnlYn_${dep}_${index}`">다운로드</label>
                </span>
                <span class="checkbox">
                    <input :id="`auth4AprvYn_${dep}_${index}`" name="auth4AprvYn" type="checkbox"
                        v-model="state.formData.auth4AprvYn" true-value="Y" false-value="N"
                        @change="onChangeItem(state.formData, 'auth4AprvYn')"
                        :disabled="state.formData.menuAuth4AprvYn === 'N'" />
                    <label :for="`auth4AprvYn_${dep}_${index}`">승인</label>
                </span>
                <span class="checkbox">
                    <input :id="`auth6MskgnYn_${dep}_${index}`" name="auth6MskgnYn" type="checkbox"
                        v-model="state.formData.auth6MskgnYn" true-value="Y" false-value="N"
                        @change="onChangeItem(state.formData, 'auth6MskgnYn')"
                        :disabled="state.formData.menuAuth6MskgnYn === 'N'" />
                    <label :for="`auth6MskgnYn_${dep}_${index}`">마스킹해제</label>
                </span>
            </template>
        </td>
        <td>
            <template v-if="state.formData.isMenu">
                {{ state.formData.fstRgtrSnNm }}
            </template>
        </td>
        <td>
            <template v-if="state.formData.isMenu">
                {{ state.formData.fstRgsDt }}
            </template>
        </td>
    </tr>
</template>
<script>
import { onMounted, watch } from 'vue';
import { getCurrentInstance, computed, reactive } from 'vue';
export default {
    props: ['updateAllCheck', 'formData', 'dep', 'index'],
    emits: ['formDataChange'],
    setup(props) {
        const { emit } = getCurrentInstance();
        const state = reactive({
            // parentData: computed(() => props.parentData),
            updateAllCheck: computed(() => props.updateAllCheck),
            formData: computed(() => props.formData),
            isAllChecked: false,
            rowAllChecked: false,
            isRowDisabled: false,
            isAllDisabled: false
        });

        watch(props, () => {
            console.log('props.updateAllCheck', props.updateAllCheck);
            state.rowAllChecked = isRowCheckedItem(state.formData) && !isRowDisabledItem(state.formData);
            state.isAllChecked = isAllCheckedItem();
        });

        onMounted(() => {
            state.rowAllChecked = isRowCheckedItem(state.formData) && !isRowDisabledItem(state.formData);
            state.isAllChecked = isAllCheckedItem();
            state.isAllDisabled = isAllDisabledItem();

            isParentDisabledItem();

        });

        /**
         * row item all change
         */
        const onChange = (event) => {
            console.log('event.target.value', event.target.checked, state.formData.isMenu);
            if (state.formData.isMenu) state.rowAllChecked = event.target.checked;
            // else state.isAllChecked = event.target.checked; // watch props 로 대체
            
            changeValue(state.formData, event.target.checked ? 'Y' : 'N');
            if (state.formData.list) {
                for (let i = 0; i < state.formData.list.length; i++) {
                    changeValue(state.formData.list[i], event.target.checked ? 'Y' : 'N');
                    if (state.formData.list[i].list) {
                        for (let j = 0; j < state.formData.list[i].list.length; j++) {
                            changeValue(state.formData.list[i].list[j], event.target.checked ? 'Y' : 'N');
                            if (state.formData.list[i].list[j].list) {
                                for (let k = 0; k < state.formData.list[i].list[j].list.length; k++) {
                                    changeValue(state.formData.list[i].list[j].list[k], event.target.checked ? 'Y' : 'N');
                                }
                            }
                        }
                    }
                }
            }

            emit('formDataChange', state.formData);
        };

        /**
         * @target ? 단일 아이템
         * target 없으면 all
         */
        const changeValue = (data, val, target) => {
            console.log('changeValue', val, target);
            if (target) {
                data[target] = val;
            } else {
                data.auth1RgsYn = data.menuAuth1RgsYn === 'Y' ? val : 'N';
                data.auth2UpdYn = data.menuAuth2UpdYn === 'Y' ? val : 'N';
                data.auth3DelYn = data.menuAuth3DelYn === 'Y' ? val : 'N';
                data.auth4AprvYn = data.menuAuth4AprvYn === 'Y' ? val : 'N';
                data.auth5DwnlYn = data.menuAuth5DwnlYn === 'Y' ? val : 'N';
                data.auth6MskgnYn = data.menuAuth6MskgnYn === 'Y' ? val : 'N';

            }
        };

        /**
         * data change
         */
        const onChangeItem = (formData, target) => {
            emit('formDataChange', formData);
            console.log('onChangeItem > state.formData[target]', state.formData[target]);
            if (state.formData.list) {
                for (let i = 0; i < state.formData.list.length; i++) {
                    changeValue(state.formData.list[i], state.formData[target], target);
                    if (state.formData.list[i].list) {
                        for (let j = 0; j < state.formData.list[i].list.length; j++) {
                            changeValue(state.formData.list[i].list[j], state.formData[target], target);
                        }
                    }
                }
            }

            state.rowAllChecked = isRowCheckedItem(state.formData) && !isRowDisabledItem(state.formData);
            // state.isAllChecked = isAllCheckedItem();
            
        };

        /**
         * rowData all Check
         */
        const isRowCheckedItem = (data) => {
            return (data.menuAuth1RgsYn === 'N' || data.auth1RgsYn === 'Y') &&
                (data.menuAuth2UpdYn === 'N' || data.auth2UpdYn === 'Y') &&
                (data.menuAuth3DelYn === 'N' || data.auth3DelYn === 'Y') &&
                (data.menuAuth4AprvYn === 'N' || data.auth4AprvYn === 'Y') &&
                (data.menuAuth5DwnlYn === 'N' || data.auth5DwnlYn === 'Y') &&
                (data.menuAuth6MskgnYn === 'N' || data.auth6MskgnYn === 'Y');

            // console.log('isRowCheckedItem result', state.rowAllChecked);
        };
        const isAllCheckedItem = () => {
            let isAll = true;
            if (state.formData.list) {
                for (let i = 0; i < state.formData.list.length; i++) {
                    if (!isRowCheckedItem(state.formData.list[i])) isAll = false;
                    if (state.formData.list[i].list) {
                        for (let j = 0; j < state.formData.list[i].list.length; j++) {
                            if (!isRowCheckedItem(state.formData.list[i].list[j])) isAll = false;
                        }
                    }
                }
            }

            if (state.formData.mnuNm === '회원관리') console.log(isAll);
            return isAll;
        };
        const isAllDisabledItem = () => {
            let isAll = true;
            if (state.formData.list) {
                for (let i = 0; i < state.formData.list.length; i++) {
                    if (!isRowDisabledItem(state.formData.list[i])) isAll = false;
                    if (state.formData.list[i].list) {
                        for (let j = 0; j < state.formData.list[i].list.length; j++) {
                            if (!isRowDisabledItem(state.formData.list[i].list[j])) isAll = false;
                        }
                    }
                }
            }

            // if (state.formData.mnuNm === '회원관리') console.log(isAll);
            return isAll;
        };

        /**
         * 권한 disabled 여부 체크
         */
        const isParentDisabledItem = () => {
            let isDisable = true;
            if (state.formData.list) {
                for (let i = 0; i < state.formData.list.length; i++) {
                    // console.log('isRowCheckedItem(state.formData.list[i]', isRowDisabledItem(state.formData.list[i]));
                    if (!isRowDisabledItem(state.formData.list[i])) isDisable = false;
                    if (state.formData.list[i].list) {
                        for (let j = 0; j < state.formData.list[i].list.length; j++) {
                            if (!isRowDisabledItem(state.formData.list[i].list[j])) isDisable = false;
                        }
                    }
                }
            }
            state.isRowDisabled = isDisable;
        };
        /**
         * rowData all Check
         */
        const isRowDisabledItem = (data) => {
            return (data.menuAuth1RgsYn === 'N' && data.menuAuth2UpdYn === 'N' && data.menuAuth3DelYn === 'N' && data.menuAuth4AprvYn === 'N' && data.menuAuth5DwnlYn === 'N' && data.menuAuth6MskgnYn === 'N');
        };
        return {
            props,
            state,
            isParentDisabledItem,
            isAllCheckedItem,
            isRowDisabledItem,
            onChange,
            onChangeItem
        };
    }
};
</script>