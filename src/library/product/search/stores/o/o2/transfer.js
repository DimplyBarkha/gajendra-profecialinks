/**
 *
 * @param {ImportIO.Group[]} data
 * @returns {ImportIO.Group[]}
 */
const transform = (data) => {
  for (const { group } of data) {
    var rankIndex = 1;
    for (const row of group) {
      if (row.rankOrganic) {
        row.rankOrganic[0].text = rankIndex;
        row.rank[0].text = rankIndex;
      }
      rankIndex++;
    }
  }
  return data;
};

module.exports = { transform };