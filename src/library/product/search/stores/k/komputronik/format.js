
/**
 *
 * @param {ImportIO.Group[]} data
 * @returns {ImportIO.Group[]}
 */
const transform = (data) => {
    for (const { group } of data) {
      for (const row of group) {
          if (row.aggregateRating) {
            let text = '';
            row.aggregateRating.forEach(item => {
              text += `${item.text
                .replace(/\|.*$/g, '')
            .replace(/\//g, '')}  `;
            });
            row.aggregateRating = [
              {
                text: text.slice(0, -4),
              },
            ];
          }
          if (row.ratingCount) {
            let text = '';
            row.ratingCount.forEach(item => {
              text += `${item.text
                .replace(/\|.*$/g, '')
            .replace(/\//g, '')}  `;
            });
            row.ratingCount = [
              {
                text: text.slice(0, -4),
              },
            ];
          }
          if (row.reviewCount) {
            let text = '';
            row.reviewCount.forEach(item => {
              text += `${item.text
                .replace(/.+(\|)/g, '')
                .replace(/\s/g, '')
                }  `;
            });
            row.reviewCount = [
              {
                text: text.slice(0,-8),
              },
            ];
          }
          if (row.shippingInfo) {
            let text = '';
            row.shippingInfo.forEach(item => {
              text += `${item.text
                .replace(/\s\n/g, '')}  `;
            });
            row.shippingInfo = [
              {
                text: text.slice(0, -4),
              },
            ];
          }
          if (row.name) {
            let text = '';
            row.name.forEach(item => {
              text += `${item.text
                .replace(/\s\n/g, '')}  `;
            });
            row.name = [
              {
                text: text.slice(),
              },
            ];
          }
          if (row.price) {
            let text = '';
            row.price.forEach(item => {
              text += `${item.text
                .replace(/\s\n/g, '')
              .replace(/\s*/g, '')}  `;
            });
            row.price = [
              {
                text: text.slice(),
              },
            ];
          }
          
          if (row.variantId) {
            row.variantId.forEach(item => {
              item.text = item.text + "sj";
                item.text = item.text.slice(33,-1);
                item.text = item.text.match(/[^[\]]+(?=])/g);
               
                
            });
        }     
          
          
      }
      
    }
    return data;
  };
  
  module.exports = { transform };
  