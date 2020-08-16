
/**
 *
 * @param {ImportIO.Group[]} data
 * @returns {ImportIO.Group[]}
 */
const transform = (data) => {
    for (const { group } of data) {
      for (const row of group) {
        if (row.nameExtended) {
            row.nameExtended.forEach(item => {
                item.text = item.text.replace(/\n/g,' ');
            });
        }
        if (row.name) {
            row.name.forEach(item => {
                item.text = item.text.replace(/\n/g,' ');
            });
        }
        if (row.price) {
            row.price.forEach(item => {
                item.text = item.text.split('/')[0].trim();
            });
        }
        if (row.quantity) {
            row.quantity.forEach(item => {
                item.text = item.text.split('/')[1].trim();
            });
        }
        if (row.category) {
            let length = row.category.length;
            row.category= row.category[length-1]
        }
      }
    }
    return data;
  };
  
  module.exports = { transform };
  