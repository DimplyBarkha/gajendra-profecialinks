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
    .replace(/'\s{1,}/g, '"')
    .replace(/\s{1,}'/g, '"')
    .replace(/^ +| +$|( )+/g, ' ')
    // eslint-disable-next-line no-control-regex
    .replace(/[\x00-\x1F]/g, '')
    .replace(/[\uD800-\uDBFF][\uDC00-\uDFFF]/g, ' ');
  for (const { group } of data) {
    for (const row of group) {
      if (row.aggregateRating) {
        row.aggregateRating.forEach(aggregateRating => {
          aggregateRating.text = aggregateRating.text.replace('/', '.');
        });
      }

      if (row.ratingCount) {
        row.ratingCount.forEach(ratingCountItem => {
          ratingCountItem.text = ratingCountItem.text.replace(/[^\d]/gm, '');
        });
      }

      if (row.availabilityText) {
        row.availabilityText.forEach(availabilityTextItem => {
          const availability = availabilityTextItem.text.replace(/.*availability": ?"(.*?)".*/gs, '$1');
          if (availability && availability.toLowerCase().includes('instock')) {
            availabilityTextItem.text = 'In stock';
          } else {
            availabilityTextItem.text = 'Out of stock';
          }
        });
      }

      if (row.alternateImages) {
        row.alternateImages.forEach(alternateImagesItem => {
          alternateImagesItem.text = alternateImagesItem.text.replace(/mini/gm, 'large');
        });
      }

      if (row.description) {
        row.description.forEach(item => {
          item.text = cleanUp(item.text);
        });
      }

      if (row.manufacturerDescription) {
        row.manufacturerDescription.forEach(manufacturerDescriptionItem => {
          manufacturerDescriptionItem.text = cleanUp(manufacturerDescriptionItem.text);
        });
      }

      if (row.manufacturerImages) {
        row.manufacturerImages.forEach(manufacturerImagesItem => {
          const takeFirstURLRegex = /^(.*?png|.*?jpg).*/gm;
          if (takeFirstURLRegex.test(manufacturerImagesItem.text)) {
            manufacturerImagesItem.text = manufacturerImagesItem.text.replace(takeFirstURLRegex, '$1');
            if (!manufacturerImagesItem.text.includes('http')) {
              manufacturerImagesItem.text = 'https:' + manufacturerImagesItem.text;
            }
          }
        });
      }

      if (row.name && row.brandText) {
        row.nameExtended = [{ text: row.name[0].text }];
      }

      if (row.listPrice) {
        row.listPrice.forEach(item => {
          item.text = item.text.replace(/^(\d+)(.*?)(\d+)/, '$2$1,$3');
        });
      }

      if (row.price) {
        row.price.forEach(item => {
          item.text = item.text.replace(/^(\d+)(.*?)(\d+)/, '$2$1,$3');
        });
      }

      const additionalDescBulletInfoArray = [];
      if (row.additionalDescBulletInfo) {
        row.additionalDescBulletInfo.forEach((additionalDescBulletInfoItem) => {
          additionalDescBulletInfoArray.push(additionalDescBulletInfoItem.text);
        });
      }
      row.additionalDescBulletInfo = [{ text: additionalDescBulletInfoArray.join(' || ') }];

      if (row.descriptionBullets) {
        row.descriptionBullets.forEach((descriptionBulletsItem) => {
          if (
            descriptionBulletsItem.text === 0 ||
            descriptionBulletsItem.text === '0'
          ) {
            descriptionBulletsItem.text = '';
          }
        });
      }

      if (row.specifications) {
        row.specifications[0].text = row.specifications[0].text
          .replace(/(\n\s*){4,}/g, ' || ')
          .replace(/(\n\s*){2,}/g, ' : ');
      }
    }
  }
  return data;
};
module.exports = { transform };
