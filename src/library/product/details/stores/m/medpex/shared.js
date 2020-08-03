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
        } 
    }
    return data;
  };
  module.exports = { transform };