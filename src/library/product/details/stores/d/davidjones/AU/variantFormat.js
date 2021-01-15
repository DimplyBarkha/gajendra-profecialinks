/**
 *
 * @param {ImportIO.Group[]} data
 * @returns {ImportIO.Group[]}
 */
const variantTransform = (data, context) => {
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
      el.text = el.text.trim();
    }))));

     let count = 0;
    
    for (const { group } of data) {
      for (const row of group) {
         

        if (row.variantId) {
          row.variantId.forEach(item => {
             count++;
          });
        }

        if(row.variantUrl){
            let info = []
           row.variantUrl.forEach(item => {
              for(let i=0;i<42;i++){
                  info.push(item.text)
              }
           });
           row.variantUrl = [{ text: info, xpath: row.variantUrl[0].xpath }];
        }
  
      }
    }
    return data;
  };
  
  module.exports = { variantTransform };
  