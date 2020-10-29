/**
 *
 * @param {ImportIO.Group[]} data
 * @returns {ImportIO.Group[]}
 */
const transform = (data) => {
    var p_count = 1
    for (const { group } of data) {
        for (const row of group) {
          if (row.thumbnail) {
            row.thumbnail.forEach(item => {
              item.text = 'https://www.wine.com'.concat(item.text);
            });
          }
          if (row.price) {
            row.price.forEach(item => {
              item.text = item.text.replace('.',',');
            });
          }
          row.rank = row.rankOrganic = [{"text": p_count}];
          p_count = p_count + 1;
        }
    }
    return data;
  };
  
  module.exports = { transform };