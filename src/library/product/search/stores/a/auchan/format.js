/**
 *
 * @param {ImportIO.Group[]} data
 * @returns {ImportIO.Group[]}
 */
const transform = (data) => {
    for (const { group } of data) {
        for (const row of group) {
            if (row.productUrl) {
                if (row.productUrl && row.productUrl.length > 1)
                    row.productUrl = [row.productUrl[0]];
            }
            if (row.endorsementText) {
                if (row.endorsementText && row.endorsementText.length > 1)
                    row.endorsementText = [row.endorsementText[0]];
            }
        }
    }
    return data;
};

module.exports = { transform };