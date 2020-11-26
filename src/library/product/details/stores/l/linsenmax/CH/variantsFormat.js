/**
 *
 * @param {ImportIO.Group[]} data
 * @returns {ImportIO.Group[]}
 */
const transform = (data) => {
  for (const { group } of data) {
    for (const row of group) {
      if (row.variant) {
        row.variant.forEach(item => {
          item.text = item.text.trim();
        });
      }
      if (row.variantUrl) {
        if (row.variantId) {
          row.variantUrl.forEach(item => {
            item.text = item.text + '?unitId=' + row.variantId[0].text;
          });
        }
      }
      if (row.variantId) {
        if (row.pId) {
          row.variantId.forEach(item => {
            item.text = row.pId[0].text + '-' + item.text;
          });
        }
      }
      if (row.pId) {
        delete row.pId;
      }
    }
  }
  return data;
};

module.exports = { transform };
