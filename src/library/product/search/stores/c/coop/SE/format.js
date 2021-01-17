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
  let rank = 1;
  for (const { group } of data) {
    for (const row of group) {
      if (row.thumbnail) {
        row.thumbnail.forEach(item => {
          if (item.text.indexOf('http') != 0) {
            item.text = 'https:' + item.text;
          }
          item.text = item.text.replace('h_120', 'h_330');
          item.text = item.text.replace('w_120', 'w_330');
        });
      }
      if (row.productUrl) {
        row.productUrl.forEach(item => {
          item.text = 'https://www.coop.se' + item.text;
        });
      }
      if (row.price) {
        row.price.forEach(item => {
          item.text = item.text.replace(':', '.');
        });
      }
      if (row.id) {
        row.id.forEach(item => {
          var myRegexp = /.+-(.+)/g;
          var match = myRegexp.exec(item.text);
          if (match) {
            item.text = match[1].trim();
          } else {
            delete row.id;
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
