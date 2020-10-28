/**
 *
 * @param {ImportIO.Group[]} data
 * @returns {ImportIO.Group[]}
 */
const transform = (data) => {
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
    var rankIndex = 1;
    for (const row of group) {
      if (row.brandText && row.brandText.length) {
        let str = row.brandText[0].text;
        str = str.substr(str.lastIndexOf('/') + 1);
        row.brandText[0].text = str.length ? str.split('-')[0] : 'Brand Not Found';
      }
      if (row.price && row.price.length) {
        let str = row.price[0].text;
        str = str.replace('٫', '.').replace('٬', '');
        row.price[0].text = str;
      }
      if (row.rankOrganic) {
        row.rankOrganic[0].text = rankIndex;
      }
      rankIndex++;
      Object.keys(row).forEach(header => row[header].forEach(el => {
        el.text = clean(el.text);
      }));
    }
  }
  return data;
};

module.exports = { transform };
