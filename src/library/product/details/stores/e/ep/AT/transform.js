
/**
*
* @param {ImportIO.Group[]} data
* @returns {ImportIO.Group[]}
*/
const transform = (data) => {
    for (const { group } of data) {
      for (const row of group) {

        if (row.gtin) {
            let text = '';            
              text = row.gtin[0].text.toString().replace("Art.-Nr.: ","");            
            row.gtin = [{ text }];
          }

          if (row.mpc) {
            let text = '';            
              text = row.mpc[0].text.toString().replace("Art.-Nr.: ","");            
            row.mpc = [{ text }];
          }

          if (row.sku) {
            let text = '';            
              text = row.sku[0].text.toString().replace("Art.-Nr.: ","");            
            row.sku = [{ text }];
          }

          if (row.variantId) {
            let text = '';            
              text = row.variantId[0].text.toString().replace("Art.-Nr.: ","");            
            row.variantId = [{ text }];
          }
        
  
        if (row.description) {
          let text = '';
          row.description.forEach(item => {
            text = text + (text ? ' ' : '') + item.text;
          });
          row.description = [{ text }];
        }
  
        if (row.manufacturerDescription) {
          let text = '';
          row.manufacturerDescription.forEach(item => {
            text = text + (text ? ' ' : '') + item.text;
          });
          row.manufacturerDescription = [{ text }];
        }
  
        
  
        
  
        
      }
    }
  
    // Clean up data
    const clean = text => text.toString()
      .replace(/\r\n|\r|\n/g, ' ')
      .replace(/&amp;nbsp;/g, ' ')
      .replace(/&amp;#160/g, ' ')
      .replace(/\u00A0/g, ' ')
      .replace(/\s{2,}/g, ' ')
      .replace(/"\s{1,}/g, '"')
      .replace(/\s{1,}"/g, '"')
      .replace(/^ +| +$|( )+/g, ' ')
      // eslint-disable-next-line no-control-regex
      .replace(/[\x00-\x1F]/g, '')
      .replace(/[\uD800-\uDBFF][\uDC00-\uDFFF]/g, ' ');
  
    data.forEach(obj => obj.group.forEach(row => Object.keys(row).forEach(header => row[header].forEach(el => {
      el.text = clean(el.text);
    }))));
  
    return data;
  };
  
  module.exports = { transform };
  