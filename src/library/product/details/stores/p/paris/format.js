/**
 *
 * @param {ImportIO.Group[]} data
 * @returns {ImportIO.Group[]}
 */
const transform = (data) => {
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
    .replace(/[\uD800-\uDBFF][\uDC00-\uDFFF]/g, ' ');
  data.forEach(obj => obj.group.forEach(row => Object.keys(row).forEach(header => row[header].forEach(el => {
    el.text = clean(el.text);
  }))));
  for (const { group } of data) {
    for (const row of group) {
      const specificationArray = [];
      if (row.specifications) {
        row.specifications.forEach(specificationItem => {
          specificationArray.push(specificationItem.text);
        });
      }
      row.specifications = [{ text: specificationArray.join(' | ') }];
      if (row.shippingDimensions) {
        row.shippingDimensions.forEach((shippingDimensionsItem) => {
          shippingDimensionsItem.text = shippingDimensionsItem.text.replace(/.*: ?(.*?) ?\(.*/gm, '$1');
        });
      }
      if (row.category) {
        row.category.shift();
      }
      if (row.imageAlt) {
        row.imageAlt.forEach((imageAltItem) => {
          imageAltItem.text = imageAltItem.text.replace(/[,]/gm, '');
        });
      }
      if (row.aggregateRatingText) {
        row.aggregateRatingText.forEach((aggregateRatingTextItem) => {
          aggregateRatingTextItem.text = aggregateRatingTextItem.text.replace(/[^\d]/gm, '');
        });
      }
      if (row.sku) {
        row.sku.forEach((skuItem) => {
          skuItem.text = skuItem.text.replace(/[^\d]/gm, '');
        });
      }
      if (row.variantId) {
        row.variantId.forEach((variantIdItem) => {
          variantIdItem.text = variantIdItem.text.replace(/[^\d]/gm, '');
        });
      }
    }
  }
  return data;
};
module.exports = { transform };
