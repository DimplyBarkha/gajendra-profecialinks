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
      if (row.description) {
        row.description.forEach(item => {
          item.text = cleanUp(item.text);
        });
      }
      if (row.name && row.brandText) {
        row.nameExtended = [{ text: row.brandText[0].text + ' - ' + row.name[0].text }];
      } else {
        row.nameExtended = [{ text: row.name[0].text }];
      }
      if (!row.brandText) {
        row.brandText = [{ text: row.name[0].text.replace(/^([\w-]+).*/gm, '$1') }];
      }
      if (row.additionalDescBulletInfo) {
        row.additionalDescBulletInfo[0].text = row.additionalDescBulletInfo[0].text.replace(/(\n\s*){1,}/g, ' || ');
        row.additionalDescBulletInfo[0].text = cleanUp(row.additionalDescBulletInfo[0].text);
      }
      // if (row.availabilityText) {
      //   row.availabilityText.forEach(availabilityTextItem => {
      //     if (availabilityTextItem.text.toLowerCase().includes('disponível') || availabilityTextItem.text.toLowerCase().includes('em stock')) {
      //       availabilityTextItem.text = 'In Stock';
      //     } else {
      //       availabilityTextItem.text = 'Out Of Stock';
      //     }
      //   });
      // }
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
      if (row.warranty) {
        row.warranty.forEach(warrantyItem => {
          warrantyItem.text = warrantyItem.text.replace('Garantie', '').trim();
        });
      }
      const shippingDimensionsArray = [];
      if (row.shippingDimensions) {
        row.shippingDimensions.forEach((shippingDimensionsItem) => {
          shippingDimensionsItem.text = shippingDimensionsItem.text.replace(/(\n\s*){2,}/g, ' : ');
          shippingDimensionsArray.push(shippingDimensionsItem.text);
        });
      }

      row.shippingDimensions = [{ text: shippingDimensionsArray.join(' | ') }];

      if (row.ratingCount) {
        row.ratingCount.forEach(ratingCountItem => {
          ratingCountItem.text = ratingCountItem.text.replace(/[^\d]/gm, '');
        });
      }
      if (row.aggregateRating) {
        row.aggregateRating.forEach((aggregateRatingItem) => {
          aggregateRatingItem.text = aggregateRatingItem.text.replace(/(.*?) out of.*/gm, '$1');
        });
      }
      if (row.specifications) {
        row.specifications[0].text = row.specifications[0].text.replace(/(\n\s*){4,}/g, ' || ').replace(/(\n\s*){2,}/g, ' : ').replace(/(\n\s*){1,}/g, ' ');
      }
    }
  }
  return data;
};
module.exports = { transform };
