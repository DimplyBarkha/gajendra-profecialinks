/**
 *
 * @param {ImportIO.Group[]} data
 * @returns {ImportIO.Group[]}
 */
const transform = (data, context) => {
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
      if (row.description) {
        const text = row.description[0].text.replace(/•\s*/g, ' || ').replace(/&nbsp;/g, ' ').replace(/<li>/g, '<li> || ').replace(/(<([^>]+)>)/ig, '').replace(/\.{2,}/g, '').trim();
        row.description = [{ text }];
      }
      if (row.additionalDescBulletInfo) {
        row.additionalDescBulletInfo.forEach(elm => { elm.text = elm.text.replace(/•/g, '').trim(); });
      }
      if (row.specifications) {
        const text = row.specifications.map(elm => elm.text.trim().replace(/\n/, ' : ')).join(' | ');
        row.specifications = [{ text }];
      }
      Object.keys(row).forEach(header => row[header].forEach(el => {
        el.text = clean(el.text);
      }));
    }
  }
  return data;
};

module.exports = { transform };
