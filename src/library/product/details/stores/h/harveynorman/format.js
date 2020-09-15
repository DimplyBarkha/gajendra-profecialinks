/**
 *
 * @param {ImportIO.Group[]} data
 * @returns {ImportIO.Group[]}
 */
const transform = (data) => {
  for (const { group } of data) {
    for (const row of group) {
      if (row.image && !row.image[0].text.startsWith('http')) {
        row.image[0].text = `https:${row.image[0].text}`;
      }
      if (!row.brandText && row.name) {
        row.brandText = [{
          text: row.name[0].text.replace(/^([^\s]+).*/, '$1'),
        }];
      }
      if (row.alternateImages) {
        row.alternateImages.forEach(image => {
          if (!image.text.startsWith('http')) {
            image.text = `https:${image.text}`;
          }
        });
      }
      if (row.manufacturerImages) {
        row.manufacturerImages.forEach(image => {
          let allImages = image.text.split(', ').map(img => img.trim())
          let mainImage;
          if (allImages.length) {
            mainImage = allImages.find(x => !(/Mobile/i.test(x)))
            if (!mainImage) {
              mainImage = allImages[0].replace(/(.*?)\s.*/, '$1').trim()
            } else {
              mainImage = mainImage.replace(/(.*?)\s.*/, '$1')
            }
          }
          if (mainImage && !mainImage.startsWith('http')) {
            mainImage = `https:${mainImage}`;
          }
          image.text = mainImage;
        });
      }
      if (row.manufacturerDescription) {
        row.manufacturerDescription[0].text = row.manufacturerDescription[0].text.replace(/\s*\n\s*/g, ' ');
      }
      if (row.description) {
        row.description[0].text = row.description[0].text.replace(/\n\s\n/g, ' || ').replace(/\s*\n\s*/g, ' ');
      }
      if (row.warranty) {
        row.warranty[0].text = row.warranty[0].text.replace(/\n\s\n/g, ': ');
      }
      if (row.specifications) {
        row.specifications = [{
          text: row.specifications.reduce((item, currentItem) => `${item} || ${currentItem.text.replace(/(\n\s\n)+/g, ': ')}`, '').slice(4).trim(),
        },
        ];
      }
      if (row.additionalDescBulletInfo) {
        row.descriptionBullets = [{
          text: row.additionalDescBulletInfo.length,
        },
        ];
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
