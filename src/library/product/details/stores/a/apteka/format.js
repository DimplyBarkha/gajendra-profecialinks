/* eslint-disable indent */
/**
 *
 * @param {ImportIO.Group[]} data
 * @returns {ImportIO.Group[]}
 */
const transform = (data) => {
    const clean = text => text.toString().replace(/\r\n|\r|\n/gm, ' ')
        .replace(/&amp;nbsp;/g, ' ')
        .replace(/&amp;#160/g, ' ')
        .replace(/\u00A0/g, ' ')
        .replace(/\s{2,}/g, ' ')
        .replace(/"\s{1,}/g, '"')
        .replace(/\s{1,}"/g, '"')
        .replace(/^ +| +$|( )+/g, ' ')
        // eslint-disable-next-line no-control-regex
        .replace(/[^\x00-\x7F]/g, '');

    for (const { group } of data) {
        for (const row of group) {
            if (row.price) {
                row.price.map(item => {
                    item.text = item.text + 'руб.';
                });
            }
            if (row.listPrice) {
                row.listPrice.map(item => {
                    item.text = item.text + 'руб.';
                });
            }
            if (row.imageZoomFeaturePresent) {
                row.imageZoomFeaturePresent.map(item => {
                    item.text = item.text ? 'Yes' : 'No';
                });
            }
            if (row.variantInformation) {
                row.variantInformation.map(item => {
                    item.text = item.text.replace(':', '');
                });
            }
            if (row.availabilityText) {
                row.availabilityText = [{
                    text: 'Out of Stock',
                }];
            } else {
                row.availabilityText = [{
                    text: 'In Stock',
                }];
            }
            if (row.subCategory) {
                row.subCategory.forEach(item => {
                    row.category.push(item);
                });
            }
            // Object.keys(row).forEach(header => row[header].forEach(el => {
            //     el.text = clean(el.text);
            // }));
        }
        return data;
    };
};
module.exports = { transform };
