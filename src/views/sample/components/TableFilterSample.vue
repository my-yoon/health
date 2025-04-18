<template>
    <div class="guides">
        <div class="sample">
            <pre class="language-javasciprt">
                <code class="language-javasciprt"  v-html="state.sampleCodeJS"  />
            </pre>
        </div>
    </div>
</template>
<script>

import { reactive } from 'vue';
export default {
    setup() {
        const state = reactive({
            sampleCodeJS: `
&lt;template&gt;
    &lt;div class="ui-data-filter"&gt;
        &lt;div class="form-item"&gt;
            기간조회가 없는 경우 태그 사용
            &lt;div class="item"&gt;
                &lt;label&gt;조건검색&lt;/label&gt;
                &lt;span class="input"&gt;
                    &lt;span class="dv"&gt;
                        &lt;select class="custom-select sm" v-model="state.messageType"&gt;
                            &lt;option value="" selected&gt;선택&lt;/option&gt;
                            &lt;option value="msgCd"&gt;코드명&lt;/option&gt;
                            &lt;option value="msgCts"&gt;한글명&lt;/option&gt;
                        &lt;/select&gt;
                    &lt;/span&gt;
                    &lt;span class="dv"&gt;
                        &lt;input type="text" class="form-control sm" v-model="state.searchWord" :disabled="!state.messageType"&gt;
                   &lt;/span&gt;
                &lt;/span&gt;
            &lt;/div&gt;
            기간조회가 있는 경우 컴포넌트 사용

            &lt;dateSerch :dateTitle="'기간조회'" @onSelectDate="onSelectPicker"
                ref="dateSearch" // 데이터 피커 컴포넌트에 접근하기 위한 참조 값 설정
                :selectOptions="[{ label: '가입일시', value: '가입일시' }, { label: '수정일시', value: '수정일시' }]" // 검색일자 구분
                :pickerOnly ="false" // 버튼없이 피커만 사용시 === true 
                :setDay="state.setDay" // date초기값 설정
            /&gt;


            &lt;div class="btn-filter-set"&gt;
                &lt;button type="button" class="btn btn-sm" @click="재조회 이벤트 처리"&gt;
                    &lt;span class="ico-search"&gt;&lt;/span&gt;조회
                &lt;/button&gt;
                // 리로드 처리 버튼
                &lt;button type="button" @click="onInitDate" class="btn btn-sm"&gt;
                    &lt;span class="ico-reload sg"&gt;&lt;/span&gt;
                    &lt;span class="offscreen"&gt;리로드&lt;/span&gt;
                &lt;/button&gt;
            &lt;/div&gt;
        &lt;/div&gt;
    &lt;/div&gt;
&lt;/template&gt;
&lt;script&gt;
import { reactive, ref } from 'vue';
import DateSerch from '@/components/ui/DateSerch.vue';
export default {
    components: { DateSerch }
    setup() {
        
        const dateSearch = ref(null); // 데이터 피커 컴포넌트에 접근하기 위한  참조 값 설정
        
        const state = reactive({
            searchWord:'',
            messageType:''
            //버튼이 있는 경우 초기값 
            setDay:'1month' (1년:year,6개월:6month,1개월:1month,일주일:week, 당일:today)
            //피커만 사용시 초기값 설정 예시
            setDay: {
                from: new Date().getTime() - 3600 * 1000 * 24 * 30, //시작일
                to: new Date() //종료일
            },
        })
        // 데이터 피커 날짜 검색
        const onSelectPicker = (type, value) => {
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
            
            //api호출
            console.log('선택일:' + value, '선택된 버튼:' + type, '조회기준:' + status, dayJS(formData.from).format('MM-DD'));
        };
        // 데이터 피커 초기화
        const onInitDate = () => {
            dateSearch.value.initDate();
            //재조회  api 호출
        };

        return {
            state,
            onSelectPicker,
            onInitDate
        }
    }
}
&lt;/script&gt;`
        });
        return {
            state
        };
    }
};
</script>
