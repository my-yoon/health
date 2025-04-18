const ROOT_CONTEXT = '/common/api/v1';

export const _sttlCyclCds = [
    {code: 'D', name: 'Daily'},
    {code: 'M', name: 'Monthly'}
];

export const _dlngTyCds = [
    {code: '10', name: '신용카드결제'},
    {code: '11', name: '가상계좌결제'},
    {code: '12', name: '계좌이체결제'},
    {code: '30', name: '포인트리'    },
    {code: '40', name: '실손보험'    },
    {code: '90', name: '통합정산'    }
];

export const _slipTyCds = [
    {code: '10', name: '청구'        },
    {code: '11', name: '청구취소'    },
    {code: '20', name: '입금'        },
    {code: '21', name: '입금취소'      },
    {code: '30', name: '포인트전환정산(입)'},
    {code: '31', name: '포인트전환정산(출)'},
    {code: '40', name: '실손수입정산'    },
    {code: '41', name: '실손비용정산'    },
    {code: '90', name: '스타청구정산'    },
    {code: '91', name: '스타매출정산'    },
    {code: '92', name: '매출정산'      },
    {code: '95', name: '매입정산'      },
    {code: '99', name: '매출대체'      }
];

export const _slipCrtUnitCds = [
    {code: '10', name: '청구'         },
    {code: '20', name: '입금'         },
    {code: '90', name: '스타청구정산' },
    {code: '91', name: '스타매출정산' },
    {code: '92', name: '매출정산'     },
    {code: '95', name: '매입정산'     },
    {code: '99', name: '매출대체'     }
];

export const _drcrSeCds = [
    {code: '3', name: '차변'         },
    {code: '4', name: '대변'         }
];

export const _accds = [
    {code: '1030001', name: '보통예금'                 },
    {code: '1080000', name: '외상매출금'               },
    {code: '1200100', name: '미수금_일반'              },
    {code: '1200300', name: '미수금_카드'              },
    {code: '1350000', name: '부가세대급금'             },
    {code: '2530100', name: '미지급금_일반'            },
    {code: '2550000', name: '부가세예수금'             },
    {code: '2590100', name: '선수금_일반'              },
    {code: '2590200', name: '선수금_카드'              },
    {code: '2590300', name: '선수금_진행'              },
    {code: '2590400', name: '선수금_완료'              },
    {code: '2620400', name: '미지급비용_복지포인트'    },
    {code: '2710000', name: '(유동)마일리지충당부채'   },
    {code: '4020000', name: '용역매출'                 },
    {code: '4030000', name: '중개수수료매출'           },
    {code: '4050000', name: '광고수수료매출'           },
    {code: '8310500', name: '지급수수료_금융거래수수료'},
    {code: '8310900', name: '지급수수료_기타'          },
    {code: '9090000', name: '수입수수료'               },
    {code: '9600000', name: '잡손실'                   }
];

export const _getCodeApply = async (code, targetApply, up1) => {
    return await _getInstlSttlBstdDtlList({
        sttlBstdCd: 'INSTL_COMM_CODE',
        sttlBstdMetaNo: 9,
        sttlBstd1Cts: code,
        useYn: 'Y'
    }).then(
        (res) => {
            if (!_.isEmpty(res.data.data.list)) {
                targetApply.value = res.data.data.list.map((o) => {
                    return {cd: o.sttlBstd3Cts, nm: o.sttlBstd4Cts, up: o.sttlBstd6Cts};
                });
                if (!_.isEmpty(up1)) {
                    targetApply.value = targetApply.value.filter((o) => o.up == up1);
                }
            }
        }
    );
};
export const _getUserListPaging = async (param) => {
    return await $api.post(ROOT_CONTEXT + '/user/userList', param);
};

// KB어드민 회원관리 목록
export const _getAdminList = async (params) => {
    return await $api.post(ROOT_CONTEXT + '/adminMemberManagement/kbhcAdmin/list', params);
};

export const _getInstlSttlBstdListPaging = async (param) => {
    return await $api.get(ROOT_CONTEXT + '/instl/sttlBstd/listPaging', {params: param});
};

export const _getInstlSttlBstdList = async (param) => {
    return await $api.get(ROOT_CONTEXT + '/instl/sttlBstd/list', {params: param});
};

export const _createInstlSttlBstd = async (param) => {
    return await $api.post(ROOT_CONTEXT + '/instl/sttlBstd/create', param);
};

export const _modifyInstlSttlBstd = async (param) => {
    return await $api.put(ROOT_CONTEXT + '/instl/sttlBstd/modify', param);
};

export const _getInstlSttlBstdMetaList = async (param) => {
    return await $api.get(ROOT_CONTEXT + '/instl/sttlBstdMeta/list', {params: param});
};

export const _getInstlSttlBstdMetaListPaging = async (param) => {
    return await $api.get(ROOT_CONTEXT + '/instl/sttlBstdMeta/listPaging', {params: param});
};

export const _createInstlSttlBstdMeta = async (param) => {
    return await $api.post(ROOT_CONTEXT + '/instl/sttlBstdMeta/create', param);
};

export const _modifyInstlSttlBstdMeta = async (param) => {
    return await $api.put(ROOT_CONTEXT + '/instl/sttlBstdMeta/modify', param);
};

export const _getInstlSttlBstdDtlMetaList = async (param) => {
    return await $api.get(ROOT_CONTEXT + '/instl/sttlBstdDtl/metaList', {params: param});
};

export const _getInstlSttlBstdDtlMapList = async (param) => {
    return await $api.get(ROOT_CONTEXT + '/instl/sttlBstdDtl/maplist', {params: param});
};

export const _getInstlSttlBstdDtlListPaging = async (param) => {
    return await $api.get(ROOT_CONTEXT + '/instl/sttlBstdDtl/listPaging', {params: param});
};

export const _getInstlSttlBstdDtlList = async (param) => {
    return await $api.get(ROOT_CONTEXT + '/instl/sttlBstdDtl/list', {params: param});
};

export const _createInstlSttlBstdDtl = async (param) => {
    return await $api.post(ROOT_CONTEXT + '/instl/sttlBstdDtl/create', param);
};

export const _modifyInstlSttlBstdDtl = async (param) => {
    return await $api.put(ROOT_CONTEXT + '/instl/sttlBstdDtl/modify', param);
};

export const _deleteInstlSttlBstdDtl = async (param) => {
    return await $api.delete(ROOT_CONTEXT + '/instl/sttlBstdDtl/delete', {params: param});
};

export const _getInstlSttlBstdDtlJnlzList = async (param) => {
    return await $api.get(ROOT_CONTEXT + '/instl/sttlBstdDtl/jnlzlist', {params: param});
};

export const _createInstlSttlBstdDtlJnlz = async (param) => {
    return await $api.post(ROOT_CONTEXT + '/instl/sttlBstdDtl/createJnlz', param);
};

export const _modifyInstlSttlBstdDtlJnlz = async (param) => {
    return await $api.put(ROOT_CONTEXT + '/instl/sttlBstdDtl/modifyJnlz', param);
};

export const _getInstlBatchListPaging = async (param) => {
    return await $api.get(ROOT_CONTEXT + '/instl/batch/listPaging', {params: param});
};

export const _getInstlBatchLogDetailList = async (param) => {
    return await $api.get(ROOT_CONTEXT + '/instl/batch/detailList', {params: param});
};

export const _getInstlIfLogListPaging = async (param) => {
    return await $api.get(ROOT_CONTEXT + '/instl/ifLog/listPaging', {params: param});
};


export const _getInstlAcctSlip = async (param) => {
    return await $api.get(ROOT_CONTEXT + '/instl/slip/list', {params: param});
};

export const _getInstlAcctSlipListPaging = async (param) => {
    return await $api.get(ROOT_CONTEXT + '/instl/slip/listPaging', {params: param});
};

export const _createInstlAcctSlip = async (param) => {
    return await $api.post(ROOT_CONTEXT + '/instl/slip/create', param);
};

export const _deleteInstlAcctSlip = async (param) => {
    return await $api.delete(ROOT_CONTEXT + '/instl/slip/delete', {params: param});
};

export const _getInstlAcctSlipFile = async (param) => {
    return await $api.post(ROOT_CONTEXT + '/instl/slip/excel', param, {responseType: 'blob'})
        .then(
            function(res) {
                try {
                    const blob = new Blob([res.data], { type: res.headers['content-type']});
                    const url = window.URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    const match = /filename="(.+?)"/.exec([res.headers['content-disposition']]);
                    a.href = url;
                    a.download = match ? decodeURI(match[1]) : null;
                    a.click();
                    a.remove();
                    window.URL.revokeObjectURL(url);
                } catch (error) {
                    toast('파일 생성중 오류가 발생하였습니다.', 2000, 'error');
                    return false;
                }
                return true;
            }
            , function(err) {
                toast('파일을 서버에서 받아오지 못하였습니다.', 2000, 'error');
                return false;
            }
        );
};

export const _getInstlErpIfTr = async (param) => {
    return await $api.get(ROOT_CONTEXT + '/instl/erpIf/tr', {params: param});
};

export const _getInstlErpIfAccd = async (param) => {
    return await $api.get(ROOT_CONTEXT + '/instl/erpIf/acct', {params: param});
};

export const _getInstlCmrcDailyListPaging = async (param) => {
    return await $api.get(ROOT_CONTEXT + '/instl/cmrc/daily/listPaging', {params: param});
};

export const _getInstlCmrcMonthlyListPaging = async (param) => {
    return await $api.get(ROOT_CONTEXT + '/instl/cmrc/mtly/listPaging', {params: param});
};

export const _getInstlCmrcMonthlySumlist = async (param) => {
    return await $api.get(ROOT_CONTEXT + '/instl/cmrc/mtly/sumlist', {params: param});
};

export const _getInstlCmrcMtlyPurListPaging = async (param) => {
    return await $api.get(ROOT_CONTEXT + '/instl/cmrc/mtly/purlistPaging', {params: param});
};

export const _getInstlCmrcMtlyDlngListPaging = async (param) => {
    return await $api.get(ROOT_CONTEXT + '/instl/cmrc/mtly/dlnglistPaging', {params: param});
};

export const _getInstlCmrcMtlyPnltListPaging = async (param) => {
    return await $api.get(ROOT_CONTEXT + '/instl/cmrc/mtly/pnltlistPaging', {params: param});
};



export const _getInstlMonthlyStarSlslist = async (param) => {
    return await $api.get(ROOT_CONTEXT + '/instl/mtlyStar/slslistPaging', {params: param});
};

export const _getInstlMonthlyStarRslist = async (param) => {
    return await $api.get(ROOT_CONTEXT + '/instl/mtlyStar/rslistPaging', {params: param});
};

export const _getInstlMonthlyStarRsdetail = async (param) => {
    return await $api.get(ROOT_CONTEXT + '/instl/mtlyStar/rsdetail', {params: param});
};

export const _getInstlMonthlyStarRsdetailListPaging = async (param) => {
    return await $api.get(ROOT_CONTEXT + '/instl/mtlyStar/rsdetailPaging', {params: param});
};

export const _setInstlMonthlyStarRsdcn = async (param) => {
    return await $api.put(ROOT_CONTEXT + '/instl/mtlyStar/rsdcn', param);
};

export const _setInstlMonthlyStarRscreate = async (param) => {
    return await $api.post(ROOT_CONTEXT + '/instl/mtlyStar/rscreate', param);
};

export const _setInstlMonthlyStarTbicreate = async (param) => {
    return await $api.post(ROOT_CONTEXT + '/instl/mtlyStar/tbicreate', param);
};

export const _setInstlMonthlyStarTbimodify = async (param) => {
    return await $api.put(ROOT_CONTEXT + '/instl/mtlyStar/tbimodify', param);
};

export const _setInstlMonthlyStarNts = async (param) => {
    return await $api.put(ROOT_CONTEXT + '/instl/mtlyStar/nts', param);
};

export const _setInstlMonthlyStarTbi = async (param) => {
    return await $api.get(ROOT_CONTEXT + '/instl/mtlyStar/tbi', {params: param});
};

export const _getInstlNptrDigtlList = async (param) => {
    return await $api.get(ROOT_CONTEXT + '/instl/nptrDigtl/list', {params: param});
};

export const _getInstlPgAprvListPaging = async (param) => {
    return await $api.get(ROOT_CONTEXT + '/instl/pgAprv/listPaging', {params: param});
};

export const _getInstlPgDsptListPaging = async (param) => {
    return await $api.get(ROOT_CONTEXT + '/instl/pgDspt/listPaging', {params: param});
};

export const _getInstlPgRcncListPaging = async (param) => {
    return await $api.get(ROOT_CONTEXT + '/instl/pgRcnc/listPaging', {params: param});
};

export const _getInstlAccuPrJnlzListPaging = async (param) => {
    return await $api.get(ROOT_CONTEXT + '/instl/accuPrJnlz/listPaging', {params: param});
};

export const _getInstlAccuPrJnlzDcn = async (param) => {
    return await $api.put(ROOT_CONTEXT + '/instl/accuPrJnlz/dcn', param);
};