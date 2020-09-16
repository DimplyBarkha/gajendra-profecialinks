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
            item.text = "https://www.noon.com" + item.text;
          });
        }
        if (row.id) {
          row.id.forEach(item => {
            item.text = item.text.replace(/.+o=(.+)$/, '$1');
          });
        }
        row.rank = [{"text":rank}];
        row.rankOrganic = [{"text":rank}];
        rank++;
      }
    }
    return data;
  };
  
  module.exports = { transform };