/**
 *
 * @param {ImportIO.Group[]} data
 * @returns {ImportIO.Group[]}
 */
const transform = (data, context) => {
  for (const { group } of data) {
    for (const row of group) {
      row.variantCount = [{ text: '0' }];
      if (row.availabilityText) {
        row.availabilityText = [{ text: 'In Stock' }];
      } else {
        row.availabilityText = [{ text: 'Out of Stock' }];
      }
      if (row.description) {
        let text = '';
        row.description.forEach(item => {
          text = text + (text ? ' | ' : '') + item.text;
        });
        row.description = [{ text }];
      }
      if (row.price) {
        row.price.forEach(item => {
          item.text = item.text.replace('.', ',');
        });
      }
      if (row.allergyAdvice) {
        let text = '';
        row.allergyAdvice.forEach(item => {
          text = text + (text ? ' ' : '') + item.text;
        });
        row.allergyAdvice = [{ text }];
      }
      if (row.storage) {
        let text = '';
        row.storage.forEach(item => {
          text = text + (text ? ' | ' : '') + item.text;
        });
        row.storage = [{ text }];
      }
      if (row.promotion) {
        let text = '';
        row.promotion.forEach(item => {
          text = text + (text ? ' ' : '') + item.text;
        });
        row.promotion = [{ text }];
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
