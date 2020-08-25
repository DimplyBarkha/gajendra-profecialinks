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
    .trim()
  // eslint-disable-next-line no-control-regex
    .replace(/[\x00-\x1F]/g, '')
    .replace(/[\uD800-\uDBFF][\uDC00-\uDFFF]/g, ' ');
  for (const { group } of data) {
    for (const row of group) {
      if (row.countryOfOrigin) {
        if (row.countryOfOrigin[0].text.match(/Made in the/)) {
          row.countryOfOrigin = [
            {
              text: row.countryOfOrigin[0].text.replace(/Made in the\s*/, ''),
            },
          ];
        }
      }
      if (row.allergyAdvice) {
        const text = row.allergyAdvice.map(elm => elm.text).join(' ');
        row.allergyAdvice = [
          {
            text,
          },
        ];
      }
      if (row.promotion) {
        const text = row.promotion.map(elm => elm.text).join(' ');
        row.promotion = [
          {
            text,
          },
        ];
      }
      Object.keys(row).forEach(header => row[header].forEach(el => {
        el.text = clean(el.text);
      }));
    }
  }
  return data;
};
module.exports = { transform };
