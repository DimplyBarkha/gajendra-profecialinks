/**
 *
 * @param {ImportIO.Group[]} data
 * @returns {ImportIO.Group[]}
 */
const transform = (data, context) => {
  for (const { group } of data) {
    for (const row of group) {
      if (row.manufacturerDescription) {
        let text = '';
        row.manufacturerDescription.forEach(item => {
          text = text + (text ? ' ' : '') + item.text;
        });
        row.manufacturerDescription = [{ text }];
      }
      if (row.specifications) {
        let text = '';
        row.specifications.forEach(item => {
          text = text + (text ? ' | ' : '') + item.text;
        });
        row.specifications = [{ text }];
      }
      if (row.listPrice) {
        row.listPrice.forEach(item => {
          item.text = item.text.replace('.', ',');
        });
      }
      if (row.price) {
        row.price.forEach(item => {
          item.text = item.text.replace('€', ',');
        });
      }
      if (row.description || row.additionalDescBulletInfo) {
        let text = '';
        if (row.description) {
          row.description.forEach(item => {
            text = text + (text ? ' ' : '') + item.text;
          });
        }
        let text2 = '';
        if (row.additionalDescBulletInfo) {
          row.additionalDescBulletInfo.forEach(item => {
            text2 = text2 + (text2 ? ' || ' : '') + item.text;
          });
          if (text !== '') {
            text = '|| ' + text2 + ' | ' + text;
          } else {
            text = '|| ' + text2;
          }
          text2 = '|| ' + text2;
          row.additionalDescBulletInfo = [{ text: text2 }];
        }
        row.description = [{ text }];
      }
      if (row.manufacturerImages) {
        let text = '';
        let temp = 0;
        row.manufacturerImages.forEach(item => {
          const val = item.text.search('https');
          if (val < 0) {
            const rep = item.text.replace(/(.+)\s200w/g, 'https:$1');
            item.text = rep;
            text = text + (text ? ' | ' : '') + item.text;
            temp++;
          }
        });
        if (temp > 0) {
          row.manufacturerImages = [{ text }];
        }
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
