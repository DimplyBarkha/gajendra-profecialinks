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
        row.aggregateRating.forEach(aggregateRatingItem => {
          aggregateRatingItem.text = aggregateRatingItem.text.replace('/', '.');
        });
      }
      if (row.description) {
        row.description.forEach(item => {
          item.text = cleanUp(item.text);
        });
      }
      if (row.name && row.brandText) {
        row.nameExtended = [{ text: row.brandText[0].text + ' - ' + row.name[0].text }];
      }
      if (row.listPrice) {
        row.listPrice.forEach(item => {
          // item.text = item.text.replace(/^(\d+)(.*?)(\d+)/, '$2$1,$3');
          item.text = item.text.replace('€', ',');
        });
      }
      if (row.price) {
        row.price.forEach(item => {
          // item.text = item.text.replace(/^(\d+)(.*?)(\d+)/, '$2$1,$3');
          item.text = item.text.replace('€', ',');
        });
      }
      if (row.description) {
        row.description.forEach(descriptionItem => {
          descriptionItem.text = cleanUp(descriptionItem.text);
        });
      }
      if (row.additionalDescBulletInfo) {
        row.additionalDescBulletInfo[0].text = row.additionalDescBulletInfo[0].text.replace(/(\n\s*){1,}/g, ' || ');
        row.additionalDescBulletInfo[0].text = cleanUp(row.additionalDescBulletInfo[0].text);
      }
      if (row.availabilityText) {
        row.availabilityText.forEach(availabilityTextItem => {
          if (availabilityTextItem.text.toLowerCase().includes('en stock')) {
            availabilityTextItem.text = 'In Stock';
          } else {
            availabilityTextItem.text = 'Out Of Stock';
          }
        });
      }
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
      if (row.manufacturerDescription) {
        var arrTemp = [];
        row.manufacturerDescription.forEach(item => {
          arrTemp.push(item.text);
        });
        row.manufacturerDescription = [{ text: arrTemp.join(' ') }];
      }
      if (row.productOtherInformation) {
        var arrInfo = [];
        row.manufacturerDescription.forEach(item => {
          item.text.replace(/\n\s*\n/, ' : ');
          arrInfo.push(item.text);
        });
        row.manufacturerDescription = [{ text: arrInfo.join(' | ') }];
      }
      if (row.manufacturerImages) {
        var arrImg = [];
        row.manufacturerImages.forEach(item => {
          arrImg.push(item.text);
        });
        row.manufacturerImages = [{ text: arrImg.join(' | ') }];
      }
      if (row.warranty) {
        row.warranty.forEach(warrantyItem => {
          warrantyItem.text = warrantyItem.text.replace('Garantie', '').trim();
        });
      }
      if (row.specifications) {
        row.specifications[0].text = cleanUp(row.specifications[0].text
          .replace(/(\n\s*){4,}/g, ' || ')
          .replace(/(\n\s*){2,}/g, ' : '));
      }
    }
  }
  return data;
};
module.exports = { transform };
