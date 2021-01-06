
/**
 *
 * @param {ImportIO.Group[]} data
 * @returns {ImportIO.Group[]}
 */
const transform = (data) => {
  // Default transform function
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
      if (row.manufacturerDescription) {
        let text = '';
        row.manufacturerDescription.forEach(item => {
          if (!item.text.includes('hideMenu')) {
            text += item.text.replace(/\\/g, '');
          }
        });
        row.manufacturerDescription = [
          {
            text: clean(text),
          },
        ];
      }
      if (row.variants) {
        const variantArray = row.variants.map((item) => {
          return item.text;
        });
        row.variants = [{ text: variantArray.join('|'), xpath: row.variants[0].xpath }];
      }
      if (row.specifications) {
        const specificationsArr = row.specifications.map((item) => {
          return typeof (item.text) === 'string' ? item.text.replace(/\n/, ' : ') : '';
        });
        row.specifications = [{ text: specificationsArr.join('||'), xpath: row.specifications[0].xpath }];
      }
      if (row.additionalDescBulletInfo) {
        const additionalDescBulletInfoArr = row.additionalDescBulletInfo.map((item) => {
          return item.text;
        });
        additionalDescBulletInfoArr[0] = '||' + additionalDescBulletInfoArr[0];
        row.additionalDescBulletInfo = [{ text: additionalDescBulletInfoArr.join('||'), xpath: row.additionalDescBulletInfo[0].xpath }];
      }
      if (row.promotion) {
        const promotionArr = row.promotion.map((item) => {
          return item.text;
        });
        row.promotion = [{ text: promotionArr.join(' '), xpath: row.promotion[0].xpath }];
      }
      if (row.secondaryImageTotal) {
        if (row.secondaryImageTotal[0].text.toString() === '0') { row.secondaryImageTotal = [{ text: '' }]; }
      }
      if (row.description) {
        const description = row.description;
        let textOne = '';
        description && description.length && description.forEach(item => {
          textOne += `${item.text.replace(/\n \n/g, '')}`;
        });
        textOne = textOne.trim();
        let textTwo = '';
        if (row.descriptionBulletsLiTags) {
          const descriptionLiTags = row.descriptionBulletsLiTags;
          descriptionLiTags && descriptionLiTags.length && descriptionLiTags.forEach(item => {
            textTwo += ` || ${item.text.replace(/\n \n/g, '')}`;
          });
          textTwo = textTwo.trim();
        }
        const data = [textOne, textTwo];
        row.description = [
          {
            text: data.join(' '),
          },
        ];
      }
      // if (row.description) {
      //   let text = '';
      //   let descTop = '';
      //   let descInfoMiddle = '';
      //   row.description.forEach(item => {
      //     text += ` || ${item.text.replace(/\s{2,}/g, ' ').trim()}`;
      //   });
      //   if (row.descTop) {
      //     row.descTop.forEach(item => {
      //       descTop += ` || ${item.text.replace(/\s{2,}/g, ' ').trim()}`;
      //     });
      //   }
      //   if (row.descMiddle) {
      //     row.descMiddle.forEach(item => {
      //       descInfoMiddle += `${item.text.replace(/\s{2,}/g, ' ').trim()}`;
      //     });
      //   }
      //   descInfoMiddle = descInfoMiddle ? ` | ${descInfoMiddle} ` : '';
      //   row.description = [
      //     {
      //       text: clean(`${descTop}${descInfoMiddle}${text}`.trim()),
      //     },
      //   ];
      // }
    }
  }
  return data;
};

module.exports = { transform };
