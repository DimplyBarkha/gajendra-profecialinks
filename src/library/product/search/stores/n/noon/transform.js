/**
 *
 * @param {ImportIO.Group[]} data
 * @returns {ImportIO.Group[]}
 */
const transform = (data) => {
    for (const { group } of data) {
      for (const row of group) {
        if (row.prodcutUrl) {
          row.prodcutUrl.forEach(item => {
            item.text = "https://www.noon.com" + item.text;
          });
        }
        }
    }
    return data;
  };
  
  module.exports = { transform };