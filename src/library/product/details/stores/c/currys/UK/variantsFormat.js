/**
 *
 * @param {ImportIO.Group[]} data
 * @returns {ImportIO.Group[]}
 */
const transform = (data) => {
  const variations = [];
  for (const { group } of data) {
    for (const row of group) {
      if (row.variants) {
        var scriptJSON = JSON.parse(row.variants[0].text);
        if (scriptJSON.productVariants) {
          var objectsInVariants = Object.keys(scriptJSON.productVariants).length;
          for (var i = 0; i < objectsInVariants; i++) {
            var keyName = Object.keys(scriptJSON.productVariants)[i];
            var variants = scriptJSON.productVariants[keyName].variants;
            variants.forEach(function (item, index) {
              const tmpVariations = {};
              tmpVariations['variantId'] = [];
              tmpVariations['variantUrl'] = [];
              tmpVariations['variant'] = [];
              tmpVariations['variantId'].push({ text: item.fupid });
              tmpVariations['variantUrl'].push({ text: item.product_url });
              tmpVariations['variant'].push({ text: item.variant });
              variations.push(tmpVariations);
            });
          }
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
