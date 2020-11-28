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
    }
  }
  return cleanUp(data);
};
module.exports = { transform };