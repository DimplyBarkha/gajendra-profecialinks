/**
 *
 * @param {ImportIO.Group[]} data
 * @returns {ImportIO.Group[]}
 */
const transform = (data) => {
  const cleanUp = (data, context) => {
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
  for (const { group } of data) {
    let rank = 1;
    for (const row of group) {
      if (row.productUrl) {
        row.productUrl.forEach(item => {
          item.text = 'https://www.sams.com.mx/' + item.text;
        });
      }
      if (row.thumbnail) {
        row.thumbnail.forEach(item => {
          item.text = item.text.replace('w_306', 'w_600');
        });
      }
      if (row.price) {
        if (row.price_decimal) {
          row.price.forEach(item => {
            item.text = item.text + ',' + row.price_decimal[0].text;
          });
          delete row.price_decimal;
        }
      }
      if (row.id) {
        row.id.forEach(item => {
          var myRegexp = /.+\/(.+)/g;
          var match = myRegexp.exec(item.text);
          if (match) {
            if (match.length) {
              item.text = match[1].trim();
            } else {
              delete row.id;
            }
          }
        });
      }
      row.rank = row.rankOrganic = [{ text: rank }];
      rank++;
    }
  }
  return cleanUp(data);
};

module.exports = { transform };
