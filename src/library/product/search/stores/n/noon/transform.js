/**
 *
 * @param {ImportIO.Group[]} data
 * @returns {ImportIO.Group[]}
 */
const transform = (data) => {
    for (const { group } of data) {
      for (const row of group) {
        if (row.prodcutUrl) {
          row.prodcutUrl.forEach(item => {
            item.text = "https://www.noon.com" + item.text;
          });
        }

        if (row.id) {
          row.id.forEach(item => {
            item.text = item.text.replace(/.+\/(.+?)_.+/g, '$1').trim();
          });
        }

        }
    }
    return data;
  };
  
  module.exports = { transform };