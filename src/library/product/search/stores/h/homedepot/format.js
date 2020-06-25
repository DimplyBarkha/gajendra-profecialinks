
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
          productUrl.text = `https://www.homedepot.com${productUrl.text}`;
        });
      }
      if (row.id) {
        row.id.forEach(id => {
          if (id.text.includes('/')) {
            id.text = id.text.replace(/.*\/(.*)$/, '$1');
          }
        });
      }
      if (row.aggregateRating2) {
        row.aggregateRating2.forEach(item => {
          if (item.text.includes('width')) {
            const starWidth = item.text.replace(/.*?(\d+\.?\d*).*/, '$1');
            if (starWidth) {
              const ratings = ((starWidth * 5) / 100).toFixed(1);
              item.text = ratings;
            }
          }
        });
      }
    }
  }
  return data;
};

module.exports = { transform };
