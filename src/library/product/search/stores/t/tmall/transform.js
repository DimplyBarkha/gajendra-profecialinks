/**
 *
 * @param {ImportIO.Group[]} data
 * @returns {ImportIO.Group[]}
 */
const transform = (data) => {
    for (const { group } of data) {
      for (const row of group) {
        if (row.productUrl) {
            row.productUrl.forEach(item => {
              item.text = 'https://tmall.ru'+item.text
            });
        } 
        if(row.ratingCount){
          row.ratingCount.forEach(item => {
            var res = item.text.replace("(", "");
            var res1 = res.replace(")", "");
            item.text=res1;
          });
        }

        if(row.id){
          row.id.forEach(item => {
            var res = item.text.split("|");
            item.text=parseInt(res[1]);
          });
        }

        if(row.aggregateRating){
            row.aggregateRating.forEach(item => {
                var res = item.text.split(":");
                var res1 = res[1].trim();
                var res2 =res1.split(" ");
                item.text=res2[0];
            });
        }
      }
    }
    return data;
  };
  
  module.exports = { transform };