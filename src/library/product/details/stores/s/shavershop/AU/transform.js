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
          
          if (row.manufacturerImages) {
            row.manufacturerImages = [{ text: "https://www.shavershop.com.au"+row.manufacturerImages[0].text  }];
          }  
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