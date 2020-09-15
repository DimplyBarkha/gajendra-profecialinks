
/**
 *
 * @param {ImportIO.Group[]} data
 * @returns {ImportIO.Group[]}
 */
const transform = (data) => {    
    for (const { group } of data) {
        var rank_temp = 1
        for (const row of group) {            
            row.rankOrganic = [{'text':rank_temp,'xpath':''}];
            row.rank = [{'text':rank_temp,'xpath':''}];
            rank_temp = rank_temp + 1;
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