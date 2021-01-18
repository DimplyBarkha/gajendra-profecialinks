/**
 *
 * @param {ImportIO.Group[]} data
 * @returns {ImportIO.Group[]}
 */
const transform = (data, context) => {
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
  const state = context.getState();
  let orgRankCounter = state.orgRankCounter || 0;
  let rankCounter = state.rankCounter || 0;
  const productCodes = state.productCodes || [];
  for (const { group } of data) {
    for (const row of group) {
      rankCounter += 1;
      let skyIdStr='';
      if (!row.sponsored) {
        orgRankCounter += 1;
        row.rankOrganic = [{ text: orgRankCounter }];
      }
      row.rank = [{ text: rankCounter }];
      Object.keys(row).forEach(header => row[header].forEach(el => {
        el.text = clean(el.text);
      }));
        if(row.aggregateRating){
            row.aggregateRating.forEach(item=>{
                item.text=item.text.replace(' star rating','');
            })
        }
        if(row.productUrl){
          let tmpId=[];
          row.productUrl.forEach(item=>{
              item.text="https://shop.super-pharm.co.il"+item.text;
              tmpId=item.text.split('/').pop().split('.');
          })
          row.id=[{"text":tmpId[0]}];
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
      }
    }
    context.setState({ rankCounter });
    context.setState({ orgRankCounter });
    context.setState({ productCodes });
    console.log(productCodes);
    return data;
  };
  module.exports = { transform };
  