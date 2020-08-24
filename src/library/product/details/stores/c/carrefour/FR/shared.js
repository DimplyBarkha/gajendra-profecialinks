
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
              if(item.text.includes('https:')){
                item.text = item.text;
              }else{
                item.text = 'https:'+item.text;
              } 
            });
          }
          if (row.videos) {
            row.videos.forEach(item => {
              item.text = item.text.replace(/\\/g, "");
              if(item.text.includes('https:')){
                item.text = item.text;
              }else{
                item.text = 'https:'+item.text;
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
      }
    }
    return data;
  };
  
  module.exports = { transform };
  