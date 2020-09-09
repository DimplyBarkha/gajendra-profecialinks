/**
 *
 * @param {ImportIO.Group[]} data
 * @returns {ImportIO.Group[]}
 */
const transform = (data) => {
  for (const { group } of data) {
    for (const row of group) {
      if (row.availabilityText) {
        row.availabilityText[0].text = row.availabilityText[0].text === 'Out of Stock' ? row.availabilityText[0].text : 'In Stock';
      };
      if (row.descriptionBullets) {
        row.descriptionBullets = [
          {
            text: row.additionalDescBulletInfo.length,
          },
        ];
      }
      if (row.alternateImages) {
        if (row.alternateImages[0].text === row.image[0].text) {
          row.alternateImages.shift();
        }
      }
      if (row.largeImageCount && row.alternateImages) {
        row.largeImageCount[0].text = row.alternateImages.length;
      }
      if (row.shippingInfo) {
        var text = '';
        row.shippingInfo.forEach((ele) => {
          text += ' ' + ele.text.replace('\n', '');
        });
        row.shippingInfo = [
          {
            text: text.trim(),
          },
        ];
      }
      if (row.category) {
        if (row.category[0].text === 'Home') {
          row.category.shift();
        }
      }
      if (row.sku) {
        row.sku[0].text = row.sku[0].text.substring(1);
      }
      if (row.asin) {
        row.asin[0].text = row.asin[0].text.substring(1);
      }
      if (row.firstVariant) {
        row.firstVariant[0].text = row.firstVariant[0].text.substring(1);
      }
    }
  }
  return data;
};

module.exports = { transform };