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
          if (row.id) {
            row.id.forEach(item => {
                var arr = item.text.split('/');
                var url_len = arr.length;
                item.text = arr[url_len-1];                
            });
          }            
      }
  }
  return data;
};

module.exports = { transform };