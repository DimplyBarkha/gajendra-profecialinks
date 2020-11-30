/**
 *
 * @param {ImportIO.Group[]} data
 * @returns {ImportIO.Group[]}
 */
const cleanUp = (data, context) => {
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
      if (row.caloriesPerServing) {
        let text = '';
        row.caloriesPerServing.forEach(item => {
          text += `${item.text} | `;
        });
        row.caloriesPerServing = [
          {
            text: text.slice(0, -3),
          },
        ];
      }
      if (row.price) {
        const newPrice = row.price.map(item => {
          return {
            text: `${item.text.replace('.', ',')}`,
          };
        });
        row.price = newPrice;
      }
      if (row.brand1) {
        if (row.brand1[0].text.match(/(.*)"marque":"(.*)","prix":(.*)/)) {
          row.brandText = [{ text: row.brand1[0].text.replace(/(.*)"marque":"(.*)","prix":(.*)/, '$2') }];
        }
      }
    }
  }
  data.forEach(obj => obj.group.forEach(row => Object.keys(row).forEach(header => row[header].forEach(el => {
    el.text = clean(el.text);
  }))));
  return data;
};

module.exports = { cleanUp };
