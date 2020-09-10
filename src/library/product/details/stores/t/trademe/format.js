
/**
 *
 * @param {ImportIO.Group[]} data
 * @returns {ImportIO.Group[]}
 */
const transform = (data) => {
    for (const { group } of data) {
      for (const row of group) {
          if (row.shippingInfo) {
            let text = '';
            row.shippingInfo.forEach(item => {
              text += `${item.text
                .replace(/\s\n/g, '')}  `;
            });
            row.shippingInfo = [
              {
                text: text.slice(0, -8),
              },
            ];
          }
          if (row.description) {
            let text = '';
            row.description.forEach(item => {
              text += `${item.text
                .replace(/\n\s*\n\s*\n\s*\n\s*/g, '||')
                .replace(/\n\s*\n\s*/g, ' ')
              }  `;
            });
            row.description = [
              {
                text: text.slice(),
              },
            ];
          }
          if (row.image) {
            let text = '';
            row.image.forEach(item => {
              text += `${item.text
                .match(/\(([^)]+)\)/)[1]
                }  `;
            });
            row.image = [
              {
                text: text.slice(1,-3),
              },
            ];
          }
    
          if (row.alternateImages) {
            row.alternateImages.forEach(item => {
              item.text = item.text.match(/\(([^)]+)\)/)[1].slice(1,-1);
            });
          }

          if (row.specifications) {
            let text = '';
            row.specifications.forEach(item => {
              text += `${item.text
                .replace(/\s\n/g, '')}  `;
            });
            row.specifications = [
              {
                text: text.slice(),
              },
            ];
          }
          if (row.manufacturerDescription) {
            let text = '';
            row.manufacturerDescription.forEach(item => {
              text += `${item.text
                .replace(/\s\n/g, '')}  `;
            });
            row.manufacturerDescription = [
              {
                text: text.slice(),
              },
            ];
          }
          if (row.category) {
            let text = '';
            row.category.forEach(item => {
              text += `${item.text.replace(/\n\s/g, '->')}  `;
            });
            row.category = [
              {
                text: text.slice(19, -1),
              },
            ];
          }
          if (row.sku) {
            let text = '';
            row.sku.forEach(item => {
              text += `${item.text.match(/[^#]*$/g)}  `;
            });
            row.sku = [
              {
                text: text.slice(0,-4),
              },
            ];
          }
          if (row.variantId) {
            let text = '';
            row.variantId.forEach(item => {
              text += `${item.text.match(/[^#]*$/g)}  `;
            });
            row.variantId = [
              {
                text: text.slice(0,-4),
              },
            ];
          }
          if (row.pageTimestamp) {
            let text = '';
            row.pageTimestamp.forEach(item => {
              text += `${item.text
                .replace(/\s\n/g, '')
              .replace(/\s*/g, '')}  `;
            });
            row.pageTimestamp = [
              {
                text: text.slice(),
              },
            ];
          }
          
           
          
          
      }
      
    }
    return data;
  };
  
  module.exports = { transform };
  