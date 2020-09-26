/**
 *
 * @param {ImportIO.Group[]} data
 * @returns {ImportIO.Group[]}
 */
const transform = (data, context) => {

  for (const { group } of data) {
    for (const row of group) {
      try {
        if (row.sku) {
          row.sku = [{ text: row.sku[0].text.split('SKU: ')[1] }];
        }
        if (row.variantId) {
          row.variantId = [{ text: row.variantId[0].text.split('SKU: ')[1] }];
        }
      } catch (exception) { console.log('Error in transform', exception); }
    }
  }
  return data;
};

module.exports = { transform };
