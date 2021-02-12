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
  for (const { group }
    of data) {
    for (const row of group) {
      if (row.additionalDescBulletInfo) {
        let text = '';
        row.additionalDescBulletInfo.forEach(item => {
          text += `|| ${item.text.trim()}`;
        });
        row.additionalDescBulletInfo = [{
          text: text,
        }];
      }
      if (row.manufacturerImages) {
        row.manufacturerImages.forEach(item => {
          if (!(item.text.includes('https:') || item.text.includes('http:'))) {
            item.text = item.text ? 'https:' + item.text : '';
          }
          else if(item.text.includes('200w')){
            const imgUrl = item.text.split(' 200w, ')[0];
            if (!(item.text.includes('http'))) {
              item.text = 'https:' + imgUrl;
            }
          }
        });
      }

      if (row.inTheBoxUrl && row.inTheBoxUrl[0]) {
        row.inTheBoxUrl.forEach(item => {
          if (item.text.includes(' 200w')) {
            const imgUrl = item.text.split(' 200w, ')[0];
            if (!(item.text.includes('http'))) {
              item.text = 'https:' + imgUrl;
            }
          }
        });
      }
    }
  }
  data.forEach(obj => obj.group.forEach(row => Object.keys(row).forEach(header => row[header].forEach(el => {
    el.text = clean(el.text);
  }))));
  return data;
};

module.exports = { transform };