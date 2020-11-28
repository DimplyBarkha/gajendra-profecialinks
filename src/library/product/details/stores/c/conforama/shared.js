/**
*
* @param {ImportIO.Group[]} data
* @returns {ImportIO.Group[]}
*/
const transform = (data, context) => {
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
  for (const { group } of data) {
    for (const row of group) {
      if (row.specifications) {
        let text = '';
        row.specifications.forEach(item => {
          text += `${item.text.replace(/\n \n/g, ' : ')} || `;
        });
        row.specifications = [
          {
            text: text,
          },
        ];
      }
      if (row.image) {
        row.image.forEach(item => {
          if (item.text.includes('https:')) {
            item.text = item.text;
          } else {
            item.text = 'https:' + item.text;
          }
        });
      }
      // if (row.brandText) {

      //   const variantIds = [];
      //   let dup = "";
      //   let urls = [];
      //   row.brandText.forEach(item => {
      //     //console.log('item:: ', item.text);
      //    urls =  row.brandText.filter(it => item.text === it.text);
      //   if(urls && urls.length === 1 ){
      //     variantIds.push(item);
      //   }else{
      //     if(dup !== item.text){
      //       dup =  item.text;
      //       variantIds.push(item);
      //     }
      //   }
      //   });
      //   row.brandText = variantIds;
      // }
      // if (row.sku) {

      //   const variantIds = [];
      //   let dup = "";
      //   let urls = [];
      //   row.sku.forEach(item => {
      //     //console.log('item:: ', item.text);
      //    urls =  row.sku.filter(it => item.text === it.text);
      //   if(urls && urls.length === 1 ){
      //     variantIds.push(item);
      //   }else{
      //     if(dup !== item.text){
      //       dup =  item.text;
      //       variantIds.push(item);
      //     }
      //   }
      //   });
      //   row.sku = variantIds;
      // }
      // if (row.gtin) {

      //   const variantIds = [];
      //   let dup = "";
      //   let urls = [];
      //   row.gtin.forEach(item => {
      //     //console.log('item:: ', item.text);
      //    urls =  row.gtin.filter(it => item.text === it.text);
      //   if(urls && urls.length === 1 ){
      //     variantIds.push(item);
      //   }else{
      //     if(dup !== item.text){
      //       dup =  item.text;
      //       variantIds.push(item);
      //     }
      //   }
      //   });
      //   row.gtin = variantIds;
      // }
      if (row.description) {
        let text = '';
        row.description.forEach(item => {
          text += `${item.text.replace(/\n \n/g, ':')} || `;
        });
        row.description = [
          {
            text: text.slice(0, -4),
          },
        ];
      }
      if (row.specifications) {
        let text = '';
        row.specifications.forEach(item => {
          text += `${item.text.replace(/\n \n/g, ':')} || `;
        });
        row.specifications = [
          {
            text: text.slice(0, -4),
          },
        ];
      }
      if (row.additionalDescBulletInfo) {
        let text = '';
        row.additionalDescBulletInfo.forEach(item => {
          text += `${item.text.replace(/\n \n/g, ':')} | `;
        });
        row.additionalDescBulletInfo = [
          {
            text: text.slice(0, -4),
          },
        ];
      }
      // if (row.variantId) {
      //   const variantIds = [];
      //   let dup = "";
      //   let urls = [];
      //   row.variantId.forEach(item => {
      //     //console.log('item:: ', item.text);
      //    urls =  row.variantId.filter(it => item.text === it.text);
      //   if(urls && urls.length === 1 ){
      //     variantIds.push(item);
      //   }else{
      //     if(dup !== item.text){
      //       dup =  item.text;
      //       variantIds.push(item);
      //     }
      //   }
      //   });
      //   row.variantId = variantIds;
      // }
      if (row.gtin) {
        row.gtin.forEach(item => {
          if ((item.text.includes('undefined;\ntc_vars[')) || (item.text.includes('NaN'))) {
            item.text = '';
          }
        });
      }
    }
  }
  data.forEach(obj => obj.group.forEach(row => Object.keys(row).forEach(header => row[header].forEach(el => {
    el.text = clean(el.text);
  }))));
  return data;
};
module.exports = { transform };
