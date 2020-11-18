/**
 *
 * @param {ImportIO.Group[]} data
 * @returns {ImportIO.Group[]}
 */
const transform = (data) => {
  const variations = [];
  for (const { group } of data) {
    for (const row of group) {
      if (row.variantId) {
        var scriptJSON = JSON.parse(row.variantId[0].text);
        if (scriptJSON.attributes) {
          var objectsInVariants = scriptJSON.attributes.length;
          for( var i = 0; i < objectsInVariants; i++ ) {
            var item = objectsInVariants[i];
            var tmpVariations = {};
            tmpVariations.variantId = [];
            tmpVariations.variantUrl = [];
            tmpVariations.variant = [];
            if (item.id) {
              tmpVariations.variantId.push({ text: item.id });
            }
            if (item.url) {
              tmpVariations.variantUrl.push({ text: item.url });
            }
            if (item.value) {
              tmpVariations.variant.push({ text: item.value });
            }
            if (tmpVariations.variantId.length) {
              variations.push(tmpVariations);
            }
          });
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
