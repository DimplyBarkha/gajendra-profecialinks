/**
 *
 * @param {ImportIO.Group[]} data
 * @returns {ImportIO.Group[]}
 */
const transform = (data) => {
  for (const { group } of data) {
    for (const row of group) {
      if (row.description) {
        row.description.forEach(item => {
          item.text = item.text.replace(/(\s?\n)+/g, ' || ').trim();
        });
      }
      if (row.specifications) {
        row.specifications.forEach(item => {
          item.text = item.text.replace(/(\s?\n)+/g, ' || ').trim();
        });
      }
      // if (row.shippingDimensions) {
      //   row.shippingDimensions.forEach(item => {
      //     // item.text = item.text.replace('X X', '').trim();
      //   });
      // }
    }
  }
  return data;
};
module.exports = { transform };
