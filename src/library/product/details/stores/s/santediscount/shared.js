/**
*
* @param {ImportIO.Group[]} data
* @returns {ImportIO.Group[]}
*/

const transform = (data) => {
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

  for (const { group } of data) {
    for (const row of group) {
      if (row.warnings) {
        let text = '';
        row.warnings.forEach(item => {
          text = text + (text ? ' ' : '') + item.text;
        });
        row.warnings = [{ text }];
      }

      if (row.subCategory) {
        row.subCategory[0].text = row.subCategory[0].text.split('/').join('>');
      }

      if (row.listPrice) {
        row.listPrice[0].text = row.listPrice[0].text.split(',').join('.');
      }

      if (row.description) {
        row.description[0].text = clean(row.description[0].text).replace(/(.*?)Description\s:\s(.*?)Indications\s:\s(.*)/g, '$2');
      }
    }
  }

  data.forEach(obj => obj.group.forEach(row => Object.keys(row).forEach(header => row[header].forEach(el => {
    el.text = clean(el.text);
  }))));

  return data;
};

module.exports = { transform };
