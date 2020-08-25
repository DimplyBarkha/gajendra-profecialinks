
/**
 *
 * @param {ImportIO.Group[]} data
 * @returns {ImportIO.Group[]}
 */
const transform = (data) => {
    for (const { group } of data) {
      for (const row of group) {
        // if (row.alternateImages) {
        //   row.alternateImages.forEach(item => {
        //     item.text= item.text.replace(/(100x100)/, '500X500');
        //   });
        // }
        if (row.brandText) {
          row.brandText.forEach(item => {
            item.text= item.text ? item.text.split(' ')[0] : '';
          });
        }
        if (row.description) {
          row.description.forEach(item => {
            item.text= item.text ? item.text.replace(/•(.*)<br>/gm) : '';
          });
        }
        if (row.alternateImages) {
          let primaryImg = '';
          if(row.image){
            row.image.forEach(item =>{
              primaryImg = item.text;
              console.log('primaryImg: ', primaryImg);
             })
          }
          let array = [];
          row.alternateImages.forEach(item =>{
          if(item.text !== primaryImg){
            array.push(item.text);
          }
          })
          // array = array.filter(item => item !== primaryImg);
          // @ts-ignore
          array = [...new Set(array)];
          row.alternateImages = [
            {
              text: array.join(' | '),
            },
          ];
        }

          if (row.image) {
          row.image.forEach(item => {
            item.text= item.text.replace(/(100x100)/, '500X500');
          });
        }
      }
    }
    return data;
  };
  
  module.exports = { transform };
  