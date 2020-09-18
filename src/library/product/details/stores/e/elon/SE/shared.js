
/**
 *
 * @param {ImportIO.Group[]} data
 * @returns {ImportIO.Group[]}
 */
const transform = (data) => {
  for (const { group } of data) {
    for (const row of group) {
      if (row.description) {
        let text = '';
        row.description.forEach(item => {
          text += `${item.text} `;
        });
        row.description = [
          {
            text: text.trim(),
          },
        ];
      }

      if (row.specifications) {
        let text = '';
        for (let i = 0; i < row.specifications.length; i++) {
          text += `${row.specificationsLabel[i].text} : ${row.specifications[i].text} || `;
        }
        row.specifications = [
          {
            text: text.slice(0, -4),
          },
        ];
        delete row.specificationsLabel;
      }
    }
  }
  return data;
};

module.exports = { transform };
