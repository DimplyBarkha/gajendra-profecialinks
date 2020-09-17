/**
 *
 * @param {ImportIO.Group[]} data
 * @returns {ImportIO.Group[]}
 */
const transform = (data) => {
    for (const { group }
        of data) {
        for (const row of group) {
            if (row.availabilityText) {
                let text = '';
                row.availabilityText.forEach(item => {
                    if (item.text === 'InStock') {
                        text = 'In Stock';
                    } else {
                        text = 'Out Of Stock';
                    }
                });
                row.availabilityText = [{ text }];
            }
            if (row.shippingDimensions) {
                let ship = '';
                row.shippingDimensions.forEach(item => {
                    ship = item.text.replace(/\n/g, ':')
                    item.text = ship;
                });
            }
            // if (row.manufacturer) {
            //     let manu = '';
            //     row.shippingDimensions.forEach(item => {
            //         manu = item.text.replace(/Manufactured by:/, '')
            //         item.text = manu;
            //     });
            // }
        }
    }
    // Clean up data
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

module.exports = { transform };