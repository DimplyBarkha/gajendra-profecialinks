/**
 *
 * @param {ImportIO.Group[]} data
 * @returns {ImportIO.Group[]}
 */
const transform = (data) => {
    for (const { group } of data) {
        for (const row of group) {
            if (row.specifications) {
                let specs = '';
                let xpath = ''
                for (const item of row.specifications) {
                    specs += item.text.replace('\n', ':') + ' || ';
                    xpath = item.xpath;
                }
                row.specifications = [{ text: specs, xpath: xpath }];
            }
            if (row.availabilityText) {
                let stockPos = row.availabilityText[0].text;
                if (stockPos == "inStock")
                    stockPos = "In Stock";
                else if (stockPos == "outOfStock")
                    stockPos = "Out Of Stock";

                row.availabilityText[0].text = stockPos;
            }
        }
    }
    return data;
};

module.exports = { transform };