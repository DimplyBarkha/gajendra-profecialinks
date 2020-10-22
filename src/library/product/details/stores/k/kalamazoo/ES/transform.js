/**
 *
 * @param {ImportIO.Group[]} data
 * @returns {ImportIO.Group[]}
 */
const transform = (data, context) => {
  for (const { group } of data) {
    for (const row of group) {
      if (!row.sku) {
        const text = '';
        row.availabilityText = [{ text }];
      }

      if (row.color) {
        let text = row.color[0].text;
        const result = text.search(':');
        if (result === -1) {
          row.color = [{ text }];
        } else {
          text = text.split(':')[1].replace(' ', '');
          row.color = [{ text }];
        }
      }

      if (row.price) {
        let text = row.price[0].text.split('€');
        text = text[0] + '€';
        row.price = [{ text }];
      }

      if (row.specifications) {
        let text = '';
        row.specifications.forEach((item) => {
          text = text + (text ? ' | ' : '') + item.text;
        });
        text = text.replace(/:/g, ' : ');
        row.specifications = [{ text }];
      }

      if (row.description || row.additionalDescBulletInfo) {
        let text = '';
        if (row.description) {
          row.description.forEach((item) => {
            text = text + (text ? ' ' : '') + item.text;
          });
        }
        let text2 = '';
        if (row.additionalDescBulletInfo) {
          row.additionalDescBulletInfo.forEach((item) => {
            text2 = text2 + (text2 ? ' || ' : '') + item.text;
          });
          if (text !== '') {
            text = '|| ' + text2 + ' | ' + text;
          } else {
            text = '|| ' + text2;
          }
        }
        row.description = [{ text }];
      }

      if (row.additionalDescBulletInfo) {
        let text = '';
        row.additionalDescBulletInfo.forEach((item) => {
          text = text + (text ? ' || ' : '') + item.text;
        });
        text = '|| ' + text;
        row.additionalDescBulletInfo = [{ text }];
      }
    }
  }

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
  data.forEach((obj) =>
    obj.group.forEach((row) =>
      Object.keys(row).forEach((header) =>
        row[header].forEach((el) => {
          el.text = clean(el.text);
        }),
      ),
    ),
  );
  return data;
};

module.exports = { transform };
