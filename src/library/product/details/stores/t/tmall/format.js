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
          item.text=item.text.replace("_50x50.jpg", "");
        });
      }
      if(row.sku){
        row.sku.forEach(item => {
          var skuArr=item.text.split("/item/");
          var skuArr1=skuArr[1].split(".");
          item.text=skuArr1[0];
        });
      }
      if(row.ratingCount){
        row.ratingCount.forEach(item => {
          var ratingCountArr=item.text.split(" ");
          item.text=ratingCountArr[0];
        });
      }
      if(row.nameExtended){
        
      }
    }
  }
  return data;
};

module.exports = { transform };
  