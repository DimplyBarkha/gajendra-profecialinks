
/**
 *
 * @param {ImportIO.Group[]} data
 * @returns {ImportIO.Group[]}
 */
const transform = (data, context) => {
  const state = context.getState();
  let orgRankCounter = state.orgRankCounter || 0;
  let rankCounter = state.rankCounter || 0;
  for (const { group } of data) {
    for (const row of group) {
      if (row.aggregateRating2) {
        row.aggregateRating2.forEach(item => {
          item.text = item.value.toFixed(1)
          item.value = +item.value.toFixed(1)
        })
      }
      rankCounter += 1;
      if (!row.sponsored) {
        orgRankCounter += 1;
        row.rankOrganic = [{ text: orgRankCounter }];
      }
      row.rank = [{ text: rankCounter }];
    }
  }
  context.setState({ rankCounter });
  context.setState({ orgRankCounter });
  return data;
};

module.exports = { transform };
