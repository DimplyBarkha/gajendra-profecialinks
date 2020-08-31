/**
 *
 * @param {ImportIO.Group[]} data
 * @returns {ImportIO.Group[]}
 */
const transform = (data) => {
  for (const { group } of data) {
    for (const row of group) {
      if (row.image) {
        row.image = row.image.slice(0, 1);
      }
      if (row.alternateImages) {
        row.alternateImages = row.alternateImages.map((ele) => {
          ele.text = ele.text.replace('90x90', '700x700');
          return ele;
        });
        row.alternateImages.shift();
      }
      if (row.largeImageCount) {
        row.largeImageCount = [
          {
            text: row.alternateImages.length,
          },
        ];
      }
      if (row.price) {
        row.price = row.price.slice(0, 1);
      }
      if (row.brandText) {
        let firstWord = row.nameExtended[0].text;
        firstWord = firstWord.split(' ');
        row.brandText = [
          {
            text: firstWord[0],
          },
        ];
      }
      if (row.description) {
        row.description[0].text = row.description[0].text.replace(/\n \n/g, '');
      }
      if (row.additionalDescBulletInfo) {
        row.additionalDescBulletInfo[0].text = row.additionalDescBulletInfo[0].text.replace(/\n \n/g, ' || ');
      }
      if (row.descriptionBullets) {
        row.descriptionBullets[0].text = (row.additionalDescBulletInfo[0].text.split('||').length - 1) + 1;
      }
      if (row.firstVariant) {
        row.firstVariant[0].text = row.firstVariant[0].text.replace(/\n/g, ' ');
      }
      if (row.specifications) {
        row.specifications[0].text = row.specifications[0].text.replace('More Information \n \n \n', '');
        row.specifications[0].text = row.specifications[0].text.replace(/\n \n \n \n/g, ' || ');
        row.specifications[0].text = row.specifications[0].text.replace(/\n \n/g, ' : ');
      }
      if (row.warranty) {
        row.warranty[0].text = row.warranty[0].text.replace('OEM Warrenty \n', '');
        row.warranty[0].text = row.warranty[0].text.replace(/\n/g, ' | ');
      }
      if (row.availabilityText) {
        row.availabilityText = row.availabilityText.length ? [{ text: 'In Stock' }] : [{ text: 'Out of Stock' }];
      }
    }
  }
  return data;
};

module.exports = { transform };
