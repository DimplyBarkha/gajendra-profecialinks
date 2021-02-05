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
        if(row.aggregateRating ){
          row.aggregateRating.forEach(item => {
            var obj = JSON.parse(item.text);
            if(obj.rating=='NaN' || obj.rating==''){
              item.text = 0;
            }else{
              item.text = parseFloat(obj.rating);
            }      
          });
        }
        if (row.specifications) {
          row.specifications.forEach(item => {
            item.text = item.text.replace(/\n\s*\n\s*\n\s*\n\s*/g, ' || ').trim();
            item.text = item.text.replace(/\n\s*\n\s*/g, ' : ').trim();
          });
        }
        if(row.price){
          let priceStr='';
          row.price.forEach(item=>{
            if(priceStr==''){
              priceStr=item.text;
            }else{
              priceStr=priceStr+"."+item.text;
            }
          })
          row.price=[{"text":priceStr}];
        }
        if(row.quantity){
          row.quantity.forEach(item=>{
            item.text="Size "+item.text;
          })
        }
        /*if(row.tmp_sku){
          let tmp='';
          row.tmp_sku.forEach(item=>{
            tmp=item.text;
          })
          if(tmp=''){
            row.sku=[{"text":tmp}];
          }
        }*/
      }
    }
    return cleanUp(data);
  };
  module.exports = { transform };