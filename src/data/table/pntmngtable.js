export const tablelist_dcsPntPlcyMng_label = [
    { headerCheckboxSelection: true, headerName: '선택', field: 'checkbox', checkboxSelection: true, width: 50 },
    { headerName: '번호', field: '', valueGetter: 'node.rowIndex + 1 ', width: 60 },
    { headerName: '정책번호', field: 'pntPlcyCd', width: 150 },
    {
        headerName: '정책명',
        field: 'pntPlcyNm',
        width: 180,
        cellRenderer: params => {
            return '<a href="#">' + params.value + '</a>';
        }
    },
    { headerName: '상태', field: 'plcyStCdNm', width: 110 },
    {
        headerName: '정책기간',
        field: 'pntPlcyDate',
        width: 165,
        cellRenderer: params => {
            return `${params.data.pntPlcyBgnDate}~${params.data.pntPlcyEndDate}`;
        }
    },
    {
        headerName: '정책복사',
        field: 'plcyCopy',
        width: 85,
        cellRenderer: params => {
            return '<a href="#">' + 'btn' + '</a>';
        }
    },
    { headerName: '포인트유형', field: 'pntIssTyCdNm', width: 100 },
    { headerName: '발급구분', field: 'pntIssSeCdNm', width: 120 },
    { headerName: '포인트', field: 'pntAmt', width: 120 },
    {
        headerName: '유효기간',
        field: 'pntVldDate',
        width: 165,
        cellRenderer: params => {
            return `${params.data.pntVldBgnDate}~${params.data.pntVldEndDate}`;
        }
    },
    {
        headerName: '발급목록',
        field: 'plcyMem',
        width: 85,
        cellRenderer: params => {
            return '<a href="#">' + 'btn' + '</a>';
        }
    },
    { headerName: '중복발급여부', field: 'dplIssPsbYnNm', width: 110 },
    { headerName: '중복체크일자', field: 'dplIssPsbTr', width: 110 },
    {
        headerName: '발급한도',
        field: 'pntIssLmtCnt',
        width: 100,
        cellRenderer: params => {
            return `${params.value ? params.value + '건' : ''}`;
        }
    },
    {
        headerName: '카테고리',
        field: 'category',
        width: 150,
        cellRenderer: params => {
            return `${params.data.pntCtgrMjcsCdNm} > ${params.data.pntCtgrMdcsCdNm}`;
        }
    },
    { headerName: '승인자', field: 'plcyAprvId', width: 100 },
    {
        headerName: '승인일자',
        field: 'plcyAprvDt',
        width: 150,
        cellRenderer: params => {
            return params.value ? params.value.substring(0, 10) : '';
        }
    },
    { headerName: '등록자', field: 'fstRgtrSn', width: 100 },
    {
        headerName: '등록일시',
        field: 'fstRgsDt',
        width: 150,
        cellRenderer: params => {
            return params.value ? params.value.substring(0, 10) : '';
        }
    }
];

export const tablelist_dcsPntPlcyAprv_label = [
    { headerCheckboxSelection: true, headerName: '선택', field: 'checkbox', checkboxSelection: true, maxWidth: 50 },
    { headerName: '번호', field: '1111111', valueGetter: 'node.rowIndex + 1', width: 70 },
    { headerName: '정책번호', field: 'pntPlcyCd', width: 150 },
    {
        headerName: '정책명',
        field: 'pntPlcyNm',
        width: 180,
        cellRenderer: params => {
            return '<a href="#">' + params.value + '</a>';
        }
    },
    { headerName: '상태', field: 'plcyStCdNm', width: 120 },
    {
        headerName: '정책기간',
        field: 'pntPlcyDate',
        width: 180,
        cellRenderer: params => {
            return `${params.data.pntPlcyBgnDate}~${params.data.pntPlcyEndDate}`;
        }
    },
    { headerName: '포인트 유형', field: 'pntIssTyCdNm', width: 120 },
    { headerName: '발급구분', field: 'pntIssSeCdNm', width: 120 },
    { headerName: '포인트', field: 'pntAmt', width: 120 },
    {
        headerName: '유효기간',
        field: 'pntVldDate',
        width: 180,
        cellRenderer: params => {
            return `${params.data.pntVldBgnDate}~${params.data.pntVldEndDate}`;
        }
    },
    {
        headerName: '카테고리',
        field: 'category',
        width: 150,
        cellRenderer: params => {
            return `${params.data.pntCtgrMjcsCdNm} > ${params.data.pntCtgrMdcsCdNm}`;
        }
    },
    { headerName: '승인자', field: 'plcyAprvId', width: 120 },
    {
        headerName: '승인일자',
        field: 'plcyAprvDt',
        width: 120,
        cellRenderer: params => {
            return params.value ? params.value.substring(0, 10) : '';
        }
    },
    { headerName: '등록자', field: 'fstRgtrSn', width: 120 },
    {
        headerName: '등록일시',
        field: 'fstRgsDt',
        width: 120,
        cellRenderer: params => {
            return params.value ? params.value.substring(0, 10) : '';
        }
    }
];

export const tablelist_dcsPntPlcyHist_label = [
    { headerName: '일시', field: 'pntPlcyChgHstDt', width: 160 },
    { headerName: '정책번호', field: 'pntPlcyCd', width: 150 },
    { headerName: '정책명', field: 'pntPlcyNm', flex: 1 },
    { headerName: '상태', field: 'plcyStCdNm', width: 120 },
    { headerName: '포인트 유형', field: 'pntIssTyCdNm', width: 160 },
    { headerName: '발급구분', field: 'pntIssSeCdNm', width: 160 },
    {
        headerName: '카테고리',
        field: 'category',
        width: 150,
        cellRenderer: params => {
            return `${params.data.pntCtgrMjcsCdNm} > ${params.data.pntCtgrMdcsCdNm}`;
        }
    },
    { headerName: '등록자', field: 'fstRgtrSn', width: 160 },
    { headerName: '승인자', field: 'plcyConfirmAprvId', width: 160 },
    { headerName: '반려자', field: 'plcyCancelAprvId', width: 160 }
];

export const tablelist_dcsPntPlcySts_label = [
    { headerName: '번호', field: 'Num', valueGetter: 'node.rowIndex + 1', width: 70 },
    { headerName: '정책번호', field: 'pntPlcyCd', width: 150 },
    { headerName: '정책명', field: 'pntPlcyNm', width: 180 },
    { headerName: '상태', field: 'plcyStCdNm', width: 90 },
    { headerName: '포인트 유형', field: 'pntIssTyCdNm', width: 120 },
    { headerName: '발급구분', field: 'pntIssSeCdNm', width: 120 },
    {
        headerName: '카테고리',
        field: 'category',
        width: 150,
        cellRenderer: params => {
            return `${params.data.pntCtgrMjcsCdNm} > ${params.data.pntCtgrMdcsCdNm}`;
        }
    },
    { headerName: '총발급건수', field: 'totalIssCnt', width: 120 },
    { headerName: '지급건수', field: 'issCnt', width: 100 },
    { headerName: '발급취소건수', field: 'issCnclCnt', width: 160 },
    { headerName: '총 포인트', field: 'totalPntAmt', width: 140 },
    { headerName: '사용포인트', field: 'issUsePntAmt', width: 120 },
    { headerName: '잔여포인트', field: 'issRemPntAmt', width: 120 },
    { headerName: '발급취소포인트', field: 'issCnclPntAmt', width: 120 }

];

export const tablelist_aprvMemberList_label = [
    { checkboxSelection: true, width: 50 },
    { headerName: '이름', field: 'admnNm', width: 160 },
    { headerName: '아이디', field: 'admnId', width: 160 },
    { headerName: '이메일', field: 'admnEmad', flex: 1 }
];

export const tablelist_dcsPntPlcySearchPop_label = [
    { headerName: '정책번호', field: 'pntPlcyCd', width: 150 },
    {
        headerName: '정책명',
        field: 'pntPlcyNm',
        width: 180,
        cellRenderer: params => {
            return '<a href="#">' + params.value + '</a>';
        }
    },
    { headerName: '상태', field: 'plcyStCdNm', width: 90 },
    {
        headerName: '정책기간',
        field: 'pntPlcyDate',
        width: 180,
        cellRenderer: params => {
            return `${params.data.pntPlcyBgnDate}~${params.data.pntPlcyEndDate}`;
        }
    },
    { headerName: '포인트유형', field: 'pntIssTyCdNm', width: 120 },
    { headerName: '발급구분', field: 'pntIssSeCdNm', width: 120 },
    { headerName: '포인트', field: 'pntAmt', width: 120 },
    {
        headerName: '유효기간',
        field: 'pntVldDate',
        width: 180,
        cellRenderer: params => {
            return `${params.data.pntVldBgnDate}~${params.data.pntVldEndDate}`;
        }
    },
    { headerName: '중복발급여부', field: 'dplIssPsbYnNm', width: 120 },
    { headerName: '중복체크일자', field: 'dplIssPsbTr', width: 120 },
    {
        headerName: '발행한도',
        field: 'pntIssLmtCnt',
        width: 120,
        cellRenderer: params => {
            return `${params.value ? params.value + '건' : ''}`;
        }
    },
    {
        headerName: '카테고리',
        field: 'category',
        width: 150,
        cellRenderer: params => {
            return `${params.data.pntCtgrMjcsCdNm} > ${params.data.pntCtgrMdcsCdNm}`;
        }
    },
    { headerName: '승인자', field: 'plcyAprvId', width: 120 },
    {
        headerName: '승인일자',
        field: 'plcyAprvDt',
        width: 120,
        cellRenderer: params => {
            return params.value ? params.value.substring(0, 10) : '';
        }
    },
    { headerName: '등록자', field: 'fstRgtrSn', width: 120 },
    {
        headerName: '등록일시',
        field: 'fstRgsDt',
        width: 150,
        cellRenderer: params => {
            return params.value ? params.value.substring(0, 10) : '';
        }
    }
];

export const tablelist_pntMnlIssMng_label = [
    { headerCheckboxSelection: true, headerName: '선택', field: 'checkbox', checkboxSelection: true, maxWidth: 50 },
    { headerName: '정책번호', field: 'pntPlcyCd', width: 150 },
    {
        headerName: '정책명',
        field: 'pntPlcyNm',
        width: 180,
        cellRenderer: params => {
            return '<a href="#">' + params.value + '</a>';
        }
    },
    { headerName: '포인트유형', field: 'pntIssTyCdNm', width: 120 },
    { headerName: '발급구분', field: 'pntIssSeCdNm', width: 180 },
    { headerName: '포인트', field: 'pntAmt', width: 120 },
    { headerName: '대상자수', field: 'issTgpNum', width: 100 },
    { headerName: '발급상태', field: 'issStCdNm', width: 120, cellRenderer: 'ReIssTableBtn' },
    { headerName: '지급상태', field: 'issCmplTyCdNm', width: 120 },
    {
        headerName: '정책기간',
        field: 'pntPlcyDate',
        width: 180,
        cellRenderer: params => {
            return `${params.data.pntPlcyBgnDate}~${params.data.pntPlcyEndDate}`;
        }
    },
    { headerName: '카테고리', field: 'category', width: 150, cellRenderer: params => { return `${params.data.pntCtgrMjcsCdNm} > ${params.data.pntCtgrMdcsCdNm}`; } },
    { headerName: '발급일시', field: 'issDt', width: 160 },
    { headerName: '등록일시', field: 'fstRgsDt', width: 160 },
    { headerName: '승인일시', field: 'issAprvDt', width: 160 }
];

export const tablelist_userInfoPop_label = [
    { headerCheckboxSelection: true, headerName: '선택', field: 'checkbox', checkboxSelection: true, maxWidth: 50 },
    { headerName: '이름', field: 'mbrNm', width: 90 },
    { headerName: '회원번호', field: 'mbrSn', width: 120 },
    { headerName: '성별', field: 'mbrSex', width: 80 },
    { headerName: '연령대', field: 'aggp', width: 90 },
    {
        headerName: '가입일자',
        field: 'mbrJnDt',
        width: 120,
        cellRenderer: params => {
            return params.value ? params.value.substring(0, 10) : '';
        }
    },
    { headerName: '휴대전화번호', field: 'mbrHhpno', width: 120 },
    { headerName: '이메일', field: 'mbrEmad', flex: 1 }
];

export const tablelist_userGroupPop_label = [
    { headerCheckboxSelection: true, headerName: '선택', field: 'checkbox', checkboxSelection: true, width: 60 },
    { headerName: '그룹명', field: 'mbrGrpNm', width: 120 },
    { headerName: '그룹설명', field: 'mbrGrpDscr', flex: 1 },
    { headerName: '그룹회원수', field: 'mbrGrpCnt', width: 120 }
];

export const tablelist_pntIssAprv_label = [
    { headerCheckboxSelection: true, headerName: '선택', field: 'checkbox', checkboxSelection: true, maxWidth: 50 },
    { headerName: '정책번호', field: 'pntPlcyCd', width: 150 },
    {
        headerName: '정책명',
        field: 'pntPlcyNm',
        width: 180,
        cellRenderer: params => {
            return '<a href="#">' + params.value + '</a>';
        }
    },
    { headerName: '포인트유형', field: 'pntIssTyCdNm', width: 120 },
    { headerName: '발급구분', field: 'pntIssSeCdNm', width: 180 },
    { headerName: '포인트', field: 'pntAmt', width: 120 },
    { headerName: '대상자수', field: 'issTgpNum', width: 100 },
    { headerName: '발급상태', field: 'issStCdNm', width: 120 },
    {
        headerName: '카테고리',
        field: 'category',
        width: 150,
        cellRenderer: params => {
            return `${params.data.pntCtgrMjcsCdNm} > ${params.data.pntCtgrMdcsCdNm}`;
        }
    },
    {
        headerName: '정책기간',
        field: 'pntPlcyDate',
        width: 180,
        cellRenderer: params => {
            return `${params.data.pntPlcyBgnDate}~${params.data.pntPlcyEndDate}`;
        }
    },
    { headerName: '등록일시', field: 'fstRgsDt', width: 160 },
    { headerName: '승인일시', field: 'issAprvDt', width: 160 }
];

export const tablelist_issHistMng_label = [
    { headerCheckboxSelection: true, headerName: '선택', field: 'checkbox', checkboxSelection: true, maxWidth: 50 },
    {
        headerName: '포인트번호',
        field: 'pntNoSn',
        width: 140,
        cellRenderer: params => {
            return '<a href="#">' + params.value + '</a>';
        }
    },
    { headerName: '정책번호', field: 'pntPlcyCd', width: 150 },
    { headerName: '정책명', field: 'pntPlcyNm', width: 150 },
    { headerName: '포인트', field: 'pntAmt', width: 120 },
    { headerName: '이름', field: 'mbrNm', width: 150 },
    { headerName: '아이디', field: 'mbrJnMthAcsId', width: 120 },
    { headerName: '포인트유형', field: 'pntIssTyCdNm', width: 120 },
    { headerName: '발급구분', field: 'pntIssSeCdNm', width: 160 },
    { headerName: '지급상태', field: 'pntStCdNm', width: 100 },
    {
        headerName: '카테고리',
        field: 'category',
        width: 150,
        cellRenderer: params => {
            return `${params.data.pntCtgrMjcsCdNm} > ${params.data.pntCtgrMdcsCdNm}`;
        }
    },
    { headerName: '발급일시', field: 'pntIssDt', width: 160 },
    { headerName: '할당일시', field: 'pntAsgnDt', width: 160 }
    // { headerName: '발급자', field: '', width: 120 },
    // { headerName: '고객사', field: '', width: 120 },
    // { headerName: '구분', field: '', width: 120 },
    // { headerName: '분당율', field: '', width: 90 },
    // { headerName: '사용포인트', field: '', width: 120 },
    // { headerName: '잔여포인트', field: '', width: 120 },
    // { headerName: '성별', field: '', width: 80 },
    // { headerName: '연령대', field: '', width: 80 },
    // { headerName: '생일자', field: '', width: 100 },
    // { headerName: '사용일자', field: '', width: 160 },
    // { headerName: '유효기간', field: '', width: 200 }
];

export const tablelist_issCancelMng_label = [
    { headerCheckboxSelection: true, headerName: '선택', field: 'checkbox', checkboxSelection: true, maxWidth: 50 },
    {
        headerName: '포인트번호',
        field: 'pntNoSn',
        width: 140,
        cellRenderer: params => {
            return '<a href="#">' + params.value + '</a>';
        }
    },
    { headerName: '정책번호', field: 'pntPlcyCd', width: 150 },
    { headerName: '정책명', field: 'pntPlcyNm', width: 120 },
    { headerName: '포인트', field: 'pntAmt', width: 120 },
    { headerName: '이름', field: 'mbrNm', width: 100 },
    { headerName: '아이디', field: 'mbrJnMthAcsId', width: 120 },
    { headerName: '포인트유형', field: 'pntIssTyCdNm', width: 120 },
    { headerName: '발급구분', field: 'pntIssSeCdNm', width: 160 },
    { headerName: '상태', field: 'pntStCdNm', width: 100 },
    {
        headerName: '카테고리',
        field: 'category',
        width: 150,
        cellRenderer: params => {
            return `${params.data.pntCtgrMjcsCdNm} > ${params.data.pntCtgrMdcsCdNm}`;
        }
    },
    { headerName: '발급일시', field: 'pntIssDt', width: 160 },
    { headerName: '지급일시', field: 'pntAsgnDt', width: 160 }
    // { headerName: '발급자', field: '', width: 120 },
    // { headerName: '고객사', field: '', width: 120 },
    // { headerName: '구분', field: '', width: 120 },
    // { headerName: '분당율', field: '', width: 90 },
    // { headerName: '사용포인트', field: '', width: 120 },
    // { headerName: '잔여포인트', field: '', width: 120 },
    // { headerName: '성별', field: '', width: 80 },
    // { headerName: '연령대', field: '', width: 80 },
    // { headerName: '생일자', field: '', width: 100 },
    // { headerName: '유효기간', field: '', width: 200 }
];