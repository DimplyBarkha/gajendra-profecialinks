
/**
 *
 * @param {ImportIO.Group[]} data
 * @returns {ImportIO.Group[]}
 */
const transform = (data) => {
    for (const { group } of data) {
      for (const row of group) {

        if (row.price) {
          row.price.forEach(item => {
            item.text = item.text.replace('.',',');
          });
        }
        if (row.listPrice) {
            row.listPrice.forEach(item => {
              item.text = item.text.replace('.',',');
            });
          }
          if (row.alternateImages) {
            row.alternateImages.shift(); 
          }
          if (row.manufacturerImages) {
            row.manufacturerImages.forEach(item => {
              if((item.text.includes('https:')) ||(item.text.includes('http:'))){
                item.text = item.text;
              }else{
                item.text = 'https:'+item.text;
              } 
            });
          }
          if (row.videos) {
            row.videos.forEach(item => {
              item.text = item.text.replace(/\\/g, "");
              if((item.text.includes('https:'))|| (item.text.includes('https:'))){
                item.text = item.text+'.mp4';
              }else{
                item.text = 'https:'+item.text+'.mp4';
              } 
            });
          }
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
          if (row.availabilityText) {
            row.availabilityText.forEach(item => {
              if((item.text.includes('InStoreOnly')) || (item.text.includes('Product to be collected in store in 2 hours'))){
                item.text = 'In Stock';
              }else{
                item.text = 'Out Of Stock';
              } 
            });
          }
          if (row.category) {
            row.category.pop(); 
          }
          if (row.nameExtended) {
            row.nameExtended.forEach(item => {
              if(item.text){
                item.text = item.text.replace(/\n/g,'-');
              } 
            });
          }
          if (row.description) {
            let text = '';
            row.description.forEach(item => {
              text += `${item.text} | `;
            });
            row.description = [
              {
                text: text,
              },
            ];
          }
      }
    }
    return data;
  };
  
  module.exports = { transform };
  