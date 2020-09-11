
/**
 *
 * @param {ImportIO.Group[]} data
 * @returns {ImportIO.Group[]}
 */
const transform = (data) => {
    for (const { group } of data) {
      for (const row of group) {
        if (row.descriptionBullets) {
          let text = '';
          row.descriptionBullets.forEach(item => {
            text += `${item.text.replace(/\n/g, '||')}  `;
          });
          row.descriptionBullets = [
            {
              text: text.slice(0, -4),
            },
          ];
        }

        if (row.category) {
          row.category.forEach(item => {
              item.text = item.text.replace(/\s\n\s\n\s/g, ' > ').trim();
          });
         }

         if (row.variants) {
          row.variants.forEach(item => {
              item.text = item.text.replace(/\n/g, ' | ').trim();
          });
         }


      }
      
    }
    return data;
  };
  
  module.exports = { transform };
  