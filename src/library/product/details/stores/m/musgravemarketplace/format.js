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
            if (row.category) {
                let info = [];
                row.category.forEach(item => {
                    info.push(item.text.trim());
                });
                if (info.length) {
                    row.category = [];
                    info.forEach(item => {
                        row.category.push({ "text": item });
                    });
                }
            }
            if (row.descriptionBullets) {
                row.descriptionBullets = [{ 'text': row.descriptionBullets.length, 'xpath': row.descriptionBullets[0].xpath }];
            }
            if (row.description) {
                let info = [];
                row.description.forEach(item => {
                    info.push(item.text);
                });
                row.description = [{ 'text': info.join(' || '), 'xpath': row.description[0].xpath }];
                row.description[0].text = ' || ' + row.description[0].text;
            }
            if (row.directions) {
                let info = [];
                row.directions.forEach(item => {
                    info.push(item.text);
                });
                row.directions = [{ 'text': info.join(' || '), 'xpath': row.directions[0].xpath }];
                row.directions[0].text = ' || ' + row.directions[0].text;
            }
            if (row.sku) {
                row.sku.forEach(item => {
                    item.text = item.text.match(/\d/g);
                    item.text = String(item.text).replace(/\,/g,''); 
                });
            }
            if (row.variantId) {
                row.variantId.forEach(item => {
                    item.text = item.text.match(/\d/g);
                    item.text = String(item.text).replace(/\,/g,''); 
                });
            }
            if (row.image) {
                row.image.forEach(item => {
                    item.text = 'https://order.musgravemarketplace.ie/' + item.text
                });
            }
        }
    }
    return cleanUp(data);
};

module.exports = { transform };