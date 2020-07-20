/**
 *
 * @param {ImportIO.Group[]} data
 * @returns {ImportIO.Group[]}
 */
const transform = (data, context) => {
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
      if (row.videos) {
        let text = '';
        row.videos.forEach(item => {
          text += `${item.text.replace(/\n/g, ':')} || `;
        });
        row.videos = [
          {
            text: cleanUp(text.slice(0, -4)),
          },
        ];
      }
      if (row.videoLength) {
        let text = '';
        row.videoLength.forEach(item => {
          text += `${item.text.replace(/\n/g, ':')} || `;
        });
        row.videoLength = [
          {
            text: cleanUp(text.slice(0, -4)),
          },
        ];
      }
      if (row.description) {
        let text = '';
        row.description.forEach(item => {
          text += `${item.text.replace(/\n \n/g, ':').replace(/\n/g, ':')} || `;
        });
        row.description = [
          {
            text: cleanUp(text.slice(0, -4)),
          },
        ];
      }
      if (row.price) {
        row.price.forEach(price => {
          price.text = price.text.replace('.', '').replace(',', '.').trim();
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
      if (row.otherSellersShipping) {
        row.otherSellersShipping.forEach(otherSellersShipping => {
          otherSellersShipping.text = otherSellersShipping.text.replace('.', '').replace(',', '.').trim();
        });
      }
      if (row.aggregateRating) {
        row.aggregateRating.forEach(aggregateRating => {
          aggregateRating.text = aggregateRating.text.replace(',', '.').trim();
        });
      }
      if (row.lbbPrice) {
        row.lbbPrice.forEach(lbbPrice => {
          lbbPrice.text = lbbPrice.text.replace('.', '').replace(',', '.').trim();
        });
      }
      if (row.pasin) {
        row.pasin.forEach(pasin => {
          pasin.text = pasin.text.replace('\",', '');
        });
      }
      if (row.nameExtended) {
        let text = '';
        row.nameExtended.forEach(item => {
          text += `${item.text.replace(': Amazon.de', '').trim()}`;
        });
        row.nameExtended = [
          {
            text: cleanUp(text),
          },
        ];
      }
      if (row.alternateImages) {
        row.alternateImages.shift();
      }
      if (row.alternateImages) {
        row.secondaryImageTotal.forEach(secondaryImageTotal => {
          secondaryImageTotal.text = row.alternateImages.length;
        });
      }
      if (row.variantCount) {
        row.variantCount.forEach(variantCount => {
          if (variantCount.text === '0') {
            variantCount.text = '1';
          }
        });
      }
      if (row.salesRankCategory) {
        if (row.salesRankCategory.text) {
          if (row.salesRankCategory.text.includes('Nr')) {
            row.salesRankCategory.shift();
          }
        }
      }
      if (row.shippingDimensions) {
        row.shippingDimensions.forEach(shippingDimensions => {
          if (shippingDimensions.text.includes(';')) {
            shippingDimensions.text = shippingDimensions.text.split(';')[0].trim();
          }
        });
      }
      if (row.image) {
        row.image.text = row.image.splice(1);
      }
    }
  }
  return data;
};

module.exports = { transform };
