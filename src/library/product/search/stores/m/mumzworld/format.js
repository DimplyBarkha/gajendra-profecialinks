/**
 *
 * @param {ImportIO.Group[]} data
 * @returns {ImportIO.Group[]}
 */
const transform = (data) => {
  var p_count = 1
  for (const { group } of data) {
      for (const row of group) {          
          if (row.rankOrganic && row.rank) {
            row.rankOrganic = [{'text':p_count}];
            row.rank = [{'text':p_count}];
            p_count = p_count + 1;
          }          
      }
  }
  return data;
};

module.exports = { transform };