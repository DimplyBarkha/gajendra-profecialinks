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
      if (row.aggregateRating) {
        let text = '';
        row.aggregateRating.forEach(item => {
          text += item.text.replace('.', ',');
        });
        row.aggregateRating = [
          {
            text: text,
          },
        ];
      }
      if (row.manufacturerDescription) {
        let text = '';
        row.manufacturerDescription.map(item => {
          text += `${item.text}`;
        });
        row.manufacturerDescription = [
          {
            text: clean(text),
          },
        ];
      }
      if (row.specifications) {
        let text = '';
        row.specifications.map(item => {
          text += `${item.text} | `;
        });
        row.specifications = [
          {
            text: text.slice(0, -4),
          },
        ];
      }
      if (row.unInterruptedPDP) {
        var arrTemp = [];
        row.unInterruptedPDP.forEach(item => {
          arrTemp.push(item.text);
        });
        row.unInterruptedPDP = [{ text: arrTemp.join(' || ') }];
      }
      if (row.description) {
        let descriptionOne = '';
        const bulletInfo = [];
        if (row.descriptionOne) {
          let text = '';
          row.descriptionOne.forEach(item => {
            bulletInfo.push({ text: item.text });
            text += `|| ${item.text} `;
          });
          descriptionOne = text;
        }
        let desc = '';
        desc = row.description && row.description[0].text;
        if (descriptionOne) {
          desc = `${descriptionOne} | ${desc}`;
        }
        row.descriptionTwo && row.descriptionTwo[0] && row.descriptionTwo.forEach(item => {
          const descItem = item.text.match(/•/g);
          descItem && bulletInfo.push({ text: item.text.slice(1, -1) });
        });
        if (bulletInfo) {
          row.descriptionBullets = [
            {
              text: bulletInfo.length,
            },
          ];
          row.additionalDescBulletInfo = bulletInfo;
        }
        row.description = [
          {
            text: clean(desc),
          },
        ];
      }
      if (row.variants) {
        const variants = [];
        row.variants.map(item => {
          variants.push({ text: item.text.replace(/(.*)p\/(\d+)(.*)/, '$2') });
        });
        row.variants = variants;
      }
      if (row.inTheBoxText) {
        if (row.inTheBoxText.length === 1) {
          if (row.inTheBoxText[0].text.search(':') !== -1) {
            const text = row.inTheBoxText[0].text.split(':')[1];
            row.inTheBoxText = [{ text }];
          }
        }
      }
    }
  }

  return data;
};

module.exports = { transform };
