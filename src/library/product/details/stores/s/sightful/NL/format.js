/**
 *
 * @param {ImportIO.Group[]} data
 * @returns {ImportIO.Group[]}
 */
const transform = (data) => {
  const cleanUp = (data, context) => {
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
  for (const { group } of data) {
    for (const row of group) {
      if (row.specifications) {
        var arrSpecs = [];
        row.specifications.forEach(item => {
          item.text = item.text.replace(/\n\s*\n/g, ' : ');
          arrSpecs.push(item.text);
        });
        row.specifications = [{ text: arrSpecs.join(' || ') }];
      }
      // if (row.price1 && row.price2) {
      //   row.price = [{ text: row.price1[0].text + row.price2[0].text }];
      //   if (row.price3) {
      //     row.price = [{ text: row.price[0].text + '.' + row.price3[0].text }];
      //     delete row.price3;
      //   }
      //   delete row.price1;
      //   delete row.price2;
      // }
      // if (row.additionalDescBulletInfo) {
      //   var arrBullet = [];
      //   row.additionalDescBulletInfo.forEach(item => {
      //     arrBullet.push(item.text);
      //   });
      //   row.additionalDescBulletInfo = [{ text: '|| ' + arrBullet.join(' || ') }];
      //   row.descriptionBullets = [{ text: arrBullet.length }];
      // }      
      // if (row.brandLink) {
      //   row.brandLink.forEach(item => {
      //     item.text = 'https://www.sams.com.mx' + item.text;
      //   });
      // }
      // if (row.image) {
      //   row.image.forEach(item => {
      //     item.text = item.text.replace('img_icon', 'img_large');
      //     item.text = item.text.replace('i.jpg', 'l.jpg');
      //   });
      // }
      // if (row.alternateImages) {
      //   row.alternateImages.forEach(item => {
      //     item.text = item.text.replace('img_icon', 'img_large');
      //     item.text = item.text.replace('i.jpg', 'l.jpg');
      //   });
      // }
    }
  }
  return cleanUp(data);
};

module.exports = { transform };