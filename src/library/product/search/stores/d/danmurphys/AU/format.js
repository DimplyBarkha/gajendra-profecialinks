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
          item.text = 'https://www.danmurphys.com.au' + item.text;
        });
        const start = row.productUrl[0].text.indexOf('/product/');
        row['id'] = [{ text: row.productUrl[0].text.slice(start, row.productUrl[0].text.length).replace('/product/', '') }];
        const end = row.id[0].text.indexOf('/');
        row.id[0].text = row.id[0].text.slice(0, end);
      }
      if (row.ratingCount) row.ratingCount[0].text = row.ratingCount[0].text.replace(/[^\d.-]/g, '');
      if (row.price) {
        row.price[0].text = row.price[0].text.replace(/[^\d.-]/g, '');
        const start = row.price[0].text.indexOf('-');
        if (start !== -1) row.price[0].text = row.price[0].text.slice(start + 1, row.price[0].text.length);
      }
      row.rank = row.rankOrganic = [{ 'text': rank }];
      rank++;
    }
  }
  return cleanUp(data);
};
module.exports = { transform };
