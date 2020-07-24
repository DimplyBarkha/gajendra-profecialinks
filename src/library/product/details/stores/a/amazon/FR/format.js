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
  for (const { group } of data) {
    for (const row of group) {
      if (row.price) {
        if (row.price.length > 1) {
          row.price.shift();
        }
        row.price.forEach(priceItem => {
          priceItem.text = priceItem.text.replace(/\./g, '').replace(/,/g, '.');
          priceItem.text = priceItem.text.replace(/€/g, 'EUR');
        });
      }
      if (row.availabilityText) {
        row.availabilityText.forEach(item => {
          if (item.text.includes('Habituellement')) {
            item.text = '';
          }
        });
      }
      if (!row.primeFlag) {
        const text = [];
        text.push({ text: 'NO' });
        row.primeFlag = text;
      }
      if (row.otherSellersPrice) {
        row.otherSellersPrice.forEach(priceItem => {
          priceItem.text = priceItem.text.replace(/\./g, '').replace(/,/g, '.');
        });
      }
      if (row.imageAlt) {
        row.imageAlt.forEach(item => {
          item.text = item.text.trim();
        });
      }
      if (row.image) {
        if (row.image.length > 1) {
          row.image = [row.image[0]];
        }
        row.image.forEach(item => {
          item.text = item.text.replace('https://www.amazon.fr', 'https://images-na.ssl-images-amazon.com');
        });
      }
      if (row.otherSellersShipping) {
        const text = [];
        if (row.otherSellersPrice.length) {
          row.otherSellersShipping.forEach(item => {
            if (item.text.match(/.(?:[\d]+(?:.[\d]+)?)/)) {
              text.push({ text: `${item.text.match(/.(?:[\d]+(?:.[\d]+)?)/)[0]}` });
            }
          });
          row.otherSellersShipping = text;
        }
      }
      if (row.otherSellersPrime) {
        for (const item of row.otherSellersPrime) {
          if (item.text.includes('Details')) {
            item.text = 'YES';
          } else {
            item.text = 'NO';
          }
        }
      }
      if (row.ratingCount) {
        row.ratingCount.forEach(item => {
          item.text = item.text.replace(/(\d+).*/g, '$1');
          if (item.text.includes('0')) {
            item.text = '';
          }
        });
      } else {
        const text = [];
        text.push({ text: '' });
        row.ratingCount = text;
      }
      if (row.secondaryImageTotal) {
        row.secondaryImageTotal.forEach(item => {
          item.text = parseInt(item.text) === 0 || parseInt(item.text) - 1 === 0 ? '' : parseInt(item.text) - 1;
        });
      }
      if (row.lbbPrice) {
        row.lbbPrice.forEach(priceItem => {
          priceItem.text = priceItem.text.replace(/\./g, '').replace(/,/g, '.');
        });
      }
      if (row.category) {
        row.category.forEach(item => {
          item.text = item.text.replace(/ {2}/gm, ' ');
        });
      }
      if (row.brandLink) {
        row.brandLink.forEach(item => {
          if (!item.text.includes('amazon.fr') || !item.text.includes('amazon.com')) {
            item.text = 'http://www.amazon.fr' + item.text;
          }
          item.text = item.text.replace(/\+/gm, ' ');
          item.text = item.text.replace(/%27/gm, '"');
        });
      }
      if (row.listPrice) {
        row.listPrice.forEach(priceItem => {
          priceItem.text = priceItem.text.replace(/\./g, '').replace(/,/g, '.');
        });
      }
      if (row.subscriptionPrice) {
        row.subscriptionPrice.forEach(priceItem => {
          priceItem.text = priceItem.text.replace(/\./g, '').replace(/,/g, '.');
        });
      }
      if (row.aggregateRating) {
        row.aggregateRating.forEach(item => {
          item.text = item.text.replace(',', '.');
        });
      }
      if (row.description) {
        row.description.forEach(item => {
          item.text = `${item.text.replace(/\n/g, '')}`;
          item.text = item.text.replace('Voir plus', '');
          item.text = item.text.trim();
        });
      }
      if (row.nameExtended) {
        row.nameExtended.forEach(item => {
          item.text = `${item.text.replace(/: Amazon.fr.*/g, '')}`;
        });
      }
      if (row.alternateImages) {
        row.alternateImages.shift();
        row.alternateImages.forEach(item => {
          item.text = item.text.replace(/.*?(https.*.jpg).*/g, '$1');
        });
      }
      if (row.largeImageCount) {
        for (const item of row.largeImageCount) {
          const itemVar = item.text.match(/SL1500_.jpg/gm) ? item.text.match(/SL1500_.jpg/gm).length : 0;
          if (itemVar === 0) {
            item.text = item.text.match(/large":/gm) ? item.text.match(/large":/gm).length : 0;
          } else {
            item.text = itemVar;
          }
        }
      }
      if (row.variantCount) {
        row.variantCount.forEach(item => {
          if (parseInt(item.text) === 0) {
            item.text = 1;
          }
        });
      }
      if (row.manufacturerDescription) {
        row.manufacturerDescription.forEach(item => {
          item.text = item.text.replace(/(<.*[^>]+> ?)/gm, '');
        });
      }
      if (row.brandText) {
        row.brandText.forEach(item => {
          item.text = item.text.replace(/Marque : /gm, '');
        });
      }
      if (!row.variantAsins) {
        const text = [];
        text.push({ text: row.asin[0].text });
        row.variantAsins = text;
      }
      Object.keys(row).forEach(header => row[header].forEach(el => {
        el.text = clean(el.text);
      }));
    }
  }
  return data;
};
module.exports = { transform };
