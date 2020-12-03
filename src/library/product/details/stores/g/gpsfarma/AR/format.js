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
      for (const row of group) {
        let p_sku = '';        
        if (row.description) {
            let info = [];          
            row.description.forEach(item => {
              info.push(item.text.replace(/(\s*\n\s*)+/g, ', ').trim());            
            });
            row.description = [{'text':info.join(' | '),'xpath':row.description[0].xpath}];
        }
        
        if (row.specifications) {
            let info = [];          
            row.specifications.forEach(item => {
                info.push(item.text.replace(/(\s*\n\s*)+/g, ' : ').trim());            
            });          
            row.specifications = [{'text':info.join(' || '),'xpath':row.specifications[0].xpath}];          
        }
        if (row.quantity) {          
          row.quantity.forEach(item => {
            var matches = /(\d+\s*ml)/isg.exec(item.text);
            var matches1 = /(\d+\s*gr)/isg.exec(item.text);
            var matches2 = /(\d+\s*g)/isg.exec(item.text);
            console.log(matches);
            if (matches){
              item.text = matches[1];
            }
            else if (matches1){
              item.text = matches1[1];
            }
            else if (matches2){
              item.text = matches2[1];
            }
            else{
              delete row.quantity;
              return false;
            }
          });
        }
        
        if (row.descriptionBullets) {
          row.descriptionBullets = [{'text':row.descriptionBullets.length,'xpath':row.descriptionBullets[0].xpath}];
        }

        if (row.manufacturer) {            
            row.manufacturer.forEach(item => {              
              var matches = /.*window\.dataLayer\.push\((.+)\)\;.*/isg.exec(item.text);              
              if (matches){                
                try {
                  let json_data = JSON.parse(matches[1]);
                  if (json_data['product']['manufacturer']){
                    item.text = json_data['product']['manufacturer'];
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