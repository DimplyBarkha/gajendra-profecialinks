/**
 *
 * @param {ImportIO.Group[]} data
 * @returns {ImportIO.Group[]}
 */
const transform = (data) => {
  let rank = 1;
  for (const { group } of data) {
    for (const row of group) {
      if (row.productUrl) {
        row.productUrl.forEach(productUrl => {
          if (!productUrl.text.includes('https://www.feelunique.com')) {
            productUrl.text = `https://www.feelunique.com${productUrl.text}`;
          }
        });
      }

      if (row.thumbnail) {
        row.thumbnail.forEach(thumbnail => {
          if (!thumbnail.text.includes('https')) {
            thumbnail.text = `https:${thumbnail.text}`;
          }
        });
      }

      if (row.rankOrganic) {
        row.rankOrganic.forEach(rankOrganic => {
          rankOrganic.text = rank;
          rank++;
        });
      }
    }
  }
  return data;
};
module.exports = { transform };
