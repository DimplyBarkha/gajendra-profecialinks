
/**
*
* @param {ImportIO.Group[]} data
* @returns {ImportIO.Group[]}
*/
const transform = (data) => {
  for (const { group } of data) {
    for (const row of group) {
      if (row.availabilityText) {
        row.availabilityText.forEach(item => {
          if (item.text === 'InStock') {
            item.text = 'In Stock';
          } else {
            item.text = 'Out Of Stock';
          }
        });
      }

      if (row.aggregateRating) {
        row.aggregateRating.forEach(item => {
          const val = item.raw.replace('.', ',');
          item.text = val;
        });
      }

      if (row.additionalDescBulletInfo) {
        let text = '';
        row.additionalDescBulletInfo.forEach(item => {
          text = text + (text ? ' || ' : '') + item.text;
        });
        text = '|| ' + text;
        row.additionalDescBulletInfo = [{ text }];
      }

      if (row.description || row.additionalDescBulletInfo) {
        let text = '';
        if (row.description) {
          row.description.forEach(item => {
            text = text + (text ? ' ' : '') + item.text;
          });
        }
        let text2 = '';
        if (row.additionalDescBulletInfo) {
          row.additionalDescBulletInfo.forEach(item => {
            text2 = text2 + (text2 ? ' || ' : '') + item.text;
          });
          if (text !== '') {
            text = text2 + ' | ' + text;
          } else {
            text = text2;
          }
        }
        row.description = [{ text }];
      }
    }
  }

  // Clean up data
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
