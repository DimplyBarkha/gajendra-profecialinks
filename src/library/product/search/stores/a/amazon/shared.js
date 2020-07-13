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
  let sponsRankCounter = state.sponsRankCounter || 0;
  for (const { group } of data) {
    for (const row of group) {
      if (row.badgeType) {
        let pantry = false;
        let prime = false;
        row.badgeType.forEach(badge => {
          if (badge.text.includes('rime')) {
            prime = true;
          }
          if (badge.text.includes('antry')) {
            pantry = true;
          }
        });
        row.pantry = [{
          text: pantry.toString(),
          type: 'BOOLEAN',
          value: pantry,
        }];
        row.prime = [{
          text: prime.toString(),
          type: 'BOOLEAN',
          value: prime,
        }];
      } else {
        row.pantry = [{
          text: 'false',
          type: 'BOOLEAN',
          value: false,
        }];
        row.prime = [{
          text: 'false',
          type: 'BOOLEAN',
          value: false,
        }];
      }
      if (row.aggregateRatingText) {
        row.aggregateRating = [
          {
            text: row.aggregateRatingText[0].text.replace(/ \D.*/, ''),
          },
        ];
      }
      rankCounter = rankCounter + 1;
      if (!row.sponsored) {
        orgRankCounter = orgRankCounter + 1;
        row.rank_organic = [{ text: orgRankCounter }];
      } else {
        sponsRankCounter = sponsRankCounter + 1;
        row.rank_sponsored = [{ text: sponsRankCounter }];
      }
      row.rank = [{ text: rankCounter }];
      context.setState({ rankCounter });
      context.setState({ orgRankCounter });
      context.setState({ sponsRankCounter });
      Object.keys(row).forEach(header => row[header].forEach(el => {
        el.text = clean(el.text);
      }));
    }
  }
  return data;
};

module.exports = { transform };
