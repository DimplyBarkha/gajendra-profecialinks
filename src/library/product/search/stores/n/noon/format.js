/**
 *
 * @param {ImportIO.Group[]} data
 * @returns {ImportIO.Group[]}
 */
// not in use, has rank issue.
// Issue: Return 1-50 rank and repeats for every page. Causing duplicate ranks.
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
  for (const { group }
    of data) {
    var rankTemp = 1;
    for (const row of group) {
      row.rank = row.rankOrganic = [{ text: rankTemp }];
      rankTemp = rankTemp + 1;
      if (row.productUrl) {
        row.productUrl.forEach(item => {
          item.text = 'https://www.noon.com' + item.text;
        });
      }
      if (row.id) {
        row.id.forEach(item => {
          var idArr = item.text.split('/p?');
          var idArr1 = idArr[0].split('/');
          item.text = idArr1[idArr1.length - 1];
        });
      }
    }
  }
  return cleanUp(data);
};

module.exports = { transform };
