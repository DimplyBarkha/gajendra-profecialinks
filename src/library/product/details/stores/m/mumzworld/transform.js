
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
      if (row.alternateImages) {
        let info = [];          
        row.alternateImages.forEach(item => {
          info.push(item.text.trim());            
        });          
        row.alternateImages = [{'text':info.join(' | '),'xpath':row.alternateImages[0].xpath}];          
      }
      if (row.imageAlt) {
        let info = [];          
        row.imageAlt.forEach(item => {
          info.push(item.text.trim());            
        });          
        row.imageAlt = [{'text':info.join(' | '),'xpath':row.imageAlt[0].xpath}];          
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
      if (row.category) {
        row.category.forEach(item => {
          item.text = item.text.replace(/(\s*\n\s*)+/g, ' > ').trim();
        });
      }
      if (row.featureBullets) {
        row.featureBullets.forEach(item => {
          item.text = item.text.replace(/(\s*\n\s*)+/g, ' | ').trim();
        });
      }
      if (row.weightNet) {
          row.weightNet.forEach(item => {                
              var matches = /Weight\s*:\s(.*?)\n/isg.exec(item.text);
              if (matches) {
                item.text = matches[1];
              }
              else{
                item.text = '';
              }
          });
      }
      if (row.shippingWeight) {
          row.shippingWeight.forEach(item => {
              var matches = /Shipping\s+Weight\s*:\s*(.*?)\n/isg.exec(item.text);                
              if (matches) {
                item.text = matches[1];
              }
              else{
                item.text = '';
              }
          });
      }
      if (row.shippingDimensions) {
          row.shippingDimensions.forEach(item => {
              var matches = /Product\s+Dimensions\s*:\s*(.*?)\n/isg.exec(item.text);
              var matches2 = /Package\s+Dimensions\s*:\s*(.*?)\n/isg.exec(item.text);                
              if (matches) {
                item.text = matches[1];
              }
              else if (matches2) {
                item.text = matches2[1];
              }
              else{
                item.text = '';
              }
          });
      }
      if (row.warnings) {
          row.warnings.forEach(item => {
              var matches = /Cautions\s*:\s*(.*?)\n/isg.exec(item.text);                
              if (matches) {
                item.text = matches[1];
              }
              else{
                item.text = '';
              }
          });
      }              
    }
  }
  return data;
};

module.exports = { transform };
