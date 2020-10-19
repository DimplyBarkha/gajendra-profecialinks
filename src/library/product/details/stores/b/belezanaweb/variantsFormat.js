/**
 *
 * @param {ImportIO.Group[]} data
 * @returns {ImportIO.Group[]}
 */
const transform = (data) => {
    let final_variations = [];
    let variations = [];
    for (const { group } of data) {
        for (const row of group) {    
            
            if (row.variantId) {
                row.variantId.forEach(item => {
                    let j_data = JSON.parse(item.text);
                    let sku = j_data["values"];
                    sku = sku.replace(/(\s*sku\;\s*)+/isg, '').trim();
                    item.text = sku;
                });
            }
        }
    }    
    return data;
  };
  
  module.exports = { transform };