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
      if (row.aggregateRatingText && row.aggregateRatingText[0]) {
        row.aggregateRatingText[0].text = row.aggregateRatingText[0].text.replace(/\./g, ',');
      }

    }
  }
  return data;
};

module.exports = { transform };