// @ts-nocheck
/**
 *
 * @param {ImportIO.Group[]} data
 * @returns {ImportIO.Group[]}
 */
const transform = (data) => {
  for (const { group } of data) {
    for (const row of group) {
      if (row.description) {
        row.description[0].text = row.description[0].text.replace(/\n \n/g, ' || ').replace(/\n/g, '');
      }
      if (row.availabilityText) {
        row.availabilityText = row.availabilityText[0].text.includes('Available Now') ? [{ text: 'In Stock' }] : [{ text: 'Out of Stock' }];
      }
      if (row.nameExtended) {
        row.nameExtended[0].text = row.brandText[0].text + ' - ' + row.nameExtended[0].text;
      }
      if (row.alternateImages) {
        row.alternateImages.forEach(item => {
          item.text = item.text.replace(/productthumb/, 'magnify');
        });
      }
      if (row.image) {
        row.image[0].text = row.image[0].text.replace(/productthumb/, 'magnify');
      }
      if (!row.warranty) {
        if (row.warranty1) {
          const text = row.warranty1[0].text.replace(/\n/g, '').replace(/.*Warranty:(.*)/, '$1').replace(/^((?:\S+\s+){3}\S+).*/, '$1').replace(/-/g, '').replace(/:/g, '');
          if (text.includes('guarantee')) {
            row.warranty = [{ text }];
          }
        }
      }
      if (row.videos) {
        row.videos.forEach(temp => {
          if (temp.text.charAt(0) === '/') {
            temp.text = temp.text.replace(/\/\//, 'https://');
          }
        });
        row.videos.forEach(item => {
          item.text = item.text.replace(/\/productimages/, 'https://www.davidjones.com/productimages');
        });
      }
      row.variantCount = [{ text: 1 }];
    }
  }
  return data;
};

module.exports = { transform };
