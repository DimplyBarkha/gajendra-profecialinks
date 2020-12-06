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
    let brandTextStr='';
    for (const row of group) {
      if(row.brandText){
        row.brandText.forEach(item=>{
          brandTextStr=item.text;
        })
      }
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
        let skuStr='';
        row.sku.forEach(item => {
          let skuArr=item.text.split('&sku_id=');
          skuStr=skuArr[0];
        });
        row.sku=[{"text":skuStr}];
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
        row.nameExtended.forEach(item=>{
          item.text=brandTextStr+" - "+item.text;
        })
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
        row.specifications=[{"text":specificationsAr.join(' || ')}]
      }
      if(row.aggregateRating){
        row.aggregateRating=[{"text":row.aggregateRating[0]['text'].replace('.',',')}]
      }
      row.variantCount = [{ "text": 0 }];
    }
  }
  cleanUp(data);
  return data;
};

module.exports = { transform };