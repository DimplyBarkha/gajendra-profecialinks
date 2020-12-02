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

      if (row.description) {
        let info = [];
        row.description.forEach(item => {
            info.push(item.text.replace(/(\s*\n\s*)+/g, ' | ').trim());
        });
        row.description = [{'text':info.join(' | '),'xpath':row.description[0].xpath}];
      }

      if (row.sku) {
          row.sku.forEach(item => {
            let data = JSON.parse(item.text);
             if(data['sku']){
              if(data['sku']){
                 item.text = data['sku'];
              }
            }
          });
      }

      if (row.brandText) {
        row.brandText.forEach(item => {
          let data = JSON.parse(item.text);
           if(data['brand']){
            if(data['brand']){
               item.text = data['brand'];
            }
          }
        });
    }

      if (row.variantId) {
        let infovariant = [];
        row.variantId.forEach(item => {
          infovariant.push(item.text.trim());
        });
        row.variantId = [{'text':infovariant[0],'xpath':row.variantId[0].xpath}];
      }

      if (row.variantInformation) {
        row.variantInformation.forEach(item => {
          item.text =  item.text.replace(/(\s*\n\s*)+/g, ' | ').trim();
        });
      }

      if (row.ratingCount) {
        row.ratingCount.forEach(item => {
          item.text =  item.text.match(/\d/g).join('').trim();
        });
      }


      if (row.availabilityText) {
        let infoAvailable = [];
        row.availabilityText.forEach(item => {
            infoAvailable.push(item.text.trim());
        });
        row.availabilityText = [{'text':infoAvailable[0],'xpath':row.availabilityText[0].xpath}];
      }

      if (row.aggregateRating) {  
        let counter = 0;                 
        row.aggregateRating.forEach(item => {
            if(item.text.trim() == "fas fa-star"){
                counter = counter + 1;
            }else if(item.text.trim() == "fas fa-star-half-alt"){
                counter = counter + 0.5;
            }
        });
        row.aggregateRating = [{'text': counter.toFixed(1),'xpath': row.aggregateRating[0].xpath}]        
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
