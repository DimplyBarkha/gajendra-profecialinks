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

        if(row.aggregateRating){
          row.aggregateRating.forEach(item => {
            item.text=parseFloat(item.text);
          });
        }

        if(row.variantId){
          row.variantId.forEach(item => {
            var variantIdArr=item.text.split("/kf/");
            var variantIdArr2=variantIdArr[1].split("/");
            item.text=variantIdArr2[0];
          });
        }

        if(row.sku){
          row.sku.forEach(item => {
            var skuArr=item.text.split("/item/");
            var skuArr1=skuArr[1].split(".");
            item.text=parseInt(skuArr1[0]);
          });
        }
        
      }
    }
    return data;
  };
  
  module.exports = { transform };
  