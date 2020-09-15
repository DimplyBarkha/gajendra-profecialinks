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
        row.category = [{'text':info.join(' > '),'xpath':row.category[0].xpath}];
      }
      
      
      if (row.alternateImages) {
        let info = [];          
        row.alternateImages.forEach(item => {
          info.push(item.text);            
        });
        if(info.length){
          row.alternateImages = info;
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
  return cleanUp(data);
};

module.exports = { transform };