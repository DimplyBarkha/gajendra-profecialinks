
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
                .replace(/.+(\|)/g, '')}  `;
            });
            row.reviewCount = [
              {
                text: text.slice(0, -4),
              },
            ];
          }
           
          
          
      }
      
    }
    return data;
  };
  
  module.exports = { transform };
  