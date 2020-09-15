/**
 *
 * @param {ImportIO.Group[]} data
 * @returns {ImportIO.Group[]}
 */
const transform = (data) => {
  for (const { group } of data) {
    for (const row of group) {
      if (row.sku) {
        row.sku.forEach(item => {
          item.text = item.text.replace(/.+\/(.+?)_.+/g, '$1').trim();
        });
      }
      if (row.variantId) {
        row.variantId.forEach(item => {
          item.text = item.text.replace(/.+\/(.+?)_.+/g, '$1').trim();
        });
      }      
      if (row.description) {
        row.description.forEach(item => {
          item.text = item.text.replace(/(\s*\n\s*)+/g, ' || ').trim();
        });
      }
            
      if (row.ratingCount) {
        row.ratingCount.forEach(item => {
          var matches = /\s*(\d+)/isg.exec(item.text);
          if (matches.length) {
            item.text = matches[1];
          }
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