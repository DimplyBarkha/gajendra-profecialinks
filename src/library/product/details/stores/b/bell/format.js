
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
        let p_color = ''
        if (row.color) {
          row.color.forEach(item => {
            p_color = item.text;                
          });
        }
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
        if (row.specifications){
          let info = [];          
          row.specifications.forEach(item => {              
            info.push(item.text.replace(/(\s*\n\s*)+/g, ' ').trim());
          });
          
          if (info.length>0){
            row.specifications = [{'text':info.join(' | '),'xpath':row.specifications[0].xpath}];            
          }
        }        
        if (row.additionalDescBulletInfo) {
          let info = [];          
          row.additionalDescBulletInfo.forEach(item => {
            info.push(item.text.trim());            
          });          
          row.additionalDescBulletInfo = [{'text': info.join(' , '),'xpath':row.additionalDescBulletInfo[0].xpath}];          
        }        
        if (row.description) {
          let info = []
          row.description.forEach(item => {            
            info.push(item.text.replace(/(\s*\n\s*)+/g, ' ').trim());            
          });
          row.description = [{'text':info.join(' | '),'xpath':row.description[0].xpath}];          
        }
        if (row.nameExtended && p_color != '') {          
          row.nameExtended.forEach(item => {            
            item.text = item.text + " " + p_color
          });          
        }
      }
    }
    return cleanUp(data);
  };
  
  module.exports = { transform };
  