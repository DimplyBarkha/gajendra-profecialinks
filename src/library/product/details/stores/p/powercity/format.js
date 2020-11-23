
/**
 *
 * @param {ImportIO.Group[]} data
 * @returns {ImportIO.Group[]}
 */
const transform = (data) => {
  for (const { group } of data) {
    for (const row of group) {
      if (row.description) {
        let text = '';
        row.description.forEach(desc => {
          if (desc.text.includes('Key Features') || desc.text.includes('Key features')) {
            let txt = '';
            if (desc.text.includes('Key features')) {
              txt = desc.text.split('Key features:');
            } else {
              txt = desc.text.split('Key Features:');
            }
            if (txt.length === 2) {
              text = text + ' | ' + txt[0].replace(/(\s*\n\s*)+/g, ' ') + ' Key Features:' + txt[1].replace(/(\s\n)+/g, ' ').replace(/(\n\s\n)+/g, ' ').replace(/\n/g, ' || ');
            }
          } else if (desc.text.includes('Features:')) {
            text = text + ' | ' + desc.text.replace(/(\s*\n\s*)+/g, ' || ');
          } else {
            text = text + ' | ' + desc.text.replace(/(\s*\n\s*)+/g, ' ');
          }
        });
        row.description = [{
          text: text.slice(3),
        },
        ];
      }

      if (row.additionalDescBulletInfo) {
        row.descriptionBullets = [{
          text: row.additionalDescBulletInfo.length,
        },
        ];

        row.additionalDescBulletInfo.forEach(ele => {
          ele.text = ele.text.replace(/\s*\n/g, ' ');
        });
      }

      if (row.videos) {
        let text = '';
        row.videos.forEach(item => {
          text = item.text.split('\\').join('');
          text = text + (text ? ' | ' : '') + item.text;
        });
        row.videos = [{ text }];
      }

      if (row.manufacturerDescription) {
        row.manufacturerDescription[0].text = row.manufacturerDescription[0].text.replace(/(\s+\n+\s+)+/g, ' ');
      }

      if (row.image && !row.image[0].text.startsWith('http')) {
        row.image[0].text = `https:${row.image[0].text}`;
      }

      if (row.alternateImages) {
        row.alternateImages.forEach(image => {
          if (!image.text.startsWith('http')) {
            image.text = `https:${image.text}`;
          }
        });
      }
      if (row.variantId && !row.sku) {
        row.sku = [{
          text: row.variantId[0].text
        }];
      }
      if (row.manufacturerImages) {
        row.manufacturerImages.forEach(image => {
          let allImages = image.text.split(', ').map(img => img.trim())
          let mainImage;
          if (allImages.length) {
            mainImage = allImages.find(x => /desktop/i.test(x))
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

      if (row.videos) {
        row.videos.forEach(video => {
          if (video.text.includes('file":"')) {
            video.text = video.text.replace(/.*?file":"(.*?)".*/, '$1')
          }
          if (!video.text.startsWith('http')) {
            video.text = `https:${video.text}`;
          }
        });
      }

      if (!row.brandText && row.name) {
        row.brandText = [{
          text: row.name[0].text.replace(/^([^\s]+).*/, '$1'),
        }];
      }

      if (row.specifications) {
        row.specifications = [{
          text: row.specifications.reduce((item, currentItem) => `${item} || ${currentItem.text.replace(/(\s*\n\s*)+/g, ': ')}`, '').slice(4).trim(),
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
