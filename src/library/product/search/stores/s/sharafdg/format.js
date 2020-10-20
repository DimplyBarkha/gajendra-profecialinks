/**
 *
 * @param {ImportIO.Group[]} data
 * @returns {ImportIO.Group[]}
 */
const transform = (data) => {
    var rank = 1
    for (const { group } of data) {
        for (const row of group) {
            row.rankOrganic = row.rank = [{ 'text': rank }];
            rank = rank + 1;
        }
    }
    return data;
};

module.exports = { transform };