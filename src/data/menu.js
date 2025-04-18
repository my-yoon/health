export const menuItem = [
    {
        label: '계정정보관리',
        url: '/account/manage/master',
        isActive: false,
        isFav: false,
        list: null

    },
    {
        label: '회원관리',
        url: '',
        isActive: false,
        isFav: false,
        list: [
            {
                label: '회원정보관리',
                url: '/member/list',
                isActive: false,
                isFav: false,
                list: null

            },
            {
                label: '불량회원관리',
                url: '/member/fault/list',
                isActive: false,
                isFav: false,
                list: null

            },
            {
                label: '탈퇴회원관리',
                url: '/member/ban/list',
                isActive: false,
                isFav: false,
                list: null

            }
        ]
    },
    {
        label: '서비스 이용관리',
        url: '',
        isActive: false,
        isFav: false,
        list: [
            {
                label: '건강뉴스',
                url: '',
                isActive: false,
                isFav: false,
                list: [
                    { label: '대분류 관리', url: '/service/health_news/depth_1', isActive: false, isFav: false, list: null },
                    { label: '중분류 관리', url: '/service/health_news/depth_2', isActive: false, isFav: false, list: null },
                    { label: '소분류 관리', url: '/service/health_news/depth_3', isActive: false, isFav: false, list: null },
                    { label: '콘텐츠 목록 관리', url: '/service/health_news/contents/list', isActive: false, isFav: false, list: null }
                ]
            }
        ]
    },
    {
        label: '회원그룹관리',
        url: '/main',
        isActive: false,
        isFav: false,
        list: null

    },
    {
        label: '건강관리 현황',
        url: '',
        isActive: false,
        isFav: false,
        list: [
            {
                label: '건강관리서비스이용현황',
                url: '',
                isActive: false,
                isFav: false,
                list: null

            }

        ]
    },
    {
        label: '포인트 관리',
        url: '',
        isActive: false,
        isFav: false,
        list: [
            {
                label: '포인트정책관리',
                url: '',
                isActive: false,
                isFav: false,
                list: [
                    { label: '포인트정책관리', url: '/point/rule/list', isActive: false, isFav: false, list: null },
                    { label: '포인트정책승인관리', url: '/point/rule/approve/list', isActive: false, isFav: false, list: null },
                    { label: '포인트정책이력', url: '/point/rule/history', isActive: false, isFav: false, list: null },
                    { label: '포인트정책통계', url: '/point/rule/history/stats', isActive: false, isFav: false, list: null }
                ]
            },
            {
                label: '포인트수동발급',
                url: '',
                isActive: false,
                isFav: false,
                list: [
                    { label: '포인트수동발급관리', url: '/point/publish/list', isActive: false, isFav: false, list: null },
                    { label: '포인트발급승인관리', url: '/point/publish/approve/list', isActive: false, isFav: false, list: null }
                ]
            },
            {
                label: '포인트내역관리',
                url: '',
                isActive: false,
                isFav: false,
                list: [
                    { label: '발급내역', url: '/point/publish/history', isActive: false, isFav: false, list: null },
                    { label: '발급취소관리', url: '/point/publish/cancel/list', isActive: false, isFav: false, list: null }
                ]
            }
        ]
    },
    {
        label: '설문관리',
        url: '',
        isActive: false,
        isFav: false,
        list: [
            {
                label: '설문목록관리',
                url: '',
                isActive: false,
                isFav: false,
                list: null

            },
            {
                label: '설문결과관리',
                url: '',
                isActive: false,
                isFav: false,
                list: null

            }

        ]
    },
    {
        label: '임직원관리',
        url: '',
        isActive: false,
        isFav: false,
        list: [
            {
                label: '임직원관리',
                url: '',
                isActive: false,
                isFav: false,
                list: null

            },
            {
                label: '임직원현황',
                url: '',
                isActive: false,
                isFav: false,
                list: null

            },
            {
                label: '자격상실현황',
                url: '',
                isActive: false,
                isFav: false,
                list: null

            },
            {
                label: '임직원확인용 명단관리',
                url: '',
                isActive: false,
                isFav: false,
                list: null

            },
            {
                label: '탈퇴임직원관리',
                url: '',
                isActive: false,
                isFav: false,
                list: [
                    { label: '탈퇴임직원관리', url: '/', isActive: false, isFav: false, list: null },
                    { label: '임직원정보', url: '/', isActive: false, isFav: false, list: null }
                ]
            }
        ]
    },
    {
        label: '임직원건강관리 현황',
        url: '',
        isActive: false,
        isFav: false,
        list: [
            {
                label: '건강관리서비스이용현황',
                url: '',
                isActive: false,
                isFav: false,
                list: null

            }
        ]
    },
    {
        label: '설문관리',
        url: '',
        isActive: false,
        isFav: false,
        list: [
            {
                label: '설문목록관리',
                url: '',
                isActive: false,
                isFav: false,
                list: null

            },
            {
                label: '설문결과관리',
                url: '',
                isActive: false,
                isFav: false,
                list: null

            }

        ]
    },
    // {
    //     label: '고객사(Payer)관리',
    //     url: '',
    //     isActive: false,
    //     isFav: false,
    //     list: [
    //         {
    //             label: '가입신청관리',
    //             url: '/payermanage',
    //             isActive: false,
    //             isFav: false,
    //             
    //         },
    //         {
    //             label: '고객사정보관리',
    //             url: '',
    //             isActive: false,
    //             isFav: false,
    //             
    //         },
    //         {
    //             label: '고객사탈퇴신청관리',
    //             url: '',
    //             isActive: false,
    //             isFav: false,
    //             
    //         },
    //         {
    //             label: '탈퇴 고객사관리',
    //             url: '',
    //             isActive: false,
    //             isFav: false,
    //             
    //         }


    //     ]
    // },
    // {
    //     label: '셀러(Seller)관리',
    //     url: '',
    //     isActive: false,
    //     isFav: false,
    //     list: [
    //         {
    //             label: '가입신청관리',
    //             url: '/sellermanage',
    //             isActive: false,
    //             isFav: false,
    //             
    //         },
    //         {
    //             label: '셀러정보관리',
    //             url: '/sellerinfo',
    //             isActive: false,
    //             isFav: false,
    //             
    //         },
    //         {
    //             label: '셀러탈퇴신청목록',
    //             url: '/selleroutlist',
    //             isActive: false,
    //             isFav: false,
    //             
    //         },
    //         {
    //             label: '셀러탈퇴목록',
    //             url: '/sellerout',
    //             isActive: false,
    //             isFav: false,
    //             
    //         }
    //     ]
    // },

    // {
    //     label: '메디컬사(Medical)',
    //     url: '',
    //     isActive: false,
    //     isFav: false,
    //     list: [
    //         {
    //             label: '가입신청관리',
    //             url: '',
    //             isActive: false,
    //             isFav: false,
    //             
    //         },
    //         {
    //             label: '메디컬사정보관리',
    //             url: '',
    //             isActive: false,
    //             isFav: false,
    //             
    //         },
    //         {
    //             label: '메디컬사탈퇴신청관리',
    //             url: '',
    //             isActive: false,
    //             isFav: false,
    //             
    //         },
    //         {
    //             label: '탈퇴 제휴사관리',
    //             url: '',
    //             isActive: false,
    //             isFav: false,
    //             
    //         }
    //     ]
    // },

    // {
    //     label: '개발자(Developer)',
    //     url: '',
    //     isActive: false,
    //     isFav: false,
    //     list: [
    //         {
    //             label: '가입신청관리',
    //             url: '',
    //             isActive: false,
    //             isFav: false,
    //             
    //         },
    //         {
    //             label: '개발자정보관리',
    //             url: '',
    //             isActive: false,
    //             isFav: false,
    //             
    //         },
    //         {
    //             label: '개발자탈퇴신청관리',
    //             url: '',
    //             isActive: false,
    //             isFav: false,
    //             
    //         },
    //         {
    //             label: '탈퇴 외부개발자관리',
    //             url: '',
    //             isActive: false,
    //             isFav: false,
    //             
    //         }
    //     ]
    // },

    {
        label: '어드민회원관리',
        url: '',
        isActive: false,
        isFav: false,
        list: [

            {
                label: 'KB어드민',
                url: '/member/kb_admin/list',
                isActive: false,
                isFav: false,
                list: null

            },
            {
                label: '파트너부계정관리',
                url: '/member/partner/sub_account/list',
                isActive: false,
                isFav: false,
                list: null

            },
            {
                label: 'MD별셀러현황',
                url: '/member/seller/list',
                isActive: false,
                isFav: false,
                list: null

            }
        ]
    },
    {
        label: '권한관리',
        url: '',
        isActive: false,
        isFav: false,
        list: [

            {
                label: 'KB어드민 메뉴권한관리',
                url: '/authority/kb_admin/menus',
                isActive: false,
                isFav: false,
                list: null

            }
            // {
            //     label: '파트너어드민 메뉴권한관리',
            //     url: '/authority/partner_admin/menus',
            //     isActive: false,
            //     isFav: false,
            //     
            // },
            // {
            //     label: '권한그룹별 사용자관리',
            //     url: '',
            //     isActive: false,
            //     isFav: false,
            //     
            // }
        ]
    },
    {
        label: '전자계약 관리',
        url: '',
        isActive: false,
        isFav: false,
        list: [

            {
                label: '전자계약 관리',
                url: '',
                isActive: false,
                isFav: false,
                list: null

            },
            {
                label: '전자계약 정보 조회',
                url: '',
                isActive: false,
                isFav: false,
                list: null

            },
            {
                label: '전자계약 이력 정보 조회',
                url: '',
                isActive: false,
                isFav: false,
                list: null

            }
        ]
    },
    {
        label: '약관관리',
        url: '',
        isActive: false,
        isFav: false,
        list: [
            {
                label: '약관그룹관리',
                url: '/policy/group/list',
                isActive: false,
                isFav: false,
                list: null

            },
            {
                label: '약관유형관리',
                url: '/policy/type/list',
                isActive: false,
                isFav: false,
                list: null

            },
            {
                label: '약관관리',
                url: '/policy/list',
                isActive: false,
                isFav: false,
                list: null

            },
            {
                label: '영역별약관관리',
                url: '/policy/domain/list',
                isActive: false,
                isFav: false,
                list: null

            }
        ]
    },
    {
        label: '기준관리',
        url: '',
        isActive: false,
        isFav: false,
        list: [
            {
                label: '공통코드관리',
                url: '',
                isActive: false,
                isFav: false,
                list: [
                    { label: '공통코드관리', url: '/standard/commoncode/list', isActive: false, isFav: false, list: null }
                    // { label: '공통코드그룹등록', url: '/standardcoderegist', isActive: false, isFav: false }
                ]
            },
            {
                label: '메뉴관리',
                url: '/standard/menu/mgmt',
                isActive: false,
                isFav: false,
                list: null

            },
            {
                label: '기준관리',
                url: '',
                isActive: false,
                isFav: false,
                list: [
                    { label: '달력관리', url: '/', isActive: false, isFav: false, list: null },
                    { label: '달력생성', url: '/', isActive: false, isFav: false, list: null },
                    { label: '일자정보', url: '/', isActive: false, isFav: false, list: null }
                ]
            },
            {
                label: '메세지관리',
                url: '',
                isActive: false,
                isFav: false,
                list: [
                    { label: '메세지관리', url: '/standard/message/list', isActive: false, isFav: false, list: null }
                ]
            }
        ]
    },
    {
        label: '고객센터관리',
        url: '',
        isActive: false,
        isFav: false,
        list: [
            {
                label: '공지사항관리',
                url: '/cs_center/notice/list',
                isActive: false,
                isFav: false,
                list: null

            },
            {
                label: 'FAQ관리',
                url: '/cs_center/faq/list',
                isActive: false,
                isFav: false,
                list: null

            },
            {
                label: '1:1문의',
                url: '/cs_center/qna/list',
                isActive: false,
                isFav: false,
                list: null

            },
            {
                label: '시스템공지관리',
                url: '/cs_center/system_notice/list',
                isActive: false,
                isFav: false,
                list: null

            }
        ]
    },
    {
        label: '이벤트관리',
        url: '',
        isActive: false,
        isFav: false,
        list: [
            {
                label: '이벤트등록관리',
                url: '/event/list',
                isActive: false,
                isFav: false,
                list: null

            },
            {
                label: '당첨자발표',
                url: '/event/winner_notice/list',
                isActive: false,
                isFav: false,
                list: null

            },
            {
                label: '후지급당첨자관리',
                url: '/event/after_reciever',
                isActive: false,
                isFav: false,
                list: null

            },
            {
                label: '친구 초대 현황',
                url: '/event/recommend/status',
                isActive: false,
                isFav: false,
                list: null

            }
        ]
    },
    {
        label: '전시관리',
        url: '',
        isActive: false,
        isFav: false,
        list: [
            {
                label: '배너관리',
                url: '/display/banner/list',
                isActive: false,
                isFav: false,
                list: null

            },
            {
                label: '팝업관리',
                url: '/display/popup/list',
                isActive: false,
                isFav: false,
                list: null

            }
        ]
    },
    {
        label: '지표관리',
        url: '',
        isActive: false,
        isFav: false,
        list: [
            {
                label: '회원통계',
                url: '',
                isActive: false,
                isFav: false,
                list: [
                    { label: '누적가입자', url: '/stats/member/accum_join', isActive: false, isFav: false, list: null },
                    { label: '누적탈퇴자', url: '/stats/member/accum_ban', isActive: false, isFav: false, list: null },
                    { label: '신규가입자', url: '/stats/member/join_new', isActive: false, isFav: false, list: null },
                    { label: '신규탈퇴자', url: '/stats/member/ban_new', isActive: false, isFav: false, list: null },
                    // { label: '건강관심별분포', url: '/cumulativewithdrawal', isActive: false, isFav: false },
                    { label: '성별 및 연령대', url: '/stats/member/sex_age', isActive: false, isFav: false, list: null }
                ]
            },
            {
                label: '서비스이용통계',
                url: '',
                isActive: false,
                isFav: false,
                list: [
                    //{label: '이용현황MAU', url: '/', isActive: false, isFav: false},
                    //{label: '이용현황WAU', url: '/', isActive: false, isFav: false},
                    //{label: '이용현황DAU', url: '/', isActive: false, isFav: false},
                    //{label: '설문완료분포', url: '/', isActive: false, isFav: false},
                    //{label: '추천서비스참여율', url: '/', isActive: false, isFav: false},
                    { label: '이벤트진행 및 종료현황', url: '/stats/event_status', isActive: false, isFav: false, list: null },
                    { label: '이벤트대상자 및 열람자참여율', url: '/stats/event/target_join_rate', isActive: false, isFav: false, list: null }
                ]
            },
            /*{
                label: '전환율통계',
                url: '',
                isActive: false,
                isFav: false,
                list: [
                    //{label: 'MAU전환율', url: '/', isActive: false, isFav: false},
                    //{label: 'MAU유지율', url: '/', isActive: false, isFav: false}
                ]
            },*/
            {
                label: '건강정보통계',
                url: '',
                isActive: false,
                isFav: false,
                list: [
                    { label: '흡연', url: '/stats/life_log/smoking', isActive: false, isFav: false, list: null },
                    { label: '식사', url: '/stats/life_log/meal', isActive: false, isFav: false, list: null }
                ]
            },
            {
                label: '파트너통계',
                url: '',
                isActive: false,
                isFav: false,
                list: [
                    { label: '파트너가입 및 승인', url: '/stats/partner/join', isActive: false, isFav: false, list: null },
                    { label: '파트너부계정권한생성', url: '/stats/partner/sub_account/create', isActive: false, isFav: false, list: null }
                ]
            },
            {
                label: '포인트통계',
                url: '',
                isActive: false,
                isFav: false,
                list: [
                    { label: '리워드포인트지급완료현황', url: '/stats/partner/point/acquire', isActive: false, isFav: false, list: null },
                    { label: '리워드포인트지급정책', url: '/stats/partner/point/pay_rule', isActive: false, isFav: false, list: null },
                    { label: '리워드포인트지급완료카테고리', url: '/stats/partner/point/acquire_category', isActive: false, isFav: false, list: null },
                    { label: '리워드포인트발급및소진', url: '/stats/partner/point/issue_pay', isActive: false, isFav: false, list: null }
                ]
            },
            {
                label: 'VOC통계',
                url: '',
                isActive: false,
                isFav: false,
                list: [
                    { label: 'VOC처리현황', url: '/stats/voc/settle', isActive: false, isFav: false, list: null },
                    { label: 'VOC문의유형', url: '/stats/voc/inquire_type', isActive: false, isFav: false, list: null },
                    { label: 'VOC문의담당사', url: '/stats/voc/settle_company', isActive: false, isFav: false, list: null },
                    { label: 'VOC문의이관사', url: '/stats/voc/transfer_company', isActive: false, isFav: false, list: null }
                ]
            },
            {
                label: '모바일지표',
                url: '',
                isActive: false,
                isFav: false,
                list: [
                    { label: '모바일OS분포', url: '/stats/mobile/os', isActive: false, isFav: false, list: null },
                    { label: '디바이스분포', url: '/stats/mobile/device', isActive: false, isFav: false, list: null }
                    //{label: '앱버전분포', url: '/', isActive: false, isFav: false}
                ]
            }
        ]
    },
    {
        label: '운영관리',
        url: '',
        isActive: false,
        isFav: false,
        list: [
            {
                label: '고객알림관리',
                url: '',
                isActive: false,
                isFav: false,
                list: [
                    { label: '메세지관리', url: '/alarm/message/list', isActive: false, isFav: false, list: null },
                    { label: '메세지템플릿관리', url: '/alarm/message/template/list', isActive: false, isFav: false, list: null }
                ]
            },
            {
                label: '금지어 관리',
                url: '/ban_words',
                isActive: false,
                isFav: false,
                list: null

            },
            {
                label: '추천키워드관리',
                url: '',
                isActive: false,
                isFav: false,
                list: [
                    { label: '추천키워드관리', url: '/keywords/stats', isActive: false, isFav: false, list: null },
                    { label: '추천키워드통계', url: '/keywords', isActive: false, isFav: false, list: null }
                ]
            }
        ]
    },
    {
        label: '통합정산',
        url: '',
        isActive: false,
        isFav: false,
        list: [
            {
                label: '기준정보관리',
                url: '',
                isActive: false,
                isFav: false,
                list: [
                    { label: '메타관리', url: '/sttlBstdMeta', isActive: false, isFav: false, list: null },
                    { label: '기준정보관리', url: '/sttlBstd', isActive: false, isFav: false, list: null },
                    { label: '상세관리', url: '/sttlBstdDtl', isActive: false, isFav: false, list: null },
                    { label: '캘린더관리', url: '/sttlBstdDtlCal', isActive: false, isFav: false, list: null },
                    { label: '분개모델관리', url: '/sttlBstdDtlJnlz', isActive: false, isFav: false, list: null }
                ]
            },
            {
                label: '일별관리',
                url: '',
                isActive: false,
                isFav: false,
                list: [
                    { label: '전표조회', url: '/sttlAcctSlipDtl', isActive: false, isFav: false, list: null }
                ]
            }
        ]
    },
    {
        label: '로그관리',
        url: '',
        isActive: false,
        isFav: false,
        list: [
            {
                label: '로그인/로그아웃이력관리',
                url: '/logs/user/login',
                isActive: false,
                isFav: false,
                list: null

            },
            {
                label: '개인정보조회이력',
                url: '/logs/user/transactions',
                isActive: false,
                isFav: false,
                list: null

            },
            {
                label: '사용자다운로드로그',
                url: '/logs/user/download',
                isActive: false,
                isFav: false,
                list: null

            },
            {
                label: '관리자권한변경로그',
                url: '/logs/admin/change_auth',
                isActive: false,
                isFav: false,
                list: null

            }
        ]
    }
];
