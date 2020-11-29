/**
 *
 * @param {ImportIO.Group[]} data
 * @returns {ImportIO.Group[]}
 */
const transform = (data) => {
  for (const { group } of data) {
    for (const row of group) {
      if (row.variantId) {
        row.variantId.forEach(item => {
          var splitData = item.text.split('-');
          item.text = splitData[splitData.length - 1];
        });
      }
      if (row.variantUrl) {
        row.variantUrl.forEach(item => {
          item.text = 'https://www.mvideo.ru/' + item.text;
        });
      }
    }
  }
  return data;
};
module.exports = { transform };
