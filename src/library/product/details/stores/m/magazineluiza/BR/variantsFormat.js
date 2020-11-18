/**
 *
 * @param {ImportIO.Group[]} data
 * @returns {ImportIO.Group[]}
 */
const transform = (data) => {
  var variations = [];
  for (const { group } of data) {
    for (const row of group) {
      if (row.variantId) {
        const vData = JSON.parse(row.variantId[0].text);
        if (vData.attributes) {
          vData.attributes.forEach(variation => {
            var tmpVariations = {};
            tmpVariations.variantId = [];
            tmpVariations.variantUrl = [];
            tmpVariations.variant = [];
            tmpVariations.variantId.push({ text: variation.id });
            tmpVariations.variantUrl.push({ text: 'https://www.magazineluiza.com.br' + variation.url });
            tmpVariations.variant.push({ text: variation.value });
            variations.push(tmpVariations);
          });
        } else {
          delete row.variantId;
        }
      }
    }
  }
  if (variations.length) {
    data[0].group = variations;
  }
  return data;
};

module.exports = { transform };
