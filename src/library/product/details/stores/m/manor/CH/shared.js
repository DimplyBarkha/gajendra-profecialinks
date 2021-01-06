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
        let text = row.quantity[0].text.replace(':', '').trim();
        row.quantity = [{ text: text.trim() }]
      }
      if (row.manufacturerDescription) {
        let text = row.manufacturerDescription.map(element => element.text.trim()).join(' ');
        row.manufacturerDescription = [{ text: text.trim() }]
      }
      if (row.nameExtended && row.quantity && row.color) {
        let text = `${row.nameExtended[0].text} ${row.quantity[0].text} ${row.color[0].text}`
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
