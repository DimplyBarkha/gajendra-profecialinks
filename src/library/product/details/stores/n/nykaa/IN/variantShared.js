/**
 *
 * @param {ImportIO.Group[]} data
 * @returns {ImportIO.Group[]}
 */
const cleanUp = (data, context) => {
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
        .replace(/[\uD800-\uDBFF][\uDC00-\uDFFF]/g, ' ');
    for (const { group } of data) {
        for (const row of group) {
            if (row.variantUrl) {
                let url = row.variantUrl[0].text;
                let appendId = url.replace(/(.+)(skuId=)(\d+)/g, '$3');
                if (appendId.includes('nykaa.com')) {
                    appendId = url.match(/(p\/)(\d+)/g)[0].match(/\d+/g)[0];
                }
                let trialUrl;
                if (url.includes('html')) {
                    trialUrl = url.split('?')[0];
                } else {
                    trialUrl = url.split('/p/')[0];
                }
                const gotoUrl = `${trialUrl}/p/${appendId}`;
                row.variantUrl = [{ text: gotoUrl }]
            }
        }
    }
    data.forEach(obj => obj.group.forEach(row => Object.keys(row).forEach(header => row[header].forEach(el => {
        el.text = clean(el.text);
    }))));
    return data;
};

module.exports = { cleanUp };
