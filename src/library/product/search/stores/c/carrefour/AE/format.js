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
      //.replace(/"\s{1,}/g, '"')
      //.replace(/\s{1,}"/g, '"')
      .replace(/^ +| +$|( )+/g, ' ')
      // eslint-disable-next-line no-control-regex
      .replace(/[\x00-\x1F]/g, '')
      .replace(/[\uD800-\uDBFF][\uDC00-\uDFFF]/g, ' ');
    data.forEach(obj => obj.group.forEach(row => Object.keys(row).forEach(header => row[header].forEach(el => {
      el.text = clean(el.text);
    }))));
    return data;
  };
  for (const {
      group
    } of data) {
    let rank = 1;
    for (const row of group) {
      if (row.productUrl) {
        row.productUrl.forEach(item => {
          item.text = "https://www.carrefouruae.com" + item.text;
        });
      }
      if (!row.price && row.listPrice) {
        row.price = row.listPrice;
        delete row.listPrice;
      }
      if (row.id) {
        row.id.forEach(item => {
          var myRegexp = /\/p\/(.+)/g;
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
      row.rank = row.rankOrganic = [{
        "text": rank
      }];
      rank++;
    }
  }
  return cleanUp(data);
};

module.exports = {
  transform
};