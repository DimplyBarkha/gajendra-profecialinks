/**
 *
 * @param {ImportIO.Group[]} data
 * @returns {ImportIO.Group[]}
 */
const transform = (data) => {
  var p_count = 0
  for (const { group } of data) {
      for (const row of group) {          
          if (row.rankOrganic) {
              row.rankOrganic.forEach(item => {
                  p_count = parseInt(p_count) + 1;
                  item.text = p_count
              });
          }            
      }
  }
  return data;
};

module.exports = { transform };