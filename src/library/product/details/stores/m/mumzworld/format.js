
/**
 *
 * @param {ImportIO.Group[]} data
 * @returns {ImportIO.Group[]}
 */
const transform = (data) => {
  for (const { group } of data) {
    for (const row of group) {      
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
  return data;
};

module.exports = { transform };
