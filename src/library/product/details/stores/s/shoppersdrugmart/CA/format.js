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
      if (row.image) {
        row.image.forEach(item => {
          item.text = item.text.replace('/100/', '/800/');
        });
      }
      if (row.alternateImages) {
        row.alternateImages.forEach(item => {
          item.text = item.text.replace('/100/', '/800/');
        });
      }
      if (row.ratingCount) {
        row.ratingCount.forEach(item => {
          item.text = item.text.replace('Reviews', '');
          item.text = item.text.trim();
        });
      }
      if (row.quantity) {
        row.quantity.forEach(item => {
          item.text = item.text.replace('Size:', '');
          item.text = item.text.trim();
        });
      }
      if (row.availabilityText) {
        row.availabilityText.forEach(item => {
          if (item.text.indexOf('disable') < 0) {
            item.text = 'In Stock';
          } else {
            item.text = 'Out Of Stock';
          }
        });
      }
      if (row.nameExtended) {
        if (row.brandText) {
          row.nameExtended = [{ text: row.brandText[0].text + ' - ' + row.nameExtended[0].text }];
        }
      }
      // if (row.variantId) {
      //   row.variantId.forEach(item => {
      //     const variantIdVal = item.text.replace('var certona = ', '').slice(0, -1);
      //     const data = JSON.parse(variantIdVal);
      //     console.log('dataObjvariant :', data.itemid);
      //     if (data.hasOwnProperty('itemid')) {
      //       item.text = data.itemid;
      //     } else {
      //       item.text = '';
      //     }
      //   });
      // }
      if (row.sku && row.sku.length > 1) {
        row.sku = row.sku.splice(1, row.sku.length - 1);
      }
      if (row.variantId) {
        row.variantId.forEach(item => {
          const match = item.text.match(/\"itemid\"\s*:\s*\"(.+?)\"/);
          if (match) {
            item.text = match[1];
            item.text = item.text.replace('BB_', '');
          }
        });
        if (row.variantId.length > 1) {
          row.variantId = row.variantId.splice(0, 1);
        }
      }
      if (row.mainImg) {
        row.image = row.mainImg;
      }
      if (row.secondaryImages) {
        row.alternateImages = row.secondaryImages;
      }
      if (row.alternateImages) {
        row.secondaryImageTotal = [{ text: row.alternateImages.length }];
      } else {
        row.secondaryImageTotal = [{ text: 0 }];
      }
    }
  }
  return cleanUp(data);
};

module.exports = { transform };
