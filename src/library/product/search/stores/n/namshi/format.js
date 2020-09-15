
/**
 *
 * @param {ImportIO.Group[]} data
 * @returns {ImportIO.Group[]}
 */
const transform = (data) => {
    for (const { group } of data) {
        let rank = 1;
        for (const row of group) {
            if (row.productUrl) {
                row.productUrl.forEach(item => {
                    item.text = "https://en-ae.namshi.com" + item.text;
                });
            }
            if (row.rankOrganic) {
                row.rankOrganic.forEach(item => {
                    item.text = parseInt(item.text) + 1;
                });
            }
            row.rank = [{"text":rank}];
            rank++;         
        }
    }
    return data;
  };
  
  module.exports = { transform };