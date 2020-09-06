/**
 *
 * @param {ImportIO.Group[]} data
 * @returns {ImportIO.Group[]}
 */
const transform = (data) => {
    for (const { group } of data) {
      for (const row of group) {
        if (row.variantId) {
          row.variantId.forEach(item => {
            
            //item.text = item.text.substring(item.text.lastIndexOf("/") + 1, item.text.length);
            var splitData = item.text.split('-');
            item.text = splitData[splitData.length-1];          
          });
        }   
    }
}
    return data;
  };
  
  module.exports = { transform };