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
      var brandTextStr=''; var nameExtendedSr='';
      for (let row of group) {
        if(row.brandText){
          row.brandText.forEach(item=>{
            brandTextStr=item.text;
          });
        }
        if(row.nameExtended){
          row.nameExtended.forEach(item=>{
            nameExtendedSr=item.text;
          });
        }
        if(row.availabilityText){
          row.availabilityText=[{"text":'In Stock'}];
        }
        if(row.pricePerUnitUom){
          row.pricePerUnitUom.forEach(item=>{
            item.text=item.text.replace(' -','');
          });
        }
        if(row.pricePerUnit){
          var priceUn=[];
          row.pricePerUnit.forEach(item=>{
            priceUn.push(item.text);
          });
          if(priceUn.length>1){
            row.pricePerUnit=[{"text":priceUn[1]+'/'+priceUn[0]}];
          }
        }
        if(brandTextStr!=''){
          row.nameExtended=[{"text":brandTextStr+' '+nameExtendedSr}];
        }
      }
    }
    return cleanUp(data);
  };
  module.exports = { transform };