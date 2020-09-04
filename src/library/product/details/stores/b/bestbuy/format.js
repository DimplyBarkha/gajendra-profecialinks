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
        if (row.warranty) {
            row.warranty = [{
                text: row.warranty.reduce((item, currItem) => item ? `${item} || ${currItem.text.replace(/(\s*\n\s*)+/, ': ')}` : currItem.text.replace(/(\s*\n\s*)+/, ': '), ''),
              }];
        }
        if (row.variants) {
          row.variantCount = [{
            text: row.variants.length + 1
          }]
          row.variants = [{
              text: row.variants.reduce((item, currItem) => item ? `${item} | ${currItem.text}` : currItem.text, '')+ ' | ' + row.sku[0].text,
          }];
        } else {
          row.variantCount = [{
            text: 1
          }]
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