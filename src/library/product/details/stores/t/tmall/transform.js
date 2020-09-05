/**
 *
 * @param {ImportIO.Group[]} data
 * @returns {ImportIO.Group[]}
 */
const transform = (data) => {
    for (const { group } of data) {
      for (const row of group) {
        
        if(row.alternateImages){
          row.alternateImages.forEach(item => {
              var tmpURL=item.text.replace("_50x50.jpg", "");;
            item.text=tmpURL;
          });
        }
      }
    }
    return data;
  };
  
  module.exports = { transform };
  