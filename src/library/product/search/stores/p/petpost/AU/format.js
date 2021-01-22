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
    let skyIdStr='';
    for (const row of group) {
      rankCounter += 1;
      if (!row.sponsored) {
        orgRankCounter += 1;
        row.rankOrganic = [{ text: orgRankCounter }];
      }
      row.rank = [{ text: rankCounter }];
      Object.keys(row).forEach(header => row[header].forEach(el => {
        el.text = clean(el.text);
      }));
      if(row.thumbnail){
        row.thumbnail.forEach(item=>{
            item.text="https://www.sephora.com"+item.text;
        })
      }   
        if(row.productUrl){
            row.productUrl.forEach(item=>{
                item.text="https://www.petpost.com.au"+item.text;
            })
        }
        if(row.thumbnail){
            row.thumbnail.forEach(item=>{
                item.text=item.text.replace('background-image: url("','').replace('");','');
                let tmp=item.text.split('/').pop().split('-');
                skyIdStr=tmp[0];
            })
        }
        if(row.id){
          let rowIdData=false;
          row.id.forEach(item=>{
            if(skyIdStr!=''){
              item.text=skyIdStr;
            }else{
              let objTmp=item.text.split('|');
              objTmp.forEach(element => {
                if(element.indexOf('productId:')>-1){
                  item.text=element.replace('productId:','');
                }
              });
            }
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