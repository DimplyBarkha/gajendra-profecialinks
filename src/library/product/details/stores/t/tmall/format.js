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
          if(item.text.search('_50x50.jpg')>-1){
            item.text=item.text.replace("_50x50.jpg", "");
          }else if(item.text.search('_50x50.jpeg')>-1){
            item.text=item.text.replace("_50x50.jpeg", "");
          }
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
          item.text = item.text.replace('\n','');
        });
      }
      if(row.specifications){
        var specificationsAr=[];
        row.specifications.forEach(item=>{
          specificationsAr.push(item.text);
        });
        row.specifications=[{"text":specificationsAr.join(' || '),"xpath":row.specifications[0]['xpath']}]
      }
      if(row.aggregateRating){
        row.aggregateRating=[{"text":row.aggregateRating[0]['text'].replace('.',','),"xpath":row.specifications[0]['xpath']}]
      }
      row.variantCount = [{ "text": 0 }];
    }
  }
  return data;
};

module.exports = { transform };
  