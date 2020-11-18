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


        // if (row.directions) {
        //   let directionInfo = [];
        //   row.directions.forEach(item => {
        //     directionInfo.push(item.text);
        //   });
        //   if(tmp_direction != ''){
        //     directionInfo.push(tmp_direction);
        //   }
        //   row.directions = [{'text':directionInfo.join(' | '),'xpath':row.directions[0].xpath}];
        // }

        // if(row.aggregateRating){
        //     let count = 0;
        //     row.aggregateRating.forEach(item => {
        //         count++;
        //     });
        //     row.aggregateRating = [{'text': count,'xpath':row.aggregateRating[0].xpath}];
        // }

        if (row.price) {
          let total_price = ''
           row.price.forEach(item => {
            total_price +=  item.text ;
           if (total_price) {
             row.price = [{'text': total_price.trim(),'xpath':row.price[0].xpath}];
           }
          });
          
        }

        if (row.listprice) {
          let list_price = ''
           row.listprice.forEach(item => {
            list_price =  item.text + '€';
           if (list_price) {
             row.listprice = [{'text': list_price.trim(),'xpath':row.listprice[0].xpath}];
           }
          });
          
        }

        if (row.variantCount) {          
          row.variantCount = [{'text':row.variantCount.length,'xpath':row.variantCount[0].xpath}];          
        }
       
      }
    }
    return cleanUp(data);
  };
  
  module.exports = { transform };