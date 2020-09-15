/**
 *
 * @param {ImportIO.Group[]} data
 * @returns {ImportIO.Group[]}
 */
const transform = (data) => {
  for (const { group } of data) {
    for (const row of group) {
      if (row.id) {
        row.id.forEach(item => {
          var splitData = item.text.split('-');
          item.text =  splitData[splitData.length-1];
        });
      }
      if (row.thumbnail) {
        row.thumbnail.forEach(item => {
          item.text = 'https:'+item.text;
        });
      }
      if (row.productUrl) {
        row.productUrl.forEach(item => {
          item.text = 'https://www.mvideo.ru'+item.text;
        });
      }
    }
  }
  return data;
};
module.exports = { transform };