/**
 *
 * @param {ImportIO.Group[]} data
 * @returns {ImportIO.Group[]}
 */
const transform = (data) => {
  const clean = (text) =>
    text
      .toString()
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
      var set = new Set();
      if (row.alternateImages) {
        row.alternateImages.forEach(function ({ text }) {
          if (!set.has(text) && !text.includes('_v01')) {
            set.add(text);
          }
        });
        row.alternateImages = [{ text: Array.from(set).join(' | ') + ' |' }];
      }
      if (row.listPrice) {
        row.listPrice = [
          { text: row.listPrice.map((item) => item.text + '₽').join(' || ') },
        ];
      }
      if (row.availabilityText) {
        row.availabilityText = [
          {
            text:
              row.availabilityText[0].text === 'available'
                ? 'In Stock'
                : 'Out of Stock	',
          },
        ];
      }
      if (row.price) {
        row.price = [
          {
            text: row.price
              .map((item) => item.text.replace(/(\s|\n)/gm, ''))
              .join(' || '),
          },
        ];
      }
      if (row.promotion) {
        row.promotion.map((item) => {
          item.text = item.text.replace(/\n \n /gm, '| ').replace(/\n/gm, '');
        });
      }
      if (row.warranty) {
        row.warranty = [
          {
            text: row.warranty
              .map((item) =>
                item.text.replace(/\n \n /gm, '| ').replace(/\n/gm, '')
              )
              .join(' | '),
          },
        ];
      }
      if (row.description) {
        row.description.map((item) => {
          item.text = item.text.replace('undefined', '');
        });
      }
    }
  }
  return data;
};

module.exports = { transform };
