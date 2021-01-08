/**
 *
 * @param {ImportIO.Group[]} data
 * @returns {ImportIO.Group[]}
 */
const transform = (data) => {
  for (const { group }
    of data) {
    for (const row of group) {
      if (row.description) {
        let text = '';
        for (let i = 0; i < row.description.length; i++) {
          text += ' ' + row.description[i].text;
        }
        row.description = [{
          text: text,
        }];
      }

      if (row.image) {
        // console.log('rowimage is ',row.image[0].text[0]);
        if (row.image[0].text.substring(0, 5) === '/data') row.image[0].text = 'https://shop.dyson.ru' + row.image[0].text;
      }
      if (row.nameExtended) {
        if (!row.nameExtended[0].text.match(/[dD]yson/g)) {
          if (row.brandText && row.name) {
            row.nameExtended = [
              { text: row.brandText[0].text + ' - ' + row.name[0].text },
            ];
          }
        }
      }
      if (row.inTheBoxUrl) {
        row.inTheBoxUrl.forEach((img) => {
          if (!img.text && img.src) {
            img.text = img.src;
          }
        });
      }

      if (row.inTheBoxText) {
        let text = '';
        row.inTheBoxText.forEach((item) => {
          text = text + (text ? ' | ' : '') + item.text;
        });
        row.inTheBoxText = [{ text }];
      }
      if (row.alternateImages) {
        let a = [];
        for (let i = 0; i < row.alternateImages.length; i++) {
          a.push(row.alternateImages[i].text);
        }
        a = [...new Set(a)];
        const images = a.join(' | ');
        row.alternateImages[0].text = images;
        delete row.alternateImages[0].xpath;
        row.alternateImages.splice(1);
      }
      // if (row.alternateImages) {
      //   const j = 0;
      //   console.log(row.alternateImages.length + ' is the transform  length');
      //   const altImages = [];

      //   for (let i = 0; i < row.alternateImages.length; i++) {
      //     if (!row.alternateImages[i].text.includes('image/gif')) { altImages.push(row.alternateImages[i].text); }
      //   }
      //   for (let i = 0; i < row.alternateImages.length; i++) {
      //     if (i < altImages.length) { row.alternateImages[i].text = altImages[i]; } else {
      //       row.alternateImages.splice(i, row.alternateImages.length);
      //       break;
      //     }
      //   }
      // // console.log(altImages+' are images transformed');
      // }
      if (row.availabilityText && row.availabilityText[0] && row.availabilityText[0].text === 'true') {
        row.availabilityText = [
          { text: 'In Stock' },
        ];
      } else {
        row.availabilityText = [
          { text: 'Out Of Stock' },
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
