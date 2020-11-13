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
                    var matches = /\s*__NEXT_DATA__\s*=\s*(.*)\;\s*__NEXT_LOADED_PAGES/isg.exec(item.text);
                    if (matches){
                        item.text = matches[1];
                        try {
                            let j_data = JSON.parse(item.text);
                            let p_url = '';
                            if (j_data['props']['initialStoreState']['detail']['product']['summary']['productURI']){
                                p_url = j_data['props']['initialStoreState']['detail']['product']['summary']['productURI'];
                            }
                            if (j_data['props']['initialStoreState']['detail']['product']['summary']['variants']){
                                j_data['props']['initialStoreState']['detail']['product']['summary']['variants'].forEach(variation => {
                                let tmp_variations = {};
                                tmp_variations["variantId"] = [];
                                tmp_variations["variantUrl"] = [];
                                tmp_variations["variant"] = [];

                                if (variation['id']) {
                                    tmp_variations["variantId"].push({"text": variation['id'], "xpath": item["xpath"]});
                                    if (p_url != ''){
                                        var matches = /(.+-).*/isg.exec(p_url);
                                        if (matches){
                                            p_url = matches[1];
                                            let v_url = "https://www.globus.ch" + p_url +  variation['id'].toLowerCase();
                                            tmp_variations["variantUrl"].push({"text": v_url, "xpath": item["xpath"]});
                                        }
                                    }
                                    
                                }
                                if (variation['name']){                                    
                                    tmp_variations["variant"].push({"text": variation['name'], "xpath": item["xpath"]});
                                }
                                final_variations.push(tmp_variations);
                                });
                            }
                        } catch (error) {
                            console.log(error.message);
                            delete row.variantId;
                        }
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