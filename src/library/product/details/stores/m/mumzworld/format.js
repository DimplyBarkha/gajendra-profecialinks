
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
      if (row.variantInformation) {
        let info = [];          
        row.variantInformation.forEach(item => {
          info.push(item.text.trim());            
        });
        row.variantCount = [{'text': info.length}];
        row.variantInformation = [{'text':info.join(' | '),'xpath':row.variantInformation[0].xpath}];          
      }           
      if (row.additionalDescBulletInfo) {
        let info = [];          
        row.additionalDescBulletInfo.forEach(item => {
          info.push(item.text.trim());            
        });
        row.descriptionBullets = [{'text': info.length}];
        row.additionalDescBulletInfo = [{'text':info.join(' | '),'xpath':row.additionalDescBulletInfo[0].xpath}];          
      }
      if (row.specifications) {
        row.specifications.forEach(item => {
          item.text = item.text.replace(/(\s*\n\s*)+/g, ' || ').trim();
          item.text = item.text.replace(/(\s*Overview:\s*\|\|\s*)+/g, '').trim();
        });
      }        
      if (row.description) {
        let info = [];          
        row.description.forEach(item => {
          info.push(item.text.replace(/(\s*\n\s*)+/g, ' || ').trim());            
        });
        row.description = [{'text':info.join(' || '),'xpath':row.description[0].xpath}];          
      }
      if (row.shippingInfo) {
        row.shippingInfo.forEach(item => {
          item.text = item.text.replace(/(\s*\n\s*)+/g, ' ').trim();
        });
      }      
      if (row.featureBullets) {
        row.featureBullets.forEach(item => {
          item.text = item.text.replace(/(\s*\n\s*)+/g, ' | ').trim();
        });
      }                   
    }
  }
  return cleanUp(data);
};

module.exports = { transform };
