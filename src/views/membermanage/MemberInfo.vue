<template>
    <section class="s1">
        <!-- 검색 -->
        <div class="ui-data-filter">
            <div class="form-item">
                <dateSerch :dateTitle="'기간조회'" @onSelectDate="onSelectPicker"
                    :selectOptions="[{ label: '가입일시', value: '가입일시' }, { label: '수정일시', value: '수정일시' }]"
                    :selectButtonOptions="state.selectButtonOptions" />
                <div class="btn-filter-set">
                    <button type="button" class="btn btn-sm"><span class="ico-search"></span>조회 </button>
                    <button type="button" class="btn btn-sm">
                        <span class="ico-reload sg"></span>
                        <span class="offscreen">리로드</span>
                    </button>
                    <button type="button" class="btn btn-sm"><span class="txt">상세검색 열기</span></button>
                </div>
            </div>
        </div>
        <!-- 테이블 -->
        <div class="tbl-wrap">
            <div class="table-util flex space-between">
                <div class="btn-set-m flex">
                    <button type="button" class="btn btn-ss">양식다운로드</button>
                    <button type="button" class="btn btn-ss">일괄퇴사</button>
                </div>
                <div class="btn-set-m flex align-end">
                    <span class="table-total">조회결과 총 <strong>2</strong>건</span>
                    <button type="button" class="btn btn-opt">
                        <span class="ico-download"></span>파일다운로드
                    </button>
                    <select class="custom-select">
                        <option value="10개">10개</option>
                        <option value="20개">20개</option>
                        <option value="30개">30개</option>
                        <option value="40개">40개</option>
                    </select>
                </div>
            </div>
            <AgGridVue :columnDefs="state.value" :rowData="state.rowData" :defaultColDef="state.defaultColDef"
                class="ag-theme-alpine" style="height: 300px; width:100%">
            </AgGridVue>
        </div>

        로그인 정보{{ localuserInfo }}
        로컬저장 정보{{ localuserInfo }}
        <TreeMenu :treeTitle="'홈'" :treelist="state.trees" />
        <button @click="modal('simple')">단순 심플</button><br />
        <button @click="modal('alert')">alert modal</button><br />
        <button @click="modal('confirm')">confirm modal</button><br />
        <button @click="showModal">일반 팝업</button><br />
        {{ dayJS().format('YYYY-MM-DD') }}
        <!-- {{ dayJS(picked).format('YYYY-MM-DD') }}? -->
        1111
        <div>
            <!-- <div @click="opened">z클랙</div> -->
            <!-- <DatePicker v-model="picked" /> -->
        </div>
        <!-- <div style="margin-bottom:30px">
            <h1 style="font-size:15px; font-weight: 700;">스토어 사용 샘플</h1>
            <span>가져오기{{ counter }}</span>
            <div>test가져오기{{ test }}</div>
            <button @click="inc" style="border:solid 1px #ddd; padding:10px">inc</button>
        </div>
        <Bar :data="state.data" :options="state.options" />
        <div style="margin-bottom:30px">
            <ChartFrame />
            
        </div> -->
        <DefaultModal :isShow="isShow" :modalTitle="'페이지 타이틀'" :buttonConfirm="'확인'" :buttonCancel="'취소'"
            @modalclose="modalControl">
            <template #modalcontent>
                <div>페이지 내용 들어감 </div>
            </template>
        </DefaultModal>

        <PageNavigation :cntPerPage='pager.size' :itemCount='pager.totalCnt' :currentPage="pager.current"
            @changedPage="onChangedPage" />
        <div style="margin:30px 0">
            {{ pager.current }}
            {{ pager.size }}
        </div>

    </section>
</template>
<style>
.ag-body-horizontal-scroll-viewport {
    display: none
}
</style>
<script>
import { getCurrentInstance, computed, reactive, onMounted, inject, ref } from 'vue';
import ChartFrame from '@/components/chart/ChartFrame.vue';
import DefaultModal from '@/plugins/modal/modal/DefaultModal.vue';
import DateSerch from '@/components/ui/DateSerch.vue';
import TreeMenu from '@/components/ui/TreeMenu.vue';
import { useStore } from 'vuex';
import { _getCategoryList } from '@/api/dashboard';
import { format } from 'date-fns';

// dayJS(new Date()).format('YYYY-MM-DD')

export default {
    components: { ChartFrame, TreeMenu, DefaultModal, DateSerch },
    setup() {

        const internalInstance = getCurrentInstance();
        const isShow = ref(false);
        const $Modal = inject('$Modal');
        const dayJS = inject('dayJS');
        const store = useStore();
        const counter = computed(() => store.state.moduleA.counter);
        const test = computed(() => store.getters['moduleA/time2']);
        const userInfo = computed(() => store.getters['authModule/userInfo']);
        const localuserInfo = computed(() => localStorage.getItem(userInfo));
        const inc = () => store.commit('moduleA/setCounter', counter.value + 1);
        const state = reactive({
            array: ['a', 'b', 'c'],
            testapi: '',
            data: {
                labels: [
                    'January',
                    'February',
                    'March',
                    'April',
                    'May',
                    'June',
                    'July',
                    'August',
                    'September',
                    'October',
                    'November',
                    'December'
                ],
                datasets: [
                    {
                        label: 'Data One',
                        backgroundColor: '#f87979',
                        data: [40, 20, 12, 39, 10, 40, 39, 80, 40, 20, 12, 11]
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false
            },
            trees: [
                {
                    label: '회원관리',
                    subtree: [
                        {
                            label: '회원정보관리',
                            subtree: [
                                { label: '회원정보관리' },
                                { label: '회원정보 상세' },
                                { label: '자격상실 명단관리' }
                            ]
                        },
                        {
                            label: '취소',
                            subtree: [
                                { label: '회원정보관리' },
                                { label: '회원정보 상세' },
                                { label: '자격상실 명단관리' }
                            ]
                        },
                        {
                            label: '배송중',
                            subtree: [
                                { label: '회원정보관리' },
                                { label: '회원정보 상세' },
                                { label: '자격상실 명단관리' }
                            ]
                        },
                        {
                            label: '배송완료',
                            subtree: [
                                { label: '회원정보관리' },
                                { label: '회원정보 상세' },
                                { label: '자격상실 명단관리' }
                            ]
                        }
                    ]
                },
                {
                    label: '문의 방법',
                    subtree: [
                        { label: '1:1 문의' },
                        { label: '취소' },
                        { label: '배송중' },
                        { label: '유선문의' }
                    ]
                }
            ],


            // picked: dayJS(new Date).format('YYYY-MM-DD'),
            value: [
                { headerCheckboxSelection: true, checkboxSelection: true, with: 50 },
                { field: '번호', valueGetter: 'node.rowIndex + 1', width: 70 },
                {
                    field: '등급',
                    width: 9,
                    cellRenderer: (params) => {
                        const tagString = `<a id="mdselect-${params.node.rowIndex}">선택</a>`;
                        const buttonTarget = document.createElement('div');
                        buttonTarget.innerHTML = tagString;
                        const buttonEventTarget = buttonTarget.querySelector(`#mdselect-${params.node.rowIndex}`);
                        console.log(buttonTarget.querySelector(`#mdselect-${params.node.rowIndex}`));
                        buttonEventTarget.addEventListener('click', () => {
                            console.log(params.data);
                        });
                        return buttonTarget;
                    }
                },
                { field: '회원번호', width: 90, suppressSizeToFit: true },
                { field: '회원명', width: 80 },
                { field: '회원상태', width: 80 },
                { field: '기업명', width: 100 },
                { field: '연령대', width: 80 },
                { field: '사번', width: 100 },
                { field: '생년월일', width: 80 },
                { field: '성별', width: 100 },
                { field: '휴대폰번호', width: 200 },
                { field: '회사이메일', width: 100 },
                { field: '가입일시', width: 120 },
                { field: 'AppPush', width: 100 },
                { field: 'SMS', width: 100 },
                { field: 'EMail', width: 100 },
                { field: 'AppPush', width: 100 },
                { field: 'SMS', width: 100 },
                { field: 'EMail', width: 100 }
            ],
            rowData: [
                {
                    번호: 1,
                    등급: '일반일반일반일반일반일반일반',
                    회원번호: '200002644920000264492000026449',
                    회원명: '양*하양*하양*하양*하양*하양*하양*하',
                    회원상태: '가입가입가입가입가입가입가입가입',
                    기업명: '*랩*랩*랩*랩*랩*랩*랩*랩*랩*랩*랩*랩',
                    연령대: '30303030303030303030303030303030',
                    사번: '*******342*******342*******342',
                    생년월일: '198804**198804**198804**198804**',
                    성별: '여여여여여여여여여여여여여여여여여',
                    휴대폰번호: '010-9207-****010-9207-****010-9207-****',
                    회사이메일: '***kje@naver.com***kje@naver.com***kje@naver.com',
                    가입일시: '2023-07-10 14:29:162023-07-10 14:29:162023-07-10 14:29:16',
                    AppPush: 'NNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNN',
                    SMS: 'YYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYY',
                    EMail: 'YYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYY'
                },
                {
                    번호: 2,
                    등급: '일반일반일반일반일반일반일반',
                    회원번호: '200002644920000264492000026449',
                    회원명: '양*하양*하양*하양*하양*하양*하양*하',
                    회원상태: '가입가입가입가입가입가입가입가입',
                    기업명: '*랩*랩*랩*랩*랩*랩*랩*랩*랩*랩*랩*랩',
                    연령대: '30303030303030303030303030303030',
                    사번: '*******342*******342*******342',
                    생년월일: '198804**198804**198804**198804**',
                    성별: '여여여여여여여여여여여여여여여여여',
                    휴대폰번호: '010-9207-****010-9207-****010-9207-****',
                    회사이메일: '***kje@naver.com***kje@naver.com***kje@naver.com',
                    가입일시: '2023-07-10 14:29:162023-07-10 14:29:162023-07-10 14:29:16',
                    AppPush: 'NNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNN',
                    SMS: 'YYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYY',
                    EMail: 'YYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYY'
                },
                {
                    번호: 1,
                    등급: '일반일반일반일반일반일반일반',
                    회원번호: '200002644920000264492000026449',
                    회원명: '양*하양*하양*하양*하양*하양*하양*하',
                    회원상태: '가입가입가입가입가입가입가입가입',
                    기업명: '*랩*랩*랩*랩*랩*랩*랩*랩*랩*랩*랩*랩',
                    연령대: '30303030303030303030303030303030',
                    사번: '*******342*******342*******342',
                    생년월일: '198804**198804**198804**198804**',
                    성별: '여여여여여여여여여여여여여여여여여',
                    휴대폰번호: '010-9207-****010-9207-****010-9207-****',
                    회사이메일: '***kje@naver.com***kje@naver.com***kje@naver.com',
                    가입일시: '2023-07-10 14:29:162023-07-10 14:29:162023-07-10 14:29:16',
                    AppPush: 'NNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNN',
                    SMS: 'YYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYY',
                    EMail: 'YYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYY'
                }
            ],
            defaultColDef: {
                sortable: true,
                filter: false,
                resizable: true,
                flex: 1
            },
            startday: null,
            endday: null,
            //기간조회 버튼 옵션
            selectButtonOptions: [
                { label: '1년', value: 'year' },
                { label: '6개월', value: '6month' },
                { label: '1개월', value: '1month' },
                { label: '일주일', value: 'week' },
                { label: '당일', value: 'today' }
            ]


        });
        const pager = reactive({
            current: 2,
            currentPageSize: 0,
            size: 3,
            offset: computed(() => (pager.current - 1) * pager.size),
            totalCnt: 10
        });
        // 페이징 처리
        const onChangedPage = (pagenum) => {
            //console.log(pagenum);
            pager.current = pagenum;
            //api호출
        };
        // 데이터 피커 날짜 검색
        const onSelectPicker = (type, value) => {
            if (type === 'day') {
                state.startday = value[0];
                state.endday = value[1];
            }
            console.log(state.startday, state.endday, type, value);
            //api호출
        };

        onMounted(() => {
            testApi();
            localStorage.getItem('userInfo');
        });
        const openFolder = (e) => {
            let node = e.target.parentNode.lastChild;
            if (node.classList.contains('hidden')) {
                node.classList.remove('hidden');
            } else {
                node.classList.add('hidden');
            }
        };

        const testApi = async () => {
            try {
                const response = await _getCategoryList();
                console.log('test api', response);
                state.testapi = response;
            } catch (error) {
                console.log(error);
            }
        };
        //confirm
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
        const showModal = () => {
            isShow.value = true;
        };
        const closeModal = (type, value) => {
            console.log(type, value);
            isShow.value = false;
        };
        const modalControl = (type) => {
            if (type)
                switch (type) {
                    case 'modalclose':
                        return isShow.value = false;
                    case 'modalconfirm':
                        return console.log('confirm');
                    case 'modalcancel':
                        return console.log('cancel');
                }
            else isShow.value = false;
        };


        return {
            state,
            counter,
            test,
            isShow,
            dayJS,
            pager,
            userInfo,
            localuserInfo,
            format,
            inc,
            openFolder,
            modal,
            modalControl,
            showModal,
            closeModal,
            onChangedPage,
            onSelectPicker
        };
    }
};
</script>