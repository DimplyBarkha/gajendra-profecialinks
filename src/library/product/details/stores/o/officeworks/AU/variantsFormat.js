/**
 *
 * @param {ImportIO.Group[]} data
 * @returns {ImportIO.Group[]}
 */
const transform = (data) => {
  for (const { group } of data) {
    for (const row of group) {
      if (row.variantUrl) {
        row.variantUrl.forEach(item => {
          item.text = "https://www.officeworks.com.au" + item.text;
        });
      }
      if (row.variantId) {
        row.variantId.forEach(item => {
          item.text = item.text.replace('colour-swatch-', '');
        });
      }
    }
  }
  return data;
};

module.exports = { transform };
