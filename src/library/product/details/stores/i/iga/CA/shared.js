/**
 *
 * @param {ImportIO.Group[]} data
 * @returns {ImportIO.Group[]}
 */
const transform = (data) => {
  for (const { group } of data) {
    for (const row of group) {
      if (row.availabilityText) {
        row.availabilityText[0].text = row.availabilityText[0].text === 'Out of Stock' ? row.availabilityText[0].text : 'In Stock';
      }
      if (row.nameExtended) {
        var nText = '';
        row.nameExtended.forEach((ele) => {
          nText += ' ' + ele.text;
        });
        row.nameExtended = [{
          text: nText.trim(),
        }];
      }
      if (row.nameExtended) {
        row.name = [{
          text: row.nameExtended[0].text,
        }];
      }
      if (row.sku && row.variantId) {
        row.sku[0].text = row.variantId[0].text.replace('_', '');
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

module.exports = { transform };
