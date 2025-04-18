<template>
    <div>
        <div class="ui-section">
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
                                <th scope="row">제목</th>
                                <td colspan="3">{{ state.eventMaster.eventName }}</td>
                            </tr>
                            <tr>
                                <th scope="row">이벤트 유형</th>
                                <td>
                                    <span v-if="state.eventMaster.eventType == 'GENERAL'">일반</span>
                                    <span v-if="state.eventMaster.eventType == 'QUIZ'">퀴즈</span>
                                    <span v-if="state.eventMaster.eventType == 'ROULETTE'">룰렛</span>
                                    <span v-if="state.eventMaster.eventType == 'ATTENDANCE'">출석</span>
                                </td>
                                <th scope="row">게시 여부</th>
                                <td>
                                    {{ state.eventMaster.pstYn }}
                                </td>
                            </tr>
                            <tr>
                                <th scope="row">참여 제한</th>
                                <td>
                                    <span v-if="state.eventMaster.pcpType == 'ONEDAY'">1일1회</span>
                                    <span v-if="state.eventMaster.pcpType == 'ONCE'">기간내 1회</span>
                                    <span v-if="state.eventMaster.pcpType == 'LIMIT'">기간내 ({{ state.eventMaster.pcpCount
                                    }})회</span>
                                    <span v-if="state.eventMaster.pcpType == 'NONE'">참여제한없음</span>
                                </td>
                                <th scope="row">이벤트 기간</th>
                                <td>
                                    {{ state.eventMaster.eventStartDt }} ~ {{ state.eventMaster.eventEndDt }}
                                    (당첨자 발표일 :{{ state.eventMaster.eventPzwnDt }})
                                </td>
                            </tr>
                            <tr>
                                <th scope="row">혜택 구분</th>
                                <td>
                                    <template v-if="state.eventMaster.eventBnefType === 'NONE'">
                                        혜택없음
                                    </template>
                                    <template v-else-if="state.eventMaster.eventBnefType === 'IMMEDIATELY'">
                                        즉시지급
                                    </template>
                                    <template v-else-if="state.eventMaster.eventBnefType === 'AFTER'">
                                        당첨 후 지급
                                    </template>
                                </td>
                                <th scope="row">이벤트 코드</th>
                                <td>{{ state.eventMaster.eventSn }}</td>
                            </tr>
                            <tr>
                                <th scope="row">당첨 후 지급 혜택</th>
                                <td>외부 소싱 상품</td>
                                <th scope="row">당첨 인원</th>
                                <td>{{ state.pzwrList.length }}</td>
                            </tr>
                            <tr>
                                <th scope="row">약관</th>
                                <td colspan="3">
                                    <template v-if="state.eventMaster.eventClusList !== null">
                                        <template v-for="(item, index) in state.eventMaster.eventClusList" :key="index">
                                            <router-link :to="`/policy/register?clusMngSn=${item.clusMngSn}&detailTyCd=DL`"
                                                target="_blank">
                                                {{ item.clusNm }}
                                            </router-link>
                                        </template>
                                    </template>
                                    <template v-else>
                                        -
                                    </template>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
        <div class="ui-section">
            <div class="ui-content">
                <div class="ui-data-filter sm">
                    <div class="form-item">
                        <div class="item">
                            <span class="input">
                                <span class="dv">
                                    <select class="custom-select" v-model="formData.searchType">
                                        <option :value="item.value" v-for="(item, index) in state.searchList" :key="index">
                                            {{ item.label }}</option>
                                    </select>
                                </span>
                                <span class="dv">
                                    <input type="text" class="form-control w-300" v-model="formData.searchText">
                                </span>
                            </span>
                        </div>
                        <div class="btn-filter-set">
                            <button type="button" class="btn btn-sm" @click="reloadList">
                                <span class="ico-search"></span>조회
                            </button>
                            <button type="button" class="btn btn-sm" @click="onInitDate">
                                <span class="ico-reload sg"></span><span class="offscreen">리로드</span>
                            </button>
                        </div>
                    </div>
                </div>
                <div class="tbl-wrap">
                    <div class="table-util flex space-between">
                        <div class="btn-set-m flex">
                            <button type="button" class="btn btn-ss" @click="changeMskgnRlsYn()"
                                :disabled="!state.mskgnRlsYn || state.mskgnTried">
                                마스킹해제
                            </button>
                        </div>
                        <div class="btn-set-m flex align-end">
                            <span class="table-total">조회결과 총 <strong>{{ state.pzwrList.length }}</strong>건</span>
                            <button type="button" class="btn btn-opt"
                                @click="onChangeDownRol(menuInfo.auth5DownloadYn, formData.mskgnRlsYn, excelParams)">
                                <span class="ico-download"></span>파일다운로드
                            </button>
                            <selectBox :selectType="'page'" @changedValue="selectedOptions_list" />
                            <!-- <button type="button" class="btn btn-opt-ico fit">
                                <span class="offscreen">컬럼 리사이징</span>
                            </button> -->

                            <!-- 클래스 : full -->
                            <button type="button" class="btn btn-opt-ico filter" @click="resetTable">
                                <span class="offscreen">컬럼 셋팅</span>
                            </button>
                            <!-- 클래스 : close -->
                        </div>
                    </div>
                    <columlist :columlists="initColum" @checkColum="checkOptions" />
                    <NoData :nodatatext="'조회된 데이터가 없습니다.'" v-if="state.pzwrList.length === 0"></NoData>
                    <div v-else>
                        <AgGridVue :columnDefs="state.tableColum_c" :rowData="state.pzwrList"
                            :defaultColDef="state.defaultColDef" class="ag-theme-alpine" :domLayout="state.domLayout"
                            style="width:100%">
                        </AgGridVue>

                    </div>
                    <div class="btn-bottom-set flex justify-center">
                        <button type="button" class="btn btn-sl nega"
                            @click="goToPage('/event/after_reciever');">취소</button>
                        <button type="button" class="btn btn-sl posi" @click="upDataAfter">저장</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import { reactive, inject, ref, onMounted, computed, onUnmounted, watch } from 'vue';
import { useCommFunc } from '@/core/helper/common.js';
import { authCommFunc } from '@/core/helper/authComm.js';
import { useStore } from 'vuex';
import { useRouter, useRoute } from 'vue-router';
import { _getPzwrDetail, _upDatePzwrDetail } from '@/api/event.js';
export default {
    setup() {
        const $Modal = inject('$Modal');
        const dayJS = inject('dayJS');
        const store = useStore();
        const route = useRoute();
        const dateSearch = ref(null);
        const orderList = ref([]);
        const { goToPage, tableResize, openModal, getCommonCode } = useCommFunc();
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
        const { onChangeMaskingRol, onChangeDownRol } = authCommFunc();
        const menuInfo = computed(() => store.state.getMenuItem.menuInfo);
        const initColum = ref([
            {
                headerName: '번호',
                field: 'no',
                maxWidth: 80,
                valueGetter: 'node.rowIndex + 1',
                suppressSizetoFit: true
            },
            { headerName: '회원번호', field: 'pzwrMbrSn', maxWidth: 130 },
            { headerName: '이름', field: 'mbrNm', maxWidth: 100 },
            { headerName: '휴대폰번호', field: 'mbrHp', maxWidth: 130 },
            { headerName: '이메일 주소', field: 'mbrEmail', maxWidth: 150 },

            {
                headerName: '제세공과금 대상',
                field: 'productTax',
                maxWidth: 125,
                valueGetter: (params) => {
                    if (params.data.productTax === 'Y') {
                        return '대상';
                    } else if (params.data.productTax === 'N') {
                        return '비대상';
                    }
                }
            },
            { headerName: '순위', field: 'rank', maxWidth: 80 },
            { headerName: '당첨상품', field: 'productNm' },
            {
                headerName: '택배사',
                field: 'dscmp',
                maxWidth: 140,
                cellRenderer: (params) => {
                    let tagString = document.createElement('select');
                    tagString.classList.add('custom-select');
                    for (let i = 0; i < params.data.dscmpList.length; i++) {
                        let option = document.createElement('option');
                        option.value = params.data.dscmpList[i].cmnCdNm;
                        option.text = params.data.dscmpList[i].cmnCdNm;
                        option.selected = params.data.dscmpList[i].cmnCdNm === params.data.dscmp;
                        tagString.appendChild(option);
                    }
                    const buttonTarget = document.createElement('div');
                    buttonTarget.appendChild(tagString);
                    buttonTarget.addEventListener('change', (e) => {
                        if (e.target.value === '선택') {
                            //선택시 초기값 설정
                            state.upDateOrderList[params.node.rowIndex].dscmp = '';
                            state.upDateOrderList[params.node.rowIndex].invcNo = '';
                            document.querySelector(`#eventnum-${params.node.rowIndex}`).value = '';
                            document.querySelector(`#eventCheck-${params.node.rowIndex}`).checked = false;
                            state.upDateOrderList[params.node.rowIndex].sndnYn = '';
                        } else {
                            state.upDateOrderList[params.node.rowIndex].dscmp = e.target.value;
                        }

                    });

                    return buttonTarget;
                }
            },
            {
                headerName: '운송장번호',
                field: 'invcNo',
                maxWidth: 160,
                cellRenderer: (params) => {
                    const tagString =
                        `<input type="text" class="form-control" id=eventnum-${params.node.rowIndex} value='${params.data.invcNo}'>`;
                    const buttonTarget = document.createElement('div');
                    buttonTarget.innerHTML = tagString;
                    const buttonEventTarget = buttonTarget.querySelector(`#eventnum-${params.node.rowIndex}`);
                    buttonEventTarget.addEventListener('change', (e) => {
                        state.upDateOrderList[params.node.rowIndex].invcNo = e.target.value;

                    });
                    return buttonTarget;
                }
            },
            {
                headerName: '배송완료',
                field: 'sndnYn',
                maxWidth: 110,
                cellRenderer: (params) => {
                    const tagString = `<span class="checkbox"><input type="checkbox" id=eventCheck-${params.node.rowIndex}><label for="eventCheck-${params.node.rowIndex}">배송완료</label></span>`;
                    const tagStringChecked = `<span class="checkbox"><input type="checkbox" id=eventCheck-${params.node.rowIndex} checked><label for="eventCheck-${params.node.rowIndex}">배송완료</label></span>`;
                    const buttonTarget = document.createElement('div');
                    buttonTarget.innerHTML = params.data.sndnYn === '' || params.data.sndnYn === 'N' ? tagString : tagStringChecked;
                    const buttonEventTarget = buttonTarget.querySelector(`#eventCheck-${params.node.rowIndex}`);
                    buttonEventTarget.addEventListener('change', (e) => {
                        const target = 'sndnYn';
                        const CheckType = e.target.checked === true ? 'Y' : '';
                        state.upDateOrderList[params.node.rowIndex].sndnYn = CheckType;

                    });

                    return buttonTarget;
                }
            }
        ]);
        const state = reactive({
            //테이블데이터
            tableColum_c: _.clone(initColum),
            filterCoulm: [],
            //테이블 옵션
            defaultColDef: {
                sortable: true,
                filter: false,
                resizable: true,
                flex: 1,
                headerClass: 'centered',
                cellClass: 'centered'
            },
            domLayout: 'autoHeight',
            eventSn: 0,
            eventMaster: {},
            pzwrList: [],
            mskgnRlsYn: true,
            mskgnTried: false,
            upDateOrderList: [],
            searchList: [
                { label: '회원이름', value: 'MBRNM' },
                { label: '회원번호', value: 'MBRSN' }
            ]
        });

        const formData = reactive({
            eventSn: computed(() => state.eventSn),
            searchText: '',
            searchType: 'MBRNM',
            mskgnRlsYn: computed(() => state.mskgnRlsYn ? 'Y' : 'N')

        });

        // 마스킹 해제 이벤트 버스 해제
        onUnmounted(() => {
            emitter.$off('onChangeMskgn');
        });

        /**
         * 마스킹 권한 체크
         */
        const changeMskgnRlsYn = async () => {
            await onChangeMaskingRol(menuInfo.value.auth6MaskingYn);
        };

        /**
         * 마스킹 해제 처리 후 리스트 재조회
         */
        const onChangeMskgn = () => {
            state.mskgnRlsYn = !state.mskgnRlsYn;
            getPzwrDetail();
        };
        watch(formData, () => {
            console.log('change formData');
            if (state.mskgnTried) {
                state.mskgnRlsYn = true;
            }
        });
        onMounted(async () => {
            console.log(excelParams);
            await getCommonCode(341000, getlistCommonCode);
            if (route.query.eventSn) {
                state.eventSn = route.query.eventSn;
                await getPzwrDetail();
            }
            emitter.$on('onChangeMskgn', onChangeMskgn);
        });

        const getlistCommonCode = (value) => {
            orderList.value = value;
            console.log(orderList.value);
            orderList.value.splice(0, 0, { cmnCd: '', cmnCdNm: '선택' });
        };
        //상세 조회
        const getPzwrDetail = async () => {
            try {
                let params = {
                    searchText: formData.searchText,
                    searchType: formData.searchType,
                    mskgnRlsYn: formData.mskgnRlsYn
                };
                const response = await _getPzwrDetail(state.eventSn, params);
                state.eventMaster = response.data.data.eventMaster;
                state.pzwrList = response.data.data.pzwrList.list;
                //택배사 공통코드 추가
                state.pzwrList = state.pzwrList.map((item, index) => {
                    let _item = item;
                    _item['dscmpList'] = orderList.value;

                    return _item;
                });
                // 업데이트 할 배열 미리 생성
                state.upDateOrderList = state.pzwrList.map(d => {
                    const item = {
                        eventSn: Number(state.eventSn),
                        tblSn: d.tblSn,
                        dscmp: d.dscmp !== '' ? d.dscmp : '',
                        invcNo: d.invcNo !== '' ? d.invcNo : '',
                        sndnYn: d.sndnYn !== '' ? d.sndnYn : ''
                    };
                    return item;
                });
                state.mskgnTried = false;
            } catch (error) {
                console.log(error);
            }
        };
        // 배송정보 수정
        const upDataAfter = () => {
            $Modal.confirm({
                message: '저장하시겠습니까?',
                buttonText: {
                    confirm: '확인',
                    cancel: '취소'
                }
            })
                .then(async (success) => {
                    await upDatePzwrDetail(state.upDateOrderList);
                })
                .catch(error => {
                    console.log(error);
                });

        };
        // 배송정보 수정API
        const upDatePzwrDetail = async (params) => {
            const response = await _upDatePzwrDetail(state.eventSn, params);
            if (response.data.code === 'OK') {
                goToPage('/event/after_reciever');
            }
        };
        // 삭제할 컬럼 선택
        const checkOptions = (value) => {
            state.filterCoulm = value;
        };
        // 컬럼 변경
        const resetTable = () => {
            const initColum = _.clone(state.tableColum_c);
            state.tableColum_c = initColum.filter(item => !state.filterCoulm.includes(item.headerName));
            return state.filterCoulm;
        };
        const initParams = () => {
            formData.searchType = 'MBRNM';
            formData.searchText = '';
            state.mskgnRlsYn = true;
            state.mskgnTried = false;
        };
        //리스트 갯수 변경 후 리스트 재 조회
        const clearList = (num) => {
            initParams();
            getPzwrDetail();
        };
        //검색조건에 따른 리스트 재조회
        const reloadList = () => {
            getPzwrDetail();
        };
        // 데이터 피커 초기화
        const onInitDate = () => {
            //재조회  api 호출
            clearList();
        };
        //셀렉트박스 선택
        const selectedOptions_list = (value, type) => {
            if (type === 'page') {
                state.pagesize = value;
                clearList(1);
            }
        };

        // 엑셀용 함수
        const excelParams = reactive({
            params: {
                searchType: computed(() => formData.searchType),
                searchText: computed(() => formData.searchText),
                mskgnRlsYn: computed(() => formData.mskgnRlsYn),
                menuCode: computed(() => menuInfo.value.menuCode)
            },
            url: `/common/api/v1/event/pwzr/manage/excel/${route.query.eventSn}`
        });
        return {
            //공통 사용
            $Modal,
            dayJS,
            goToPage,
            state,
            formData,
            initColum,
            selectedOptions_list,
            onInitDate,
            reloadList,
            changeMskgnRlsYn,
            onChangeDownRol,
            excelParams,
            getCommonCode,
            orderList,
            upDataAfter,
            menuInfo,
            checkOptions,
            resetTable
        };
    }
};
</script>