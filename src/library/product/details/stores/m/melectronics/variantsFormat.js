/**
 *
 * @param {ImportIO.Group[]} data
 * @returns {ImportIO.Group[]}
 */
const transform = (data) => {
  let final_variations = [];  
  for (const { group } of data) {
      for (const row of group) {    
          if (row.variantId) {
              row.variantId.forEach(item => {
                var matches = /window.__INITIAL_STATE__\s+=\s*(.*?\})\;/isg.exec(item.text);
                if (matches) {
                  var match_data = matches[1].replace(/(undefined)+/g, 'null');
                  let j_data = JSON.parse(match_data);                  
                  j_data['product']['data']['variantMatrix'];
                  if(j_data['product']['data']['variantMatrix'] && j_data['product']['data']['variantMatrix'].length > 0){                    
                    j_data['product']['data']['variantMatrix'].forEach(variants_data => {                        
                      let tmp_variations = {};
                      tmp_variations["variantId"] = [];
                      tmp_variations["variantUrl"] = [];
                      tmp_variations["variant"] = [];
                      if(variants_data['variantOption']['code']){
                        tmp_variations["variantId"].push({"text": variants_data['variantOption']['code'], "xpath": item["xpath"]});                            
                      }
                      if(variants_data['variantOption']['url']){
                        tmp_variations["variantUrl"].push({"text": "https://www.melectronics.ch" + variants_data['variantOption']['url'], "xpath": item["xpath"]});
                      }
                      if(variants_data['variantValueCategory']['name']){
                        tmp_variations["variant"].push({"text": variants_data['variantValueCategory']['name'], "xpath": item["xpath"]});
                      }
                      final_variations.push(tmp_variations);
                    });
                  }
                  else{
                    item.text = '';
                    //delete item.variantId;
                  }
                } else{
                  item.text = '';
                  //delete item.variantId;
                }
              });
          }
      }
  }
  if(final_variations.length){
      data[0]["group"] = final_variations;
      return data;
  }
  else{
    return [];
  }
  
};

module.exports = { transform };