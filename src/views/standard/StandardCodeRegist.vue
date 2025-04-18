<template>
    <div class="ui-code-group">
        <div class="ui-code-tree">
            <div class="ui-code-tree-wrap">
                <div class="ui-code-tree-head">
                    <div class="ui-code-tree-search">
                        <input type="text" class="form-control slm wp-80">
                        <button type="button" class="btn btn-sm wp-20"><span class="ico-search"></span>검색</button>
                    </div>
                    <div class="ui-code-tree-btn-set">
                        <button type="button" class="btn btn-ss" @click="checkRegist">
                            <span class="ico-plus"></span>추가
                        </button>
                        <button type="button" class="btn btn-ss" @click="checkDel">
                            <span class="ico-minus"></span>삭제
                        </button>
                        <button type="button" class="btn btn-ss" @click="setTreeType">
                            <template v-if="state.treeStatus">
                                전체닫힘<span class="ico-all-open right"></span>
                            </template>
                            <template v-else>
                                전체펼침<span class="ico-all-open right"></span>
                            </template>
                        </button>
                    </div>
                </div>
                <!-- 트리메뉴 -->
                <div class="ui-code-tree-list" style="height:440px;">
                    <div class="home">
                        <a class="target-home"><span class="offscreen">홈</span></a>
                    </div>
                    <ul class="ui-tree-list">
                        <li :class="['dep-item', { fold: item.depth.length > 0 }]" v-for="(item, index) in state.commonTree"
                            :key="index">

                            <a class="target-item">
                                <em :class="{ folderbtn: item.depth.length > 0 }" @click="openTree($event)"></em>
                                <span :class="{ folder: item.depth.length > 0 }" @click="selectValue(item.cmnCd, item)">
                                    {{ item.cmnCdNm }}
                                </span>
                            </a>
                            <ul class="dep" v-if="item.depth.length > 0">
                                <li :class="['dep-item', { fold: depth.depth.length > 0 }, { hidden: !depth.useYn }]"
                                    v-for="(depth, index) in item.depth" :key="index">
                                    <a class="target-item">
                                        <em :class="{ folderbtn: depth.depth.length > 0 }"
                                            @click="($event) => { depth.depth.length > 0 ? openTree($event) : '' }">
                                        </em>
                                        <span :class="{ folder: depth.depth.length > 0 }"
                                            @click="selectValue(depth.cmnCd, depth, item.cmnCd)">
                                            {{ depth.cmnCdNm }}
                                        </span>
                                    </a>
                                    <ul class="dep" v-if="depth.depth.length > 0">
                                        <!-- 3depth -->
                                        <li :class="['dep-item', { fold: subdepth.depth.length > 0 }, { hidden: !subdepth.useYn }]"
                                            v-for=" (subdepth, index) in depth.depth" :key="index">
                                            <a class="target-item">
                                                <em :class="{ folderbtn: subdepth.depth.length > 0 }"
                                                    @click="($event) => { subdepth.depth.length > 0 ? openTree($event) : '' }"></em>
                                                <span :class="{ folder: subdepth.depth.length > 0 }"
                                                    @click="selectValue(subdepth.cmnCd, subdepth, item.cmnCd, depth.cmnCd)">
                                                    {{ subdepth.cmnCdNm }}
                                                </span>
                                            </a>
                                            <ul class="dep" v-if="subdepth.depth.length > 0">
                                                <!-- 4depth -->
                                                <li v-for="(lastdepth, index) in subdepth.depth" :key="index"
                                                    :class="{ hidden: !lastdepth.useYn }">
                                                    <a class="target-item">
                                                        <span @click="selectValue(item.value)">
                                                            {{ lastdepth.cmnCdNm }}
                                                        </span>
                                                    </a>
                                                </li>
                                            </ul>
                                        </li>
                                    </ul>
                                </li>
                            </ul>
                        </li>
                    </ul>
                </div>
            </div>
        </div>

        <div class="ui-code-reg">
            <div class="ui-grid-top-guide">
                <p>좌측 트리영역에서 추가할 위치 선택 후, ‘추가‘ 버튼 클릭 시 신규 코드그룹 등록이 가능합니다.</p>
                <div class="abs">
                    <span class="ess"></span> 표시는 필수항목입니다.
                </div>
            </div>
            <div class="tbl-wrap mt-10">
                <table class="table reg">
                    <colgroup>
                        <col style="width: 160px;">
                        <col style="width: auto;">
                        <col style="width: 160px;">
                        <col style="width: auto;">
                    </colgroup>
                    <!-- {{ state.detailItem }} {{ state.registFormData.cmnCd }} {{ state.detailItem.cmnCdNm }}
                    
                //등록시 입력 했지만 등록 후 수정 불가능한 항목
                fstRgtrSn(사용자순번/등록자ID), uprGrpCd(그룹코드ID) 코드ID
                    -->
                    <tbody>
                        <tr>
                            <th scope="row">코드그룹ID<span class="ess"><span class="offscreen">필수입력</span></span></th>
                            <td colspan="3">
                                <template v-if="!state.treeRoot">
                                    <span v-for="(item, index) in state.treeCode" :key="index">
                                        {{ item }}
                                        <em v-if="state.treeCode.length > 1 && !(state.treeCode.length - 1 === index)">
                                            &gt;
                                        </em>
                                    </span>
                                </template>
                                <span class="checkbox" style="margin-left:15px;" v-if="state.addMode">
                                    <input id="root" name="chkGroup" type="checkbox" @change="treeSetPosition"
                                        v-model="state.treeRoot">
                                    <label for="root">루트에 생성</label>
                                </span>
                            </td>
                        </tr>
                        <tr>
                            <th scope="row">코드ID<span class="ess"><span class="offscreen">필수입력</span></span></th>
                            <td colspan="3">
                                <input type="text" class="form-control" v-model="state.registFormData.cmnCd"
                                    :disabled="state.addMode || state.editMode">
                            </td>
                        </tr>
                        <tr>
                            <th scope="row">코드명<span class="ess"><span class="offscreen">필수입력</span></span></th>
                            <td colspan="3">
                                <div class="reg-group inline">
                                    <div class="reg-item">
                                        <input type="text" class="form-control" v-model="state.registFormData.cmnCdNm">
                                    </div>
                                </div>
                            </td>
                        </tr>
                        <tr>
                            <th scope="row">사용 여부 <span class="ess"><span class="offscreen">필수입력</span></span></th>
                            <td>
                                <div class="reg-group inline">

                                    <div class="reg-item">
                                        <select class="custom-select" v-model="state.registFormData.useYn">
                                            <option value="Y">사용함</option>
                                            <option value="N">사용안함</option>
                                        </select>
                                    </div>
                                </div>
                            </td>
                            <th scope="row">노출순서</th>
                            <td>
                                <div class="reg-group inline">
                                    <div class="reg-item">
                                        <input type="text" class="form-control" v-model="state.registFormData.indnSqn">
                                    </div>
                                </div>
                            </td>
                        </tr>
                        <tr>
                            <th scope="row">비고</th>
                            <td colspan="3">
                                <div class="reg-group">
                                    <div class="reg-item">
                                        <input type="text" class="form-control" v-model="state.registFormData.rmk">
                                    </div>
                                </div>
                            </td>
                        </tr>
                        <tr>
                            <th scope="row">참조값1</th>
                            <td colspan="3">
                                <div class="reg-group">
                                    <div class="reg-item">
                                        <input type="text" class="form-control" v-model="state.registFormData.attr1Vl">
                                    </div>
                                </div>
                            </td>
                        </tr>
                        <tr>
                            <th scope="row">참조값2</th>
                            <td colspan="3">
                                <div class="reg-group">
                                    <div class="reg-item">
                                        <input type="text" class="form-control" v-model="state.registFormData.attr2Vl">
                                    </div>
                                </div>
                            </td>
                        </tr>
                        <tr>
                            <th scope="row">참조값3</th>
                            <td colspan="3">
                                <div class="reg-group">
                                    <div class="reg-item">
                                        <input type="text" class="form-control" v-model="state.registFormData.attr3Vl">
                                    </div>
                                </div>
                            </td>
                        </tr>
                        <tr>
                            <th scope="row">참조값4</th>
                            <td colspan="3">
                                <div class="reg-group">
                                    <div class="reg-item">
                                        <input type="text" class="form-control" v-model="state.registFormData.attr4Vl">
                                    </div>
                                </div>
                            </td>
                        </tr>
                        <tr>
                            <th scope="row">참조값5</th>
                            <td colspan="3">
                                <div class="reg-group">
                                    <div class="reg-item">
                                        <input type="text" class="form-control" v-model="state.registFormData.attr5Vl">
                                    </div>
                                </div>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <!-- {{ !state.addMode }}, {{ state.saveMode }}, {{ state.addMode || state.saveMode }}
            {{ paramsLength }}
            {{ state.registFormData.fstRgtrSn }} -->
            <div class="btn-bottom-set flex justify-center">
                <button type="button" class="btn btn-sl nega" @click="goCodeList">취소</button>
                <button type="button" class="btn btn-sl posi" @click="checkEdit" v-if="state.editMode">수정</button>
                <button type="button" class="btn btn-sl posi" :disabled="!state.addMode || !paramsLength" v-else
                    @click="setRegistCommon">저장</button>

            </div>

        </div>
    </div>
</template>
<style>
.folderbtn {
    position: absolute;
    width: 21px;
    height: 21px;
    display: block;
    left: 0;
    top: 0;
    z-index: 2;
}

.dep-item.hidden {
    opacity: .8;
}
</style>
<script>
import { reactive, inject, onMounted, onUnmounted, nextTick, computed } from 'vue';
import { useCommFunc } from '@/core/helper/common.js';
import { authCommFunc } from '@/core/helper/authComm.js';
import { useStore } from 'vuex';
import { useRouter, useRoute } from 'vue-router';
import { _getTreeList, _getCommonCode, _registCommonCode, _editCommonCode, _deleteCommonCode } from '@/api/standard.js';
export default {
    setup() {
        const $Modal = inject('$Modal');
        const dayJS = inject('dayJS');
        const store = useStore();
        const route = useRoute();
        const router = useRouter();
        const { goToPage, fileDown, tableResize } = useCommFunc();

        const { onChangeRegistRol, onChangeEditRol, onChangeDelRol } = authCommFunc();
        const menuInfo = computed(() => store.state.getMenuItem.menuInfo);

        const paramsLength = computed(() => state.registFormData.cmnCdNm.length > 0 && state.registFormData.useYn.length > 0);
        const state = reactive({
            commonTree: [],
            treeMenu: [
                {
                    label: '관리자문의유형',
                    value: '관리자문의유형',
                    state: true,
                    depth: [
                        {
                            label: '결제완료',
                            value: '결제완료',
                            state: false,
                            depth: []
                        }
                    ]
                },
                {
                    label: '배송상태코드',
                    value: '배송상태코드',
                    state: true,
                    depth: [
                        {
                            label: '결제완료',
                            value: '결제완료',
                            state: false,
                            depth: []
                        },
                        {
                            label: '취소',
                            value: '취소',
                            state: true,
                            depth: []
                        },
                        {
                            label: '배송중',
                            value: '배송중',
                            state: false,
                            depth: [
                                {
                                    label: '배송중1',
                                    value: '배송중',
                                    state: false,
                                    depth: [
                                        {
                                            label: '배송중1-1',
                                            value: '배송중',
                                            state: false
                                        },
                                        {
                                            label: '배송중1-2',
                                            value: '배송중',
                                            state: false
                                        }
                                    ]
                                },
                                {
                                    label: '배송중2',
                                    value: '배송중',
                                    state: false,
                                    depth: []
                                }
                            ]
                        },
                        {
                            label: '배송완료',
                            value: '배송완료',
                            state: false,
                            depth: []
                        }
                    ]
                },
                {
                    label: '배송상태코드',
                    value: '배송상태코드',
                    state: true,
                    depth: [
                        {
                            label: '결제완료',
                            value: '결제완료',
                            state: false,
                            depth: []
                        },
                        {
                            label: '취소',
                            value: '취소',
                            state: true,
                            depth: []
                        },
                        {
                            label: '배송중',
                            value: '배송중',
                            state: false,
                            depth: []
                        },
                        {
                            label: '배송완료',
                            value: '배송완료',
                            state: false,
                            depth: []
                        }
                    ]
                }
            ],
            treeStatus: true,
            treeCode: [],
            registItem: {},
            registFormData: {
                cmnCd: '',
                cmnCdNm: '', //코드명
                fstRgtrSn: 3, //사용자 순번(userId)
                uprGrpCd: '', //그룹코드ID
                indnSqn: '',  //노출 순서
                rmk: '',  //비고
                useYn: '', //사용여부
                attr1Vl: '', //참조값1
                attr2Vl: '', //참조값2
                attr3Vl: '', //참조값3
                attr4Vl: '', //참조값4
                attr5Vl: '' //참조값5
            },
            detailItem: null,
            detailCode: null,
            editMode: false,
            addMode: false,
            removeMode: false,
            saveMode: false,
            treeRoot: false

        });
        //트리조회
        const getTreeList = async () => {
            try {
                const response = await _getTreeList();
                state.commonTree = response.data.data;
                nextTick(() => {
                    openTreeAll(state.treeStatus);
                });
            } catch (error) {
                console.log(error);
            }
        };
        //단건조회
        const getCommonCode = async () => {
            try {
                const response = await _getCommonCode(state.detailCode);
                state.detailItem = response.data.data;
                console.log(state.detailItem);
                state.registFormData = {
                    cmnCd: state.detailItem.cmnCd,
                    cmnCdNm: state.detailItem.cmnCdNm, //코드명
                    fstRgtrSn: 3, //사용자 순번(userId)
                    uprGrpCd: state.detailItem.uprGrpCd, //그룹코드ID
                    indnSqn: 1,  //노출 순서
                    rmk: state.detailItem.rmk,  //비고
                    useYn: state.detailItem.useYn, //사용여부
                    attr1Vl: state.detailItem.attr1Vl, //참조값1
                    attr2Vl: state.detailItem.attr2Vl, //참조값2
                    attr3Vl: state.detailItem.attr3Vl, //참조값3
                    attr4Vl: state.detailItem.attr4Vl, //참조값4
                    attr5Vl: state.detailItem.attr5Vl //참조값5
                };
                state.treeCode.push(state.detailItem.uprGrpCd);
                state.editMode = true;
            } catch (error) {
                console.log(error);
            }
        };

        //데이터 리셋
        const dataReset = () => {
            state.registFormData = {
                cmnCd: '',
                cmnCdNm: '', //코드명
                fstRgtrSn: 3, //사용자 순번(userId)
                uprGrpCd: '', //그룹코드ID
                indnSqn: '',  //노출 순서
                rmk: '',  //비고
                useYn: '', //사용여부
                attr1Vl: '', //참조값1
                attr2Vl: '', //참조값2
                attr3Vl: '', //참조값3
                attr4Vl: '', //참조값4
                attr5Vl: '' //참조값5
            };
            state.editMode = false;
            state.addMode = false;
            state.removeMode = false;
            state.saveMode = false;
            state.treeRoot = false;
            state.treeCode = [];
        };

        //등록
        const registCommonCode = async () => {
            try {
                let params = {
                    cmnCdNm: state.registFormData.cmnCdNm, //코드명
                    fstRgtrSn: 3, //사용자 순번(userId)
                    uprGrpCd: state.treeRoot ? 'root' : state.treeCode[state.treeCode.length - 1], //그룹코드ID
                    indnSqn: Number(state.registFormData.indnSqn), //노출 순서
                    rmk: state.registFormData.rmk,  //비고
                    useYn: state.registFormData.useYn, //사용여부
                    attr1Vl: state.registFormData.attr1Vl, //참조값1
                    attr2Vl: state.registFormData.attr2Vl, //참조값2
                    attr3Vl: state.registFormData.attr3Vl, //참조값3
                    attr4Vl: state.registFormData.attr4Vl, //참조값4
                    attr5Vl: state.registFormData.attr5Vl //참조값5
                };
                console.log(params);
                const response = await _registCommonCode(params);
                getTreeList();
                dataReset();
            } catch (error) {
                console.log(error);
            }
        };
        const setRegistCommon = () => {
            $Modal.simple({
                title: '',
                message: `(${state.registFormData.uprGrpCd == undefined ? state.registFormData.cmnCdNm : state.registFormData.uprGrpCd} 의) 공통 코드를 등록했습니다.`,
                buttonText: {
                    ok: '확인'
                }
            })
                .then(success => {
                    console.log(success);
                    registCommonCode();
                })
                .catch(error => {
                    console.log(error);
                });
        };
        //수정
        const editCommonCode = async () => {
            try {
                let params = {
                    cmnCd: state.registFormData.cmnCd, //코드명
                    cmnCdNm: state.registFormData.cmnCdNm, //코드명
                    lastUpdrSn: 3, //사용자 순번(userId)
                    uprGrpCd: state.registFormData.uprGrpCd, //그룹코드ID
                    indnSqn: state.registFormData.indnSqn, //노출 순서
                    rmk: state.registFormData.rmk,  //비고
                    useYn: state.registFormData.useYn, //사용여부
                    attr1Vl: state.registFormData.attr1Vl, //참조값1
                    attr2Vl: state.registFormData.attr2Vl, //참조값2
                    attr3Vl: state.registFormData.attr3Vl, //참조값3
                    attr4Vl: state.registFormData.attr4Vl, //참조값4
                    attr5Vl: state.registFormData.attr5Vl //참조값5
                };
                const response = await _editCommonCode(params);
                console.log(response);
                getTreeList();

            } catch (error) {
                console.log(error);
            }
        };
        //리스트로 이동
        const goCodeList = () => {
            router.push('/standard/commoncode/list');
        };
        const setEditCommon = () => {
            $Modal.simple({
                title: '',
                // message: `(${state.registItem.uprGrpCd} 의 ${state.registItem.cmnCd}) 가 수정되었습니다.`,
                message: `수정되었습니다.`,
                buttonText: {
                    ok: '확인'
                }
            })
                .then(success => {
                    console.log(success);
                    editCommonCode();
                })
                .catch(error => {
                    console.log(error);
                });
        };
        onMounted(() => {
            if (route.query.code) {
                state.detailCode = route.query.code;
                getCommonCode();
            }
            getTreeList();

            emitter.$on('onChangeRegist', onChangeRegist);
            emitter.$on('onChangeEdit', onChangeEdit);
            emitter.$on('onChangeDel', onChangeDel);
        });

        onUnmounted(() => {
            emitter.$off('onChangeRegist');
            emitter.$off('onChangeEdit');
            emitter.$off('onChangeDel');
        });

        /**
         * 등록 권한 체크
         */
        const checkRegist = async () => {
            await onChangeRegistRol(menuInfo.value.auth1RegistYn);
        };

        /**
         * 등록 권한 체크 callback
         */
        const onChangeRegist = () => {
            setTreeList('add');
        };

        /**
         * 수정 권한 체크
         */
        const checkEdit = async () => {
            await onChangeEditRol(menuInfo.value.auth2UpdateYn);
        };

        /**
         * 수정 권한 체크 callback
         */
        const onChangeEdit = () => {
            setEditCommon();
        };

        /**
         * 삭제 권한 체크
         */
        const checkDel = async () => {
            await onChangeDelRol(menuInfo.value.auth3DeleteYn);
        };

        /**
         * 삭제 권한 체크 callback
         */
        const onChangeDel = () => {
            setTreeList('remove');
        };

        // 트리 각각 active처리
        const openTree = (event) => {
            let btntarget = event.target.parentElement.parentElement;
            if (btntarget.classList.contains('unfold')) {
                btntarget.classList.remove('unfold');
            } else {
                btntarget.classList.add('unfold');
            }
        };
        //트리폴더 토글
        const setTreeType = () => {
            state.treeStatus = !state.treeStatus;
            openTreeAll(state.treeStatus);
        };
        // 추가시 데이터 리셋처리
        const setTreeList = async (type) => {
            console.log(type);
            if (type === 'add') {
                state.registFormData = {
                    cmnCdNm: '',
                    indnSqn: '',
                    cmnCd: '',
                    useYn: '',
                    rmk: '',
                    attr5Vl: '',
                    attr4Vl: '',
                    attr3Vl: '',
                    attr2Vl: '',
                    attr1Vl: '',
                    uprGrpCd: state.treeCode[state.treeCode.length - 1]
                };
                state.addMode = true;
                state.editMode = false;
                console.log('추가');

            } else if (type === 'remove') {
                try {
                    let params = {
                        lastUpdrSn: 3, //사용자 순번(userId)
                        cmnCd: state.registItem.cmnCd //공통코드
                    };
                    const response = await _deleteCommonCode(params);
                    if (response.data.code == null) {
                        $Modal.alert(response.data.message);
                    }
                    getTreeList();
                    dataReset();
                } catch (error) {
                    console.log(error);
                }
            }

        };
        // 루트에 생성시 처리 
        const treeSetPosition = () => {

        };
        //트리전체펼침
        const openTreeAll = (type) => {
            let treeLi = document.querySelectorAll('.dep-item');
            if (type) {
                treeLi.forEach((item, index) => {
                    if (item.classList.contains('fold'))
                        item.classList.add('unfold');
                });

            } else {
                treeLi.forEach((item, index) => {
                    if (item.classList.contains('fold'))
                        item.classList.remove('unfold');
                });
            }
        };
        // 트리 선택
        const selectValue = (current, item, depth1, depth2, depth3) => {
            console.log(current, depth1, depth2, depth3);
            state.registItem = item;
            const valueArr = [depth1, depth2, depth3, current];
            state.treeCode = valueArr.filter(item => !(item === undefined));
            state.editMode = true;
            // console.log(state.registItem, state.treeCode[(state.treeCode.length - 1)]);
            state.registFormData = {
                cmnCdNm: state.registItem.cmnCdNm, //코드명
                cmnCd: state.registItem.cmnCd,
                fstRgtrSn: state.registItem.fstRgtrSn, //사용자 순번(userId)
                lastUpdrSn: state.registItem.lastUpdrSn, //사용자 순번(userId)
                uprGrpCd: state.editMode ? state.registItem.uprGrpCd : state.treeCode[state.treeCode.length - 1], //그룹코드ID
                indnSqn: state.registItem.indnSqn,  //노출 순서
                rmk: state.registItem.rmk,  //비고
                useYn: state.registItem.useYn, //사용여부
                attr1Vl: state.registItem.attr1Vl, //참조값1
                attr2Vl: state.registItem.attr2Vl, //참조값2
                attr3Vl: state.registItem.attr3Vl, //참조값3
                attr4Vl: state.registItem.attr4Vl, //참조값4
                attr5Vl: state.registItem.attr5Vl //참조값5
            };

            console.log(state.registFormData.uprGrpCd);
        };

        return {
            $Modal,
            dayJS,
            state,
            goToPage,
            fileDown,
            tableResize,
            openTree,
            openTreeAll,
            selectValue,
            getTreeList,
            setTreeType,
            registCommonCode,
            editCommonCode,
            setTreeList,
            treeSetPosition,
            setEditCommon,
            setRegistCommon,
            paramsLength,
            goCodeList,

            checkRegist,
            checkEdit,
            checkDel
        };
    }
};

</script>