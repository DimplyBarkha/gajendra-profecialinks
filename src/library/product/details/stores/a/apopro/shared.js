
/**
 *
 * @param {ImportIO.Group[]} data
 * @returns {ImportIO.Group[]}
 */
const transform = (data) => {
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
        if (row.description) {
            let text = '';
            row.description.forEach(item => {
              text = row.description.map(elm => elm.text).join(' ').replace(/●/g, '||');
            });
            row.description = [{ text }];
          }
      }
    }
    return data;
  };
  
  module.exports = { transform };
  