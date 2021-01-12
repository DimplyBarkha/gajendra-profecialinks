const transform = (data) => {
    // Default transform function
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
    data.forEach(obj => obj.group.forEach(row => Object.keys(row).forEach(header => row[header].forEach(el => {
        el.text = clean(el.text);
    }))));

    // ingredientsList
    for (const { group }  of data) {
        for (const row of group) {

            if (row.brandLink) {
                row.brandLink.forEach(item => {
                    item.text = 'https://shop.rewe.de' + item.text.trim();
                });
            }

            if (row.shownImages) {
                row.shownImages.forEach(item => {
                    item.text = item.text.split('?')[0];
                });
            }

            if (row.highQualityImages) {
                row.highQualityImages.forEach(item => {
                    item.text = item.text.split('?')[0];
                });
            }

            if (row.ingredientsList) {
                row.ingredientsList.forEach(item => {
                    item.text = item.text.replace('Zutaten:');
                });
            }

            if (row.allergens) {
                row.allergens.forEach(item => {
                    item.text = item.text.replace('Allergenhinweise:');
                });
            }
            
            if (row.servingSize) {
                let servingSize = '';
                row.servingSize.forEach(item => {
                    servingSize = item.text.split(' ');
                    item.text = servingSize[servingSize.length - 1]
                });
            }
            if (row.nutritionInfo) {
                let nutritionInfo = [];
                row.nutritionInfo.forEach(item => {
                    nutritionInfo.push( item.text );
                });
                row.nutritionInfo = [ { text: nutritionInfo.join(' ') } ]
            }

        }
    }

    return data;
};

module.exports = { transform };