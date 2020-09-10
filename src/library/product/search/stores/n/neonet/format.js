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
      if (row.aggregateRating) {
        row.aggregateRating.forEach(item => {
          const val = item.value;
          let newval = 0;
          if (val === 0) {
            newval = 0;
          } else if (val > 0 && val <= 20) {
            newval = 1;
          } else if (val > 20 && val <= 40) {
            newval = 2;
          } else if (val > 40 && val <= 60) {
            newval = 3;
          } else if (val > 60 && val <= 80) {
            newval = 4;
          } else if (val > 80 && val <= 100) {
            newval = 5;
          }
          item.value = newval;
          item.text = newval.toString();
        });
      }

      if (row.id) {
        row.id.forEach(item => {
          const text1 = item.text;
          const nTxt = text1.substring(text1.lastIndexOf('-') + 1, text1.indexOf('f1'));
          item.text = nTxt;
        });
      }

      if (row.price) {
        row.price.forEach(item => {
          item.text = item.text.replace('\nzł', 'zł').replace('\n', ',');
        });
      }
      rankCounter += 1;
      row.rank = [{ text: rankCounter }];
    }
  }
  context.setState({ rankCounter });
  return data;
};

module.exports = { transform };
