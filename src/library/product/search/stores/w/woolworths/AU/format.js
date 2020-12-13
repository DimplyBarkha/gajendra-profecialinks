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
      row.rank = [{ text: rankCounter }];
      Object.keys(row).forEach(header => row[header].forEach(el => {
        el.text = clean(el.text);
      }));
      if (row.aggregateRating) {
        let counter = 0;
        row.aggregateRating.forEach(item => {
          if (item.text.trim().includes('is-filled')) {
            counter = counter + 1;
          } else if (item.text.trim().includes('is-half')) {
            counter = counter + 0.5;
          }
        });
        row.aggregateRating = [{ text: counter.toFixed(1), xpath: row.aggregateRating[0].xpath }];
      }
      if (row.reviewCount) {
        row.reviewCount.forEach(item => {
          item.text = item.text.replace(/[{()}]/g, '');
        });
      }
      if (row.price) {
        const info = [];
        row.price.forEach(item => {
          info.push(item.text);
        });
        row.price = [{ text: info.join(''), xpath: row.price[0].xpath }];
      }
      if (row.thumbnail) {
        row.thumbnail.forEach(item => {
          item.text = item.text.replace('/medium/', '/large/');
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
