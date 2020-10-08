
/**
 *
 * @param {ImportIO.Group[]} data
 * @returns {ImportIO.Group[]}
 */
const transform = (data) => {
  for (const { group } of data) {
    for (const row of group) {
      if (row.lbb) {
        row.lbb.forEach(item => {
          if (item.text.toLowerCase().includes('walmart')) {
            item.text = 'No';
          } else {
            item.text = 'Yes';
          }
        });
      }
      if (row.price) {
        row.price.forEach((item) => {
          item.text = item.text.replace(/,/g, '').replace(/\./, ',');
        });
      }
      if (row.lbbPrice) {
        row.lbbPrice.forEach((item) => {
          item.text = item.text.replace(/,/g, '').replace(/\./, ',');
        });
      }
      if (row.listPrice) {
        row.listPrice.forEach((item) => {
          item.text = item.text.replace(/,/g, '').replace(/\./, ',');
        });
      }
      if (row.lbbPrice) {
        row.lbbPrice.forEach(item => {
          if (row.lbb && row.lbb[0].text === 'No') {
            item.text = '';
          }
        });
      }
      if (row.specifications) {
        let text = '';
        row.specifications.forEach((item, index) => {
          if (index % 2 === 0) {
            text += item.text.trim() + ' : ';
          } else {
            text += item.text.trim() + ' || ';
          }
        });
        row.specifications = [
          {
            text: text.slice(0, -4),
          },
        ];
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
