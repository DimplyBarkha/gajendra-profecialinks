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
      var rank = 1;
      for (let row of group) {
        var variantIdsku=''; var brandTextData=''; var nameExtendedData='';
        if(row.image){
          var imgSrc=''; 
          row.image.forEach(item => {
            var tmp=item.text.split(' ');
            item.text=imgSrc=tmp[1];
          });
          var imgSrcVar=imgSrc.split('/');
          var imgSrcVar1=imgSrcVar.pop().split('.');
          variantIdsku=imgSrcVar1[0];
        }
        if(row.pricePerUnitUom){
          row.pricePerUnitUom.forEach(item => {
            let var1=item.text.split('kr/');
            let var2=var1[1].split(' ');
            item.text=var2[0];
          });
        }
        if(row.price){
          row.price.forEach(item=>{
            item.text=item.text.replace(',','.');
          })
        }
        if(row.termsAndConditions){
          row.termsAndConditions.forEach(item => {
            if(item.text!=''){
              item.text='Yes';
            }else{
              item.text='No';
            }
          });
        }
        if(row.brandText){
          row.brandText.forEach(item => {
            brandTextData=item.text;
          });
        }
        if(row.nameExtended){
          row.nameExtended.forEach(item=>{
            nameExtendedData=item.text;
          });
        }
        if(brandTextData!=''){
          row.nameExtended=[{"text":brandTextData+' '+nameExtendedData}];
        }
        row.variantId=[{"text":variantIdsku}];
        row.sku=[{"text":variantIdsku}];
      }
    }
    return cleanUp(data);
  };
  module.exports = { transform };