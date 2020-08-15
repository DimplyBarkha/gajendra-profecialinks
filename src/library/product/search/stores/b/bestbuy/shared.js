/**
 *
 * @param {ImportIO.Group[]} data
 * @returns {ImportIO.Group[]}
 */
const transform = (data) => {
    for (const { group } of data) {
      for (const row of group) {
        if (row.thumbnail) {
          row.thumbnail.forEach(item => {
            item.text= item.text.split(" ")[0];
          });
        }
      }
    }
    return data;
  };
  
  module.exports = { transform };