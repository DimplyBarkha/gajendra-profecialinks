/**
 *
 * @param {ImportIO.Group[]} data
 * @returns {ImportIO.Group[]}
 */
const transform = (data, context) => {

    for (const { group } of data) {
      for (const row of group) {  
        try { 

        //   if (row.price || row.listPrice) {
        //     row.price = [{ text: row.price[0].text }, { text: row.onlinePriceCurrency[0].text }];
        //     row.listPrice = [{ text: row.listPrice[0].text }, { text: row.onlinePriceCurrency[0].text }];
        //   }    

            if (row.price || row.listPrice) {
          row.price = [{ text: row.price[0].text.substring(1) }, { text: row.price[0].text.charAt(0) }];
         row.listPrice = [{ text: row.listPrice[0].text.substring(1) }, { text: row.listPrice[0].text.charAt(0) }];
  
     }   
  
        } catch (exception) { console.log('Error in transform', exception); }
  
      }
    }
    return data;
  };
  
  module.exports = { transform };