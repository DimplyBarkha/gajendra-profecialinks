/**
 *
 * @param {ImportIO.Group[]} data
 * @returns {ImportIO.Group[]}
 */
const transform = (data) => {
  for (const { group } of data) {
    for (const row of group) {
      if (row.availabilityText) {
        row.availabilityText[0].text = (row.availabilityText[0].text === 'Out of Stock' || row.availabilityText[0].text === 'Sold out') ? 'Out of Stock' : 'In Stock';
      }
      if (row.sku) {
        var skuDesc = row.sku[0].text.replace(/\\\//g, '');
        var productInfo = JSON.parse(skuDesc.replace(/'/g, '"'));
        if (productInfo.sku) {
          row.sku[0].text = productInfo.sku;
        }
      }
      if (row.variantId) {
        var variantDesc = row.variantId[0].text.replace(/\\\//g, '');
        var infObj = JSON.parse(variantDesc.replace(/'/g, '"'));
        if (infObj.id) {
          row.variantId[0].text = infObj.id;
        }
      }
      if (row.manufacturerDescription) {
        var manDesc = '';
        row.manufacturerDescription.forEach((ele) => {
          manDesc += ' ' + ele.text;
        });
        row.manufacturerDescription = [
          {
            text: manDesc.trim(),
          }];
      }
      if (row.price && row.listPrice) {
        if (row.price[0].text === row.listPrice[0].text) {
          delete row.listPrice;
        };
      }
    }
  }
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

  return data;
};

module.exports = { transform };
