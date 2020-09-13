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
      row.rankOrganic = [{ text: rankCounter }];
      context.setState({ rankCounter });
      // Price
      if (row.price && row.price[0]) {
        row.price[0].text = row.price[0].text.replace(/€/g, ',');
      }
      // Aggregate Rating
      if (row.aggregateRating && row.aggregateRating[0]) {
        row.aggregateRating[0].text = row.aggregateRating[0].text.replace(/\./g, ',');
      }
    }
  }
  return data;
};

module.exports = { transform };
