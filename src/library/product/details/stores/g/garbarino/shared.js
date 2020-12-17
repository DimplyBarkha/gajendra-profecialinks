
/**
 *
 * @param {ImportIO.Group[]} data
 * @returns {ImportIO.Group[]}
 */
const transform = (data) => {
    for (const { group } of data) {
      for (const row of group) {
        if (row.category) {
          row.category.pop();
        }
        if (row.image) {
          row.image.forEach(item => {
            if(item.text.includes('https:')){
              item.text = item.text;
            }else{
              item.text = 'https:' + item.text;
            }
          });
        }
        if (row.alternateImages) {
          row.alternateImages.forEach(item => {
            if(item.text.includes('http')){
              item.text = item.text;
            }else{
              item.text = 'https:' + item.text;
            }
          });
        }
        if (row.manufacturerImages) {
          row.manufacturerImages.forEach(item => {
            if(item.text.includes('http')){
              item.text = item.text;
            }else{
              item.text = 'https:' + item.text;
            }
          });
        }
        if (row.manufacturerDescription) {
          row.manufacturerDescription.forEach(item => {
              item.text = item.text.replace(/(\|\|\s\|\|\s)/gm,'').replace(/&nbsp;/gm, '')
              item.text = item.text.replace(/(\|\|\s\|\|\s)/gm,'||');
            
          });
        }
      }
    }
  
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
  
  module.exports = { transform };
  