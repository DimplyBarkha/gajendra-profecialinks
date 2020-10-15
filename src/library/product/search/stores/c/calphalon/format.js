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
            if (row.aggregateRating) {
                row.aggregateRating.forEach(item => {
                    var myRegexp = /bv-width-from-rating-stats-(\d+)/g;
                    var match = myRegexp.exec(item.text);
                    if (match.length) {
                        item.text = match[1];
                        item.text = (item.text*5)/100
                    }
                });                
            }          
        }
    }
    return data;
  };
  
  module.exports = { transform };