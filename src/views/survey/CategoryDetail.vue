<template>
    <section class="s1">
        <div class="ui-section">
            <div class="ui-content">
                <div class="ui-grid-top-guide t-right">
                    <span class="ess"></span> 표시는 필수항목입니다.
                </div>
                <div class="tbl-wrap mt-10">
                    <table class="table reg">
                        <colgroup>
                            <col style="width: 160px;">
                            <col style="width: auto;">
                        </colgroup>
                        <tbody>
                            <tr>
                                <th scope="row">카테고리명<span class="ess"><span class="offscreen">필수입력</span></span>
                                    <div class="ui-tooltip">
                                        <button type="button" class="ui-tooltip-ico"><span class="offscreen">카테고리명 안내</span></button>
                                    </div>
                                </th>
                                <td>
                                    <div class="reg-group">
                                        <div class="reg-item">
                                            <input type="text" class="form-control" v-model="state.formData.categoryName">
                                        </div>
                                    </div>
                                    <p v-if="checkValidState('categoryName')" class="input-guide"
                                        :class="{ 'error': checkValidState('categoryName') }">
                                        {{ state.validState.message }}
                                    </p>
                                </td>
                            </tr>
                            <tr>
                                <th scope="row">설명</th>
                                <td>
                                    <div class="reg-group wp-100">
                                        <div class="reg-item">
                                            <input type="text" class="form-control" v-model="state.formData.categoryDescription">
                                        </div>
                                    </div>
                                </td>
                            </tr>
                            <tr>
                                <th scope="row">노출여부<span class="ess"><span class="offscreen">필수입력</span></span></th>
                                <td>
                                    <div class="reg-group inline">
                                        <div class="reg-item">
                                            <select class="custom-select" v-model="state.formData.postUpYn">
                                                <option value="Y">노출</option>
                                                <option value="N">비노출</option>
                                            </select>
                                        </div>
                                    </div>
                                </td>
                            </tr>
                            <tr>
                                <th scope="row">설문그룹 구분<span class="ess"><span class="offscreen">필수입력</span></span></th>
                                <td>
                                    <div class="reg-group inline">
                                        <div class="reg-item">
                                            <span class="radio">
                                                <input id="groupType0" name="groupType" type="radio" value="328001" v-model="state.formData.questionGroupSectionCode">
                                                <label for="groupType0">단수</label>
                                            </span>
                                            <span class="radio">
                                                <input id="groupType1" name="groupType" type="radio" value="328002" v-model="state.formData.questionGroupSectionCode">
                                                <label for="groupType1">복수</label>
                                            </span>
                                        </div>
                                    </div>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
        <div class="ui-section">
            <div class="ui-title-3">
                <h3>설문 목록</h3>
                <div class="abs" v-if="state.formData.questionList && state.formData.questionList.length > 0">
                    <button type="button" class="btn btn-ss" @click="checkDel">삭제</button>
                </div>
            </div>
            <div class="ui-content">
                <div class="tbl-wrap">
                    <NoData :nodatatext="'조회된 데이터가 없습니다.'" v-if="!state.formData.questionList || state.formData.questionList.length === 0"></NoData>
                    <template v-else>
                        <AgGridVue :defaultColDef="state.defaultColDef" :columnDefs="state.tableColum_c" @grid-ready="onGridReady"
                            :rowData="state.formData.questionList" @cell-clicked="cellClicked" :suppressRowClickSelection="true"
                            :rowSelection="'multiple'" @selection-changed="onRowSelect"
                            class="ag-theme-alpine" :domLayout="'autoHeight'">
                        </AgGridVue>
                    </template>
                </div>
            </div>
        </div>
        <div class="ui-section">
            <div class="ui-content">
                <div class="tbl-wrap">
                    <div class="tbl-wrap">
                        <table class="table reg">
                            <colgroup>
                                <col style="width: 160px;">
                                <col style="width: auto;">
                                <col style="width: 160px;">
                                <col style="width: auto;">
                            </colgroup>
                            <tbody>
                                <tr>
                                    <th scope="row">등록자</th>
                                    <td>{{ state.formData.fstRgtrNm }}</td>
                                    <th scope="row">등록일시</th>
                                    <td>{{ state.formData.fstRgsDt }}</td>
                                </tr>
                                <tr>
                                    <th scope="row">수정자</th>
                                    <td>{{ state.formData.lastRgtrNm }}</td>
                                    <th scope="row">수정일시</th>
                                    <td>{{ state.formData.lastRgsDt }}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
        <div class="btn-bottom-set flex justify-center">
            <button type="button" class="btn btn-sl nega" @click="goList">목록</button>
            <button type="button" class="btn btn-sl nega" @click="goDelete">삭제</button>
            <button type="button" class="btn btn-sl posi"  @click="goSave">저장</button>
        </div>
    </section>
    
</template>
<script>
import { computed, reactive, onMounted, inject, ref, onUnmounted, watch } from 'vue';
import { authCommFunc } from '@/core/helper/authComm.js';
import { useStore } from 'vuex';
import { _getCategoryDetail, _removeCategory, _removeQuestion, _modifyCategory } from '@/api/survey.js';
import { useRouter, useRoute } from 'vue-router';

export default {
    components: {},
    setup() {
        const $Modal = inject('$Modal');
        const store = useStore();
        const router = useRouter();
        const menuInfo = computed(() => store.state.getMenuItem.menuInfo);
        /**
         * 권한은 스토어에서 가져옴 (권한여부는 메뉴리스트에서 가져온다)
         * store.state.getMenuItem.menuInfo
         * "auth1RegistYn": "Y/N",  등록
         * "auth2UpdateYn": "Y/N",  수정
         * "auth3DeleteYn": "Y/N",  삭제
         * "auth4ApproveYn": "Y/N", 승인
         * "auth5DownloadYn": "Y/N", 다운 
         * "auth6MaskingYn": "Y/N" 마스킹
         */
        const { onChangeRegistRol, onChangeEditRol, onChangeDelRol, onChangeDownRol } = authCommFunc();
        const serialNo = history.state.categorySerialNumber;
        const initColum = ref([
            { headerName: '선택', field: 'select', maxWidth: 50, checkboxSelection: true, headerCheckboxSelection: true },
            { headerName: '번호', field: 'questionSerialNumber', valueGetter: 'node.rowIndex + 1', width: 70 },
            { headerName: '설문제목',
                field: 'questionTitle',
                flex: 1,
                cellRenderer: params => {
                    return '<a href="#">' + params.value + '</a>';
                }
            },
            { headerName: '설문코드', field: 'questionCode', flex: 1},
            { headerName: '진행순서',
                field: 'indicationSerialNumber',
                width: 120,
                cellRenderer: params => {
                    return '<input type="text" class="form-control sm t-center"" value="' + params.value + '">';
                },
                editable: true
            }
        ]);

        const state = reactive({
            filterCoulm: [],
            tableColum_c: _.clone(initColum),
            formData: [],
            tableData: [],
            defaultColDef: {
                sortable: true,
                resizable: true,
                width: 50,
                headerClass: 'centered',
                cellClass: 'centered'
            },
            gridApi: null,
            gridColumApi: null,
            selectList: [],   //checkbox 정책 리스트
            memberAprv: null, //승인자 정보
            athrTypCd: '212001',
            menuCode: menuInfo.value.menuCode,
            selectQuestion: [],
            validState: {
                type: '', // 약관그룹(termsGroup), 약관유형(clusTyCd), 약관명(clusNm)
                errState: false, // error state
                message: '' // input message
            }
            
        });

        const getQuestionDetail = async (categorySerialNo) => {
            
            const response = await _getCategoryDetail(categorySerialNo);

            if (response.code == 'OK') {
                state.formData = response.data;
            } else {
                modal(response.message);
            }
        };

        //테이블 셀 선택
        const cellClicked = (e) => {
            const code = state.gridApi.getFocusedCell().column.colId;
            
            
        };

        const onRowSelect = (e) => {
            console.log('sonRowSelect ', state.gridApi.getSelectedRows());
            state.selectQuestion = state.gridApi.getSelectedRows();
        };

        const goList = () => {
            router.push('/survey/category/list');
        };

        const goDelete = async () => {
            $Modal.confirm({
                title: '',
                message: '삭제하시겠습니까?',
                buttonText: {
                    confirm: '확인',
                    cancel: '취소'
                }
            })
                .then(success => {
                    if (success === 'confirm') {
                        deleteCategory();
                        
                    }
                })
                .catch(error => {
                    console.log(error);
                });
        };

        const goSave = async () => {

            //그리드의 진행순서가 focus out 이 되지않아 저장 전에 focusout 시키기 위해 호출
            if (state.formData.questionList) state.gridApi.stopEditing();

            if (validFormData()) {
                $Modal.confirm({
                    title: '',
                    message: '저장하시겠습니까?',
                    buttonText: {
                        confirm: '확인',
                        cancel: '취소'
                    }
                })
                    .then(success => {
                        if (success === 'confirm') {
                            modifyCategory();
                        }
                    })
                    .catch(error => {
                        console.log(error);
                    });
            }
            
        
        };

        const modifyCategory = async () => {
            const params = {
                categorySerialNumber: state.formData.categorySerialNumber,
                categoryName: state.formData.categoryName,
                categoryDescription: state.formData.categoryDescription,
                postUpYn: state.formData.postUpYn,
                questionGroupSectionCode: state.formData.questionGroupSectionCode,
                questionList:
                    state.formData.questionList ?
                        state.formData.questionList.map(item => {
                            return {
                                categorySerialNumber: item.categorySerialNumber,
                                questionSerialNumber: item.questionSerialNumber,
                                indicationSerialNumber: item.indicationSerialNumber
                            };
                        }) : []
            };

            const response = await _modifyCategory(params);

            if (response.code == 'OK') {
                getQuestionDetail(history.state.categorySerialNumber);
            } else {
                modal(response.message);
            }
        };

        const deleteCategory = async () => {
            const response = await _removeCategory(serialNo);

            if (response.code == 'OK') {
                goList();
                
            } else {
                modal(response.message);
            }
        };

        const onGridReady = (params) => {
            state.gridApi = params.api;
            state.gridColumApi = params.columnApi;
        };

        /**
         * 삭제 권한 체크 callback
         */
        const onChangeDel = () => {
            if (state.selectQuestion.length === 0) {
                $Modal.simple({
                    message: '삭제할 리스트가 없습니다.',
                    buttonText: {
                        ok: '확인'
                    }
                });
            } else {
                $Modal.confirm({
                    title: '',
                    message: '삭제시 설문에 포함된 문항도 모두 삭제됩니다. 삭제하시겠습니까?',
                    buttonText: {
                        confirm: '확인',
                        cancel: '취소'
                    }
                })
                    .then(success => {
                        if (success === 'confirm') {
                            removeQuestion();
                        
                        }
                    })
                    .catch(error => {
                        console.log(error);
                    });
            }
            
        };

        /**
         * 삭제 권한 체크
         */
        const checkDel = async () => {
            onChangeDel();
        };

        const removeQuestion = async () => {
            const params = state.selectQuestion.map(item => item.questionSerialNumber);
            const response = await _removeQuestion(params);

            if (response.code == 'OK') {
                getQuestionDetail(history.state.categorySerialNumber);
            } else {
                modal(response.message);
            }
        };

        const checkValidState = (type) => {
            return state.validState.target === type && state.validState.errState;
        };

        const validFormData = () => {
            const target = ['categoryName'];
            for (const item of target) {
                state.validState.target = item;
                let msg = '';
                if (item === 'categoryName') msg = '카레고리명을 입력해주세요.';

                state.validState.message = msg;
                
                if (!state.formData[item]) {
                    state.validState.errState = true;
                    break;
                }
            }

            return !state.validState.errState;
        };

        /**
         * @validation 상태 초기화
         */
        const resetState = () => {
            state.validState.type = ''; // validation
            state.validState.errState = false;
            state.validState.message = '';
        };

        


        onMounted(() => {
            getQuestionDetail(history.state.categorySerialNumber);
            emitter.$on('onChangeDel', onChangeDel);
        });

        onUnmounted(() => {
            emitter.$off('onChangeRegist');
            emitter.$off('onChangeEdit');
            emitter.$off('onChangeDel');
        });

        watch(
            () => state.formData.categoryName,
            () => resetState(),
            { deep: true }
        );


        return {
            serialNo,
            state,
            initColum,
            getQuestionDetail,
            cellClicked,
            goList,
            deleteCategory,
            goDelete,
            onRowSelect,
            onGridReady,
            onChangeDel,
            checkDel,
            goSave,
            checkValidState,
            validFormData
        };
    }
};
</script>