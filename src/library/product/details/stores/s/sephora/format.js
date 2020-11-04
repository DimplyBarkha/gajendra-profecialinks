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

    var p_count = 1;

    for (const { group } of data) {
        for (let row of group) {          
           
            if (row.aggregateRating) {
                let rating = 0.0;
                row.aggregateRating.forEach(item => {  
                  rating = parseFloat(item.text.replace(/\D/g,'')) / 20;                                      
                });
                row.aggregateRating = [{'text': rating.toFixed(1),'xpath':row.aggregateRating[0].xpath}];
            }  
            if (row.description) {
                let info = [];
                row.description.forEach(item => {
                    info.push(item.text.replace(/(\s*\n\s*)+/g, ' | ').trim());
                });

                row.description = [{'text':info.join(' | '),'xpath':row.description[0].xpath}];
            }
            if (row.variants) {
                let info = []
                row.variants.forEach(item => {            
                  info.push(item.text);            
                });
                row.variants = [{'text':info.join(' | '),'xpath':row.variants[0].xpath}];          
              }
              
            if (row.variantCount) {          
                row.variantCount = [{'text':row.variantCount.length,'xpath':row.variantCount[0].xpath}];          
            }
        }
    }
    return cleanUp(data);
  };
  
  module.exports = { transform };