/**
 *
 * @param {ImportIO.Group[]} data
 * @returns {ImportIO.Group[]}
 */
const transform = (data) => {
  for (const { group } of data) {
    for (const row of group) {
      if (row.alternateImages) {
        row.secondaryImageTotal = [{
          text: row.alternateImages.length,
        }];
        row.alternateImages.forEach(alternateImage => {
          alternateImage.text = alternateImage.text.replace(/\d+(\..*)$/, '1000$1');
        });
      }
      if (row.specifications) {
        row.specifications.forEach(item => {
          item.text = item.text.replace(/\n \n \n \n \n/g, ' ').replace(/\n \n \n \n/g, ' | ').replace('Specifications', '').replace(/\n \n/g, ' : ').trim();
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
          item.text = item.text.replace(/[\s\n]{2,}/g, ' || ').replace(/\n/g, ' ').trim();
        });
      }
      if (row.nameExtended) {
        row.nameExtended.forEach(item => {
          item.text = item.text.replace(/-\s*The Home Depot$/, '').trim();
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
      if (row.videos) {
        row.videos.forEach(item => {
          if (item.text.includes('"video"')) {
            const video = item.text.replace(/.*"video":"(.*?)",.*/, '$1');
            item.text = video;
          }
        });
      }
    }
  }
  return data;
};

module.exports = { transform };
