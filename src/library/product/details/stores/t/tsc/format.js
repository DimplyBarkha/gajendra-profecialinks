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

      if (row.warranty) {
        if (row.warranty.length > 1) {
          row.warranty = [row.warranty[row.warranty.length - 1]];
        }
      }

      if (row.price) {
        row.price.forEach(priceItem => {
          priceItem.text = priceItem.text.replace(',', '');
        });
      }

      // ManufacturerImages may contain full URL or not hence appending https:
      if (row.manufacturerImages) {
        row.manufacturerImages.forEach(imageItem => {
          if (imageItem.text && !imageItem.text.includes('https')) {
            imageItem.text = 'https:' + imageItem.text;
          }
        });
      }

      if (row.alternateImages) {
        row.secondaryImageTotal = [{ text: row.alternateImages.length }];
      }

      // Adding || to nameExtended bullets and nameExtended bullet count
      if (row.description) {
        row.description.forEach(descItem => {
          const numberOfBullets = descItem.text.match(/•/g).length;
          row.descriptionBullets = [{ text: numberOfBullets }];
          descItem.text = descItem.text.replace(/•/g, ' || ');
          descItem.text = cleanUp(descItem.text);
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

      // Adding nameExtended
      if (row.name && row.brandText && row.variantInformation) {
        row.nameExtended = [{ text: row.brandText[0].text + ' - ' + row.name[0].text + ' - ' + row.variantInformation[0].text }];
      } else if (row.name && row.brandText) {
        row.nameExtended = [{ text: row.brandText[0].text + ' - ' + row.name[0].text }];
      }

      if (row.countryOfOrigin) {
        row.countryOfOrigin.forEach(countryOfOriginItem => {
          countryOfOriginItem.text = cleanUp(countryOfOriginItem.text);
          if (countryOfOriginItem.text.toLowerCase().includes('country of origin')) {
            countryOfOriginItem.text = countryOfOriginItem.text.replace(/.*?Country of origin: ?(\w*).*/gmi, '$1');
          } else {
            countryOfOriginItem.text = '';
          }
        });
      }

      if (row.weightNet) {
        row.weightNet.forEach(weightNetItem => {
          weightNetItem.text = cleanUp(weightNetItem.text);
          if (weightNetItem.text.includes('Weight')) {
            weightNetItem.text = weightNetItem.text.replace(/.*Weight.*?: ?(.*?) ?•.*/gm, '$1');
          } else {
            weightNetItem.text = '';
          }
        });
      }

      if (row.manufacturerDescription) {
        row.manufacturerDescription.forEach(manufacturerDescriptionItem => {
          if (manufacturerDescriptionItem.text.toLowerCase().includes('user manual') || manufacturerDescriptionItem.text.toLowerCase().includes('owner\'s guide')) {
            manufacturerDescriptionItem.text = '';
          } else {
            manufacturerDescriptionItem.text = cleanUp(manufacturerDescriptionItem.text);
            manufacturerDescriptionItem.text = manufacturerDescriptionItem.text.replace(/•/gm, ' || ');
          }
        });
      }
    }
  }
  return data;
};
module.exports = { transform };
