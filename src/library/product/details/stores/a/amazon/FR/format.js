/**
*
* @param {ImportIO.Group[]} data
* @returns {ImportIO.Group[]}
*/
const transform = (data) => {
  const cleanUp = text => text.toString()
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
      if (!row.primeFlag) {
        const text = [];
        text.push({ text: 'NO' });
        row.primeFlag = text;
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
      if (row.ratingCount) {
        row.ratingCount.forEach(item => {
          item.text = item.text.replace(/ /gm, '');
          item.text = item.text.replace(/(\d+).*/g, '$1');
          if (item.text === '0') {
            item.text = '';
          }
        });
      } else {
        const text = [];
        text.push({ text: '' });
        row.ratingCount = text;
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
          priceItem.text = priceItem.text.replace(/€/gm, 'EUR');
        });
      }
      if (row.subscriptionPrice) {
        row.subscriptionPrice.forEach(priceItem => {
          priceItem.text = priceItem.text.replace(/\./g, '').replace(/,/g, '.');
        });
      }
      if (row.pricePerUnit) {
        row.pricePerUnit.forEach(priceItem => {
          priceItem.text = priceItem.text.replace(/\./g, '').replace(/,/g, '.');
        });
      }
      if (row.aggregateRating) {
        row.aggregateRating.forEach(item => {
          item.text = item.text.replace(',', '.');
        });
      }
      if (row.description) {
        let text = '';
        row.description.forEach(item => {
          text += `|| ${item.text.replace(/\n \n/g, ':')}`;
        });
        let descriptionBottom = [];
        if (row.descriptionBottom) {
          descriptionBottom = row.descriptionBottom;
        }
        descriptionBottom = [text, ...descriptionBottom.map(({ text }) => text)];
        row.description = [
          {
            text: cleanUp(descriptionBottom.join(' | ')),
          },
        ];
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
          item.text = item.text.trim().match(/"hiRes":"https:/g) ? item.text.trim().match(/"hiRes":"https:/g).length : 0;
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
        let text = '';
        row.manufacturerDescription.forEach(item => {
          text += item.text.replace(/\n \n/g, ' ');
        });
        row.manufacturerDescription = [
          {
            text: cleanUp(text.replace(/<img.{1,300}">/g, '')),
          },
        ];
      }
      if (row.brandText) {
        row.brandText.forEach(item => {
          item.text = item.text.replace(/Marque : /gm, '');
        });
      }
      if (row.heroQuickPromoUrl) {
        row.heroQuickPromoUrl.forEach(item => {
          item.text = 'http://www.amazon.fr' + item.text;
        });
      }
      row.variantCount = [{
        text: (row.variantAsins && row.variantAsins.length) || '',
      }];
      if (!row.variantAsins) {
        const text = [];
        text.push({ text: row.asin[0].text });
        row.variantAsins = text;
      } else {
        const variantAsinArr = [];
        row.variantAsins.forEach(item => {
          variantAsinArr.push(item.text);
        });
        row.variantAsins = [{ text: variantAsinArr.join(' | ') }];
      }
      row.secondaryImageTotal = [{
        text: (row.alternateImages && row.alternateImages.length) || 0,
      }];
      Object.keys(row).forEach(header => row[header].forEach(el => {
        el.text = cleanUp(el.text);
      }));
    }
  }
  return data;
};
module.exports = { transform };
