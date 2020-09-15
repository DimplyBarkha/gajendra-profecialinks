/**
 *
 * @param {ImportIO.Group[]} data
 * @returns {ImportIO.Group[]}
 */
const transform = (data) => {  
  for (const { group } of data) {
    for (let row of group) {
      
      if (row.sku) {
        row.sku.forEach(item => {
          var myRegexp = /.+\/(.+?)_.+/g;
          var match = myRegexp.exec(item.text);
          if(match.length){
            item.text = match[1].trim();
          }else{
            delete item.text;
          }
        });
      }
      if (row.variantId) {
        row.variantId.forEach(item => {          
          var myRegexp = /.+\/(.+?)_.+/g;
          var match = myRegexp.exec(item.text);
          if(match.length){
            item.text = match[1].trim();
          }else{
            delete item.text;
          }
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
          if (matches) {
              item.text = matches[1]
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