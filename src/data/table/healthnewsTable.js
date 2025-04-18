const cellClassRules = { 'cell-span': (e) => e.data.isGroup ?? false };
const rowSpan = (params) => params.data.isGroup ? params.data.rowSpan : 0;

export const tablelist_hnCtntsMng_label = [
    {
        headerCheckboxSelection: true,
        headerName: '선택',
        field: 'checkbox',
        checkboxSelection: true,
        maxWidth: 50,
        rowSpan,
        cellClassRules,
        cellStyle: {
            'justify-content': 'flex-start !important',
            'text-align': 'left'
        }
    },
    {
        headerName: '번호',
        field: 'rowNumber',
        maxWidth: 70,
        sortable: false,
        rowSpan,
        cellClassRules,
        cellRenderer: params => params.data.rowNumber
    },
    {
        headerName: '제목',
        field: 'title',
        minWidth: 250,
        sortable: false,
        rowSpan,
        cellClassRules,
        cellRenderer: params => params.value,
        cellStyle: {
            'text-decoration': 'underline',
            'cursor': 'pointer',
            'justify-content': 'flex-start !important',
            'text-align': 'left'
        }
    },
    {
        headerName: '대/중/소 분류',
        width: 300,
        field: 'clsfCodeName',
        cellClassRules,
        cellRenderer: params => {
            if (!params.value) return params.value;
            return '<select class="custom-select" style="width:255px; text-align:left">' + params.value + '</select>';
        }
    },
    //{ headerName: '대분류', field: 'majorCodeName', width: 110, sortable: false },
    //{ headerName: '중분류', field: 'mediumCodeName', width: 110, sortable: false },
    //{ headerName: '소분류', field: 'minorCodeName', width: 110, sortable: false },
    {
        headerName: '해시태그',
        field: 'hashTagName',
        minWidth: 150,
        sortable: false,
        rowSpan,
        cellClassRules,
        cellRenderer: params => {
            if (!params.value) return '';
            const hashTags = (params.value.split(',')).filter(item => item).map(item => `#${item}`).join(', ');
            return `(${(params.value).split(',').length}) ${hashTags}`;
        },
        cellStyle: {
            'justify-content': 'flex-start !important',
            'text-align': 'left'
        }
    },
    { headerName: '조회수', field: 'inquiryNumber', width: 90, rowSpan, cellClassRules },
    { headerName: '퀴즈참여', field: 'quizCount', width: 90, rowSpan, cellClassRules },
    {
        headerName: '정답률',
        field: 'quizCorrectAnswerRate',
        width: 90,
        rowSpan,
        cellClassRules,
        cellRenderer: params => params.value ? params.value + '%' : ''
    },
    { headerName: '관심설정', field: 'interestNewsAggregateCount', width: 90, rowSpan, cellClassRules },
    { headerName: '공유', field: 'shareCount', width: 90, rowSpan, cellClassRules },
    { headerName: '게시여부', field: 'postUpAlternative', width: 90, sortable: false, rowSpan, cellClassRules },
    { headerName: '등록일', field: 'firstRegistrationDate', minWidth: 80, sortable: false, rowSpan, cellClassRules }
];