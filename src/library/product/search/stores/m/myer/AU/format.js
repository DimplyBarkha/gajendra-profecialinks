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
        if (row.price) {
          let now_price = '';
          row.price.forEach(item => {                                         
              var matches = /(Now)/isg.exec(item.text);
              if (matches) {                  
                  now_price = item.text;
                  return false;
              }
              else{
                item.text = item.text.replace(/(Was)+/g, '');
              }
          });
          if (now_price != '' && row.price.length >= 2){
            now_price = now_price.replace(/(Now)+/g, '');
            row.price = [{'text':now_price,'xpath':row.price[0].xpath}];
          }
        }  
        row.rank = [{ text: rankCounter }];
                
        Object.keys(row).forEach(header => row[header].forEach(el => {
          el.text = clean(el.text);
        }));        
      }
    }
    context.setState({ rankCounter });
    context.setState({ orgRankCounter });
    // context.setState({ productCodes });
    // console.log(productCodes);
    return data;
  };
  module.exports = { transform };