/**
 *
 * @param {ImportIO.Group[]} data
 * @returns {ImportIO.Group[]}
 */
const transform = (data) => {
    for (const { group } of data) {
      var rank = 1;
      for (const row of group) {
        if (row.id) {
          row.id.forEach(item => {           
            var splitData = item.text.split('-');
            item.text =  splitData[splitData.length-1];
          });
        }
        if (row.thumbnail) {
          row.thumbnail.forEach(item => {           
            item.text = 'https:'+item.text;
          });
        }
        if (row.productUrl) {
          row.productUrl.forEach(item => {       
            item.text = 'https://www.mvideo.ru'+item.text;
          });
        }
        if (row.aggregateRating2) {
          row.aggregateRating2.forEach(item => {       
            item.text = item.text.replace('width: ', '').trim();       
            item.text = item.text.replace('%', '').trim();
            if(item.text==1){
              item.text = 0;  
            }else{
              var aggregateRating2Number = (item.text * 5) / 100;            
              item.text = aggregateRating2Number.toFixed(1).replace('.', ',');
            }
          });
        }
        row.rank = [{"text":rank}];
        row.rankOrganic = [{"text":rank}];
        rank++;
      }
    }
    return data;
  };
  module.exports = { transform };
