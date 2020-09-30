/**
 *
 * @param {ImportIO.Group[]} data
 * @returns {ImportIO.Group[]}
 */
const transform = (data, context) => {

    for (const { group } of data) {
      for (const row of group) {
  
        try { 
         
          if (row.Image360Present) {
            row.Image360Present = [{ text: row.Image360Present[0].text == 'true' ? 'YES' : 'NO' }];
          }      
          
          // if (row.variantId) {
          //   var variantId = row.variantId[0].text.toString();
          //   var length = variantId.split("-").length;
          //   variantId = variantId.split("-")[length-1];
          //   console.log('variant:'+variantId);
          //   row.variantId = [
          //     {
          //       text: variantId.replace('.html',''),
          //     },
          //   ];
          // } 

          if (row.manufacturerDescription) {
            let text = '';
            row.manufacturerDescription.forEach(item => {
              text += item.text.replace(/\s{2,}/g, ' ').replace(/\n/g, ' ').trim();
            });
            row.manufacturerDescription = [
              {
                text: text,
              },
            ];
          }
          
        } catch (exception) { console.log('Error in transform', exception); }
       }
    }
    return data;
  };
  
  module.exports = { transform };