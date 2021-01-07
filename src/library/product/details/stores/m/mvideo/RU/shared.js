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
      if (row.aggregateRating) {
        let text = row.aggregateRating[0].text.replace(',', '.');
        row.aggregateRating = [{ text }]
      }
      if (row.aggregateRating2) {
        row.aggregateRating2 = [{ text: row.aggregateRating2[0].text.replace(',', '.') }]
      }
      if (row.nameExtended && row.quantity) {
        let text = `${row.nameExtended[0].text} ${row.quantity[0].text}`;
        row.nameExtended = [{ text: text.trim() }]
      }
      if (row.shippingDimensions) {
        let text = `${row.shippingDimensions[0].text} Bec`
        row.shippingDimensions = [{ text }]
      }
      if (row.description) {
        let text = row.description[0].text;
        row.description = [{ text }]
      }
      if (row.availabilityText) {
        let text = row.availabilityText[0].text.includes('OutOfStock') ? 'Out of Stock' : 'In Stock'
        row.availabilityText = [{ text }]
      }
    }
  }
  data.forEach(obj => obj.group.forEach(row => Object.keys(row).forEach(header => row[header].forEach(el => {
    el.text = clean(el.text);
  }))));
  return data;
};

module.exports = { cleanUp };
