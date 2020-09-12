/**
 *
 * @param {ImportIO.Group[]} data
 * @returns {ImportIO.Group[]}
 */
const transform = (data) => {
  for (const { group } of data) {
    for (const row of group) {
      if (row.productUrl) {
        row.productUrl.forEach(item => {
          item.text = "https://www.trademe.co.nz" + item.text;
        });
      }
      if (row.thumbnail) {
        row.thumbnail.forEach(item => {
          item.text = item.text.match(/\(([^)]+)\)/)[1].slice(1,-1);
        });
      }
      if (row.variantId) {
        row.variantId.forEach(item => {
            item.text = item.text.replace(/\?.*$/g, '').trim();
            item.text = item.text.replace(/\D/g, ' ').trim();
          });
      }
      if (row.id) {
      row.id.forEach(item => {
          item.text = item.text.replace(/\?.*$/g, '').trim();
          item.text = item.text.replace(/\D/g, ' ').trim();
        });
      }
    } 
  }
  return data;
};
module.exports = { transform };