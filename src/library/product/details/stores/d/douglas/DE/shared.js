/**
*
* @param {ImportIO.Group[]} data
* @returns {ImportIO.Group[]}
*/
const transform = (data) => {
  for (const { group } of data) {
    for (const row of group) {
      if (row.availabilityText) {
        const availabilityText = row.availabilityText[0].text.trim() === 'Leider ausverkauft' ? 'Out of stock' : row.availabilityText[0].text.trim() === 'Auf Lager' ? 'In Stock' : '';
        row.availabilityText[0].text = availabilityText;
      }
      if (row.gtin) {
        const upcObj = JSON.parse(row.gtin[0].text);
        row.gtin[0].text = upcObj.gtin13;
      }
      if (row.variantId) {
        const productInfo = row.variantId[0].text;
        const referenceText = 'window.customExactagConfig =';
        const productData = JSON.parse(productInfo.substring((productInfo.indexOf(referenceText) + referenceText.length), productInfo.indexOf('}') + 1));
        row.variantId[0].text = productData.product_id;
      }
     
      if (row.aggregateRating) {
        const aggregateRating2 = row.aggregateRating[0].text;
        const ratingValue = JSON.parse(aggregateRating2);
        if (ratingValue && ratingValue.aggregateRating && ratingValue.aggregateRating.ratingValue !== null) {
          row.aggregateRating[0].text = JSON.parse(aggregateRating2).aggregateRating.ratingValue.toFixed(1).toString().replace('.', ',')
        }else {
          delete row.aggregateRating;
        }
      }

      if (row.color) {
        const color = row.color[0].text;
        row.color[0].text = color.substring(color.lastIndexOf('-') + 1).trim();
      }
    }
  }

  // Clean up data
  const clean = text => text.toString()
    .replace(/\r\n|\r|\n/g, ' ')
    .replace(/&amp;nbsp;/g, ' ')
    .replace(/&amp;#160/g, ' ')
    .replace(/\u00A0/g, ' ')
    .replace(/\s{2,}/g, ' ')
    .replace(/"\s{1,}/g, '"')
    .replace(/\s{1,}"/g, '"')
    .replace(/^ +| +$|( )+/g, ' ')
    // eslint-disable-next-line no-control-regex
    .replace(/[\x00-\x1F]/g, '')
    .replace(/[\uD800-\uDBFF][\uDC00-\uDFFF]/g, ' ')
    .trim();

  data.forEach(obj => obj.group.forEach(row => Object.keys(row).forEach(header => row[header].forEach(el => {
    el.text = clean(el.text);
  }))));

  return data;
};

module.exports = { transform };
