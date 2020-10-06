

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
  for (const { group} of data) {
      for (let row of group) {        
                    
          if (row.specifications) {
            let info = [];          
            row.specifications.forEach(item => {
              info.push(item.text);            
            });          
            row.specifications = [{'text':info.join(' || '),'xpath':row.specifications[0].xpath}];          
          }
          if (row.description) {
            row.description.forEach(item => {
                item.text  = item.text.replace(/(\s*\n\s\n\s*)/g, ' || ').trim();
            });
          }
          if (row.shippingInfo) {
            let info = [];          
            row.shippingInfo.forEach(item => {
              info.push(item.text.replace(/(\s*\n\s*)+/g, ' ').trim());            
            });
            row.shippingInfo = [{'text':info.join(' | '),'xpath':row.shippingInfo[0].xpath}];          
          }
          if (row.additionalDescBulletInfo) {
            let info = [];          
            row.additionalDescBulletInfo.forEach(item => {
              info.push(item.text.replace(/(\s*\n\s*)+/g, ' ').trim());            
            });
            row.additionalDescBulletInfo = [{'text':info.join(' | '),'xpath':row.additionalDescBulletInfo[0].xpath}];          
          }
          if (row.descriptionBullets) {
            let info = [];          
            row.descriptionBullets.forEach(item => {
              info.push(item.text.replace(/(\s*\n\s*)+/g, ' ').trim());            
            });
            row.descriptionBullets = [{'text':info.length,'xpath':row.descriptionBullets[0].xpath}];          
          }
      }
    }
    return cleanUp(data);
};

module.exports = { transform }