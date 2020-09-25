
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
        if (row.ratingCount) {
          row.ratingCount.forEach(item => {
            item.text = item.text ? item.text.replace(/[()]/g, '') : '';
          });
        }
        if (row.aggregateRating) {
          row.aggregateRating.forEach(item => {
            item.text = item.text.replace('.', ',');
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
            if (item.text.includes("M'alerter de la disponiblité produit")) {
              item.text = 'Out of Stock';
            } else{
              item.text = 'In Stock';
            }
          });
        }
      
        if (row.warranty) {
          let text = '';
          row.warranty.forEach(item => {
            text += `${item.text.replace(/\n \n/g, ' ')} |`;
          });
          row.warranty = [
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

        if (row.videos) {
          row.videos.forEach(item => {
              item.text = item.text+'.mp4';
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
            item.text = item.text ? item.text.split(' ')[0] : ' ';
          });
        }
        if (row.category) {
          row.category.pop();
        }  
      }
    }
    return data;
  };
  
  module.exports = { transform };
  