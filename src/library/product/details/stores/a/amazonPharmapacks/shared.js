
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
      if (row.otherSellersShipping2) {
        let text = '';
        for (const item of row.otherSellersShipping2) {
          if (item.text.toLowerCase().includes('free')) {
            text = '0.00';
            item.text = text;
          } else if (item.text.match(/\$([^\s]+)/)) {
            item.text = item.text.match(/\$([^\s]+)/)[1];
          }
        }
      }
    }
  }
  return data;
};

module.exports = { amazonTransform };
