/**
 *
 * @param {ImportIO.Group[]} data
 * @returns {ImportIO.Group[]}
 */
const transform = (data) => {
    const cleanUp = (data, context) => {
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
        return data;
    };

    for (const { group } of data) {
        for (let row of group) {
            if (row.description) {
                let info = [];
                row.description.forEach(item => {
                    info.push(item.text.replace(/(\s*\n\s*)+/g, ' | ').trim());
                });

                row.description = [{ 'text': info.join(' | '), 'xpath': row.description[0].xpath }];
            }
            if (row.proteinPerServing) {
                let info = [];
                row.proteinPerServing.forEach(item => {
                    console.log("item.text", item.text);
                    if (item.text.includes('g')) {
                        console.log("item.text", item.text);
                        item.text = item.text.replace('g', '');
                    }
                    else if (item.text.includes('%')) {
                        console.log("item.text", item.text);
                        item.text = item.text.replace('%', '');
                    }
                    info.push(item.text);
                });
                row.proteinPerServing = [{ 'text': info.join(' | '), 'xpath': row.description[0].xpath }];
            }
            if (row.proteinPerServingUom) {
                let info = [];
                row.proteinPerServingUom.forEach(item => {
                    console.log("item.text", item.text);
                    if (item.text.includes('g')) {
                        console.log("item.text", item.text);
                        item.text = item.text.slice(-1);
                    }
                    else if (item.text.includes('%')) {
                        item.text = item.text.slice(-1);
                    }
                    else{
                        item.text = '';
                    }
                    info.push(item.text);
                });
                row.proteinPerServingUom = [{ 'text': info.join(' | '), 'xpath': row.description[0].xpath }];
            }
            if (row.sku) {
                let sku_number = [];
                row.sku.forEach(item => {
                    sku_number = item.text.split(":");
                });
                if (sku_number[1]) {
                    row.sku = [{ 'text': sku_number[1].trim(), 'xpath': row.sku[0].xpath }];
                }
            }

            if (row.variantId) {
                let variant_number = [];
                row.variantId.forEach(item => {
                    variant_number = item.text.split(":");
                });
                if (variant_number[1]) {
                    row.variantId = [{ 'text': variant_number[1].trim(), 'xpath': row.variantId[0].xpath }];
                }
            }
            if (row.brandText) {
                let brand = [];
                row.brandText.forEach(item => {
                    brand = item.text.split(" ");
                });
                if (brand[0]) {
                    row.brandText = [{ 'text': brand[0].trim(), 'xpath': row.brandText[0].xpath }];
                }
            }
        }
    }
    return cleanUp(data);
};

module.exports = { transform };