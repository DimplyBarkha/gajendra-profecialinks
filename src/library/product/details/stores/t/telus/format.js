
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
        if (row.variantInformation) {
          let info = [];          
          row.variantInformation.forEach(item => {
            info.push(item.text.trim());            
          });          
          row.variantInformation = [{'text':info.join(' | '),'xpath':row.variantInformation[0].xpath}];
          row.variantCount = [{'text':0}];
        }           
        if (row.category) {                    
          row.category.splice(0,1);
        }
        if (row.sku) {
            row.variantId = [{'text':row.sku[0].text}]
        }
        if (row.image) {
          row.image.forEach(item => {
            item.text = 'https:'+item.text;
          });
        }
        if (row.manufacturerImages) {
          row.manufacturerImages.forEach(item => {
            if(item.text.indexOf('http')<0){
              item.text = 'https:'+item.text;
            }
          });
        }        
        if (row.brandText) {
          if (row.nameExtended){
            row.nameExtended = [{'text':row.brandText[0].text+'-'+row.nameExtended[0].text}];
          }          
        }        
        if (row.alternateImages) {
          row.alternateImages.forEach(item => {
            if(item.text.indexOf('http')<0){
              item.text = 'https:'+item.text;
            }
          });
          row.alternateImages.splice(0,2);
          if(row.alternateImages.length){
              row.alternateImages.splice(row.alternateImages.length-1,1);
          }            
          row.largeImageCount = [{'text':row.alternateImages.length}];
        }
        if (row.specifications) {
          var temp_arr = [];
          row.specifications.forEach(item => {
            item.text = item.text.replace(/(\s*\n\s*)+/g, ':').trim();
            temp_arr.push(item.text);
          });
          if (temp_arr.length){
            row.specifications = [{'text':temp_arr.join(' || ')}];
          }
        }
        if (row.manufacturerDescription) {
          var temp_arr = [];
          row.manufacturerDescription.forEach(item => {            
            temp_arr.push(item.text);
          });
          if (temp_arr.length){
            row.manufacturerDescription = [{'text':temp_arr.join(' ')}];
          }
        }
      }
    }
    return cleanUp(data);
  };
  
  module.exports = { transform };
  