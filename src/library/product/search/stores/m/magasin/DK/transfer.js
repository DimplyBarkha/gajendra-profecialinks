/**
 *
 * @param {ImportIO.Group[]} data
 * @returns {ImportIO.Group[]}
 */
const transform = (data, context) => {

    for (const { group } of data) {
      for (const row of group) {
  
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
    return data;
  };
  
  module.exports = { transform };