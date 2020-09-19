
/**
*
* @param {ImportIO.Group[]} data
* @returns {ImportIO.Group[]}
*/
const transform = (data) => {
    for (const { group } of data) {
        for (const row of group) {
            try {
                if (row.price) {
                    row.price = [{ text: row.price[0].text.substring(0, row.price[0].text.length - 2) }, { text: row.price[0].text.charAt(row.price[0].text.length - 1) }];
                }
                if (row.listPrice) {
                    row.listPrice = [{ text: row.listPrice[0].text.substring(1, row.listPrice[0].text.length - 1) }];
                }
            } catch (exception) {
                console.log('Error in transform', exception);
            }
        }
    }

    // Clean up data
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

    data.forEach(obj => obj.group.forEach(row => Object.keys(row).forEach(header => row[header].forEach(el => {
        el.text = clean(el.text);
    }))));

    return data;
};

module.exports = { transform };
