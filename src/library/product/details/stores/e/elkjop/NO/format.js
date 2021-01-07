
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
    .replace(/\s{1,}"/g, '"')
    .replace(/^ +| +$|( )+/g, ' ')
    .replace(/\\"/gm, '"')
  // eslint-disable-next-line no-control-regex
    .replace(/[\x00-\x1F]/g, '')
    .replace(/[\uD800-\uDBFF][\uDC00-\uDFFF]/g, ' ')
    .trim();
  for (const { group } of data) {
    for (const row of group) {
      if (row.videos) {
        const newAlternateImages = row.videos.map(item => {
          if (item.text.includes('mp4') && !item.text.includes('elkjop.no')) {
            return {
              text: `https://www.elkjop.no${item.text.trim()}`,
            };
          } else if (item.text.includes('mp4') && item.text.includes('elkjop.no')) {
            return {
              text: item.text.trim(),
            };
          } else {
            return { text: `https://youtu.be/${item.text}` };
          }
        });
        row.videos = newAlternateImages;
      }
      if (row.specifications) {
        let text = '';
        row.specifications.forEach(item => {
          text += `${item.text.replace(/\n \n/g, ': ')} || `;
        });
        row.specifications = [
          {
            text: text.slice(0, -4),
          },
        ];
      }
      if (row.description) {
        let desc = '';
        let descriptionOne = '';
        if (row.description) {
          let textOne = '';
          row.description.forEach(item => {
            textOne += item.text;
          });
          desc = textOne;
        }
        if (row.additionalDescBulletInfo) {
          let text = '';
          row.additionalDescBulletInfo.forEach(item => {
            text += `|| ${item.text} `;
          });
          descriptionOne = text;
        }
        row.description = [
          {
            text: clean(descriptionOne ? `${desc} ${descriptionOne}` : desc),
          },
        ];
      }
      if (row.manufacturerDescription) {
        let manufacturerDesc = '';
        row.manufacturerDescription.forEach(desc => {
          manufacturerDesc += `${desc.text} `;
        });
        row.manufacturerDescription = [{ text: manufacturerDesc.replace('Les merProduktinformasjon', '').replace('Mer informasjon', '') }];
      }

      if (row.largeImage) {
        row.image = row.largeImage;
      }
    }
  }
  data.forEach(obj => obj.group.forEach(row => Object.keys(row).forEach(header => row[header].forEach(el => {
    if (el) {
      el.text = clean(el.text);
    }
  }))));
  return data;
};

module.exports = { transform };
