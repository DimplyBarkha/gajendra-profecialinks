
/**
 *
 * @param {ImportIO.Group[]} data
 * @returns {ImportIO.Group[]}
 */
const transform = (data) => {
    const clean = text => text.toString()
    .replace(/\r\n|\r|\n/g, ' ')
    .replace(/&amp;nbsp;/g, ' ')
    .replace(/&amp;#160/g, ' ')
    .replace(/\u00A0/g, ' ')
    .replace(/\s{2,}/g, ' ')
    .replace(/"\s{1,}/g, '"')
    .replace(/\s{1,}"/g, '"')
    .replace(/^ +| +$|( )+/g, ' ')
    // eslint-disable-next-line no-control-regex
    .replace(/[\x00-\x1F]/g, '')
    .replace(/[\uD800-\uDBFF][\uDC00-\uDFFF]/g, ' ');

    /**
     * @param {string} descText
     * @returns {string}
     */
    function getIngredients(descText) {
        let result = descText.split('.')[0].concat('. ');
        descText.split('.').slice(1).forEach(item => {
            if (item.includes('Ingrediente')) {
                result += item.concat('. ');
            }
        });
        return result;
    }

    for (const { group } of data) {
        for (const row of group) {
            if (row.description) {
                let desc = row.description[0].text;
                let xpath = row.description[0].xpath;
                if (desc.includes('Ingredienti')) {
                    row.ingredientsList = [{text: getIngredients(desc.split('Ingredienti')[1]), xpath: xpath}];
                } 
                else if (desc.includes('INGREDIENTI')) {
                    row.ingredientsList = [{text: getIngredients(desc.split('INGREDIENTI')[1]), xpath: xpath}];
                }
            }
            
            if (row.availabilityText) {
                row.availabilityText[0].text = row.availabilityText[0].text == 'instock' ? 'In Stock' : 'Out of Stock';
            }

            if (row.nameExtended) {
                var num = row.nameExtended[0].text.match(/\d+/g);
                if (typeof num !== 'undefined') {
                    if (num != null) {
                        var index = row.nameExtended[0].text.indexOf(num[num.length-1]);
                        var temp = row.nameExtended[0].text.substring(index);
                        row.quantity = [{text:temp.substring(0,temp.indexOf(' ')), xpath:row.nameExtended[0].xpath}];
                    }
                }
            }

            if (row.aggregateRating) {
                let json = JSON.parse(row.aggregateRating[0].text);
                if (json.name != 'Amicafarmacia') {
                    row.aggregateRating[0].text = json.aggregateRating.ratingValue;
                    row.ratingCount = [{text: json.aggregateRating.ratingCount, xpath: row.aggregateRating[0].xpath}];
                }
                else {
                    delete row.aggregateRating;
                }
            }

            if (row.gtin) {
                let result = '';
                let xpath = '';
                row.gtin.forEach(item => {                    
                    let json = JSON.parse(item.text);
                    if (typeof json[0] !== 'undefined') {
                        if (json[0].hasOwnProperty('gtin13')) {
                            result = json[0].gtin13;
                            xpath = item.xpath;
                        }
                    }
                });
                row.gtin = [{text: result, xpath: xpath}];                           
            }

            if (row.variantId) {
                let words = row.variantId[0].text.split('"');
                let index = Number(words.indexOf('productId')) + 2;
                row.variantId[0].text = words[index];
            }

            row.variantCount = [{text: 1}];
            row.imageZoomFeaturePresent = [{text: "Yes"}];
        }
    }


    data.forEach(obj => obj.group.forEach(row => Object.keys(row).forEach(header => row[header].forEach(el => {
        if (typeof el.text!=='undefined') {
            el.text = clean(el.text);
        }
    }))));
    return data;
  };
  
  module.exports = { transform };