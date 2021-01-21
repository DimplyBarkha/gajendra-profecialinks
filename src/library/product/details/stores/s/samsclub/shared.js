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
      if (row.specifications) {
        let text = '';
        row.specifications.forEach((element) => {
          if (element.xpath.includes('li')) {
            text += ` ${element.text} ||`;
          } else {
            text += ` ${element.text} ||`;
          }
        });
        row.specifications = [{ text: text.trim() }];
      }
      if (row.description) {
        let text = '';
        row.description.forEach((element) => {
          if (element.xpath.includes('li')) {
            text += `|| ${element.text}`;
          } else {
            text += ` ${element.text}`;
          }
        });
        row.description = [{ text: text.trim() }];
      }
      if (row.additionalDescBulletInfo) {
        let text = '';
        row.additionalDescBulletInfo.forEach((element) => {
          if (element.xpath.includes('li')) {
            text += `|| ${element.text}`;
          }
        });
        row.additionalDescBulletInfo = [{ text: text.trim() }];
      }
    }
  }
  data.forEach(obj => obj.group.forEach(row => Object.keys(row).forEach(header => row[header].forEach(el => {
    el.text = clean(el.text);
  }))));
  return data;
};

module.exports = { cleanUp };
