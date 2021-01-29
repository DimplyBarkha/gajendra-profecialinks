
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
    // function getIngredients(descText) {
    //     let result = descText.split('.')[0].concat('. ');
    //     descText.split('.').slice(1).forEach(item => {
    //         if (item.includes('Ingrediente')) {
    //             result += item.concat('. ');
    //         }
    //     });
    //     return result;
    // }

    function getWarnings(descText) {
        let wordIndex = descText.indexOf("Avvertenze");
        return descText.slice(wordIndex + 10);
        // return descText.substring(0,descText.indexOf('.')+1);
    }

    // function formatDesc(descText){

    //     if(descText.indexOf('INGREDIENTI') !== -1){
    //         let wordIndex = descText.indexOf("INGREDIENTI");
    //         descText = descText.slice(0,wordIndex)
    //     } else if(descText.indexOf('Ingredienti') !== -1){
    //         let wordIndex = descText.indexOf("Ingredienti");
    //         console.log(wordIndex);
    //         descText = descText.slice(0,wordIndex)
    //     }
    //     if(descText.indexOf('MODALIT') !== -1){
    //         let wordIndex = descText.indexOf("MODALIT");
    //         descText = descText.slice(0,wordIndex)
    //     } else if(descText.indexOf('Modalit') !== -1){
    //         let wordIndex = descText.indexOf("Modalit");
    //         descText = descText.slice(0,wordIndex)
    //     } else if(descText.indexOf('Modo') !== -1){
    //         let wordIndex = descText.indexOf("Modo");
    //         descText = descText.slice(0,wordIndex)
    //     }
    //     return descText;
    // }

    for (const { group } of data) {
        for (const row of group) {
            // if (row.description) {
            //     let desc = row.description[0].text;
            //     let xpath = row.description[0].xpath;

            //     // if (desc.includes('Ingredienti')) {
            //     //     row.ingredientsList = [{ text: getIngredients(desc.split('Ingredienti')[1]), xpath: xpath }];
            //     // }
            //     // else if (desc.includes('INGREDIENTI')) {
            //     //     row.ingredientsList = [{ text: getIngredients(desc.split('INGREDIENTI')[1]), xpath: xpath }];
            //     // }

            //     // if (desc.includes('Avvertenze')) {
            //     //     row.warnings = [{ text: getWarnings(desc), xpath: xpath }];
            //     //     // row.warnings = [{text: getWarnings(desc.split('Avvertenze')[1]), xpath: xpath}];
            //     // }

            //     // row.description[0].text = formatDesc(desc);
            // }

            if (row.availabilityText) {
                row.availabilityText[0].text = row.availabilityText[0].text == 'instock' ? 'In Stock' : 'Out of Stock';
            }

            // if (row.nameExtended) {
            //     var num = row.nameExtended[0].text.match(/\d+/g);
            //     if (typeof num !== 'undefined') {
            //         if (num != null) {
            //             var index = row.nameExtended[0].text.indexOf(num[num.length-1]);
            //             var temp = row.nameExtended[0].text.substring(index);
            //             row.quantity = [{text:temp.substring(0,temp.indexOf(' ')), xpath:row.nameExtended[0].xpath}];
            //         }
            //     }

            //     if(!row.nameExtended[0].text.startsWith(row.brandText[0].text)) {
            //         row.nameExtended[0].text = row.brandText[0].text.concat(' ',row.nameExtended[0].text);
            //     }
            // }

            // if (row.aggregateRating) {
            //     let json = JSON.parse(row.aggregateRating[0].text);
            //     if (json.name != 'Amicafarmacia') {
            //         row.aggregateRating[0].text = json.aggregateRating.ratingValue.replace('.', ',');
            //         row.ratingCount = [{ text: json.aggregateRating.ratingCount, xpath: row.aggregateRating[0].xpath }];
            //     }
            //     else {
            //         delete row.aggregateRating;
            //     }
            // }

            if (row.aggregateRating) {
                row.aggregateRating[0].text = row.aggregateRating[0].text.replace('.', ',');
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
                row.gtin = [{ text: result, xpath: xpath }];
            }

            if (row.sku) {
                let result = '';
                let xpath = '';
                row.sku.forEach(item => {
                    let json = JSON.parse(item.text);
                    if (typeof json[0] !== 'undefined') {
                        if (json[0].hasOwnProperty('gtin13')) {
                            result = json[0].gtin13;
                            xpath = item.xpath;
                        }
                    }
                });
                row.sku = [{ text: result, xpath: xpath }];
            }

            if (row.directions) {
                let result = '';
                let xpath = '';
                row.directions.forEach(item => {
                    result += item.text;
                    xpath = item.xpath;
                });
                row.directions = [{ text: result, xpath: xpath }];
            } else if (row.directions == null && row.description != null) {
                let descText = row.description[0].text;
                let xpath = row.description[0].xpath;
                if (descText.indexOf('MODALIT') !== -1) {
                    let wordIndex = descText.indexOf("MODALIT");
                    descText = descText.slice(wordIndex)
                } else if (descText.indexOf('Modalit') !== -1) {
                    let wordIndex = descText.indexOf("Modalit");
                    descText = descText.slice(wordIndex)
                } else if (descText.indexOf('Modo') !== -1) {
                    let wordIndex = descText.indexOf("Modo");
                    descText = descText.slice(wordIndex)
                }
                row.directions = [{ text: descText, xpath: xpath }];
            }

            if (row.warnings) {
                let result = '';
                let xpath = '';
                row.warnings.forEach(item => {
                    result += item.text;
                    xpath = item.xpath;
                });
                row.warnings = [{ text: result, xpath: xpath }];
            } else if (row.warnings == null && row.description != null) {
                let descText = row.description[0].text;
                let xpath = row.description[0].xpath;
                if (descText.includes('Avvertenze')) {
                    row.warnings = [{ text: getWarnings(descText), xpath: xpath }];
                    // row.warnings = [{text: getWarnings(desc.split('Avvertenze')[1]), xpath: xpath}];
                }

            }


            if (row.ingredientsList) {
                let result = '';
                let xpath = '';
                row.ingredientsList.forEach(item => {
                    result += item.text;
                    xpath = item.xpath;
                });
                row.ingredientsList = [{ text: result, xpath: xpath }];
            } else if (row.ingredientsList == null && row.description != null) {
                let desc = row.description[0].text;
                let xpath = row.description[0].xpath;
                if (desc.includes('Ingredienti')) {
                    row.ingredientsList = [{
                        text: (() => {
                            let wordIndex = desc.indexOf("Ingredienti");
                            return desc.slice(wordIndex + 11);
                        })(), xpath: xpath
                    }];
                }
                else if (desc.includes('INGREDIENTI')) {
                    row.ingredientsList = [{
                        text: (() => {
                            let wordIndex = desc.indexOf("INGREDIENTI");
                            return desc.slice(wordIndex + 11);
                        })(), xpath: xpath
                    }];
                }

            }

            if (row.name) {
                let title = row.name[0].text;
                let xpath = row.name[0].xpath;
                let titleArray = title.split(' ');
                let len = titleArray.length;
                if (!isNaN(titleArray[len - 2])) {
                    row.quantity = [{ text: titleArray[len - 2] + " " + titleArray[len - 1], xpath: xpath }];
                } else {
                    row.quantity = [{ text: titleArray[len - 1], xpath: xpath }];
                }
            }

            if (row.descriptionBullets && row.description != null) {
                let desc = row.description[0].text;
                if (row.descriptionBullets[0].text == '0') {
                    var patt = /- /g;
                    var result = desc.match(patt);
                    if (result != null) {
                        row.descriptionBullets[0].text = result.length;
                    }

                }
            }

            // if (row.variantId) {
            //     let words = row.variantId[0].text.split('"');
            //     let index = Number(words.indexOf('productId')) + 2;
            //     row.variantId[0].text = words[index];
            // }

            row.variantCount = [{ text: 1 }];
            row.imageZoomFeaturePresent = [{ text: "Yes" }];
        }
    }


    data.forEach(obj => obj.group.forEach(row => Object.keys(row).forEach(header => row[header].forEach(el => {
        if (typeof el.text !== 'undefined') {
            el.text = clean(el.text);
        }
    }))));
    return data;
};

module.exports = { transform };