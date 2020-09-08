/**
 *
 * @param {ImportIO.Group[]} data
 * @returns {ImportIO.Group[]}
 */
const transform = (data) => {
    for (const { group } of data) {
      for (const row of group) {
        
        if(row.alternateImages){
          row.alternateImages.forEach(item => {
              var tmpURL=item.text.replace("_50x50.jpg", "");;
            item.text=tmpURL;
          });
        }

        if(row.ratingCount){
          row.ratingCount.forEach(item => {
            var ratingCountArr=item.text.split(" ");
            item.text=parseInt(ratingCountArr[0]);
          });
        }

        if(row.quantity){
          row.quantity.forEach(item => {
            item.text=parseInt(item.text);
          });
        }

        if(row.aggregateRating){
          row.aggregateRating.forEach(item => {
            item.text=parseFloat(item.text);
          });
        }
      }
    }
    return data;
  };
  
  module.exports = { transform };
  