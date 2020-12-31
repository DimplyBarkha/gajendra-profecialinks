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
        let tmp_variant = '';

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
            let agg_rating = []; 
            row.aggregateRating.forEach(item => {
                agg_rating = item.text.split(" ");
            });
            row.aggregateRating = [{'text': agg_rating[0].replace(/,/g, '.') ,'xpath':row.aggregateRating[0].xpath}];
        }

        if (row.price) {
          let total_price = ''
           row.price.forEach(item => {
            item.text =  Number(item.text) + '€' ;
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

        if (row.variantInformation) {
          let variantinfo = [];
          row.variantInformation.forEach(item => {
            variantinfo.push(item.text.replace(/(\s*\n\s*)+/g, ' | ').trim());
          });
          if(tmp_variant != ''){
            variantinfo.push(tmp_variant);
          }
          row.variantInformation = [{'text':variantinfo.join(' | '),'xpath':row.variantInformation[0].xpath}];
        }

        if (row.variantId) {
          let variantid = [];
          row.variantId.forEach(item => {
            variantid.push(item.text.trim());
          });
          row.variantId = [{'text':variantid[0],'xpath':row.variantId[0].xpath}];
        }
       
      }
    }
    return cleanUp(data);
  };
  
  module.exports = { transform };