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
        clean(row.rankOrganic = [{ text: orgRankCounter }]);
      }
      clean(row.rank = [{ text: rankCounter }]);
      if (row.aggregateRating) {
        const aggregateRatingArr = row.aggregateRating.map((item) => {
          return typeof (item.text) === 'string' ? item.text.replace('.', ',') : '';
        });
        clean(row.aggregateRating = [{ text: aggregateRatingArr.join(''), xpath: row.aggregateRating[0].xpath }]);
        clean(row.aggregateRating2 = [{ text: aggregateRatingArr.join(''), xpath: row.aggregateRating[0].xpath }]);
        clean(row.aggregateRatingText = [{ text: aggregateRatingArr.join(''), xpath: row.aggregateRating[0].xpath }]);
      }
      if (row.price) {
        const priceArr = row.price.map((item) => {
          return typeof (item.text) === 'string' ? item.text.replace('.', ',') : '';
        });
        clean(row.price = [{ text: priceArr.join(''), xpath: row.price[0].xpath }]);
      }
    }
  }
  context.setState({ rankCounter });
  context.setState({ orgRankCounter });
  return data;
};
module.exports = { transform };
