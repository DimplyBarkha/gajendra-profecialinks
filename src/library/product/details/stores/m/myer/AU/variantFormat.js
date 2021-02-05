/**
*
* @param {ImportIO.Group[]} data
* @returns {ImportIO.Group[]}
*/
const transform = (data) => {
    const cleanUp = text => text.toString()
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
  
    for (const { group } of data) {
      for (const row of group) {
        if(row.variantId){
          row.variantId.forEach(item=>{
            let temp=item.text.split('_Colour_').pop().split('_sw_');
            item.text=temp[0];
          })
        }
        if (row.variantUrl) {      
          row.variantUrl.forEach(item => {
             item.text=`${row.currentURL[0].text}?color=${item.text}`;
          });         
        }
        delete row.currentURL;
      }
    }
    return data;
  };
module.exports = { transform };