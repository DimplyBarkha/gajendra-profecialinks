
/**
 *
 * @param {ImportIO.Group[]} data
 * @returns {ImportIO.Group[]}
 */
const transform = (data) => {
  for (const { group } of data) {
    for (const row of group) {
      if (row.caloriesPerServing) {
        let text = '';
        row.caloriesPerServing.forEach(item => {
          text += item.text.replace(/(.*kJ)(.*)/g, '$1/$2');
        });
        row.caloriesPerServing = [
          {
            text: text,
          },
        ];
      }
      if (row.allergyAdvice) {
        let text = '';
        row.allergyAdvice.forEach(item => {
          text += item.text.replace(/\n/g, '');
        });
        row.allergyAdvice = [
          {
            text: text,
          },
        ];
      }
      if (row.description) {
        let text = '';
        row.description.forEach(item => {
          text = row.description.map(elm => elm.text).join(' ');
        });
        row.description = [
          {
            text: text,
          },
        ];
      }
      if (row.promotion) {
        let text = '';
        row.promotion.forEach(item => {
          text += `${item.text.replace(/\n/g, '')} `;
        });
        row.promotion = [
          {
            text: text.trim(),
          },
        ];
      }
    }
  }
  return data;
};

module.exports = { transform };
