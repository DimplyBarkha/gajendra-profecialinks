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
        let text = '';
        row.additionalDescBulletInfo.forEach((elem) => {
          text += `|| ${elem.text}`;
        })
        row.additionalDescBulletInfo = [{ text }];
      }
      if (row.specifications) {
        let text = '';
        text = row.specifications.map(elem => elem.text.trim()).join(' || ')
        row.specifications = [{ text }];
      }
      if (row.description) {
        let text = '';
        row.description.forEach((element) => {
          if (element.xpath.includes('li')) {
            text += `|| ${element.text}`;
          } else {
            text += ` ${element.text}`;
          }
        })
        row.description = [{ text: text.trim() }];
      }
      if (row.manufacturerDescription) {
        let text = '';
        row.manufacturerDescription.forEach((element) => {
          text += ` ${element.text}`;
        })
        row.manufacturerDescription = [{ text: text.trim() }];
      }
      if (row.manufacturerImages) {
        row.manufacturerImages.forEach((element) => {
          if (element.text.includes('https://www.bezokularow.pl')) {
            element.text = element.text;
          } else {
            element.text = `https://www.bezokularow.pl/${element.text}`;
          }
        })
      }
    }
  }
  data.forEach(obj => obj.group.forEach(row => Object.keys(row).forEach(header => row[header].forEach(el => {
    el.text = clean(el.text);
  }))));
  return data;
};

module.exports = { cleanUp };
