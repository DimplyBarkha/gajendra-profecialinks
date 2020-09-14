
/**
 *
 * @param {ImportIO.Group[]} data
 * @returns {ImportIO.Group[]}
 */
const transform = (data) => {
  for (const { group } of data) {
    for (const row of group) {
      if (row.id) {
        var r = /[^\/]+$/;
        let text = '';
        row.id.forEach(item => {
          text += `${item.text.replace(/\n \n/g, ':')}   `;
        });
        row.id = text.match(r);
      } 
    }
  }
  return data;
};

module.exports = { transform };
