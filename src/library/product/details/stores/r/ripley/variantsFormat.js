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
                    item.text = item.text.replace(/(\s*window.__PRELOADED_STATE__\s*=\s*)+/isg, '');
                    item.text = item.text.replace(/(\;)$/s, '');                    
                    let data = JSON.parse(item.text);
                    let p_url = '';
                    if(data['product']['product']['url']){
                        p_url = data['product']['product']['url'];
                    }
                    if(data['product']['product']['SKUs']){
                        data['product']['product']['SKUs'].forEach(variation => {
                        let tmp_variations = {};
                        tmp_variations["variantId"] = [];
                        tmp_variations["variantUrl"] = [];
                        tmp_variations["variant"] = [];

                        if (variation['partNumber']) {
                            tmp_variations["variantId"].push({"text": variation['partNumber'], "xpath": item["xpath"]});
                        }
                        let color_list = [];
                        variation['Attributes'].forEach(variants_data => {                            
                            if (variants_data['usage'] == 'Defining'){
                                let name = "";
                                variants_data['Values'].forEach(variants_sku => {                                    
                                    tmp_variations["variant"].push({"text": variants_sku['values'], "xpath": item["xpath"]});
                                    name = variants_sku['values'];
                                });
                                if (name != ''){
                                    color_list.push(variants_data['identifier']+"="+name);
                                }
                            }
                        });
                        if (color_list.length > 0 && p_url != ''){
                            let v_url = p_url + "?s=o&" + color_list.join("&");
                            tmp_variations["variantUrl"].push({"text": v_url, "xpath": item["xpath"]});
                        }
                        final_variations.push(tmp_variations);
                        });
                    }                                    
                });
            }
        }
    }    
    if(final_variations.length){
        data[0]["group"] = final_variations;
    }
    return data;
  };
  
  module.exports = { transform };