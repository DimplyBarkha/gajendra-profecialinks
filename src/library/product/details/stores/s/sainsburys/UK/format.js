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

  for (const { group } of data) {
    for (const row of group) {
      if (row.price) {
        let textCurrency; 
        row.price.forEach(item => {
          if( item.text.includes('p') ) {
            item.text = item.text.replace('p','')/100;
          }
          // textCurrency = (item.text.includes('£') || item.text.includes('p')) ? 'GBP' : ''; 
        });
        // row.priceCurrency = [{text: textCurrency}];
      }
      // if (row.listPrice) {
      //   row.listPrice.forEach(item => {
      //     item.text = item.text.replace('£', ' ').trim();
      //   });
      // }
      // if (row.priceCurrency) {
      //   let textCurrency;
      //   row.priceCurrency.forEach(item => {
      //     textCurrency = (item.text.includes('£') || item.text.includes('p')) ? 'GBP' : item.text;
      //   });
      //   row.priceCurrency = [{text: textCurrency}];
      // }
      if (row.availabilityText) {
        row.availabilityText.forEach(item => {
          item.text = ('Add' === item.text) ? 'In stock' : 'Out of stock';
        });
      }
      if (row.shownImages) {
        let text = '';
        let element = '';
        let images = [];
        row.shownImages.forEach((item, index) => {
          element = item.text.split(',');
          if (0 == index) {
            text = element[element.length - 2].trim().split(' ')[0];
          } else {
            text = element[element.length - 1].trim().split(' ')[0];
          }
          images.push({ text: text });
        });
        row.shownImages = images;
      }
      if (row.highQualityImages) {
        let text1 = '';
        let element1 = '';
        let images1 = [];
        row.highQualityImages.forEach((item, index) => {
          element1 = item.text.split(',');
          if (0 == index) {
            text1 = element1[element1.length - 2].trim().split(' ')[0];
          } else {
            text1 = element1[element1.length - 1].trim().split(' ')[0];
          }
          images1.push({ text: text1 });
        });
        row.highQualityImages = images1;
      }
      if (row.aggregateRating) {
        let text;
        row.aggregateRating.forEach(item => {
          text = Number(parseFloat(item.text.replace(/[^\d.-]/g, '')).toFixed(1));
          // item.text = text;
        });
        row.aggregateRating = [{ text: text }]
      }
      if (row.ratingCount) {
        row.ratingCount.forEach(item => {
          item.text = parseInt(item.text.replace(/[^\d-]/g, ''));
        });
      }
      if (row.countryOfOrigin) {
        row.countryOfOrigin.forEach(item => {
          item.text = item.text.replace(/\s*/g, '');
          item.text = item.text.replace('Countryoforigin:', '');
        });
      }
      if (row.product_grocery_allergens) {
        row.product_grocery_allergens.forEach(item => {
          item.text = item.text.replace('Dietary Information', '');
        });
      }
      if (row.product_grocery_calories_per_serving) {
        row.product_grocery_calories_per_serving.forEach(item => {
          item.text = item.text.split('/')[1];
        });
      }
      if (row.legalDisclaimer) {
        let arrDisclaimer = [];
        row.legalDisclaimer.forEach(item => {
          arrDisclaimer.push(item.text);
        });
        let disclaimer = arrDisclaimer.join(' ');
        row.legalDisclaimer = [{ text: disclaimer }];
      }
    }
  }
  return data;
};

module.exports = { transform };