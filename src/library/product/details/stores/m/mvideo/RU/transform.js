/**
 *
 * @param {ImportIO.Group[]} data
 * @returns {ImportIO.Group[]}
 */
const transform = (data) => {
    for (const { group } of data) {
      for (const row of group) {
        if (row.image) {
          row.image.forEach(item => {
            item.text = 'https:'+item.text;
          });
        }
        if (row.alternateImages) {
          row.alternateImages.forEach(item => {
            item.text = 'https:'+item.text;
          });
        }
        if (row.sku) {
          row.sku.forEach(item => {
            item.text = item.text;
          });
        }
        if (row.category) {
          row.category.forEach(item => {
            item.text = item.text.replace('Главная', '').trim();
            item.text = item.text.replace(/(\s*\n\s*)+/g, ' > ').trim();
          });
        }
      }
    }
    return data;
  };
  module.exports = { transform };