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
        let tmp_desc = '';
        let tmp_direction = '';
        if (row.availabilityText) {                    
          row.availabilityText.forEach(item => {
            item.text = "In Stock";
          });          
        }

        if (row.description1) {
            let info = [];          
            row.description1.forEach(item => {
              info.push(item.text);            
            });            
            tmp_desc = info.join(' || ');
            delete row.description1;
        }

        if (row.description2) {
          let info = [];          
          row.description2.forEach(item => {
            info.push(item.text);            
          });            
          tmp_desc = info.join(' || ');
          delete row.description2;
        }

        if (row.description3) {
          let info = [];          
          row.description3.forEach(item => {
            info.push(item.text);            
          });            
          tmp_desc = info.join(' || ');
          delete row.description3;
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

        if (row.directions1) {
          let directionInfo = [];          
          row.directions1.forEach(item => {
            directionInfo.push(item.text);            
          });            
          tmp_direction = directionInfo.join(' || ');
          delete row.directions1;
        }

        if (row.directions2) {
          let directionInfo = [];          
          row.directions2.forEach(item => {
            directionInfo.push(item.text);            
          });            
          tmp_direction = directionInfo.join(' || ');
          delete row.directions2;
        }

        if (row.directions) {
          let directionInfo = [];
          row.directions.forEach(item => {
            directionInfo.push(item.text);
          });
          if(tmp_direction != ''){
            directionInfo.push(tmp_direction);
          }
          row.directions = [{'text':directionInfo.join(' | '),'xpath':row.directions[0].xpath}];
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
             row.variantId = [{'text': matches[1],'xpath':row.sku[0].xpath}];
           }
          });
          
        }
       
      }
    }
    return cleanUp(data);
  };
  
  module.exports = { transform };