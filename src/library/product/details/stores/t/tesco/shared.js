/**
 *
 * @param {ImportIO.Group[]} data
 * @returns {ImportIO.Group[]}
 */
const transform = (data) => {
    // Default transform function
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

    for (const { group }
        of data) {
        for (const row of group) {
            if (row.additives) {
                let text = '';
                row.additives.forEach(item => {
                    text += item.text.replace(/\\n/g, '   ');
                });
                row.additives = [{
                    text: text,
                }, ];
            }
            if (row.caloriesPerServing) {
                let text = '';
                row.caloriesPerServing.forEach(item => {
                    text += item.text.replace(new RegExp('(.+)(\\/|\\/-)$', 'g'), '$1');
                    if (text === '/') {
                        text = '';
                    }
                });
                row.caloriesPerServing = [{
                    text: text.replace(new RegExp('(.+\\/)\\/(.+)', 'g'), '$1$2'),
                }, ];
            }
        }
    }
    return data;
};

module.exports = { transform };