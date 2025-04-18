<template>
    <section>
        <div class="ui-data-filter">
            <div class="form-item">
                <dateSerch ref="dateSearch" :dateTitle="'기간조회'" :pickerOnly="false"
                    :selectOptions="[{ label: '문의일시', value: 'inqDate' }, { label: '답변일시', value: 'aswDate' }]"
                    :setDay="state.setDay" @onSelectDate="onSelectPicker" />
                <div class="btn-filter-set">
                    <button class="btn btn-sm" type="button" @click="reloadList"><span class="ico-search"></span>조회
                    </button>
                    <button class="btn btn-sm" type="button" @click="onInitDate">
                        <span class="ico-reload sg"></span>
                        <span class="offscreen">리로드</span>
                    </button>
                    <button class="btn btn-sm" type="button" @click="openMoreSerch">
                        <span class="txt">상세검색 열기</span>
                    </button>
                </div>
            </div>
            <!-- 상세검색 -->
            <div v-if="state.openMore" class="ui-data-filter-more">
                <div class="form-item">
                    <div class="item">
                        <label>문의유형</label>
                        <span class="input">
                            <span class="dv">
                                <SubSelectBox v-model="formData.questionType" :list="state.questionTypeList"></SubSelectBox>
                            </span>
                        </span>
                    </div>
                    <div class="item">
                        <label>문의구분</label>
                        <span class="input">
                            <span class="dv">
                                <RadioList v-model="formData.inquirySeperation" :list="state.inquirySeperationList"
                                    name="questionType" />
                            </span>
                        </span>
                    </div>
                    <div class="item">
                        <label>답변상태</label>
                        <span class="input">
                            <span class="dv">
                                <SubSelectBox v-model="formData.answerStatus" :list="state.adminAnswerStatusList"
                                    name="adminAnswerStatus"></SubSelectBox>
                            </span>
                        </span>
                    </div>
                </div>
                <div class="form-item">
                    <div class="item">
                        <label>조건검색</label>
                        <span class="input">
                            <span class="dv">
                                <SubSelectBox v-model="formData.searchType" :list="state.searchTypeList"></SubSelectBox>
                            </span>
                            <span class="dv"><input v-model="formData.searchText" class="form-control sm"
                                    type="text"></span>
                        </span>
                    </div>
                    <div class="item">
                        <label>응대현황</label>
                        <span class="input">
                            <span class="dv">
                                <SubSelectBox v-model="formData.responseStatus" :list="state.responseStatusList">
                                </SubSelectBox>
                            </span>
                        </span>
                    </div>
                    <div class="item">
                        <label>해결상태</label>
                        <span class="input">
                            <span class="dv">
                                <RadioList v-model="formData.solveStatusYn" :list="state.solveStatusYnList"
                                    name="solveStatusYn" />
                            </span>
                        </span>
                    </div>
                    <div class="item">
                        <label>악성클레임</label>
                        <span class="input">
                            <span class="dv">
                                <span class="checkbox">
                                    <input id="isBlack" v-model="formData.badClaimYn" false-value="N" name="isBlackGroup"
                                        true-value="Y" type="checkbox">
                                    <label for="isBlack">악성클레임</label>
                                </span>
                            </span>
                        </span>
                    </div>
                </div>
            </div>
        </div>
        <div class="tbl-wrap">
            <div class="table-util flex space-between">
                <div class="btn-set-m flex">
                    <button class="btn btn-ss" type="button" @click="checkDel">
                        삭제
                    </button>
                    <button class="btn btn-ss" type="button" @click="checkRegist">유선문의등록
                    </button>
                    <button :disabled="state.delList.length === 0" class="btn btn-ss" type="button"
                        @click="qnaTransfer">문의이관
                    </button>
                    <button class="btn btn-ss" type="button" :disabled="!state.mskgnRlsYn || state.mskgnTried"
                        @click="changeMskgnRlsYn">
                        마스킹해제
                    </button>
                </div>
                <div class="btn-set-m flex align-end">
                    <span class="table-total">조회결과 총 <strong>{{ pager.totalCnt }}</strong>건</span>
                    <button class="btn btn-opt" type="button"
                        @click="onChangeDownRol(menuInfo.auth5DownloadYn, formData.mskgnRlsYn, exelParams)">
                        <span class="ico-download"></span>
                        파일다운로드
                    </button>
                    <selectBox selectType="page" @changedValue="selectedOptions" />
                    <button class="btn btn-opt-ico fit" type="button" @click="tableResize">
                        <span class="offscreen">컬럼 리사이징</span>
                    </button>
                    <!-- 클래스 : full -->
                    <!-- 클래스 : close -->
                    <button class="btn btn-opt-ico filter full" type="button" @click="resetTable">
                        <span class="offscreen">컬럼 셋팅</span>
                    </button>
                </div>
            </div>
            <columlist :columlists="initColum" @checkColum="checkOptions" />
            <NoData v-if="state.qnaList.length === 0" :nodatatext="'조회된 데이터가 없습니다.'"></NoData>
            <div v-else>
                <AgGridVue :columnDefs="state.tableColum_c" :defaultColDef="state.defaultColDef" :domLayout="'autoHeight'"
                    :rowData="state.qnaList" :rowSelection="'multiple'" :suppressRowClickSelection="true"
                    class="ag-theme-alpine" @grid-ready="onGridReady" @cell-clicked="onCellClicked"
                    @selection-changed="onRowSelect">
                </AgGridVue>
                <PageNavigation :cntPerPage='pager.size' :currentPage="pager.current" :itemCount='pager.totalCnt'
                    @changedPage="onChangedPage" />
            </div>
        </div>
    </section>
    <QnaTransfer v-if="state.isQnaTransfer" :isShow="state.isQnaTransfer" :qnaSn="state.qnaTransferSn"
        :menuCode="menuInfo.menuCode" @modalClose="modalClose"></QnaTransfer>
</template>
<style scope>
.ag-center-cols-viewport {
    overflow-x: hidden;
}

.tbl-wrap .ag-center-cols-container {
    width: 2300px !important;
    /* 퍼블리셔 문의 후 삭제예정 */
}
</style>
<script>
import { computed, reactive, inject, onMounted, onUnmounted, ref, watch } from 'vue';
import DateSerch from '@/components/ui/DateSerch.vue';
import DefaultModal from '@/plugins/modal/modal/DefaultModal.vue';
import { useCommFunc } from '@/core/helper/common.js';
import { _deleteQna, _getQnaList, _registQnaAnswerAceept } from '@/api/customer.js';
import DateTimeSingle from '@/components/ui/DateTimeSingle.vue';
import QnaTransfer from '@/views/customer/components/QnaTransfer.vue';
import SubSelectBox from '@/views/customer/components/SelectBox.vue';
import RadioList from '@/views/customer/components/RadioList.vue';
import codeList from '@/data/commcode/codeList.js';
import { useStore } from 'vuex';
import { authCommFunc } from '@/core/helper/authComm.js';

export default {
    components: { QnaTransfer, DateTimeSingle, DefaultModal, DateSerch, SubSelectBox, RadioList },
    setup() {
        const $Modal = inject('$Modal');
        const dayJS = inject('dayJS');
        const dateSearch = ref(null);
        const { goToPage, tableResize, openModal, isPartnerShow, isDownShow, isImgShow } = useCommFunc();
        const initColum = ref([
            {
                headerName: '선택',
                field: 'select',
                width: 50,
                checkboxSelection: true,
                headerCheckboxSelection: true
            },
            { headerName: '번호', field: '번호', valueGetter: 'node.rowIndex + 1', width: 90 },
            { headerName: '문의구분', field: 'inquirySeperationName', width: 100 },
            { headerName: '문의유형', field: 'questionTypeName', width: 100 },
            {
                headerName: '제목',
                field: 'questionTitle',
                width: 200,
                cellClass: 't-left',
                cellRenderer: params => {
                    return '<a >' + params.value + '</a>';
                }
            },
            { headerName: '회원명', field: 'memberName', width: 100 },
            { headerName: '회원번호', field: 'memberSn', width: 120 },
            {
                headerName: '문의일시',
                field: 'firstRegistedDatetime',
                width: 160,
                valueFormatter: param => {
                    return param.value ? dayJS(param.value).format('YYYY-MM-DD HH:mm') : '';
                }
            },
            { headerName: '문의담당사', field: 'inquiryChargeCorperationName', width: 120 },
            { headerName: '답변상태', field: 'adminAnswerStatusName', width: 100 },
            { headerName: '문의이관사', field: 'questionTransferCoperationName', width: 100 },
            {
                headerName: '이관일시',
                field: 'questionTransferDatetime',
                width: 160,
                valueFormatter: param => {
                    return param.value ? dayJS(param.value).format('YYYY-MM-DD HH:mm') : '';
                }
            },
            {
                headerName: '접수완료일시',
                field: 'answerCompleteDatetime',
                width: 160,
                valueFormatter: param => {
                    return param.value ? dayJS(param.value).format('YYYY-MM-DD HH:mm') : '';
                }
            },
            { headerName: '접수완료사', field: 'answerChargeCorperationName', width: 100 },
            {
                headerName: '답변등록',
                field: 'adminAnswerStatusName',
                width: 130,
                cellRenderer: params => {
                    params.value = params.value === '문의이관' ? '접수응대수락' : params.value === '접수완료' ? '답변등록' : '';
                    return params.value ? '<button type="button" class="btn btn-ss">' + params.value + '</button>' : '<span>-</span>';
                }
            },
            { headerName: '답변자', field: 'answerChargePersonName', width: 160 },
            {
                headerName: '답변일시',
                field: 'answerRegisterDatetime',
                width: 160,
                valueFormatter: param => {
                    return param.value ? dayJS(param.value).format('YYYY-MM-DD HH:mm') : '';
                }
            },
            { headerName: '악성클레임', field: 'badClaimYn', width: 100 },
            {
                headerName: '해결상태',
                field: 'solveStatusYn',
                width: 90,
                valueFormatter: param => {
                    return param.value === 'Y' ? '해결' : '미해결';
                }
            }
        ]);

        const store = useStore();
        const { onChangeRegistRol, onChangeDelRol, onChangeMaskingRol, onChangeDownRol } = authCommFunc();
        const menuInfo = computed(() => store.state.getMenuItem.menuInfo);



        const state = reactive({
            tableColum_c: _.clone(initColum.value),
            filterCoulm: [],
            //테이블 옵션
            defaultColDef: {
                sortable: false,
                filter: false,
                resizable: true,
                headerClass: 'centered',
                cellClass: 'centered'
            },
            qnaList: [],
            delList: [],
            pagesize: 10,
            gridApi: null,
            gridColumApi: null,
            openMore: false,
            searchTypeList: [
                { label: '전체', value: '' },
                { label: '회원명', value: 'memberName' },
                { label: '회원번호', value: 'memberSn' },
                { label: '문의담당사', value: 'inquiryChargeCorperationName' },
                { label: '문의내용', value: 'questionContents' },
                { label: '답변내용', value: 'answerContents' },
                { label: '답변자', value: 'answerChargePersonName' }
            ],
            //답변상태
            adminAnswerStatusList: [
                { label: '전체', value: '' }
            ],
            //문의유형
            questionTypeList: [
                { label: '전체', value: '' }
            ],
            //문의구분
            inquirySeperationList: [
                { label: '전체', value: '' }
            ],
            //해결상태
            solveStatusYnList: [
                { label: '전체', value: '' },
                { label: '미해결', value: 'N' },
                { label: '해결', value: 'Y' }
            ],
            //응답유형
            responseStatusList: [
                { label: '전체', value: '' }
            ],
            searchKeyword: '',
            setDay: '1month',
            isQnaTransfer: false,
            qnaTransferSn: null,


            mskgnRlsYn: true,
            mskgnTried: false, // 마스킹 해제 여부 ( 1회 실행 가능 - 1회 마스킹해제 시 제 실행 불가 )
            menuCode: computed(() => menuInfo.value.menuCode)
        });

        // 검색 조건
        const formData = reactive({
            inqType: 'inqDate', //수정or등록
            fromDate: computed(() => state.startday), //시작일
            toDate: computed(() => state.endday), //종료일
            questionType: '', //문의유형
            inquirySeperation: '', //문의구분
            searchType: '', //검색구분
            searchText: '', //내용
            answerStatus: '', //답변상태
            responseStatus: '', // 응대현황
            solveStatusYn: '', // 해결상태
            badClaimYn: null, // 악성클레임
            mskgnRlsYn: computed(() => state.mskgnRlsYn ? 'Y' : 'N'),
            menuCode: state.menuCode,
            page: 0
        });

        // 페이징 처리
        const pager = reactive({
            current: 1,
            currentPageSize: 1,
            size: computed(() => state.pagesize),
            offset: computed(() => (pager.current - 1) * pager.size),
            totalCnt: 0
        });

        watch(formData, () => {
            console.log('change formData');
            if (state.mskgnTried) {
                state.mskgnRlsYn = true;
            }
        });

        watch(() => state.menuCode, () => {
            // console.log('menucode', state.menuCode);
            getQnaList();
        });

        onMounted(async () => {
            //158000 답변상태
            codeList.getGroupCode(158000).then(result => {
                state.adminAnswerStatusList.push(...result);
            });
            //152000 문의유형
            codeList.getGroupCode(152000).then(result => {
                state.questionTypeList.push(...result.filter(item => item.useYn === 'Y'));
            });
            //154000 응대유형
            codeList.getGroupCode(154000).then(result => {
                state.responseStatusList.push(...result);
            });
            //287000 문의구분
            codeList.getGroupCode(287000).then(result => {
                state.inquirySeperationList.push(...result);
            });

            if (state.menuCode) getQnaList();

            emitter.$on('onChangeRegist', onChangeRegist);
            emitter.$on('onChangeDel', onChangeDel);
            emitter.$on('onChangeMskgn', onChangeMskgn);
        });

        onUnmounted(() => {
            emitter.$off('onChangeRegist');
            emitter.$off('onChangeDel');
            emitter.$off('onChangeMskgn');
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
            goToPage('/cs_center/qna/wire/register');
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
            listDel();
        };

        /**
         * 마스킹 권한 체크
         */
        const changeMskgnRlsYn = async () => {
            if (!state.mskgnTried) {
                await onChangeMaskingRol(menuInfo.value.auth6MaskingYn);
            }
        };

        /**
         * 마스킹 해제 처리 후 리스트 재조회
         */
        const onChangeMskgn = async () => {
            state.mskgnRlsYn = !state.mskgnRlsYn;
            await getQnaList();
            console.log('state.mskgnTried', state.mskgnTried);
            state.mskgnTried = true;
        };

        // 데이터 피커 날짜 검색
        const onSelectPicker = (type, value, status) => {
            // 버튼으로 선택된 기준
            if (type === 'day') {
                state.startday = value[0];
                state.endday = value[1];
            } else if (type === 'self_end' || type === 'self_start') {
                // 직접 데이터 피커 설정
                if (type === 'self_start') {
                    state.startday = value;
                } else if (type === 'self_end') {
                    state.endday = value;
                }
            }
            //console.log('선택일:' + value, '선택된 버튼:' + type, '조회기준:' + status, dayJS(formData.from).format('MM-DD'));
            formData.inqType = status;
        };
        // 상세 검색 열기
        const openMoreSerch = () => {
            state.openMore = !state.openMore;
        };

        // 테이블 리사이징을 위한 참조값
        const onGridReady = (params) => {
            state.gridApi = params.api;
            state.gridColumApi = params.columnApi;
        };

        // 체크 박스 선택시
        const onRowSelect = () => {
            state.delList = state.gridApi.getSelectedRows();
        };

        //테이블 셀 선택
        const onCellClicked = (e) => {
            //1:1문의
            if (e.colDef.field === 'questionTitle' && e.data.wireYn === 'N') goToPage('/cs_center/qna/detail?qnaSn=' + e.data.qnaSn);
            //유선문의
            if (e.colDef.field === 'questionTitle' && e.data.wireYn === 'Y') goToPage('/cs_center/qna/wire/detail?wireInqSn=' + e.data.qnaSn);
            //답변응대
            if (e.colDef.field === 'adminAnswerStatusName') registQnaAnswerAceept(e);
        };
        //페이징 처리
        const onChangedPage = (num) => {
            pager.current = num;
            //테이블 인덱스 번호 처리
            initColum.value[1].valueGetter = 'node.rowIndex + ' + Number(pager.size * (pager.current - 1) + 1);
            //api호출
            getQnaList();
        };
        //검색조건에 따른 리스트 재조회
        const reloadList = () => {
            pager.current = 1;
            onChangedPage(pager.current);
        };

        //리스트 갯수 변경 후 리스트 재 조회
        const clearList = (num) => {
            formData.value = {
                inqType: 'inqDate', //수정or등록
                fromDate: computed(() => state.startday), //시작일
                toDate: computed(() => state.endday), //종료일
                questionType: '', //문의유형
                inquirySeperation: '', //문의구분
                searchType: '', //검색구분
                searchText: '', //내용
                answerStatus: '', //답변상태
                responseStatus: '', // 응대현황
                solveStatusYn: '', // 해결상태
                badClaimYn: null, // 악성클레임
                mskgnRlsYn: state.mskgnRlsYn ? 'Y' : 'N',
                menuCode: state.menuCode,
                page: 0
            };
            onChangedPage(num);
        };

        //리스트 조회
        const getQnaList = async () => {
            try {
                console.log('get list', state.mskgnRlsYn);
                let params = {
                    size: pager.size,
                    offset: pager.offset,
                    inqType: formData.inqType, //검색 날짜유형
                    bgnDate: formData.fromDate, // 검색 시작일
                    endDate: formData.toDate, // 검색 종료일
                    inquirySeperation: formData.inquirySeperation, //문의구분
                    category: formData.questionType, // 문의유형
                    answerStatus: formData.answerStatus,  // 답변상태
                    searchType: formData.searchType, //검색조건
                    searchText: formData.searchText, //검색내용
                    responseStatus: formData.responseStatus, //응대현황
                    solveStatus: formData.solveStatusYn, //해결상태
                    badClaimYn: formData.badClaimYn,  //악성클레임
                    mskgnRlsYn: formData.mskgnRlsYn,  //마스킹
                    menuCode: state.menuCode //메뉴코드
                };
                console.log(params);
                const response = await _getQnaList(params);
                state.qnaList = response.data.data.list.map(item => {
                    // 유선문의
                    item.wireYn = item.inquirySeperationName === '유선문의' ? 'Y' : 'N';
                    return item;
                });
                console.log(state.qnaList);
                pager.totalCnt = response.data.data.totalCnt;
                state.mskgnTried = false;
            } catch (error) {
                console.log(error);
            }
        };
        //삭제 컨펌
        const listDel = () => {
            if (state.delList.length === 0) {
                $Modal.simple({
                    message: '삭제할 문의가 없습니다.',
                    buttonText: {
                        ok: '확인'
                    }
                });
            } else {
                $Modal.confirm({
                    message: '선택하신 등록 건을 삭제하시겠습니까?',
                    buttonText: {
                        confirm: '확인',
                        cancel: '취소'
                    }
                }).then(success => {
                    if (success === 'confirm') {
                        delQna();
                    }
                }).catch(error => {
                    console.log(error);
                });
            }
        };
        // 리스트 삭제
        const delQna = async () => {
            try {
                let param = {
                    qnaSnList: state.delList.filter(item => item.wireYn === 'N').map(item => item.qnaSn),
                    wireInqSnList: state.delList.filter(item => item.wireYn === 'Y').map(item => item.qnaSn),
                    menuCode: state.menuCode
                };

                await _deleteQna(param).then(result => {
                    if (result.data.code === 'OK') {
                        getQnaList();
                        state.delList = [];
                    } else {
                        console.log(result.data);
                    }
                });
            } catch (error) {
                console.log(error);
            }
        };

        //접수응대수락
        const registQnaAnswerAceept = async (e) => {
            try {
                console.log(e);
                if (e.type === '답변등록') {
                    //기능 미정
                    return false;
                }

                if (e.type === '접수응대수락') {
                    let params = {
                        qnaSn: e.params.data.qnaSn,
                        reponseStatusCode: '158003', // 접수완료
                        solveYn: e.params.data.solveStatusYn,
                        menuCode: state.menuCode
                    };

                    await _registQnaAnswerAceept(params).then(result => {
                        if (result.data.code === 'OK') {
                            getQnaList();
                        } else {
                            console.log(result.data);
                        }
                    });
                }
                /*


                });*/
            } catch (error) {
                console.log(error);
            }
        };


        // 조회 초기화
        const onInitDate = () => {
            dateSearch.value.initDate();
            //리스트 재조회
            clearList(1);
        };

        //셀렉트박스 선택
        const selectedOptions = (value, type) => {
            console.log(value, type);
            if (type === 'page') {
                state.pagesize = value;
                clearList(1);
            } else if (type === 'category') {
                if (value === 'all') {
                    formData.searchType = 'all';
                } else if (value === 'Y') {
                    formData.searchType = 'title';
                } else if (value === 'N') {
                    formData.searchType = 'content';
                }
            }
        };
        // 삭제할 컬럼 선택
        const checkOptions = (value) => {
            state.filterCoulm = value;
        };
        // 컬럼 변경
        const resetTable = () => {
            const columlist = _.clone(initColum.value);
            state.tableColum_c = columlist.filter(item => !state.filterCoulm.includes(item.headerName));
            return state.filterCoulm;
        };

        // 문의이관
        const qnaTransfer = () => {
            if (state.delList.length > 1) {
                $Modal.alert('1건만 선택해주세요.');
                return false;
            }

            // 문의 구분
            if (state.delList[0].inquirySeperationName === '유선문의') {
                $Modal.alert('유선문의는 이관할 수 없습니다.');
                return false;
            }

            // 문의이관, 접수완료, 답변완료
            if (state.delList[0].adminAnswerStatusName === '문의이관' || state.delList[0].adminAnswerStatusName === '접수완료' || state.delList[0].adminAnswerStatusName === '답변완료') {
                $Modal.alert('이미 ' + state.delList[0].adminAnswerStatusName + ' 하였습니다.');
                return false;
            }

            $Modal.confirm({
                title: '',
                message: '이관하기 전, 해당 담당자와 먼저 논의가 필요합니다. 문의이관 하시겠습니까?',
                buttonText: {
                    confirm: '확인',
                    cancel: '취소'
                }
            }).then(() => {
                state.qnaTransferSn = state.delList[0].qnaSn;
                state.isQnaTransfer = true;
            });
        };
        const exelParams = {
            params: formData,
            url: '/common/api/v1/qna/excel'
        };


        const modalClose = (item) => {
            console.log(item);
            if (item.name === 'isQnaTransfer') {
                state.isQnaTransfer = false;
                if (item.value) getQnaList();
            }
        };

        return {
            //공통 사용
            $Modal,
            dayJS,
            goToPage,
            tableResize,
            isDownShow,
            isPartnerShow,
            isImgShow,
            openModal,
            pager,
            state,
            initColum,
            formData,
            dateSearch,
            onGridReady,
            onCellClicked,
            openMoreSerch,
            reloadList,
            onChangedPage,
            selectedOptions,
            checkOptions,
            resetTable,
            onRowSelect,
            onSelectPicker,
            onInitDate,
            qnaTransfer,
            modalClose,
            menuInfo,

            checkRegist,
            checkDel,
            changeMskgnRlsYn,
            onChangeDownRol,
            exelParams
        };
    }
};
</script>