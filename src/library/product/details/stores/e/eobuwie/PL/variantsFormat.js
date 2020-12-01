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
              var tempSrc = variation.src;
              tempSrc = tempSrc.replace(/.+75x75\/\d+\/\d+\//g, '');
              tempSrc = tempSrc.replace(/_.+/g, '');
              var tmpVariations = {};
              tmpVariations.variantId = [];
              tmpVariations.variantUrl = [];
              tmpVariations.variant = [];
              tmpVariations.variantId.push({ text: tempSrc });
              tmpVariations.variantUrl.push({ text: variation.href });
              tmpVariations.variant.push({ text: variation.alt });
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