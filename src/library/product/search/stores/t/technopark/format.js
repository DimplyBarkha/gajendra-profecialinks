/**
 *
 * @param {ImportIO.Group[]} data
 * @returns {ImportIO.Group[]}
 */
const transform = (data) => {
  let rankCounter = 0;
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
      rankCounter += 1;
      row.rank = [{ text: rankCounter }];
    }
  }
  return data;
};

module.exports = { transform };
