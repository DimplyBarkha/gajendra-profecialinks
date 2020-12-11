/**
 *
 * @param {ImportIO.Group[]} data
 * @returns {ImportIO.Group[]}
 */

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

          if (row.price) {
            row.price.forEach(item => {
              item.text = item.text.replace('£', ' ').trim();
            });
          }
          if (row.listPrice) {
            row.listPrice.forEach(item => {
              item.text = item.text.replace('£', ' ').trim();
            });
          }
          if (row.availabilityText) {
            row.availabilityText.forEach(item => {
              console.log('Availa', item.text);
              item.text = ('Add' === item.text ) ? 'In stock' : 'Out of stock';
            });
          }
          if (row.priceCurrency) {
            row.priceCurrency.forEach(item => {
              item.text = ( item.text.includes('£') ) ? 'GBP' : 'EURO';
            });
          }
          if (row.shownImages) {
            row.shownImages.forEach(item => {
              let element = item.text.split(',');
              item.text = element[element.length-1].split(' ')[0];
            });
          }
          if (row.highQualityImages) {
            // console.log('HighQualityImages=>', row.highQualityImages);
            row.highQualityImages.forEach(item => {
              let element1 = item.text.split(',');
              item.text = element1[element1.length-1].split(' ')[0];
            });
          }
          if (row.aggregateRating) {
            row.aggregateRating.forEach(item => {
              item.text = parseFloat( item.text.replace(/[^\d.-]/g, '') );
            });
          }
          if (row.ratingCount ) {
            // console.log('ratingCount=>', row.ratingCount);
            row.ratingCount.forEach(item => {
              item.text = parseInt( item.text.replace(/[^\d-]/g, '') );
            });
          }
          if (row.sku) {
            row.sku.forEach(item => {
              item.text = 'sainsburys_' + item.text;
            });
          }
        }
    }
    return data;
};

module.exports = { transform };