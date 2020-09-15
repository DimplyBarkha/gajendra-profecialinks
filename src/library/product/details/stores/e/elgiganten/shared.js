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
            text += `${item.text.replace(/\n \n/g, ':')} || `;
          });
          row.description = [
            {
              text: text.slice(0, -4),
            },
          ];
        }
        if (row.manufacturerDescription) {
          let text = '';
          row.manufacturerDescription.forEach(item => {
            text += `${item.text.replace(/\n \n/g, ':')} || `;
          });
          row.manufacturerDescription = [
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
  