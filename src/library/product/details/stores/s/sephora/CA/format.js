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
      .replace(/[\uD800-\uDBFF][\uDC00-\uDFFF]/g, ' ')
      .trim();
    data.forEach(obj => obj.group.forEach(row => Object.keys(row).forEach(header => row[header].forEach(el => {
      el.text = clean(el.text);
    }))));
    return data;
  };
  for (const { group } of data) {
    let tmpSku = '';
    for (const row of group) {
      let fstImg = ''; let fstImgAlt = ''; const restImg = []; let skuArr = []; let skuStr = '';
      if (row.variantId) {
        row.variantId.forEach(item => {
          if (item.text.indexOf('ITEM') == -1) {

          } else {
            tmpSku = item.text.replace('ITEM ', '');
          }
        });
        row.variantId = [{ text: tmpSku }];
        row.firstVariant = [{ text: tmpSku }];
      }
      if (row.image) {
        row.image.forEach(item => {
          if (fstImg == '') {
            skuArr = item.text.replace('/productimages/sku/s', '').split('-main-zoom.');
            if (skuArr.length > 1) {
              skuStr = skuArr[0];
            }
            fstImg = 'https://www.sephora.com' + item.text.replace('?imwidth=60', '?imwidth=1000');
          }
        });
        row.image = [{ text: fstImg }];
        if (skuStr != '') {
          row.sku = [{ text: skuStr }];
        }
      }
      if (row.imageAlt) {
        row.imageAlt.forEach(item => {
          if (fstImgAlt == '') { fstImgAlt = item.text; }
        });
        row.imageAlt = [{ text: fstImgAlt }];
      }
      if (row.alternateImages) {
        row.alternateImages.forEach(item => {
          item.text = 'https://www.sephora.com' + item.text.replace('?imwidth=60', '?imwidth=1000');
        });
      }
      let brnd = '';
      if (row.brandText) {
        row.brandText.forEach(item => {
          brnd = item.text;
        });
      }
      if (row.nameExtended) {
        row.nameExtended.forEach(item => {
          if (brnd != '') {
            item.text = brnd + ' - ' + item.text;
          }
        });
      }
      if (row.quantity) {
        let rowDelete;
        row.quantity.forEach(item => {
          if (item.text.indexOf('SIZE') == -1) {
            rowDelete = true;
          } else {
            item.text = item.text.replace('SIZE ', '');
            rowDelete = false;
          }
        });
        if (rowDelete == true) {
          delete row.quantity;
        }
      }
      if (row.ratingCount) {
        row.ratingCount.forEach(item => {
          item.text = item.text.replace(' reviews', '');
        });
      }
      if (row.aggregateRating) {
        row.aggregateRating.forEach(item => {
          item.text = item.text.replace(' stars', '');
        });
      }
      if (row.directions) {
        let directionsStr = '';
        row.directions.forEach(item => {
          if (directionsStr = '') {
            directionsStr = item.text;
          } else {
            directionsStr = directionsStr + ' ' + item.text;
          }
        });
        row.directions = [{ text: directionsStr }];
      }
      if (row.directions) {
        let directionsStr = '';
        row.directions.forEach(item => {
          if (directionsStr = '') {
            directionsStr = item.text;
          } else {
            directionsStr = directionsStr + ' ' + item.text;
          }
        });
        row.directions = [{ text: directionsStr }];
      }
      if (row.ingredientsList) {
        let no2 = 0; const inf = []; let tmp = '';
        row.ingredientsList.forEach(item => {
          if (no2 == 0) {
            tmp = item.text;
            no2 = 1;
          } else if (no2 == 1) {
            tmp = tmp + ' : ' + item.text;
            inf.push(tmp);
            tmp = '';
            no2 = 0;
          }
        });
        row.ingredientsList = [{ text: inf.join(' | ') }];
      }
      if (row.variantInformation) {
        row.variantInformation.forEach(item => {
          item.text = item.text.replace(' - Selected', '');
        });
      }
      if (row.variants) {
        const inf = [];
        row.variants.forEach(item => {
          const tmpArr = item.text.replace('/productimages/sku/s', '').split('+');
          inf.push(tmpArr[0]);
        });
        row.variants = [{ text: inf.join(' | ') }];
      }
    }
  }
  return cleanUp(data);
};
module.exports = { transform };
