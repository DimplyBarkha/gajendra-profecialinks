  
/**
 *
 * @param {ImportIO.Group[]} data
 * @returns {ImportIO.Group[]}
 */
const transform = (data, context) => {

    for (const { group } of data) {
      for (const row of group) {
  
        try { 
         
          if (row.gtin) {
            row.gtin = [{ text: row.gtin[0].text.toString().replace(/\r\n|\r|\n/g, '').replace('EAN:   ','')
         }];
          }          
          if (row.mpc) {
            row.mpc = [{ text: row.mpc[0].text.toString().replace(/\r\n|\r|\n/g, '').replace('EAN:   ','')}];
          } 
          if (row.upc) {
            row.upc = [{ text: row.upc[0].text.toString().replace(/\r\n|\r|\n/g, '').replace('EAN:   ','') }];
          } 
          if (row.eangtin) {
            row.eangtin = [{ text: row.eangtin[0].text.toString().replace(/\r\n|\r|\n/g, '').replace('EAN:   ','') }];
          }          
        } catch (exception) { console.log('Error in transform', exception); }
       }
    }
    return data;
  };
  
  module.exports = { transform };