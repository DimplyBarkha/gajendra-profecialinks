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
      let brandTextStr='',skuStr='';
      for (let row of group) {
        if(row.brandText){
          row.brandText.forEach(item=>{
            let brandObj=JSON.parse(item.text);
            brandTextStr=brandObj.brand.name;
            skuStr=brandObj.sku;
          })
          if(brandTextStr==''){
            delete row.brandText;
          }else{
            row.brandText=[{"text":brandTextStr}];
          }
          if(skuStr==''){
            delete row.sku;
          }else{
            row.sku=[{"text":skuStr}];
            row.variantId=[{"text":skuStr}];
            row.mpc=[{"text":skuStr}];
          }
        }
        if(row.category){
          row.category.forEach(item=>{
            item.text=item.text.replace('/','').trim();
          })
        }
        if(row.image){
          row.image.forEach(item => {
            item.text=item.text.replace('=s360','');
          });
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
        if(row.descriptionBullets){
          let noSl=0;
          let inf=[];
          row.descriptionBullets.forEach(item=>{
            noSl++;
            inf.push(item.text);
          })
          row.descriptionBullets=[{"text":noSl}];
          row.additionalDescBulletInfo=[{"text":inf.join(' || ')}];
        }
        if(row.countryOfOrigin){
          row.countryOfOrigin.forEach(item=>{
            item.text=item.text.replace('País de producción:','').replace('.','').trim();
          })
        }
      }
    }
    return cleanUp(data);
  };
  module.exports = { transform };