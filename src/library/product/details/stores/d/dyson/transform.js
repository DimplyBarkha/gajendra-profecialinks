
/**
 *
 * @param {ImportIO.Group[]} data
 * @returns {ImportIO.Group[]}
 */
const transform = (data) => {
  for (const { group } of data) {
    for (const row of group) {
      if (row.description) {
        let text = '';
        for (let i = 0; i < row.description.length; i++) {
          text += ' ' + row.description[i].text;
        }
        row.description = [{
          text: text,
        },
        ];
      }

      if (row.nameExtended) {
        if (!row.nameExtended[0].text.match(/[dD]yson/g)) {
          if (row.brandText) {
            row.nameExtended = [
              { text: row.brandText[0].text + ' - ' + row.name[0].text },
            ];
          }
        }
      }
      if (row.availabilityText && row.availabilityText[0]) {
        row.availabilityText = [
          { text: row.availabilityText[0].text ? 'In Stock' : 'Out of Stock' },
        ];
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
