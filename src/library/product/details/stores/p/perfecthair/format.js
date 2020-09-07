/**
 *
 * @param {ImportIO.Group[]} data
 * @returns {ImportIO.Group[]}
 */
const transform = (data) => {
  for (const { group } of data) {
    for (const row of group) {
      if (row.description) {
        row.description.map(item => {
          item.text = item.text.replace(/\n/gm, " | ");
        });
      }
      if (row.productOtherInformation) {
        row.productOtherInformation.map(item => {
          item.text = item.text.replace(/\n /, " ").replace(/\n /gm, "");
        });
      }
      if (row.specifications) {
        row.specifications = [{ text: row.specifications.map(item => item.text.replace(/\n/, "").replace(/\n /gm, "")).join(" | ") }]
      }
    }
  }
  return data;
};

module.exports = { transform };