/**
 *
 * @param {ImportIO.Group[]} data
 * @returns {ImportIO.Group[]}
 */
const transform = (data, context) => {
    const clean = text => text.toString()
        .replace(/\r\n|\r|\n/g, ' ')
        .replace(/&amp;nbsp;/g, ' ')
        .replace(/&amp;#160/g, ' ')
        .replace(/\u00A0/g, ' ')
        .replace(/\s{2,}/g, ' ')
        .replace(/"\s{1,}/g, '"')
        .replace(/\s{1,}"/g, '"')
        .replace(/^ +| +$|( )+/g, ' ')
        // eslint-disable-next-line no-control-regex
        .replace(/[\x00-\x1F]/g, '')
        .replace(/[\uD800-\uDBFF][\uDC00-\uDFFF]/g, ' ')
        .trim();
    for (const { group } of data) {
        for (const row of group) {
            Object.keys(row).forEach(header => row[header].forEach(el => {
                el.text = clean(el.text);
            }));
        }
    }
    function checkIfReviewIsFromLast30Days(currentDate, reviewDate) {
        const timestamp = new Date(currentDate).getTime() - (30 * 24 * 60 * 60 * 1000);
        return new Date(reviewDate).getTime() >= timestamp;
    }

    const todayDate = new Date().toDateString();

    data = data.filter(function (item) {
        console.log('group length before' + item.group.length);
        item.group = item.group.filter(function (row) {
            if (checkIfReviewIsFromLast30Days(todayDate, row.reviewDate[0].text)) {
                return true;
            }
            return false;
        });
        console.log('group length after' + item.group.length);
        item.rows = item.group.length;
        if (item.group.length !== 0) {
            return true;
        }
        return false;
    });
    return data;
};
module.exports = { transform };