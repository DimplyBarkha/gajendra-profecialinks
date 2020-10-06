/**
 *
 * @param {ImportIO.Group[]} data
 * @returns {ImportIO.Group[]}
 */
const transform = (data) => {
  for (const { group } of data) {
    for (const row of group) {
      if (row.specifications) {
        let text = '';
        row.specifications.forEach((item, index) => {
          text += item.text.trim() + ' || ';
        });
        row.specifications = [
          {
            text: text.slice(0, -3),
          },
        ];
      }
      if (row.alternateImages) {
        row.alternateImages.forEach(item => {
          item.text = item.text.replace(/(.*)/, 'https:$1');
        });
      }
      if (row.videos) {
        row.videos.forEach(item => {
          item.text = item.text.replace(/(.*)/, 'https:$1');
        });
      }
      if (row.image) {
        row.image.forEach(item => {
          item.text = item.text.replace(/(.*)/, 'https:$1');
        });
      }
      if (row.mpc) {
        row.mpc.forEach(item => {
          item.text = item.text.replace(/.*"mpn":"(.*?)".*/gm, '$1').trim();
        });
      }
      if (row.description) {
        row.description.forEach(item => {
          item.text = item.text.replace(/\n/gm, '').replace(/\s{2,}/gm, ' ').trim();
        });
        if (row.additionalDescBulletInfo) {
          for (const bullet of row.additionalDescBulletInfo) {
            for (const item of row.description) {
              item.text = item.text.replace(bullet.text, ` || ${bullet.text}`).replace(/\s{2,}/gm, ' ');
            }
          }
        }
      }
      if (row.brandText) {
        row.brandText.forEach(item => {
          item.text = item.text.replace(/.*"brand_name":\["(.*?)"\].*/gm, '$1').trim();
        });
      }
      if (row.weightNet) {
        row.weightNet.forEach(item => {
          let val = item.text.split(';').filter((item) => {
            if (item.includes('weigh')) {
              return item.trim();
            }
          });
          val = val.join(',').split(',').filter((item) => {
            if (item.includes('weigh')) {
              return item.trim();
            }
          });
          item.text = val.join(' | ').trim();
        });
      }
      if (row.manufacturerDescription) {
        row.manufacturerDescription.forEach(item => {
          item.text = item.text.replace(/\n/gm, '').replace(/\s{2,}/gm, ' ').trim();
        });
      }
      if (row.variantCount) {
        row.variantCount.forEach(item => {
          // eslint-disable-next-line eqeqeq
          if (item.text == 0) {
            item.text = 1;
          }
        });
      }
      if (row.technicalInformationPdfPresent) {
        row.technicalInformationPdfPresent.forEach(item => {
          // eslint-disable-next-line eqeqeq
          if (item.text != 'No') {
            item.text = item.text.replace(/(.*)/, 'Yes');
          }
        });
      }
      if (row.nameExtended) {
        row.nameExtended.forEach(item => {
          item.text = item.text.trim();
        });
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
