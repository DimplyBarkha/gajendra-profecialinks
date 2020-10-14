/**
 *
 * @param {ImportIO.Group[]} data
 * @returns {ImportIO.Group[]}
 */
const transform = (data) => {
    for (const { group } of data) {
      var rank_temp = 1
      for (const row of group) {
        row.rank = row.rankOrganic = [{ 'text': rank_temp }];
        rank_temp = rank_temp + 1;        
        if (row.id) {
          row.id.forEach(item => {            
            var arr_temp = item.text.split('/');
            var temp_id = arr_temp[arr_temp.length - 1]
            arr_temp = temp_id.split('?');
            item.text = arr_temp[0];           
          });
        }
      }
    }
    return data;
  };  
  module.exports = { transform };