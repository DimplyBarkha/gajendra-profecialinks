
/**
 *
 * @param {ImportIO.Group[]} data
 * @returns {ImportIO.Group[]}
 */
const transform = (data) => {
  for (const { group } of data) {
    for (const row of group) {
      if (row.image) {
        row.image.forEach(image => {
          image.text = `https://www.medikamente-per-klick.de${image.text}`;
        });
      }
      if (row.alternateImages) {
        row.alternateImages && row.alternateImages.splice(0, 1);
        row.secondaryImageTotal = [{
          text: row.alternateImages.length,
        }];
        row.alternateImages.forEach(alternateImage => {
          alternateImage.text = `https://www.medikamente-per-klick.de${alternateImage.text}`.replace('/klein/', '/mittel/').replace('_k.', '_m.');
        });
      }
      if (row.variantId) {
        row.variantId.forEach(variantId => {
          variantId.text = variantId.text.replace(/^0+/, '');
        });
      }
      if (row.availabilityText) {
        row.availabilityText.forEach(availabilityText => {
          if (availabilityText.text.includes('in_stock')) {
            availabilityText.text = 'In Stock';
          } else if (availabilityText.text.includes('out_of_stock')) {
            availabilityText.text = 'Out of Stock';
          }
        });
      }
    }
  }
  return data;
};

module.exports = { transform };
