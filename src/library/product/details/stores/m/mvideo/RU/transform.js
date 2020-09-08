/**
 *
 * @param {ImportIO.Group[]} data
 * @returns {ImportIO.Group[]}
 */
const transform = (data) => {
    for (const { group } of data) {
      for (const row of group) {
        if (row.description) {
          row.description.forEach(item => {
            item.text = item.text.replace(/(\s*\n\s*)+/g, ' || ').trim();
          });
        }

        if (row.shippingInfo) {
          row.shippingInfo.forEach(item => {
            item.text = item.text.replace(/(\s*\n\s*)+/g, ' ').trim();
          });
        }

        if (row.image) {
          row.image.forEach(item => {
            item.text = 'https:'+item.text;
          });
        }

        if (row.brandImage) {
          row.brandImage.forEach(item => {
            item.text = 'https:'+item.text;
          });
        }

        if (row.alternateImages) {
          row.alternateImages.forEach(item => {
            item.text = 'https:'+item.text;
          });
        }

        if (row.ratingCount) {
          row.ratingCount.forEach(item => {
            item.text = parseInt(item.text);
          });
        }

        if (row.sku) {
          row.sku.forEach(item => {
            item.text = parseInt(item.text);
          });
        }

        

        if (row.category) {
          row.category.forEach(item => {
            item.text = item.text.replace('Главная', '').trim();
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
                  item.text = matches[1]
                }
                else{
                  item.text = ''
                }
            });
        }

        if (row.shippingWeight) {
            row.shippingWeight.forEach(item => {
                var matches = /Shipping\s+Weight\s*:\s*(.*?)\n/isg.exec(item.text);                
                if (matches) {
                  item.text = matches[1]
                }
                else{
                  item.text = ''
                }
            });
        }

        if (row.shippingDimensions) {
            row.shippingDimensions.forEach(item => {
                var matches = /Product\s+Dimensions\s*:\s*(.*?)\n/isg.exec(item.text);
                var matches2 = /Package\s+Dimensions\s*:\s*(.*?)\n/isg.exec(item.text);                
                if (matches) {
                  item.text = matches[1]
                }
                else if (matches2) {
                  item.text = matches2[1]
                }
                else{
                  item.text = ''
                }
            });
        }

        if (row.warnings) {
            row.warnings.forEach(item => {
                var matches = /Cautions\s*:\s*(.*?)\n/isg.exec(item.text);                
                if (matches) {
                  item.text = matches[1]
                }
                else{
                  item.text = undefined
                }
            });
        
        }
      }
    }
    return data;
  };
  
  module.exports = { transform };