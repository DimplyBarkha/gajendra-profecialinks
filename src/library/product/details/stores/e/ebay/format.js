
/**
 *
 * @param {ImportIO.Group[]} data
 * @returns {ImportIO.Group[]}
 */
const transform = (data) => {
    for (const { group } of data) {
        for (const row of group) {
            if (row.specifications) {
                let text = '';
                row.specifications = [{
                    text: row.specifications.reduce((item, currItem) => item ? `${item} || ${currItem.text.replace(/:(\s*\n\s*)+/g, ': ').replace(/(\s*\n\s*)+/, ' || ')}` : currItem.text.replace(/:(\s*\n\s*)/g, ': ').replace(/(\s*\n\s*)+/, ' || '), ''),
                  }];
            }
            if (row.image && !row.image[0].text.includes('l500')) {
                row.image[0].text = row.image[0].text.replace(/(.+\/s-)l.*?(\..*)/,'$1l500$2')
              }
        
        }
    }
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
