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
          item.text = item.text.replace(/(\s?\n)+/g, ' || ').trim();
        });
      }
      if (row.shippingInfo) {
        row.shippingInfo.forEach(item => {
          item.text = item.text.replace(/(\s?\n)+/g, ' || ').trim();
        });
      }
      if (row.aggregateRating) {
        let text = '';
        row.aggregateRating.forEach(item => {
          text = item.text.replace('.', ',');
        });
        row.aggregateRating = [{ text }];
      }
      if ( row.variantCount) {
        // 
        row.variantCount.forEach(item => {
          item.text = item.text === "1" ? "" : item.text;
        });
      };
      
    }
  }
  return data;
};

module.exports = { transform };