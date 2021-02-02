/**
 *
 * @param {ImportIO.Group[]} data
 * @returns {ImportIO.Group[]}
 */
const transform = (data) => {    
    for (const { group } of data) {
        for (const row of group) {                
            if (row.variantUrl) {
                row.variantUrl.forEach(item => {
                    item.text = "https://www.impo.ch/de/p/"+item.text;
                });
                if (row.variantUrl.length > 1) {
                  row.variantUrl.shift();
                }
            }
            if (row.variantId) {
              if (row.variantId.length > 1) {
                row.variantId.shift();
              }
            }
        }
    }    
    return data;
  };
  module.exports = { transform };