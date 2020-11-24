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
      if (!row.sponsored) {
        orgRankCounter += 1;
        row.rankOrganic = [{ text: orgRankCounter }];
      }
      row.rank = [{ text: rankCounter }];
      Object.keys(row).forEach(header => row[header].forEach(el => {
        el.text = clean(el.text);
      }));
      if (row.id) {         
        row.id.forEach(item => { 
          item.text = item.text.match(/\d{7}/);
          item.text = String(item.text).replace(/\,/g,'');       
        });        
      }
      if (row.price) {         
        row.price.forEach(item => { 
          var priceArray = item.text.split(" ");
          var priceArray2 =[];
          for(let i=0;i<priceArray.length;i++)
          {
            if(priceArray[i]=="€")
            {
              priceArray2.push(priceArray[i]);
              break;
            }
            else
            {
              priceArray2.push(priceArray[i]);  
            }
           }
           item.text = String(priceArray2).replace(/\,/,' '); 
        });        
      }
      if (row.aggregateRating) {         
        row.aggregateRating.forEach(item => { 
          item.text = item.text.match(/\d/g);
          item.text = String(item.text).replace(/\,/g,''); 
          var rating = parseInt(item.text);
          item.text  = rating*5/100;      
        });        
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