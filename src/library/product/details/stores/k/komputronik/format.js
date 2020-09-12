/**
 *
 * @param {ImportIO.Group[]} data
 * @returns {ImportIO.Group[]}
 */
const transform = (data) => {
    for (const { group } of data) {
      for (const row of group) {
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
        if (row.gtin) {
          row.gtin.forEach(item => {
            item.text = item.text.match(/[^[\]]+(?=])/g);
            item.text = item.text.toString();
          });
        }
      }  
    }
    return data;
  };
module.exports = { transform };
  