/**
 *
 * @param {ImportIO.Group[]} data
 * @returns {ImportIO.Group[]}
 */
const transform = (data) => {
    let variations = [];
    for (const { group } of data) {
      for (const row of group) {
        var variant_url;
        if (row.variantUrl) {
            row.variantUrl.forEach(item => {
                variant_url = item.text;
            });
        }
        if (row.variantId) {
          row.variantId.forEach(item => {
            let tmp_variations = {};
            tmp_variations["variantId"] = [];
            tmp_variations["variantUrl"] = [];
            var variant_id = item.text.replace(/.+\/(.+?)_.+/g, '$1').trim();
            tmp_variations["variantId"].push({"text": variant_id, "xpath": item["xpath"]});
            tmp_variations["variantUrl"].push({"text": variant_url.replace(/\/N(.+?)\//g, "/" + variant_id + "/").trim(), "xpath": item["xpath"]});
            variations.push(tmp_variations);            
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