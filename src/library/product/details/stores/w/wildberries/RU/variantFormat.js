/**
 *
 * @param {ImportIO.Group[]} data
 * @returns {ImportIO.Group[]}
 */
const transform = (data) => {    
    for (const { group } of data) {
        for (const row of group) {                
            if (row.variantId) {
                row.variantId.forEach(item => {
                    item.text = item.text.replace("/catalog/", '');
                    item.text = item.text.substr(0, item.text.indexOf("detail")-1);
                });
            }
            if (row.variantUrl) {
                row.variantUrl.forEach(item => {
                    item.text = "https://www.wildberries.ru"+item.text;
                });
            }
            if (row.variant) {
                let variantsInfo = [];
                row.variant.forEach(item => {
                    item.text = item.text.replace("/catalog/", '');
                    item.text = item.text.substr(0, item.text.indexOf("detail")-1);
                    variantsInfo.push(item.text.trim());
                });
                row.variant = [{'text':variantsInfo.join(' | '),'xpath':row.variant[0].xpath}];
            }
        }
    }    
    return data;
  };
  module.exports = { transform };