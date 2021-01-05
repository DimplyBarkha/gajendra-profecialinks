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
      if (row.specifications) {
        const text = row.specifications.map(elm => elm.text.trim().replace(/\n \n/, ' : ')).join(' || ');
        row.specifications = [{ text }];
      }

      if (row.aggregateRating) {
        let text = '';
        row.aggregateRating.forEach(item => {
          text = item.text.replace('.', ',');
        });
        row.aggregateRating = [{ text }];
      }
      if (row.price) {
        let text = '';
        row.price.forEach(item => {
          text = item.text.replace('.', ',');
        });
        row.price = [{ text }];
      }

      if (row.listPrice) {
        let text = '';
        row.listPrice.forEach(item => {
          text = item.text.replace('.', ',');
        });
        row.listPrice = [{ text }];
      }
      if (row.description) {
        let text = '';
        row.description.forEach(item => {
          text += item.text.replace(/-\s/g, ' || ').trim();
        });

        row.description = [{ text }];
      }

      Object.keys(row).forEach(header => row[header].forEach(el => {
        el.text = clean(el.text);
      }));
    }
  }
  return data;
};
module.exports = { transform };