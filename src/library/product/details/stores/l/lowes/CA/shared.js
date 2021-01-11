
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
    .replace(/"\s{1,}/g, '" ')
    .replace(/\s{1,}"/g, ' "')
    .replace(/^ +| +$|( )+/g, ' ')
    .replace(/\\"/gm, '"')
    // eslint-disable-next-line no-control-regex
    .replace(/[\x00-\x1F]/g, '')
    .replace(/[\uD800-\uDBFF][\uDC00-\uDFFF]/g, ' ');
  for (const { group } of data) {
    for (const row of group) {
      if (row.image) {
        row.image.forEach(item => {
          if (item.text.match(/(.*)_l.jpg/)) {
            item.text = item.text.replace(/(.*)_l.jpg/, '$1.jpg');
          }
          item.text = !item.text.startsWith('https') ? `https://www.lowes.ca${item.text}` : item.text;
        });
      }
      if (row.image1 && !row.image) {
        row.image1.forEach(item => {
          if (item.text.match(/(.*)_l.jpg/)) {
            item.text = item.text.replace(/(.*)_l.jpg/, '$1.jpg');
          }
          item.text = !item.text.startsWith('https') ? `https://www.lowes.ca${item.text}` : item.text;
        });
        row.image = row.image1;
      }
      if (row.availabilityText) {
        row.availabilityText = [{ text: 'In Stock' }];
      } else {
        if (!row.availabilityText && row.nameExtended && row.nameExtended[0]) {
          row.availabilityText = [{ text: 'Out of Stock' }];
        }
      }
      if (row.specifications) {
        let text = '';
        row.specifications.forEach(item => {
          text += `${item.text.replace(/\n \n/g, ':')} || `;
        });
        row.specifications = [
          {
            text: text.slice(0, -4),
          },
        ];
      }
      if (row.shippingInfo) {
        let text = '';
        row.shippingInfo.forEach(item => {
          text += `${item.text.trim()} `;
        });
        row.shippingInfo = [
          {
            text: text,
          },
        ];
      }
      if (row.weightNet) {
        let text = '';
        row.weightNet.forEach(item => {
          text += `${item.text.replace(/\n \n/g, ':')}`;
        });
        row.weightNet = [
          {
            text: text,
          },
        ];
      }
      if (row.shippingDimensions) {
        let text = '';
        row.shippingDimensions.forEach(item => {
          text += `${item.text.replace(/\n \n/g, ':')} | `;
        });
        row.shippingDimensions = [
          {
            text: text.slice(0, -3),
          },
        ];
      }
      if (row.shippingWeight) {
        let text = '';
        row.shippingWeight.forEach(item => {
          text += `${item.text.replace(/\n \n/g, ':')} | `;
        });
        row.shippingWeight = [
          {
            text: text.slice(0, -3),
          },
        ];
      }
      if (row.manufacturerDescription) {
        let text = '';
        row.manufacturerDescription.forEach(item => {
          text += item.text.replace(/\n \n/g, ' ').replace('Content from the Manufacturer', '').replace(/(.*)This content uses cookies to improve your experience. By continuing, you agree to this use(.*)/, '$1').replace(/\{.*\}/g, '').trim();
        });
        row.manufacturerDescription = [
          {
            text: text.replace(/^\d+\s/, '').trim(),
          },
        ];
      }
      if (row.description || row.descriptionBulletsLiTags) {
        const description = row.description;
        let textOne = '';
        description && description.length && description.forEach(item => {
          textOne += `${item.text.replace(/\n \n/g, '')}`;
        });
        textOne = textOne.trim();
        let textTwo = '';
        const descriptionLiTags = row.descriptionBulletsLiTags;
        descriptionLiTags && descriptionLiTags.length && descriptionLiTags.forEach(item => {
          textTwo += ` || ${item.text.replace(/\n \n/g, '')}`;
        });
        textTwo = textTwo.trim();
        const data = [textOne, textTwo];
        row.description = [
          {
            text: data.join(' '),
          },
        ];
      }
      if (row.videos) {
        const videos = [];
        row.videos.forEach(item => {
          !item.text.startsWith('https') ? item.text.match(/(.*)(\/)(.*).mp4(.*)/) && videos.push({ text: item.text.replace(/(.*)(\/)(.*).mp4(.*)/, 'https://content.jwplatform.com/videos/$3.mp4') }) : videos.push({ text: item.text });
        });
        row.videos = videos;
      }
      if (row.videos1) {
        const videos = [];
        for (let i = 1; i <= row.videos1[0].value; i++) {
          if (row.sku) {
            const sku = row.sku[0].text;
            videos.push({ text: `https://da.lowes.ca/webassets/videos/${sku}_${sku}_video_0${i}.mp4` });
          }
        }
        if (!row.videos && videos.length >= 1) {
          row.videos = videos;
        } else {
          if (row.videos && videos.length >= 1) {
            row.videos = [...row.videos, ...videos];
          }
        }
      }
      if (row.manufacturerImages) {
        const manufacturerImages = [];
        row.manufacturerImages.forEach(item => {
          item.text.match(/(.*) 200w,(.*)/) ? manufacturerImages.push({ text: item.text.replace(/(.*) 200w,(.*)/, '$1') }) : manufacturerImages.push({ text: item.text });
        });
        row.manufacturerImages = manufacturerImages;
      }
      if (!row.mpc && row.mpc1) {
        row.mpc = [{ text: row.mpc1[0].text }];
      }
      if (row.warranty) {
        let text = '';
        row.warranty.forEach(item => {
          text += `${item.text} | `;
        });
        row.warranty = [{ text: text.match(/(.*)\s\|\s$/) ? text.replace(/(.*)\s\|\s$/, '$1') : text }];
      }
      if (!row.alternateImages && row.alternateImages1) {
        row.alternateImages1.forEach(item => {
          if (item.text.match(/(.*)_s.jpg/)) {
            item.text = item.text.replace(/(.*)_s.jpg/, '$1_m.jpg');
          }
          if (item.text.match(/(.*)_l.jpg/)) {
            item.text = item.text.replace(/(.*)_l.jpg/, '$1_m.jpg');
          }
        });
        row.alternateImages = row.alternateImages1;
        row.secondaryImageTotal = [{ text: row.alternateImages1.length }];
      }
      if (row.alternateImages) {
        row.alternateImages.forEach(item => {
          item.text = !item.text.startsWith('https') ? `https://www.lowes.ca${item.text}` : item.text;
        });
      }
    }
  }
  data.forEach(obj => obj.group.forEach(row => Object.keys(row).forEach(header => row[header].forEach(el => {
    el.text = clean(el.text);
  }))));
  return data;
};

module.exports = { transform };
