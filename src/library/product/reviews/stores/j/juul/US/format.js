
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
      if (row.sourceUrl) {
        row.sourceUrl.forEach(item => {
          if (item.text.includes('/pods/')) {
            if (row.flavour) {
              // nothing to do
            }
          } else {
            if (row.flavour) {
              row.flavour.forEach(item => {
                item.text = '';
              });
            }
          }
        });
      }
      if (row.productFamily) {
        row.productFamily.forEach(item => {
          if (item.text.includes('?')) {
            const split = item.text.split('?');
            item.text = `${split[0]}`;
          }
        });
      }
    }
  }
  return data;
};

module.exports = { transform };
