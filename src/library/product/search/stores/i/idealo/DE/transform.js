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
      if (row.aggregateRating2 && row.aggregateRating2[0]) {
        const text = row.aggregateRating2[0].text.replace(/(.+)--(\d+)/g, '$2');
        const finalText = Number(text) / 20;
        row.aggregateRating2[0].text = finalText.toString().replace('.', ',');
      }
      if (row.thumbnail && row.thumbnail[0]) {
        const image = row.thumbnail[0].text;
        if (!image.includes('http')) {
          row.thumbnail[0].text = image.replace(/(.+)/g, 'https:$1');
        }
      }
      rankCounter += 1;
      if (!row.sponsored) {
        orgRankCounter += 1;
        row.rankOrganic = [{ text: orgRankCounter }];
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
