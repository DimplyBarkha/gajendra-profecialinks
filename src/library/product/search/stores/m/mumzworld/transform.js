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
          if (row.productUrl) {
            row.productUrl.forEach(item => {
                var arr = item.text.split('/');
                var url_len = arr.length
                var item_id = arr[url_len-1]
                row.id.forEach(item => { 
                    item.text = item_id
                });
            });
          }            
      }
  }
  return data;
};

module.exports = { transform };