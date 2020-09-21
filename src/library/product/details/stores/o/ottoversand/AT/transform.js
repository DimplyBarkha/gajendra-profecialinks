/**
 *
 * @param {ImportIO.Group[]} data
 * @returns {ImportIO.Group[]}
 */
const transform = (data, context) => {

    for (const { group } of data) {
      for (const row of group) {  
        try {
            if (row.price) {
              row.price = [{ text: row.price[0].text }, { text: row.priceCurrency[0].text }];            
            console.log(row.price)
             }
        } catch (exception) { console.log('Error in transform', exception); }
  
      }
    }
    return data;
  };
  
  module.exports = { transform };