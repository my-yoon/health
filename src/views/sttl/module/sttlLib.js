export const sttlLib = (() => {

    const getExceptGroupHeader = (constColum) => {
        const exceptGroupHeader = [];
        _.clone(constColum).forEach(row => {
            if (row.children && row.children.length > 0) {
                row.children.forEach(childRow => {
                    exceptGroupHeader.push(childRow);
                });
            } else {
                exceptGroupHeader.push(row);
            }
        });
        return exceptGroupHeader;
    };

    const formatCdNm = (params, codeList, nameOnly) => {
        let findedRow = codeList.value.filter(o => o.cd == params.value);
        if (_.isEmpty(findedRow)) {
            return params.value;
        } else if (nameOnly) {
            return findedRow[0].nm;
        } else {
            return findedRow[0].cd + ' : ' + findedRow[0].nm;
        }
    };

    const formatMoney = (params) => {
        return _.replace(params.value, /(\d)(?=(\d{3})+(?!\d))/g, '$1,');
    };

    const copyToClipboard = (text) => {
        navigator.clipboard.writeText(text).then(() => {
            console.log('텍스트가 클립보드에 복사되었습니다.');
        }).catch(err => {
            console.log('클립보드 복사 실패', err);
        });
    };

    const formatBrm = (text) => {
        return text ? text.replace(/^(\d{3})(\d{2})(\d{5})$/, '$1-$2-$3') : '';
    };

    const formatDate = (params) => {
        return _.replace(params.value, /(\d{4})(\d{2})(\d{2})/g, '$1-$2-$3');
    };

    return {
        getExceptGroupHeader,
        formatCdNm,
        formatMoney,
        copyToClipboard,
        formatBrm,
        formatDate
    };

})();