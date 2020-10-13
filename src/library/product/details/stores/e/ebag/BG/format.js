// @ts-nocheck
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
    for (const row of group) {
      if (row.alternateImages) {
        row.alternateImages.forEach(item => {
          item.text = item.text.replace(/.{3}$/, '800');
        });
      }
      if (row.directions) {
        row.directions.forEach(item => {
          item.text = item.text.replace(/Начин на приготвяне:/, '').trim();
        });
      }
      if (row.countryOfOrigin) {
        row.countryOfOrigin[0].text = row.countryOfOrigin[0].text.includes('Страна на произход') ? row.countryOfOrigin[0].text.replace(/Страна на произход: /, '') : row.countryOfOrigin[0].text.replace(/Произход: /, '');
      }
      if (row.description) {
        row.description[0].text = row.description[0].text.replace(/\n \n/g, ' || ');
      }
    }
  }
  data.forEach(obj => obj.group.forEach(row => Object.keys(row).forEach(header => row[header].forEach(el => {
    el.text = clean(el.text);
  }))));
  return data;
};

module.exports = { transform };
