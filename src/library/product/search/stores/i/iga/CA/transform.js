
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
      if (row.id && row.id[0] && row.id[0].text) {
        if (row.id[0].text.includes('ProductId')) {
          const productInfo = JSON.parse(row.id[0].text.replace(/'/g, '"'));
          row.id[0].text = productInfo.ProductId;
        }
      }
      if (row.name && (row.name[0] && row.name[1])) {
        if (row.name[0].text && row.name[1].text) {
          row.name = [
            {
              text: row.name[0].text + ' ' + row.name[1].text,
            }];
        }
      }
      if (row.price && row.price[0].text.includes(',')) {
        row.price[0].text = row.price[0].text.replace(',', '.');
      }
    }
  }
  return data;
};

module.exports = { transform };
