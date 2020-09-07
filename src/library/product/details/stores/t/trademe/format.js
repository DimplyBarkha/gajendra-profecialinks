
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
          if (row.image) {
            let text = '';
            row.image.forEach(item => {
              text += `${item.text
                .match(/\(([^)]+)\)/)[1]
                .replace(/\//g, '')}  `;
            });
            row.image = [
              {
                text: text.slice(),
              },
            ];
          }
          if (row.alternateImages) {
            let text = '';
            row.alternateImages.forEach(item => {
              text += `${item.text
                .match(/\(([^)]+)\)/)[1]
                .replace(/\//g, '')}  `;
            });
            row.alternateImages = [
              {
                text: text.slice(),
              },
            ];
          }
          if (row.specifications) {
            let text = '';
            row.specifications.forEach(item => {
              text += `${item.text
                .replace(/\s\n/g, '')}  `;
            });
            row.specifications = [
              {
                text: text.slice(0, -8),
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
  