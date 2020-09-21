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

        try { 
         
             
             if (row.aggregateRating) { 
               console.log(row.aggregateRating[0].text);     
               var aggregateRating = row.aggregateRating[0].text.replace(',',''); 
                 aggregateRating = (aggregateRating*5)/100
                row.aggregateRating =  [{ text:  aggregateRating,value:  aggregateRating }];         
             }   

             if (row.aggregateRating2) { 
               console.log(row.aggregateRating2[0].text);     
               var aggregateRating2 = row.aggregateRating2[0].text.replace(',',''); 
               aggregateRating2 = (aggregateRating2*5)/100
                row.aggregateRating2 =  [{ text:  aggregateRating2,value:  aggregateRating2 }];         
             }   
             
             if (row.productUrl) {               
               row.productUrl =  [{ text: 'https://www.netonnet.no'+ row.productUrl[0].text  }];         
            }

            if (row.thumbnail) {               
               row.thumbnail =  [{ text: 'https://www.netonnet.no'+ row.thumbnail[0].text}];         
            }
             
        } catch (exception) { console.log('Error in transform', exception); }

      }
    }
    context.setState({ rankCounter });
    context.setState({ orgRankCounter });
    context.setState({ productCodes });
    //console.log(productCodes);
    return data;
  };
  module.exports = { transform };
  