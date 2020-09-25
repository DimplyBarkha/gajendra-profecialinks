/**
 *
 * @param {ImportIO.Group[]} data
 * @returns {ImportIO.Group[]}
 */
const transform = (data, context) => {
  for (const { group } of data) {
    for (const row of group) {
      if (row.aggregateRating) {
        let text = '';
        let rating;
        row.aggregateRating.forEach(item => {
          rating = item.raw.match(/\d+/g);
          rating = rating / 20;
          rating = rating.toString().replace('.', ',');
        });
        text = text + rating;
        row.aggregateRating = [{ text }];
      }

      if (row.specifications) {
        let text = '';
        row.specifications.forEach(item => {
          const value = item.text.replace(/(.+)\n+(.+)/g, '$1 $2');
          item.text = value;
          text = text + (text ? ' | ' : '') + item.text;
        });
        row.specifications = [{ text }];
      }

      if (row.promotion) {
        let text = '';
        row.promotion.forEach(item => {
          text = text + (text ? ' ' : '') + item.text;
        });
        row.promotion = [{ text }];
      }

      if (row.weightNet) {
        let text = '';
        row.weightNet.forEach(item => {
          text = item.text.replace(',', '.');
        });
        row.weightNet = [{ text }];
      }

      if (row.description || row.additionalDescBulletInfo) {
        let text = '';
        if (row.description) {
          row.description.forEach(item => {
            text = text + (text ? ' ' : '') + item.text;
          });
        }
        let text2 = '';
        if (row.additionalDescBulletInfo) {
          row.additionalDescBulletInfo.forEach(item => {
            text2 = text2 + (text2 ? ' || ' : '') + item.text;
          });
          if (text !== '') {
            text = text + ' || ' + text2;
          } else {
            text = '|| ' + text2;
          }
        }
        row.description = [{ text }];
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
