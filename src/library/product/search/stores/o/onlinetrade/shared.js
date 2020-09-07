/**
 *
 * @param {ImportIO.Group[]} data
 * @returns {ImportIO.Group[]}
 */
const transform = (data, context) => {
  let rankCounter = 0;

  for (const { group } of data) {
    for (const row of group) {
      rankCounter += 1;
      row.rank = [{ text: rankCounter }];
    }
  }
  return data;
};
module.exports = { transform };
