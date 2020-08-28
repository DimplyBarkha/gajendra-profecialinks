
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
              text: text,
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
  
        if (row.aggregateRatingText) {
          row.aggregateRatingText.forEach(item => {
            item.text = item.text ? item.text.replace('-', '.') : '';
          });
        }
        if (row.availabilityText) {
          row.availabilityText.forEach(item => {
            if((item.text.includes("Disponible")) || (item.text.includes("Ajouter au panier"))){
              item.text = "Disponible";
            }
          });
        }
        if (row.category) {
          row.category.pop();
        }
        if (row.ratingCount) {
          row.ratingCount.forEach(item => {
            item.text = item.text ? item.text.replace(/[()]/g, '') : '';
          });
        }
        if (row.variantCount) {
          row.variantCount.forEach(item => {
            if(item.text > 1){
             item.text = item.text
            }else{
              item.text = 1;
            }
          });
        }
        if (row.brandText) {
          row.brandText.forEach(item => {
            item.text = item.text ? item.text.split(' ')[0] : '';
          });
        }
        if (row.manufacturerDescription) {
          row.manufacturerDescription.forEach(item => {
            item.text = item.text ? item.text.replace(/(\s*[\r\n]\s*)+/g, ' ').trim() : '';
          });
        }
        if (row.videos) {
          row.videos.forEach(item => {
            item.text = item.text ? item.text.replace(/(\s*[\r\n]\s*)+/g, ' ').trim() : '';
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
        // if (row.availabilityText) {
        //   row.availabilityText.forEach(item => {
        //     if (item.text.includes('Disponible')) {
        //       item.text = 'In Stock';
        //     } else {
        //       item.text = 'Out of Stock';
        //     }
        //   });
        // }
      
        if (row.imageAlt) {
          row.imageAlt.forEach(item => {
            if (item.text) {
              item.text = item.text;
            } else {
              item.text = 'metaTag';
            }
          });
        }
        if (row.alternateImages) {
          row.alternateImages.shift();
        }
      }
    }
    return data;
  };
  
  module.exports = { transform };
  