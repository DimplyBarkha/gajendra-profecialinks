/**
 *
 * @param {ImportIO.Group[]} data
 * @returns {ImportIO.Group[]}
 */
const transform = (data) => {
  for (const { group } of data) {
    for (const row of group) {
      var set = new Set();
      row.alternateImages.forEach(function ({ text }) {
        if (!set.has(text) && !text.includes('_v01')) {
          set.add(text);
        }
      });
      if (row.alternateImages) {
        row.alternateImages = [{ text: Array.from(set).join(' || ') }];
      }
      if (row.listPrice) {
        row.listPrice = [{ text: row.listPrice.map(item => item.text + '₽').join(" || ") }]
      }
      if (row.price) {
        row.price = [{ text: row.price.map(item => item.text.replace(/(\s|\n)/gm, '')).join(" || ") }]
      }
      if (row.promotion) {
        row.promotion.map(item => {
          item.text = item.text.replace(/\n \n /gm, "| ").replace(/\n/gm, "");
        });
      }
      if (row.specifications) {
        row.specifications = [{ text: row.specifications.map(item => item.text.replace('\n', ':')).join(" || ") }]
      }
      if (row.warranty) {
        row.warranty = [{ text: row.warranty.map(item => item.text.replace(/\n \n /gm, "| ").replace(/\n/gm, "")).join(" | ") }]
      }
    }
  }
  return data;
};

module.exports = { transform };
