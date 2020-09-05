/**
 *
 * @param {ImportIO.Group[]} data
 * @returns {ImportIO.Group[]}
 */
const transform = (data) => {
  for (const { group } of data) {
    for (const row of group) {
      if (row.promotion) {
        row.promotion.map(item => {
          item.text = item.text.replace(/\n \n /gm, "| ").replace(/\n/gm, "");
        });
      }
      if (row.warranty) {
        row.warranty.map(item => {
          item.text = item.text.replace(/\n \n /gm, "| ").replace(/\n/gm, "");
        });
      }
    }
  }
  return data;
};

module.exports = { transform };
