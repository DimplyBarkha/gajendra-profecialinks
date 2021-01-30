
/**
 *
 * @param {ImportIO.Group[]} data
 * @returns {ImportIO.Group[]}
 */
const transform = (data) => {
    for (const { group } of data) {
        for (const row of group) {
            if (row.sku) {
                console.log(row.sku);
                row.sku.forEach(item => {
                    let text = item.text.split('/');
                    item.text = text[text.length - 1];
                });
            }
            return data;
        };
    }
}
module.exports = { transform }