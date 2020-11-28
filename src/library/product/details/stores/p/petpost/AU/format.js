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
    let fvariantId='';
    for (let row of group) {
      if(row.image){
        row.image.forEach(item=>{
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
      if(row.variantId){
        row.variantId.forEach(item=>{
          fvariantId=item.text;
        })
      }
      if(row.variants){
        let strPos=-1;
        let vinf=[];
        row.variants.forEach(item=>{
          strPos=item.text.indexOf("window.ShopifyAnalytics = window.ShopifyAnalytics || {}; window.ShopifyAnalytics.meta = window.ShopifyAnalytics.meta || {}; window.ShopifyAnalytics.meta.currency = 'AUD';");
          let tmpStr=item.text.replace("window.ShopifyAnalytics = window.ShopifyAnalytics || {}; window.ShopifyAnalytics.meta = window.ShopifyAnalytics.meta || {}; window.ShopifyAnalytics.meta.currency = 'AUD'; var meta = ",'');
           tmpStr=tmpStr.replace("; for (var attr in meta) { window.ShopifyAnalytics.meta[attr] = meta[attr]; }",'');
           //console.log('final script data ::',tmpStr);
           let metaObj=JSON.parse(tmpStr);
           let varintObj=metaObj.product.variants;
           //console.log('varintObj :: ',varintObj);
           varintObj.forEach(element => {
             vinf.push(element.id);
           });
           //console.log('vinf : ',vinf);
        })
        if(vinf.length>0){
          row.variants=[{"text":vinf.join(" | ")}];
        }
      }
    }
  }
  return cleanUp(data);
};
module.exports = { transform };