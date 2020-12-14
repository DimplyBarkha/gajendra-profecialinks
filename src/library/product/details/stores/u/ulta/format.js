
/**
 *
 * @param {ImportIO.Group[]} data
 * @returns {ImportIO.Group[]}
 */
const transform = (data) => {
  for (const { group } of data) {
    for (const row of group) {
      if (row.variants) {
        row.variantCount = [{
          text: row.variants.length,
        }];
        row.variantInformation = [{
          text: row.variantInformation.reduce((item, currentitem) => {
            return `${item} | ${currentitem.text}`;
          }, '').slice(3),
        }];
        row.variants = [{
          text: row.variants.reduce((item, currentitem) => {
            return `${item} | ${currentitem.text}`;
          }, '').slice(3),
        }];
      }
      if (row.specifications) {
        row.specifications = [{
          text: row.specifications.reduce((item, currentitem) => {
            return `${item} || ${currentitem.text}`;
          }, '').slice(4),
        }];
      }
      if (row.additionalDescBulletInfo) {
        row.descriptionBullets = [{
          text: row.additionalDescBulletInfo.length,
        }];
      }
      if (row.quantity) {
        row.quantity.forEach(item => {
          item.text = item.text.slice(5);
        });
      }
      if (row.description) {
        let text = '';
        if (row.description[0].text.includes('Key Benefits')) {
          text = row.description[0].text.split('Key Benefits');
          text = text[0].replace(/(\s*\n\s*)+/g, ' ') + 'Key Benefits' + text[1].replace(/(\s*\n\s*)+/g, ' || ');
        } else {
          text = row.description[0].text.replace(/(\s*\n\s*)+/g, ' ');
        }
        row.description = [{
          text: text,
        }];
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
