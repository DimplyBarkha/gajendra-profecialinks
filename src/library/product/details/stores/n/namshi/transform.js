
/**
 *
 * @param {ImportIO.Group[]} data
 * @returns {ImportIO.Group[]}
 */
const transform = (data) => {
    for (const { group } of data) {
        for (const row of group) {
            if (row.specifications) {
                row.specifications.forEach(item => {
                    item.text = item.text.replace(/\n\s*\n\s*\n\s*\n\s*/g, ' || ').trim();
                    item.text = item.text.replace(/\n\s*\n\s*/g, ' : ').trim();
                });
            }
            if (row.description) {
                row.description.forEach(item => {
                    item.text = item.text.replace(/\n/g, ' || ').trim();
                });
            }
            if (row.category) {
                row.category.forEach(item => {
                    var category = item.text.replace(/\s*\n\s*\n\s*/g, '').trim();
                    var category_arr = category.split(" >");
                    category_arr.splice(0,1);
                    category_arr.splice(category_arr.length-1,1);
                    item.text = category_arr.join(" > ");
                });
            }
            if (row.variantInformation) {
                let info = [];
                row.variantInformation.forEach(item => {
                    info.push(item.text);
                });
                if(info.length){
                    row.variantInformation = [{"text": info.join(' | '), "xpath": row.variantInformation[0]["xpath"]}];
                }else{
                    delete row.variantInformation;
                }
            }
            if (row.alternateImages) {
                let info = [];
                row.alternateImages.forEach(item => {
                    item.text = item.text.replace(/cart\./g, 'zoom-desktop.').trim();
                });
            }            
            if (row.variants) {
                let variations = [];
                let color = null;
                row.variants.forEach(item => {
                    let data = JSON.parse(item.text);
                    if(data['variations']){
                        data['variations'].forEach(variation => {
                            variations.push(variation['sku']);
                        });
                    }
                    color = data['attributes']['color'];
                });
                if(color){
                    row.color = [{"text": color, "xpath": row.variants[0]["xpath"]}];
                }
                if(variations.length){
                    row.variantId = data['sku'];
                    row.variantCount = [{"text": variations.length, "xpath": row.variants[0]["xpath"]}];
                    row.variants = [{"text": variations.join(' | '), "xpath": row.variants[0]["xpath"]}];
                }else{
                    delete row.variants;
                }
                if (row.ratingCount) {
                    row.ratingCount.forEach(item => {
                        item.text = item.text;
                    });
                }
                if (row.aggregateRating) {
                    row.aggregateRating.forEach(item => {
                        item.text = item.text;
                    });
                }
            }
        }
    }
    return data;
};
  
  module.exports = { transform };
  