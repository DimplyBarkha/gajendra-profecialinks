/**
 *
 * @param {ImportIO.Group[]} data
 * @returns {ImportIO.Group[]}
 */
const transform = (data, context) => {
  const cleanUp = (data, context) => {
    const clean = text => text.toString()
      .replace(/\r\n|\r|\n/g, ' ')
      .replace(/&amp;nbsp;/g, ' ')
      .replace(/&amp;#160/g, ' ')
      .replace(/\u00A0/g, ' ')
      .replace(/\s{2,}/g, ' ')
    // .replace(/"\s{1,}/g, '"')
    // .replace(/\s{1,}"/g, '"')
      .replace(/^ +| +$|( )+/g, ' ')
    // eslint-disable-next-line no-control-regex
      .replace(/[\x00-\x1F]/g, '')
      .replace(/[\uD800-\uDBFF][\uDC00-\uDFFF]/g, ' ');
    data.forEach(obj => obj.group.forEach(row => Object.keys(row).forEach(header => row[header].forEach(el => {
      el.text = clean(el.text);
    }))));
    return data;
  };
  const state = context.getState();
  let orgRankCounter = state.orgRankCounter || 0;
  let rankCounter = state.rankCounter || 0;
  for (const { group } of data) {
    for (const row of group) {
      rankCounter += 1;
      row.rank = [{ text: rankCounter }];
      if (!row.sponsored) {
        orgRankCounter += 1;
        row.rankOrganic = [{ text: orgRankCounter }];
      }
      // if (row.productUrl) {
      //   row.productUrl.forEach(item => {
      //     item.text = 'https://www.mechta.kz' + item.text;
      //   });
      // }
      // if (row.thumbnail) {
      //   row.thumbnail.forEach(item => {
      //     item.text = 'https://www.mechta.kz' + item.text;
      //   });
      // }
      // row.rank = row.rankOrganic = [{ text: rank }];
      // rank++;
    }
  }
  context.setState({ rankCounter });
  context.setState({ orgRankCounter });
  return cleanUp(data);
};

module.exports = { transform };
