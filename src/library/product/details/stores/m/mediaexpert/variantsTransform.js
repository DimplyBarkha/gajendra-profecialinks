
/**
 *
 * @param {ImportIO.Group[]} data
 * @returns {ImportIO.Group[]}
 */
const transform = (data) => {
    for (const { group } of data) {
      for (const row of group) {
        if(row.variantUrl){
          row.variantUrl.forEach(item => {
            item.text='https://www.mediaexpert.pl'+item.text;
          });
        }
      }
    }
    return data;
  };
  
  module.exports = { transform };
  