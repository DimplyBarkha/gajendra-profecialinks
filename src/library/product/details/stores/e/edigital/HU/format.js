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
          let brand = '';
          if (row.image) {
            row.image.forEach(item => {
                item.text = "https:" + item.text;
            });
          }
          if (row.brandText) {            
            row.brandText.forEach(item => {
                let data = JSON.parse(item.text);
                if(data['brand']){
                    item.text = data['brand'];
                }
                else{
                    delete row.brandText;
                }
            });
          }
          if (row.nameExtended) {            
            row.nameExtended.forEach(item => {
                if(brand != ''){
                    item.text = item.text + " - " + brand;
                }
            });
          }
          if (row.description) {
            let info = [];          
            row.description.forEach(item => {
              info.push(item.text.replace(/(\s*\n\s*)+/g, ' ').trim());            
            });
            row.description = [{'text':info.join(' | '),'xpath':row.description[0].xpath}];
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
          if (row.metaKeywords) {
            row.metaKeywords = [{'text':row.metaKeywords[0]['text'],'xpath':row.metaKeywords[0].xpath}];            
          }
          if (row.availabilityText) {            
            row.availabilityText.forEach(item => {
              if(item.text == 'Out of Stock'){
                delete row.quantity;
              }
            });
            
          }
        }
      }
      return cleanUp(data);
    };
    module.exports = { transform };