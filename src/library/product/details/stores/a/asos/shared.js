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
        row.description = [{ text: text.trim() }];
      }
      if (row.variants) {
        let text = ''
        text = row.variants.map((element) => element.text.trim()).join(' | ');
        row.variants = [{ text }];
      }
      if (row.quantity) {
        if (row.quantity[0].text.includes('Not available')) {
          row.quantity[0].text = row.quantity[0].text.replace(/(Not available)/g, '');
          if (row.quantity[0].text.includes('-')) {
            row.quantity[0].text = row.quantity[0].text.slice(0, row.quantity[0].text.lastIndexOf('-'));
          }
        }
        row.quantity[0].text = row.quantity[0].text.trim();
      }
      if (row.nameExtended) {
        let text = '';
        if (row.quantity && row.color) {
          if (row.quantity[0].text != 'No Size') {
            text = `${row.nameExtended[0].text} ${row.color[0].text} ${row.quantity[0].text}`
          } else {
            text = `${row.nameExtended[0].text} ${row.color[0].text}`;
          }
        } else if (row.color) {
          text = `${row.nameExtended[0].text} ${row.color[0].text}`
        } else {
          text = `${row.nameExtended[0].text}`
        }
        row.nameExtended = [{ text }];
      }
      if (row.variantInformation) {
        let text = '';
        if (row.quantity) {
          if (row.quantity[0].text.includes('No Size')) {
            text = `${row.variantInformation[0].text}`;
          } else {
            text = `${row.variantInformation[0].text} ${row.quantity[0].text}`;
          }
        }
        row.variantInformation = [{ text }];
      }
      if (row.ratingCount) {
        if (row.ratingCount[0].text.includes('undefined')) {
          row.ratingCount[0].text = '0';
        }
      }
      if (row.aggregateRating) {
        if (row.aggregateRating[0].text.includes('undefined')) {
          row.aggregateRating[0].text = '';
        }
      }
      if (row.videos) {
        if (row.videos[0].text == "null") {
          row.videos[0].text = '';
        }
      }
    }
  };
  data.forEach(obj => obj.group.forEach(row => Object.keys(row).forEach(header => row[header].forEach(el => {
    el.text = clean(el.text);
  }))));
  return data;
};

module.exports = { cleanUp };
