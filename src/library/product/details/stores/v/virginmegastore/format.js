/**
 *
 * @param {ImportIO.Group[]} data
 * @returns {ImportIO.Group[]}
 */
const transform = (data) => {
  for (const { group } of data) {
    for (const row of group) {
      if (row.variants) {
        const variantArray = row.variants.map((item) => {
          return item.text;
        });
        row.variants = [{ text: variantArray.join('|'), xpath: row.variants[0].xpath }];
      }
      if (row.availabilityText) {
        const availabilityTextArr = row.availabilityText.map((item) => {
          console.log('row.availabilityText =>' + row.availabilityText);
          return (typeof (item.text) === 'string') && (item.text.trim() === 'Add to bag') ? 'In Stock' : 'Out of Stock';
        });
        row.availabilityText = [{ text: availabilityTextArr.join(), xpath: row.availabilityText[0].xpath }];
      }
    }
  }

  return data;
};

module.exports = { transform };
