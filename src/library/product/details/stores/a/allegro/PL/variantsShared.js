
/**
 *
 * @param {ImportIO.Group[]} data
 * @returns {ImportIO.Group[]}
 */
const transform = (data) => {
  for (const { group } of data) {
    for (const row of group) {
      if (!row.variantUrl && row.productUrl) {
        row.variantUrl = row.productUrl;
        row.variantId = row.productId;
      }
    }
  }

  return data;
};

module.exports = { transform };
