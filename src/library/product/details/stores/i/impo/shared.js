/**
 *
 * @param {ImportIO.Group[]} data
 * @returns {ImportIO.Group[]}
 */
const transform = (data) => {
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
      if (row.description) {
        row.description.forEach(item => {
          item.text = item.text.replace(/(\s?\n)+/g, ' || ').trim();
        });
      }
      if (row.shippingInfo) {
        row.shippingInfo.forEach(item => {
          item.text = item.text.replace(/(\s?\n)+/g, ' || ').trim();
        });
      }
      if (row.specifications) {
        const specs = [];
        let txt = '';
        row.specifications.forEach(item => {
          specs[0] = item;
          if (txt.length > 0) {
            txt = txt + ' || ';
          }
          txt = txt + item.text;
          specs[0].text = txt;
          // item.text = item.text.replace(/(\s?\n)+/g, ' || ').trim();
        });
        row.specifications = specs;
      }
      if (row.price) {
        row.price = [
          {
            text: row.price[0].text.replace(',', '.'),
          },
        ];
      }
      if (row.listPrice) {
        row.listPrice = [
          {
            text: row.listPrice[0].text.replace(',', '.'),
          },
        ];
      }
      Object.keys(row).forEach(header => row[header].forEach(el => {
        el.text = clean(el.text);
      }));
    }
  }
  return data;
};

module.exports = { transform };
