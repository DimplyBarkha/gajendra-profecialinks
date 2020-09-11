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
        } catch (exception) { console.log('Error in transform', exception); }
       }
    }
    return data;
  };
  
  module.exports = { transform };