<template>
    <div>
        <DefaultModal :isShow="state.isEventPoint" :modalTitle="'포인트 정책 검색'" :buttonConfirm="''" :buttonCancel="'닫기'"
            :modalName="'isEventPoint'" @modalclose="pointModalControl" :className="'wide'">
            <template #modalcontent>
                <div>
                    <div class="ui-data-filter sm">
                        <div class="form-item">
                            <div class="item">
                                <label>검색조건</label>
                                <span class="input">
                                    <span class="dv">
                                        <select class="custom-select sm">
                                            <option value="선택">선택</option>
                                        </select>
                                    </span>
                                    <span class="dv">
                                        <input type="text" class="form-control sm">
                                    </span>
                                </span>
                            </div>
                            <div class="btn-filter-set">
                                <button type="button" class="btn btn-sm"><span class="ico-search"></span>조회</button>
                                <button type="button" class="btn btn-sm">
                                    <span class="ico-reload sg"></span>
                                    <span class="offscreen">리로드</span>
                                </button>
                            </div>
                        </div>

                    </div>
                    <div class="tbl-wrap">
                        <div class="table-util flex space-between">
                            <div></div>
                            <div class="btn-set-m flex align-end">
                                <span class="table-total">조회결과 총 <strong>{{ state.repointlist.length }}</strong>건</span>

                            </div>
                        </div>
                        <NoData :nodatatext="'조회된 데이터가 없습니다.'" v-if="state.repointlist.length === 0"></NoData>
                        <div v-else>
                            <AgGridVue :columnDefs="state.tableColum_point" :rowData="state.repointlist"
                                @cell-clicked="onCellClicked" :defaultColDef="state.defaultColDef" class="ag-theme-alpine"
                                :domLayout="state.domLayout" style="width:100%">
                            </AgGridVue>
                        </div>
                    </div>
                </div>
            </template>
        </DefaultModal>
    </div>
</template>
<script>
import { getCurrentInstance, computed, reactive, inject, ref, onMounted, watch } from 'vue';
import { useStore } from 'vuex';
import { useRouter, useRoute } from 'vue-router';
import { useCommFunc } from '@/core/helper/common.js';
import DefaultModal from '@/plugins/modal/modal/DefaultModal.vue';
import { _getEventPoint } from '@/api/event.js';
export default {
    props: ['isEventPoint', 'formData', 'pointValue', 'choiceSelectNum', 'pointType'],
    emits: ['formDataChangePoint', 'chiocePoint', 'modalclose'],
    components: { DefaultModal },
    setup(props) {
        const internalInstance = getCurrentInstance();
        const $Modal = inject('$Modal');
        const dayJS = inject('dayJS');
        const route = useRoute();
        const { goToPage, openModal } = useCommFunc();
        const { emit } = getCurrentInstance();
        const initColum_point = ref([
            { headerName: '정책번호', field: 'plcyCd', maxWidth: 180 },
            { headerName: '정책명', field: 'pntPlcyNm' },
            { headerName: '포인트', field: 'point', maxWidth: 90 },
            {
                headerName: '정책기간',
                field: 'pntPlcyBgnDate',
                maxWidth: 180,
                valueGetter: (params) => {
                    return dayJS(params.data.pntPlcyBgnDate).format('YYYY-MM-DD') + '~' + dayJS(params.data.pntPlcyEndDate).format('YYYY-MM-DD');
                }
            }
        ]);
        const state = reactive({
            formData: computed(() => props.formData),
            isEventPoint: computed(() => props.isEventPoint),
            pointValue: computed(() => props.pointValue),
            choiceSelectNum: computed(() => props.choiceSelectNum),
            pointType: computed(() => props.pointType),
            repointlist: [],
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
            tableColum_point: _.clone(initColum_point),
            pointObj: {
                plcyMapKeySn: 0,
                point: 0
            },
            pointNum: []
        });
        watch(props, () => {
            if (props.isEventPoint) {
                getEventPoint();
                console.log(state.pointType);
            }
        });
        onMounted(() => {
            // getEventPoint();
            // console.log(state.formData);
        });
        //포인트 조회
        const getEventPoint = async () => {
            try {
                let params = state.formData.eventType;
                const response = await _getEventPoint(params);
                state.repointlist = response.data.data;
                //출석포인트 지급시 케이스별 구분
                if (state.pointType === 'eventBasicPoint') {
                    state.repointlist = state.repointlist.filter(item => item.eventATndType === 'BASIC');
                    // console.log(state.repointlist);
                }
                if (state.pointType === 'eventGaegnPoint') {
                    state.repointlist = state.repointlist.filter(item => item.eventATndType === 'GAEGN');
                    // console.log(state.repointlist);
                }
                if (state.pointType === 'chcEpsPayPnt') {
                    state.repointlist = state.repointlist.filter(item => item.eventATndType === 'ADD');
                    // console.log(state.repointlist);
                }
            } catch (error) {
                console.log(error);

            }
        };
        //포인트 모달 컨트롤
        const pointModalControl = (type, modalName) => {
            console.log(type, modalName);
            if (modalName === 'isEventPoint') {
                if (type === 'modalclose' || type === 'modalcancel') {
                    emit('modalClose', 'close');
                }
            } else {
                emit('modalClose', 'close');
            }
        };
        //테이블셀 선택 
        const onCellClicked = (e) => {
            console.log(e.data);
            //포인트 정책일 
            let poStartDay = e.data.pntPlcyBgnDate;
            let poEndDay = e.data.pntPlcyEndDate;
            let evStartDay = state.formData.eventStartDt;
            let evSEndDay = state.formData.eventEndDt;
            const isDuplicate = new Set(state.choiceSelectNum);
            //날짜 비교 이벤트 날짜보다 포인트 날짜가 많아야 함 시작 끝
            if ((poStartDay <= evStartDay) && (poEndDay >= evSEndDay)) {
                emit('modalClose', 'close');
                if (state.formData.eventType === 'GENERAL' || state.formData.eventType === 'QUIZ') {
                    state.pointObj = {
                        plcyMapKeySn: e.data.plcyMapKeySn,
                        point: e.data.point
                    };
                    emit('formDataChangePoint', state.pointObj);
                    console.log('일반 이벤트 등록');
                }
                if (state.formData.eventType === 'ATTENDANCE') {
                    // 포인트 중복 선택은 안됨
                    if (!isDuplicate.has(e.data.plcyMapKeySn)) {
                        state.pointObj = {
                            plcyMapKeySn: e.data.plcyMapKeySn,
                            point: e.data.point
                        };
                        emit('formDataChangePoint', state.pointObj, state.pointType, state.pointValue);
                    } else {
                        emit('modalClose', 'close');
                        $Modal.simple({
                            title: '',
                            message: '이미 선택된 포인트 입니다.',
                            buttonText: {
                                ok: '확인'
                            }
                        })
                            .then(success => {
                                console.log(success);
                                emit('modalClose', 'open', '', state.pointValue);
                            })
                            .catch(error => {
                                console.log(error);
                                emit('modalClose', 'open', '', state.pointValue);
                            });
                    }


                }
                if (state.formData.eventType === 'ROULETTE') {
                    // 포인트 중복 선택은 안됨
                    if (!isDuplicate.has(e.data.plcyMapKeySn)) {
                        state.pointObj = {
                            plcyMapKeySn: e.data.plcyMapKeySn,
                            point: e.data.point
                        };
                        emit('formDataChangePoint', state.pointObj, state.pointValue);
                    } else {
                        emit('modalClose', 'close');
                        $Modal.simple({
                            title: '',
                            message: '이미 선택된 포인트 입니다.',
                            buttonText: {
                                ok: '확인'
                            }
                        })
                            .then(success => {
                                console.log(success);
                                emit('modalClose', 'open', '', state.pointValue);
                            })
                            .catch(error => {
                                console.log(error);
                                emit('modalClose', 'open', '', state.pointValue);
                            });
                    }

                }
            } else {
                emit('modalClose', 'close');
                $Modal.simple({
                    title: '',
                    message: '포인트 지급일이 이벤트 진행일과 일치 하지 않습니다.',
                    buttonText: {
                        ok: '확인'
                    }
                })
                    .then(success => {
                        console.log(success);
                        emit('modalClose', 'open');
                    })
                    .catch(error => {
                        console.log(error);
                        emit('modalClose', 'open');
                    });
            }
        };
        return {
            $Modal,
            dayJS,
            goToPage,
            openModal,
            state,
            pointModalControl,
            onCellClicked
        };
    }
};
</script>