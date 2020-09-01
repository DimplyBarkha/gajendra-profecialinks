/**
*
* @param {ImportIO.Group[]} data
* @returns {ImportIO.Group[]}
*/
const transform = (data) => {
  for (const { group } of data) {
    for (const row of group) {
      if (row.priceSufix) {
        const sufixVal = row.priceSufix[0].text;
        if (sufixVal === '-') {
          row.price[0].text = row.price[0].text.replace(',-', '');
        }
        delete row.priceSufix
      }

      if (row.availabilityText) {
        const prodInfo = JSON.parse(row.availabilityText[0].text);
        if (prodInfo && prodInfo.offers && prodInfo.offers.availability) {
          row.availabilityText[0].text = prodInfo.offers.availability
        } else {
          delete row.availabilityText
        }
      }

      if (row.gtin) {
        const prodInfo = JSON.parse(row.gtin[0].text);
        if (prodInfo && prodInfo.gtin13) {
          row.gtin[0].text = prodInfo.gtin13
        } else {
          delete row.gtin
        }
      }

      if (row.variantId) {
        const prodInfo = JSON.parse(row.variantId[0].text);
        if (prodInfo && prodInfo.productID) {
          row.variantId[0].text = prodInfo.productID
        } else {
          delete row.variantId
        }
      }

      if (row.aggregateRating) {
        row.aggregateRating[0].text = row.aggregateRating[0].text.replace('.', ',')
      }

      if (row.shippingInfo) {
        row.shippingInfo[0].text = row.shippingInfo[0].text.replace('Verkoop door:', '')
      }

      if (!row.shippingDimensions && row.shippingDimensionsSplit) {
        row.shippingDimensions = [{text: row.shippingDimensionsSplit[0].text}];
        delete row.shippingDimensionsSplit;
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
