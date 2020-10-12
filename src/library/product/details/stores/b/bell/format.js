
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
        if (row.image) {
            row.image.forEach(item => {
                item.text = "https://www.bell.ca" + item.text;                
            });
        }
        if (row.alternateImages) {
            row.alternateImages.forEach(item => {
                item.text = "https://www.bell.ca" + item.text;                
            });
        }
        if (row.specifications && row.specificationsValue){
          let info = [];
          if (row.specifications.length == row.specificationsValue.length){
            row.specifications.forEach((item,index) => {
              let spe_value = row.specificationsValue[index]['text'];
              info.push(item.text.trim()+": "+spe_value.trim());
            });
          }
          if (info.length>0){
            row.specifications = [{'text':info.join(' | '),'xpath':row.specifications[0].xpath}];
            delete row.specificationsValue;
          }
        }
        /*if (row.variantInformation) {
          let info = [];          
          row.variantInformation.forEach(item => {
            info.push(item.text.trim());            
          });
          //row.variantCount = [{'text': info.length}];
          row.variantInformation = [{'text':info.join(' | '),'xpath':row.variantInformation[0].xpath}];          
        }           
        if (row.additionalDescBulletInfo) {
          let info = [];          
          row.additionalDescBulletInfo.forEach(item => {
            info.push(item.text.trim());            
          });
          row.descriptionBullets = [{'text': info.length}];
          row.additionalDescBulletInfo = [{'text':'|| ' + info.join(' || '),'xpath':row.additionalDescBulletInfo[0].xpath}];          
        }
        if (row.specifications) {
          row.specifications.forEach(item => {
            item.text = item.text.replace(/(\s*\n\s*)+/g, ' || ').trim();
            item.text = item.text.replace(/(\s*Overview:\s*\|\|\s*)+/g, '').trim();
          });
        } 
        if (row.quantity) {
          row.quantity.forEach(item => {
            item.text = 1;          
          });
        }*/        
        if (row.description) {
          let info = []
          row.description.forEach(item => {            
            info.push(item.text.replace(/(\s*\n\s*)+/g, ' ').trim());            
          });
          row.description = [{'text':info.join(' | '),'xpath':row.description[0].xpath}];          
        }
      }
    }
    return cleanUp(data);
  };
  
  module.exports = { transform };
  