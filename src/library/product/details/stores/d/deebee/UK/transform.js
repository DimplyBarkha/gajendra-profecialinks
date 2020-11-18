
/**
 *
 * @param {ImportIO.Group[]} data
 * @returns {ImportIO.Group[]}
 */
const transform = (data) => {
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

  for (const { group } of data) {
    for (const row of group) {
      if (row.alternateImages && row.alternateImages.length) {
        const mainImage = row.image[0].text;
        console.log('mainImage', mainImage);
        row.alternateImages.map((item) => {
          item.text = item.text.replace('/small/', '/large/');
        });
        row.alternateImages = row.alternateImages.filter((item) => {
          return item.text !== mainImage;
        });
      }
      if (row.availabilityText && row.availabilityText.length) {
        row.availabilityText.map(item => {
          item.text = item.text.toLowerCase() === "active" ? 'In Stock' : 'Out Of Stock';
        })
      }
      if (row.vitaminCPerServing && row.vitaminCPerServing.length) {
        row.vitaminCPerServing.map(item => {
          item.text = item.text.split('(')[0].replace('mg', '').replace('g', '').replace('ml', '');
        });
        row.vitaminCPerServingUom.map(item => {
          const vitaminC = item.text.split('(')[0];
          let unit = 'g';
          if (vitaminC.indexOf('mg') !== -1) {
            unit = 'mg';
          }
          else if (vitaminC.indexOf('ml') !== -1) {
            unit = 'ml';
          } else {
            unit = 'g';
          }
          item.text = unit;
        })
      }
    }
  }
  return data;
};

module.exports = { transform };