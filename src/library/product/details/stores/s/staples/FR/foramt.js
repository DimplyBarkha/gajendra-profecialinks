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
    for (let row of group) {
      if(row.sku){
        row.sku.forEach(item=>{
          item.text=item.text.replace('WW-','');
        })
      }
      if(row.variantId){
        row.variantId.forEach(item=>{
          item.text=item.text.replace('WW-','');
        })
      }
      if(row.mpc){
        row.mpc.forEach(item=>{
          item.text=item.text.replace(': ','');
        })
      }
      if(row.manufacturer){
        row.manufacturer.forEach(item=>{
          item.text=item.text.replace(': ','');
        })
      }
      if(row.color){
        row.color.forEach(item=>{
          item.text=item.text.replace(': ','');
        })
      }
      if(row.mpc){
        row.mpc.forEach(item=>{
          item.text=item.text.replace(': ','');
        })
      }
      if(row.image){
        row.image.forEach(item=>{
          item.text="http:"+item.text;
        })
      }
      if(row.alternateImages){
        row.alternateImages.forEach(item=>{
          item.text="http:"+item.text;
        })
      }
      if(row.price){
        let priceStr='';
        row.price.forEach(item=>{
          if(priceStr==''){
            priceStr=item.text;
          }else{
            priceStr=priceStr+" "+item.text;
          }
        })
        row.price=[{"text":priceStr}];
      }
      if(row.description){
        let inf=[];
        row.description.forEach(item=>{
          inf.push(item.text);
        })
        row.description=[{"text":inf.join(' | ')}];
      }
      if(row.featureBullets){
        let inf=[];
        row.featureBullets.forEach(item=>{
          inf.push(item.text);
        })
        row.featureBullets=[{"text":inf.join(' | ')}];
      }
      if(row.descriptionBullets){
        let inf=[];
        row.descriptionBullets.forEach(item=>{
          inf.push(item.text);
        })
        row.descriptionBullets=[{"text":inf.length}];
      }
    }
  }
  return cleanUp(data);
};
module.exports = { transform };