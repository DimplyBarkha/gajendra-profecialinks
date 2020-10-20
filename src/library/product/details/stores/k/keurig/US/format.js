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
    .replace(/\\"/gm, '"')
    // eslint-disable-next-line no-control-regex
    .replace(/[\x00-\x1F]/g, '')
    .replace(/[\uD800-\uDBFF][\uDC00-\uDFFF]/g, ' ');
  data.forEach(obj => obj.group.forEach(row => Object.keys(row).forEach(header => row[header].forEach(el => {
    el.text = clean(el.text);
  }))));

  for (const { group } of data) {
    for (const row of group) {
      if (!row.price && row.price1) {
        row.price = [{ text: `$${row.price1[0].text}` }];
      }
      if (row.manufacturerDescription) {
        let text = '';
        row.manufacturerDescription.forEach(item => {
          text += `${item.text} `;
        });
        row.manufacturerDescription = [
          {
            text: text,
          },
        ];
      }
      if (row.description) {
        row.description = [{ text: row.description[0].text.replace(/•/gm, '||') }];
      }
      if (row.variants1 && row.variants1.length > 1) {
        row.variants = row.variants1;
        row.variantCount = [{ text: row.variants1.length }];
        if (row.firstVariant1) {
          row.firstVariant = [{ text: row.firstVariant1[0].text }];
        } else {
          row.firstVariant = [{ text: row.variants1[0].text }];
        }
        if (row.variantInformation1) {
          row.variantInformation = [{ text: row.variantInformation1[0].text }];
        }
      }
      if (row.additionalDescBulletInfo) {
        const additionalDescBulletInfo = [];
        row.additionalDescBulletInfo.forEach(item => {
          item.text.match(/•/gm) && additionalDescBulletInfo.push({ text: item.text });
        });
        if (additionalDescBulletInfo.length >= 1) {
          row.additionalDescBulletInfo = additionalDescBulletInfo;
        }
        row.descriptionBullets = [{ text: additionalDescBulletInfo.length }];
      }
      if (row.videos && row.videoLength && row.videoLength.length > 1) {
        const videoLength = row.videoLength.pop();
        row.videoLength = [{ text: videoLength.text.replace(/(.*) (\/) (.*)/, '$3') }];
      } else {
        row.videoLength = [];
      }
      if (row.manufacturerImages) {
        const manufacturerImages = [];
        row.manufacturerImages.forEach(item => {
          !item.text.startsWith('https://images.keurig.com') ? manufacturerImages.push({ text: `https://www.keurig.com${item.text}` }) : manufacturerImages.push({ text: item.text });
        });
        if (manufacturerImages) {
          row.manufacturerImages = manufacturerImages;
        }
      }
    }
  }
  return data;
};

module.exports = { transform };
