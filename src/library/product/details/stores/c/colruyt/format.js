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
      if (row.price) {
        row.price.forEach((priceItem) => {
          priceItem.text = priceItem.text.replace('/pc.', '').replace(',', '.');
        });
      }
      if (row.servingSize) {
        row.servingSize.forEach((servingSizeItem) => {
          servingSizeItem.text = servingSizeItem.text.replace('Valeur nutritive moyenne par', '').trim();
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
      if (row.image) {
        row.image.forEach((imageItem) => {
          imageItem.text = imageItem.text.includes('http') ? imageItem.text : 'https:' + imageItem.text;
        });
      }
    }
  }
  return data;
};
module.exports = { transform };
