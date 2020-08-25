
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
            text += `${item.text.replace(/\n \n/g, ' : ')} || `;
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
  
        if (row.ratingCount) {
          row.ratingCount.forEach(item => {
            item.text = item.text ? item.text.replace(/[()]/g, '') : '';
          });
        }
        // if (row.manufacturerImages) {
        //   row.manufacturerImages.forEach(item => {
        //     if(item.text.includes('https:')){
        //       item.text = item.text;
        //     }else{
        //       item.text = 'https:'+item.text;
        //     } 
        //   });
        // }
        if (row.availabilityText) {
          row.availabilityText.forEach(item => {
            if (item.text.includes('Ajouter au panier')) {
              item.text = 'In Stock';
            } else {
              item.text = 'Out of Stock';
            }
          });
        }
      
        // if (row.imageAlt) {
        //   row.imageAlt.forEach(item => {
        //     if (item.text) {
        //       item.text = item.text;
        //     } else {
        //       item.text = 'metaTag';
        //     }
        //   });
        // }

        if (row.name) {
          let text = '';
          row.name.forEach(item => {
            if (item.text) {
              text += `${item.text}  `;
            }
          });
          row.name = [
            {
              text: text,
            },
          ];
        }

        if (row.price) {
          row.price.forEach(item => {
            if (item.text) {
              item.text = item.text.replace('€', ',')
            }
          });
        }

        if (row.listPrice) {
          row.listPrice.forEach(item => {
            if (item.text) {
              item.text = item.text.replace('€', ',')
            }
          });
        }

        if (row.brandText) {
          row.brandText.forEach(item => {
            item.text = item.text ? item.text.split(' ')[0] : '';
          });
        }

         if (row.technicalInformationPdfPresent) {
          row.technicalInformationPdfPresent.forEach(item => {
            if(item.text.includes('https:')){
              item.text = item.text;
            }else{
              item.text = 'https:'+item.text;
            } 
          });
        }
        
      }
    }
    return data;
  };
  
  module.exports = { transform };
  