
/**
 *
 * @param {ImportIO.Group[]} data
 * @returns {ImportIO.Group[]}
 */
const transform = (data) => {
  for (const { group } of data) {
    for (const row of group) {
      if (row.specifications) {
        row.specifications[0].text = row.specifications[0].text.replace(/(\n\s*){6,}/g, ' | ').replace(/(\n\s*){5}/g, ' ').replace(/(\n\s*){4}/g, ' | ').replace(/:*(\n\s*){2}/g, ': ');
      }
      if (row.shippingDimensions) {
        row.shippingDimensions = [{
          text: row.shippingDimensions.reduce((item, currItem) => item ? `${item} | ${currItem.text.replace(/:*(\n\s*)/g, ': ')}` : currItem.text.replace(/:*(\n\s*)/g, ': '), ''),
        }];
      }
      if (row.availabilityText) {
        row.availabilityText[0].text = 'In Stock'
      } else {
        row.availabilityText = [{
          text: 'Out of Stock',
        }];
      }
    }
  }
  return data;
};

module.exports = { transform };
