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
          if (item.text.endsWith("/")) {
            text += item.text.slice(0, -1)
          } else {
            text += item.text;
          }
        });
        row.caloriesPerServing = [{
          text: text.replace(/\n/g, '').replace('//','/').replace(/(.+)kJ(.+)kcal/g,'$1$2').replace(/\s{1,}/g, '').trim()
        }, ];
      }
      if (row.allergyAdvice) {
        let text = '';
        row.allergyAdvice.forEach(item => {
          text += item.text.replace(/\n/g, '');
        });
        row.allergyAdvice = [{
          text: text,
        }, ];
      }
      if (row.description) {
        let text = '';
        row.description.forEach(item => {
          text = row.description.map(elm => elm.text).join(' ').replace(/\s{2,}/g, ' ').replace(/\n\\n/g, '').trim();;
        });
        row.description = [{
          text: text,
        }, ];
      }
    }
  }
  return data;
};

module.exports = {
  transform
};