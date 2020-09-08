
/**
 *
 * @param {ImportIO.Group[]} data
 * @returns {ImportIO.Group[]}
 */
const transform = (data) => {
    for (const { group } of data) {
      for (const row of group) {
        
        if (row.alternateImages) {
          row.alternateImages.forEach(item => {
            item.text = item.text.replace(/(\/wc\d+\/)+/g, '\/wc1200\/');
          });
        }

        if (row.reviewCount) {
          row.reviewCount.forEach(item => {
            item.text = item.text.trim();
          });
        }

        if (row.category) {
          row.category.forEach(item => {
            item.text = item.text.replace(/(\s*\n\s*)+/g, ' > ').trim();
          });
        }

        if (row.description) {
          row.description.forEach(item => {
            item.text = item.text.replace(/(\s*\n\s*)+/g, ' || ').trim();
          });
        }
               
      }
    }
    return data;
  };
  
  module.exports = { transform };
  