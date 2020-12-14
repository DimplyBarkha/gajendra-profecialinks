/**
 *
 * @param {ImportIO.Group[]} data
 * @returns {ImportIO.Group[]}
 */
const url1 = require('url');
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

    for (const { group }  of data) {
        for (const row of group) {

          // if (row.price) {
          //   row.price.forEach(item => {
          //     item.text = item.text.replace('€', '');
          //   });
          // }
          // if (row.listPrice) {
          //   row.listPrice.forEach(item => {
          //     item.text = item.text.replace('€', '');
          //   });
          // }
          if (row.availabilityText) {
            row.availabilityText.forEach(item => {
              item.text = ('Ajouter Produit' === item.text ) ? 'In stock' : 'Out of stock';
            });
          }
          if (row.priceCurrency) {
            row.priceCurrency.forEach(item => {
              item.text = ( item.text.includes('€') ) ? 'EUR' : 'GBP';
            });
          }
          if (row.category) {
            let text = '';
            let element = '';
            let category = [];
            row.category.forEach(item => {
              element = item.text.replace('>', '');
              category.push({text:element });
            });
            row.category = category;
          }
        }
    }
    return data;
};

module.exports = { transform };