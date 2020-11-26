/**
 *
 * @param {ImportIO.Group[]} data
 * @returns {ImportIO.Group[]}
 */
const transform = (data) => {
  for (const { group } of data) {
    for (const row of group) {
      if (row.variantId && row.variantId.length > 1) {
        row.variantId.shift();
      }
      if (row.sku && row.sku.length > 1) {
        row.sku.shift();
      }
    }
  }
  return data;
};

module.exports = { transform };
