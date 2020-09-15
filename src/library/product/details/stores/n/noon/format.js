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
      if (row.category) {
        let info = [];          
        row.category.forEach(item => {
          if (item.text != 'Home'){
            info.push(item.text);            
          }
        });
        if(info.length){          
          row.category = [];
          info.forEach(item => {
              row.category.push({"text": item});
          });
        }
      }
      
      
      if (row.alternateImages) {
        let info = [];          
        row.alternateImages.forEach(item => {
          info.push(item.text);            
        });
        if(info.length){          
          row.alternateImages = [];
          info.forEach(item => {
              row.alternateImages.push({"text": item});
          });
        }
      }
      if (row.imageAlt) {
        let info = [];          
        row.imageAlt.forEach(item => {
          info.push(item.text.trim());            
        });
        if (info.length){
          row.imageAlt = info[0];
        }
        
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