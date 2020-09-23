/**
 *
 * @param {ImportIO.Group[]} data
 * @returns {ImportIO.Group[]}
 */
const transform = (data) => {
  for (const { group } of data) {
    for (const row of group) {
      if (row.aggregateRating) {
        row.aggregateRating.map(item => {
          item.text = item.text.replace(".", ",");
        });
      }
      if (row.price) {
        row.price.map(item => {
          item.text = item.text.replace(/(\n|\s)/gm, "");
        });
      }
      if (row.promotion) {
        row.promotion.map(item => {
          item.text = item.text.replace(/\n \n /gm, "| ").replace(/\n/gm, "");
        });
      }
      if (row.specifications) {
        row.specifications = [{ text: row.specifications.map((item, index) => index % 2 === 0 ? item.text + " : " : item.text + " || ").join("") }]
      }
      if (row.warranty) {
        row.warranty = [{ text: row.warranty.map(item => item.text.replace(/\n \n /gm, "| ").replace(/\n/gm, "")).join(" | ") }]
      }
    }
  }
  return data;
};

module.exports = { transform };
