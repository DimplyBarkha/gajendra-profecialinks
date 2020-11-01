
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
                if (desc.includes('ingredienti')) {
                    row.description[0].text = desc.split('ingredienti')[0];
                    if (desc.split('ingredienti').length > 1) {
                        row.ingredientsList = [{text: getIngredients(desc.split('ingredienti')[1]), xpath: xpath}];
                    }
                }
                else if (desc.includes('Ingredienti')) {
                    row.description[0].text = desc.split('Ingredienti')[0];
                    if (desc.split('Ingredienti').length > 1) {
                        row.ingredientsList = [{text: getIngredients(desc.split('Ingredienti')[1]), xpath: xpath}];
                    }
                } else {
                    row.description[0].text = desc.split('INGREDIENTI')[0];
                    if (desc.split('INGREDIENTI').length > 1) {
                        row.ingredientsList = [{text: getIngredients(desc.split('INGREDIENTI')[1]), xpath: xpath}];
                    }
                }
            }
            
            if (row.availabilityText) {
                row.availabilityText[0].text = row.availabilityText[0].text == 'instock' ? 'In Stock' : 'Out of Stock';
            }

            if (row.quantity) {
                let char = row.quantity[0].text.split(' ');
                row.quantity[0].text = char[(char.length-1)].trim();
            }

            if (row.aggregateRating) {
                let json = JSON.parse(row.aggregateRating[0].text);
                row.aggregateRating[0].text = json.aggregateRating.ratingValue;
                row.ratingCount = [{text: json.aggregateRating.ratingCount, xpath: row.aggregateRating[0].xpath}];
            }

            row.variantCount = [{text: 1}];
            row.imageZoomFeaturePresent = [{text: "Yes"}];
        }
    }


    data.forEach(obj => obj.group.forEach(row => Object.keys(row).forEach(header => row[header].forEach(el => {
        el.text = clean(el.text);
    }))));
    return data;
  };
  
  module.exports = { transform };