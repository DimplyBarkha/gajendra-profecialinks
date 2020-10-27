
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
  for (const { group } of data) {
    for (const row of group) {
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
          text += item.text.replace(/\n \n/g, ' ').replace('Content from the Manufacturer', '').replace('This content uses cookies to improve your experience. By continuing, you agree to this use. Learn More at https://flixmedia.eu/privacy-policy/', '');
        });
        row.manufacturerDescription = [
          {
            text: text.replace(/^\d+\s/, ''),
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
          !item.text.startsWith('https') ? videos.push({ text: item.text.replace(/(.*)(\/)(.*).mp4(.*)/, 'https://content.jwplatform.com/videos/$3.mp4') }) : videos.push({ text: item.text });
        });
        row.videos = videos;
      }
      if (row.manufacturerImages) {
        const manufacturerImages = [];
        row.manufacturerImages.forEach(item => {
          manufacturerImages.push({ text: `https:${item.text}` });
        });
        row.manufacturerImages = manufacturerImages;
      }
    }
  }
  data.forEach(obj => obj.group.forEach(row => Object.keys(row).forEach(header => row[header].forEach(el => {
    el.text = clean(el.text);
  }))));
  return data;
};

module.exports = { transform };
