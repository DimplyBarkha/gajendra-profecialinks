
/**
 *
 * @param {ImportIO.Group[]} data
 * @returns {ImportIO.Group[]}
 */
const transform = (data) => {    
    for (const { group } of data) {
        var rank_temp = 1
        for (const row of group) {            
            row.rankOrganic = [{'text':rank_temp}];
            row.rank = [{'text':rank_temp}];
            rank_temp = rank_temp + 1;
            if (row.productUrl) {
                row.productUrl.forEach(item => {
                    item.text = 'https://www.manor.ch' + item.text;
                });
            }
        }        
    }
    return data;
  };
  
  module.exports = { transform };