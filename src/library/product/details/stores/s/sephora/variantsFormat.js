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
            let v_url = '';
            let v_url_xpath = '';
            let v_id = [];
            let v_data = [];
            let v_xpath = [];
            if (row.variantUrl) {
                row.variantUrl.forEach(item => {
                    v_url = item.text;
                    v_url_xpath = item.xpath;
                });
            }
            if (row.variantId) {
                row.variantId.forEach(item => {
                    v_id.push(item.text)
                    v_xpath.push(item.xpath)
                });
            }
            if (row.variant) {
                row.variant.forEach(item => {
                    v_data.push(item.text)
                });
            }
            v_id.forEach((v_item,index) => {
            
                let tmp_variations = {};
                tmp_variations["variantId"] = [];
                tmp_variations["variantUrl"] = [];
                tmp_variations["variant"] = [];
    
                            
                tmp_variations["variantUrl"].push({"text": v_url, "xpath": v_url_xpath});
                tmp_variations["variantId"].push({"text": v_id[index], "xpath": v_xpath[index]});
                tmp_variations["variant"].push({"text": v_data[index], "xpath": v_xpath[index]});
                final_variations.push(tmp_variations);
            });            
                          
                         
                
            
        }
    }
    if(final_variations.length){
        data[0]["group"] = final_variations;
    }
    return data;
  };
  
  module.exports = { transform };