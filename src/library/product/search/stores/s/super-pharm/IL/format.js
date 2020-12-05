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
      var rank = 1;
      for (let row of group) {     
        if(row.aggregateRating){
            row.aggregateRating.forEach(item=>{
                item.text=item.text.replace(' star rating','');
            })
        }
        if(row.productUrl){
          row.productUrl.forEach(item=>{
              item.text="https://shop.super-pharm.co.il"+item.text;
          })
        }
        if(row.price){
          let priceStr='';
          row.price.forEach(item=>{
              priceStr=item.text;
          })
          let priceStrAr=priceStr.split(' ');
          if(priceStrAr.length>1)
            row.price=[{"text":priceStrAr[1]+"."+priceStrAr[0]}];
          else
            row.price=[{"text":priceStrAr[0]+".00"}];
        }          
        row.rank = [{ "text": rank }];
        row.rankOrganic = [{ "text": rank }];
        rank++;
      }
    }
    return cleanUp(data);
  };
  module.exports = { transform };