/**
*
* @param {ImportIO.Group[]} data
* @returns {ImportIO.Group[]}
*/
const transform = (data) => {
  for (const { group } of data) {
    for (const row of group) {
      if (row.price) {
        row.price.forEach(price => {
          price.text = price.text.replace('.', '').replace(',', '.').trim();
        });
      }
      if (row.lbbPrice) {
        row.lbbPrice.forEach(lbbPrice => {
          lbbPrice.text = lbbPrice.text.replace('.', '').replace(',', '.').trim();
        });
      }
    }
  }
  return data;
};
module.exports = { transform };
