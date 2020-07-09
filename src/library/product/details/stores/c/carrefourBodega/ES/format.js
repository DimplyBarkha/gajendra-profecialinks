
/**
 *
 * @param {ImportIO.Group[]} data
 * @returns {ImportIO.Group[]}
 */
const transform = (data) => {
  for (const { group } of data) {
    for (const row of group) {
      if (row.nameExtended) {
        let text = [];
        row.nameExtended.forEach(item => {
          text.push(`${item.text}`);
        });
        text = text.reverse();
        const value = text.join(' ');
        row.nameExtended = [
          {
            text: (value.trim()),
          },
        ];
      }
      if (row.listPrice) {
        row.listPrice.forEach(item => {
          item.text = item.text.replace(/,/g, '.');
        });
      }
      if (row.price) {
        row.price.forEach(item => {
          item.text = item.text.replace(/,/g, '.');
        });
      }
      if (row.description) {
        row.description.forEach(item => {
          item.text = item.text.replace(/\n/g, '').replace(/\s{2,}/g, ' ');
        });
      }
      if (row.directions) {
        row.directions.forEach(item => {
          item.text = (item.text.indexOf('Sugerencia...') !== -1) ? item.text.replace(/\n/g, '').replace(/.*Sugerencia\.\.\.(.*)/gm, '$1').replace(/\s{2,}/g, ' ') : '';
        });
      }
      if (row.sku) {
        row.sku.forEach(item => {
          item.text = item.text.replace(/.*R-(.*)b\/p/, '$1');
        });
      }
      if (row.variantId) {
        row.variantId.forEach(item => {
          item.text = item.text.replace(/.*R-(.*)b\/p/, '$1');
        });
      }
      if (row.category) {
        row.category.forEach((item, index, array) => {
          if (index === 0) {
            item.text = item.text.replace(/\s/g, '-');
          }
          item.text = item.text.toLowerCase();
        });
        row.category = row.category.slice(0, row.category.length - 1);
      }
    }
  }
  return data;
};

module.exports = { transform };
