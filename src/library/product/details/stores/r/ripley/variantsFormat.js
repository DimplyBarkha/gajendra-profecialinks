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
                    let att_data = [];
                    if(data['product']['product']['definingAttributes']){
                        data['product']['product']['definingAttributes'].forEach(att_variation => {                    
                            if (att_variation['values']){
                                att_variation['values'].forEach(variants_data => {                        
                                    if (variants_data['values']){                          
                                        let key = variants_data['values'].toLowerCase()+'_'+variants_data['identifier'].toLowerCase();
                                        att_data[key] = variants_data['slug'];
                                    }                        
                                });
                            }
                        });
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
                                    name = variants_sku['values'].toLowerCase();
                                });
                                if (name != ''){
                                    let v_key = name+'_'+variants_data['identifier'].toLowerCase();
                                    if (att_data[v_key]){
                                        color_list.push(variants_data['identifier']+"="+att_data[v_key]);
                                    }
                                }
                            }
                        });
                        if (color_list.length > 0 && p_url != ''){                            
                            let variant_sku = color_list.join(", ");
                            tmp_variations["variant"].push({"text": variant_sku, "xpath": item["xpath"]});
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