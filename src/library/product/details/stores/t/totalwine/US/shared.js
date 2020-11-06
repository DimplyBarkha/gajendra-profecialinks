/**
 *
 * @param {ImportIO.Group[]} data
 * @returns {ImportIO.Group[]}
 */
const transform = (data) => {
  for (const { group } of data) {
    for (const row of group) {
      if (row.variantAsins) {
        let text = '';
        row.variantAsins.forEach(item => {
          text += `${item.text} | `;
        });
        row.variantAsins = [
          {
            text: text.slice(0, -3),
          },
        ];
      }
      if (row.ingredientsList) {
        let text = '';
        row.ingredientsList.forEach(item => {
          text += `${item.text} `;
        });
        row.ingredientsList = [
          {
            text: text.trim(),
          },
        ];
      }

      if (row.packSize) {
        if (row.packSize[0].text.match(/(\d+)\(/)) {
          row.packSize = [
            {
              text: row.packSize[0].text.match(/(\d+)\(/)[1],
            },
          ];
        } else if (row.packSize[0].text.match(/(\d+)pk/)) {
          row.packSize = [
            {
              text: row.packSize[0].text.match(/(\d+)pk/)[1],
            },
          ];
        } else if (row.packSize[0].text.match(/(\d+)-/)) {
          row.packSize = [
            {
              text: row.packSize[0].text.match(/(\d+)-/)[1],
            },
          ];
        } else {
          row.packSize = [
            {
              text: '',
            },
          ];
        }
      }
    }
  }
  return data;
};

module.exports = { transform };
