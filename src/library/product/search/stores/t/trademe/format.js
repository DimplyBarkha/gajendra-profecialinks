
/**
 *
 * @param {ImportIO.Group[]} data
 * @returns {ImportIO.Group[]}
 */
const transform = (data) => {
    for (const { group } of data) {
      for (const row of group) {
        if (row.thumbnail) {
          let text = '';
          row.thumbnail.forEach(item => {
            text += `${item.text
              .match(/\(([^)]+)\)/)[1]
              .replace(/\//g, '')}  `;
          });
          row.thumbnail = [
            {
              text: text.slice(),
            },
          ];
        }
         
         
          
         
      }
      
    }
    return data;
  };
  
  module.exports = { transform };
  