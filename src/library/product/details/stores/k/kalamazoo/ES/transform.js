/**
 *
 * @param {ImportIO.Group[]} data
 * @returns {ImportIO.Group[]}
 */
const transform = (data, context) => {
  for (const { group } of data) {
    for (const row of group) {
      if (row.alternateImages) {
        let text = '';
        row.alternateImages.forEach((item) => {
          text += (text ? ' | ' : '') + item.text.replace(/(.+)(THB)(.+)/, 'https:$1xnl$3');
        });
        row.alternateImages = [{ text }];
      }

      if (row.sku) {
        row.sku.forEach((item) => {
          item.text = item.text.replace(' ', '');
        });
      }

      if (row.variantId) {
        row.variantId.forEach((item) => {
          item.text = item.text.replace(' ', '');
        });
      }

      if (row.specifications) {
        let text = '';
        row.specifications.forEach(item => {
          text = text + (text ? ' | ' : '') + item.text;
        });
        row.specifications = [{ text }];
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
            text = '|| ' + text2 + ' | ' + text;
          } else {
            text = '|| ' + text2;
          }
        }
        row.description = [{ text }];
      }

      if (row.additionalDescBulletInfo) {
        let text = '';
        row.additionalDescBulletInfo.forEach(item => {
          text = text + (text ? ' || ' : '') + item.text;
        });
        text = '|| ' + text;
        row.additionalDescBulletInfo = [{ text }];
      }

      if (row.aggregateRating) {
        row.aggregateRating.forEach(item => {
          item.text = item.raw;
        });
      }

      if (row.color) {
        let text = '';
        row.color.forEach(item => {
          text = item.text.split(':')[1];
        });
        text = text.replace(' ', '');
        row.color = [{ text }];
      }

      if (row.mpc) {
        let text = '';
        row.mpc.forEach(item => {
          text = item.text.split(':')[1];
        });
        text = text.replace(' ', '');
        row.mpc = [{ text }];
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
