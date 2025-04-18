<template>
    <section class="s1">
        
        <!-- 테이블 -->
        <div class="tbl-wrap">
            
            <div style="width:100%;">
                <AgGridVue :columnDefs="state.value" :rowData="state.rowData" :defaultColDef="state.defaultColDef"
                    :rowSelection="'multiple'" :domLayout="state.domLayout" class="ag-theme-alpine"
                >
                </AgGridVue>
            </div>
        </div>
        

    </section>
</template>
<script>
import {  reactive, onMounted, ref } from 'vue';


export default {
    
    setup() {
        onMounted(() => {
            initTableHeight();
        });
        const state = reactive({
            
            value: [
                { headerCheckboxSelection: true, checkboxSelection: true, width: 50 },
                { field: '번호', valueGetter: 'node.rowIndex + 1', width: 70 },
                { field: '등급', width: 90 },
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
                resizable: true,
                width: 50,
                headerClass: 'centered',
                cellClass: 'centered'

            },
            startday: null,
            endday: null,
            tableHeight: null,
            rowSelection: 'multiple',
            domLayout: 'autoHeight'
        });
        


        const initTableHeight = () => {
            let tableColumH = document.querySelector('.ag-row').offsetHeight;
            let tableHeaderH = document.querySelector('.ag-header-cell').offsetHeight;
            state.tableHeight = (tableColumH * 10) + tableHeaderH + 1;
        };

        return {
            state,
            initTableHeight
        };
    }
};
</script>
