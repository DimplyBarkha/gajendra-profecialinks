/**
 *
 * @param {ImportIO.Group[]} data
 * @returns {ImportIO.Group[]}
 */
const transform = (data) => {
  const cleanUp = (data, context) => {
    const clean = text => text.toString()
      .replace(/\r\n|\r|\n/g, ' ')
      .replace(/&amp;nbsp;/g, ' ')
      .replace(/&amp;#160/g, ' ')
      .replace(/\u00A0/g, ' ')
      .replace(/\s{2,}/g, ' ')
      .replace(/"\s{1,}/g, '"')
      .replace(/\s{1,}"/g, '"')
      .replace(/^ +| +$|( )+/g, ' ')
      // eslint-disable-next-line no-control-regex
      .replace(/[\x00-\x1F]/g, '')
      .replace(/[\uD800-\uDBFF][\uDC00-\uDFFF]/g, ' ');
    data.forEach(obj => obj.group.forEach(row => Object.keys(row).forEach(header => row[header].forEach(el => {
      el.text = clean(el.text);
    }))));
    return data;
  };
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
          item.text=`ru${skuArr1[0]}`;
        });
      }
      if(row.variantId){
        row.variantId.forEach(item => {
          var arr=item.text.split("/item/");
          var arr1=arr[1].split(".");
          item.text=`ru${arr1[0]}`;
        });
      }      
      if(row.ratingCount){
        row.ratingCount.forEach(item => {
          var ratingCountArr=item.text.split(" ");
          item.text=ratingCountArr[0];
        });
      }
      if (row.nameExtended) {
        var nameVar=row.nameExtended[0]['text'];
        if(nameVar.indexOf('Dyson -')==-1){
          //var brandText = row.brandText[0]['text'];
          row.nameExtended=[{"text":'Dyson - '+nameVar,"xpath":row.nameExtended[0]['xpath']}];
        }
        row.brandText=[{"text":'Dyson',"xpath":row.brandText[0]['xpath']}];
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
  cleanUp(data);
  return data;
};

module.exports = { transform };
  