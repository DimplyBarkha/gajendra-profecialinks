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
    .replace(/[\uD800-\uDBFF][\uDC00-\uDFFF]/g, ' ')
    .trim();
  for (const { group }
    of data) {
    for (const row of group) {
      if (row.description) {
        let text = '';
        row.description.forEach(item => {
          text = row.description.map(elm => elm.text).join(' ').replace(/●/g, '||');
        });
        row.description = [{ text }];
      }
      if (row.attributes) {
        row.attributes.forEach(elm => { elm.text = elm.text.replace(/\n/, ' : '); });
        row.specifications = row.attributes;
      }
      if (!row.packSize && row.packSize2) {
        row.packSize = row.packSize2;
      }
      Object.keys(row).forEach(header => row[header].forEach(el => {
        el.text = el.text ? clean(el.text) : el.text;
      }));
      if (row.description) {
        row.productDescriptionLength = [{ text: row.description[0].text.length }];
        row.productDescriptionWordCount = [{ text: row.description[0].text.split(' ').length }];
      }
    }
  }

  return data;
};

module.exports = { transform };
