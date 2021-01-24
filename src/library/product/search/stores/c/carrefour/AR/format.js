/**
*
* @param {ImportIO.Group[]} data
* @returns {ImportIO.Group[]}
*/
const transform = (data, context) => {
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

  const state = context.getState();
  let orgRankCounter = state.orgRankCounter || 0;
  let rankCounter = state.rankCounter || 0;
  for (const { group } of data) {
    for (const row of group) {
      rankCounter = rankCounter + 1;
      if (!row.sponsored) {
        orgRankCounter = orgRankCounter + 1;
        row.rankOrganic = [{ text: orgRankCounter }];
      }
      row.rank = [{ text: rankCounter }];
      context.setState({ rankCounter });
      context.setState({ orgRankCounter });
      Object.keys(row).forEach(header => row[header].forEach(el => {
        el.text = clean(el.text);
      }));

      if (row.listPrice) {
        row.listPrice.forEach(item => {
          item.text = item.text.replace('Antes', '').replace('.', '').trim();
          item.text = item.text.replace(',', '.');
        });
      }
      if (row.price) {
        row.price.forEach(item => {
          item.text = item.text.replace('.', '').trim();
          item.text = item.text.replace(',', '.');
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
    }
  }
  return data;
};

module.exports = { transform };