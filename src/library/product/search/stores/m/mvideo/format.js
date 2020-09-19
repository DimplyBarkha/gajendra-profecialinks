/**
 *
 * @param {ImportIO.Group[]} data
 * @returns {ImportIO.Group[]}
 */
const transform = (data) => {
<<<<<<< HEAD
  for (const { group } of data) {
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
    }
  }
  return data;
};
module.exports = { transform };
=======
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
        if (row.aggregateRating) {
          row.aggregateRating.forEach(item => {       
            item.text = item.text.replace('width: ', '').trim();       
            item.text = item.text.replace('%', '').trim();
            var aggregateRatingNumber = (item.text * 5) / 100;            
            item.text = aggregateRatingNumber.toFixed(1);
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
>>>>>>> ffc068f1ee96110638862301291c6346d3ee0808
