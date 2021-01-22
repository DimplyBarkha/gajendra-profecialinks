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
        if(row.price){
          row.price.forEach(item=>{
            item.text=item.text.replace('.',',');
          })
        }
        if(row.thumbnail){
          row.thumbnail.forEach(item=>{
            let tmp=item.text.split('/').pop().split('?v=');
            if(tmp.length>1){
              skyIdStr=tmp[0];
            }
          })
        }
        if(row.id){
          row.id.forEach(item=>{
            //console.log('rank:',rank);
            let tmpObj=JSON.parse(item.text);
            //console.log('tmpObj:',tmpObj);
            for(let key in tmpObj){
              console.log('key:',key);
              let tmp1Obj=tmpObj[key];
              console.log('tmp1Obj sku:',tmp1Obj.ref_id);
              item.text=tmp1Obj.ref_id
            }
          })
        }else{
          if(skyIdStr!=''){
            row.id=[{"text":skyIdStr}];
            console.log('tmp1Obj sku:',skyIdStr);
          }
          console.log('rank:',rankCounter);
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