/**
 *
 * @param {ImportIO.Group[]} data
 * @returns {ImportIO.Group[]}
 */
const transform = (data) => {
  for (const { group } of data) {
    const variantDetails = [];
    let row1 = {};
    for (const row of group) {
      row.variantCount = [{
        text: row.variantCount.length,
      }];
      row.variantDetails && variantDetails.push(...JSON.parse(row.variantDetails[0].text));
      if (row.specifications) {
        row.specifications = [{
          text: row.specifications.reduce((item, currItem) => `${item} || ${currItem.text.trim()}`, '').replace(/(\n\s?)+/g, '').slice(3).trim(),
        }];
      };
      if (row.variants) {
        row.variants = [{
          text: row.variants.reduce((item, currItem) => `${item} | ${currItem.text.trim()}`, '').replace(/(\n\s?)+/g, '').slice(3).trim(),
        }];
      };
      if (row.videos) {
        row.videos.forEach(video => {
          video.text = video.text.replace('thumbnails','videos')
        });
      };
      if (row.listPrice && !row.price) {
        row.price = [{
          text: row.listPrice[0].text.trim(),
        }];
        row.listPrice = [{
          text: '',
        }];
      };
      if (row.shippingDimensions) {
        row.shippingDimensions = [{
          text: row.shippingDimensions.reduce((item, currItem) => `${item} | ${currItem.text.trim()}`, '').replace(/(\s?\n\s?)+/g, ' ').slice(3).trim(),
        }];
      };
      if (row.name && !row.brandText) {
        row.brandText = [{
          text: row.name[0].text.replace(/^(\w+?)\s.*/, '$1'),
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
      row1 = { ...row };
    }
    variantDetails.forEach(variant => {
      row1.price = [{
        text: variant.Price,
      }];
      row1.variantId = [{
        text: variant.Product,
      }];
      row1.sku = [{
        text: variant.sku,
      }];
      group.push({ ...row1 });
    });
  }
  return data;
};

module.exports = { transform };
