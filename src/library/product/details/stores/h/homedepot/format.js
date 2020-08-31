/**
 *
 * @param {ImportIO.Group[]} data
 * @returns {ImportIO.Group[]}
 */
const transform = (data) => {
  for (const { group } of data) {
    for (const row of group) {
      if (row.alternateImages) {
        const secondaryImages = [];
        row.alternateImages.forEach(alternateImage => {
          if (!alternateImage.text.includes('videoId')) {
            alternateImage.text = alternateImage.text.replace(/\d+(\..*)$/, '1000$1');
            !secondaryImages.find(({ text }) => text === alternateImage.text) && secondaryImages.push(alternateImage);
          }
        });
        row.alternateImages = secondaryImages;
        row.secondaryImageTotal = [{
          text: secondaryImages.length,
        }];
      }
      if (row.additionalDescBulletInfo) {
        row.descriptionBullets = [{
          text: row.additionalDescBulletInfo.length,
        }];
      }
      if (row.specifications) {
        row.specifications.forEach(item => {
          item.text = item.text.replace(/(\n\s?){6,}/g, ' | ').replace(/(\n\s?){5}/g, ' ').replace(/(\n\s?){4}/g, ' | ').replace('Specifications', '').replace(/\n \n/g, ' : ').trim();
        });
      }
      if (row.manufacturerDescription) {
        row.manufacturerDescription.forEach(item => {
          item.text = item.text.replace(/(\s?\n\s?)+/g, ' ').replace('Product Overview', '').trim();
        });
      }
      if (row.shippingDimensions) {
        row.shippingDimensions.forEach(item => {
          item.text = item.text.replace(/\n \n \n \n/g, ' | ').replace(/(\n\s?){1,2}/g, ' : ').trim();
        });
      }
      if (row.descriptionBullets) {
        row.descriptionBullets.forEach(item => {
          if (item.text === '0') {
            item.text = '';
          }
        });
      }
      if (row.description) {
        row.description.forEach(item => {
          item.text = item.text.replace(/(\s?\n)+/g, ' || ').trim();
        });
      }
      if (row.nameExtended) {
        row.nameExtended.forEach(item => {
          item.text = item.text.replace(/-\s*The Home Depot$/, '').trim();
        });
      }
      if (row.warnings) {
        row.warnings.forEach(item => {
          item.text = item.text.replace(/see\s*/i, '').trim();
        });
      }
      if (row.price) {
        row.price.forEach(item => {
          if (item.text.includes('Product')) {
            const price = item.text.replace(/.*"price":(.*?),.*/, '$1');
            item.text = `$${price}`;
          }
        });
      }
      if (row.mpc) {
        row.mpc.forEach(item => {
          item.text = item.text.replace(/.*?#/, '').trim();
        });
      }
    }
  }
  return data;
};

module.exports = { transform };
