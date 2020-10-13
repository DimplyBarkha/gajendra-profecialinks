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
        if(row.image){
          var imgSrc='';
          row.image.forEach(item => {
            var tmp=item.text.split(' ');
            item.text=imgSrc=tmp[1];
          });
          var imgSrcVar=imgSrc.split('/');
          var imgSrcVar1=imgSrcVar[imgSrcVar.length-1].split('.');
          row.variantId[0]['text']=imgSrcVar1[0];
          row.sku[0]['text']=imgSrcVar1[0];
        }
        if(row.pricePerUnitUom){
          row.pricePerUnitUom.forEach(item => {
            let var1=item.text.split('kr/');
            let var2=var1[1].split(' ');
            item.text=var2[0];
          });
        }
        if(row.termsAndConditions){
          if(row.termsAndConditions[0]['text']!=''){
            row.termsAndConditions[0]['text']='Yes';
          }else{
            row.termsAndConditions[0]['text']='No';
          }
        }
        if(row.brandText){
          row.nameExtended[0]['text']=row.brandText[0]['text']+' '+row.nameExtended[0]['text'];
        }
      }
    }
    return cleanUp(data);
  };
  module.exports = { transform };