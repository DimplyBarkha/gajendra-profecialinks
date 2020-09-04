/**
 *
 * @param {ImportIO.Group[]} data
 * @returns {ImportIO.Group[]}
 */
const transform = (data) => {
    let variations = [{}];
    for (const { group } of data) {
        for (const row of group) {    
            if (row.variantId) {
                row.variantId.forEach(item => {
                    let v_data = JSON.parse(item.text);
                    if(v_data['variations']){
                        variations[0]["variantId"] = [];
                        variations[0]["variantUrl"] = [];
                        v_data['variations'].forEach(variation => {
                            variations[0]["variantId"].push({"text": variation['sku'], "xpath": item["xpath"]});
                            variations[0]["variantUrl"].push({"text": "https://en-ae.namshi.com/" + variation['link'], "xpath": item["xpath"]});
                        });
                    }
                });
            }
        }
    }
    if(variations.length){
        data[0]["group"] = variations;
    }
    return data;
};
  
module.exports = { transform };