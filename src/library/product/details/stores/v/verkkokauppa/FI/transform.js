/**
 *
 * @param {ImportIO.Group[]} data
 * @returns {ImportIO.Group[]}
 */
const transform = (data, context) => {

    for (const { group } of data) {
      for (const row of group) {  
        try { 

          // if (row.price) {
          //   row.price = [{ text: row.price[0].text }, { text: row.onlinePriceCurrency[0].text }];            
          // }       
           
          // console.log('test data'+ row.listPrice)
          // if(row.listPrice !='undefined')
          // { 
          //   row.listPrice = [{ text: row.listPrice[0].text }, { text: row.onlinePriceCurrency[0].text }];
          // }    

        } catch (exception) { console.log('Error in transform', exception); }
  
      }
    }
    return data;
  };
  
  module.exports = { transform };