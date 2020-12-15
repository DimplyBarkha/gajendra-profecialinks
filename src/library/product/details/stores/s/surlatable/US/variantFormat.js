/**
 *
 * @param {ImportIO.Group[]} data
 * @returns {ImportIO.Group[]}
 */
const transform = (data) => {

    if (data[0].group[0].info) {
        let json = JSON.parse("[" + data[0].group[0].info[0].text + "]");
        let xpath = data[0].group[0].info[0].xpath;
        data[0].group = [];
        json.forEach(ele => {
            data[0].group.push({variantId:[{text:ele.sku, xpath: xpath}], variantUrl:[{text:ele.offers.url, xpath: xpath}]});
        });
        data[0].rows = json.length;
    }

    delete data[0].group[0].info; 

    return data;
};
    
module.exports = { transform };
  