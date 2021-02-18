
/**
 *
 * @param {ImportIO.Group[]} data
 * @returns {ImportIO.Group[]}
 */
const transform = (data) => {
  for (const { group } of data) {
    for (const row of group) {
      if (row.reviewRating) {
        row.reviewRating.forEach(item => {
          item.text = parseInt(item.text, 10) / 20;
        });
      }
    }
  }
  return data;
};

module.exports = { transform };
