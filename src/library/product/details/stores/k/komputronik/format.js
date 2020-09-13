/**
 *
 * @param {ImportIO.Group[]} data
 * @returns {ImportIO.Group[]}
 */
const transform = (data) => {
    for (const { group } of data) {
      for (const row of group) {
        
        if (row.alternateImages) {
          row.alternateImages.forEach(item => {
            item.text = item.text.replace(/(product-picture\/4\/)+/g, 'product-picture/11/').trim();
          });
        }
        if (row.category) {
          let info = [];          
          row.category.forEach(item => {
            info.push(item.text.replace(/(\s*\n\s*)+/g, '').trim());            
          });
          row.category = [{'text':info.join(' > '),'xpath':row.category[0].xpath}];
        }
        if (row.variantinformation) {
          let info = [];          
          row.variantinformation.forEach(item => {
            info.push(item.text.replace(/(\s*\n\s*)+/g, '').trim());            
          });
          row.variantinformation = [{'text':info.join(' > '),'xpath':row.variantinformation[0].xpath}];
        }
        if (row.variants) {
          row.variants.forEach(item => {
              item.text = item.text.replace(/\n/g, ' | ').trim();
          });
        }
        if (row.description) {
          row.description.forEach(item => {
              item.text = item.text.replace(/\n/g, ' | ').trim();
          });
        }
        if (row.specifications) {
          let info = [];          
          row.specifications.forEach(item => {
            info.push(item.text.replace(/(\s*\n\s*)+/g, ' : ').trim());            
          });
          row.specifications = [{'text':info.join(' || '),'xpath':row.specifications[0].xpath}];          
        }
      }  
    }
    return data;
  };
module.exports = { transform };
  