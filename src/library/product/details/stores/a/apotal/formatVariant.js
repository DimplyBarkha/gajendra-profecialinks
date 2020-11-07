/**
 *
 * @param {ImportIO.Group[]} data
 * @returns {ImportIO.Group[]}
 */
const transform = (data) => {
  for (const { group } of data) {
    for (const row of group) {
      if (row.variantId) {
        const variantIds = row.variantId[0].text.trim().split('-');
        console.log('variantIds ', variantIds);
        row.variantId = [{ text: variantIds[variantIds.length - 1].toString(), xpath: row.variantId[0].xpath }];
      }
    }
  }
  return data;
};

module.exports = { transform };
