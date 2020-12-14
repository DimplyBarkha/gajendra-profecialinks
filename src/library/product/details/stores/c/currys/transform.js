/**
 *
 * @param {ImportIO.Group[]} data
 * @returns {ImportIO.Group[]}
 */
const transform = (data) => {
  for (const { group } of data) {
    for (const row of group) {
      if (row.promotion) {
        let text = '';
        row.promotion.forEach(item => {
          text += text ? ` || ${item.text}` : item.text;
        });
        row.promotion = [
          {
            text: text,
          },
        ];
      }

      if (row.manufacturerImages) {
        let text = '';
        row.manufacturerImages.forEach(item => {
          let val = item.text.match('http');
          if (!val) {
            val = item.text.match('200w');
            if (val) {
              text = item.text.replace(/^(.+)\s200w/g, 'https:$1');
            } else {
              text = item.text.replace(/(.+)/g, 'https:$1');
            }
            const arr = text.split(',');
            text = arr[0];
            item.text = text;
          }
        });
      }

      if (row.inTheBoxUrl && row.inTheBoxUrl[0]) {
        const images = Array.from(new Set(row.inTheBoxUrl.map(elm => elm.text.trim())));
        row.inTheBoxUrl = images.map(text => ({ text }));
      }

      if (row.coupon) {
        let text = '';
        row.coupon.forEach(item => {
          text += text ? ` || ${item.text}` : item.text;
        });
        row.coupon = [{ text }];
      }

      if (row.variantCount) {
        row.variantCount.forEach(item => {
          if (item.text === '-1') item.text = '0';
        });
      }
      if (row.additionalDescBulletInfo) {
        var arrBullets = [];
        row.additionalDescBulletInfo.forEach(item => {
          arrBullets.push(item.text);
        });
        row.additionalDescBulletInfo = [{ text: '|| ' + arrBullets.join(' || ') }];
      }
      if (row.category && row.category.length) {
        row.category = row.category.slice(1);
        row.category.pop();
      }
      if (row.manufacturerImages) {
        const images = Array.from(new Set(row.manufacturerImages.map(elm => elm.text.trim())));
        row.manufacturerImages = images.map(text => ({ text }));
      }

      if (row.alternateImages && row.alternateImages.length) {
        row.alternateImages = row.alternateImages.slice(1);
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
