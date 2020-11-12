/**
 *
 * @param {ImportIO.Group[]} data
 * @returns {ImportIO.Group[]}
 */
const transform = (data) => {  
    const cleanUp = (data, context) => {
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
    for (const { group } of data) {
      for (let row of group) {
        if(row.image){
          row.image.forEach(item => {
            item.text=item.text.replace('=s360','');
          });
        }
        if(row.sku){
          row.sku.forEach(item=>{
            let dataAr=item.text.replace('https://www.farmatodo.com.co/producto/','').split('-');
            item.text=dataAr[0];
            row.variantId=[{"text":dataAr[0]}];
          })
        }
        if(row.price){
          row.price.forEach(item => {
            item.text=item.text.replace('.',',');
          });
        }
        if(row.listPrice){
          row.listPrice.forEach(item => {
            item.text=item.text.replace('.',',');
          });
        }
        if(row.category){
          row.category.forEach(item=>{
            if(item.text.substr(0,1)=='/'){
              item.text=item.text.substr(2, item.text.lenght);
            }
          })
        }
      }
    }
    return cleanUp(data);
  };
  module.exports = { transform };