
/**
 *
 * @param {ImportIO.Group[]} data
 * @returns {ImportIO.Group[]}
 */
const amazonTransform = (data) => {
  for (const { group } of data) {
    for (const row of group) {
      if (row.specifications) {
        let text = '';
        row.specifications.forEach(item => {
          text += `${item.text.replace(/\n \n/g, ':')} || `;
        });
        row.specifications = [
          {
            text: text.slice(0, -4),
          },
        ];
      }
      if (row.otherSellersShipping) {
        let text = '';
        row.otherSellersShipping.forEach(item => {
          console.log(item);
          if (item.text.toLowerCase().includes('free')) {
            text = '0.00';
            item.text = text;
          } else if (item.text.match(/([^\s]+)/g)) {
            item.text = item.text.match(/([^\s]+)/)[1];
          }
        });
      }
    }
  }
  return data;
};

module.exports = { amazonTransform };
