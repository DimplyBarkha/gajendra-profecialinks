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
          item.text = item.text.replace(/\n \n \n \n/g, ' | ').replace(/\n \n/g, ' : ').trim();
        });
      }
    }
  }
  return data;
};

module.exports = { transform };
