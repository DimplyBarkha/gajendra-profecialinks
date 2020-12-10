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
          
          
          if (row.coupon) {
            let info = [];          
            row.coupon.forEach(item => {
                info.push(item.text.replace(/(\s*\n\s*)+/g, ', ').trim());            
            });
            row.coupon = [{'text':info.join(' | '),'xpath':row.coupon[0].xpath}];          
          }
          if (row.quantity) {
            let info = [];          
            row.quantity.forEach(item => {
                info.push(item.text.replace(/(\s*\n\s*)+/g, ', ').trim());            
            });
            row.quantity = [{'text':info.join(' | '),'xpath':row.quantity[0].xpath}];          
          }
          if (row.description) {
            let info = [];          
            row.description.forEach(item => {
              info.push(item.text.replace(/(\s*\n\s*)+/g, ' | ').trim());            
            });
            row.description = [{'text':info.join(' | '),'xpath':row.description[0].xpath}];          
          }
          if(row.descriptionBullets){
            row.descriptionBullets = [{'text':row.descriptionBullets.length,'xpath':row.descriptionBullets[0].xpath}];
          }          
          if (row.specifications) {
            let info = [];          
            row.specifications.forEach(item => {
              info.push(item.text.replace(/(\s*\n\s*)+/g, ' : ').trim());            
            });          
            row.specifications = [{'text':info.join(' || '),'xpath':row.specifications[0].xpath}];          
          }
          if (row.variantInformation) {
            let info = [];          
            row.variantInformation.forEach(item => {
                info.push(item.text.replace(/(\s*\n\s*)+/g, ' | ').trim());            
            });
            row.variantInformation = [{'text':info.join(' | '),'xpath':row.variantInformation[0].xpath}];          
          }
          if (row.manufacturer) {            
            row.manufacturer.forEach(item => {              
              var matches = /window\.__myx\s*=\s*(.+)/isg.exec(item.text);
              if (matches){
                try {
                  let json_data = JSON.parse(matches[1]);
                  if (json_data["pdpData"]["manufacturer"]){                    
                    item.text = json_data["pdpData"]["manufacturer"];                  
                  }                
                } catch (error) {                  
                  delete row.manufacturer;
                  return false;
                }
              }
              else{
                delete row.manufacturer;
                return false;
              }
            });
          }
        }
      }
      return cleanUp(data);
    };
    
    module.exports = { transform };