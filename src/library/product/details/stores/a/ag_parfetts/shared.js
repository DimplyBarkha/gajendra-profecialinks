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
            let text = '';
            text = [String(row.name && row.name[0].text), String(row.variantInformation && row.variantInformation[0].text)].filter(e => e !== 'undefined').join(' - ');
            row.nameExtended = [
                {
                    text: text,
                },
            ];
            // if (row.ingredientsList) {
            //     let text = '';
            //     row.ingredientsList.forEach((element) => {
            //         if (element.xpath.includes('li')) {
            //             text += `${element.text}, `;
            //         }
            //     });
            //     row.ingredientsList = [{ text: text.trim() }];
            // }
            
            // if (row.specifications && row.warrabty) {
            //     if (row.warrabty[0].text === ' ') {
            //       row.warrabty[0].text = ''
            //     }
            //     let text = `${row.name[0].text} ${row.warrabty[0].text}`;
            //     // row.name = [{ text: text.trim() }]
            //     row.specifications = [{ text: text.trim() }]
            //   }
        }
    }
    data.forEach(obj => obj.group.forEach(row => Object.keys(row).forEach(header => row[header].forEach(el => {
        el.text = clean(el.text);
    }))));
    return data;
};

module.exports = { cleanUp };
