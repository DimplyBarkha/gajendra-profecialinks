
/**
 *
 * @param {ImportIO.Group[]} data
 * @returns {ImportIO.Group[]}
 */
const transform = (data) => {
  for (const { group } of data) {
    for (const row of group) {
      if (row.gtin) {
        row.gtin.forEach(item => {
          let data = JSON.parse(item.text);
          data = (data.ecommerce && data.ecommerce.add && data.ecommerce.add.products && data.ecommerce.add.products[0].id && JSON.parse(data.ecommerce.add.products[0].id)[0]) ? JSON.parse(data.ecommerce.add.products[0].id)[0] : '';
          item.text = data;
        });
      }
      if (row.nameExtended) {
        row.nameExtended.forEach(item => {
          item.text = item.text.replace(/\n/g, '').replace(/\s{2,}/g, ' ');
        });
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
          item.text = item.text.replace(/\n/g, '').replace(/\s{2,}/g, ' ');
        });
      }
    }
  }
  return data;
};

module.exports = { transform };
