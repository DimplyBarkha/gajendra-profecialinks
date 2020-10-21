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
      var brandTextStr='';
      for (let row of group) {
        if(row.brandText){
          brandTextStr=row.brandText[0]['text'];
        }
        if(row.nameExtended){
          row.nameExtended[0]['text']=brandTextStr+" "+row.nameExtended[0]['text'];
        }
        if(row.availabilityText){
          row.availabilityText[0]['text']='In Stock';
        }
        if(row.pricePerUnitUom){
          row.pricePerUnitUom[0]['text']=row.pricePerUnitUom[0]['text'].replace(' -','');
        }
        if(row.pricePerUnit){
          row.pricePerUnit[0]['text']=row.pricePerUnit[1]['text']+'/'+row.pricePerUnit[0]['text'].replace(' -','');
        }
      }
    }
    return cleanUp(data);
  };
  module.exports = { transform };