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
            if (row.aggregateRating) {
                row.aggregateRating.map(item => {
                    item.text = item.text.replace('.', ',');
                });
            }
            if (row.availabilityText) {
                row.availabilityText = [{ text: 'In Stock' }];
            }
            if (row.price) {
                row.price.map(item => {
                    item.text = item.text.replace('.', ',') + 'EUR';
                });
            }
            if (row.imageZoomFeaturePresent) {
                row.imageZoomFeaturePresent.map(item => {
                    item.text = parseInt(item.text) ? 'Yes' : 'No';
                });
            }
            if (row.listPrice) {
                row.listPrice.map(item => {
                    item.text = item.text.replace('.', ',') + 'EUR';
                });
            }
            if (row.specifications) {
                row.specifications = [{ text: row.specifications.map((item, index) => item.text + (index === (row.specifications.length - 1) ? '' : ' || ')).join('') }];
            }
            if (row.additionalDescBulletInfo) {
                row.additionalDescBulletInfo = [{ text: row.additionalDescBulletInfo.map((item, index) => item.text + (index === (row.additionalDescBulletInfo.length - 1) ? '' : ' || ')).join('') }];
            }
            if (row.description) {
                row.description = [{ text: row.description.map(item => item.text + ' || ').join('') }];
            }
            Object.keys(row).forEach(header => row[header].forEach(el => {
                if (row.nameExtended) {
                    return el.text;
                } else {
                    el.text = clean(el.text);
                }
            }));
        }
    }
    return data;
};

module.exports = { transform };
