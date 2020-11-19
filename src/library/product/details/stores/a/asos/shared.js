/**
 *
 * @param {ImportIO.Group[]} data
 * @returns {ImportIO.Group[]}
 */
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
  for (const { group } of data) {
    for (const row of group) {
      if (row.additionalDescBulletInfo) {
        let bulletString = '';
        row.additionalDescBulletInfo.forEach((element) => {
          bulletString += `|| ${element.text}`;
        })
        row.additionalDescBulletInfo = [{ text: bulletString }];
      }
      if (row.description) {
        let text = '';
        row.description.forEach((element) => {
          if (element.xpath.includes('li')) {
            text += ` || ${element.text}`;
          } else {
            text += ` ${element.text}`
          }
        })
        row.description = [{ text }];
      }
      if (row.name) {
        let text = '';
        if (row.quantity && row.color) {
          text = `${row.name[0].text} ${row.color[0].text} ${row.quantity[0].text}`
        } else if (row.color) {
          text = `${row.name[0].text} ${row.color[0].text}`
        } else {
          text = `${row.name[0].text}`
        }
        row.name = [{ text }];
      }
      if (row.variants) {
        let text = ''
        text = row.variants.map((element) => element.text.trim()).join(' | ');
        row.variants = [{ text }];
      }
    }
  };
  data.forEach(obj => obj.group.forEach(row => Object.keys(row).forEach(header => row[header].forEach(el => {
    el.text = clean(el.text);
  }))));
  return data;
};

module.exports = { cleanUp };
