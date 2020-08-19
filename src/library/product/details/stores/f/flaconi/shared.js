
/**
 *
 * @param {ImportIO.Group[]} data
 * @returns {ImportIO.Group[]}
 */
const transform = (data) => {
    for (const { group } of data) {
      for (const row of group) {
        if (row.shippingInfo) {
          row.shippingInfo.forEach(item => {
            item.text = item.text.replace(/\n/g, '').trim();
          });
        }
        if (row.directions) {
          row.directions.forEach(item => {
            item.text = item.text.replace(/\n/g, '').trim();
          });
        }
        if (row.manufacturerDescription) {
          row.manufacturerDescription.forEach(item => {
            item.text = item.text.replace(/(\s*[\r\n]\s*)+/g, ' ').trim();
          });
        }
        if (row.aggregateRating) {
          row.aggregateRating.forEach(item => {
            item.text = item.text.replace(',','.');
          });
        }
      }
    }
    return data;
  };
  
  module.exports = { transform };
  