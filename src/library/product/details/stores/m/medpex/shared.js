/**
 *
 * @param {ImportIO.Group[]} data
 * @returns {ImportIO.Group[]}
 */
const transform = (data) => {
    const cleanUp = (data, context) => {
      let dataStr = JSON.stringify(data);
      console.log('INSIDE OF CLEANUP');
      dataStr = dataStr.replace(/(?:\\r\\n|\\r|\\n)/g, ' ')
        .replace(/&amp;nbsp;/g, ' ')
        .replace(/&amp;#160/g, ' ')
        .replace(/\\u00A0/g, ' ')
        .replace(/\s{2,}/g, ' ')
        .replace(/"\s{1,}/g, '"')
        .replace(/\s{1,}"/g, '"')
        .replace(/^ +| +$|( )+/g, ' ')
        // eslint-disable-next-line no-control-regex
        .replace(/[^\x00-\x7F]/g, '');
  
      return JSON.parse(dataStr);
    };
    for (const { group } of data) {
      for (const row of group) {
        if (row.alternateImages) {
          row.alternateImages.splice(0,1);
        } 
      if (row.price) {
            row.price.forEach(price => {
              price.text = price.text.replace('.', '').replace(',', '.').trim();
            });
          }
      if (row.listPrice) {
            row.listPrice.forEach(listPrice => {
                listPrice.text = listPrice.text.replace('.', '').replace(',', '.').trim();
            });
        }
      if (row.secondaryImageTotal) {
            row.secondaryImageTotal.forEach(secondaryImageTotal => {
                secondaryImageTotal.text = Number(secondaryImageTotal.text)-1;
            });
        }
       if(row.brandText){
                row.brandText.forEach(brandText => {
                    brandText.text = brandText.text.split(' ');
                    brandText.text = brandText.text ? brandText.text[0].trim() : '';
                });
            }
        if (row.pricePerUnit) {
              row.pricePerUnit.forEach(pricePerUnit => {
                if(pricePerUnit.text.includes('Grundpreis:')){
                  pricePerUnit.text = pricePerUnit.text.split('Grundpreis:')[1].trim();
                  pricePerUnit.text = pricePerUnit.text.split(' ');
                  pricePerUnit.text = pricePerUnit.text[2] + pricePerUnit.text[3]; 
                  pricePerUnit.text = pricePerUnit.text.replace('€','');
                }
              });
          }
          if (row.pricePerUnitUom) {
                row.pricePerUnitUom.forEach(pricePerUnitUom => {
                  if(pricePerUnitUom.text.includes('Grundpreis:')){
                    pricePerUnitUom.text = pricePerUnitUom.text.split('Grundpreis:')[1].trim();
                    pricePerUnitUom.text = pricePerUnitUom.text.split(' ');
                    pricePerUnitUom.text = pricePerUnitUom.text[0] + pricePerUnitUom.text[1];
                  }
                });
            }
        } 
    }
    return data;
  };
  module.exports = { transform };