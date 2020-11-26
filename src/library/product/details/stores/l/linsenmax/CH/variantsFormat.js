/**
 *
 * @param {ImportIO.Group[]} data
 * @returns {ImportIO.Group[]}
 */
const transform = (data) => {
  for (const { group } of data) {
    for (const row of group) {
      if (row.variant) {
        row.variant.forEach(item => {
          item.text = item.text.trim();
        });
      }
    }
  }
  return data;
};

module.exports = { transform };
