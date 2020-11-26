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
    for (const { group }
        of data) {
        for (const row of group) {
            if (row.variants) {
                let text = '';
                row.variants.forEach(item => {
                    text = text + (text ? ' | ' : '') + item.text;
                });
                const split = text.split(' | ');
                // @ts-ignore
                const uniqueIds = [...new Set(split)];
                let text2 = '';
                uniqueIds.forEach(id => {
                    text2 = text2 + (text2 ? ' | ' : '') + id;
                });
                row.variants = [{ text: text2 }];
                row.variantCount = [{ text: uniqueIds.length }];
            } else {
                row.variantCount = [{ text: 0 }];
            }
            if (row.description) {
                let text = '';
                text = row.description.map((element) => element.text.trim()).join(' ');
                row.description = [{ text }];
            }
            if (row.aggregateRating) {
                row.aggregateRating[0].text = row.aggregateRating[0].text.replace(/\./g, ',');
            }
            // row.description.forEach(item => {
            // row.description.text= row.description.map((element)=>element.trim()).join(' ')
            // row.description[0].text = row.description[0].text.replace(/\s{1,}/g, ' ');

        }
    }
    data.forEach(obj => obj.group.forEach(row => Object.keys(row).forEach(header => row[header].forEach(el => {
        el.text = clean(el.text);
    }))));
    return data;
};

module.exports = { cleanUp };