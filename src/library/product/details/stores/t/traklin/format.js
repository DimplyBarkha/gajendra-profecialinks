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
      if (row.availabilityText) {
        row.availabilityText.forEach(availabilityTextItem => {
          if (availabilityTextItem.text.toLowerCase().includes('instock')) {
            availabilityTextItem.text = 'In Stock';
          } else {
            availabilityTextItem.text = 'Out Of Stock';
          }
        });
      } else {
        row.availabilityText = [{ text: 'Out Of Stock' }];
      }

      if (row.price) {
        row.price.forEach(priceItem => {
          priceItem.text = priceItem.text.replace(/₪/gm, 'NIS');
        });
      }

      if (row.listPrice) {
        row.listPrice.forEach(listPriceItem => {
          listPriceItem.text = listPriceItem.text.replace(/₪/gm, 'NIS');
        });
      }

      if (row.warranty) {
        row.warranty.forEach(warrantyItem => {
          warrantyItem.text = cleanUp(warrantyItem.text);
        });
      }

      if (row.description) {
        row.description.forEach(descriptionItem => {
          descriptionItem.text = cleanUp(descriptionItem.text);
        });
      }

      if(row.additionalDescBulletInfo){
        row.additionalDescBulletInfo.forEach(additionalDescBulletInfoItem => {
          additionalDescBulletInfoItem.text = cleanUp(additionalDescBulletInfoItem.text);
        });
      }
      const specificationsArray = [];
      if (row.specifications) {
        row.specifications.forEach(specificationsItem => {
          specificationsArray.push(cleanUp(specificationsItem.text));
        });
      }
      row.specifications = [{ text: specificationsArray.join(' || ') }];
    }
  }
  return data;
};
module.exports = { transform };
