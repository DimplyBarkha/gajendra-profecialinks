/**
 *
 * @param {ImportIO.Group[]} data
 * @returns {ImportIO.Group[]}
 */
const transform = (data) => {
  for (const { group } of data) {
    var rankIndex = 1;
    for (const row of group) {
      row.rankOrganic = [{ text: rankIndex, xpath: '' }];
      row.rank = [{ text: rankIndex, xpath: '' }];
      rankIndex++;
    }
  }
  return data;
};

module.exports = { transform };