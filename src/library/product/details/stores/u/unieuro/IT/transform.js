/**
 *
 * @param {ImportIO.Group[]} data
 * @returns {ImportIO.Group[]}
 */
const transform = (data, context) => {
  const clean = text => text.toString()
    .replace(/\r\n|\r|\n/g, ' ')
    .replace(/&amp;nbsp;|&nbsp;/g, ' ')
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
      if (row.jsonData) {
        const json = JSON.parse(row.jsonData[0].text);
        const brand = (json && json.brand && json.brand.name) || '';
        row.brandText = [{ text: brand }];
      }

      if (row.shippingDimensions) {
        const text = row.shippingDimensions.map(elm => elm.text.trim()).join(', ');
        row.shippingDimensions = [{ text }];
      }

      if (row.specifications) {
        const text = row.specifications.map(elm => elm.text.trim().replace(/\n/, ' - ')).join(', ');
        row.specifications = [{ text }];
      }

      if (row.aggregateRating) {
        const text = row.aggregateRating.map(elm => elm.text.trim().replace(/\./g, ','));
        row.aggregateRating = [{ text, type: 'NUMBER', locale: 'it-IT' }];
      }
      Object.keys(row).forEach(header => row[header].forEach(el => {
        el.text = clean(el.text);
      }));
    }
  }
  return data;
};
module.exports = { transform };
