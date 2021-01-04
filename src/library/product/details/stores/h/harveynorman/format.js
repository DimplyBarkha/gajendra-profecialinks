/**
 *
 * @param {ImportIO.Group[]} data
 * @returns {ImportIO.Group[]}
 */
const transform = (data) => {
  for (const { group } of data) {
    for (const row of group) {
      for (const i in row) { console.log(i); }
      if (row.image && !row.image[0].text.startsWith('http')) {
        row.image[0].text = `https:${row.image[0].text}`;
      }
      if (!row.brandText && row.name) {
        row.brandText = [{
          text: row.name[0].text.replace(/^([^\s]+).*/, '$1'),
        }];
      }
      if (row.mpc && row.mpc[0].text.includes('mpn')) {
        row.mpc = [{
          text: row.mpc[0].text.replace(/.*mpn":\s*"(.*?)".*/, '$1'),
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
          const allImages = image.text.split(', ').map(img => img.trim());
          let mainImage;
          if (allImages.length) {
            mainImage = allImages.find(x => /Desktop/i.test(x));
            if (!mainImage) {
              mainImage = allImages.find(x => !(/Mobile/i.test(x)));
            }
            if (!mainImage) {
              mainImage = allImages[0].replace(/(.*?)\s.*/, '$1').trim();
            } else {
              mainImage = mainImage.replace(/(.*?)\s.*/, '$1');
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
      if (row.videos) {
        for (const i in row.videos) {
          const videoUrl = row.videos[i].text;
          if (videoUrl.includes('player.vimeo')) {
            console.log(row.videos[i].text + ' is video url');
            row.videos[i].text = row.videos[i].text.replace(/(.+)(play).+(vimeo.com)(.+)(video)(.+)/g, '$1$3$6');
          }
        }
      }
      if (row.inTheBoxUrl) {
        row.inTheBoxUrl.forEach(image => {
          const allImages = image.text.split(', ').map(img => img.trim());
          let mainImage;
          mainImage = allImages[0].replace(/(.*?)\s.*/, '$1').trim();
          image.text = mainImage;
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
