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
    // eslint-disable-next-line no-control-regex
    .replace(/[\x00-\x1F]/g, '')
    .replace(/[\uD800-\uDBFF][\uDC00-\uDFFF]/g, ' ');

  for (const { group } of data) {
    let counter = 0;
    for (const row of group) {
      counter++;
      if (row.name) {
        row.rank = [{ text: counter }];
        row.rankOrganic = [{ text: counter }];
        Object.keys(row).forEach(header => row[header].forEach(el => {
          el.text = clean(el.text);
        }));
      }
      if (row.aggregateRating2) {
        const ratings = row.aggregateRating2.map((rating) => {
          return rating.text.replace('(', '').replace(')', '');
        });
        row.aggregateRating2 = [{ text: ratings[0] }];
      }
    }
  }
  return data;
};

module.exports = { transform };
