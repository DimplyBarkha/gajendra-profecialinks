/* eslint-disable camelcase */
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
  var p_count = 1;
  for (const { group } of data) {
    for (const row of group) {
      rankCounter += 1;
      // eslint-disable-next-line no-unused-vars
      const skyIdStr = '';
      if (!row.sponsored) {
        orgRankCounter += 1;
        row.rankOrganic = [{ text: orgRankCounter }];
      }
      row.rank = [{ text: rankCounter }];
      Object.keys(row).forEach(header => row[header].forEach(el => {
        el.text = clean(el.text);
      }));
      if (row.id) {
        // row.rankOrganic = [{'text':p_count}];
        // row.rank = [{'text':p_count}];
        p_count = p_count + 1;
      }
      if (row.id) {
        row.id.forEach(item => {
          item.text = item.text.substr(0, item.text.lastIndexOf('.html'));
          var path_arr = item.text.split('-');
          path_arr = path_arr.reverse();
          item.text = path_arr[1] + '-' + path_arr[0];
        });
      }
      if (row.productUrl) {
        row.productUrl.forEach(item => {
          item.text = 'https://www.zalando.fr' + item.text;
        });
      }
    }
  }
  context.setState({ rankCounter });
  context.setState({ orgRankCounter });
  context.setState({ productCodes });
  console.log(productCodes);
  return data;
};
module.exports = { transform };