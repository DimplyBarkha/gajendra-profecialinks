
/**
 *
 * @param {ImportIO.Group[]} data
 * @returns {ImportIO.Group[]}
 */
const transform = (data) => {
    for (const { group } of data) {
      for (const row of group) {        
        if (row.color) {
          row.color.forEach(item => {
            var myRegexp = /Farbe\s*:\s*(.+)/g;
            var match = myRegexp.exec(item.text);
            if(match){
            if(match.length){
            item.text = match[1].trim();
            }else{
            item.text = "";
            }
            }
          });        
        }
        if (row.description) {
          row.description.forEach(item => {
            item.text = item.text.replace(/(\s*\n\s*)+/g, ' || ').trim();
          });
        }
        if (row.brandLink) {
          row.brandLink.forEach(item => {
            item.text = 'https://www.manor.ch'+item.text
          });
        }
        if (row.category) {          
          let info = [];
          row.category.forEach(item => {            
            info.push(item.text.trim());
          });
          row.category = [{'text':info.join(' > '),'xpath':row.category[0].xpath}];        
        }   
        if (row.alternateImages) {
            row.alternateImages.forEach(item => {
              item.text = 'https://www.manor.ch'+item.text
            });
          }

        if (row.manufacturerImages) {
          row.manufacturerImages.forEach(item => {
            item.text = 'https://www.manor.ch'+item.text
          });
        }
        if (row.image) {
          row.image.forEach(item => {
            item.text = 'https://www.manor.ch'+item.text
          });
        }
        if (row.warranty) {
          row.warranty.forEach(item => {
            item.text = item.text.replace(/Garantie/ig, ' ').trim();
          });
        }
        if (row.variants) {
          let info = [];
          row.variants.forEach(item => {
            info.push(item.text.replace(/(.+\/)/g, '').trim());
          });
          row.variants = [{'text':info.join(' | '),'xpath':row.variants[0].xpath}];        
        }
        if (row.specifications) {
          row.specifications.forEach(item => {
            item.text = item.text.replace(/\n\s*\n\s*\n\s*/g, ' || ').trim();
            item.text = item.text.replace(/\n\s*/g, ':').trim();
          });
        }
        if (row.ratingCount) {
          row.ratingCount.forEach(item => {
            item.text = parseInt(item.text);
          });
        }
        if (row.aggregateRating) {
          row.aggregateRating.forEach(item => {
            item.text = parseInt(item.text);
          });
        }        
      }
    }
    return data;
  };
  
  module.exports = { transform };
  