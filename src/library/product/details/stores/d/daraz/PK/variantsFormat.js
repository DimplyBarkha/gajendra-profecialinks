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
        row.variantId.forEach(item => {
          var vData = JSON.parse(item.text);
          if (vData) {
            vData.forEach(variation => {
              var tmpVariations = {};
              tmpVariations.variantId = [];
              tmpVariations.variantUrl = [];
              tmpVariations.variant = [];
              tmpVariations.variantId.push({ text: variation.cartSkuId });
              tmpVariations.variantUrl.push({ text: 'https://www.daraz.pk' + variation.pagePath });
              var tempVariant = variation.propPath;
              // 30129:Navy Blue;31186:2728
              tempVariant = tempVariant.replace(/\d+:/g, '');
              tempVariant = tempVariant.replace(/;.+/g, '');
              tmpVariations.variant.push({ text: tempVariant });
              variations.push(tmpVariations);
            });
          } else {
            delete row.variantId;
          }
        });
      }
    }
  }
  if (variations.length) {
    data[0].group = variations;
  }
  return data;
};

module.exports = { transform };
