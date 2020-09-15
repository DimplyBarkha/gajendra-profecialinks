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
      if (row.price) {
        const priceInEur = row.price[0].text.replace(/\./, ',')
        row.price[0].text = row.currencytoFetch ? row.currencytoFetch[0].text + priceInEur : '€' + priceInEur
      }
      if (row.aggregateRating2) {
        let aggregateRating = 0
        row.aggregateRating2.forEach(item => {
          aggregateRating += item.text.includes('off') ? 0 : item.text.includes('half-star') ? 0.5 :
            item.text.includes('icon-star') ? 1 : 0
        })
        row.aggregateRating2 = [{ text: ('' + aggregateRating).replace(/\./, ',') }]
      }
      if (row.ratingCount && row.ratingCount[0].text === '#VALUE!') {
        row.ratingCount = [{ text: 0 }]
      }
      if (row.reviewCount && row.reviewCount[0].text === '#VALUE!') {
        row.reviewCount = [{ text: 0 }]
      }
      rankCounter += 1;
      if (!row.sponsored) {
        orgRankCounter += 1;
        row.rankOrganic = [{ text: orgRankCounter }];
      }
      row.rank = [{ text: rankCounter }];
    }
  }
  context.setState({ rankCounter });
  context.setState({ orgRankCounter });
  data.forEach(obj => obj.group.forEach(row => Object.keys(row).forEach(header => row[header].forEach(el => {
    el.text = clean(el.text);
  }))));
  return data;
};

module.exports = { transform };
