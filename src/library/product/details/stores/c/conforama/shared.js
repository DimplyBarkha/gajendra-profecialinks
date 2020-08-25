
/**
 *
 * @param {ImportIO.Group[]} data
 * @returns {ImportIO.Group[]}
 */
const transform = (data) => {
    for (const { group } of data) {
      for (const row of group) {
        if (row.specifications) {
          let text = '';
          row.specifications.forEach(item => {
            text += `${item.text.replace(/\n/g, ' : ')} || `;
          });
          row.specifications = [
            {
              text: text.slice(0, -4),
            },
          ];
        }
        if (row.description) {
          let text = '';
          row.description.forEach(item => {
            text += `${item.text.replace(/\n/g, ' ')} `;
          });
          row.description = [
            {
              text: text.slice(0, -4),
            },
          ];
        }
        if (row.additionalDescBulletInfo) {
          let text = '';
          row.additionalDescBulletInfo.forEach(item => {
            text += `${item.text.replace(/\n \n/g, ' || ')} `;
          });
          row.additionalDescBulletInfo = [
            {
              text: text.slice(0, -4),
            },
          ];
        }
  
        if (row.ratingCount) {
          row.ratingCount.forEach(item => {
            item.text = item.text ? item.text.replace(/[()]/g, '') : '';
          });
        }
        if (row.manufacturerImages) {
          row.manufacturerImages.forEach(item => {
            if(item.text.includes('https:')){
              item.text = item.text;
            }else{
              item.text = 'https:'+item.text;
            } 
          });
        }
        if (row.availabilityText) {
          row.availabilityText.forEach(item => {
            if (item.text.includes('Disponible')) {
              item.text = 'In Stock';
            } else {
              item.text = 'Out of Stock';
            }
          });
        }
      
        if (row.imageAlt) {
          row.imageAlt.forEach(item => {
            if (item.text) {
              item.text = item.text;
            } else {
              item.text = 'metaTag';
            }
          });
        }
      }
    }
    return data;
  };
  
  module.exports = { transform };
  