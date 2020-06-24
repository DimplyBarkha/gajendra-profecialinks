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
          console.log('productUrl ---> ', productUrl);
          if (!productUrl.text.includes('https://www.feelunique.com')) {
            productUrl.text = `https://www.feelunique.com${productUrl.text}`;
          }
        });
      }
    }
  }
  return data;
};
module.exports = { transform };
