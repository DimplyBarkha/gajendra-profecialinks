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
        // if (row.productUrl) {
        //   row.productUrl.forEach(item => {
        //     item.text = "https://www.noon.com" + item.text;
        //   });
        // }
        if (row.id) {
          row.id.forEach(item => {
            var idArr = item.text.split('/');            
            item.text = idArr[idArr.length - 1];
          });
        }
      }
    }
    return data;
  };  
  module.exports = { transform };