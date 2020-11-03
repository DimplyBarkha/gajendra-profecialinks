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
        try {
          var productInfo = JSON.parse(skuDesc);
          if (productInfo.sku) {
            row.sku[0].text = productInfo.sku;
          } else if (productInfo.offers && productInfo.offers[0].sku) {
            row.sku[0].text = productInfo.offers[0].sku;
          }
        } catch (e) {
          row.sku[0].text = '';
        }
      }
      if (row.variantId) {
        var variantDesc = row.variantId[0].text.replace(/\\\//g, '');
        try {
          var infObj = JSON.parse(variantDesc);
          if (infObj.id) {
            row.variantId[0].text = infObj.id;
          }
        } catch (e) {
          row.variantId[0].text = '';
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
      if (row.quantity) {
        if (row.quantity.length > 1) {
          row.quantity = [{
            text: row.quantity[row.quantity.length - 1].text,
          }];
        }
      }
      if (row.mpc && row.sku) {
        row.mpc[0].text = row.sku[0].text;
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
