
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
              }  `;
          });
          row.thumbnail = [
            {
              text: text.slice(),
            },
          ];
        }
        if (row.productUrl) {
          row.productUrl.forEach(item => {
            item.text = "https://www.trademe.co.nz" + item.text;
          });
        }
        if (row.Id) {
          row.Id.forEach(item => {
              item.text = item.text.replace(/\?.*$/g, '').trim();
              item.text = item.text.replace(/\D/g, ' ').trim();
          });
      }
 
         
          
         
      }
      
    }
    return data;
  };
  
  module.exports = { transform };
  