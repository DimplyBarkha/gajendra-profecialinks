
/**
 *
 * @param {ImportIO.Group[]} data
 * @returns {ImportIO.Group[]}
 */
const transform = (data) => {
  for (const { group } of data) {
    for (const row of group) {
      if (row.productFamily) {
        let text = '';
        row.productFamily.forEach(item => {
          text += `${item.text.replace(/\n/g, '')} | `;
        });
        row.productFamily = [
          {
            text: text.slice(0, -4),
          },
        ];
      }
    }
  }
  return data;
};

module.exports = { transform };
