
/**
 *
 * @param {ImportIO.Group[]} data
 * @returns {ImportIO.Group[]}
 */
const transform = (data) => {    
    for (const { group } of data) {
        var rank = 1
        for (const row of group) {            
            row.rankOrganic = [{'text':rank,'xpath':''}];
            rank = rank + 1;
        }        
    }
    return data;
  };
  
  module.exports = { transform };