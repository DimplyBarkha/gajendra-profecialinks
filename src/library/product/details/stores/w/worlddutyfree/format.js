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
        let tmp_desc = ''

        /*if (row.description2) {
            let info = [];          
            row.description2.forEach(item => {
              info.push(item.text.replace(/(\s*\n\s*)+/g, ' | ').trim());            
            });            
            tmp_desc = info.join(' || ');
            delete row.description2;
        }
        if (row.description) {
            let info = [];
            row.description.forEach(item => {
                info.push(item.text.replace(/(\s*\n\s*)+/g, ' | ').trim());
            });
            if(tmp_desc != ''){
                info.push(tmp_desc);
            }
            row.description = [{'text':info.join(' | '),'xpath':row.description[0].xpath}];
        }

        if(row.aggregateRating){
            let count = 0;
            row.aggregateRating.forEach(item => {
                count++;
            });
            row.aggregateRating = [{'text': count,'xpath':row.aggregateRating[0].xpath}];
        }

        if (row.sku) {
           row.sku.forEach(item => {
           var matches = /\/cards\/(.*?)\.html/isg.exec(item.text);
           if (matches) {
             item.text = matches[1];
             row.sku = [{'text': matches[1],'xpath':row.sku[0].xpath}];
           }
          });
          
        }*/

        if (row.description) {
            let info = [];          
            row.description.forEach(item => {
                info.push(item.text.replace(/(\s*\n\s*)+/g, ' | ').trim());            
            });
            row.description = [{'text':info.join(' | '),'xpath':row.description[0].xpath}];          
        }
        if (row.availabilityText) {          
            row.availabilityText.forEach(item => {
                item.text = 'In Stock'
            });
        }
       
      }
    }
    return cleanUp(data);
  };
  
  module.exports = { transform };