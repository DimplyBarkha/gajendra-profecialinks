/**
 *
 * @param {ImportIO.Group[]} data
 * @returns {ImportIO.Group[]}
 */
const transform = (data) => {
    for (const { group } of data) {
        for (const row of group) {    
            if (row.variant) {
                let info = [];
                row.variant.forEach(item => {  
                    info.push(item.text.replace(/(\s*\n\s*)+/g, ' | ').trim());                                     
                });
                row.variant = [{'text': info.join(' | '),'xpath':row.variant[0].xpath}];
            } 
            if (row.variantId) {
                let info = [];
                row.variantId.forEach(item => {  
                    info.push(item.text.replace(/(\s*\n\s*)+/g, ' | ').trim());                                     
                });
                row.variantId = [{'text': info.join(' | '),'xpath':row.variantId[0].xpath}];
            } 
        }
    } 
    return data;
  };
  
  module.exports = { transform };