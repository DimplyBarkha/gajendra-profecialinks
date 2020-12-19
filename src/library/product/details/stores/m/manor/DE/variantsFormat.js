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
          item.text = item.text.replace('/de/p/', '');
        });
      }
      if (row.variantUrl) {
        row.variantUrl.forEach(item => {
          item.text = 'https://www.manor.ch' + item.text;
        });
      }
    }
  }
  return data;
};

module.exports = { transform };