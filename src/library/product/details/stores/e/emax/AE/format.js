/**
 *
 * @param {ImportIO.Group[]} data
 * @returns {ImportIO.Group[]}
 */
const transform = (data) => {
  for (const { group } of data) {
    for (const row of group) {
      if (row.brandText) {
        let firstWord = row.nameExtended[0].text;
        firstWord = firstWord.split(' ');
        row.brandText = [
          {
            text: firstWord[0],
          },
        ];
      }
      if (row.alternateImages) {
        const enlargePrefix = row.alternateImagesEnlargePath && row.alternateImagesEnlargePath[0].text ? row.alternateImagesEnlargePath[0].text : ''
        row.alternateImages.forEach(item => {
          item.text = enlargePrefix ? enlargePrefix + item.text.replace(/(.*\/)(.*\/.*\/.*)/, '$2') : item.text
        });
      }
      if (row.description) {
        row.description[0].text = row.description[0].text.replace(/\n \n/g, '').replace(/\n /g, ' ');
      }
      if (row.additionalDescBulletInfo) {
        row.additionalDescBulletInfo[0].text = row.additionalDescBulletInfo[0].text.replace(/\n \n/g, ' || ');
      }
      if (row.firstVariant) {
        row.firstVariant[0].text = row.firstVariant[0].text.replace(/\n/g, ' ');
      }
      if (row.specifications) {
        row.specifications.forEach(item => {
          item.text = item.text.replace('More Information \n \n \n', '').replace(/\n \n \n \n/g, ' || ').replace(/\n \n/g, ' : ');
        });
      }
      if (row.warranty) {
        row.warranty.forEach(item => {
          item.text = item.text.replace(/\n/g, ' | ');
        });
      }
      if (row.availabilityText) {
        row.availabilityText = row.availabilityText.length ? [{ text: 'In Stock' }] : [{ text: 'Out of Stock' }];
      }
      row.variantCount = [{ text: 1 }];
    }
  }
  return data;
};

module.exports = { transform };
