/**
 *
 * @param {ImportIO.Group[]} data
 * @returns {ImportIO.Group[]}
 */
const transform = (data) => {
    let variations = [];
    for (const { group } of data) {
        for (const row of group) {    
            if (row.variantId) {
                row.variantId.forEach(item => {
                    let v_data = JSON.parse(item.text);
                    if(v_data['variations']){
                        v_data['variations'].forEach(variation => {
                            let tmp_variations = {};
                            tmp_variations["variantId"] = [];
                            tmp_variations["variantUrl"] = [];                            
                            tmp_variations["variantId"].push({"text": variation['sku'], "xpath": item["xpath"]});
                            tmp_variations["variantUrl"].push({"text": "https://en-ae.namshi.com/" + variation['link'], "xpath": item["xpath"]});
                            variations.push(tmp_variations);
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