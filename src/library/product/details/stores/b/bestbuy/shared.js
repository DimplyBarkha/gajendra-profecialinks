
/**
 *
 * @param {ImportIO.Group[]} data
 * @returns {ImportIO.Group[]}
 */
const transform = (data) => {
    for (const { group } of data) {
      for (const row of group) {
        if (row.alternateImages) {
          row.alternateImages.forEach(item => {
            item.text= item.text.replace(/(100x100)/, '500X500');
          });
        }
      }
    }
    return data;
  };
  
  module.exports = { transform };
  