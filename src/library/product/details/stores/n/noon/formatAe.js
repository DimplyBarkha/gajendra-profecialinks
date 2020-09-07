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
            item.text = item.text.replace(/(\s*\n\s*)+/g, ' || ').trim();
          });
        }
        if (row.category) {
          let text = '';
          row.category.forEach(item => {
            text += `${item.text.replace(/\//g, '|')}  `;
          });
          row.category = [
            {
              text: text.slice(5, -1),
            },
          ];
        }
        if (row.specifications) {
          row.specifications.forEach(item => {
            item.text = item.text.replace(/(\s*\n\s*)+/g, ' || ').trim();
          });
        }
        
      }
    }
    return data;
  };
  
  module.exports = { transform };