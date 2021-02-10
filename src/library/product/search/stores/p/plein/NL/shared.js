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
  const productCodes = state.productCodes || [];
  for (const { group } of data) {
    for (const row of group) {
      if (row.name) {
        row.name.forEach(item => {
          item.text = item.text.replace(/\s\n/g, '').trim();
        });
      }
      if ((!row.id || !row.id.length) && row.id1) {
        console.log('id1', row.id1);
        row.id = row.id1;
        console.log('id', row.id);
      }
      if (row.name) {
        row.name.forEach(item => {
          item.text = item.text.replace(/\s\n/g, '').trim();
        });
      }
      if (row.reviewCount) {
        row.reviewCount.forEach(item => {
          var tmp = item.text.replace('(', '');
          item.text = tmp.replace(')', '');
          item.text = parseInt(item.text);
        });
      }
      if (row.ratingCount) {
        row.ratingCount = [{ text: row.ratingCount.length, xpath: row.ratingCount[0].xpath }];
      }
      if (row.id) {
        rankCounter += 1;
        if (!row.sponsored) {
          orgRankCounter += 1;
          row.rankOrganic = [{ text: orgRankCounter }];
        }
        row.rank = [{ text: rankCounter }];
      }
      Object.keys(row).forEach(header => row[header].forEach(el => {
        el.text = clean(el.text);
      }));
    }
  }
  context.setState({ rankCounter });
  context.setState({ orgRankCounter });
  context.setState({ productCodes });
  console.log(productCodes);
  return data;
};
module.exports = { transform };