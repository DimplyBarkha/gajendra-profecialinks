/**
 *
 * @param {ImportIO.Group[]} data
 * @returns {ImportIO.Group[]}
 */
const transform = (data) => {
  for (const { group } of data) {
    for (const row of group) {
      if (row.specifications) {
        row.specifications = [{
          text: row.specifications.reduce((item, currItem) => `${item} || ${currItem.text.trim()}`, '').replace(/(\n\s?)+/g, '').slice(3).trim(),
        }];
      };
      if (row.listPrice && !row.price) {
        row.price = [{
          text: row.listPrice[0].text.trim(),
        }];
      };
      if (row.shippingDimensions) {
        row.shippingDimensions = [{
          text: row.shippingDimensions.reduce((item, currItem) => `${item} | ${currItem.text.trim()}`, '').replace(/(\s?\n\s?)+/g, ' ').slice(3).trim(),
        }];
      };
      if (row.additionalDescBulletInfo) {
        row.additionalDescBulletInfo = [{
          text: row.additionalDescBulletInfo.reduce((item, currItem) => `${item} | ${currItem.text.trim()}`, '').slice(1).trim(),
        }];
      };
      if (row.description) {
        if (row.description.length > 1) {
          const text = row.description[1].text.replace(/(\s*\n\s*)+/g, ' || ');
          row.description = [{ text: `${row.description[0].text} ${text}` }];
        } else if (/FEATURES/i.test(row.description[0].text)) {
          row.description[0].text = row.description[0].text.replace(/(\s*\n\s*)+/g, ' || ');
        }
      };
      if (row.availabilityText && row.availabilityText[0]) {
        const text = row.availabilityText[0].text;
        if (/online/i.test(text)) {
          row.availabilityText[0].text = 'In Stock';
        } else if (!/^0 IN/i.test(text)) {
          row.availabilityText[0].text = 'In Stock';
        } else {
          row.availabilityText[0].text = 'Out of Stock';
        }
      };
    }
  }
  return data;
};

module.exports = { transform };
