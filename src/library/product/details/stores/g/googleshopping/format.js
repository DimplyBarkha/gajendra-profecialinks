/**
 *
 * @param {ImportIO.Group[]} data
 * @returns {ImportIO.Group[]}
 */
const transform = (data) => {
  for (const { group } of data) {
    for (const row of group) {
      if (row.description) {
        row.description.forEach(item => {
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
      if (row.variants) {
        row.shippingDimensions.forEach(item => {
          item.text = item.text.split(',').join(' | ');
        });
      }
      if (row.gtin) {
        row.gtin.forEach(item => {
          item.text = item.text.split(',')[0];
        });
      }
    }
  }
  return data;
};
module.exports = { transform };
