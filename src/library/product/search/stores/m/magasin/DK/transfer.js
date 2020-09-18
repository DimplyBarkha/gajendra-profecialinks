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
    .replace(/[\x00-\x1F]/g, '')
    .replace(/[\uD800-\uDBFF][\uDC00-\uDFFF]/g, ' ');
    const state = context.getState();
  let orgRankCounter = state.orgRankCounter || 0;
  let rankCounter = state.rankCounter || 0;
  const productCodes = state.productCodes || [];

    for (const { group } of data) {
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

  
        try { 
         
          if (row.productUrl) {
              if(row.productUrl[0].text.lastIndexOf('https://www.magasin.dk') < 0)
              {
                row.productUrl =  [{ text:  'https://www.magasin.dk'+ row.productUrl[0].text }];
              }
            
          }           
        } catch (exception) { console.log('Error in transform', exception); }
       }
    }
    context.setState({ rankCounter });
  context.setState({ orgRankCounter });
  context.setState({ productCodes });
    return data;
  };
  
  module.exports = { transform };