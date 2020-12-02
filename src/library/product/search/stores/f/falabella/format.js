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
  let nameData="";
  let brandData="";
  // const productCodes = state.productCodes || [];
  for (const { group } of data) {
    for (const row of group) {
      rankCounter += 1;
      if (!row.sponsored) {
        orgRankCounter += 1;
        row.rankOrganic = [{ text: orgRankCounter }];
      }

      if (row.name) {
        row.name.forEach(item => {
          nameData=item.text;
        });
      }
      if (row.brandText) {
        row.brandText.forEach(item => {
          brandData=item.text;
        });
      }
      if (row.price) {
        row.price.forEach(item => {
          item.text = item.text.replace("(Oferta)",'').trim();
          item.text = item.text.replace(/(\s*\(Precio\s+final\)\s*)+/g, '').trim();
          // item.text = item.text.replace('S\/ ','');
          item.text = item.text.replace('.', ',');
        });
      }
      if (row.aggregateRating) {
        row.aggregateRating.forEach(item => {
          item.text = toTrunc(item.text,1);
          //item.text = Math.trunc(item.text*1000)/1000;
          //item.text = item.text.replace(/(\s*\.\s*)+/g, ',').trim();          
        });
      }      
      row.rank = [{ text: rankCounter }];
      
      row.name=[{text: brandData+' '+nameData}];
      Object.keys(row).forEach(header => row[header].forEach(el => {
        el.text = clean(el.text);
      }));
    }
  }
  context.setState({ rankCounter });
  context.setState({ orgRankCounter });
  // context.setState({ productCodes });
  // console.log(productCodes);
  function toTrunc(value,n){
    let x=(value.toString()+".0").split(".");
    let num = x[0]+"."+x[1].substr(0,n);
    return num.replace(/(\s*\.\s*)+/g, ',').trim();
  }
  return data;
};
module.exports = { transform };

