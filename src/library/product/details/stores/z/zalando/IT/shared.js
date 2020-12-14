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
      if (row.quantity) {
        row.quantity[0].text = row.quantity[0].text.includes('undefined') ? '' : row.quantity[0].text
      }
      if (row.price) {
        row.price[0].text = row.price[0].text.replace('.', ',');
      }
      if (row.aggregateRating) {
        row.aggregateRating[0].text = row.aggregateRating[0].text.replace('.', ',');
      }
      if (row.nameExtended && row.quantity && row.color) {
        let name = `${row.nameExtended[0].text} ${row.quantity[0].text} ${row.color[0].text}`;
        row.nameExtended = [{ text: name.trim() }]
      }
      if (row.listPrice) {
        if (row.listPrice[0].text.includes('IVA inclusa')) {
          row.listPrice[0].text = '';
        }
      }
      if (row.variants) {
        let text = row.variants.map(element => element.text.trim()).join(' | ');
        row.variants = [{ text: text.trim() }]
      }
      if (row.variantInformation) {
        let text = ``
        if (row.color && row.quantity) {
          text = `${row.color[0].text} ${row.quantity[0].text}`
        }
        row.variantInformation = [{ text: text.trim() }]
      }
      if (row.brandText && row.nameExtended) {
        let text = `${row.brandText[0].text} ${row.nameExtended[0].text}`
        row.nameExtended = [{ text: text.trim() }]
      }
    }
  }
  data.forEach(obj => obj.group.forEach(row => Object.keys(row).forEach(header => row[header].forEach(el => {
    el.text = clean(el.text);
  }))));
  return data;
};

module.exports = { cleanUp };
