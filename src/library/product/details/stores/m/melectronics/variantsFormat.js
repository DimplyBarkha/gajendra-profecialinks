/**
 *
 * @param {ImportIO.Group[]} data
 * @returns {ImportIO.Group[]}
 */
const transform = (data) => {
  const finalVariations = [];
  for (const { group } of data) {
    for (const row of group) {
      if (row.variantId) {
        row.variantId.forEach(item => {
          var matches = /window.__INITIAL_STATE__\s+=\s*(.*?\});/isg.exec(item.text);
          if (matches) {
            var matchData = matches[1].replace(/(undefined)+/g, 'null');
            const jData = JSON.parse(matchData);
            // jData.product.data.variantMatrix;
            if (jData.product.data.variantMatrix && jData.product.data.variantMatrix.length > 0) {
              jData.product.data.variantMatrix.forEach(variantsData => {
                const tmpVariations = {};
                tmpVariations.variantId = [];
                tmpVariations.variantUrl = [];
                tmpVariations.variant = [];
                if (variantsData.variantOption.code) {
                  tmpVariations.variantId.push({ text: variantsData.variantOption.code, xpath: item.xpath });
                }
                if (variantsData.variantOption.url) {
                  tmpVariations.variantUrl.push({ text: 'https://www.melectronics.ch' + variantsData.variantOption.url, xpath: item.xpath });
                }
                if (variantsData.variantValueCategory.name) {
                  tmpVariations.variant.push({ text: variantsData.variantValueCategory.name, xpath: item.xpath });
                }
                finalVariations.push(tmpVariations);
              });
            } else {
              item.text = '';
              // delete item.variantId;
            }
          } else {
            item.text = '';
            // delete item.variantId;
          }
        });
      }
    }
  }
  if (finalVariations.length) {
    data[0].group = finalVariations;
    return data;
  } else {
    return [];
  }
};

module.exports = { transform };
