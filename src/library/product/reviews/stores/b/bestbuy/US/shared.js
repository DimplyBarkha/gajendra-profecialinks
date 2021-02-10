/**
 *
 * @param {ImportIO.Group[]} data
 * @returns {ImportIO.Group[]}
 */
const transform = (data, context) => {
  for (const { group } of data) {
    for (const row of group) {
      if (row.reviewDate) {
        row.reviewDate.forEach(item => {
          item.text = new Date(item.text);
          item.text = item.text.toISOString();
          if (item.text) {
            var formattedDate = item.text.split('.');
            if (formattedDate.length) {
              item.text = formattedDate[0];
            }
          }
        });
      }
      if (row.reviewRating) {
        if (row.reviewRating[0].text.includes('out of')) {
          const rating = row.reviewRating[0].text.split(' ');
          row.reviewRating[0].text = rating[1];
        }
      }
      if (!row.brandText && row.brandText1) {
        row.brandText = row.brandText1;
      }
      // if (row.gtin && row.gtin.length) {
      //   while (row.gtin[0].text.charAt(0) === '0') {
      //     row.gtin[0].text = row.gtin[0].text.substring(1);
      //   }
      // }
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
