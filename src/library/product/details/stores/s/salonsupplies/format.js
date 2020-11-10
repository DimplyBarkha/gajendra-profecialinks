/**
*
* @param {ImportIO.Group[]} data
* @returns {ImportIO.Group[]}
*/
const transform = (data) => {
  const clean = text => text.toString().replace(/\r\n|\r|\n/gm, ' ')
    .replace(/&amp;nbsp;/g, ' ')
    .replace(/&amp;#160/g, ' ')
    .replace(/\u00A0/g, ' ')
    .replace(/\s{2,}/g, ' ')
    .replace(/"\s{1,}/g, '"')
    .replace(/\s{1,}"/g, '"')
    .replace(/^ +| +$|( )+/g, ' ')
  // eslint-disable-next-line no-control-regex
    .replace(/[^\x00-\x7F]/g, '');
  for (const { group } of data) {
    for (const row of group) {
      if (row.category) {
        row.category.unshift();
      }
      if (row.productPrice) {
        clean(row.productPrice);
        if (row.productPrice.length > 1) {
          row.listPrice = [{ text: row.productPrice[0].text, xpath: row.productPrice[0].xpath }];
          row.price = [{ text: row.productPrice[1].text, xpath: row.productPrice[0].xpath }];
        } else {
          row.price = [{ text: row.productPrice[0].text, xpath: row.productPrice[0].xpath }];
        }
      }
      if (row.videos) {
        const videosArray = row.videos.map((item) => {
          return item.text;
        });
        row.videos = [{ text: videosArray.join(' | '), xpath: row.videos[0].xpath }];
      }
      if (row.promotion) {
        clean(row.promotion);
        let text = '';
        row.promotion.forEach(item => {
          text = row.promotion.map(elm => elm.text).join(' ').replace(/•/g, '|| ');
        });
        row.promotion = [
          {
            text: text,
          },
        ];
      }
      if (row.description) {
        clean(row.description);
        const descriptionArr = row.description.map((item) => {
          return typeof (item.text) === 'string' ? item.text.replace(/\n/, ' ') : ' ';
        });
        row.description = [{ text: descriptionArr.join(' || '), xpath: row.description[0].xpath }];
      }
      if (row.additionalDescBulletInfo) {
        clean(row.additionalDescBulletInfo);
        const additionalDescBulletInfoArr = row.additionalDescBulletInfo.map((item) => {
          return item.text;
        });
        additionalDescBulletInfoArr[0] = '|| ' + additionalDescBulletInfoArr[0];
        row.additionalDescBulletInfo = [{ text: additionalDescBulletInfoArr.join(' || '), xpath: row.additionalDescBulletInfo[0].xpath }];
      }
      if (row.variants) {
        const variantArray = row.variants.map((item) => {
          return item.text;
        });
        row.variants = [{ text: variantArray.join(' | '), xpath: row.variants[0].xpath }];
      }
      if (row.warranty) {
        clean(row.warranty);
        const warrantyArr = row.warranty.map((item) => {
          const firstIteration = typeof (item.text) === 'string' ? item.text.replace(/\n \n \n/gm, ' | ') : ' | ';
          const secondIteration = firstIteration.replace(/\n \n/gm, ' | ');
          const thirdIteration = secondIteration.replace(/\n/gm, ' | ');
          return thirdIteration;
        });
        row.warranty = [{ text: warrantyArr.join(' || '), xpath: row.warranty[0].xpath }];
      }
    }
  }
  // data.forEach(obj =>
  //   obj.group.forEach(row =>
  //     Object.keys(row).forEach(header =>
  //       row[header].forEach(el => {
  //         el.text = clean(el.text);
  //       }),
  //     ),
  //   ),
  // );

  return data;
};

module.exports = { transform };
