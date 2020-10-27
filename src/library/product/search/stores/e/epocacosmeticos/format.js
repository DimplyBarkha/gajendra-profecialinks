/**
*
* @param {ImportIO.Group[]} data
* @returns {ImportIO.Group[]}
*/
const transform = (data, context) => {
  const state = context.getState();
  let rankCounter = state.rankCounter || 0;
  for (const { group } of data) {
    for (const row of group) {
      rankCounter = rankCounter + 1;
      row.rank = [{ text: rankCounter, xpath: row.name[0].xpath }];
      row.rankOrganic = [{ text: rankCounter, xpath: row.name[0].xpath }];
      context.setState({ rankCounter });
    }
  }
  return data;
};

module.exports = { transform };
