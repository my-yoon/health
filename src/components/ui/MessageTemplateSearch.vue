<template>
    <div>
        <div class="ui-data-filter">
            <div class="form-item">
                <div class="item">
                    <label>검색조건</label>
                    <span class="input">
                        <select v-model="formData.searchType" class="custom-select sm">
                            <option v-for="(item, index) in state.searchTypeList" :key="index"
                                    :value="item.value">
                                {{ item.label }}
                            </option>
                        </select>
                        <span class="dv">
                            <input v-model="formData.searchText" class="form-control sm" type="text">
                        </span>
                    </span>
                </div>
                <div class="item">
                    <label>채널</label>
                    <span class="input">
                    <span class="dv">
                        <select v-model="formData.channelType" class="custom-select sm">
                            <option v-for="(item, index) in state.channelTypeList" :key="index"
                                    :value="item.value">
                                {{ item.label }}
                            </option>
                        </select>
                    </span>
                </span>
                </div>
                <div class="item">
                    <label>발송목적</label>
                    <span class="input">
                    <span class="dv">
                        <select v-model="formData.sendPurposeType" class="custom-select sm">
                            <option v-for="(item, index) in state.sendPurposeList" :key="index"
                                    :value="item.value">
                                {{ item.label }}
                            </option>
                        </select>
                    </span>
                </span>
                </div>
                <div class="btn-filter-set">
                    <button class="btn btn-sm" type="button" @click="reloadList">
                        <span class="ico-search"></span>검색
                    </button>
                    <button class="btn btn-sm" type="button" @click="clearList(1)">
                        <span class="ico-reload sg"></span>
                        <span class="offscreen">초기화</span>
                    </button>
                </div>
            </div>
        </div>
        <div class="tbl-wrap">
            <div class="table-util flex space-between">
                <div class="btn-set-m">
                <span class="checkbox">
                    <input id="myTemp" v-model="formData.fstRgtrSn" false-value="" name="myTempGroup" true-value="1" type="checkbox" @change="myTemplate">
                    <label for="myTemp">나의 템플릿만 보기</label>
                </span>
                </div>
                <div class="btn-set-m align-end">
                    <span class="table-total">조회결과 총 <strong>{{ pager.totalCnt }}</strong>건</span>
                </div>
            </div>
            <div class="ui-msg-temp">
                <div v-for="(item,index) in state.templateList" :key="item.cstNcTmplSn" class="msg-temp-item">
                    <div class="msg-temp-item-head">
                        <h4>{{ item.ttl }}</h4>
                        <span class="radio">
                        <input :id="'messageTemplate'+index" :key="index" v-model="selectMessage" :value="item" name="messageTemplate" type="radio"
                               @input="onSelectTemplate(item)">
                        <label :for="'messageTemplate'+index">선택</label>
                    </span>
                    </div>
                    <div class="msg-temp-item-cont">
                        <div class="inner" v-html="item.cts">
                        </div>
                    </div>
                </div>
            </div>
            <PageNavigation :cntPerPage='pager.size' :currentPage="pager.current" :itemCount='pager.totalCnt'
                            @changedPage="onChangedPage"/>
        </div>
    </div>
</template>
<script>
import {getCurrentInstance, reactive, ref, onMounted, computed} from 'vue';
import {_getCustomerAlarmTempList} from '@/api/operate.js';

export default {
    props: ['channelTypeList', 'sendPurposeList'],
    emits: ['update:modelValue'],
    setup(props) {
        const {emit} = getCurrentInstance();
        const selectMessage = ref();

        const state = reactive({
            templateList: [],
            pagesize: 8,

            searchKeyword: '',
            domLayout: 'autoHeight',
            // 검색조건
            searchTypeList: [
                {label: '전체', value: ''},
                {label: '탬플릿 제목', value: 'ttl'},
                {label: '메세지 내용', value: 'cts'}
            ],
            // 채널 타입
            channelTypeList: [
                {label: '전체', value: ''},
                ...props.channelTypeList
            ],
            // 발송목적
            sendPurposeList: [
                {label: '전체', value: ''},
                ...props.sendPurposeList
            ]
        });

        // 페이징 처리
        const pager = reactive({
            current: 1,
            currentPageSize: 1,
            size: computed(() => state.pagesize),
            offset: computed(() => (pager.current - 1) * pager.size),
            totalCnt: 0
        });

        // 검색 조건
        const formData = reactive({
            searchType: '', // 검색조건
            searchText: '', // 검색내용
            page: 0,
            channelType: '', // 채널
            sendPurposeType: '', // 발송목적
            fstRgtrSn: null // 나만의 템플릿
        });

        onMounted(() => {
            getTemplateList();
        });

        const getTemplateList = async () => {
            try {
                let params = {
                    size: pager.size,
                    offset: pager.offset,
                    ttl: !!formData.searchText && formData.searchType === 'ttl' ? formData.searchText : null, // 메세지 제목
                    cts: !!formData.searchText && formData.searchType === 'cts' ? formData.searchText : null,  // 메세지 내용
                    chnCd: !!formData.channelType ? formData.channelType : null, // 채널
                    sndnPuCd: !!formData.sendPurposeType ? formData.sendPurposeType : null, // 발송목적
                    fstRgtrSn: !!formData.fstRgtrSn ? formData.fstRgtrSn : null, // 나만의 템플릿
                    page: 0
                };

                const response = await _getCustomerAlarmTempList(params);

                state.templateList = response.data.data.list;

                pager.totalCnt = response.data.data.totalCnt;

            } catch (error) {
                console.log(error);
            }
        };

        const clearList = (num) => {
            formData.searchType = ''; //검색조건
            formData.searchText = ''; //내용
            formData.channelType = ''; // 채널
            formData.sendPurposeType = ''; // 발송목적
            formData.page = num;
            selectMessage.value = null; // 선택한 메세지
            onChangedPage(num);
        };

        const reloadList = () => {
            selectMessage.value = null;
            pager.current = 1;
            onChangedPage(pager.current);
        };

        // 페이징 처리
        const onChangedPage = (pagenum) => {
            pager.current = pagenum;
            getTemplateList();
        };

        // 나의 템플릿만 보기 (본인이 등록한 기준)
        const myTemplate = () => {
            // todo 나만의 템플릿 어드민정보의 어드민순번 맵핑 필요(현재 '1'으로 하드코딩)
            reloadList();
        };

        const onSelectTemplate = (item) => {
            selectMessage.value = item;
            emit('update:modelValue', item);
        };

        return {
            pager,
            state,
            formData,
            selectMessage,
            onSelectTemplate,
            onChangedPage,
            clearList,
            reloadList,
            myTemplate
        };
    }
};
</script>