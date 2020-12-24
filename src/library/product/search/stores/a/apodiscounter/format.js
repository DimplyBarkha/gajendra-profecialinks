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
      rankCounter += 1;
      if (!row.sponsored) {
        orgRankCounter += 1;
        row.rankOrganic = [{ text: orgRankCounter }];
      }
      row.rank = [{ text: rankCounter }];
      Object.keys(row).forEach(header => row[header].forEach(el => {
        el.text = clean(el.text);
      }));

      if (row.price) {
        const text = row.price[0].text;
        row.price[0].text = String(text).replace('*', '');
      }
      if (row.reviewCount) {
        const text = row.reviewCount[0].text;
        row.reviewCount[0].text = String(text).replace('(', '').replace(')', '').trim();
      }
      if (row.aggregateRating2) {
        const text = row.aggregateRating2[0].text;
        row.aggregateRating2[0].text = String((parseFloat(String(row.aggregateRating2[0].text).trim()) / 110) * 5 > 5 ? 5 : ((parseFloat(String(row.aggregateRating2[0].text).trim()) / 110) * 5).toFixed(2)).replace('.', ',');
      }
      if (row.thumbnail) {
        row.thumbnail[0].text = row.thumbnail[0].text.replace(/thumbnail_images/, 'info_images');
      }
    }
  }
  context.setState({ rankCounter });
  context.setState({ orgRankCounter });
  return data;
};
module.exports = { transform };
