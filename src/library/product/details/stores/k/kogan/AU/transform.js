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

        if (row.price) {
            row.price = [{ text: row.price[0].text.substring(1) }, { text: row.price[0].text.charAt(0) }];
            //  row.listPrice = [{ text: row.listPrice[0].text.substring(1) }, { text: row.listPrice[0].text.charAt(0) }];  
      }     
        } catch (exception) { console.log('Error in transform', exception); }

        
         if (row.description) {
          let text = '';
          row.description.forEach(item => {
            text = row.description.map(elm => elm.text).join(' ').replace(/\n/g, '||');
          });
          row.description = [{ text }];
        }

      }
    }
    return data;
  };
  
  module.exports = { transform };