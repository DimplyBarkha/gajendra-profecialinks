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
          const regex = /\n/g;
          item.text = item.text.replace(regex, ' ');
        });
        row.specifications.forEach(item => {
          const regex = /\n/g;
          item.text = item.text.replace(regex, '|');
        });
        row.shippingInfo.forEach(item => {
          const regex = /\n+/g;
          item.text = item.text.replace(regex, ' ');
        });
        console.log('row.variantCount :', row.variantCount);
        // row.variantCount.forEach(item => {
        //   item.text = '0';
        // });
      }
    }
  }
  return data;
};

module.exports = { transform };
