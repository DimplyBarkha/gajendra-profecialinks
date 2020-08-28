
/**
 *
 * @param {ImportIO.Group[]} data
 * @returns {ImportIO.Group[]}
 */
const transform = (data, context) => {
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
      if (row.manufacturerDescription) {
        row.manufacturerDescription[0].text = row.manufacturerDescription[0].text.replace(/\s*\n\s*/g, ' ');
      }
      if (row.videos) {
        const videos = row.videos.map(({ text }) => text);
        row.videos = Array.from(new Set(videos)).map(video => ({ text: video }));
      }
      if (row.gtin && row.gtin[0].text.match(/EAN/i)) {
        row.gtin[0].text = row.gtin[0].text.replace(/.*EAN:\s*([^\s]+).*/i, '$1');
      }
      if (row.manufacturerImages) {
        row.manufacturerImages.forEach(img => {
          if (img.text.includes('background-image')) {
            img.text = img.text.replace(/.*url\('(.*)'\).*/, '$1');
          } else if (img.text.startsWith('http')) {
            img.text = `https:${img.text}`;
          }
        });
      }
      row.category && row.category.splice(-1);
      if (row.availabilityText) {
        row.availabilityText[0].text = 'In Stock';
      } else {
        row.availabilityText = [{
          text: 'Out of Stock',
        }];
      }
    }
  }
  const clean = text => text.toString()
    .replace(/\r\n|\r|\n/g, ' ')
    .replace(/&amp;nbsp;/g, ' ')
    .replace(/&amp;#160/g, ' ')
    .replace(/\u00A0/g, ' ')
    .replace(/\s{2,}/g, ' ')
    .replace(/"\s{1,}/g, '"')
    .replace(/\s{1,}"/g, '"')
    .replace(/^ +| +$|( )+/g, ' ')
    // eslint-disable-next-line no-control-regex
    .replace(/[\x00-\x1F]/g, '')
    .replace(/[\uD800-\uDBFF][\uDC00-\uDFFF]/g, ' ');
  data.forEach(obj => obj.group.forEach(row => Object.keys(row).forEach(header => row[header].forEach(el => {
    el.text = clean(el.text);
  }))));
  return data;
};

module.exports = { transform };
