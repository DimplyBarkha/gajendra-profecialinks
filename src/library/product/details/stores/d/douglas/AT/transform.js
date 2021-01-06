/**
 *
 * @param {ImportIO.Group[]} data
 * @returns {ImportIO.Group[]}
 */
const cleanUp = (data, context) => {
  for (const { group } of data) {
    for (const row of group) {
      if (row.aggregateRating) {
        row.aggregateRating.forEach(item => {
          item.text = item.text.replace('.', ',');
        });
      }
      if (row.nameExtended) {
        let text = '';
        row.nameExtended.forEach(item => {
          text = text + (text ? ' ' : '') + item.text;
        });
        if (row.variantInformation) {
          text = text + ' ' + row.variantInformation[0].text;
        }
        row.nameExtended = [{ text }];
      }
      if (row.name) {
        let text = '';
        row.name.forEach(item => {
          text = text + (text ? ' ' : '') + item.text;
        });
        row.name = [{ text }];
      }
      if (row.variantInformation) {
        let text = '';
        if (row.name && row.sku) {
          text = row.name[0].text + ' ' + row.variantInformation[0].text + ' ' + row.sku[0].text;
        } else {
          text = row.variantInformation[0].text;
        }
        row.variantInformation = [{ text }];
      }
    }
  }
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
  data.forEach(obj => obj.group.forEach(row => Object.keys(row).forEach(header => row[header].forEach(el => {
    el.text = clean(el.text);
  }))));
  return data;
};

module.exports = { cleanUp };
