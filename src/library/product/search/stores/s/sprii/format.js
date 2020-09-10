/**
 *
 * @param {ImportIO.Group[]} data
 * @returns {ImportIO.Group[]}
 */
const transform = (data) => {
    for (const { group } of data) {
        for (const row of group) {
            if (row.brandText && row.brandText.length) {
                let str = row.brandText[0].text;
                str = str.substr(str.lastIndexOf('/') + 1);
                row.brandText[0].text = str.length ? str.split('-')[0] : 'Brand Not Found';
            }
        }
    }
    return data;
};

module.exports = { transform };