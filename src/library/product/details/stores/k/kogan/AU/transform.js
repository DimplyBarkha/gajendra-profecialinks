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

      //   if (row.price) {
      //       row.price = [{ text: row.price[0].text.substring(1) }, { text: row.price[0].text.charAt(0) }];
      //       //  row.listPrice = [{ text: row.listPrice[0].text.substring(1) }, { text: row.listPrice[0].text.charAt(0) }];  
      // }   
      
      if (row.alternateImages) {     
            row.alternateImages= row.alternateImages.slice(1,row.alternateImages.length);       
            let tempdata = row.alternateImages;
            for(let i=0;i<tempdata.length;i++)
            {                
                  row.alternateImages[i] = { text: tempdata[i].text
                                        .replace('canvas=100%2C66','canvas=753%2C502')
                                        .replace('66','502')
                                        .replace('100','753') }                                  
            }            
        }

        if (row.sku) {          
          let tempSku=row.sku[0].text.split(':')
          row.sku = [{ text: tempSku[1].replace('\\u0022','').replace('\\u00','').replace('\\u0022','').replace('\\u00','').replace(',','').trim() }];
        }

        if (row.description) {
          let text = '';
          row.description.forEach(item => {
            text = row.description.map(elm => elm.text).join(' ').replace(/\n/g, '||');
          });
          row.description = [{ text }];
        }

        } catch (exception) { console.log('Error in transform', exception); }       
                 
      }
    }
    return data;
  };
  
  module.exports = { transform };