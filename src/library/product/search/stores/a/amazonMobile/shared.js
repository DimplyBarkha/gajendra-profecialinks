/**
*
* @param {ImportIO.Group[]} data
* @returns {ImportIO.Group[]}
*/
const transform = (data) => {
  for (const { group } of data) {
    for (const row of group) {
      if (row.productUrl) {
        row.productUrl.forEach(productUrl => {
          productUrl.text = `https://amazon.de${productUrl.text}`;
        });
      }
    }
  }
  return data;
};
module.exports = { transform };
