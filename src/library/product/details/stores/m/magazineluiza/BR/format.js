/**
 *
 * @param {ImportIO.Group[]} data
 * @returns {ImportIO.Group[]}
 */
const transform = (data) => {
  const cleanUp = (data, context) => {
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
  for (const { group } of data) {
    for (const row of group) {
      if (row.alternateImages) {
        row.alternateImages.splice(0, 1);
        if (row.alternateImages.length === 0) {
          delete row.alternateImages;
        }
      }
      // if (row.descriptionBullets) {
      //   var bulletArr = [];
      //   row.descriptionBullets.forEach(item => {
      //     bulletArr.push(item.text.replace(/^\s*-\s*/, ''));
      //   });
      //   row.descriptionBullets = [{ text: '|| ' + bulletArr.join(' || ') }];
      // }
      if (row.specifications) {
        var arrSpecs = [];
        row.specifications.forEach(item => {
          item.text = item.text.replace(/\n\s*\n/, ' : ');
          arrSpecs.push(item.text);
        });
        row.specifications = [{ text: arrSpecs.join(' || ') }];
      }
      if (row.gtin) {
        row.gtin = [{ text: row.gtin[0].text }];
      }
      if (row.price) {
        var arrPrice = [];
        row.price.forEach(item => {
          item.text = item.text.replace('.', '');
          // item.text = item.text.replace(',', '.');
          arrPrice.push(item.text);
        });
        if (arrPrice.length) {
          row.price = [{ text: arrPrice.join(' ') }];
        }
      }
      if (row.listPrice) {
        row.listPrice.forEach(item => {
          item.text = item.text.replace('de ', '');
          item.text = item.text.replace('.', '');
          // item.text = item.text.replace(',', '.');
        });
      }
      if (row.sku) {
        var jsonObj = JSON.parse(row.sku[0].text);
        if (jsonObj.sku) {
          row.variantId = row.sku = [{ text: jsonObj.sku }];
        }
        var arrVariantIds = [];
        if (jsonObj.attributes) {
          var attributeObj = jsonObj.attributes;
          for (var i = 0; i < attributeObj.length; i++) {
            var tempObj = attributeObj[i];
            if (tempObj.id) {
              arrVariantIds.push(tempObj.id);
            }
          }
        }
        if (arrVariantIds.length) {
          row.variants = [{ text: arrVariantIds.join(' | ') }];
          row.variantCount = [{ text: arrVariantIds.length }];
        }
      }
      if (row.promotion) {
        row.promotion.forEach(item => {
          item.text = item.text.replace('(', '');
          item.text = item.text.replace(')', '');
        });
      }
      if (row.shippingDimensionsL && row.shippingDimensionsW && row.shippingDimensionsH) {
        row.shippingDimensions = [{ text: row.shippingDimensionsL[0].text + ' x ' + row.shippingDimensionsW[0].text + ' x ' + row.shippingDimensionsH[0].text }];
        delete row.shippingDimensionsL;
        delete row.shippingDimensionsW;
        delete row.shippingDimensionsH;
        row.shippingDimensions[0].text = row.shippingDimensions[0].text.replace(/,/g, '.');
      }
    }
  }
  return cleanUp(data);
};

module.exports = { transform };