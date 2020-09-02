/**
*
* @param {ImportIO.Group[]} data
* @returns {ImportIO.Group[]}
*/
const transform = (data, context) => {
    for (const { group } of data) {
      for (const row of group) {
        if (row.specifications) {
          let text = '';
          row.specifications.forEach(item => {
            text += `${item.text.replace(/\n \n/g, ' : ')} || `;
          });
          row.specifications = [
            {
              text: text,
            },
          ];
        }
        if (row.image) {
          row.image.forEach(item => {
            if(item.text.includes('https:')){
             item.text = item.text;
            }else{
             item.text = 'https:'+item.text; 
            }
          });
        }
        if (row.aggregateRating) {
          row.aggregateRating.forEach(item => {
            item.text = item.text.replace('.',',');
          });
        }
      }
    }
    return data;
  };
  
  module.exports = { transform };
  