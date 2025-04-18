<template>
    <PntCategoryInfo :params="state.params" />
    <div class="ui-section">
        <div class="ui-title-3">
            <h3>발급시기</h3>
        </div>
        <div class="ui-content">
            <div class="tbl-wrap">
                <table class="table reg">
                    <colgroup>
                        <col style="width: 160px;">
                        <col style="width: auto;">
                    </colgroup>
                    <tbody>
                        <tr>
                            <th scope="row">발급일시</th>
                            <td>{{ state.params.issDtSeCdNm }}({{ state.params.bknIssDate }})</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
    <div class="ui-section">
        <div class="ui-title-3">
            <h3>발급대상</h3>
        </div>
        <div class="ui-content">
            <div class="tbl-wrap">
                <table class="table reg">
                    <colgroup>
                        <col style="width: 160px;">
                        <col style="width: auto;">
                    </colgroup>
                    <tbody>
                        <tr>
                            <th scope="row">발급대상</th>
                            <td>{{ state.params.issTrgCdNm }}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>

    <div class="ui-section">
        <div class="ui-title-3">
            <h3>발급대상목록</h3>
            <template v-if="state.params.issTrgCd == '217004'">
                <div class="abs">
                    <button type="button" class="btn btn-opt" @click="onChangeDownRol('Y', 'Y', exelParams)">
                        <span class="ico-download"></span>발송대상 다운로드
                    </button>
                </div>
            </template>
        </div>
        <div class="ui-content">
            <template v-if="state.params.issTrgCd == '217001'">
                <div class="tbl-wrap">
                    <table class="table reg">
                        <colgroup>
                            <col style="width: auto;">
                        </colgroup>
                        <thead>
                            <th scope="col" class="t-center">전체 B2C회원수</th>
                        </thead>
                        <tbody>
                            <tr>
                                <td class="t-center"><strong class="fz-15">{{ addComma(state.params.issTgpNum)
                                }}명</strong>(기준일 {{
    state.params.issBstdDate }})</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </template>
            <template v-else-if="state.params.issTrgCd == '217002'">
                <span class="table-total">선택한 회원 <strong>{{ addComma(state.params.mbrSnArr.length) }}</strong>명에게
                    발송합니다.</span>
                <div class="tbl-wrap">
                    <NoData v-if="state.params.mbrSnArr.length === 0" :nodatatext="'조회된 데이터가 없습니다.'"></NoData>
                    <template v-else>
                        <AgGridVue :defaultColDef="state.defaultColDef" :columnDefs="state.tableColum_c"
                            :rowData="state.rowData" :suppressRowClickSelection="true" :rowSelection="'multiple'"
                            class="ag-theme-alpine" :domLayout="'autoHeight'">
                        </AgGridVue>
                        <PageNavigation :cntPerPage='pager.size' :itemCount='pager.totalCnt' :currentPage="pager.current"
                            @changedPage="onChangedPage" />
                    </template>
                </div>
            </template>
            <template v-else-if="state.params.issTrgCd == '217004'">
                <div class="tbl-wrap mt-10">
                    <table class="table reg">
                        <colgroup>
                            <col style="width: auto;">
                        </colgroup>
                        <thead>
                            <th scope="col" class="t-center">발급대상수</th>
                        </thead>
                        <tbody>
                            <tr>
                                <td class="t-center">{{ state.params.issTgpNum ? addComma(state.params.issTgpNum) + '명' :
                                    '0명' }}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </template>
        </div>
    </div>


    <div class="ui-section">
        <div class="ui-title-3">
            <h3>발급결과</h3>
        </div>
        <div class="ui-content">
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
                            <th scope="row">발급상태</th>
                            <td>{{ state.params.issStCdNm }}</td>
                        </tr>
                        <tr>
                            <th scope="row">지급대상</th>
                            <td colspan="3">{{ state.params.issTgpNum ? addComma(state.params.issTgpNum) : '0' }}</td>
                        </tr>
                        <template v-if="state.params.issStCd == '218004'">
                            <tr>
                                <th scope="row">반려사유</th>
                                <td colspan="3">{{ state.params.athrRsnCdNm }}, {{ state.params.athrRsnCts }}</td>
                            </tr>
                            <tr>
                                <th scope="row">반려자</th>
                                <td>{{ state.params.issAprvId }}</td>
                                <th scope="row">반려일</th>
                                <td>{{ state.params.issAprvDt }}</td>
                            </tr>
                        </template>
                        <tr v-if="state.params.issStCd == '218003' || state.params.issStCd == '218008'
                            || state.params.issStCd == '218009' || state.params.issStCd == '218010'">
                            <th scope="row">지급결과</th>
                            <td colspan="3">지급완료(성공 {{ state.params.issSucCnt }} / 발급실패 {{ state.params.issFailCnt }})</td>
                        </tr>
                        <template v-if="state.params.issStCd == '218009'">
                            <tr>
                                <th scope="row">지급취소</th>
                                <td colspan="3">지급취소(취소성공 {{ state.params.issCnclSucCnt }}/ 취소실패 {{
                                    state.params.issCnclFailCnt }})</td>
                            </tr>
                            <tr>
                                <th scope="row">취소승인자</th>
                                <td>{{ state.params.issCnclAprvId }}</td>
                                <th scope="row">취소승인일</th>
                                <td>{{ state.params.issCnclDt }}</td>
                            </tr>
                        </template>
                        <template v-if="state.params.issStCd == '218010'">
                            <tr>
                                <th scope="row">취소반려사유</th>
                                <td colspan="3">{{ state.params.athrRsnCdNm }}, {{ state.params.athrRsnCts }}</td>
                            </tr>
                            <tr>
                                <th scope="row">취소반려자</th>
                                <td>{{ state.params.issCnclAprvId }}</td>
                                <th scope="row">취소반려일</th>
                                <td>{{ state.params.issCnclDt }}</td>
                            </tr>
                        </template>
                        <tr
                            v-if="state.params.issStCd == '218009' || state.params.issStCd == '218007' || state.params.issStCd == '218010'">
                            <th scope="row">취소요청자</th>
                            <td>{{ state.params.athrRqstId }}</td>
                            <th scope="row">취소요청일</th>
                            <td>{{ state.params.athrRqstDt }}</td>
                        </tr>
                        <tr
                            v-if="state.params.issStCd == '218003' || state.params.issStCd == '218008'
                                || state.params.issStCd == '218009' || state.params.issStCd == '218010' || state.params.issStCd == '218012'">
                            <th scope="row">승인자</th>
                            <td>{{ state.params.issAprvId }}</td>
                            <th scope="row">승인일</th>
                            <td>{{ state.params.issAprvDt }}</td>
                        </tr>
                        <tr v-if="state.params.issStCd == '218006'">
                            <th scope="row">삭제승인자</th>
                            <td>{{ state.params.issAprvId }}</td>
                            <th scope="row">삭제승인일</th>
                            <td>{{ state.params.issAprvDt }}</td>
                        </tr>
                        <template v-if="state.params.issStCd == '218007'">
                            <tr>
                                <th scope="row">삭제반려사유</th>
                                <td colspan="3">{{ state.params.athrRsnCdNm }}, {{ state.params.athrRsnCts }}</td>
                            </tr>
                            <tr>
                                <th scope="row">삭제반려자</th>
                                <td>{{ state.params.issAprvId }}</td>
                                <th scope="row">삭제반려일</th>
                                <td>{{ state.params.issAprvDt }}</td>
                            </tr>
                        </template>
                        <tr
                            v-if="state.params.issStCd == '218005' || state.params.issStCd == '218006' || state.params.issStCd == '218007'">
                            <th scope="row">삭제요청자</th>
                            <td>{{ state.params.athrRqstId }}</td>
                            <th scope="row">삭제요청일</th>
                            <td>{{ state.params.athrRqstDt }}</td>
                        </tr>
                        <tr>
                            <th scope="row">등록자</th>
                            <td>{{ state.params.fstRgtrSn }}</td>
                            <th scope="row">등록일</th>
                            <td>{{ state.params.fstRgsDt }}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
</template>
<script>
import { reactive, computed, watch } from 'vue';
import PntCategoryInfo from '@/views/pntmng/component/PntCategoryInfo.vue';
import { authCommFunc } from '@/core/helper/authComm.js';

export default {
    components: { PntCategoryInfo },
    props: ['params'],
    setup(props) {
        const { onChangeDownRol } = authCommFunc();
        const state = reactive({
            rowData: [],
            tableColum_c: _.clone([
                { headerName: '번호', field: '', valueGetter: 'node.rowIndex + 1 ', width: 70 },
                { headerName: '이름', field: 'mbrNm', width: 120 },
                { headerName: '회원번호', field: 'mbrSn', width: 200 },
                { headerName: '성별', field: 'mbrSex', width: 120 },
                { headerName: '연령대', field: 'aggp', width: 130 },
                {
                    headerName: '가입일자',
                    field: 'mbrJnDt',
                    width: 200,
                    cellRenderer: params => {
                        return params.value ? params.value.substring(0, 10) : '';
                    }
                },
                { headerName: '휴대전화번호', field: 'mbrHhpno', flex: 1 },
                { headerName: '이메일', field: 'mbrEmad', flex: 1 }
            ]),
            defaultColDef: {
                sortable: true,
                resizable: true,
                width: 50,
                headerClass: 'centered',
                cellClass: 'centered'
            },
            params: computed(() => props.params)
        });

        const exelParams = reactive({
            params: {
                cstPntIssMngSn: computed(() => state.params.cstPntIssMngSn),
                menuCode: '1017006'
            },
            url: computed(() => `/common/api/v1/mna/iss/user/tar/excel?cstPntIssMngSn=${state.params.cstPntIssMngSn}&&menuCode=1017006`)
        });


        watch(props, () => {
            if (props.params.mbrSnArr) {
                onChangedPage(pager.current);
                pager.totalCnt = parseInt(props.params.mbrSnArr.length);
            }
        });

        const pager = reactive({
            current: 1,
            currentPageSize: 1,
            size: 5,
            offset: computed(() => (pager.current - 1) * pager.size),
            totalCnt: 0
        });

        // 페이징 처리
        const onChangedPage = (num) => {
            pager.current = num;
            const start = (pager.current - 1) * pager.size;
            const end = start + pager.size;
            state.tableColum_c[0].valueGetter = 'node.rowIndex + ' + Number(pager.size * (pager.current - 1) + 1);
            state.rowData = state.params.mbrSnArr.slice(start, end);
        };

        const addComma = (num) => num ? num.toLocaleString('ko') : '';

        return {
            state,
            pager,
            onChangedPage,
            addComma,
            exelParams,
            onChangeDownRol
        };
    }
};
</script>