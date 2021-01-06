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
        row.variantId.forEach(item => {
          const vData = JSON.parse(item.text);
          if (vData.variations && vData.variations.length > 0) {
            vData.variations.forEach(variation => {
              const tmpVariations = {};
              tmpVariations.variantId = [];
              tmpVariations.variantUrl = [];
              tmpVariations.variant = [];
              tmpVariations.variantId.push({ text: variation.sku, xpath: item.xpath });
              tmpVariations.variantUrl.push({ text: 'https://en-ae.namshi.com/' + variation.link, xpath: item.xpath });
              tmpVariations.variant.push({ text: variation.color, xpath: item.xpath });
              variations.push(tmpVariations);
            });
          } else {
            const tmpVariations = {};
            tmpVariations.variantId = [];
            tmpVariations.variantUrl = [];
            tmpVariations.variant = [];
            tmpVariations.variantId.push({ text: vData.sku, xpath: item.xpath });
            tmpVariations.variantUrl.push({ text: 'https://en-ae.namshi.com/' + vData.link, xpath: item.xpath });              
            variations.push(tmpVariations);
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
