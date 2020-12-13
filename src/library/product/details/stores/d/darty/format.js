
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
      if (row.description) {
        let text = '';
        if (row.additionalDescBulletInfo) {
          text = row.additionalDescBulletInfo.reduce((item, currentItem) => `${item} || ${currentItem.text}`, '').trim();
        }
        if (text) {
          row.description = [{
            text: text + ' | ' + row.description[0].text.replace(/\s*\n\s*/g, ' '),
          },
          ];
        } else {
          row.description = [{
            text: row.description[0].text.replace(/\s*\n\s*/g, ' '),
          },
          ];
        }
      }

      if (row.manufacturerDescription) {
        row.manufacturerDescription[0].text = row.manufacturerDescription[0].text.replace(/\s*\n\s*/g, ' ');
      }
      if (row.videos) {
        row.videos.forEach(video => {
          if (video.text.includes('file')) {
            video.text = video.text.replace(/.*?"file":"(.*?)".*/, '$1');
          }
          if (!video.text.startsWith('http')) {
            video.text = `https:${video.text}`;
          }
        });
      }
      if (row.specifications) {
        const specificationsArr = row.specifications.map((item) => {
          return typeof (item.text) === 'string' ? item.text.replace(/http.*?html/g, '').replace(/\n \n \n \n \n \n \n/g, ' || ').replace(/\n \n \n \n \n \n/g, ' || ').replace(/\n \n \n \n/g, ': ').replace(/\n \n/g, ' ').replace(/\n/g, '') : '|';
        });
        row.specifications = [{ text: specificationsArr.join('|'), xpath: row.specifications[0].xpath }];
      }
      if (row.additionalDescBulletInfo) {
        row.descriptionBullets = [{
          text: row.additionalDescBulletInfo.length,
        },
        ];
      }
    }
  }
  return data;
};

module.exports = { transform };
