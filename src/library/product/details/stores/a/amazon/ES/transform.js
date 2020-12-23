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
      if (row.nameExtended) {
        let text = '';
        row.nameExtended.forEach(item => {
          text += `${item.text.replace(': Amazon.es', '').trim()}`;
        });
        row.nameExtended = [
          {
            text: cleanUp(text),
          },
        ];
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
      if (row.price) {
        row.price.forEach(price => {
          price.text = price.text.replace('.', '').replace(',', '.').trim();
        });
      }
      if (row.lbbPrice) {
        row.lbbPrice.forEach(lbbPrice => {
          lbbPrice.text = lbbPrice.text.replace('.', '').replace(',', '.').trim();
        });
      }
      if (row.pricePerUnit) {
        row.pricePerUnit.forEach(pricePerUnit => {
          pricePerUnit.text = pricePerUnit.text.replace('.', '').replace(',', '.').trim();
        });
      }
      if (row.listPrice) {
        row.listPrice.forEach(listPrice => {
          listPrice.text = listPrice.text.replace('.', '').replace(',', '.').trim();
        });
      }
      if (row.subscriptionPrice) {
        row.subscriptionPrice.forEach(subscriptionPrice => {
          subscriptionPrice.text = subscriptionPrice.text.replace('.', '').replace(',', '.').trim();
        });
      }
      if (row.otherSellersPrice) {
        row.otherSellersPrice.forEach(otherSellersPrice => {
          otherSellersPrice.text = otherSellersPrice.text.replace('.', '').replace(',', '.').trim();
        });
      }
      if (row.aggregateRating) {
        row.aggregateRating.forEach(aggregateRating => {
          aggregateRating.text = aggregateRating.text.replace(',', '.').trim();
        });
      }
      if (row.ratingCount) {
        row.ratingCount.forEach(ratingCount => {
          ratingCount.text = ratingCount.text.replace('.', '').trim();
        });
      }
      if (row.otherSellersShipping) {
        row.otherSellersShipping.forEach(otherSellersShipping => {
          otherSellersShipping.text = otherSellersShipping.text.replace(',', '.').trim();
        });
      }
      if (row.salesRankCategory) {
        row.salesRankCategory.shift();
        row.salesRankCategory.shift();
        row.salesRankCategory.shift();
      }
      if (row.alternateImages) {
        row.alternateImages.shift();
      }
      if (row.alternateImages) {
        row.secondaryImageTotal.forEach(secondaryImageTotal => {
          secondaryImageTotal.text = row.alternateImages.length;
        });
      }
      if (row.quantity) {
        row.quantity.forEach(quantity => {
          if (quantity.text.includes(';')) {
            quantity.text = quantity.text.split(';')[1].trim();
          }
        });
      }
      if (row.shippingDimensions) {
        row.shippingDimensions.forEach(shippingDimensions => {
          if (shippingDimensions.text.includes(';')) {
            shippingDimensions.text = shippingDimensions.text.split(';')[0].trim();
          }
        });
      }
      if (row.brandText) {
        row.brandText.forEach(brandText => {
          if (!(brandText.text.includes('Marca'))) {
            brandText.text = `Marca: ${brandText.text}`;
          }
        });
      }
      if (row.variantAsins) {
        let text = '';
        row.variantAsins.forEach(item => {
          text += `${item.text} | `;
        });
        row.variantAsins = [
          {
            text: cleanUp(text.slice(0, -3)),
          },
        ];
      }
      if (row.largeImageCount) {
        for (const item of row.largeImageCount) {
          item.text = item.text.trim().match(/hiRes/g) ? item.text.trim().match(/hiRes/g).length : 0;
        }
      }
      if (row.pasin) {
        row.pasin.forEach(pasin => {
          pasin.text = pasin.text.replace('\",', '');
        });
      }
      if (row.firstVariant) {
        row.firstVariant.forEach(firstVariant => {
          firstVariant.text = firstVariant.text.replace('\",', '');
        });
      }
      if (row.warnings) {
        for (let i = 0; i < row.warnings.length; i++) {
          if ((row.warnings[i].text.includes('Más información'))) {
            row.warnings.splice(i, 1);
          }
        }
      }
      if (row.ingredientsList) {
        let text = '';
        row.ingredientsList.forEach(item => {
          text += `${item.text} | `;
        });
        row.ingredientsList = [
          {
            text: cleanUp(text.slice(0, -4)),
          },
        ];
      }
    }
  }
  return data;
};
module.exports = { transform };
