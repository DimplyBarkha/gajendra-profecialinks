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
      let brnd='';  
      if(row.brandText){
        row.brandText.forEach(item=>{
          brnd=item.text;
        })
      }
      if(row.nameExtended){
        row.nameExtended.forEach(item=>{
          if(brnd!=''){
            item.text=brnd+" - "+item.text;
          }
        })
      }
      if(row.quantity){
        row.quantity.forEach(item=>{
          item.text=item.text.replace('SIZE ','');
        })
      }
      if(row.sku){
        row.sku.forEach(item=>{
          item.text=item.text.replace('ITEM ','');
        })
      }
      if(row.variantId){
        row.variantId.forEach(item=>{
          item.text=item.text.replace('ITEM ','');
        })
      }
      if(row.ratingCount){
        row.ratingCount.forEach(item=>{
          item.text=item.text.replace(' reviews','');
        })
      }
      if(row.aggregateRating){
        row.aggregateRating.forEach(item=>{
          item.text=item.text.replace(' stars','');
        })
      }
      if(row.directions){
        let directionsStr='';
        row.directions.forEach(item=>{
          if(directionsStr=''){
            directionsStr=item.text;
          }else{
            directionsStr=directionsStr+" "+item.text;
          }
        })
        row.directions=[{"text":directionsStr}]
      }
      if(row.directions){
        let directionsStr='';
        row.directions.forEach(item=>{
          if(directionsStr=''){
            directionsStr=item.text;
          }else{
            directionsStr=directionsStr+" "+item.text;
          }
        })
        row.directions=[{"text":directionsStr}]
      }
      if(row.ingredientsList){
        let no2=0,inf=[],tmp='';
        row.ingredientsList.forEach(item=>{
          if(no2==0){
            tmp=item.text;
            no2=1
          }else if(no2==1){
            tmp=tmp+" : "+item.text;
            inf.push(tmp);
            tmp='';
            no2=0;
          }
        })
        row.ingredientsList=[{"text":inf.join(' | ')}];
      }
    }
  }
  return cleanUp(data);
};
module.exports = { transform };