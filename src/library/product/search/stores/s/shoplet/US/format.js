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
        if(row.productUrl){
            row.productUrl.forEach(item=>{
                item.text="https://www.shoplet.com"+item.text;
            })
        }
          if(row.aggregateRating){
              let starNo=0;
              row.aggregateRating.forEach(item=>{
                  //console.log('item.text :',item.text);
                  let tmlArr=item.text.split(' ');
                  //console.log('tmlArr :',tmlArr);
                  if(tmlArr.length==2){
                      if(tmlArr[1]=='icon-star'){
                          starNo++;
                      }else if(tmlArr[1]=='icon-star-half'){
                          starNo=starNo+0.5;
                      }
                  }
              })
              row.aggregateRating=[{"text":starNo}];
          } 
          if(row.reviewCount){
              row.reviewCount.forEach(item=>{
                  item.text=item.text.replace('(','').replace(')','');
              })
          }      
          if(row.ratingCount){
              row.ratingCount.forEach(item=>{
                  item.text=item.text.replace('(','').replace(')','');
              })
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
  