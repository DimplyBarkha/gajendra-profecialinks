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
      if(row.variantId){
        row.variantId.forEach(item => {
          var arr=item.text.split("/item/");
          var arr1=arr[1].split(".");
          item.text=arr1[0];
        });
      }      
      if(row.ratingCount){
        row.ratingCount.forEach(item => {
          var ratingCountArr=item.text.split(" ");
          item.text=ratingCountArr[0];
        });
      }
      if (row.nameExtended) {
        row.nameExtended.forEach(item => {
          var brandText = '';
          row.brandText.forEach(item => {
            brandText = item.text;
          });
          item.text = brandText + ' - ' + item.text;
        });
      }
      if(row.coupon){
        row.coupon.forEach(item=>{
          item.text = item.text.replace(' Купон нового пользователя','');
        });
      }
      if(row.variantId){
        row.variantId.forEach(item => {
          var skuArr=item.text.split("/item/");
          var skuArr1=skuArr[1].split(".");
          item.text=skuArr1[0];
        });
      }
      row.variantCount = [{ "text": 0 }];
    }
  }
  return data;
};

module.exports = { transform };
  