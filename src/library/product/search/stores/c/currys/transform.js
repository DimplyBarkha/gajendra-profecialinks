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
      rankCounter += 1;
      if (!row.sponsored) {
        orgRankCounter += 1;
        row.rankOrganic = [{ text: orgRankCounter }];
      }

      if (row.aggregateRating) {
        row.aggregateRating.forEach(item => {
          const num = Number(item.text);
          const normalizedRating = num / 2;
          item.text = normalizedRating;
        });
      }

      if (!row.aggregateRating && row.aggregateRatingText) {
        row.aggregateRating2 = [];
        row.aggregateRatingText.forEach(item => {
          const num = Number(item.text);
          const normalizedRating = num / 2;
          item.text = normalizedRating;
          row.aggregateRating2.push(item);
        });
      }

      if (row.reviewCount) {
        row.reviewCount.forEach(item => {
          if (item.text.match(/\d+/)) item.text = item.text.match(/\d+/)[0];
        });
      }

      row.rank = [{ text: rankCounter }];
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
