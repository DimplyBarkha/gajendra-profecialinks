/**
 *
 * @param {ImportIO.Group[]} data
 * @returns {ImportIO.Group[]}
 */
const transform = (data, context) => {
  for (const { group } of data) {
    for (const row of group) {
      if (row.specifications) {
        row.specifications = [{
          text: row.specifications.reduce((item, currItem) => item ? `${item} || ${currItem.text.replace(/(\s*\n\s*)+/, ': ')}` : currItem.text.replace(/(\s*\n\s*)+/, ': '), ''),
        }];
      }
      if (row.description) {
        let text = '';
        row.description.forEach(item => {
          text += `${item.text} `;
        });
        row.description =
          [{
            text: text.slice(0, -1),
          }];
      }
      if (row.additionalDescBulletInfo) {
        row.descriptionBullets = [{
          text: row.additionalDescBulletInfo.length,
        }];
      }
      if (row.alternateImages2) {
        row.alternateImages = [...row.alternateImages2];
      }
      if(row.secondaryImageTotal && row.alternateImages){
        row.secondaryImageTotal[0].text = row.alternateImages.length;
      }
      if (row.warranty) {
        row.warranty = [{
          text: row.warranty.reduce((item, currItem) => item ? `${item} || ${currItem.text.replace(/(\s*\n\s*)+/, ': ')}` : currItem.text.replace(/(\s*\n\s*)+/, ': '), ''),
        }];
      }
      if (row.variants) {
       
        row.variantCount = [{
          text: row.variants.length + 1
        }]
        if (row.firstVariant[0].text.includes('button')) {
          row.firstVariant = [{
            text: row.variantId[0].text,
          }];
        } else {
          row.firstVariant = [{
            text: row.variants[0].text,
          }];
        }
        row.variants = [{
          text: row.variants.reduce((item, currItem) => item ? `${item} | ${currItem.text}` : currItem.text, '') + ' | ' + row.sku[0].text,
        }];
       
      }
      // console.log("row.variantInformation:: ",row.variantInformation);
      if(row.variantInformation){
        row.variantInformation = [{
          text: row.variantInformation.reduce((item, currItem) => item ? `${item} | ${currItem.text.replace(/\.$/, '')}` : currItem.text.replace(/\.$/, ''), ''),
        }];
      }
      if (row.manufacturerDescription) {
        row.manufacturerDescription[0].text = row.manufacturerDescription[0].text.replace(/(\s*\n\s*)+/g, ' ');
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