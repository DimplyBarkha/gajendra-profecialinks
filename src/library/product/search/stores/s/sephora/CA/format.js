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
      const skyIdStr = '';
      if (!row.sponsored) {
        orgRankCounter += 1;
        row.rankOrganic = [{ text: orgRankCounter }];
      }
      row.rank = [{ text: rankCounter }];
      Object.keys(row).forEach(header => row[header].forEach(el => {
        el.text = clean(el.text);
      }));
      /* if(row.thumbnail){
        row.thumbnail.forEach(item=>{
            item.text="https://www.sephora.com"+item.text;
        })
      }
      if(row.productUrl){
        row.productUrl.forEach(item=>{
          let skuI=item.text.split('?skuId=');
          //console.log('skuIZZ:',skuI);
          //console.log('lengthZZ:',skuI.length);
          if(skuI.length>1){
            let skuI1=skuI[1].split('&');
            skyIdStr=skuI1[0];
          }else{
            console.log('item.text :',item.text);
            let skuI=item.text.split('?');
            //console.log('skuIYY:',skuI);
            //console.log('lengthYY:',skuI.length);
            if(skuI.length>1){
              skyIdStr=skuI[0].split('-').pop().replace(/\D/g,'');
              console.log('skuIX1:',skyIdStr);
              //console.log('sku finale:',skuI1.replace(/\D/g,''));

            }
          }
        })
      }
      if(row.id){
          row.id.forEach(item=>{
            console.log('item.text for id data :',item.text);
              let idAr=item.text.split(' ');
              item.text=idAr[1];
          })
      }else{
        if(skyIdStr!=''){
          row.id=[{"text":skyIdStr}];
        }
      }
      if(row.aggregateRating){
          row.aggregateRating.forEach(item=>{
              item.text=item.text.replace(' stars','');
          })
      } */
      let tmpObj;
      if (row.thumbnail) {
        let tmpObj;
        row.thumbnail.forEach(item => {
          tmpObj = JSON.parse(item.text);
          // console.log('tmpObj :',tmpObj);
          item.text = 'https://www.sephora.com' + tmpObj.image250;
        });
        row.productUrl = [{ text: 'https://www.sephora.com' + tmpObj.targetUrl }];
        row.id = [{ text: tmpObj.skuId }];
        row.price = [{ text: tmpObj.listPrice }];
        row.name = [{ text: tmpObj.productName }];
        row.aggregateRating = [{ text: parseFloat(tmpObj.rating).toFixed(1).toString() }];
        row.reviewCount = [{ text: tmpObj.reviews }];
        row.ratingCount = [{ text: tmpObj.reviews }];
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
