/**
 *
 * @param {ImportIO.Group[]} data
 * @returns {ImportIO.Group[]}
 */
const transform = (data) => {
  for (const { group } of data) {
    for (const row of group) {
      if (row.productOtherInformation) {
        row.productOtherInformation.map(item => {
          item.text = item.text.replace(/\n /, " ").replace(/\n /gm, "");
        });
      }
    }
  }
  return data;
};

module.exports = { transform };