
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
      if (row.price) {
        row.price[0].text = row.currencytoFetch ? row.currencytoFetch[0].text + row.price[0].text : '€' + row.price[0].text
      }
      if (row.aggregateRating2) {
        let aggregateRating = 0
        row.aggregateRating2.forEach(item => {
          aggregateRating += item.text.includes('off') ? 0 : item.text.includes('half-star') ? 0.5 :
            item.text.includes('icon-star') ? 1 : 0
        })
        row.aggregateRating2 = [{ text: aggregateRating }]
      }
      if (row.ratingCount && row.ratingCount[0].text === '#VALUE!') {
        row.ratingCount = [{ text: 0 }]
      }
      if (row.reviewCount && row.reviewCount[0].text === '#VALUE!') {
        row.reviewCount = [{ text: 0 }]
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
