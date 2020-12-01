/**
 *
 * @param {ImportIO.Group[]} data
 * @returns {ImportIO.Group[]}
 */
const transform = (data) => {
  for (const { group }
    of data) {
    for (const row of group) {
      if (row.variants) {
        let text;
        row.variants.forEach(item => {
          if (item.text.includes(',')) {
            text = item.text.split(',').map(e => {
              return { text: e.trim() };
            });
          } else {
            text = [];
          }
        });
        row.variants = text;
      }

      if (row.category) {
        let text;
        row.category.forEach(item => {
          if (item.text.includes('/')) {
            text = item.text.split('/').map(e => {
              return { text: e.trim() };
            });
          } else {
            text = [];
          }
        });
        row.category = text;
      }

      if (row.price) {
        let text = '';
        row.price.forEach(item => {
          text = item.text.replace('.', ',');
        });
        row.price = [
          {
            text: text,
          },
        ];
      }

      if (row.aggregateRating) {
        let text = '';
        row.aggregateRating.forEach(item => {
          text = Number(item.text).toFixed(1).replace('.', ',');
        });
        row.aggregateRating = [
          {
            text: text,
          },
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
