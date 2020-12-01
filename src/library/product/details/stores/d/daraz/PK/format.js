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
      if (row.brandText) {
        if (row.nameExtended) {
          row.nameExtended = [{ text: row.brandText[0].text + ' - ' + row.nameExtended[0].text }];
        }
      }
      if (row.specifications) {
        var arrSpec = [];
        row.specifications.forEach(item => {
          item.text = item.text.replace('\n', ': ');
          arrSpec.push(item.text);
        });
        row.specifications = [{ text: arrSpec.join(' || ') }];
      }
      if (row.descriptionBullets) {
        var bulletArr = [];
        row.descriptionBullets.forEach(item => {
          bulletArr.push(item.text);
        });
        row.additionalDescBulletInfo = [{ text: '|| ' + bulletArr.join(' || ') }];
        row.descriptionBullets = [{ text: row.descriptionBullets.length }];
      }
      if (row.variants) {
        var variations = [];
        var dataJsonObj = JSON.parse(row.variants[0].text);
        if (dataJsonObj) {
          dataJsonObj.forEach(variation => {
            if (variation.cartSkuId) {
              variations.push(variation.cartSkuId);
            }
          });
        }
        if (variations.length) {
          row.variantCount = [{ text: variations.length }];
          row.variants = [{ text: variations.join(' | ') }];
        } else {
          delete row.variants;
          row.variantCount = [{ text: 0 }];
        }
      }
    }
  }
  return cleanUp(data);
};
module.exports = { transform };
