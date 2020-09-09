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
                let data = JSON.parse(item.text);
                if(data['aspects']){                    
                    data['aspects'].forEach(variation => {
                      variation['variants'].forEach(variants_data => {
                        let tmp_variations = {};
                        tmp_variations["variantId"] = [];
                        tmp_variations["variantUrl"] = [];
                        tmp_variations["variant"] = [];

                        var link_data = variants_data['link']
                        tmp_variations["variantUrl"].push({"text": "https://www.ozon.ru" + link_data, "xpath": item["xpath"]});
                        var matches = /.+\/(\d+)\//isg.exec(link_data);
                        var matches1 = /.+-(\d+)\//isg.exec(link_data);
                        if (matches){
                          link_data = matches[1]
                        }
                        else if(matches1){
                          link_data = matches1[1]
                        }                        
                        if (!variations.includes(link_data)) {
                          tmp_variations["variantId"].push({"text": link_data, "xpath": item["xpath"]});
                          variations.push(link_data);

                          tmp_variations["variant"].push({"text": variants_data['data']['textRs'][0]['content'], "xpath": item["xpath"]});
                          final_variations.push(tmp_variations);
                        }
                        //if (variation['type'] == 'apparelPics' || variation['type'] == 'colors')  {                          
                        
                        //}
                        
                      });
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