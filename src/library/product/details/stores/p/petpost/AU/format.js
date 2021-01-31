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
    let fvariantId='';let tmpVarintId='';
    for (let row of group) {
      if(row.image){
        row.image.forEach(item=>{
          let tmp=item.text.split('/products/').pop().split('-');
          tmpVarintId=tmp[0];
          item.text="https:"+item.text;
        })
      }
      if(row.ratingCount){
        let zeroRatting;
        row.ratingCount.forEach(item=>{
          if(item.text=='Write a review'){
            zeroRatting=true;
          }else{
            item.text=item.text.replace('Review','').trim();
          }
        })
        if(zeroRatting==true){
          row.ratingCount=[{"text":0}];
        }
      }
      if(row.sku){
        row.sku.forEach(item=>{
          item.text=item.text.replace('product_form_','');
        })
      }
      if(row.variantCount){
        let inf=[]
        row.variantCount.forEach(item=>{
          inf.push(item.text);
        })
        row.variantCount=[{"text":inf.length}];
      }
      if(row.descriptionBullets){
        let inf=[];
        row.descriptionBullets.forEach(item=>{
          inf.push(item.text);
        })
        row.descriptionBullets=[{"text":inf.length}];
      }
      if(row.alternateImages){
        row.alternateImages.forEach(item=>{
          item.text="https:"+item.text;
        })
      }
      if(row.brandText){
        row.brandText.forEach(item=>{
          let brndData=item.text.replace("window.ShopifyAnalytics = window.ShopifyAnalytics || {};\nwindow.ShopifyAnalytics.meta = window.ShopifyAnalytics.meta || {};\nwindow.ShopifyAnalytics.meta.currency = 'AUD';\nvar meta =",'');
          brndData=brndData.replace(';\nfor (var attr in meta) {\n window.ShopifyAnalytics.meta[attr] = meta[attr];\n}','');
          //console.log('brndData json:',JSON.parse(brndData));
          let brndDataObj=JSON.parse(brndData);
          console.log('variants:',brndDataObj.product.variants);
          item.text=brndDataObj.product.vendor;
        })
      }
      if(row.description){
        let inf=[];
        row.description.forEach(item=>{
          inf.push(item.text);
        })
        row.description=[{"text":inf.join(' ')}];
      }
      if(tmpVarintId!=''){
        row.variantId=[{"text":tmpVarintId}];
      }
    }
  }
  return cleanUp(data);
};
module.exports = { transform };