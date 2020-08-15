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
      // ManufacturerImages may contain full URL or not hence appending https:
      if (row.manufacturerImages) {
        row.manufacturerImages.forEach(imageItem => {
          if (imageItem.text && !imageItem.text.includes('https')) {
            imageItem.text = 'https:' + imageItem.text;
          }
        });
      }
      // Added code as brand is not available directly on the webpage
      if (row.brandText) {
        row.brandText.forEach(brandItem => {
          try {
            const brandJSON = JSON.parse(brandItem.text);
            const brand = brandJSON.Brand;
            if (brand) {
              brandItem.text = brand;
            } else {
              brandItem.text = '';
            }
          } catch (e) {
            brandItem.text = '';
          }
        });
      }
      if (row.alternateImages) {
        row.secondaryImageTotal = [{ text: row.alternateImages.length }];
      }
      // Adding | to description bullets and description bullet count
      if (row.description) {
        row.description.forEach(descItem => {
          const numberOfBullets = descItem.text.match(/•/g).length;
          row.descriptionBullets = [{ text: numberOfBullets }];
          descItem.text = descItem.text.replace(/•/g, ' | ');
        });
      }
      // If availabilityText contains SOLD OUT then it will be OUT OF STOCK else IN STOCK
      if (row.availabilityText) {
        row.availabilityText.forEach(avItem => {
          if (avItem.text && avItem.text.toLowerCase().includes('sold out')) {
            avItem.text = 'OUT OF STOCK';
          } else {
            avItem.text = 'IN STOCK';
          }
        });
      } else {
        row.availabilityText = [{ text: 'IN STOCK' }];
      }
      // Adding yes or no if image zoom exists
      if (row.imageZoomFeaturePresent) {
        row.imageZoomFeaturePresent = [{ text: 'YES' }];
      } else {
        row.imageZoomFeaturePresent = [{ text: 'NO' }];
      }
    }
  }
  return data;
};
module.exports = { transform };
