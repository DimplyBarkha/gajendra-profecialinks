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
      if (row.id) {
        let id = row.id[0].text.trim();
        id = id.slice(id.lastIndexOf('-') + 1).split('.')[0];
        row.id = [{ text: id, xpath: row.id[0].xpath }];
      }
      if (row.productUrl) {
        const productUrl = row.productUrl.map((item) => {
          return 'https://www.conrad.de' + item.text;
        });
        row.productUrl = [{ text: productUrl[0], xpath: row.productUrl[0].xpath }];
      }
      if (row.aggregateRating2) {
        let aggregateRating = row.aggregateRating2[0].text.trim();
        aggregateRating = aggregateRating === '0' ? '0.0' : aggregateRating.split(' ')[0];
        row.aggregateRating2 = [{ text: aggregateRating.replace('.', ','), xpath: row.aggregateRating2[0].xpath }];
      }
      if (row.reviewCount) {
        const reviewCount = row.reviewCount[0].text === '0' ? '' : row.reviewCount[0].text;
        row.reviewCount = [{ text: reviewCount, xpath: row.reviewCount[0].xpath }];
      }
      if (row.thumbnail) {
        let image = row.thumbnail[0].text.trim();
        image = image.includes('?') ? image.substring(0, image.lastIndexOf('?')) : image;
        row.thumbnail = [{ text: image, xpath: row.thumbnail[0].xpath }];
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
