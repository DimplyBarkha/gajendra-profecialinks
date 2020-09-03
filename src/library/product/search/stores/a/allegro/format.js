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
          return item.text;
        });
        row.rank = [{ text: parseInt(rankArray[0]) + 1, xpath: row.rank[0].xpath }];
      }
      if (row.rankOrganic) {
        const rankArray = row.rankOrganic.map((item) => {
          return item.text;
        });
        row.rank = [{ text: parseInt(rankArray[0]) + 1, xpath: row.rankOrganic[0].xpath }];
      }
    }
  }

  return data;
};

module.exports = { transform };
