/**
 *
 * @param {ImportIO.Group[]} data
 * @returns {ImportIO.Group[]}
 */
const transform = (data) => {
    for (const { group } of data) {
      for (const row of group) {
        if (row.description) {
          row.description.forEach(item => {
            item.text = item.text.replace(/(\s?\n)+/g, ' | ').trim();
          });
        }
        if (row.specifications) {
          row.specifications.forEach(item => {
            item.text = item.text.replace(/(\s?\n)+/g, ' ').trim();
          });
        }
        if (row.alternateImages) {
            row.alternateImages.forEach(item => {
              item.text = item.text.replace("?wid=800&hei=800&qlt=70", '').trim();
            });
        }        
        if (row.aggregateRatingText) {
          row.aggregateRatingText.forEach(item => {
            item.text = item.text.replace(/(\s?\n)+/g, ' | ').trim();
          });
        }
        if (row.shippingInfo) {
          row.shippingInfo.forEach(item => {
            item.text = item.text.replace(/(\s?\n)+/g, ' | ').trim();
          });
        }

      }
    }
    return data;
  };
  
  module.exports = { transform };
  