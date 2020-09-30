/**
 *
 * @param {ImportIO.Group[]} data
 * @returns {ImportIO.Group[]}
 */
const transform = (data, context) => {

      // Default transform function
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

    for (const { group } of data) {
      for (const row of group) {  
        try {
            if (row.price) {
              row.price = [{ text: row.price[0].text }, { text: row.priceCurrency[0].text }];            
              //console.log(row.price)
             }
             if (row.variants) {
              let newText = "";
              let artNo = '';
              row.variants.forEach(item => {
                if(item.text.indexOf('Art.-Nr.:') != -1){
                  artNo = item.text.replace("Art.-Nr.: ", "");
              }
            });

              row.variants.forEach(item => {
                if(item.text.indexOf('Art.-Nr.:') == -1){
                  newText += artNo+'-'+item.text+" || ";
              }});
              newText = newText.substring(0,newText.length-3);
              row.variants = [{ text: newText }];
            }

            if (row.firstVariant) {
              let newText = "";
              let artNo = '';
              row.firstVariant.forEach(item => {
                if(item.text.indexOf('Art.-Nr.:') != -1){
                  artNo = item.text.replace("Art.-Nr.: ", "");
              }
            });

              newText = artNo+'-'+row.firstVariant[0].text;  
              row.firstVariant = [{ text: newText }];
            }
            
             

        } catch (exception) { console.log('Error in transform', exception); }
  
      }
    }
    return data;
  };
  
  module.exports = { transform };