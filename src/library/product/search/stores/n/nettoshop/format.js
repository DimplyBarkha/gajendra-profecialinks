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
      if (row.manufacturer) {
        row.manufacturer.forEach(item => {
          const text = item.text;
          if (text.indexOf(' ') > 0) {
            item.text = text.substring(0, text.indexOf(' '));
          }
        });
      }

      if (row.id) {
        row.id.forEach(item => {
          const text = item.text;
          if (text.indexOf('/') > -1) {
            item.text = text.substring(text.lastIndexOf('/') + 1);
          }
        });
      }
      if (row.aggregateRating) {
        row.aggregateRating.forEach(item => {
          const text = item.text;
          if (text.indexOf('/') > -1) {
            item.text = text.substring(0, text.lastIndexOf('/')).replace(/\./g, ',');
          }
        });
      }
      if (row.aggregateRating2) {
        row.aggregateRating2.forEach(item => {
          const text = item.text;
          if (text.indexOf('/') > -1) {
            item.text = text.substring(0, text.lastIndexOf('/'));
          }
        });
      }

      rankCounter += 1;
      row.rank = [{ text: rankCounter }];
      row.rankOrganic = [{ text: rankCounter }];
      context.setState({ rankCounter });
    }
  }
  return data;
};

module.exports = { transform };
