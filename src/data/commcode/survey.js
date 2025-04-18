export const surveyCode = {

    // 화면유형구분코드
    screenTypeSectionCode: [
        { name: '묶음', value: '231001'},
        { name: '단일', value: '231002'}
    ],
    // 채점유형
    markingTypeCode: [
        { name: '없음', value: '232001'},
        { name: '선택문항수', value: '232002'},
        { name: '선택값합산', value: '232003'},
        { name: '수식사용', value: '232004'},
        { name: '외부연동(API)', value: '232005'}
    ],
    // 발행상태
    publicationStatus: [
        { name: '전체', value: ''},
        { name: '임시저장', value: '330001'},
        { name: '발행완료', value: '330002'},
        { name: '종료', value: '330003'}
    ],
    // 화면전환효과
    screenTrnsfEffectYn: [
        { name: '없음', value: 'N'},
        { name: '사용', value: 'Y'}
        
    ],
    // 사용여부
    useYn: [
        { name: '미사용', value: 'N'},
        { name: '사용', value: 'Y'}
    ],
    // 대상유형구분코드
    targetTypeCode: [
        { name: '모든사용자', value: '233001'},
        { name: '회원그룹', value: '233002'}
    ],
    // 게시여부
    postUpYn: [
        { name: '제한없음', value: 'N'},
        { name: '기간설정', value: 'Y'}
    ],
    // 안내화면여부
    questionGuidescreenYn: [
        { name: '미사용', value: 'N'},
        { name: '사용', value: 'Y'}
    ],
    // 설문요금구분
    questionChargeSectionCode: [
        { name: '무료', value: '230001'},
        { name: '유료', value: '230002'}
    ],
    errorMsg: [
        {target: 'serviceSectionCode', msg: '설문구분코드는 필수값입니다.'},
        {target: 'categoryCode', msg: '설문카테고리코드는 필수값입니다.'},
        {target: 'questionTitle', msg: '설문제목은 필수값입니다.'},
        {target: 'pageQuestionItemCount', msg: '페이지당 문항수는 필수값입니다.'},
        {target: 'markingTypeCode', msg: '채점유형은 필수값입니다.'}
    ]

};