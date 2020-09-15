
/**
 *
 * @param {ImportIO.Group[]} data
 * @returns {ImportIO.Group[]}
 */
const transform = (data) => {
  // Default transform function
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

  for (const { group } of data) {
    for (const row of group) {
      if (row.description) {
        let text = '';
        row.description.forEach(item => {
          text += item.text.replace(/\\n/g, ' ');
        });
        row.description = [
          {
            text: text,
          },
        ];
      }
      if (row.aggregateRating) {
        let text = '';
        let rating = '';
        row.aggregateRating.forEach(item => {
          text += item.text;
          rating = parseFloat(text).toFixed(2).replace('.', ',');
        });
        row.aggregateRating = [
          {
            text: rating,
          },
        ];
      }
      if (row.specifications) {
        let text = '';
        row.specifications.forEach(item => {
          text = row.specifications.map(elm => elm.text).join(' ').replace(/●/g, '||');
        });
        row.specifications = [{ text }];
      }
      if (row.productOtherInformation) {
        let text = '';
        row.productOtherInformation.forEach(item => {
          text = row.productOtherInformation.map(elm => elm.text).join(' | ').replace(/●/g, '||');
        });
        row.productOtherInformation = [{ text }];
      }
    }
  }
  return data;
};

module.exports = { transform };
