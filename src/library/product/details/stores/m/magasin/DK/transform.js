  
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
          if (row.weightNet) {
            let newText = "";
            row.weightNet.forEach(item =>{
              if(item.text.trim().charAt(item.text.trim().length -1) == '.' || item.text.trim().charAt(item.text.trim().length -1) == ','){
                newText += `${item.text.trim().slice(0, -1)}`;
              } else {
                newText += `${item.text.trim()}`;
              }
            });
            row.weightNet = [{ text: newText.replace("Vægt: ", '').replace(',', '.') }];
          }
          if (row.gtin) {
            let newText = JSON.parse(row.gtin[0].text.trim());            
            row.gtin = [{ text: newText.gtin13 }];
          }
          if (row.price) {
            let newText = JSON.parse(row.price[0].text.trim());            
            row.price = [{ text: newText.offers.price }];
          }
          if (row.nameExtended) {
            let newText = "";
            row.nameExtended.forEach(item => {
              if (item.text.trim().includes(row.brandText[0].text.trim())){
                newText += `${item.text.trim()}`;
              } else {
                newText += `${row.brandText[0].text.trim() + ' ' + item.text.trim()}`;
              }
            });    
            console.log(newText);      
            row.nameExtended = [{ text: newText }];
          }
        } catch (exception) { console.log('Error in transform', exception); }
       }
    }
    return data;
  };
  
  module.exports = { transform };