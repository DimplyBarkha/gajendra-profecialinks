/**
 *
 * @param {ImportIO.Group[]} data
 * @returns {ImportIO.Group[]}
 */
const transform = (data) => {
  // Default transform function
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

  for (const { group } of data) {
    for (const row of group) {
      if (row.flavour) {
        row.flavour.forEach(item => {
          if (item.text.includes('-')) {
            item.text = item.text.split('-');
            item.text = item.text[0];
          }
        });
      }
      if (row.productFamily) {
        row.productFamily.forEach(item => {
          item.text = item.text.replace('https://shop.njoy.com/', '').trim();
          var lastChar = item.text.slice(-1);
          if (lastChar === '/') {
            item.text = item.text.slice(0, -1);
          }
        });
      }
      if (row.productRange) {
        row.productRange.forEach(item => {
          const split1 = row.productFamily[0].text.split('/');
          item.text = `${split1[1]}`;
        });
      }
    }
  }
  return data;
};
module.exports = { transform };
