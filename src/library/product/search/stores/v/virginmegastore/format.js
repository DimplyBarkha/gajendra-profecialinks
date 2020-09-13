/**
 *
 * @param {ImportIO.Group[]} data
 * @returns {ImportIO.Group[]}
 */
const transform = (data) => {
  for (const { group } of data) {
    for (const row of group) {
      if (row.rank) {
        const rankArray = row.rank.map((item) => {
          return item.text + 1;
        });
        row.variants = [{ text: rankArray.join(), xpath: row.rank[0].xpath }];
      }
    }
  }

  return data;
};

module.exports = { transform };
